(() => {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ------------------------------------------------------------------
     Content safety: nothing containing these words can ever be shown.
     Every poem and title is checked before the page uses it.
  ------------------------------------------------------------------ */
  const BANNED = [
    /\bdivin\w*/i, /\bworship\w*/i, /\bbow(s|ed|ing)?\b/i, /\bkneel\w*/i, /\bgod\w*/i,
    /\bidol\w*/i, /\bpray\w*/i, /\bheaven\w*/i, /\bsacred\b/i, /\bdeit\w*/i, /\balmighty\b/i,
    /\bbless\w*/i, /\bmagic\w*/i, /\bspell\w*/i, /\bdestin\w*/i, /\bfate\w*/i, /\bsupreme\b/i,
    /\bimmortal\w*/i, /\beternal\w*/i, /\binfinit\w*/i, /\bomnipotent\b/i, /\bobey\w*/i,
    /\bangel\w*/i, /\blord\b/i, /\bcreator\b/i, /\bholy\b/i, /\bmiracle\w*/i, /\badore\w*/i,
    /\bsalvation\b/i, /\bsoul\w*/i, /\bspirit\w*/i, /\bgoddess\b/i, /\bmystic\w*/i
  ];
  const isSafe = (text) => !BANNED.some((re) => re.test(text));

  const RAW_POEMS = [
    "Princess Mia of Kepler-23,\nAdil's favorite star to see,\nWith a smile that lights the night,\nAnd a laugh that makes the whole sky bright.",
    "Pink crown on and chin held high,\nShe waves at comets rushing by,\nThe kittens purr, the planets spin,\nBecause Princess Mia is coming in.",
    "On Kepler-23 the kittens meet,\nWith tiny paws and dancing feet,\nPrincess Mia says \"meow\" with a grin,\nAnd the whole royal court joins in.",
    "From Adil, with love across the stars,\nTo the girl with a thousand tiaras,\nYou're glitter, you're giggles, you're pure sunshine,\nMy favorite princess, every time.",
    "Queen of cuddles, fluffy guards,\nChasing laser dots across the yards,\nOne royal yawn, the whole court sighs,\nPrincess Mia, with sleepy eyes.",
    "She wears pink like a shield of light,\nChases boredom out of sight,\nKepler-23's brightest friend,\nWith a giggle that will not end.",
    "Barbie-pink and spaceship bound,\nCats in tutus gather round,\nAdil sends a poem and cheer,\nBecause Mia makes every day dear.",
    "Tiny human, giant crown energy,\nQueen of naps and cat harmony,\nKepler-23 cheers her name,\nAnd no two days are ever the same.",
    "Glitter on the staircase, paws on the floor,\nA princess who always wants one more,\nOne more story, one more cat,\nOne more sparkle, and that is that.",
    "When the moons of Kepler-23 rise,\nThey twinkle just to meet her eyes,\nPrincess Mia laughs out loud,\nAnd every star feels extra proud."
  ];
  const RAW_TITLES = [
    "Cat Empress of Kepler-23",
    "Official Barbie Princess of the Stars",
    "Royal Commander of Fluffy Things",
    "Queen of Giggles and Royal Naps",
    "Keeper of a Thousand Meows",
    "Princess of the Pink Nebula",
    "Chief Glitter Officer of the Palace"
  ];

  const POEMS = RAW_POEMS.filter(isSafe);
  const TITLES = RAW_TITLES.filter(isSafe);
  if (!POEMS.length) POEMS.push("Princess Mia of Kepler-23,\nThe brightest star we see.");
  if (!TITLES.length) TITLES.push("Princess of Kepler-23");

  /* ------------------------------------------------------------------
     Poem + title
  ------------------------------------------------------------------ */
  const poemEl = document.getElementById('poem');
  const ghostEl = document.getElementById('poemGhost');
  const srEl = document.getElementById('poemSr');
  const titleEl = document.getElementById('titleBox');
  let typer = null;
  let lastPoem = -1;
  let lastTitle = -1;

  function typeText(text) {
    clearTimeout(typer);
    ghostEl.textContent = text;
    srEl.textContent = text;
    if (reduce) { poemEl.textContent = text; return; }
    poemEl.classList.add('typing');
    let i = 0;
    (function step() {
      poemEl.textContent = text.slice(0, i);
      if (i < text.length) {
        const ch = text[i];
        i += 1;
        typer = setTimeout(step, ch === '\n' ? 320 : 30);
      } else {
        poemEl.classList.remove('typing');
      }
    })();
  }

  function nextIndex(len, last) {
    if (len < 2) return 0;
    let n;
    do { n = Math.floor(Math.random() * len); } while (n === last);
    return n;
  }

  function showPoem() {
    lastPoem = nextIndex(POEMS.length, lastPoem);
    typeText(POEMS[lastPoem]);
  }

  function showTitle() {
    lastTitle = nextIndex(TITLES.length, lastTitle);
    titleEl.classList.add('out');
    setTimeout(() => {
      titleEl.textContent = TITLES[lastTitle];
      titleEl.classList.remove('out');
    }, reduce ? 0 : 350);
  }

  /* ------------------------------------------------------------------
     Effects: sparkles, hearts, cat rain (SVG symbols from index.html)
  ------------------------------------------------------------------ */
  const COLORS = ['#ff7eb6', '#ffc48a', '#ebd9ff', '#7ff0e4', '#ffffff'];
  const CAT_COLORS = ['#ffc48a', '#ebd9ff', '#ff7eb6', '#7ff0e4', '#ffffff'];

  function makeFx(symbol, size, color) {
    const wrap = document.createElement('div');
    wrap.className = 'fx';
    wrap.style.width = wrap.style.height = size + 'px';
    wrap.style.color = color;
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', symbol === 'cat' ? '0 0 64 64' : '0 0 24 24');
    const use = document.createElementNS(SVGNS, 'use');
    use.setAttribute('href', '#' + symbol);
    svg.appendChild(use);
    wrap.appendChild(svg);
    document.body.appendChild(wrap);
    return wrap;
  }

  function burst(x, y, count) {
    if (reduce) return;
    for (let i = 0; i < count; i++) {
      const el = makeFx(Math.random() > 0.25 ? 'spark' : 'heart', rand(10, 28), pick(COLORS));
      const angle = rand(0, Math.PI * 2);
      const dist = rand(50, 190);
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      const anim = el.animate([
        { transform: 'translate(-50%,-50%) scale(0) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx * 0.6}px), calc(-50% + ${dy * 0.6}px)) scale(1.15) rotate(90deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 40}px)) scale(0.2) rotate(200deg)`, opacity: 0 }
      ], { duration: rand(800, 1500), easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
      anim.onfinish = () => el.remove();
    }
  }

  function scatter(count) {
    if (reduce) return;
    for (let i = 0; i < count; i++) {
      const el = makeFx('spark', rand(12, 30), pick(COLORS));
      el.style.left = rand(2, 98) + 'vw';
      el.style.top = rand(4, 96) + 'vh';
      const anim = el.animate([
        { transform: 'scale(0) rotate(0deg)', opacity: 0 },
        { transform: 'scale(1) rotate(60deg)', opacity: 1, offset: 0.4 },
        { transform: 'scale(0) rotate(160deg)', opacity: 0 }
      ], { duration: rand(900, 1700), delay: rand(0, 500), easing: 'ease-in-out', fill: 'both' });
      anim.onfinish = () => el.remove();
    }
  }

  function catRain() {
    if (reduce) { burst(innerWidth / 2, innerHeight / 3, 8); return; }
    const total = innerWidth < 600 ? 16 : 28;
    for (let i = 0; i < total; i++) {
      const size = rand(28, 58);
      const el = makeFx('cat', size, pick(CAT_COLORS));
      const sway = rand(-60, 60);
      const spin = rand(-40, 40);
      el.style.left = rand(0, 96) + 'vw';
      el.style.top = '0px';
      const anim = el.animate([
        { transform: `translate(0, -${size + 20}px) rotate(${-spin}deg)`, opacity: 1 },
        { transform: `translate(${sway}px, ${innerHeight * 0.55}px) rotate(${spin}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${sway * -0.5}px, ${innerHeight + size}px) rotate(${spin * 1.6}deg)`, opacity: 0.9 }
      ], { duration: rand(2600, 5800), delay: rand(0, 900), easing: 'cubic-bezier(.4,.1,.6,1)', fill: 'both' });
      anim.onfinish = () => el.remove();
    }
  }

  /* Soft sparkle trail that follows a mouse pointer */
  let lastTrail = 0;
  window.addEventListener('pointermove', (e) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const now = performance.now();
    if (now - lastTrail < 70) return;
    lastTrail = now;
    const el = makeFx('spark', rand(8, 16), pick(COLORS));
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    const anim = el.animate([
      { transform: 'translate(-50%,-50%) scale(1) rotate(0deg)', opacity: 0.9 },
      { transform: `translate(-50%, calc(-50% + ${rand(14, 34)}px)) scale(0) rotate(120deg)`, opacity: 0 }
    ], { duration: 700, easing: 'ease-out', fill: 'forwards' });
    anim.onfinish = () => el.remove();
  }, { passive: true });

  /* ------------------------------------------------------------------
     Card tilt (mouse only)
  ------------------------------------------------------------------ */
  const card = document.getElementById('card');
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', (px * 7).toFixed(2) + 'deg');
      card.style.setProperty('--rx', (-py * 7).toFixed(2) + 'deg');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }

  /* ------------------------------------------------------------------
     Starfield with shooting stars
  ------------------------------------------------------------------ */
  const cv = document.getElementById('sky');
  const ctx = cv.getContext('2d');
  let w = 0, h = 0, stars = [], shooters = [], nextShot = 3000;
  let mx = 0, my = 0, tx = 0, ty = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    cv.width = w * dpr;
    cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(260, Math.round((w * h) / 8000));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: rand(0.3, 1.6),
      z: rand(0.15, 1),
      p: rand(0, 6.28),
      s: rand(0.0008, 0.003),
      c: pick(['255,240,250', '235,217,255', '255,196,138', '127,240,228'])
    }));
    if (reduce) draw(0);
  }

  window.addEventListener('pointermove', (e) => {
    tx = e.clientX / w - 0.5;
    ty = e.clientY / h - 0.5;
  }, { passive: true });

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    mx += (tx - mx) * 0.05;
    my += (ty - my) * 0.05;
    for (const s of stars) {
      const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(s.p + t * s.s));
      ctx.fillStyle = `rgba(${s.c},${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(s.x - mx * 28 * s.z, s.y - my * 28 * s.z, s.r, 0, 6.2832);
      ctx.fill();
    }
    for (let i = shooters.length - 1; i >= 0; i--) {
      const m = shooters[i];
      m.x += m.vx;
      m.y += m.vy;
      m.life -= 0.016;
      const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 14, m.y - m.vy * 14);
      g.addColorStop(0, `rgba(255,255,255,${Math.max(m.life, 0)})`);
      g.addColorStop(1, 'rgba(255,126,182,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 14, m.y - m.vy * 14);
      ctx.stroke();
      if (m.life <= 0) shooters.splice(i, 1);
    }
  }

  let last = 0;
  function loop(t) {
    const dt = t - last;
    last = t;
    nextShot -= dt;
    if (nextShot <= 0) {
      shooters.push({ x: rand(w * 0.3, w), y: rand(0, h * 0.4), vx: -rand(7, 11), vy: rand(3, 6), life: 1 });
      nextShot = rand(4000, 9000);
    }
    draw(t);
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  if (!reduce) requestAnimationFrame(loop);

  /* Pause SVG (SMIL) animation for people who prefer reduced motion */
  if (reduce) {
    document.querySelectorAll('svg').forEach((s) => { if (s.pauseAnimations) s.pauseAnimations(); });
  }

  /* ------------------------------------------------------------------
     Buttons, keys, start-up
  ------------------------------------------------------------------ */
  function centerOf(el) {
    const r = el.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2];
  }

  const newPoemBtn = document.getElementById('newPoemBtn');
  const catRainBtn = document.getElementById('catRainBtn');
  const sparkleBtn = document.getElementById('sparkleBtn');

  newPoemBtn.addEventListener('click', () => {
    showPoem();
    showTitle();
    burst(...centerOf(newPoemBtn), 14);
  });
  catRainBtn.addEventListener('click', catRain);
  sparkleBtn.addEventListener('click', () => {
    burst(...centerOf(sparkleBtn), 26);
    scatter(18);
  });

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === 'c') catRain();
    if (k === 's') scatter(24);
  });

  setTimeout(() => { showPoem(); showTitle(); }, reduce ? 0 : 2800);
  if (!reduce) setInterval(() => { if (!document.hidden && Math.random() > 0.6) scatter(5); }, 5000);
})();
