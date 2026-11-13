// ── HERO SHOWCASE ───────────────────────────────────────────────────────────
// Animated WebGPU background + 3D car stage for #showcase in index.html.
// Styles: code/css/10-hero.css.

// Cars on the hero stage: the model badge is drawn huge and outlined, with the
// car standing in front of it. Use transparent cut-out PNG/WebP files (3/4 or
// side view) stored under img/hero/ — a photo that still has its own
// background shows up as a rectangle covering the lettering.
//   src      — image path (relative to the site root)
//   w        — that file's real pixel width (drives the srcset descriptor)
//   srcSmall — optional smaller copy of the same cut-out, served to phones
//   wSmall   — its real pixel width
//   model    — the car's model, shown in the caption ('A6', 'M4', 'GT3' …)
//   badge    — the giant outlined word behind the car. Defaults to the make
//              label; set it explicitly to keep it SHORT, because the badge
//              scales to fit its own viewBox — a 13-character
//              'MERCEDES-BENZ' renders short and weedy next to 'BMW'.
//   cat      — for an entry advertising a PART rather than a car: a category
//              slug, which gives the caption a "Shop …" button wired to
//              jumpCat() instead of setMakeFilter(). Pair with name/ctaText.
//   name     — caption heading override (a part slide has no make + model)
//   ctaText  — caption button label override
//   make     — optional CAR_MAKES slug ('mercedes', 'bmw', …): makes the
//              caption a "Shop <Make> parts" button that filters the catalog
//   label    — optional make name (defaults to the CAR_MAKES label)
//   lead     — optional small line above the name
//   parts    — OPTIONAL override of the shared HERO_PARTS ring for this car.
//              Same shape: { brand, part, cat, img, icon }. Left out, every
//              car orbits the same twelve. The ring is drawn BEHIND the car
//              so a part can never cover the caption; see .ge-ring in
//              code/css/10-hero.css for the ellipse and the depth maths.
//   scale    — optional width multiplier (default 1). The cut-outs differ
//              wildly in shape — a 911 is long and low, a Touareg short and
//              tall — so one shared CSS width would make the SUVs tower over
//              the sports cars and jolt the stage on every rotation. Tune
//              this so each car lands at roughly the same HEIGHT instead:
//              divide the car's aspect ratio by ~2.2 (the E-Class, scale 1).
// 0 cars = no stage (copy only); 1 car = static; 2+ = auto-rotating showcase.
//
// To add the next car: drop its cut-out in img/hero/ and append an entry —
// nothing else needs touching.
// Spare parts that orbit every car on the stage. Deliberately ONE shared list
// rather than a per-car one: the catalogue is the same for every make, and a
// car entry can still override it with its own `parts` array.
//   brand/part — the two lines on the chip
//   cat        — category slug; clicking the chip filters the catalog
//   img        — optional product photo from img/parts/
//   icon       — Font Awesome glyph used when there is no photo yet. Only four
//                real part photos exist, so the rest borrow the same icon
//                language as the Shop-by-Category tiles. Drop a photo into
//                img/parts/ and swap icon -> img to upgrade one.
// TEN is a deliberate count, and the ceiling for this ellipse. A flat ring
// bunches its items at the left and right extremes, where neighbours are far
// apart vertically but barely apart horizontally. At twelve the spacing was
// 30 degrees, which put ~63px between neighbours at the extremes against a
// 136px chip, and the brand lines overlapped. Ten gives 36 degrees and
// clears. Add an eleventh and something has to get smaller.
// 2026-11-14: all eight are the owner's own cut-out photos, shown
// in their natural shape (no circle). Mahle air filter, Liqui Moly oil and
// every icon-only entry made way for them (a red glyph vanished into the
// red make badge behind the car). Eight spaces them 45 degrees apart.
const HERO_PARTS = [
  { brand: 'Remsa',         part: 'Brake pads',        cat: 'brakes',      img: 'img/parts/remsa-brake-pads.webp' },
  { brand: 'Lemförder',     part: 'Control arm',       cat: 'suspension',  img: 'img/parts/lemforder-control-arm.webp' },
  { brand: 'OEM',           part: 'Suspension & axle', cat: 'suspension',  img: 'img/parts/suspension-assembly.webp' },
  { brand: 'Hella',         part: 'Headlight unit',    cat: 'body-lights', img: 'img/parts/audi-headlight.webp' },
  { brand: 'Bosch',         part: 'Spark plugs',       cat: 'electrical',  img: 'img/parts/bosch-spark-plug.webp' },
  { brand: 'Behr',          part: 'Radiator',          cat: 'cooling',     img: 'img/parts/behr-radiator.webp' },
  { brand: 'Mercedes-AMG',  part: 'Engine & parts',    cat: 'engine',      img: 'img/parts/engine.webp' },
  { brand: 'Body',          part: 'Front bumper',      cat: 'body-lights', img: 'img/parts/front-bumper.webp' }
];

