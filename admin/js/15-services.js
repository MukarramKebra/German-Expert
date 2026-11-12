// ── WORKSHOP SERVICES TAB ────────────────────────────────────────────────────
// Lets the owner run the homepage's "Our Mechanics Service Your Car" section
// (#services) without touching code: add/remove a service, rename it, set a
// price and a duration, point it at a parts category, reorder the cards, hide
// one temporarily, or switch the whole section off.
//
// Stored in Supabase as ONE row — expert_settings, key 'services' — exactly the
// same key/value pattern as seo_settings and featured_offers. The storefront
// reads it in loadSBData() (code/js/01-config-data.js) and renders it in
// renderServices() (code/js/09-services.js), which is the authority on the
// shape:
//
//   { enabled: true,
//     intro: { tag, h2, p },                 // optional heading overrides
//     items: [ { id, name, desc, price, from, duration, icon, img, cat,
//                makes: [], active } ] }
//
// NOTHING here is a product: services never appear in expert_products, never
// have stock and never go through checkout. Every card on the storefront is a
// WhatsApp booking link, which is also why a service with price 0 renders as
// "Price on request" instead of a free job.
//
// EDITING MODEL: every input writes straight into the in-memory _svcCfg and
// marks the tab dirty; nothing is sent until "Save Services" is pressed. The
// card list is only re-rendered on add/delete/move/toggle, never on a
// keystroke, so typing never loses the caret.

// Mirrors DEFAULT_SERVICES in code/js/09-services.js — seeded into the editor
// the first time the tab is opened on a site that has never saved a services
// row, so the owner edits a real list instead of starting from nothing. Prices
// are deliberately 0 ("Price on request"): the owner fills in their own rates.
// If you change this list, change that one too (the storefront uses its own
// copy until the first save).
var ADMIN_DEFAULT_SERVICES = [
  { id:'oil-service',  name:'Major Oil & Filter Service',        icon:'fa-oil-can',          duration:'45–60 min', cat:'oils-fluids',
    desc:"Genuine engine oil to your car's exact spec, new oil filter, fluid top-up and a service-light reset." },
  { id:'brakes',       name:'Brake Pads & Discs Replacement',    icon:'fa-circle-stop',      duration:'1–2 hrs',   cat:'brakes',
    desc:'Pads, discs and wear sensors replaced with OEM-quality parts, then bedded in and road tested.' },
  { id:'diagnostics',  name:'Computer Diagnostics & Fault Scan', icon:'fa-laptop-medical',   duration:'30–45 min', cat:'electrical',
    desc:'Full ECU scan on German-specific equipment — we read every module, explain the codes and quote the fix.' },
  { id:'ac-service',   name:'A/C Service & Gas Refill',          icon:'fa-snowflake',        duration:'1 hr',      cat:'cooling',
    desc:'Leak test, compressor and condenser check, cabin filter and a full regas for proper UAE-summer cooling.' },
  { id:'suspension',   name:'Suspension & Steering Repair',      icon:'fa-car-side',         duration:'2–4 hrs',   cat:'suspension',
    desc:'Shock absorbers, control arms, bushes and links — the usual cure for knocks, clunks and uneven tyre wear.' },
  { id:'timing',       name:'Timing Chain & Belt Replacement',   icon:'fa-gear',             duration:'1–2 days',  cat:'engine',
    desc:'Chains, guides, tensioners and water pumps on Mercedes, BMW, Audi and VW engines, done to factory torque specs.' },
  { id:'battery',      name:'Battery & Electrical Repair',       icon:'fa-car-battery',      duration:'30 min+',   cat:'electrical',
    desc:'Battery test and replacement with coding/registration, plus alternator, starter and wiring faults.' },
  { id:'transmission', name:'Gearbox & Transmission Service',    icon:'fa-gears',            duration:'3–5 hrs',   cat:'transmission',
    desc:'ATF flush with the correct fluid and filter/pan kit — the service most automatic German gearboxes never get.' },
  { id:'inspection',   name:'Pre-Purchase Inspection',           icon:'fa-clipboard-check',  duration:'1 hr',      cat:'',
    desc:'Buying a used German car? We inspect it end to end and send you an honest report before you pay for it.' },
  { id:'general',      name:'General Repair & Maintenance',      icon:'fa-screwdriver-wrench', duration:'Varies',  cat:'',
    desc:"Anything else your car needs — tell us the symptoms on WhatsApp and our mechanics will tell you what it takes." }
];

