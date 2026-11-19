// ── HERO CARS TAB ────────────────────────────────────────────────────────────
// Lets the owner edit, reorder, hide, delete and add the cars that rotate in the
// homepage hero (#showcase) without touching code (owner, 2026-11-19: "I should
// be able to edit and delete the cars from the admin page").
//
// Stored as ONE row — expert_settings, key 'hero_cars' — the same key/value
// pattern as 'services'. The storefront (code/js/08-hero.js, loadHeroCars())
// is the authority on the shape:
//
//   { cars: [ { id, src, w, srcSmall, wSmall, make, model, badge, label, alt,
//               scale, logoLift, active } ] }
//
// No row at all = the storefront shows its built-in list (HERO_CARS_DEFAULT),
// which is mirrored below so the editor opens on the real eight cars. An
// explicit empty list = no cars (the stage hides itself).
//
// Photos: a car needs a TRANSPARENT cut-out in the repo under img/hero/ (a
// photo that keeps its background covers the big lettering). New photos are
// added through Claude (cropped + two WebP sizes); this tab then points at them.
//
// EDITING MODEL (same as the Services tab): inputs write straight into the
// in-memory _hcCfg and mark the tab dirty; nothing is sent until "Save Cars" is
// pressed, and the list only re-renders on add/delete/move/toggle — never on a
// keystroke — so typing doesn't lose the caret.

// Mirrors HERO_CARS_DEFAULT in code/js/08-hero.js — change both.
var ADMIN_DEFAULT_HERO_CARS = [
  { src:'img/hero/mercedes-e-class.webp',  w:1400, srcSmall:'img/hero/mercedes-e-class-sm.webp',  wSmall:760, make:'mercedes',   model:'E-CLASS', badge:'MERCEDES',    logoLift:50,  scale:1,    alt:'Mercedes-Benz E-Class sedan' },
  { src:'img/hero/bmw-m4.webp',            w:1374, srcSmall:'img/hero/bmw-m4-sm.webp',            wSmall:756, make:'bmw',        model:'M4',      badge:'BMW',         logoLift:-14, scale:1.09, alt:'BMW M4 coupe' },
  { src:'img/hero/porsche-911.webp',       w:1400, srcSmall:'img/hero/porsche-911-sm.webp',       wSmall:760, make:'porsche',    model:'911',     badge:'PORSCHE',     logoLift:0,   scale:1.15, alt:'Porsche 911 Turbo coupe' },
  { src:'img/hero/audi-a6.webp',           w:612,  srcSmall:'img/hero/audi-a6-sm.webp',           wSmall:337, make:'audi',       model:'A6',      badge:'AUDI',        logoLift:0,   scale:0.97, alt:'Audi A6 sedan' },
  { src:'img/hero/vw-touareg.webp',        w:1400, srcSmall:'img/hero/vw-touareg-sm.webp',        wSmall:760, make:'volkswagen', model:'TOUAREG', badge:'VOLKSWAGEN',  logoLift:170, scale:0.84, alt:'Volkswagen Touareg SUV' },
  { src:'img/hero/range-rover-sport.webp', w:1400, srcSmall:'img/hero/range-rover-sport-sm.webp', wSmall:760, make:'landrover',  model:'SPORT',   badge:'RANGE ROVER', label:'Range Rover', logoLift:150, scale:0.9, alt:'Range Rover Sport SUV' },
  { src:'img/hero/jaguar-f-type.webp',     w:1400, srcSmall:'img/hero/jaguar-f-type-sm.webp',     wSmall:760, make:'jaguar',     model:'F-TYPE',  badge:'JAGUAR',      logoLift:0,   scale:1.1,  alt:'Jaguar F-Type coupe' },
  { src:'img/hero/maserati-ghibli.webp',   w:929,  srcSmall:'img/hero/maserati-ghibli-sm.webp',   wSmall:760, make:'maserati',   model:'GHIBLI',  badge:'MASERATI',    logoLift:40,  scale:0.95, alt:'Maserati Ghibli sedan' }
];

var _hcCfg    = { cars: [] };
var _hcDirty  = false;
var _hcLoaded = false;

