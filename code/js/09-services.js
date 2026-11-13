// ══════════════════════════════════════════════════════════════════════════════
//  WORKSHOP SERVICES  (#services section, code/css/12-services.css)
// ══════════════════════════════════════════════════════════════════════════════
//  German Expert doesn't only sell the part — its mechanics fit it. This renders
//  the "our mechanics service your car" section: a grid of service cards, each
//  with an icon (or photo), a price, a rough duration and a WhatsApp booking
//  button. Every card is a wa.me link, exactly like the parts catalog's Enquire
//  button — nothing here writes to the database (see ONLINE_ORDERING_ENABLED in
//  js/01-config-data.js).
//
//  WHERE THE DATA LIVES
//  ────────────────────
//  expert_settings, key 'services' — one JSON blob, same key/value pattern as
//  seo_settings / featured_offers. Shape:
//
//    { "enabled": true,
//      "intro": { "tag": "...", "h2": "...", "p": "..." },     // optional
//      "items": [ { id, name, desc, price, from, duration, icon, img,
//                   makes: ['bmw',…], cat: '<parts category slug>',
//                   active: true } ] }
//
//  An older/simpler save that is just the items ARRAY is accepted too.
//  The admin panel's Services tab (admin/js/15-services.js) is the only writer.
//
//  • price 0 (or blank)  → "Price on request" instead of a number. That's the
//    DEFAULT for every seeded service on purpose: inventing labour rates for a
//    real workshop is worse than asking the customer to message. The owner sets
//    the real prices in the admin tab.
//  • from: true          → renders "From AED 249" (a starting price, not a quote).
//  • cat                 → optional parts-category slug; adds a "Shop the parts"
//    link that reuses the catalog's own filterProducts().
//  • makes               → optional car-make slugs, shown as small chips.
//
//  FIRST PAINT: the section renders from DEFAULT_SERVICES (or this browser's
//  cached copy) the moment this file runs, then re-renders when loadSBData()'s
//  settings request lands. It never blocks on Supabase, and renderServices() is
//  idempotent so being called twice is normal.
// ══════════════════════════════════════════════════════════════════════════════

// Cached across loads so a returning visitor paints the owner's real list, not
// the defaults, before Supabase answers — same idea as cat_order_cache.
var SVC_CACHE_KEY = 'expert_services_cache';

// Seeded copy for a site that has never saved a services blob. Deliberately
// price-free (price: 0 → "Price on request"); the owner fills in real prices
// from the admin Services tab.
var DEFAULT_SERVICES = [
  { id: 'oil-service',   name: 'Major Oil & Filter Service',      icon: 'fa-oil-can',         duration: '45–60 min', cat: 'oils-fluids',
    desc: 'Genuine engine oil to your car\'s exact spec, new oil filter, fluid top-up and a service-light reset.' },
  { id: 'brakes',        name: 'Brake Pads & Discs Replacement',  icon: 'fa-circle-stop',     duration: '1–2 hrs',   cat: 'brakes',
    desc: 'Pads, discs and wear sensors replaced with OEM-quality parts, then bedded in and road tested.' },
  { id: 'diagnostics',   name: 'Computer Diagnostics & Fault Scan', icon: 'fa-laptop-medical', duration: '30–45 min', cat: 'electrical',
    desc: 'Full ECU scan on German-specific equipment — we read every module, explain the codes and quote the fix.' },
  { id: 'ac-service',    name: 'A/C Service & Gas Refill',        icon: 'fa-snowflake',       duration: '1 hr',      cat: 'cooling',
    desc: 'Leak test, compressor and condenser check, cabin filter and a full regas for proper UAE-summer cooling.' },
  { id: 'suspension',    name: 'Suspension & Steering Repair',    icon: 'fa-car-side',        duration: '2–4 hrs',   cat: 'suspension',
    desc: 'Shock absorbers, control arms, bushes and links — the usual cure for knocks, clunks and uneven tyre wear.' },
  { id: 'timing',        name: 'Timing Chain & Belt Replacement', icon: 'fa-gear',            duration: '1–2 days',  cat: 'engine',
    desc: 'Chains, guides, tensioners and water pumps on Mercedes, BMW, Audi and VW engines, done to factory torque specs.' },
  { id: 'battery',       name: 'Battery & Electrical Repair',     icon: 'fa-car-battery',     duration: '30 min+',   cat: 'electrical',
    desc: 'Battery test and replacement with coding/registration, plus alternator, starter and wiring faults.' },
  { id: 'transmission',  name: 'Gearbox & Transmission Service',  icon: 'fa-gears',           duration: '3–5 hrs',   cat: 'transmission',
    desc: 'ATF flush with the correct fluid and filter/pan kit — the service most automatic German gearboxes never get.' },
  { id: 'inspection',    name: 'Pre-Purchase Inspection',         icon: 'fa-clipboard-check', duration: '1 hr',
    desc: 'Buying a used German car? We inspect it end to end and send you an honest report before you pay for it.' },
  { id: 'general',       name: 'General Repair & Maintenance',    icon: 'fa-screwdriver-wrench', duration: 'Varies',
    desc: 'Anything else your car needs — tell us the symptoms on WhatsApp and our mechanics will tell you what it takes.' }
];

