/* ============================================================
   THE HER × OMID — client runtime (Lusion-grade interactive film pass v4)
   • Real-time WebGL fluid silk & caustic light field (#webgl-canvas)
   • RTL-safe dual-layer magnetic & velocity-morphing cursor (#cursor + #cursor-dot)
   • Language-aware SplitText engine (reverts & re-splits cleanly on EN ↔ FA)
   • Interactive S06 Growth Engine vector convergence, S07 Signal Graph,
     S10 Expandable Collaboration Pathways, and S11 Partnership Brief Drawer
   • Score: plays NATURALLY on down-scroll; time-rewind SFX + seek on up-scroll.
   ============================================================ */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const isRTL = () => document.documentElement.dir === 'rtl';

/* ---------------- i18n + SplitText lifecycle ---------------- */
const store = JSON.parse(document.getElementById('i18n-store').textContent);
const resolve = (dict, path) =>
  path.split('.').reduce((o, k) => (o == null ? o : o[isNaN(+k) ? k : +k]), dict);

let lang = document.documentElement.lang === 'fa' ? 'fa' : 'en';
let activeSplits = [];
let splitTriggers = [];

function revertSplits() {
  splitTriggers.forEach((st) => st && st.kill());
  splitTriggers = [];
  activeSplits.forEach((sp) => sp && sp.revert());
  activeSplits = [];
}

function initSplits() {
  if (prefersReduced) return;
  revertSplits();
  const rtl = isRTL();
  const splitMode = rtl ? 'words,lines' : 'chars,lines';
  gsap.utils.toArray('.display').forEach((el) => {
    if (el.closest('.entry') || el.closest('.drawer')) return;
    const split = new SplitText(el, { type: splitMode, linesClass: 'split-line' });
    activeSplits.push(split);
    const targets = rtl ? split.words : split.chars;
    if (!targets || !targets.length) return;
    const tween = gsap.from(targets, {
      yPercent: 108,
      autoAlpha: 0,
      duration: 1.05,
      ease: 'power3.out',
      stagger: rtl ? 0.04 : 0.016,
      scrollTrigger: { trigger: el, start: 'top 89%' }
    });
    if (tween.scrollTrigger) splitTriggers.push(tween.scrollTrigger);
  });
}

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

let currentCursorKey = null;
const cursorLabelEl = document.getElementById('cursor-label');
function updateCursorLabel() {
  if (!cursorLabelEl) return;
  if (!currentCursorKey) {
    cursorLabelEl.textContent = '';
    return;
  }
  const label = resolve(store[lang], `cursor.${currentCursorKey}`) || '';
  cursorLabelEl.textContent = label;
}

function applyLang(l, reSplit = false) {
  lang = l;
  if (reSplit) revertSplits();
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'fa' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = resolve(store[l], el.dataset.i18n);
    if (typeof v === 'string') el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const v = resolve(store[l], el.dataset.i18nPlaceholder);
    if (typeof v === 'string') el.setAttribute('placeholder', v);
  });
  const meta = store[l].meta;
  if (meta) {
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }
  localStorage.setItem('lang', l);
  renderChapter(true);
  setSoundUI();
  updateCursorLabel();
  if (reSplit) {
    initSplits();
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  }
}

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
    applyLang(lang === 'en' ? 'fa' : 'en', true);
    requestAnimationFrame(() => {
      restorePosition(before);
      ScrollTrigger.refresh();
    });
    const url = new URL(location);
    if (lang === 'fa') url.searchParams.set('lang', 'fa'); else url.searchParams.delete('lang');
    history.replaceState(null, '', url);
  });
}