const HERO_CARS = [
  {
    src: 'img/hero/mercedes-e-class.webp', w: 1400,
    srcSmall: 'img/hero/mercedes-e-class-sm.webp', wSmall: 760,
    model: 'E-CLASS',
    make: 'mercedes',
    badge: 'MERCEDES',
    scale: 1,
    alt: 'Mercedes-Benz E-Class sedan',
    callouts: [
      { x: '42%', y: '45%', dx: -295, dy: 70,  img: 'img/parts/audi-headlight.webp',       brand: 'OEM', part: 'Headlight unit', cat: 'body-lights' },
      { x: '94%', y: '66%', dx: 120,  dy: -60, img: 'img/parts/remsa-brake-pads.webp',     brand: 'Remsa', part: 'Brake pads', cat: 'brakes' },
    ],
  },
  {
    src: 'img/hero/bmw-m4.webp', w: 1374,
    srcSmall: 'img/hero/bmw-m4-sm.webp', wSmall: 756,
    model: 'M4',
    make: 'bmw',
    badge: 'BMW',
    scale: 1.09,
    alt: 'BMW M4 coupe',
    callouts: [
      { x: '29%', y: '50%', dx: -225, dy: 80,  img: 'img/parts/audi-headlight.webp',       brand: 'OEM', part: 'Headlight unit', cat: 'body-lights' },
      { x: '93%', y: '69%', dx: 95,   dy: -65, img: 'img/parts/remsa-brake-pads.webp',     brand: 'Remsa', part: 'Brake discs', cat: 'brakes' },
    ],
  },
  {
    src: 'img/hero/porsche-911.webp', w: 1400,
    srcSmall: 'img/hero/porsche-911-sm.webp', wSmall: 760,
    model: '911',
    make: 'porsche',
    badge: 'PORSCHE',
    scale: 1.15,
    alt: 'Porsche 911 Turbo coupe',
    callouts: [
      { x: '41%', y: '85%', dx: -340, dy: 8,   img: 'img/parts/lemforder-control-arm.webp', brand: 'Lemförder', part: 'Control arm', cat: 'suspension' },
      { x: '93%', y: '71%', dx: 85,   dy: -75, img: 'img/parts/remsa-brake-pads.webp',     brand: 'Remsa', part: 'Brake pads', cat: 'brakes' },
    ],
  },
  {
    // Supplied at 640x480, so the cut-out is only 612px wide — noticeably
    // softer than the rest on a large screen. Swap in a bigger press shot
    // when one turns up.
    src: 'img/hero/audi-a6.webp', w: 612,
    srcSmall: 'img/hero/audi-a6-sm.webp', wSmall: 337,
    model: 'A6',
    make: 'audi',
    badge: 'AUDI',
    scale: 0.97,
    alt: 'Audi A6 sedan',
    callouts: [
      { x: '40%', y: '46%', dx: -280, dy: 75,  img: 'img/parts/audi-headlight.webp',       brand: 'OEM', part: 'Headlight unit', cat: 'body-lights' },
      { x: '94%', y: '69%', dx: 125,  dy: -70, img: 'img/parts/remsa-brake-pads.webp',     brand: 'Remsa', part: 'Brake pads', cat: 'brakes' },
    ],
  },
  {
    src: 'img/hero/vw-touareg.webp', w: 1400,
    srcSmall: 'img/hero/vw-touareg-sm.webp', wSmall: 760,
    model: 'TOUAREG',
    make: 'volkswagen',
    badge: 'VOLKSWAGEN',
    scale: 0.84,
    alt: 'Volkswagen Touareg SUV',
    callouts: [
      { x: '56%', y: '85%', dx: -335, dy: 8,   img: 'img/parts/febi-control-arm.webp',      brand: 'febi', part: 'Control arm kit', cat: 'suspension' },
      { x: '95%', y: '69%', dx: 150,  dy: -60, img: 'img/parts/remsa-brake-pads.webp',     brand: 'Remsa', part: 'Brake pads', cat: 'brakes' },
    ],
  },
  {
    // Deliberately no `make`: Land Rover is not in CAR_MAKES, so a
    // "Shop Land Rover parts" button would filter the catalog to nothing.
    // The caption shows the name only. Add make: 'landrover' here AND to
    // CAR_MAKES in both config files once the shop actually stocks it.
    src: 'img/hero/range-rover-sport.webp', w: 1400,
    srcSmall: 'img/hero/range-rover-sport-sm.webp', wSmall: 760,
    model: 'SPORT',
    label: 'Range Rover',
    badge: 'RANGE ROVER',
    scale: 0.9,
    alt: 'Range Rover Sport SUV',
    callouts: [
      { x: '47%', y: '84%', dx: -305, dy: 8,   img: 'img/parts/febi-control-arm.webp',      brand: 'febi', part: 'Control arm kit', cat: 'suspension' },
      { x: '93%', y: '68%', dx: 150,  dy: -60, img: 'img/parts/remsa-brake-pads.webp',     brand: 'Remsa', part: 'Brake pads', cat: 'brakes' },
    ],
  },
];

