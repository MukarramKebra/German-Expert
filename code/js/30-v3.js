// ═══════════════════════════════════════════════════════════
// v3 look (v2.html) — scroll-driven parts board.
// The hero section is 240vh tall with a sticky 100vh stage inside. This file turns
// the scroll position through that section into --p (0 to 1) on the section; the
// CSS in 30-v3.css moves each part from off-screen to its slot as a function of --p.
// There is NO timer and NO looping animation: scroll down and the parts arrive,
// scroll up and they leave, stop and everything stops. prefers-reduced-motion
// gets the finished board with no scroll effect at all.
// Every entry point checks for its own element, so on any other page this does nothing.
// ═══════════════════════════════════════════════════════════
(function v3Scene() {
  var scene = document.getElementById('v3Scene');
  if (!scene) return;
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduce) { scene.classList.add('v3-static'); scene.style.setProperty('--p', '1'); return; }

  var queued = false;
  function update() {
    queued = false;
    var r = scene.getBoundingClientRect();
    var span = r.height - window.innerHeight;
    var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 1;
    scene.style.setProperty('--p', p.toFixed(4));
  }
  function request() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  update();
})();

// Car cards: slide up once as they scroll into view (no repeat, no loop).
(function v3CarReveal() {
  var row = document.querySelector('.v3-car-row');
  if (!row || !('IntersectionObserver' in window)) return;
  var items = row.querySelectorAll('.v3-car-li');
  items.forEach(function (li, i) { li.style.setProperty('--d', (i * 60) + 'ms'); li.classList.add('v3-pre'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.remove('v3-pre'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 60px 0px 0px', threshold: 0.15 });
  items.forEach(function (li) { io.observe(li); });
})();