/* ---------------- Lenis ---------------- */
let lenis = null;
if (!prefersReduced) {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
function scrollToY(y, immediate) {
  y = Math.max(0, y);
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
   WEBGL FLUID SILK & CAUSTIC LIGHT FIELD (Lusion-inspired)
   ============================================================ */
const glState = {
  gl: null,
  prog: null,
  uTime: null,
  uRes: null,
  uMouse: null,
  uScroll: null,
  uVel: null,
  uDark: null,
  darkCurrent: 1.0,
  darkTarget: 1.0
};

function initWebGL() {
  if (prefersReduced) return;
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'high-performance' });
  if (!gl) return;

  const vsSource = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main() {
      vUv = aPos * 0.5 + 0.5;
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision mediump float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uRes;
    uniform vec2 uMouse;
    uniform float uScroll;
    uniform float uVel;
    uniform float uDark;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = rot * p * 2.02 + vec2(0.13, 0.27);
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 aspect = vec2(uRes.x / max(1.0, uRes.y), 1.0);
      vec2 uv = vUv * aspect;
      vec2 m = uMouse * aspect;

      float dist = length(uv - m);
      float mouseRipple = exp(-dist * 3.6) * (0.32 + min(0.35, abs(uVel) * 0.015));

      vec2 q = vec2(
        fbm(uv * 1.65 + uTime * 0.045 + uScroll * 0.6),
        fbm(uv * 1.65 + vec2(1.7, 9.2) - uTime * 0.035)
      );
      vec2 r = vec2(
        fbm(uv * 2.1 + 1.8 * q + vec2(1.7, 9.2) + 0.06 * uTime + mouseRipple),
        fbm(uv * 2.1 + 1.8 * q + vec2(8.3, 2.8) + 0.05 * uTime - mouseRipple)
      );
      float f = fbm(uv * 1.4 + r * 1.6);

      // THE HER observed palette
      vec3 ivory = vec3(0.941, 0.925, 0.890);      // #F0ECE3
      vec3 cream = vec3(0.906, 0.875, 0.824);      // #E7DFD2
      vec3 beige = vec3(0.831, 0.769, 0.702);      // #D4C4B3
      vec3 warmWhite = vec3(0.969, 0.957, 0.929);  // #F7F4ED
      vec3 softBlack = vec3(0.090, 0.078, 0.067);  // #171411
      vec3 espresso = vec3(0.173, 0.118, 0.090);   // #2C1E17

      vec3 lightCol = mix(ivory, cream, smoothstep(0.15, 0.85, f));
      lightCol = mix(lightCol, beige, smoothstep(0.45, 0.95, length(q)) * 0.42);
      lightCol += warmWhite * mouseRipple * 0.35;

      vec3 darkCol = mix(softBlack, espresso, smoothstep(0.2, 0.85, f));
      darkCol += beige * mouseRipple * 0.22;

      vec3 finalCol = mix(lightCol, darkCol, uDark);
      gl_FragColor = vec4(finalCol, 0.42);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsSource));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  glState.gl = gl;
  glState.prog = prog;
  glState.uTime = gl.getUniformLocation(prog, 'uTime');
  glState.uRes = gl.getUniformLocation(prog, 'uRes');
  glState.uMouse = gl.getUniformLocation(prog, 'uMouse');
  glState.uScroll = gl.getUniformLocation(prog, 'uScroll');
  glState.uVel = gl.getUniformLocation(prog, 'uVel');
  glState.uDark = gl.getUniformLocation(prog, 'uDark');

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(window.innerWidth * dpr * 0.65);
    canvas.height = Math.floor(window.innerHeight * dpr * 0.65);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
}
initWebGL();

/* ============================================================
   SCORE ENGINE v3
   ============================================================ */
const score = {
  el: null, sfxCtx: null, on: false,
  rewinding: false, resyncing: false,
  lastRewindAt: 0, lastResyncAt: 0,
  baseVol: 0.85
};
function ensureScore() {
  if (!score.el) {
    score.el = new Audio('/audio/score.mp3');
    score.el.preload = 'auto';
    score.el.volume = score.baseVol;
  }
}

