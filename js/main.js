(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  /* ------------------------------------------------------------------
     Intro: start the hero sequence once fonts are ready
     ------------------------------------------------------------------ */
  const start = () => requestAnimationFrame(() => body.classList.add('is-loaded'));
  Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((resolve) => setTimeout(resolve, 1200)),
  ]).then(start);

  /* ------------------------------------------------------------------
     Split text helpers (statement words, wordmark letters)
     ------------------------------------------------------------------ */
  const statement = document.querySelector('[data-words]');
  let words = [];
  if (statement) {
    const parts = statement.textContent.trim().split(/\s+/);
    statement.setAttribute('aria-label', statement.textContent.trim());
    statement.innerHTML = parts.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
    words = [...statement.querySelectorAll('.w')];
    if (reduceMotion) words.forEach((w) => w.classList.add('is-on'));
  }

  document.querySelectorAll('[data-chars]').forEach((el) => {
    el.innerHTML = [...el.textContent.trim()]
      .map((c, i) => `<span class="ch" aria-hidden="true" style="--i:${i}">${c}</span>`)
      .join('');
    el.setAttribute('data-reveal-self', '');
  });

  /* ------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-self]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-in'));
  }

  /* ------------------------------------------------------------------
     Nav: scrolled state, hide on scroll down, progress bar
     ------------------------------------------------------------------ */
  const nav = document.getElementById('nav');
  const progress = document.querySelector('.progress span');
  let lastY = window.scrollY;

  const parallaxImgs = reduceMotion ? [] : [...document.querySelectorAll('[data-parallax]')];

  // Parallax layers: [data-speed] > 0 lags behind the scroll, < 0 runs ahead.
  // Each layer rests at its natural position when centred in the viewport
  // (or at the top of the page, for layers that start in the first screen).
  const layerMq = window.matchMedia('(min-width: 900px)');
  const layers = reduceMotion ? [] : [...document.querySelectorAll('[data-speed]')].map((el) => ({
    el,
    speed: parseFloat(el.dataset.speed) || 0,
    rest: 0,
  }));

  const docTop = (el) => {
    let top = 0;
    for (let n = el; n; n = n.offsetParent) top += n.offsetTop;
    return top;
  };

  function measureLayers() {
    const vh = window.innerHeight;
    for (const l of layers) {
      const center = docTop(l.el) + l.el.offsetHeight / 2;
      l.rest = center < vh ? 0 : center - vh / 2;
    }
  }

  function onScroll() {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = root.scrollHeight - vh;

    nav.classList.toggle('is-scrolled', y > 8);
    if (!body.classList.contains('menu-open')) {
      if (y > lastY && y > 240) nav.classList.add('is-hidden');
      else if (y < lastY - 4 || y <= 240) nav.classList.remove('is-hidden');
    }
    lastY = y;

    if (progress) progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);

    // Parallax photos
    for (const img of parallaxImgs) {
      const box = img.parentElement.getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) continue;
      const factor = parseFloat(img.dataset.parallax) || 0.05;
      const offset = (box.top + box.height / 2 - vh / 2) * -factor;
      const limit = box.height * 0.09;
      img.style.setProperty('--py', `${clamp(offset, -limit, limit).toFixed(1)}px`);
    }

    // Parallax layers (desktop only — stacked mobile layouts would overlap)
    for (const l of layers) {
      const offset = layerMq.matches ? (y - l.rest) * l.speed : 0;
      l.el.style.setProperty('--sy', `${offset.toFixed(1)}px`);
    }

    // Statement: light up word by word while scrolling through it
    if (words.length && !reduceMotion) {
      const r = statement.getBoundingClientRect();
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('is-on', i < lit));
    }
  }

  let ticking = false;
  const requestScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  };
  window.addEventListener('scroll', requestScroll, { passive: true });
  const remeasure = () => { measureLayers(); requestScroll(); };
  window.addEventListener('resize', remeasure);
  window.addEventListener('load', remeasure);
  if (document.fonts) document.fonts.ready.then(remeasure);
  measureLayers();
  onScroll();

  /* ------------------------------------------------------------------
     Scroll spy for primary nav
     ------------------------------------------------------------------ */
  const spyLinks = [...document.querySelectorAll('.nav__links a[data-spy]')];
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        spyLinks.forEach((a) => a.setAttribute('aria-current', String(a.dataset.spy === e.target.id)));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spyLinks.forEach((a) => {
      const section = document.getElementById(a.dataset.spy);
      if (section) spy.observe(section);
    });
  }

  /* ------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------ */
  const menuBtn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  const menuLabel = menuBtn.querySelector('.menu-btn__label');

  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    menuLabel.textContent = open ? 'CLOSE' : 'MENU';
    if (open) nav.classList.remove('is-hidden');
  }
  menuBtn.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) setMenu(false);
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => e.matches && setMenu(false));

  /* ------------------------------------------------------------------
     Film strip carousel
     ------------------------------------------------------------------ */
  const sheet = document.querySelector('.sheet');
  if (sheet) initFilmStrip(sheet);

  function initFilmStrip(section) {
    const AUTOPLAY_MS = 3600;
    const strip = section.querySelector('.strip');
    const viewport = section.querySelector('.strip__viewport');
    const track = section.querySelector('.strip__track');
    const numTrack = section.querySelector('.numbers__track');
    const currentEl = section.querySelector('[data-current]');
    const totalEl = section.querySelector('[data-total]');
    const originals = [...track.children];
    const originalNums = [...numTrack.children];
    const N = originals.length;
    if (N < 2) return;

    section.style.setProperty('--autoplay', `${AUTOPLAY_MS}ms`);
    totalEl.textContent = String(N).padStart(2, '0');

    // One set of clones on each side makes the loop seamless
    const cloneOf = (el) => {
      const c = el.cloneNode(true);
      c.classList.add('is-clone');
      c.setAttribute('aria-hidden', 'true');
      c.querySelectorAll('img').forEach((img) => { img.alt = ''; img.loading = 'eager'; });
      return c;
    };
    track.prepend(...originals.map(cloneOf));
    track.append(...originals.map(cloneOf));
    numTrack.prepend(...originalNums.map(cloneOf));
    numTrack.append(...originalNums.map(cloneOf));

    const slides = [...track.children];
    const nums = [...numTrack.children];

    let idx = N;      // position in the cloned track
    let travel = 0;   // unbounded position, keeps sprockets continuous
    let stepW = 0;
    let dragX = 0;

    const measure = () => {
      stepW = slides[1].offsetLeft - slides[0].offsetLeft;
    };

    function render(animate) {
      const x = -idx * stepW + dragX;
      const shift = -travel * stepW + dragX;
      [track, numTrack, ...strip.querySelectorAll('.sprockets')].forEach((el) => {
        el.style.transition = animate ? '' : 'none';
      });
      track.style.transform = `translate3d(${x}px,0,0)`;
      numTrack.style.transform = `translate3d(${x}px,0,0)`;
      strip.style.setProperty('--shift', `${shift}px`);

      const real = ((idx - N) % N + N) % N;
      slides.forEach((s, i) => s.classList.toggle('is-current', i === idx));
      nums.forEach((s, i) => s.classList.toggle('is-current', i === idx));
      currentEl.textContent = String(real + 1).padStart(2, '0');
    }

    // Jump back into the middle set without animation
    function normalize() {
      if (idx >= 2 * N || idx < N) {
        idx = idx >= 2 * N ? idx - N : idx + N;
        render(false);
        void track.offsetWidth;
      }
    }

    function move(delta) {
      if (!delta) return;
      normalize();
      idx += delta;
      travel += delta;
      render(true);
      restartAutoplay();
    }

    track.addEventListener('transitionend', (e) => {
      if (e.target === track && e.propertyName === 'transform') normalize();
    });

    section.querySelector('[data-next]').addEventListener('click', () => move(1));
    section.querySelector('[data-prev]').addEventListener('click', () => move(-1));

    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
    });

    // Click a frame to bring it to the front
    track.addEventListener('click', (e) => {
      if (dragged) return;
      const li = e.target.closest('.frame');
      if (li) move(slides.indexOf(li) - idx);
    });

    // Drag / swipe
    let startX = 0;
    let startY = 0;
    let pointerId = null;
    let dragging = false;
    let dragged = false;

    viewport.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      normalize();
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      dragging = false;
      dragged = false;
    });

    viewport.addEventListener('pointermove', (e) => {
      if (e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!dragging) {
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return;
        dragging = true;
        dragged = true;
        viewport.setPointerCapture(pointerId);
        pause('drag', true);
      }
      dragX = clamp(dx, -stepW * 1.5, stepW * 1.5);
      render(false);
    });

    const endDrag = (e) => {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      if (!dragging) return;
      dragging = false;
      const threshold = Math.min(80, stepW * 0.2);
      const delta = Math.abs(dragX) > threshold ? -Math.sign(dragX) * Math.max(1, Math.round(Math.abs(dragX) / stepW)) : 0;
      dragX = 0;
      pause('drag', false);
      if (delta) move(delta);
      else render(true);
      setTimeout(() => { dragged = false; }, 0);
    };
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    // Autoplay with pause reasons (hover, focus, drag, offscreen, hidden tab)
    const reasons = new Set(reduceMotion ? ['reduced-motion'] : []);
    let timer = null;

    function restartAutoplay() {
      clearTimeout(timer);
      section.classList.remove('is-playing');
      if (reasons.size) return;
      void section.offsetWidth; // restart progress bar animation
      section.classList.add('is-playing');
      timer = setTimeout(() => move(1), AUTOPLAY_MS);
    }

    function pause(reason, on) {
      const had = reasons.size;
      if (on) reasons.add(reason); else reasons.delete(reason);
      if (reasons.size !== had) restartAutoplay();
    }

    if (window.matchMedia('(hover: hover)').matches) {
      viewport.addEventListener('mouseenter', () => pause('hover', true));
      viewport.addEventListener('mouseleave', () => pause('hover', false));
    }
    section.addEventListener('focusin', () => pause('focus', true));
    section.addEventListener('focusout', (e) => {
      if (!section.contains(e.relatedTarget)) pause('focus', false);
    });
    document.addEventListener('visibilitychange', () => pause('hidden', document.hidden));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => pause('offscreen', !entry.isIntersecting), { threshold: 0.25 })
        .observe(section);
    }

    window.addEventListener('resize', () => { measure(); render(false); });

    measure();
    render(false);
    restartAutoplay();
  }
})();