// A service photo is either hosted somewhere (https://…) or kept in the repo
// under img/services/. Repo photos MUST stay relative with no leading slash:
// the site is served from /German-Expert/ on GitHub Pages, so '/img/…' would
// resolve to the domain root and 404. Everything else is dropped — a URL here
// comes from the admin panel and ends up in an <img src>, so 'javascript:',
// 'data:' and protocol-relative '//host' have no business being honoured.
function _svcSafeImg(v) {
  var s = String(v == null ? '' : v).trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  if (s.indexOf('..') !== -1) return '';
  return /^[\w.-]+(?:\/[\w.-]+)*\.(?:webp|avif|jpe?g|png|gif|svg)$/i.test(s) ? s : '';
}

// The owner's own 2x2 collage of their workshop (img/services/src/collage.png,
// 1920x1080) exported to two WebP widths. One image, not four — they assembled
// the grid themselves and asked for it used whole.
var DEFAULT_COLLAGE = 'img/services/collage';

// One label per quadrant of that collage, in READING ORDER:
//   0 = top-left, 1 = top-right, 2 = bottom-left, 3 = bottom-right.
// Each is written over its own quarter of the picture and books that job on
// WhatsApp. Mirrors ADMIN_DEFAULT_BANDS in admin/js/15-services.js — change
// both. The key is still "bands" because the stored row is the same shape.
//
// `box` is [left, top, width, height] as PERCENTAGES of the picture, and it
// is NOT a quarter each. The owner's collage is a pinwheel: the two photos in
// the top row meet at x=44.1%, the two in the bottom row at x=65.2%, the left
// column splits at y=50.8% and the right column at y=58.9%. An even 2x2
// overlay therefore spilled each label's shading onto the photo next door.
// The seams were measured by scanning the source for the strongest luminance
// discontinuity inside each expected band — do that again if the picture is
// ever replaced, don't eyeball it.
var DEFAULT_BANDS = [
  { id: 'q-brakes',   box: [0, 0, 44.1, 50.8],
    name: 'Brake Service',
    sub: 'Pads, discs & wear sensors — bedded in and road tested' },
  { id: 'q-diag',     box: [44.1, 0, 55.9, 50.8],
    name: 'Computer Diagnostics',
    sub: 'Full scan on the lift — every module, codes explained' },
  { id: 'q-oil',      box: [0, 50.8, 65.2, 49.2],
    name: 'Oil & Filter Service',
    sub: "Your engine's exact oil spec, new filter, light reset" },
  { id: 'q-repairs',  box: [65.2, 58.9, 34.8, 41.1],
    name: 'Servicing & Repairs',
    sub: 'Mercedes · BMW · Audi · VW · Porsche' }
];

// Fallback if a stored row has no boxes: an even quartering. Wrong for THIS
// picture, but it is the only sane guess for one we have not measured.
var EVEN_BOXES = [[0, 0, 50, 50], [50, 0, 50, 50], [0, 50, 50, 50], [50, 50, 50, 50]];