function rewindSfx() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  if (!score.sfxCtx) score.sfxCtx = new AC();
  const ctx = score.sfxCtx;
  if (ctx.state === 'suspended') ctx.resume();
  const t = ctx.currentTime;
  const D = 2.0;

  const out = ctx.createGain();
  out.gain.value = 0.95;
  out.connect(ctx.destination);

  [0, -9].forEach((detune) => {
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.detune.value = detune;
    o.frequency.setValueAtTime(820, t);
    o.frequency.exponentialRampToValueAtTime(85, t + D);
    const vib = ctx.createOscillator();
    vib.frequency.setValueAtTime(6.2, t);
    vib.frequency.exponentialRampToValueAtTime(11, t + D);
    const vibG = ctx.createGain();
    vibG.gain.value = 55;
    vib.connect(vibG); vibG.connect(o.frequency);
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(1900, t);
    f.frequency.exponentialRampToValueAtTime(160, t + D);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.16);
    g.gain.setValueAtTime(0.16, t + D * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + D);
    o.connect(f); f.connect(g); g.connect(out);
    o.start(t); vib.start(t); o.stop(t + D + 0.05); vib.stop(t + D + 0.05);
  });

  const sub = ctx.createOscillator();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(120, t);
  sub.frequency.exponentialRampToValueAtTime(34, t + D * 0.85);
  const subG = ctx.createGain();
  subG.gain.setValueAtTime(0.0001, t);
  subG.gain.exponentialRampToValueAtTime(0.22, t + 0.12);
  subG.gain.exponentialRampToValueAtTime(0.0001, t + D);
  sub.connect(subG); subG.connect(out);
  sub.start(t); sub.stop(t + D + 0.05);

  const len = Math.floor(ctx.sampleRate * D);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const n = ctx.createBufferSource();
  n.buffer = buf;
  const nf = ctx.createBiquadFilter();
  nf.type = 'bandpass';
  nf.Q.value = 0.7;
  nf.frequency.setValueAtTime(2800, t);
  nf.frequency.exponentialRampToValueAtTime(210, t + D * 0.92);
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.0001, t);
  ng.gain.exponentialRampToValueAtTime(0.075, t + 0.1);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + D * 0.96);
  n.connect(nf); nf.connect(ng); ng.connect(out);
  n.start(t);
}

function scrollProgress() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

function rewindScoreTo(target) {
  const el = score.el;
  const dist = Math.abs(el.currentTime - target);
  score.rewinding = true;
  score.lastRewindAt = performance.now();
  rewindSfx();
  gsap.to(el, {
    volume: 0.03, duration: 0.3, ease: 'power2.in',
    onComplete() {
      el.currentTime = Math.max(0, Math.min(target, el.duration - 0.05));
      if (score.on) el.play().catch(() => {});
      gsap.to(el, {
        volume: score.baseVol, duration: 1.1, ease: 'power2.out',
        onComplete() { score.rewinding = false; }
      });
    }
  });
  return dist;
}

function resyncScoreTo(target) {
  const el = score.el;
  score.resyncing = true;
  score.lastResyncAt = performance.now();
  gsap.to(el, {
    volume: 0.07, duration: 0.2, ease: 'power2.in',
    onComplete() {
      el.currentTime = Math.max(0, Math.min(target, el.duration - 0.05));
      gsap.to(el, {
        volume: score.baseVol, duration: 0.8, ease: 'power2.out',
        onComplete() { score.resyncing = false; }
      });
    }
  });
}

/* ---------------- auto-film: idle 8s → the story advances itself ---------------- */
const film = {
  started: false,
  auto: false,
  speed: 0,
  clock: 0,
  lastInteract: 0
};
const IDLE_MS = 8000;
const FILM_DURATION = 170;

function noteInteraction() {
  film.lastInteract = performance.now();
  if (film.auto) { film.auto = false; film.speed = 0; }
}
['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((ev) =>
  window.addEventListener(ev, noteInteraction, { passive: true }));

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
  const soundLabel = document.getElementById('sound-label');
  if (soundLabel) soundLabel.textContent = resolve(store[lang], score.on ? 'sound.on' : 'sound.off');
}
if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    if (score.on) { score.el.pause(); score.on = false; setSoundUI(); }
    else enableSound();
  });
}
function dismissEntry() {
  if (overlay) {
    if (prefersReduced) overlay.remove();
    else {
      overlay.classList.add('entry--out');
      setTimeout(() => overlay.remove(), 1250);
    }
  }
  document.body.classList.remove('locked');
  if (lenis) lenis.start();
  const heroVid = document.querySelector('#s01 video');
  if (heroVid && !prefersReduced) {
    heroVid.currentTime = 0;
    heroVid.play().catch(() => {});
  }
  enableSound();
  film.started = true;
  film.clock = scrollProgress() * FILM_DURATION;
  film.lastInteract = performance.now();
  glState.darkTarget = 0.0;
}
if (overlay) {
  document.body.classList.add('locked');
  if (lenis) lenis.stop();
  const startBtn = overlay.querySelector('[data-entry-start]');
  startBtn?.addEventListener('click', dismissEntry);
  requestAnimationFrame(() => startBtn?.focus({ preventScroll: true }));
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
if (!prefersReduced) {
  document.querySelectorAll('video[data-lazy]:not([data-scrub])').forEach((v) => videoIO.observe(v));
} else {
  document.querySelectorAll('video[data-lazy]').forEach((v) => { v.pause(); v.removeAttribute('autoplay'); });
}

/* ---------------- damped video scrub (hero) ---------------- */
const scrubbers = [];
function makeScrubber(video) {
  const s = { video, target: 0 };
  scrubbers.push(s);
  return s;
}
function scrubTick(s) {
  const v = s.video;
  if (!v.duration || !isFinite(v.duration)) return;
  const diff = s.target - v.currentTime;
  if (Math.abs(diff) > 0.03) v.currentTime = v.currentTime + diff * 0.075;
}

/* ============================================================
   RTL-SAFE LUSION DUAL-LAYER MAGNETIC & VELOCITY CURSOR
   ============================================================ */
const mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  prevX: window.innerWidth / 2,
  prevY: window.innerHeight / 2,
  nx: 0.5,
  ny: 0.5
};