// A short pick-list for the icon dropdown. Font Awesome 6 free solid names —
// anything else can still be typed into the box, this is just the shortcut.
var SVC_ICONS = [
  'fa-screwdriver-wrench','fa-oil-can','fa-circle-stop','fa-laptop-medical','fa-snowflake',
  'fa-car-side','fa-gear','fa-gears','fa-car-battery','fa-clipboard-check','fa-wrench',
  'fa-bolt','fa-fan','fa-filter','fa-gauge-high','fa-spray-can-sparkles',
  'fa-temperature-low','fa-wind','fa-lightbulb','fa-user-gear','fa-car','fa-road'
];

var _svcCfg   = { enabled: true, intro: {}, items: [] };
var _svcDirty = false;
var _svcLoaded = false;

// ── LOAD ─────────────────────────────────────────────────────────────────────
async function loadServicesTab() {
  var res = await sbFetch(SB_URL + '/rest/v1/expert_settings?key=eq.services&select=value', { headers: SB_HDRS });
  var cfg = null;
  if (!res.error && Array.isArray(res.data) && res.data[0] && res.data[0].value) {
    try { cfg = JSON.parse(res.data[0].value); } catch (e) { cfg = null; }
  }
  if (Array.isArray(cfg)) cfg = { items: cfg };          // tolerate a bare-array save
  var hadRow = !!(cfg && typeof cfg === 'object' && Array.isArray(cfg.items));
  if (!cfg || typeof cfg !== 'object') cfg = {};
  _svcCfg = {
    enabled: cfg.enabled !== false,
    intro:   (cfg.intro && typeof cfg.intro === 'object') ? cfg.intro : {},
    items:   (Array.isArray(cfg.items) && cfg.items.length)
               ? cfg.items.map(_svcNormalizeItem)
               : ADMIN_DEFAULT_SERVICES.map(_svcNormalizeItem)
  };
  // Never saved before → the editor is showing the seeded list, which is NOT
  // yet what the database holds. Flagging it dirty is honest and nudges the
  // owner to press Save once so the storefront reads a real row.
  _svcDirty  = !hadRow;
  _svcLoaded = true;
  renderServicesTab();
}

function _svcNormalizeItem(s, i) {
  s = s || {};
  return {
    id:       String(s.id || ('svc' + Date.now() + i)),
    name:     String(s.name || ''),
    desc:     String(s.desc || ''),
    price:    Number(s.price) > 0 ? Number(s.price) : 0,
    from:     s.from !== false,
    duration: String(s.duration || ''),
    icon:     String(s.icon || 'fa-screwdriver-wrench'),
    img:      String(s.img || ''),
    cat:      String(s.cat || ''),
    makes:    Array.isArray(s.makes) ? s.makes : [],
    active:   s.active !== false
  };
}