// A band's img is an extensionless base ('img/services/brakes') so the two
// widths can be derived from it, which _svcSafeImg would reject for having no
// extension — so validate the .webp it stands for, and keep the base. A full
// remote URL is passed through _svcSafeImg unchanged.
function _svcSafeBandImg(v) {
  var s = String(v == null ? '' : v).trim().replace(/\.(webp|avif|jpe?g|png)$/i, '');
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return _svcSafeImg(v);
  return _svcSafeImg(s + '.webp') ? s : '';
}

function normalizeBands(raw) {
  var list = Array.isArray(raw) ? raw : [];
  // Four quadrants, so four labels — anything past the fourth has nowhere to
  // be drawn.
  return list.filter(function (b) { return b && b.name && b.active !== false; })
    .slice(0, 4)
    .map(function (b, i) {
      var box = (Array.isArray(b.box) && b.box.length === 4 && b.box.every(function (v) {
        return typeof v === 'number' && isFinite(v) && v >= 0 && v <= 100;
      })) ? b.box : (EVEN_BOXES[i] || EVEN_BOXES[0]);
      return {
        id:   String(b.id || ('quad' + i)),
        name: String(b.name || ''),
        sub:  String(b.sub || ''),
        box:  box
      };
    });
}

// Draws the single collage image with a label written over each quadrant. The
// quadrants are a CSS grid laid over the picture rather than four separate
// <img>s, so the owner's own composition — gutters and all — is what ships;
// each quadrant is still a <button>, because a photo of a job you cannot book
// is a dead end.
function renderServiceCollage(collage, labels) {
  var wrap = document.getElementById('servicesBands');
  if (!wrap) return;
  if (!collage || !labels.length) { wrap.innerHTML = ''; wrap.style.display = 'none'; return; }
  wrap.style.display = '';

  var BOOK = _svcT('svc_book', 'Book on WhatsApp');
  var ALT  = _svcT('svc_collage_alt', 'Our workshop: brakes, diagnostics, oil service and general repairs');
  var isRemote = /^https?:\/\//i.test(collage);
  var img = isRemote
    ? '<img src="' + encodeHtmlSvc(collage) + '" alt="' + encodeHtmlSvc(ALT) + '" loading="lazy" decoding="async" />'
    : '<img src="' + encodeHtmlSvc(collage) + '.webp" ' +
        'srcset="' + encodeHtmlSvc(collage) + '-sm.webp 960w, ' + encodeHtmlSvc(collage) + '.webp 1920w" ' +
        // Edge to edge at every width, so the picture IS the viewport.
        'sizes="100vw" ' +
        'alt="' + encodeHtmlSvc(ALT) + '" loading="lazy" decoding="async" />';

  var quads = labels.map(function (b, i) {
    // Positioned, not gridded — see the box note on DEFAULT_BANDS.
    var pos = 'left:' + b.box[0] + '%;top:' + b.box[1] + '%;width:' + b.box[2] + '%;height:' + b.box[3] + '%';
    // A box that stops short of the bottom of the picture ends in the MIDDLE
    // of its photo, so its scrim has to fade back out or it draws a visible
    // horizontal step across the shot.
    var mid = (b.box[1] + b.box[3]) < 99 ? ' is-mid' : '';
    return '<button type="button" class="svc-quad' + mid + '" style="' + pos + '" onclick="bookBand(' + i + ')" ' +
        'aria-label="' + encodeHtmlSvc(BOOK + ' — ' + b.name) + '">' +
        '<span class="svc-quad-name">' + encodeHtmlSvc(b.name) + '</span>' +
        (b.sub ? '<span class="svc-quad-sub">' + encodeHtmlSvc(b.sub) + '</span>' : '') +
      '</button>';
  }).join('');

  wrap.innerHTML = '<figure class="svc-collage">' + img +
    '<div class="svc-collage-labels">' + quads + '</div></figure>';
}

// Booking straight off a band — same contract as bookService().
function bookBand(idx) {
  var b = _servicesConfig().bands[idx];
  if (!b) return;
  var msg = 'Hi German Expert, I would like to book:\n\n🔧 *' + b.name + '*\n\n' +
            'My car: (make / model / year)\nPreferred day & time:';
  window.open('https://wa.me/' + SHOP_WA + '?text=' + encodeURIComponent(msg), '_blank');
}