const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
let xTo = null;
let yTo = null;
let dotXTo = null;
let dotYTo = null;

if (finePointer && !prefersReduced && cursor && cursorDot) {
  document.body.classList.add('has-cursor');
  gsap.set([cursor, cursorDot], { xPercent: -50, yPercent: -50, x: mouse.x, y: mouse.y });

  xTo = gsap.quickTo(cursor, 'x', { duration: 0.32, ease: 'power3.out' });
  yTo = gsap.quickTo(cursor, 'y', { duration: 0.32, ease: 'power3.out' });
  dotXTo = gsap.quickTo(cursorDot, 'x', { duration: 0.06, ease: 'power2.out' });
  dotYTo = gsap.quickTo(cursorDot, 'y', { duration: 0.06, ease: 'power2.out' });

  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.nx = e.clientX / Math.max(1, window.innerWidth);
    mouse.ny = 1.0 - e.clientY / Math.max(1, window.innerHeight);

    xTo(e.clientX);
    yTo(e.clientY);
    dotXTo(e.clientX);
    dotYTo(e.clientY);

    /* Subtle aperture parallax on S00 entry overlay */
    const aperture = document.querySelector('.entry__aperture');
    if (aperture && document.getElementById('entry')) {
      const ax = (mouse.nx - 0.5) * 22;
      const ay = (0.5 - mouse.ny) * 22;
      aperture.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
    }
  }, { passive: true });

  /* Contextual cursor expansion + bilingual label */
  const interactiveSelector = 'a, button, [data-cursor], .engine-layer, details summary, .step, [data-model-card]';
  document.querySelectorAll(interactiveSelector).forEach((el) => {
    el.addEventListener('pointerenter', () => {
      cursor.classList.add('is-active');
      document.body.classList.add('cursor-expanded');
      currentCursorKey = el.dataset.cursor || (el.closest('[data-cursor]')?.dataset.cursor) || 'explore';
      updateCursorLabel();
      gsap.to(cursor, { scaleX: 1, scaleY: 1, rotation: 0, duration: 0.25, overwrite: 'auto' });
    });
    el.addEventListener('pointerleave', () => {
      cursor.classList.remove('is-active');
      document.body.classList.remove('cursor-expanded');
      currentCursorKey = null;
      updateCursorLabel();
    });
  });

  /* Magnetic pull effect on [data-magnetic] elements */
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const mX = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'elastic.out(1, 0.45)' });
    const mY = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'elastic.out(1, 0.45)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      mX(dx * 0.28);
      mY(dy * 0.28);
    });
    el.addEventListener('pointerleave', () => {
      mX(0);
      mY(0);
    });
  });

  /* 3D Perspective Tilt + Specular Light Sheen on [data-tilt] cards */
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    const rX = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power2.out' });
    const rY = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power2.out' });
    gsap.set(card, { transformPerspective: 1000 });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / Math.max(1, r.width);
      const py = (e.clientY - r.top) / Math.max(1, r.height);
      card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      rX((0.5 - py) * 5.5);
      rY((px - 0.5) * 5.5);
    });
    card.addEventListener('pointerleave', () => {
      rX(0);
      rY(0);
    });
  });
}

