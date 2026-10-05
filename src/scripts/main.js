/* ============================================================
   THE HER × OMID — client runtime (cinematic continuity pass)
   ONE FILM: pinned scrub scenes · act chapters · dip-to-black
   cuts · Lenis inertia · SplitText · scroll-synced score with
   synthesized time-rewind SFX (D3 v2).
   No analytics (decision D5).
   ============================================================ */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const isRTL = () => document.documentElement.dir === 'rtl';

/* ---------------- i18n ---------------- */
const store = JSON.parse(document.getElementById('i18n-store').textContent);
const resolve = (dict, path) =>
  path.split('.').reduce((o, k) => (o == null ? o : o[isNaN(+k) ? k : +k]), dict);

let lang = document.documentElement.lang === 'fa' ? 'fa' : 'en';

/* chapter indicator state (updated by scroll, re-rendered on lang switch) */
const chapterEl = document.getElementById('chapter');
let currentChapterKey = null;
function renderChapter(instant) {
  if (!chapterEl || !currentChapterKey) return;
  const text = resolve(store[lang], currentChapterKey);
  if (instant || prefersReduced) {
    chapterEl.textContent = text;
    gsap.set(chapterEl, { autoAlpha: 1 });
    return;
  }
  gsap.to(chapterEl, {
    autoAlpha: 0, y: 6, duration: 0.22, ease: 'power2.in',
    onComplete() {
      chapterEl.textContent = text;
      gsap.to(chapterEl, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    }
  });
}
function setChapter(key) {
  if (key === currentChapterKey) return;
  currentChapterKey = key;
  renderChapter(false);
}

function applyLang(l) {
  lang = l;
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'fa' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = resolve(store[l], el.dataset.i18n);
    if (typeof v === 'string') el.textContent = v;
  });
  localStorage.setItem('lang', l);
  renderChapter(true);
}

/* Language switch — preserve narrative position */
function capturePosition() {
  const sections = [...document.querySelectorAll('[data-section]')];
  const center = window.innerHeight / 2;
  let hit = sections[0];
  for (const s of sections) {
    const r = s.getBoundingClientRect();
    if (r.top <= center && r.bottom >= center) { hit = s; break; }
    if (r.top <= center) hit = s;
  }
  if (!hit) return null;
  const r = hit.getBoundingClientRect();
  return { el: hit, offset: center - r.top, height: r.height };
}
function restorePosition(pos) {
  if (!pos || !pos.el.isConnected) return;
  const r = pos.el.getBoundingClientRect();
  const y = window.scrollY + r.top + Math.min(pos.offset, r.height) - window.innerHeight / 2;
  scrollToY(Math.max(0, y), true);
}

const langBtn = document.getElementById('lang-switch');
if (langBtn) {
  langBtn.addEventListener('click', () => {
    const before = capturePosition();
    applyLang(lang === 'en' ? 'fa' : 'en');
    requestAnimationFrame(() => {
      restorePosition(before);
      ScrollTrigger.refresh();
    });
    const url = new URL(location);
    if (lang === 'fa') url.searchParams.set('lang', 'fa'); else url.searchParams.delete('lang');
    history.replaceState(null, '', url);
  });
}

/* ---------------- Lenis smooth scroll ---------------- */
let lenis = null;
if (!prefersReduced) {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
function scrollToY(y, immediate) {
  if (lenis) lenis.scrollTo(y, { immediate: !!immediate, duration: immediate ? 0 : 1.2 });
  else window.scrollTo(0, y);
}
function scrollToTarget(el) {
  if (lenis) lenis.scrollTo(el, { duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (id.length > 1 && document.querySelector(id)) {
    e.preventDefault();
    scrollToTarget(document.querySelector(id));
  }
});

/* ============================================================
   SCORE ENGINE (D3 v2) — continuous, seamless, scroll-synced
   - plays as ONE uninterrupted piece (no seek-stutter)
   - forward drift → gentle playbackRate catch-up
   - back-scroll → time-rewind SFX (synthesized) + duck + seek
   - idle → the score keeps breathing like a film soundtrack
   ============================================================ */
const score = {
  el: null,
  sfxCtx: null,
  on: false,
  rewinding: false,
  jumping: false,
  lastRewindAt: 0,
  lastJumpAt: 0,
  baseVol: 0.85
};

function ensureScore() {
  if (!score.el) {
    score.el = new Audio('/audio/score.mp3');
    score.el.preload = 'auto';
    score.el.volume = score.baseVol;
  }
}

/* Synthesized "time rewind" cue — tape-style pitch descent + air */
function rewindSfx() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  if (!score.sfxCtx) score.sfxCtx = new AC();
  const ctx = score.sfxCtx;
  if (ctx.state === 'suspended') ctx.resume();
  const t = ctx.currentTime;

  const out = ctx.createGain();
  out.gain.value = 0.9;
  out.connect(ctx.destination);

  /* descending warbling tone (tape rewind) */
  const o = ctx.createOscillator();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(690, t);
  o.frequency.exponentialRampToValueAtTime(120, t + 0.75);
  const vib = ctx.createOscillator();
  vib.frequency.value = 7.5;
  const vibG = ctx.createGain();
  vibG.gain.value = 40;
  vib.connect(vibG); vibG.connect(o.frequency);
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.setValueAtTime(1500, t);
  f.frequency.exponentialRampToValueAtTime(260, t + 0.75);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.13, t + 0.11);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
  o.connect(f); f.connect(g); g.connect(out);
  o.start(t); vib.start(t); o.stop(t + 0.85); vib.stop(t + 0.85);

  /* airy filtered noise sweep */
  const len = Math.floor(ctx.sampleRate * 0.72);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const n = ctx.createBufferSource();
  n.buffer = buf;
  const nf = ctx.createBiquadFilter();
  nf.type = 'bandpass';
  nf.Q.value = 0.8;
  nf.frequency.setValueAtTime(2300, t);
  nf.frequency.exponentialRampToValueAtTime(300, t + 0.7);
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.0001, t);
  ng.gain.exponentialRampToValueAtTime(0.05, t + 0.09);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.72);
  n.connect(nf); nf.connect(ng); ng.connect(out);
  n.start(t);
}

