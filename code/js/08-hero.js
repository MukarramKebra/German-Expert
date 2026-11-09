// ── HERO SHOWCASE ───────────────────────────────────────────────────────────
// Animated WebGPU background + 3D car stage for #showcase in index.html.
// Styles: code/css/10-hero.css.

// Cars on the hero stage: the model badge is drawn huge and outlined, with the
// car standing in front of it. Use transparent cut-out PNG/WebP files (3/4 or
// side view) stored under img/hero/ — a photo that still has its own
// background shows up as a rectangle covering the lettering.
//   src      — image path (relative to the site root)
//   srcSmall — optional smaller copy of the same cut-out, served to phones
//   model    — the giant outlined badge behind the car ('A6', 'M4', 'GT3' …)
//   make     — optional CAR_MAKES slug ('mercedes', 'bmw', …): makes the
//              caption a "Shop <Make> parts" button that filters the catalog
//   label    — optional make name (defaults to the CAR_MAKES label)
//   lead     — optional small line above the name
// 0 cars = no stage (copy only); 1 car = static; 2+ = auto-rotating showcase.
//
// To add the next car: drop its cut-out in img/hero/ and append an entry —
// nothing else needs touching.
const HERO_CARS = [
  {
    src: 'img/hero/audi-a6.webp',
    srcSmall: 'img/hero/audi-a6-sm.webp',
    model: 'A6',
    make: 'audi',
    alt: 'Audi A6 sedan',
  },
];

const HERO_ROTATE_MS = 6500;
const HERO_SHADERS_URL = 'https://cdn.jsdelivr.net/npm/shaders@4.0.5/dist/js/bundle.js';

// German palette: graphite studio, gold key light, red back wash.
const HERO_SHADER_PRESET = {
  components: [
    { type: 'StudioBackground', props: {
      color: '#1b1f26', keyColor: '#ffd36b', keyIntensity: 34, keySoftness: 62,
      fillColor: '#8a95a5', fillIntensity: 12, fillSoftness: 75, fillAngle: 70,
      backColor: '#c1121f', backIntensity: 20, backSoftness: 85,
      brightness: 12, vignette: 25, center: { x: 0.7, y: 0.8 }, lightTarget: 85,
      wallCurvature: 18, ambientIntensity: 45, ambientSpeed: 1.2, seed: 7 } },
    { type: 'Godrays', props: {
      center: { x: 0.72, y: -0.15 }, density: 0.2, intensity: 0.4, spotty: 0.2, speed: 0.2,
      rayColor: '#f2b705', blendMode: 'screen', opacity: 0.07 } },
    { type: 'CursorTrail', props: {
      colorA: '#f2b705', colorB: '#c1121f', radius: 0.7, length: 0.6, shrink: 1, softness: 0.85,
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
      const model = String(c.model || '').trim();

      // The badge is SVG rather than styled text because the outline carries a
      // gradient, and -webkit-text-stroke only takes a flat colour. The glyphs
      // are drawn at a nominal 280px and the viewBox scales them to the stage,
      // so the stroke thins out proportionally instead of staying chunky.
      const vbW = Math.max(360, model.length * 190 + 60);
      const badge = !model ? '' : `
          <svg class="ge-car-model" viewBox="0 0 ${vbW} 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="geModelGrad${i}" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#c1121f" />
                <stop offset="52%" stop-color="#f2b705" />
                <stop offset="100%" stop-color="#fff1c6" />
              </linearGradient>
            </defs>
            <text x="${vbW / 2}" y="252" text-anchor="middle" fill="none" stroke="url(#geModelGrad${i})"
                  stroke-width="4" font-family="Inter, system-ui, sans-serif" font-size="280"
                  font-weight="800" letter-spacing="8">${esc(model)}</text>
          </svg>`;

      const name = [label, model].filter(Boolean).join(' ');
      const cta = !label ? '' : c.make
        ? `<button type="button" class="ge-car-caption" data-make="${esc(c.make)}">Shop ${esc(label)} parts <i class="fa fa-arrow-right" aria-hidden="true"></i></button>`
        : '';
      const caption = !name ? '' : `
          <figcaption class="ge-car-cap">
            <span class="ge-car-cap-lead">${esc(c.lead || 'Genuine parts for the')}</span>
            <strong class="ge-car-cap-name">${esc(name)}</strong>
            ${cta}
          </figcaption>`;

      const srcset = c.srcSmall ? ` srcset="${esc(c.srcSmall)} 760w, ${esc(c.src)} 1400w" sizes="(max-width: 900px) 92vw, 920px"` : '';
      // --car feeds the sheen's mask in code/css/10-hero.css. A relative URL
      // in a custom property gets resolved against the stylesheet that reads
      // it, i.e. code/css/, so it has to go in already absolute.
      const maskUrl = new URL(c.src, document.baseURI).href;
      return `
      <figure class="ge-car${i === 0 ? ' is-active' : ''}"${i ? ' aria-hidden="true"' : ''}>
        ${badge}
        <div class="ge-car-tilt">
          <div class="ge-car-float">
            <div class="ge-car-body" style="--car:url('${esc(maskUrl)}')">
              <img class="ge-car-img" src="${esc(c.src)}"${srcset} alt="${esc(c.alt || name || 'German car')}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async" draggable="false" />
              <span class="ge-car-sheen" aria-hidden="true"></span>
            </div>
            <span class="ge-car-shadow" aria-hidden="true"></span>
          </div>
        </div>
        ${caption}
      </figure>`;
    }).join('') + (cars.length > 1
      ? `<div class="ge-car-dots" role="group" aria-label="Choose car">${cars.map((c, i) =>
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

    // Caption → filter the catalog by make and jump to the parts grid; dots → switch car
    stage.addEventListener('click', e => {
      const cap = e.target.closest('.ge-car-caption[data-make]');
      if (cap && typeof setMakeFilter === 'function') {
        setMakeFilter(cap.dataset.make);
        const p = document.getElementById('products');
        if (p) p.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        return;
      }
      const dot = e.target.closest('[data-go]');
      if (dot) { show(+dot.dataset.go); restart(); }
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