/* ---------------- master frame loop ---------------- */
const progressEl = document.getElementById('progress-line');
let lastY = window.scrollY;
let prevT = performance.now();
function frameTick(now) {
  const dt = Math.min(0.05, (now - prevT) / 1000);
  prevT = now;
  const y = window.scrollY;
  const velocity = y - lastY;
  lastY = y;

  const p = scrollProgress();
  if (progressEl) progressEl.style.transform = `scaleX(${p})`;

  /* Lusion velocity squash-and-stretch on outer cursor ring */
  if (cursor && finePointer && !prefersReduced) {
    const vx = mouse.x - mouse.prevX;
    const vy = mouse.y - mouse.prevY;
    mouse.prevX += vx * 0.35;
    mouse.prevY += vy * 0.35;
    if (!cursor.classList.contains('is-active')) {
      const speed = Math.min(Math.hypot(vx, vy), 60);
      const stretch = (speed / 60) * 0.32;
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);
      gsap.set(cursor, {
        rotation: angle,
        scaleX: 1 + stretch,
        scaleY: 1 - stretch * 0.42
      });
    }
  }

  /* WebGL shader frame update */
  if (glState.gl) {
    const gl = glState.gl;
    glState.darkCurrent += (glState.darkTarget - glState.darkCurrent) * Math.min(1, dt * 3.5);
    gl.uniform1f(glState.uTime, now * 0.001);
    gl.uniform2f(glState.uRes, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(glState.uMouse, mouse.nx, mouse.ny);
    gl.uniform1f(glState.uScroll, p);
    gl.uniform1f(glState.uVel, velocity);
    gl.uniform1f(glState.uDark, glState.darkCurrent);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  /* keep the virtual film clock synced while silent */
  if (film.started && !score.on) film.clock = p * FILM_DURATION;

  /* auto-film: after 8s idle, the story advances itself */
  if (
    film.started && !prefersReduced && !film.auto &&
    now - film.lastInteract > IDLE_MS && p < 0.995
  ) {
    film.auto = true;
  }
  if (film.auto) {
    film.speed = Math.min(1, film.speed + dt * 0.5);
    let targetP;
    if (score.on && score.el && score.el.duration) {
      targetP = score.el.currentTime / score.el.duration;
    } else {
      film.clock += dt * film.speed;
      targetP = film.clock / FILM_DURATION;
    }
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const targetY = targetP * max;
    const nextY = y + (targetY - y) * Math.min(1, dt * 1.6 * film.speed);
    scrollToY(nextY, true);
    if (scrollProgress() >= 0.995) { film.auto = false; film.speed = 0; }
  }

  /* score sync */
  const el = score.el;
  if (el && el.duration && isFinite(el.duration)) {
    const target = p * el.duration;
    if (!score.on) {
      if (!score.rewinding) el.currentTime = target;
    } else if (!score.rewinding && !score.resyncing) {
      const drift = target - el.currentTime;
      const goingUp = velocity < -1;
      if (goingUp && drift < -0.45 && now - score.lastRewindAt > 1100) {
        rewindScoreTo(target);
      } else if (drift > 20 && now - score.lastResyncAt > 2000) {
        resyncScoreTo(target);
      }
    }
  }

  /* damped video scrubs */
  scrubbers.forEach(scrubTick);

  requestAnimationFrame(frameTick);
}
requestAnimationFrame(frameTick);

/* ---------------- S06 Growth Engine interactive layers + vector illumination ---------------- */
const engineBtns = [...document.querySelectorAll('#s06 .engine-layer')];
const engineVecs = [...document.querySelectorAll('#s06 .engine__vec')];
function selectEngineLayer(idx) {
  engineBtns.forEach((b, i) => {
    const active = i === idx;
    b.classList.toggle('is-selected', active);
    b.setAttribute('aria-pressed', String(active));
  });
  engineVecs.forEach((v, i) => {
    v.classList.toggle('is-lit', i === idx);
  });
}
engineBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => selectEngineLayer(i));
  btn.addEventListener('pointerenter', () => selectEngineLayer(i));
});
selectEngineLayer(0);