function scrollProgress() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

/* Backward re-sync: duck the score, play the rewind cue, seek, breathe back in */
function rewindScoreTo(target) {
  const el = score.el;
  score.rewinding = true;
  score.lastRewindAt = performance.now();
  rewindSfx();
  gsap.to(el, {
    volume: 0.04, duration: 0.22, ease: 'power2.in',
    onComplete() {
      el.currentTime = Math.max(0, Math.min(target, el.duration - 0.05));
      el.playbackRate = 1;
      if (score.on) el.play().catch(() => {});
      gsap.to(el, {
        volume: score.baseVol, duration: 0.85, ease: 'power2.out',
        onComplete() { score.rewinding = false; }
      });
    }
  });
}

/* Forward jump re-sync (big skips only): quick duck + seek */
function jumpScoreTo(target) {
  const el = score.el;
  score.jumping = true;
  score.lastJumpAt = performance.now();
  gsap.to(el, {
    volume: 0.08, duration: 0.18, ease: 'power2.in',
    onComplete() {
      el.currentTime = Math.max(0, Math.min(target, el.duration - 0.05));
      el.playbackRate = 1;
      gsap.to(el, {
        volume: score.baseVol, duration: 0.7, ease: 'power2.out',
        onComplete() { score.jumping = false; }
      });
    }
  });
}

/* Master frame loop: progress line + score sync */
const progressEl = document.getElementById('progress-line');
let lastScrollY = window.scrollY;
function frameTick() {
  const y = window.scrollY;
  const velocity = y - lastScrollY;
  lastScrollY = y;

  const p = scrollProgress();
  if (progressEl) progressEl.style.transform = `scaleX(${p})`;

  const el = score.el;
  if (el && el.duration && isFinite(el.duration)) {
    const target = p * el.duration;
    if (!score.on) {
      /* silent playhead tracking */
      if (!score.rewinding) el.currentTime = target;
    } else if (!score.rewinding && !score.jumping) {
      const drift = target - el.currentTime;
      const now = performance.now();
      const goingUp = velocity < -1;
      const goingDown = velocity > 1;

      if (goingUp && drift < -0.8 && now - score.lastRewindAt > 1300) {
        /* user scrolled back in time */
        rewindScoreTo(target);
      } else if (drift > 8 && now - score.lastJumpAt > 1500) {
        /* big forward skip */
        jumpScoreTo(target);
      } else if (drift > 1.2 && goingDown) {
        el.playbackRate = Math.min(1.45, 1 + drift * 0.09);
      } else if (drift > 0.5) {
        el.playbackRate = 1.05;
      } else {
        el.playbackRate = 1;
      }
    }
  }
  requestAnimationFrame(frameTick);
}
requestAnimationFrame(frameTick);

/* ---------------- entry overlay (S00) ---------------- */
const overlay = document.getElementById('entry');
const soundToggle = document.getElementById('sound-toggle');