// ── NORMALISE ────────────────────────────────────────────────────────────────
// Accepts the object shape, the bare array shape, a JSON string, or nothing,
// and always returns { enabled, intro, items } with usable items.
function normalizeServices(raw) {
  var cfg = raw;
  if (typeof cfg === 'string') { try { cfg = JSON.parse(cfg); } catch (e) { cfg = null; } }
  if (Array.isArray(cfg)) cfg = { items: cfg };
  if (!cfg || typeof cfg !== 'object') cfg = {};
  var items = Array.isArray(cfg.items) ? cfg.items : [];
  items = items.filter(function (s) { return s && s.name && s.active !== false; }).map(function (s, i) {
    return {
      id:       String(s.id || ('svc' + i)),
      name:     String(s.name || ''),
      desc:     String(s.desc || ''),
      price:    Number(s.price) > 0 ? Number(s.price) : 0,
      from:     s.from !== false,
      duration: String(s.duration || ''),
      icon:     String(s.icon || 'fa-screwdriver-wrench').replace(/[^a-z0-9-]/gi, ''),
      img:      _svcSafeImg(s.img),
      cat:      String(s.cat || '').replace(/[^a-z0-9-]/gi, ''),
      makes:    Array.isArray(s.makes) ? s.makes.slice(0, 8) : []
    };
  });
  return {
    enabled: cfg.enabled !== false,
    intro:   (cfg.intro && typeof cfg.intro === 'object') ? cfg.intro : {},
    items:   items,
    // No bands key at all (an older save, or the bare-array shape) → fall back
    // to the shipped four. An explicit empty array means "no bands", and is
    // honoured.
    bands:   normalizeBands(Array.isArray(cfg.bands) ? cfg.bands : DEFAULT_BANDS),
    // One image for the whole collage. A saved empty string means the owner
    // removed it, and the block hides itself.
    collage: (typeof cfg.collage === 'string') ? _svcSafeBandImg(cfg.collage) : DEFAULT_COLLAGE
  };
}

// The blob this render should use: live Supabase data if it has arrived, else
// this browser's cached copy, else the seeded defaults.
function _servicesConfig() {
  if (window._sbServices !== undefined && window._sbServices !== null) return normalizeServices(window._sbServices);
  try {
    var cached = localStorage.getItem(SVC_CACHE_KEY);
    if (cached) {
      var c = normalizeServices(cached);
      if (c.items.length) return c;
    }
  } catch (e) {}
  return normalizeServices({ items: DEFAULT_SERVICES });
}

// Written by loadSBData() once the settings row lands (js/01-config-data.js).
function cacheServices(raw) {
  try { localStorage.setItem(SVC_CACHE_KEY, typeof raw === 'string' ? raw : JSON.stringify(raw)); } catch (e) {}
}

