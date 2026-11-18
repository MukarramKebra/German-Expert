// ════════════════════════════════════════════════════════════════════════
// REDESIGN (v2.html) — vehicle finder, makes band, mobile action bar.
// Loaded after 09-services.js and only by v2.html; every entry point checks
// for its own element first, so on a page without them this file does nothing.
//
// The finder's data is scripts/data/vehicle-tree.json — the same make > model >
// generation tree the /make/ landing pages are generated from, so the two can
// never disagree. Filtering still happens at MAKE level (fitment_map has no
// model data): "Show parts" calls shopMake(); the model + year only travel into
// the WhatsApp message, where the shop confirms the exact part.
// ════════════════════════════════════════════════════════════════════════
(function initRedesign() {
  var form = document.getElementById('rdFinder');
  var selMake = document.getElementById('rdMake');
  var selModel = document.getElementById('rdModel');
  var selGen = document.getElementById('rdGen');
  var CAR_KEY = 'rd_my_car';
  var tree = null;

  function waNumber() { return (typeof SHOP_WA !== 'undefined' && SHOP_WA) ? SHOP_WA : '96599115215'; }
  function catalogSlug(m) { return m ? (m.fitSlug || m.slug) : ''; }
  function knownMake(slug) {
    return typeof CAR_MAKES !== 'undefined' && Array.isArray(CAR_MAKES) && CAR_MAKES.some(function(x) { return x.slug === slug; });
  }
  function opt(value, label) { var o = document.createElement('option'); o.value = value; o.textContent = label; return o; }
  function makeBySlug(slug) { return tree ? tree.makes.find(function(m) { return m.slug === slug; }) : null; }

  function fillModels() {
    var m = makeBySlug(selMake.value);
    selModel.innerHTML = ''; selGen.innerHTML = '';
    selModel.appendChild(opt('', m && m.models.length ? 'Any model' : '—'));
    selGen.appendChild(opt('', '—'));
    (m ? m.models : []).forEach(function(md, i) { selModel.appendChild(opt(String(i), md.name)); });
    selModel.disabled = !(m && m.models.length);
    selGen.disabled = true;
  }
  function fillGens() {
    var m = makeBySlug(selMake.value);
    var md = m && selModel.value !== '' ? m.models[Number(selModel.value)] : null;
    selGen.innerHTML = '';
    selGen.appendChild(opt('', md && md.gens.length ? 'Any year' : '—'));
    (md ? md.gens : []).forEach(function(g) { selGen.appendChild(opt(g, g)); });
    selGen.disabled = !(md && md.gens.length);
  }
  function chosenCar() {
    var m = makeBySlug(selMake.value);
    if (!m) return null;
    var md = selModel.value !== '' ? m.models[Number(selModel.value)] : null;
    return { make: m.slug, label: m.label, model: md ? md.name : '', gen: selGen.value || '' };
  }
  function carText(c) { return [c.label, c.model, c.gen].filter(Boolean).join(' '); }
  function remember(c) { try { localStorage.setItem(CAR_KEY, JSON.stringify(c)); } catch (e) {} }
  function restore() {
    var c = null;
    try { c = JSON.parse(localStorage.getItem(CAR_KEY) || 'null'); } catch (e) {}
    var m = c && makeBySlug(c.make);
    if (!m) return;
    selMake.value = m.slug; fillModels();
    var i = m.models.findIndex(function(md) { return md.name === c.model; });
    if (i >= 0) { selModel.value = String(i); fillGens(); if (c.gen) selGen.value = c.gen; }
  }
  function markMakeTiles(slug) {
    document.querySelectorAll('.rd-make[data-make]').forEach(function(b) {
      b.setAttribute('aria-pressed', b.dataset.make === slug ? 'true' : 'false');
    });
  }

  // Makes band tile → set the finder to that make too, then filter the catalogue.
  window.rdPickMake = function(slug) {
    if (selMake && tree) {
      var m = tree.makes.find(function(x) { return catalogSlug(x) === slug || x.slug === slug; });
      if (m && selMake.value !== m.slug) { selMake.value = m.slug; fillModels(); }
    }
    markMakeTiles(slug);
    if (typeof shopMake === 'function' && knownMake(slug)) shopMake(slug);
  };

  window.rdFinderShow = function(e) {
    if (e) e.preventDefault();
    var c = chosenCar();
    if (!c) { selMake.focus(); return; }
    remember(c);
    var slug = catalogSlug(makeBySlug(c.make));
    markMakeTiles(slug);
    if (typeof shopMake === 'function' && knownMake(slug)) shopMake(slug);
    else { var p = document.getElementById('products'); if (p) p.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  };

  window.rdFinderAsk = function() {
    var c = selMake ? chosenCar() : null;
    if (c) remember(c);
    var msg = c
      ? 'Hello Alamdar Auto, I need a part for my ' + carText(c) + '. Can you help?'
      : 'Hello Alamdar Auto, I need a part for my car. Can you help?';
    window.open('https://wa.me/' + waNumber() + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  };

  // Mobile action bar → the catalogue's own search box.
  window.rdFocusSearch = function() {
    var box = document.getElementById('searchInput');
    var sec = document.getElementById('products');
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (box) setTimeout(function() { box.focus({ preventScroll: true }); }, 350);
  };

  if (!form || !selMake || !selModel || !selGen) return;
  selMake.addEventListener('change', fillModels);
  selModel.addEventListener('change', fillGens);

  fetch('scripts/data/vehicle-tree.json', { cache: 'force-cache' })
    .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function(data) {
      tree = data;
      var keep = selMake.value;
      selMake.innerHTML = '';
      selMake.appendChild(opt('', 'Choose make'));
      data.makes.forEach(function(m) { selMake.appendChild(opt(m.slug, m.label)); });
      selMake.value = keep;
      fillModels();
      restore();
    })
    .catch(function() {
      // No tree: the static make list in the markup still works for "Show parts".
      tree = { makes: Array.prototype.slice.call(selMake.options).filter(function(o) { return o.value; })
        .map(function(o) { return { slug: o.value, label: o.textContent, models: [] }; }) };
      fillModels();
    });
})();

// Hero make labels. 08-hero.js draws the big outlined make word + logo inside
// an SVG that the redesign hides; this lifts the logo and the word out of that
// SVG into a small label (logo + name) inside each car's own <figure>, so it
// fades with the slide. No change to 08-hero.js.
(function rdCaptions() {
  var stage = document.getElementById('heroStage');
  if (!stage) return;
  function run() {
    Array.prototype.forEach.call(stage.querySelectorAll('.ge-car'), function(fig) {
      if (fig.querySelector('.rd-carcap')) return;
      var svg = fig.querySelector('.ge-car-model');
      if (!svg) return;
      var t = svg.querySelector('text');
      var im = svg.querySelector('image');
      var name = t ? t.textContent.trim() : '';
      var src = im ? (im.getAttribute('href') || im.getAttribute('xlink:href') || '') : '';
      if (!name && !src) return;
      var cap = document.createElement('div');
      cap.className = 'rd-carcap';
      cap.setAttribute('aria-hidden', 'true');
      if (src) { var img = document.createElement('img'); img.className = 'rd-carcap-logo'; img.src = src; img.alt = ''; cap.appendChild(img); }
      if (name) { var s = document.createElement('span'); s.className = 'rd-carcap-name'; s.textContent = name; cap.appendChild(s); }
      fig.appendChild(cap);
    });
  }
  run();
  new MutationObserver(run).observe(stage, { childList: true });
})();
