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
//   callouts — parts to annotate ON the car: a red dot on the part, a red
//              leader line out into the empty black space beside the car,
//              and a labelled card at the end. Each one is
//              { x, y, dx, dy, brand, part, cat, img }.
//              dx/dy are the label's pixel offset FROM the dot, and the
//              line is rotated to match — so put x/y exactly on the part
//              and aim dx/dy at whatever black space is actually free.
//              Mind the caption in the bottom-right and the giant badge.
//              x/y are percentages of the CAR IMAGE box, so a callout
//              tracks the car at every width.
//              `cat` makes the card clickable (filters that category).
//              `img` is an optional product photo for the card.
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
      { x: '42%', y: '50%', dx: -315, dy: 70,   brand: 'Hella', part: 'Headlight unit', cat: 'body-lights' },
      { x: '92%', y: '78%', dx: 150,  dy: -165, brand: 'Remsa', part: 'Brake pads', cat: 'brakes' },
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
      { x: '30%', y: '50%', dx: -230, dy: 80,   brand: 'Hella', part: 'Headlight unit', cat: 'body-lights' },
      { x: '90%', y: '75%', dx: 150,  dy: -160, brand: 'Remsa', part: 'Brake discs', cat: 'brakes' },
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
      { x: '18%', y: '40%', dx: -200, dy: 90,   brand: 'Hella', part: 'Headlight unit', cat: 'body-lights' },
      { x: '84%', y: '74%', dx: 160,  dy: -150, brand: 'Remsa', part: 'Brake pads', cat: 'brakes' },
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
      { x: '40%', y: '48%', dx: -292, dy: 80,   brand: 'Hella', part: 'Headlight unit', cat: 'body-lights' },
      { x: '90%', y: '76%', dx: 150,  dy: -160, brand: 'Remsa', part: 'Brake pads', cat: 'brakes' },
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
      { x: '46%', y: '45%', dx: -292, dy: 70,   brand: 'Hella', part: 'Headlight unit', cat: 'body-lights' },
      { x: '90%', y: '66%', dx: 150,  dy: -140, brand: 'Remsa', part: 'Brake pads', cat: 'brakes' },
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
      { x: '22%', y: '40%', dx: -210, dy: 90,   brand: 'Hella', part: 'Headlight unit', cat: 'body-lights' },
      { x: '88%', y: '64%', dx: 150,  dy: -140, brand: 'Remsa', part: 'Brake pads', cat: 'brakes' },
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

      const srcset = (c.srcSmall && c.w && c.wSmall)
        ? ` srcset="${esc(c.srcSmall)} ${c.wSmall}w, ${esc(c.src)} ${c.w}w" sizes="(max-width: 900px) 92vw, ${Math.round(720 * scale)}px"`
        : '';
      // --car feeds the sheen's mask in code/css/10-hero.css. A relative URL
      // in a custom property gets resolved against the stylesheet that reads
      // it, i.e. code/css/, so it has to go in already absolute.
      const maskUrl = new URL(c.src, document.baseURI).href;

      // Part callouts. Rendered inside .ge-car-float so each dot stays
      // glued to its part while the car bobs instead of drifting off it.
      const callouts = (Array.isArray(c.callouts) ? c.callouts : []).map(co => {
        if (!co || !co.part) return '';
        // dx/dy place the LABEL relative to the dot, in px. The line is a
        // single div rotated to match, so a callout can point in any
        // direction and the dot can stay exactly on the part.
        const dx = Number.isFinite(co.dx) ? co.dx : -200;
        const dy = Number.isFinite(co.dy) ? co.dy : 0;
        const sideCls = dx < 0 ? 'left' : 'right';
        const len = Math.round(Math.hypot(dx, dy));
        const ang = (Math.atan2(dy, dx) * 180 / Math.PI).toFixed(2);
        const thumb = co.img
          ? `<img class="ge-callout-img" src="${esc(co.img)}" alt="" loading="lazy" decoding="async" />`
          : '';
        const inner =
          `${thumb}<span class="ge-callout-txt">` +
            (co.brand ? `<span class="ge-callout-brand">${esc(co.brand)}</span>` : '') +
            `<span class="ge-callout-part">${esc(co.part)}</span>` +
          `</span>`;
        const card = co.cat
          ? `<button type="button" class="ge-callout-card" data-cat="${esc(co.cat)}">${inner}</button>`
          : `<span class="ge-callout-card">${inner}</span>`;
        return `
            <div class="ge-callout ${sideCls}" style="--cx:${esc(co.x || '50%')};--cy:${esc(co.y || '50%')};--dx:${dx}px;--dy:${dy}px;--len:${len}px;--ang:${ang}deg">
              <span class="ge-callout-dot" aria-hidden="true"></span>
              <span class="ge-callout-line" aria-hidden="true"></span>
              ${card}
            </div>`;
      }).join('');
      return `
      <figure class="ge-car${i === 0 ? ' is-active' : ''}"${i ? ' aria-hidden="true"' : ''}>
        ${badge}
        <div class="ge-car-tilt" style="--scale:${scale}">
          <div class="ge-car-float">
            <div class="ge-car-body" style="--car:url('${esc(maskUrl)}')">
              <img class="ge-car-img" src="${esc(c.src)}"${srcset} alt="${esc(c.alt || name || 'German car')}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async" draggable="false" />
              <span class="ge-car-sheen" aria-hidden="true"></span>
            </div>
            <span class="ge-car-shadow" aria-hidden="true"></span>
            ${callouts}
          </div>
        </div>
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
    function show(n) {
      if (n === cur || !figs[n]) return;
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

    if (figs.length > 1) {
      restart();
      document.addEventListener('visibilitychange', restart);
      stage.addEventListener('mouseenter', () => clearInterval(timer));
      stage.addEventListener('mouseleave', restart);
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
  if (!canvas || !('gpu' in navigator) || reduceMotion || conn.saveData) return;
  let started = false;
  const start = () => {
    if (started) return; started = true;
    import(HERO_SHADERS_URL)
      .then(({ createShader }) => createShader(canvas, HERO_SHADER_PRESET, {
        disableTelemetry: true,
        onReady: () => hero.classList.add('shader-on'),
        onError: () => hero.classList.remove('shader-on'),
      }))
      .catch(() => hero.classList.remove('shader-on'));
  };
  const later = () => (window.requestIdleCallback ? requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 600));
  if (document.readyState === 'complete') later();
  else window.addEventListener('load', later, { once: true });
})();