// ── RENDER ───────────────────────────────────────────────────────────────────
function renderServices() {
  var section = document.getElementById('services');
  var grid    = document.getElementById('servicesGrid');
  if (!section || !grid) return;

  var cfg = _servicesConfig();

  // Nothing to show (owner switched the section off, or emptied both the card
  // list and the photo bands) → hide the whole section rather than leave an
  // empty heading behind.
  if (!cfg.enabled || (!cfg.items.length && !cfg.bands.length)) { section.style.display = 'none'; return; }
  section.style.display = '';
  renderServiceCollage(cfg.collage, cfg.bands);

  // Optional admin-set heading copy. Left blank → the markup's own
  // data-i18n text stays, so the Arabic strings keep working.
  var intro = cfg.intro || {};
  if (intro.tag) _svcText('servicesTag', intro.tag);
  if (intro.h2)  _svcText('servicesHeading', intro.h2);
  if (intro.p)   _svcText('servicesIntro', intro.p);

  var POA  = _svcT('svc_poa',  'Price on request');
  var FROM = _svcT('svc_from', 'From');
  var BOOK = _svcT('svc_book', 'Book on WhatsApp');
  var SHOP = _svcT('svc_parts', 'Shop the parts');

  grid.innerHTML = cfg.items.map(function (s, i) {
    var priceHtml = s.price > 0
      ? '<span class="svc-price">' + (s.from ? '<em>' + encodeHtmlSvc(FROM) + '</em> ' : '') + encodeHtmlSvc(fmtPrice(s.price)) + '</span>'
      : '<span class="svc-price svc-price-poa">' + encodeHtmlSvc(POA) + '</span>';

    var media = s.img
      ? '<div class="svc-media"><img src="' + encodeHtmlSvc(s.img) + '" alt="" loading="lazy" decoding="async" onerror="this.closest(\'.svc-media\').classList.add(\'svc-media-failed\')" /></div>'
      : '<div class="svc-icon"><i class="fa ' + encodeHtmlSvc(s.icon) + '" aria-hidden="true"></i></div>';

    var makes = s.makes.length
      ? '<div class="svc-makes">' + s.makes.map(function (m) {
          var def = (typeof CAR_MAKES !== 'undefined' ? CAR_MAKES : []).find(function (x) { return x.slug === m; });
          return '<span class="svc-make">' + encodeHtmlSvc(def ? def.label : m) + '</span>';
        }).join('') + '</div>'
      : '';

    return '<article class="svc-card">' +
        media +
        '<h3 class="svc-name">' + encodeHtmlSvc(s.name) + '</h3>' +
        (s.desc ? '<p class="svc-desc">' + encodeHtmlSvc(s.desc) + '</p>' : '') +
        makes +
        '<div class="svc-meta">' + priceHtml +
          (s.duration ? '<span class="svc-dur"><i class="fa fa-clock" aria-hidden="true"></i> ' + encodeHtmlSvc(s.duration) + '</span>' : '') +
        '</div>' +
        '<div class="svc-actions">' +
          '<button type="button" class="svc-book" onclick="bookService(' + i + ')">' +
            '<i class="fab fa-whatsapp" aria-hidden="true"></i> ' + encodeHtmlSvc(BOOK) +
          '</button>' +
          (s.cat ? '<button type="button" class="svc-parts" onclick="filterProducts(\'' + encodeHtmlSvc(s.cat) + '\')">' +
            encodeHtmlSvc(SHOP) + ' <i class="fa fa-arrow-right" aria-hidden="true"></i></button>' : '') +
        '</div>' +
      '</article>';
  }).join('');
}

// ── BOOKING ──────────────────────────────────────────────────────────────────
// Same contract as enquireOnWhatsApp() for parts: open wa.me with the message
// already written, let the team confirm the price and the slot in the chat.
function bookService(idx) {
  var cfg = _servicesConfig();
  var s = cfg.items[idx];
  if (!s) return;
  var lines = [
    'Hi German Expert, I would like to book a service:',
    '',
    '🔧 *' + s.name + '*'
  ];
  if (s.price > 0) lines.push('💰 ' + (s.from ? 'From ' : '') + fmtPrice(s.price));
  if (s.duration)  lines.push('⏱️ ' + s.duration);
  lines.push('', 'My car: (make / model / year)', 'Preferred day & time:');
  window.open('https://wa.me/' + SHOP_WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank');
}

// "Not sure what it needs?" footer CTA of the section.
function askServiceAdvice() {
  var msg = 'Hi German Expert, my car needs checking.\n\nCar: (make / model / year)\nProblem / symptoms:';
  window.open('https://wa.me/' + SHOP_WA + '?text=' + encodeURIComponent(msg), '_blank');
}

// ── SMALL HELPERS ────────────────────────────────────────────────────────────
// Own escaper: 02-catalog-render.js's encodeHtml may not be defined yet
// depending on script order, and this file must be safe on its own.
function encodeHtmlSvc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
// Translation lookup that degrades to the English fallback if 04-i18n-order.js
// hasn't run or the key is missing.
function _svcT(key, fallback) {
  try {
    var dict = (typeof _T !== 'undefined' && _T[typeof _lang !== 'undefined' ? _lang : 'en']) || {};
    return dict[key] || fallback;
  } catch (e) { return fallback; }
}
function _svcText(id, txt) {
  var el = document.getElementById(id);
  if (el) el.textContent = txt;
}

// Paint immediately — Supabase may answer long after this, or not at all.
renderServices();