/* ---------------- S07 diagnostic stepper + SVG signal visualizer ---------------- */
const stepBtns = [...document.querySelectorAll('#s07 .step')];
const stepPanels = [...document.querySelectorAll('#s07 .step-panel')];
const stepNodes = [...document.querySelectorAll('#s07 .stepper__node')];
const signalFill = document.getElementById('stepper-signal-fill');
let activeStep = -1;
function setStep(i) {
  if (i === activeStep) return;
  activeStep = i;
  stepBtns.forEach((b, j) => {
    b.classList.toggle('is-active', j === i);
    b.classList.toggle('is-done', j < i);
    b.setAttribute('aria-selected', String(j === i));
  });
  stepPanels.forEach((pn, j) => pn.classList.toggle('is-active', j === i));
  stepNodes.forEach((nd, j) => {
    nd.classList.toggle('is-active', j === i);
    nd.classList.toggle('is-done', j < i);
  });
  if (signalFill) {
    gsap.to(signalFill, { attr: { x2: 24 + i * 62 }, duration: 0.45, ease: 'power2.out' });
  }
}
stepBtns.forEach((b, i) => {
  b.addEventListener('click', () => {
    const sec = document.getElementById('s07');
    const top = sec.getBoundingClientRect().top + window.scrollY;
    const span = sec.offsetHeight - window.innerHeight;
    scrollToY(top + (i / 6) * span);
  });
});
stepNodes.forEach((nd, i) => {
  nd.style.cursor = 'pointer';
  nd.addEventListener('click', () => {
    const sec = document.getElementById('s07');
    const top = sec.getBoundingClientRect().top + window.scrollY;
    const span = sec.offsetHeight - window.innerHeight;
    scrollToY(top + (i / 6) * span);
  });
});

/* ---------------- S10 expandable collaboration pathways ---------------- */
const modelCards = [...document.querySelectorAll('[data-model-card]')];
function expandModel(idx) {
  modelCards.forEach((card, i) => {
    const expanded = i === idx;
    card.classList.toggle('is-expanded', expanded);
    card.setAttribute('aria-expanded', String(expanded));
  });
}
modelCards.forEach((card, i) => {
  card.addEventListener('click', () => expandModel(i));
  card.addEventListener('pointerenter', () => expandModel(i));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      expandModel(i);
    }
  });
});

/* ---------------- S11 Partnership Dialogue Drawer ---------------- */
const drawer = document.getElementById('contact-drawer');
const drawerForm = document.getElementById('drawer-form');
const drawerResult = document.getElementById('drawer-result');
const drawerSummary = document.getElementById('drawer-summary');
let selectedModelIdx = 0;
let selectedLayerIdx = 0;

function openDrawer() {
  if (!drawer) return;
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
}
function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
}
document.querySelectorAll('[data-open-drawer]').forEach((btn) => {
  btn.addEventListener('click', openDrawer);
});
document.querySelectorAll('[data-close-drawer]').forEach((btn) => {
  btn.addEventListener('click', closeDrawer);
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer?.classList.contains('is-open')) closeDrawer();
});

document.querySelectorAll('[data-drawer-model]').forEach((pill) => {
  pill.addEventListener('click', () => {
    selectedModelIdx = Number(pill.dataset.drawerModel || 0);
    document.querySelectorAll('[data-drawer-model]').forEach((p, i) =>
      p.classList.toggle('is-selected', i === selectedModelIdx)
    );
  });
});
document.querySelectorAll('[data-drawer-layer]').forEach((pill) => {
  pill.addEventListener('click', () => {
    selectedLayerIdx = Number(pill.dataset.drawerLayer || 0);
    document.querySelectorAll('[data-drawer-layer]').forEach((p, i) =>
      p.classList.toggle('is-selected', i === selectedLayerIdx)
    );
  });
});

if (drawerForm) {
  drawerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const dict = store[lang];
    const modelObj = dict.s10.models[selectedModelIdx] || dict.s10.models[0];
    const layerObj = dict.s6.layers[selectedLayerIdx] || dict.s6.layers[0];
    const note = document.getElementById('drawer-note')?.value?.trim() || '—';
    const lines = lang === 'fa'
      ? [
          `THE HER × OMID — خلاصه‌ی همکاری`,
          `مدل همکاری: ${modelObj.title} (${modelObj.formula})`,
          `تمرکز اصلی: ${layerObj.title} — ${layerObj.line}`,
          `توضیحات: ${note}`
        ]
      : [
          `THE HER × OMID — PARTNERSHIP BRIEF`,
          `Pathway: ${modelObj.title} (${modelObj.formula})`,
          `Primary Focus: ${layerObj.title} — ${layerObj.line}`,
          `Context: ${note}`
        ];
    if (drawerSummary) drawerSummary.textContent = lines.join('\n');
    if (drawerResult) drawerResult.hidden = false;
  });
}