function enableSound() {
  ensureScore();
  score.el.volume = score.baseVol;
  score.el.currentTime = scrollProgress() * (score.el.duration || 0);
  score.el.play().catch(() => {});
  score.on = true;
  setSoundUI();
}
function setSoundUI() {
  if (soundToggle) {
    soundToggle.classList.toggle('is-off', !score.on);
    soundToggle.setAttribute('aria-pressed', String(score.on));
  }
}
if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    if (score.on) { score.el.pause(); score.on = false; setSoundUI(); }
    else enableSound();
  });
}
function dismissEntry(withSound) {
  if (overlay) {
    if (prefersReduced) overlay.remove();
    else {
      overlay.classList.add('entry--out');
      setTimeout(() => overlay.remove(), 1250);
    }
  }
  document.body.classList.remove('locked');
  if (lenis) lenis.start();
  if (withSound) enableSound();
}
if (overlay) {
  document.body.classList.add('locked');
  if (lenis) lenis.stop();
  overlay.querySelector('[data-entry-sound]')?.addEventListener('click', () => dismissEntry(true));
  overlay.querySelector('[data-entry-silent]')?.addEventListener('click', () => dismissEntry(false));
}

/* ---------------- nav: solid + auto-hide ---------------- */
const nav = document.getElementById('nav');
let lastNavY = window.scrollY;
function navTick() {
  const y = window.scrollY;
  if (nav) {
    nav.classList.toggle('nav--solid', y > window.innerHeight * 0.85);
    if (y > 140 && y > lastNavY + 4) nav.classList.add('nav--hidden');
    else if (y < lastNavY - 4 || y < 140) nav.classList.remove('nav--hidden');
  }
  lastNavY = y;
  requestAnimationFrame(navTick);
}
requestAnimationFrame(navTick);

/* ---------------- lazy ambient videos ---------------- */
const videoIO = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) v.play().catch(() => {});
    else v.pause();
  }),
  { threshold: 0.2 }
);
document.querySelectorAll('video[data-lazy]:not([data-scrub])').forEach((v) => videoIO.observe(v));

/* ---------------- S07 diagnostic stepper ---------------- */
const stepBtns = [...document.querySelectorAll('#s07 .step')];
const stepPanels = [...document.querySelectorAll('#s07 .step-panel')];
let activeStep = -1;
function setStep(i) {
  if (i === activeStep) return;
  activeStep = i;
  stepBtns.forEach((b, j) => {
    b.classList.toggle('is-active', j === i);
    b.classList.toggle('is-done', j < i);
  });
  stepPanels.forEach((p, j) => p.classList.toggle('is-active', j === i));
}
stepBtns.forEach((b, i) => {
  b.addEventListener('click', () => {
    const sec = document.getElementById('s07');
    const top = sec.getBoundingClientRect().top + window.scrollY;
    const span = sec.offsetHeight - window.innerHeight;
    scrollToY(top + (i / 6) * span);
  });
});

/* ---------------- custom cursor ---------------- */
if (finePointer && !prefersReduced) {
  const cursor = document.getElementById('cursor');
  if (cursor) {
    document.body.classList.add('has-cursor');
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
    window.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); });
    document.querySelectorAll('a, button, .engine-layer, details summary, .step').forEach((el) => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-active'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
    });
  }
}

/* ---------------- film chapters ---------------- */
const CHAPTERS = [
  ['s01', 'chapters.s01'], ['s02', 'chapters.s02'], ['s03', 'chapters.s03'],
  ['s04', 'chapters.s04'], ['s05', 'chapters.s05'], ['s06', 'chapters.s06'],
  ['s07', 'chapters.s07'], ['s08', 'chapters.s08'], ['s09', 'chapters.s09'],
  ['s10', 'chapters.s10'], ['s11', 'chapters.s11']
];

/* ---------------- dip-to-black (film cuts) ---------------- */
const dipEl = document.getElementById('film-dip');
function dip(strength) {
  if (!dipEl || prefersReduced) return;
  gsap.killTweensOf(dipEl);
  gsap.timeline()
    .to(dipEl, { opacity: strength, duration: 0.4, ease: 'power2.in' })
    .to(dipEl, { opacity: 0, duration: 0.55, ease: 'power2.out' }, '+=0.08');
}