// ── LOAD ─────────────────────────────────────────────────────────────────────
async function loadHeroCarsTab() {
  var res = await sbFetch(SB_URL + '/rest/v1/expert_settings?key=eq.hero_cars&select=value', { headers: SB_HDRS });
  var cfg = null;
  if (!res.error && Array.isArray(res.data) && res.data[0] && res.data[0].value) {
    try { cfg = JSON.parse(res.data[0].value); } catch (e) { cfg = null; }
  }
  if (Array.isArray(cfg)) cfg = { cars: cfg };
  var hadRow = !!(cfg && typeof cfg === 'object' && Array.isArray(cfg.cars));
  // Never saved → seed the editor with the real built-in cars. An explicit empty
  // list is the owner having deleted them all, and is left alone.
  var list = hadRow ? cfg.cars : ADMIN_DEFAULT_HERO_CARS;
  _hcCfg = { cars: list.map(_hcNormalize) };
  _hcDirty  = !hadRow;       // the editor shows the seeded list, which the database doesn't hold yet
  _hcLoaded = true;
  renderHeroCarsTab();
}

function _hcNormalize(c, i) {
  c = c || {};
  var n = {
    id:       String(c.id || ('car' + Date.now() + '_' + i)),
    src:      String(c.src || ''),
    w:        Number(c.w) > 0 ? Number(c.w) : 0,
    srcSmall: String(c.srcSmall || ''),
    wSmall:   Number(c.wSmall) > 0 ? Number(c.wSmall) : 0,
    make:     String(c.make || ''),
    model:    String(c.model || ''),
    badge:    String(c.badge || ''),
    alt:      String(c.alt || ''),
    scale:    Number(c.scale) > 0 ? Number(c.scale) : 1,
    logoLift: isFinite(Number(c.logoLift)) ? Number(c.logoLift) : 0,
    active:   c.active !== false
  };
  if (c.label) n.label = String(c.label);
  return n;
}