// ── RENDER ───────────────────────────────────────────────────────────────────
function renderServicesTab() {
  var list = document.getElementById('svcList');
  if (!list) return;

  var secToggle = document.getElementById('svcEnabled');
  if (secToggle) secToggle.checked = !!_svcCfg.enabled;
  _svcSetVal('svcIntroTag', _svcCfg.intro.tag || '');
  _svcSetVal('svcIntroH2',  _svcCfg.intro.h2  || '');
  _svcSetVal('svcIntroP',   _svcCfg.intro.p   || '');

  var cats = (typeof getAllCats === 'function' ? getAllCats() : DEFAULT_CATS)
    .filter(function (c) { return ['hidden', 'cant-find-products'].indexOf(c.slug) === -1; });

  var liveCount = _svcCfg.items.filter(function (s) { return s.active && s.name; }).length;
  var countEl = document.getElementById('svcCount');
  if (countEl) countEl.textContent = liveCount + ' live on the site · ' + _svcCfg.items.length + ' total';

  if (!_svcCfg.items.length) {
    list.innerHTML = '<div class="svc-adm-empty"><i class="fa fa-screwdriver-wrench"></i>' +
      '<p>No services yet. Press <strong>Add Service</strong> to create the first one — or <button type="button" class="svc-adm-link" onclick="svcRestoreDefaults()">load the standard German-car service list</button>.</p></div>';
    _svcRenderDirty();
    return;
  }

  list.innerHTML = _svcCfg.items.map(function (s, i) {
    var iconOpts = SVC_ICONS.concat(SVC_ICONS.indexOf(s.icon) === -1 && s.icon ? [s.icon] : [])
      .map(function (ic) {
        return '<option value="' + encodeHtml(ic) + '"' + (ic === s.icon ? ' selected' : '') + '>' + encodeHtml(ic.replace(/^fa-/, '')) + '</option>';
      }).join('');

    var catOpts = '<option value=""' + (s.cat ? '' : ' selected') + '>&mdash; none &mdash;</option>' +
      cats.map(function (c) {
        return '<option value="' + encodeHtml(c.slug) + '"' + (c.slug === s.cat ? ' selected' : '') + '>' + encodeHtml(c.label) + '</option>';
      }).join('');

    var makeChips = (typeof CAR_MAKES !== 'undefined' ? CAR_MAKES : []).map(function (m) {
      var on = s.makes.indexOf(m.slug) !== -1;
      return '<button type="button" class="svc-adm-make' + (on ? ' on' : '') + '" onclick="svcToggleMake(' + i + ',\'' + m.slug + '\')">' + encodeHtml(m.label) + '</button>';
    }).join('');

    return '' +
    '<div class="svc-adm-card' + (s.active ? '' : ' is-off') + '">' +
      '<div class="svc-adm-top">' +
        '<div class="svc-adm-ico"><i class="fa ' + encodeHtml(s.icon || 'fa-screwdriver-wrench') + '"></i></div>' +
        '<input class="svc-adm-name" type="text" value="' + encodeHtml(s.name) + '" placeholder="Service name (e.g. Brake Pads &amp; Discs Replacement)" oninput="svcSet(' + i + ',\'name\',this.value)" />' +
        '<label class="svc-adm-live" title="Show this service on the site">' +
          '<input type="checkbox"' + (s.active ? ' checked' : '') + ' onchange="svcSet(' + i + ',\'active\',this.checked,true)" /> Live' +
        '</label>' +
        '<div class="svc-adm-ord">' +
          '<button type="button" class="svc-adm-btn" title="Move up"   onclick="svcMove(' + i + ',-1)"' + (i === 0 ? ' disabled' : '') + '><i class="fa fa-arrow-up"></i></button>' +
          '<button type="button" class="svc-adm-btn" title="Move down" onclick="svcMove(' + i + ',1)"'  + (i === _svcCfg.items.length - 1 ? ' disabled' : '') + '><i class="fa fa-arrow-down"></i></button>' +
          '<button type="button" class="svc-adm-btn svc-adm-del" title="Delete service" onclick="svcDelete(' + i + ')"><i class="fa fa-trash"></i></button>' +
        '</div>' +
      '</div>' +
      '<textarea class="svc-adm-desc" rows="2" placeholder="What the job includes — one or two plain sentences the customer will read." oninput="svcSet(' + i + ',\'desc\',this.value)">' + encodeHtml(s.desc) + '</textarea>' +
      '<div class="svc-adm-grid">' +
        '<label>Price (AED)' +
          '<input type="number" min="0" step="1" value="' + (s.price > 0 ? s.price : '') + '" placeholder="Blank = price on request" oninput="svcSet(' + i + ',\'price\',this.value)" />' +
        '</label>' +
        '<label>Starting price?' +
          '<span class="svc-adm-inline"><input type="checkbox"' + (s.from ? ' checked' : '') + ' onchange="svcSet(' + i + ',\'from\',this.checked,true)" /> show as &quot;From AED …&quot;</span>' +
        '</label>' +
        '<label>How long' +
          '<input type="text" value="' + encodeHtml(s.duration) + '" placeholder="e.g. 1–2 hrs" oninput="svcSet(' + i + ',\'duration\',this.value)" />' +
        '</label>' +
        '<label>Icon' +
          '<select onchange="svcSet(' + i + ',\'icon\',this.value,true)">' + iconOpts + '</select>' +
        '</label>' +
        '<label>Parts category (adds a &quot;Shop the parts&quot; link)' +
          '<select onchange="svcSet(' + i + ',\'cat\',this.value)">' + catOpts + '</select>' +
        '</label>' +
        // type="text", not type="url": a photo kept in the repo is written as
        // a relative path (img/services/brakes.webp), which a url field marks
        // invalid. The storefront's _svcSafeImg() is what actually validates.
        '<label>Photo (optional — replaces the icon)' +
          '<input type="text" value="' + encodeHtml(s.img) + '" placeholder="img/services/brakes.webp or https://…" oninput="svcSet(' + i + ',\'img\',this.value)" />' +
        '</label>' +
      '</div>' +
      '<div class="svc-adm-makes"><span class="svc-adm-makes-lbl">Fits (optional):</span>' + makeChips + '</div>' +
    '</div>';
  }).join('');

  _svcRenderDirty();
}

function _svcSetVal(id, v) { var el = document.getElementById(id); if (el) el.value = v; }

function _svcRenderDirty() {
  var el = document.getElementById('svcDirty');
  if (el) el.style.display = _svcDirty ? 'inline-flex' : 'none';
}