const HERO_ROTATE_MS = 6500;
const HERO_SHADERS_URL = 'https://cdn.jsdelivr.net/npm/shaders@4.0.5/dist/js/bundle.js';

// German palette: graphite studio, neutral silver key light, red back wash.
const HERO_SHADER_PRESET = {
  components: [
    { type: 'StudioBackground', props: {
      color: '#1b1f26', keyColor: '#eef1f5', keyIntensity: 34, keySoftness: 62,
      fillColor: '#8a95a5', fillIntensity: 12, fillSoftness: 75, fillAngle: 70,
      backColor: '#c1121f', backIntensity: 20, backSoftness: 85,
      brightness: 12, vignette: 25, center: { x: 0.7, y: 0.8 }, lightTarget: 85,
      wallCurvature: 18, ambientIntensity: 45, ambientSpeed: 1.2, seed: 7 } },
    { type: 'Godrays', props: {
      center: { x: 0.72, y: -0.15 }, density: 0.2, intensity: 0.4, spotty: 0.2, speed: 0.2,
      rayColor: '#e8eaed', blendMode: 'screen', opacity: 0.07 } },
    { type: 'CursorTrail', props: {
      colorA: '#ef3b42', colorB: '#8a95a5', radius: 0.7, length: 0.6, shrink: 1, softness: 0.85,
      colorSpace: 'oklab', blendMode: 'screen', opacity: 0.3 } },
    { type: 'Vignette', props: { color: '#0f1115', center: { x: 0.55, y: 0.55 }, radius: 0.7, falloff: 0.65, intensity: 0.75 } },
    { type: 'FilmGrain', props: { strength: 0.04, bias: 3 } },
  ],
};