/* ---------------- GSAP narrative ---------------- */
if (!prefersReduced) {
  applyLang(lang);

  /* headline reveals — chars for LTR, words for RTL */
  const splitMode = isRTL() ? 'words,lines' : 'chars,lines';
  gsap.utils.toArray('.display').forEach((el) => {
    if (el.closest('.entry')) return;
    const split = new SplitText(el, { type: splitMode, linesClass: 'split-line' });
    gsap.from(split[isRTL() ? 'words' : 'chars'], {
      yPercent: 110, autoAlpha: 0, duration: 1.1, ease: 'power3.out', stagger: 0.018,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* group + solo reveals */
  gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    gsap.from(items, {
      autoAlpha: 0, y: 34, duration: 1.1, ease: 'power3.out', stagger: 0.09,
      scrollTrigger: { trigger: group, start: 'top 82%' }
    });
  });
  gsap.utils.toArray('[data-reveal-solo]').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0, y: 26, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });

  /* ---- S01 hero: pinned, video scrubbed by scroll ---- */
  const heroVideo = document.querySelector('#s01 video');
  if (heroVideo) heroVideo.pause();
  gsap.timeline({
    scrollTrigger: {
      trigger: '#s01', start: 'top top', end: '+=160%', pin: true, scrub: true,
      anticipatePin: 1,
      onUpdate(self) {
        if (heroVideo && heroVideo.duration && isFinite(heroVideo.duration)) {
          heroVideo.currentTime = self.progress * heroVideo.duration;
        }
      }
    }
  })
    .to('#s01 .hero__inner', { yPercent: -16, autoAlpha: 0.15, ease: 'none' }, 0)
        .to('#s01 .hero__dusk', { opacity: 1, ease: 'none' }, 0);

  /* ---- S03: pinned accumulation — the 7 problems build, freeze, dissolve ---- */
  const s03items = gsap.utils.toArray('#s03 .problem');
  const s03head = document.querySelector('#s03 .problems__head');
  const s03stage = document.querySelector('#s03 .problems__stage');
  const s03scrim = document.querySelector('#s03 .problems__scrim');
  if (s03items.length) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s03', start: 'top top', end: '+=340%',
        pin: '#s03 .problems__pin', scrub: true, anticipatePin: 1
      }
    });
    /* headline drifts away as complexity accumulates */
    tl.to(s03head, { autoAlpha: 0, y: -36, ease: 'none', duration: 0.16 }, 0.08);
    /* problems surface one by one — the growing composition */
    s03items.forEach((it, i) => {
      tl.fromTo(it,
        { autoAlpha: 0, y: 46 },
        { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.085 },
        0.14 + i * 0.082);
    });
    /* freeze, then dissolve into the dark of S04 */
    tl.to(s03stage, { autoAlpha: 0, scale: 0.965, ease: 'none', duration: 0.14 }, 0.85);
    tl.to(s03scrim, { opacity: 1, ease: 'power2.in', duration: 0.18 }, 0.8);
  }

  /* background videos: slow parallax drift */
  gsap.utils.toArray('.split__bg, .engine__bg, .models__bg, .band video').forEach((v) => {
    gsap.fromTo(v, { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: v.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* S04 question scale-in */
  gsap.from('#s04 .question-line', {
    scale: 0.94, autoAlpha: 0, duration: 1.4, ease: 'power2.out',
    scrollTrigger: { trigger: '#s04', start: 'top 68%' }
  });

  /* S05 panels converge */
  gsap.fromTo('#s05 .panel--her', { xPercent: -9 }, {
    xPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '#s05', start: 'top 75%', end: 'center 40%', scrub: true }
  });
  gsap.fromTo('#s05 .panel--omid', { xPercent: 9 }, {
    xPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '#s05', start: 'top 75%', end: 'center 40%', scrub: true }
  });

  /* S06 engine layers converge from four corners */
  const spreads = [
    { x: -180, y: -120 }, { x: 180, y: -120 },
    { x: -180, y: 120 }, { x: 180, y: 120 }
  ];
  gsap.utils.toArray('#s06 .engine-layer').forEach((l, i) => {
    gsap.from(l, {
      ...spreads[i % 4], autoAlpha: 0, ease: 'none',
      scrollTrigger: { trigger: '#s06', start: 'top 80%', end: 'center 45%', scrub: true }
    });
  });
  gsap.from('#s06 .engine__lockup', {
    autoAlpha: 0, scale: 0.92, ease: 'none',
    scrollTrigger: { trigger: '#s06', start: 'center 55%', end: 'center 30%', scrub: true }
  });

  /* S07 stepper driven by scroll */
  const s07 = document.getElementById('s07');
  if (s07 && stepBtns.length) {
    ScrollTrigger.create({
      trigger: s07, start: 'top top', end: 'bottom bottom',
      onUpdate(self) { setStep(Math.min(6, Math.round(self.progress * 6))); }
    });
    setStep(0);
  }

  /* S09 numbers rise */
  gsap.from('#s09 .number', {
    autoAlpha: 0, y: 40, duration: 1.2, ease: 'power3.out', stagger: 0.12,
    scrollTrigger: { trigger: '#s09', start: 'top 78%' }
  });

  /* film chapters — update when each act holds the middle of the screen */
  CHAPTERS.forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 55%', end: 'bottom 55%',
      onToggle(self) { if (self.isActive) setChapter(key); }
    });
  });
  setChapter('chapters.s01');

  /* film cuts — dip to black entering/leaving the dark acts */
  ['s04', 's06'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 62%',
      onEnter: () => dip(0.5),
      onEnterBack: () => dip(0.35)
    });
  });
} else {
  /* reduced motion: everything static & readable */
  applyLang(lang);
  setStep(0);
  setChapter('chapters.s01');
  if (chapterEl) chapterEl.style.display = 'none';
}
