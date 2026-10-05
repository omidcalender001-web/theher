/* ============================================================
   THE HER × OMID — client runtime (Phase 07 prototype)
   i18n switch (scroll-preserving) · entry overlay ·
   scroll-synced score (D3) · GSAP narrative · stepper · analytics
   ============================================================ */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- analytics stub (GA4 wired in Phase 09) ---------------- */
window.dataLayer = window.dataLayer || [];
const track = (event, params = {}) => {
  window.dataLayer.push({ event, ...params });
  if (location.hostname === 'localhost' || location.hostname.includes('e2b.app')) {
    console.debug('[event]', event, params);
  }
};
track('page_view');

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
  window.scrollTo(0, Math.max(0, y));
}

const langBtn = document.getElementById('lang-switch');
if (langBtn) {
  langBtn.addEventListener('click', () => {
    const before = capturePosition();
    const from = lang;
    const next = lang === 'en' ? 'fa' : 'en';
    applyLang(next);
    requestAnimationFrame(() => {
      restorePosition(before);
      ScrollTrigger.refresh();
    });
    const url = new URL(location);
    if (next === 'fa') url.searchParams.set('lang', 'fa'); else url.searchParams.delete('lang');
    history.replaceState(null, '', url);
    track('language_switch', { from, to: next });
  });
}

/* ---------------- entry overlay (S00) ---------------- */
const overlay = document.getElementById('entry');
let soundOn = false;
let audio = null;
const soundToggle = document.getElementById('sound-toggle');

const ensureAudio = () => {
  if (!audio) {
    // TODO (Phase 06): replace placeholder with the Lyria score at /audio/score.mp3
    audio = new Audio('/audio/score-placeholder.mp3');
    audio.preload = 'auto';
    audio.volume = 0.85;
  }
};
const setSoundUI = () => {
  if (soundToggle) {
    soundToggle.classList.toggle('is-off', !soundOn);
    soundToggle.setAttribute('aria-pressed', String(soundOn));
    soundToggle.setAttribute('aria-label', soundOn ? 'Sound on' : 'Sound off');
  }
};
const enableSound = () => {
  ensureAudio();
  audio.play().catch(() => {});
  soundOn = true;
  setSoundUI();
};
if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    if (soundOn) { audio.pause(); soundOn = false; setSoundUI(); track('sound_off'); }
    else { enableSound(); track('sound_on'); }
  });
}

function dismissEntry(withSound) {
  if (overlay) {
    if (prefersReduced) { overlay.remove(); }
    else {
      overlay.classList.add('entry--out');
      setTimeout(() => overlay.remove(), 1250);
    }
  }
  document.body.classList.remove('locked');
  if (withSound) { enableSound(); track('begin_with_sound'); }
  else track('begin_silent');
}
if (overlay) {
  document.body.classList.add('locked');
  overlay.querySelector('[data-entry-sound]')?.addEventListener('click', () => dismissEntry(true));
  overlay.querySelector('[data-entry-silent]')?.addEventListener('click', () => dismissEntry(false));
}

/* ---------------- scroll-synced score (D3) ----------------
   Music position = scroll position. When audible, the track plays
   continuously and scroll seeks it (throttled); scrolling back
   rewinds it proportionally. When silent, the playhead still tracks. */
function scoreTick() {
  if (audio && audio.duration && isFinite(audio.duration)) {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    const target = p * audio.duration;
    if (soundOn) {
      if (Math.abs(audio.currentTime - target) > 0.35) audio.currentTime = target;
    } else {
      audio.currentTime = target;
    }
  }
  requestAnimationFrame(scoreTick);
}
requestAnimationFrame(scoreTick);

/* ---------------- lazy videos ---------------- */
const videoIO = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) { v.play().catch(() => {}); }
    else v.pause();
  }),
  { threshold: 0.2 }
);
document.querySelectorAll('video[data-lazy]').forEach((v) => videoIO.observe(v));

/* ---------------- scroll depth analytics ---------------- */
const depths = [25, 50, 75, 100];
const seen = new Set();
ScrollTrigger.create({
  trigger: document.body,
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    const pct = Math.round(self.progress * 100);
    depths.forEach((d) => {
      if (pct >= d && !seen.has(d)) { seen.add(d); track('scroll_depth', { depth: d }); }
    });
  }
});

/* ---------------- S07 diagnostic stepper ---------------- */
const stepBtns = [...document.querySelectorAll('#s07 .step')];
const stepPanels = [...document.querySelectorAll('#s07 .step-panel')];
let activeStep = -1;
function setStep(i, viaScroll) {
  if (i === activeStep) return;
  activeStep = i;
  stepBtns.forEach((b, j) => {
    b.classList.toggle('is-active', j === i);
    b.classList.toggle('is-done', j < i);
  });
  stepPanels.forEach((p, j) => p.classList.toggle('is-active', j === i));
  if (!viaScroll) track('case_interaction', { case: 'diagnostic', step: i + 1, via: 'tap' });
}
stepBtns.forEach((b, i) => {
  b.addEventListener('click', () => {
    const sec = document.getElementById('s07');
    const top = sec.getBoundingClientRect().top + window.scrollY;
    const span = sec.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (i / 6) * span, behavior: prefersReduced ? 'auto' : 'smooth' });
  });
});

/* ---------------- GSAP narrative (no-preference only) ---------------- */
if (!prefersReduced) {
  /* group reveals */
  gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    gsap.from(items, {
      autoAlpha: 0, y: 34, duration: 1.1, ease: 'power3.out', stagger: 0.09,
      scrollTrigger: { trigger: group, start: 'top 82%' }
    });
  });
  /* solo reveals */
  gsap.utils.toArray('[data-reveal-solo]').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0, y: 26, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });
  /* hero inner parallax */
  const heroInner = document.querySelector('#s01 .hero__inner');
  if (heroInner) {
    gsap.to(heroInner, {
      yPercent: -14, autoAlpha: 0.25, ease: 'none',
      scrollTrigger: { trigger: '#s01', start: 'top top', end: 'bottom 35%', scrub: true }
    });
  }
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
  /* S06 engine layers converge + lockup */
  const layers = gsap.utils.toArray('#s06 .engine-layer');
  const spreads = [
    { x: -180, y: -120 }, { x: 180, y: -120 },
    { x: -180, y: 120 }, { x: 180, y: 120 }
  ];
  layers.forEach((l, i) => {
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
      trigger: s07,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setStep(Math.min(6, Math.round(self.progress * 6)), true)
    });
    setStep(0, true);
  }
} else {
  /* reduced motion: show first step, everything else static */
  setStep(0, true);
}

/* ---------------- CTA / preview analytics ---------------- */
document.querySelectorAll('[data-track]').forEach((el) => {
  el.addEventListener('click', () => {
    track(el.dataset.track, JSON.parse(el.dataset.trackParams || '{}'));
  });
});
document.querySelectorAll('#s06 .engine-layer').forEach((l, i) => {
  l.addEventListener('click', () =>
    track('layer_tap', { layer: ['data', 'marketing', 'experience', 'ai'][i] }));
});

/* apply persisted language on load (before first paint already set dir) */
applyLang(lang);