/* ---------------- film chapters + cuts ---------------- */
const CHAPTERS = [
  ['s01', 'chapters.s01'], ['s02', 'chapters.s02'], ['s03', 'chapters.s03'],
  ['s04', 'chapters.s04'], ['s05', 'chapters.s05'], ['s06', 'chapters.s06'],
  ['s07', 'chapters.s07'], ['s08', 'chapters.s08'], ['s09', 'chapters.s09'],
  ['s10', 'chapters.s10'], ['s11', 'chapters.s11']
];
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
  applyLang(lang, false);
  initSplits();

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

  /* ---- Dark scene tracker for WebGL shader mood ---- */
  document.querySelectorAll('[data-dark-scene]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter: () => { glState.darkTarget = 1.0; },
      onEnterBack: () => { glState.darkTarget = 1.0; },
      onLeave: () => { glState.darkTarget = 0.0; },
      onLeaveBack: () => { glState.darkTarget = 0.0; }
    });
  });

  /* ---- S01 hero: autoplays from beginning + pinned scroll transition ---- */
  const heroVideo = document.querySelector('#s01 video');
  const heroCoords = document.getElementById('hero-coords');
  if (heroVideo) {
    heroVideo.currentTime = 0;
    heroVideo.play().catch(() => {});
  }
  gsap.timeline({
    scrollTrigger: {
      trigger: '#s01', start: 'top top', end: '+=220%', pin: true, scrub: true,
      anticipatePin: 1,
      onUpdate(self) {
        if (heroCoords) {
          const pct = Math.round(self.progress * 100).toString().padStart(2, '0');
          heroCoords.textContent = `01 // VISION · ${pct}%`;
        }
      }
    }
  })
    .to('#s01 .hero__inner', { yPercent: -16, autoAlpha: 0.15, ease: 'none' }, 0)
    .to('#s01 .hero__dusk', { opacity: 1, ease: 'none' }, 0);

  /* ---- S03: pinned accumulation (desktop) / staggered reveals (mobile) ---- */
  const s03items = gsap.utils.toArray('#s03 .problem');
  const s03head = document.querySelector('#s03 .problems__head');
  const s03stage = document.querySelector('#s03 .problems__stage');
  const s03scrim = document.querySelector('#s03 .problems__scrim');
  if (s03items.length) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#s03', start: 'top top', end: '+=340%',
          pin: '#s03 .problems__pin', scrub: true, anticipatePin: 1
        }
      });
      tl.to(s03head, { autoAlpha: 0, y: -36, ease: 'none', duration: 0.16 }, 0.08);
      s03items.forEach((it, i) => {
        tl.fromTo(it,
          { autoAlpha: 0, y: 46 },
          { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.085 },
          0.14 + i * 0.082);
      });
      tl.to(s03stage, { autoAlpha: 0, scale: 0.965, ease: 'none', duration: 0.14 }, 0.85);
      tl.to(s03scrim, { opacity: 1, ease: 'power2.in', duration: 0.18 }, 0.8);
    });
    mm.add('(max-width: 767px)', () => {
      gsap.from(s03items, {
        autoAlpha: 0, y: 30, duration: 0.9, ease: 'power3.out', stagger: 0.09,
        scrollTrigger: { trigger: '#s03 .problems__list', start: 'top 82%' }
      });
      gsap.to(s03scrim, {
        opacity: 1, ease: 'power2.in',
        scrollTrigger: { trigger: '#s04', start: 'top 85%', end: 'top 45%', scrub: true }
      });
    });
  }

  /* ---- background parallax ---- */
  gsap.utils.toArray('.split__bg, .engine__bg, .models__bg, .band video').forEach((v) => {
    gsap.fromTo(v, { yPercent: -6, scale: 1.14 }, {
      yPercent: 6, scale: 1.14, ease: 'none',
      scrollTrigger: { trigger: v.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  gsap.from('#s04 .question-line', {
    scale: 0.94, autoAlpha: 0, duration: 1.4, ease: 'power2.out',
    scrollTrigger: { trigger: '#s04', start: 'top 68%' }
  });
  gsap.fromTo('#s04 .question__halo', { scale: 0.72, opacity: 0 }, {
    scale: 1.12, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: '#s04', start: 'top bottom', end: 'bottom top', scrub: true }
  });

  /* Direction-safe convergence for S05 Partnership panels */
  gsap.fromTo('#s05 .panel--her',
    { xPercent: () => (isRTL() ? 7 : -7) },
    {
      xPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '#s05', start: 'top 75%', end: 'center 40%', scrub: true, invalidateOnRefresh: true }
    }
  );
  gsap.fromTo('#s05 .panel--omid',
    { xPercent: () => (isRTL() ? -7 : 7) },
    {
      xPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '#s05', start: 'top 75%', end: 'center 40%', scrub: true, invalidateOnRefresh: true }
    }
  );
  gsap.fromTo('#s05 .split__nexus',
    { scale: 0.5, rotation: -90, autoAlpha: 0 },
    {
      scale: 1, rotation: 0, autoAlpha: 1, ease: 'power2.out',
      scrollTrigger: { trigger: '#s05', start: 'top 65%', end: 'center 42%', scrub: true }
    }
  );

  const spreads = [
    { x: -140, y: -90 }, { x: 140, y: -90 },
    { x: -140, y: 90 }, { x: 140, y: 90 }
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

  const s07 = document.getElementById('s07');
  if (s07 && stepPanels.length) {
    ScrollTrigger.create({
      trigger: s07, start: 'top top', end: 'bottom bottom',
      onUpdate(self) { setStep(Math.min(6, Math.round(self.progress * 6))); }
    });
    setStep(0);
  }

  const toPersianDigits = (str) => String(str).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const numberSpecs = [
    { target: 5, decimals: 0, format: (v, l) => (l === 'fa' ? `بیش از ${toPersianDigits(v)} سال` : `${v}+ years`) },
    { target: 50, decimals: 0, format: (v, l) => (l === 'fa' ? `+${toPersianDigits(v)}٪` : `+${v}%`) },
    { target: 30, decimals: 0, format: (v, l) => (l === 'fa' ? `−${toPersianDigits(v)}٪` : `−${v}%`) },
    { target: 3.5, decimals: 1, format: (v, l) => (l === 'fa' ? `${toPersianDigits(v).replace('.', '٫')}٪` : `${v}%`) },
    { target: 15, decimals: 0, format: (v, l) => (l === 'fa' ? toPersianDigits(v) : String(v)) }
  ];

  gsap.fromTo('#s09 .number',
    { autoAlpha: 0, y: 36 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.05,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '#s09 .numbers',
        start: 'top 85%',
        onEnter() {
          document.querySelectorAll('#s09 .number').forEach((card, idx) => {
            card.classList.add('is-counted');
            const valEl = card.querySelector('.number__value');
            const spec = numberSpecs[idx];
            if (!valEl || !spec) return;
            const proxy = { val: 0 };
            gsap.to(proxy, {
              val: spec.target,
              duration: 1.6,
              delay: idx * 0.08,
              ease: 'power3.out',
              onUpdate() {
                const formattedNum = spec.decimals > 0
                  ? proxy.val.toFixed(spec.decimals)
                  : Math.round(proxy.val).toString();
                valEl.textContent = spec.format(formattedNum, lang);
              },
              onComplete() {
                const finalText = resolve(store[lang], `s9.numbers.${idx}.value`);
                if (finalText) valEl.textContent = finalText;
              }
            });
          });
        }
      }
    }
  );

  CHAPTERS.forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 55%', end: 'bottom 55%',
      onToggle(self) { if (self.isActive) setChapter(key); }
    });
  });
  setChapter('chapters.s01');

  ['s04', 's06'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 62%',
      onEnter: () => dip(0.5),
      onEnterBack: () => dip(0.35)
    });
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
} else {
  applyLang(lang, false);
  setStep(0);
  setChapter('chapters.s01');
  if (chapterEl) chapterEl.style.display = 'none';
}