// ── RENDER ───────────────────────────────────────────────────────────────────
function renderHeroCarsTab() {
  var list = document.getElementById('hcList');
  if (!list) return;

  var live = _hcCfg.cars.filter(function (c) { return c.active && c.src; }).length;
  var countEl = document.getElementById('hcCount');
  if (countEl) countEl.textContent = live + ' live on the site · ' + _hcCfg.cars.length + ' total';

  if (!_hcCfg.cars.length) {
    list.innerHTML = '<div class="svc-adm-empty"><i class="fa fa-car-side"></i>' +
      '<p>No cars. The homepage hero shows no car stage until you add one — or ' +
      '<button type="button" class="svc-adm-link" onclick="hcRestoreDefaults()">put the original cars back</button>.</p></div>';
    _hcRenderDirty();
    return;
  }

  var makes = (typeof CAR_MAKES !== 'undefined' ? CAR_MAKES : []);

  list.innerHTML = _hcCfg.cars.map(function (c, i) {
    var makeOpts = '<option value=""' + (c.make ? '' : ' selected') + '>&mdash; none (no logo) &mdash;</option>' +
      makes.map(function (m) {
        return '<option value="' + encodeHtml(m.slug) + '"' + (m.slug === c.make ? ' selected' : '') + '>' + encodeHtml(m.label) + '</option>';
      }).join('');

    var thumb = c.src
      ? '<img src="' + encodeHtml(c.src) + '" alt="" style="width:110px;height:64px;object-fit:contain;display:block" onerror="this.style.visibility=\'hidden\'" />'
      : '<i class="fa fa-image"></i>';

    return '' +
    '<div class="svc-adm-card' + (c.active ? '' : ' is-off') + '">' +
      '<div class="svc-adm-top">' +
        '<div class="svc-adm-ico" style="width:120px;height:72px;display:flex;align-items:center;justify-content:center;background:#f4f5f7;border-radius:8px;flex-shrink:0">' + thumb + '</div>' +
        '<input class="svc-adm-name" type="text" value="' + encodeHtml(c.model) + '" placeholder="Model (e.g. M4, A6, Ghibli)" oninput="hcSet(' + i + ',\'model\',this.value)" />' +
        '<label class="svc-adm-live" title="Show this car in the hero">' +
          '<input type="checkbox"' + (c.active ? ' checked' : '') + ' onchange="hcSet(' + i + ',\'active\',this.checked,true)" /> Live' +
        '</label>' +
        '<div class="svc-adm-ord">' +
          '<button type="button" class="svc-adm-btn" title="Move earlier" onclick="hcMove(' + i + ',-1)"' + (i === 0 ? ' disabled' : '') + '><i class="fa fa-arrow-up"></i></button>' +
          '<button type="button" class="svc-adm-btn" title="Move later"   onclick="hcMove(' + i + ',1)"'  + (i === _hcCfg.cars.length - 1 ? ' disabled' : '') + '><i class="fa fa-arrow-down"></i></button>' +
          '<button type="button" class="svc-adm-btn svc-adm-del" title="Delete car" onclick="hcDelete(' + i + ')"><i class="fa fa-trash"></i></button>' +
        '</div>' +
      '</div>' +
      '<div class="svc-adm-grid">' +
        '<label>Make (picks the logo shown above the word)' +
          '<select onchange="hcSet(' + i + ',\'make\',this.value)">' + makeOpts + '</select>' +
        '</label>' +
        '<label>Big word behind the car' +
          '<input type="text" value="' + encodeHtml(c.badge) + '" placeholder="e.g. MERCEDES (keep it short)" oninput="hcSet(' + i + ',\'badge\',this.value)" />' +
        '</label>' +
        '<label>Car photo (transparent cut-out)' +
          '<input type="text" value="' + encodeHtml(c.src) + '" placeholder="img/hero/car-name.webp" onchange="hcSetImage(' + i + ',\'src\',this.value)" />' +
        '</label>' +
        '<label>Smaller photo for phones (optional)' +
          '<input type="text" value="' + encodeHtml(c.srcSmall) + '" placeholder="img/hero/car-name-sm.webp" onchange="hcSetImage(' + i + ',\'srcSmall\',this.value)" />' +
        '</label>' +
        '<label>Car size (1 = normal, bigger = larger)' +
          '<input type="number" min="0.3" max="2" step="0.01" value="' + c.scale + '" oninput="hcSet(' + i + ',\'scale\',this.value)" />' +
        '</label>' +
        '<label>Logo height (raise it above a tall roof)' +
          '<input type="number" step="5" value="' + c.logoLift + '" oninput="hcSet(' + i + ',\'logoLift\',this.value)" />' +
        '</label>' +
        '<label style="grid-column:1/-1">Description for screen readers / Google' +
          '<input type="text" value="' + encodeHtml(c.alt) + '" placeholder="e.g. Maserati Ghibli sedan" oninput="hcSet(' + i + ',\'alt\',this.value)" />' +
        '</label>' +
      '</div>' +
    '</div>';
  }).join('');

  _hcRenderDirty();
}

function _hcRenderDirty() {
  var el = document.getElementById('hcDirty');
  if (el) el.style.display = _hcDirty ? 'inline-flex' : 'none';
}

// ── EDITS ────────────────────────────────────────────────────────────────────
// rerender=true only where the card's own chrome changes (dimmed "off" state);
// text fields must NOT re-render or the caret jumps to the end on every key.
function hcSet(i, field, value, rerender) {
  var c = _hcCfg.cars[i];
  if (!c) return;
  if (field === 'active') c.active = !!value;
  else if (field === 'scale') { var n = parseFloat(value); c.scale = isFinite(n) && n > 0 ? n : 1; }
  else if (field === 'logoLift') { var l = parseFloat(value); c.logoLift = isFinite(l) ? l : 0; }
  else c[field] = String(value);
  _hcDirty = true;
  if (rerender) renderHeroCarsTab(); else _hcRenderDirty();
}

