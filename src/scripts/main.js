/* ============================================================
   THE HER × OMID — client runtime (Phase 07 prototype, cinematic pass)
   Lenis smooth scroll · GSAP SplitText reveals · scrubbed hero ·
   scroll-synced score (D3) · i18n switch · custom cursor · grain
   Analytics (GA4): DROPPED per client decision D5 (2026-10-04)
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

function applyLang(l) {
  lang = l;
  const dict = store[l];
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'fa' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = resolve(dict, el.dataset.i18n);
    if (typeof v === 'string') el.textContent = v;
  });
  localStorage.setItem('lang', l);
}

/* Language switch — preserve narrative position (section under viewport center) */
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

/* ---------------- Lenis smooth scroll (cinematic inertia) ---------------- */
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
/* intercept in-page anchors */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (id.length > 1 && document.querySelector(id)) {
    e.preventDefault();
    scrollToTarget(document.querySelector(id));
  }
});

/* ---------------- entry overlay (S00) ---------------- */
const overlay = document.getElementById('entry');
let soundOn = false;
let audio = null;
const soundToggle = document.getElementById('sound-toggle');

const ensureAudio = () => {
  if (!audio) {
    audio = new Audio('/audio/score.mp3'); // Lyria score — 3:00, scroll-synced
    audio.preload = 'auto';
    audio.volume = 0.85;
  }
};
const setSoundUI = () => {
  if (soundToggle) {
    soundToggle.classList.toggle('is-off', !soundOn);
    soundToggle.setAttribute('aria-pressed', String(soundOn));
  }
};
const enableSound = () => { ensureAudio(); audio.play().catch(() => {}); soundOn = true; setSoundUI(); };
if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    if (soundOn) { audio.pause(); soundOn = false; setSoundUI(); }
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

/* ---------------- scroll-synced score (D3) + progress line ----------------
   Music position = scroll position (scrolling back rewinds proportionally). */
const progressEl = document.getElementById('progress-line');
function frameTick() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  if (audio && audio.duration && isFinite(audio.duration)) {
    const target = p * audio.duration;
    if (soundOn) {
      if (Math.abs(audio.currentTime - target) > 0.35) audio.currentTime = target;
    } else {
      audio.currentTime = target;
    }
  }
  if (progressEl) progressEl.style.transform = `scaleX(${p})`;
  requestAnimationFrame(frameTick);
}
requestAnimationFrame(frameTick);

/* ---------------- nav: solid on scroll + auto-hide on scroll down ---------------- */
const nav = document.getElementById('nav');
let lastY = window.scrollY;
function navTick() {
  const y = window.scrollY;
  if (nav) {
    nav.classList.toggle('nav--solid', y > window.innerHeight * 0.85);
    if (y > 140 && y > lastY + 4) nav.classList.add('nav--hidden');
    else if (y < lastY - 4 || y < 140) nav.classList.remove('nav--hidden');
  }
  lastY = y;
  requestAnimationFrame(navTick);
}
requestAnimationFrame(navTick);

/* ---------------- lazy videos (looping ambience) ---------------- */
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

/* ---------------- custom cursor (fine pointers only) ---------------- */
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

/* ---------------- GSAP narrative (skipped entirely for reduced motion) ---------------- */
if (!prefersReduced) {
  /* apply persisted language BEFORE splitting text */
  applyLang(lang);

  /* editorial headline reveals — chars for LTR, words for RTL (keeps Persian joining) */
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

  /* S01 hero: pinned, video SCRUBBED by scroll, headline drifts away */
  const heroVideo = document.querySelector('#s01 video');
  if (heroVideo && heroVideo.readyState < 2) {
    heroVideo.addEventListener('loadeddata', () => heroVideo.pause(), { once: true });
  }
  if (heroVideo) heroVideo.pause();
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#s01', start: 'top top', end: '+=130%', pin: true, scrub: true,
      onUpdate: (self) => {
        if (heroVideo && heroVideo.duration && isFinite(heroVideo.duration)) {
          heroVideo.currentTime = self.progress * heroVideo.duration;
        }
      }
    }
  });
  heroTl.to('#s01 .hero__inner', { yPercent: -16, autoAlpha: 0.15, ease: 'none' }, 0)
        .to('#s01 .hero__dusk', { opacity: 1, ease: 'none' }, 0); // deepening dusk

  /* S02/S03/S05/S06 background videos: slow parallax drift */
  gsap.utils.toArray('.problems__bg, .split__bg, .engine__bg, .band video').forEach((v) => {
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

  /* S06 engine layers converge from four corners + lockup */
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
      onUpdate: (self) => setStep(Math.min(6, Math.round(self.progress * 6)))
    });
    setStep(0);
  }

  /* S09 numbers: slow counter-like rise */
  gsap.from('#s09 .number', {
    autoAlpha: 0, y: 40, duration: 1.2, ease: 'power3.out', stagger: 0.12,
    scrollTrigger: { trigger: '#s09', start: 'top 78%' }
  });
} else {
  applyLang(lang);
  setStep(0);
}