(function initHeroShowcase() {
  const hero = document.getElementById('showcase');
  if (!hero) return;
  const reduceMotion = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  // ── Car stage ──
  const stage = document.getElementById('heroStage');
  const cars = HERO_CARS.filter(c => c && c.src);
  if (!stage || !cars.length) {
    hero.classList.add('no-car');
  } else {
    hero.classList.remove('no-car');
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    const makeName = slug => {
      const m = (typeof CAR_MAKES !== 'undefined' && Array.isArray(CAR_MAKES)) ? CAR_MAKES.find(x => x.slug === slug) : null;
      return m ? m.label : '';
    };
    stage.innerHTML = cars.map((c, i) => {
      const label = c.label || makeName(c.make);
      const scale = Number(c.scale) > 0 ? Number(c.scale) : 1;
      const model = String(c.model || '').trim();
      // The giant badge is the MAKE; the model stays down in the caption.
      const badgeText = String(c.badge || label || model).trim().toUpperCase();

      // The badge is SVG rather than styled text because the outline carries a
      // gradient, and -webkit-text-stroke only takes a flat colour. The glyphs
      // are drawn at a nominal 280px and the viewBox scales them to the stage,
      // so the stroke thins out proportionally instead of staying chunky.
      const vbW = Math.max(360, badgeText.length * 190 + 60);
      const badge = !badgeText ? '' : `
          <svg class="ge-car-model" viewBox="0 0 ${vbW} 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="geModelGrad${i}" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#c1121f" />
                <stop offset="52%" stop-color="#ef3b42" />
                <stop offset="100%" stop-color="#ffffff" />
              </linearGradient>
            </defs>
            <text x="${vbW / 2}" y="252" text-anchor="middle" fill="none" stroke="url(#geModelGrad${i})"
                  stroke-width="4" font-family="Inter, system-ui, sans-serif" font-size="280"
                  font-weight="800" letter-spacing="8">${esc(badgeText)}</text>
          </svg>`;

      const name = c.name || [label, model].filter(Boolean).join(' ');
      const arw = '<i class="fa fa-arrow-right" aria-hidden="true"></i>';
      // A car filters by make; a part slide filters by category instead.
      const cta = c.make
        ? `<button type="button" class="ge-car-caption" data-make="${esc(c.make)}">${esc(c.ctaText || ('Shop ' + label + ' parts'))} ${arw}</button>`
        : c.cat
        ? `<button type="button" class="ge-car-caption" data-cat="${esc(c.cat)}">${esc(c.ctaText || ('Shop ' + name))} ${arw}</button>`
        : '';
      const caption = !name ? '' : `
          <figcaption class="ge-car-cap">
            <span class="ge-car-cap-lead">${esc(c.lead || 'Genuine parts for the')}</span>
            <strong class="ge-car-cap-name">${esc(name)}</strong>
            ${cta}
          </figcaption>`;

      // ONLY the first slide loads with the page. The other five are stacked
      // in the same place at opacity:0 — inside the viewport, so loading=lazy
      // never deferred them — and together they were ~400 KB of the first
      // load. On a phone they starved both the LCP image and the catalog
      // fetches: measured Nov 2026 on Slow 4G / 4x CPU, LCP was 5.0s and the
      // product grid's first Supabase request did not even start until 4.3s.
      // So they ship with data-src/data-srcset and hydrate() below turns them
      // on one slide AHEAD of the rotation, which is 6.5s of warning — the
      // swap never waits on a download.
      const pre = i === 0 ? '' : 'data-';
      // The 240px below is a deliberate DPR CAP, not the real slot — the car
      // genuinely occupies ~82vw there. srcset picks on slot x DPR, so the
      // honest "92vw" asked for 1077px on a 390px/3x phone and landed on the
      // 1400w file: 113 KB for a 359 CSS px picture, and the single biggest
      // item on the critical path (LCP resource load was 3.9s of a 5.0s LCP
      // on Slow 4G). Capping the request at 240 CSS px means 240x3 = 720,
      // just under the 760w copy, so every phone gets the ~46 KB file at
      // roughly 2.1x density — past the point more pixels are visible on a
      // photo this size. It only ever steers the srcset choice; the rendered
      // width comes from .ge-car-tilt in the CSS and is unaffected.
      // ⚠️ The <link rel=preload> in index.html repeats this srcset and sizes
      // and the two must stay character-for-character identical, or the
      // preload scanner resolves a different candidate than the <img> does
      // and the whole download is thrown away.
      const srcset = (c.srcSmall && c.w && c.wSmall)
        ? ` ${pre}srcset="${esc(c.srcSmall)} ${c.wSmall}w, ${esc(c.src)} ${c.w}w" sizes="(max-width: 600px) 240px, (max-width: 900px) 92vw, ${Math.round(720 * scale)}px"`
        : '';
      // --car feeds the sheen's mask in code/css/10-hero.css, and it is NOT
      // set here: paintMask() below copies it off the <img> once the browser
      // has picked a candidate. Hardcoding c.src made the mask a SECOND,
      // independent reference to the full-size file, so every desktop slide
      // downloaded both the 1400w (for the mask) and whatever srcset chose
      // for the img — and because the big one landed in the cache first, the
      // img then preferred it and the preloaded 760w copy was thrown away
      // (Chrome logs exactly that as a wasted-preload warning). Reading
      // currentSrc instead means the mask can never cost a byte of its own,
      // at any DPR, and it arrives already absolute — which is what the
      // custom property needs, since a relative URL inside one resolves
      // against code/css/, not the page.

      // The orbiting parts ring. Rendered as a sibling of .ge-car-tilt (NOT
      // inside .ge-car-float) so it orbits the stage rather than bobbing with
      // the car, and so it can sit on its own z-layer behind the bodywork.
      //
      // Every item is a pure translate onto an ellipse — no rotation is ever
      // applied, so nothing has to be counter-rotated to stay upright. The
      // single animated angle lives on the parent as --ge-orbit and each item
      // adds its own fixed offset, which keeps all twelve in step with one
      // animation instead of twelve that can drift.
      const partList = (Array.isArray(c.parts) && c.parts.length) ? c.parts : HERO_PARTS;
      const ringItems = partList.map((p, pi) => {
        if (!p || !p.part) return '';
        const media = p.img
          ? `<img class="ge-ring-img" ${pre}src="${esc(p.img)}" alt="" loading="lazy" decoding="async" />`
          : `<i class="fa ${esc(p.icon || 'fa-gear')} ge-ring-icon" aria-hidden="true"></i>`;
        const inner =
          `<span class="ge-ring-face">${media}<span class="ge-ring-txt">` +
            (p.brand ? `<span class="ge-ring-brand">${esc(p.brand)}</span>` : '') +
            `<span class="ge-ring-part">${esc(p.part)}</span>` +
          `</span></span>`;
        const label = (p.brand ? p.brand + ' ' : '') + p.part;
        return p.cat
          ? `<button type="button" class="ge-ring-item" style="--i:${pi}" data-cat="${esc(p.cat)}" aria-label="${esc(label)}">${inner}</button>`
          : `<span class="ge-ring-item" style="--i:${pi}">${inner}</span>`;
      }).join('');
      // No aria-hidden here: the ring and the phone chip row below are the
      // same parts, and whichever one is display:none drops out of the
      // accessibility tree on its own, so neither is announced twice.
      const ring = ringItems
        ? `<div class="ge-ring" style="--n:${partList.length}">${ringItems}</div>`
        : '';

      // Phone treatment for those same parts. The ring needs empty stage all
      // around the car and there is none at 390px, so below 1025px it is
      // display:none and this row takes over: same photo or icon, same brand
      // and part, same jumpCat() target, in a row under the car.
      const chips = partList.map((p) => {
        if (!p || !p.part) return '';
        const thumb = p.img
          ? `<img class="ge-car-chip-img" ${pre}src="${esc(p.img)}" alt="" loading="lazy" decoding="async" />`
          : `<i class="fa ${esc(p.icon || 'fa-gear')} ge-car-chip-icon" aria-hidden="true"></i>`;
        const inner =
          `${thumb}<span class="ge-ring-txt">` +
            (p.brand ? `<span class="ge-ring-brand">${esc(p.brand)}</span>` : '') +
            `<span class="ge-ring-part">${esc(p.part)}</span>` +
          `</span>`;
        return p.cat
          ? `<li><button type="button" class="ge-car-chip" data-cat="${esc(p.cat)}">${inner}</button></li>`
          : `<li><span class="ge-car-chip">${inner}</span></li>`;
      }).join('');
      const chipList = chips ? `<ul class="ge-car-chips">${chips}</ul>` : '';

      return `
      <figure class="ge-car${i === 0 ? ' is-active' : ''}"${i ? ' aria-hidden="true"' : ''}>
        ${badge}
        ${ring}
        <div class="ge-car-tilt" style="--scale:${scale}">
          <div class="ge-car-float">
            <div class="ge-car-body">
              <img class="ge-car-img" ${pre}src="${esc(c.src)}"${srcset} alt="${esc(c.alt || name || 'German car')}" ${i ? '' : 'fetchpriority="high"'} decoding="async" draggable="false" />
              <span class="ge-car-sheen" aria-hidden="true"></span>
            </div>
            <span class="ge-car-shadow" aria-hidden="true"></span>
          </div>
        </div>
        ${chipList}
        ${caption}
      </figure>`;
    }).join('') + (cars.length > 1
      ? `<button type="button" class="ge-car-nav prev" data-nav="-1" aria-label="Previous car">
           <i class="fa fa-chevron-left" aria-hidden="true"></i>
         </button>
         <button type="button" class="ge-car-nav next" data-nav="1" aria-label="Next car">
           <i class="fa fa-chevron-right" aria-hidden="true"></i>
         </button>
         <div class="ge-car-dots" role="group" aria-label="Choose car">${cars.map((c, i) =>
          `<button type="button" data-go="${i}" aria-label="Car ${i + 1}"${i === 0 ? ' aria-current="true"' : ''}></button>`).join('')}</div>`
      : '');

    const figs = Array.from(stage.querySelectorAll('.ge-car'));
    const dots = Array.from(stage.querySelectorAll('[data-go]'));
    let cur = 0, timer = null;

    // Slide 0 shipped with real src/srcset; every other slide shipped with
    // data-src (see the markup above). Swapping them in is all "hydrating"
    // means here. Always called for the slide AFTER the one being shown, so
    // the file has a full HERO_ROTATE_MS to arrive before anyone sees it.
    // Points the sheen's mask at the exact file the browser chose for this
    // slide's <img>, so the mask never triggers a download of its own.
    // currentSrc is only filled in once a candidate has been picked, hence
    // the load listener for an image that has not arrived yet.
    function paintMask(f) {
      const img = f.querySelector('.ge-car-img');
      const body = f.querySelector('.ge-car-body');
      if (!img || !body) return;
      const apply = () => {
        if (img.currentSrc) body.style.setProperty('--car', "url('" + img.currentSrc + "')");
      };
      if (img.complete && img.currentSrc) apply();
      else img.addEventListener('load', apply, { once: true });
    }

    if (figs[0]) { figs[0].dataset.hydrated = '1'; paintMask(figs[0]); }
    function hydrate(n) {
      const f = figs[n];
      if (!f || f.dataset.hydrated) return;
      f.dataset.hydrated = '1';
      f.querySelectorAll('img[data-src]').forEach(img => {
        const ss = img.getAttribute('data-srcset');
        if (ss) { img.setAttribute('srcset', ss); img.removeAttribute('data-srcset'); }
        img.setAttribute('src', img.getAttribute('data-src'));
        img.removeAttribute('data-src');
      });
      paintMask(f);
    }

    function show(n) {
      if (n === cur || !figs[n]) return;
      hydrate(n);
      hydrate((n + 1) % figs.length);
      const prev = figs[cur];
      prev.classList.remove('is-active'); prev.classList.add('is-leaving'); prev.setAttribute('aria-hidden', 'true');
      setTimeout(() => prev.classList.remove('is-leaving'), 1100);
      figs[n].classList.add('is-active'); figs[n].removeAttribute('aria-hidden');
      dots.forEach((d, i) => { if (i === n) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      cur = n;
    }
    function restart() {
      clearInterval(timer);
      if (figs.length > 1 && !document.hidden) timer = setInterval(() => show((cur + 1) % figs.length), HERO_ROTATE_MS);
    }
    // Wrap both ways, and push the auto-advance back so a deliberate click
    // isn't immediately overridden by the timer that was already running.
    function step(delta) {
      show((cur + delta + figs.length) % figs.length);
      restart();
    }

    // Caption → filter the catalog (by make for a car, by category for a
    // part slide) and jump to the parts grid; dots/arrows → switch slide.
    const toProducts = () => {
      const p = document.getElementById('products');
      if (p) p.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    stage.addEventListener('click', e => {
      const cap = e.target.closest('.ge-car-caption[data-make]');
      if (cap && typeof setMakeFilter === 'function') {
        setMakeFilter(cap.dataset.make);
        toProducts();
        return;
      }
      // Matches the caption button AND the part-callout cards.
      const catCap = e.target.closest('[data-cat]');
      if (catCap && typeof jumpCat === 'function') {
        jumpCat(catCap.dataset.cat);
        toProducts();
        return;
      }
      const dot = e.target.closest('[data-go]');
      if (dot) { show(+dot.dataset.go); restart(); return; }
      const arrow = e.target.closest('[data-nav]');
      if (arrow) { step(+arrow.dataset.nav); }
    });

    // Left/right keys once focus is inside the stage (e.g. after using an arrow).
    stage.addEventListener('keydown', e => {
      if (figs.length < 2) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    });

    // Slide 2 is the first one the rotation will reach, so warm it as soon
    // as the page is otherwise done — never before, or it is straight back
    // to competing with the LCP image and the catalog fetches.
    if (figs.length > 1) {
      const warm = () => hydrate(1);
      const soon = () => (window.requestIdleCallback
        ? requestIdleCallback(warm, { timeout: 3000 })
        : setTimeout(warm, 800));
      if (document.readyState === 'complete') soon();
      else window.addEventListener('load', soon, { once: true });
    }

    if (figs.length > 1) {
      restart();
      document.addEventListener('visibilitychange', restart);
      stage.addEventListener('mouseenter', () => clearInterval(timer));
      stage.addEventListener('mouseleave', restart);
    }

    // Once the stage has scrolled away it is still swapping slides every
    // 6.5s and running three infinite animations — constant compositor work
    // for something nobody is looking at, which on a phone is exactly what
    // makes the rest of the page feel sticky. Stop both until it comes back.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        const visible = entries.some(e => e.isIntersecting);
        hero.classList.toggle('is-idle', !visible);
        if (visible) restart(); else clearInterval(timer);
        // Stop the WebGPU draw loop too, not just the CSS animations — see
        // setShaderRunning() at the bottom of this file.
        if (window._geHeroShaderRunning) window._geHeroShaderRunning(visible);
      }, { threshold: 0.08 }).observe(hero);
      // A backgrounded tab should not be drawing the hero either.
      document.addEventListener('visibilitychange', () => {
        if (!window._geHeroShaderRunning) return;
        window._geHeroShaderRunning(!document.hidden && !hero.classList.contains('is-idle'));
      });
    }

    // 3D tilt following the pointer (mouse/pen only — touch keeps the idle float)
    if (!reduceMotion && window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let raf = 0, rx = 0, ry = 0;
      const apply = () => {
        raf = 0;
        figs.forEach(f => { const t = f.firstElementChild; t.style.setProperty('--rx', rx + 'deg'); t.style.setProperty('--ry', ry + 'deg'); });
      };
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        ry = ((e.clientX - r.left) / r.width - 0.5) * 16;   // left/right swing
        rx = -((e.clientY - r.top) / r.height - 0.5) * 7;   // slight pitch
        if (!raf) raf = requestAnimationFrame(apply);
      });
      hero.addEventListener('pointerleave', () => { rx = ry = 0; if (!raf) raf = requestAnimationFrame(apply); });
    }
  }

  // ── WebGPU background ──
  // Loaded after the page is ready (~575 KB from jsDelivr), only where it can
  // actually run; the CSS gradient in .ge-hero-bg stays as the fallback.
  const canvas = document.getElementById('heroShader');
  const conn = navigator.connection || {};
  // Desktop only. On a phone this is the single most expensive thing on the
  // page — a 575 KB module plus a full-screen WebGPU draw every frame, on a
  // GPU that is also compositing the rest of the site — and the CSS gradient
  // underneath already reads as the same studio at that size.
  const bigScreen = !window.matchMedia || matchMedia('(min-width: 901px)').matches;
  if (!canvas || !('gpu' in navigator) || reduceMotion || conn.saveData || !bigScreen) return;
  let started = false;
  // The instance is kept so the draw loop can be STOPPED. Without this it
  // renders a full-screen WebGPU frame forever at the display's refresh rate
  // — 165Hz on the owner's PC — including while the hero is scrolled far off
  // screen and nobody can see it. The .is-idle class only ever paused the CSS
  // animations; the canvas kept going, a standing GPU tax on every scroll.
  let shader = null;
  let shaderPaused = false;
  const setShaderRunning = run => {
    if (!shader) return;
    try {
      if (run && shaderPaused) { shader.resume(); shaderPaused = false; }
      else if (!run && !shaderPaused) { shader.pause(); shaderPaused = true; }
    } catch (e) { /* older build with no pause/resume — leave it running */ }
  };
  // The IntersectionObserver may fire before the module finishes loading, so
  // remember what it asked for and apply it on arrival.
  let wantShaderRunning = true;
  const start = () => {
    if (started) return; started = true;
    import(HERO_SHADERS_URL)
      .then(({ createShader }) => createShader(canvas, HERO_SHADER_PRESET, {
        disableTelemetry: true,
        onReady: () => hero.classList.add('shader-on'),
        onError: () => hero.classList.remove('shader-on'),
      }))
      .then(inst => { shader = inst; setShaderRunning(wantShaderRunning); })
      .catch(() => hero.classList.remove('shader-on'));
  };
  // Exposed so the stage's own IntersectionObserver further up — which already
  // tracks whether the hero is on screen — and the tab-visibility handler can
  // stop the draw loop.
  window._geHeroShaderRunning = run => { wantShaderRunning = run; setShaderRunning(run); };
  const later = () => (window.requestIdleCallback ? requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 600));
  if (document.readyState === 'complete') later();
  else window.addEventListener('load', later, { once: true });
})();
