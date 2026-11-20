/* Screenshot carousels: swipe, arrows (pointer devices) and one dot per scroll position. */
(function () {
  var ARROW = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function setup(root) {
    var track = root.querySelector('.shots');
    var slides = Array.prototype.slice.call(track.children);
    if (slides.length < 2) return;
    var prev = document.createElement('button');
    var next = document.createElement('button');
    prev.type = next.type = 'button';
    prev.className = 'carousel-btn prev';
    next.className = 'carousel-btn next';
    prev.setAttribute('aria-label', 'Previous screenshot');
    next.setAttribute('aria-label', 'Next screenshot');
    prev.innerHTML = ARROW;
    next.innerHTML = ARROW.replace('M15 5l-7 7 7 7', 'M9 5l7 7-7 7');
    var dots = document.createElement('div');
    dots.className = 'dots';
    dots.setAttribute('role', 'group');
    dots.setAttribute('aria-label', 'Choose a screenshot');
    root.insertBefore(prev, track);
    root.appendChild(next);
    root.appendChild(dots);
    var pages = 0;
    function step() { return slides[1].offsetLeft - slides[0].offsetLeft; }
    function maxScroll() { return track.scrollWidth - track.clientWidth; }
    function pageCount() { return maxScroll() <= 4 ? 1 : Math.round(maxScroll() / step()) + 1; }
    function current() {
      if (track.scrollLeft >= maxScroll() - 4) return pages - 1;
      return Math.min(pages - 1, Math.round(track.scrollLeft / step()));
    }
    function go(i) { track.scrollTo({ left: Math.max(0, Math.min(i * step(), maxScroll())), behavior: 'smooth' }); }
    function build() {
      var n = pageCount();
      if (n === pages) return;
      pages = n;
      dots.innerHTML = '';
      for (var i = 0; i < n; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Go to screenshot ' + (i + 1));
        dot.addEventListener('click', go.bind(null, i));
        dots.appendChild(dot);
      }
      dots.hidden = n < 2;
    }
    function update() {
      build();
      var i = current();
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= maxScroll() - 4;
      Array.prototype.forEach.call(dots.children, function (dot, j) {
        dot.setAttribute('aria-current', j === i ? 'true' : 'false');
      });
    }
    prev.addEventListener('click', function () { go(current() - 1); });
    next.addEventListener('click', function () { go(current() + 1); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current() - 1); }
    });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    update();
  }
  Array.prototype.forEach.call(document.querySelectorAll('.carousel'), setup);
})();