// Changing a photo path: read the file's real pixel width (the storefront needs
// it for srcset) and refresh the thumbnail. A wrong path just leaves width 0 and
// a blank thumbnail, so the typo is visible straight away.
function hcSetImage(i, field, value) {
  var c = _hcCfg.cars[i];
  if (!c) return;
  value = String(value || '').trim();
  c[field] = value;
  var wField = field === 'src' ? 'w' : 'wSmall';
  c[wField] = 0;
  _hcDirty = true;
  if (!value) { renderHeroCarsTab(); return; }
  var img = new Image();
  img.onload  = function () { c[wField] = img.naturalWidth; renderHeroCarsTab(); };
  img.onerror = function () { renderHeroCarsTab(); showToast('Could not load that image — check the path.'); };
  img.src = value;
}

function hcAdd() {
  _hcCfg.cars.push(_hcNormalize({ id: 'car' + Date.now(), make: '', model: '', badge: '', scale: 1, logoLift: 0 }, 0));
  _hcDirty = true;
  renderHeroCarsTab();
  var boxes = document.querySelectorAll('#hcList .svc-adm-name');
  if (boxes.length) { boxes[boxes.length - 1].focus(); boxes[boxes.length - 1].scrollIntoView({ block: 'center' }); }
}

function hcDelete(i) {
  var c = _hcCfg.cars[i];
  if (!c) return;
  var nm = (c.badge || '') + ' ' + (c.model || '');
  if (!confirm('Delete "' + (nm.trim() || 'this car') + '"?\n\nIt disappears from the homepage as soon as you press Save Cars. (The photo file itself is not deleted.)')) return;
  _hcCfg.cars.splice(i, 1);
  _hcDirty = true;
  renderHeroCarsTab();
}

function hcMove(i, dir) {
  var j = i + dir;
  if (j < 0 || j >= _hcCfg.cars.length) return;
  var t = _hcCfg.cars[i];
  _hcCfg.cars[i] = _hcCfg.cars[j];
  _hcCfg.cars[j] = t;
  _hcDirty = true;
  renderHeroCarsTab();
}

function hcRestoreDefaults() {
  if (_hcCfg.cars.length && !confirm('Replace the current list with the original eight cars?\n\nAnything you typed here is lost (the site keeps its current cars until you press Save).')) return;
  _hcCfg.cars = ADMIN_DEFAULT_HERO_CARS.map(_hcNormalize);
  _hcDirty = true;
  renderHeroCarsTab();
}

// ── SAVE ─────────────────────────────────────────────────────────────────────
async function saveHeroCars() {
  // A car with no photo would be an empty slide — drop it instead of publishing it.
  var withPhoto = _hcCfg.cars.filter(function (c) { return (c.src || '').trim(); });
  var dropped = _hcCfg.cars.length - withPhoto.length;
  if (!withPhoto.length && !confirm('There are no cars with a photo, so the homepage will show no car stage.\n\nSave anyway?')) return;

  var cars = withPhoto.map(function (c) {
    var o = {
      id: c.id, src: c.src.trim(), w: c.w > 0 ? c.w : undefined,
      make: c.make || '', model: (c.model || '').trim(), badge: (c.badge || '').trim(),
      alt: (c.alt || '').trim(), scale: c.scale > 0 ? c.scale : 1, logoLift: c.logoLift || 0,
      active: !!c.active
    };
    if ((c.srcSmall || '').trim() && c.wSmall > 0) { o.srcSmall = c.srcSmall.trim(); o.wSmall = c.wSmall; }
    if (c.label) o.label = c.label;
    return o;
  });
  _hcCfg.cars = cars.map(_hcNormalize);

  var res = await sbFetch(SB_URL + '/rest/v1/expert_settings', {
    method: 'POST',
    headers: Object.assign({}, SB_HDRS, { 'Prefer': 'resolution=merge-duplicates' }),
    body: JSON.stringify([{ key: 'hero_cars', value: JSON.stringify({ cars: cars }) }])
  });
  if (res.error) { showToast('Failed to save cars — ' + res.error); return; }

  _hcDirty = false;
  renderHeroCarsTab();
  showToast('Cars saved — live on the homepage now ✅' + (dropped ? ' (' + dropped + ' without a photo removed)' : ''));
}