// ── EDITS ────────────────────────────────────────────────────────────────────
// rerender=true for the fields whose change alters the card's own chrome
// (the icon preview, the dimmed "off" state) — text fields must NOT re-render
// or the caret jumps to the end of the box on every character.
function svcSet(i, field, value, rerender) {
  var s = _svcCfg.items[i];
  if (!s) return;
  if (field === 'price') {
    var n = parseFloat(value);
    s.price = isFinite(n) && n > 0 ? n : 0;
  } else if (field === 'active' || field === 'from') {
    s[field] = !!value;
  } else {
    s[field] = String(value);
  }
  _svcDirty = true;
  if (rerender) renderServicesTab(); else _svcRenderDirty();
}

function svcToggleMake(i, slug) {
  var s = _svcCfg.items[i];
  if (!s) return;
  var at = s.makes.indexOf(slug);
  if (at === -1) s.makes.push(slug); else s.makes.splice(at, 1);
  _svcDirty = true;
  renderServicesTab();
}

function svcSetIntro(field, value) {
  _svcCfg.intro[field] = String(value || '');
  _svcDirty = true;
  _svcRenderDirty();
}

function svcToggleSection(on) {
  _svcCfg.enabled = !!on;
  _svcDirty = true;
  _svcRenderDirty();
}

function svcAdd() {
  _svcCfg.items.push(_svcNormalizeItem({ id: 'svc' + Date.now(), name: '', icon: 'fa-wrench' }, 0));
  _svcDirty = true;
  renderServicesTab();
  // Put the caret straight in the new card's name box.
  var boxes = document.querySelectorAll('#svcList .svc-adm-name');
  if (boxes.length) {
    boxes[boxes.length - 1].focus();
    boxes[boxes.length - 1].scrollIntoView({ block: 'center' });
  }
}

function svcDelete(i) {
  var s = _svcCfg.items[i];
  if (!s) return;
  if (!confirm('Delete "' + (s.name || 'this service') + '"?\n\nIt disappears from the site as soon as you press Save Services.')) return;
  _svcCfg.items.splice(i, 1);
  _svcDirty = true;
  renderServicesTab();
}

function svcMove(i, dir) {
  var j = i + dir;
  if (j < 0 || j >= _svcCfg.items.length) return;
  var tmp = _svcCfg.items[i];
  _svcCfg.items[i] = _svcCfg.items[j];
  _svcCfg.items[j] = tmp;
  _svcDirty = true;
  renderServicesTab();
}

function svcRestoreDefaults() {
  if (_svcCfg.items.length && !confirm('Replace the current list with the standard German-car service list?\n\nAnything you typed here is lost (the site keeps its current services until you press Save).')) return;
  _svcCfg.items = ADMIN_DEFAULT_SERVICES.map(_svcNormalizeItem);
  _svcDirty = true;
  renderServicesTab();
}

// ── SAVE ─────────────────────────────────────────────────────────────────────
async function saveServices() {
  // Read the heading boxes here rather than on every keystroke.
  _svcCfg.intro = {
    tag: (document.getElementById('svcIntroTag') || {}).value || '',
    h2:  (document.getElementById('svcIntroH2')  || {}).value || '',
    p:   (document.getElementById('svcIntroP')   || {}).value || ''
  };
  var sec = document.getElementById('svcEnabled');
  if (sec) _svcCfg.enabled = !!sec.checked;

  // A nameless card would render as a blank tile on the storefront — drop the
  // empty ones instead of publishing them.
  var named = _svcCfg.items.filter(function (s) { return (s.name || '').trim(); });
  var dropped = _svcCfg.items.length - named.length;
  _svcCfg.items = named.map(function (s) {
    return {
      id: s.id, name: s.name.trim(), desc: (s.desc || '').trim(),
      price: s.price > 0 ? s.price : 0, from: !!s.from,
      duration: (s.duration || '').trim(), icon: s.icon || 'fa-screwdriver-wrench',
      img: (s.img || '').trim(), cat: s.cat || '', makes: s.makes || [], active: !!s.active
    };
  });

  var res = await sbFetch(SB_URL + '/rest/v1/expert_settings', {
    method: 'POST',
    headers: Object.assign({}, SB_HDRS, { 'Prefer': 'resolution=merge-duplicates' }),
    body: JSON.stringify([{ key: 'services', value: JSON.stringify(_svcCfg) }])
  });
  if (res.error) { showToast('Failed to save services — ' + res.error); return; }

  _svcDirty = false;
  renderServicesTab();
  showToast('Services saved — live on the site now ✅' + (dropped ? ' (' + dropped + ' empty card' + (dropped > 1 ? 's' : '') + ' removed)' : ''));
}
