# QA REPORT — Phase 09

**Build tested:** production build (`astro build`) + dev server · **Date:** 2026-10-05 · **Tester:** Arena Agent (automated) + client (device review)
**Scope note (D5):** analytics checks removed — no analytics on this site.

---

## 1. AUTOMATED CHECKS — all executed 2026-10-05

### Code integrity
| # | Check | Result |
|---|---|---|
| 1 | Production build (`astro build`) | ✅ PASS — 1 page, 0 errors, ~1.9s |
| 2 | i18n key coverage: every `data-i18n` in components resolves in BOTH dictionaries (incl. templated keys s2.mosaic.0-3, s8.cases.0-2) | ✅ PASS — 0 missing |
| 3 | EN/FA key parity (programmatic walk) | ✅ PASS |
| 4 | Asset references: every `/video/*`, `/images/*`, `/audio/*`, favicon URL in source → file exists in `public/` | ✅ PASS — 15/15 |
| 5 | Dead files in `public/` | ✅ PASS — none (robots.txt excluded by design) |
| 6 | Dead CSS selectors | ✅ FIXED — `.stepper__panels-wrap` removed |
| 7 | Leftovers of removed features (entry sound-choice, placeholder score, data-track analytics, playbackRate chase) | ✅ PASS — 0 references |
| 8 | Fonts bundled (Cormorant Garamond 300+italic, Jost 300/400, Vazirmatn 300/400) | ✅ PASS — 22 WOFF2 subsets |
| 9 | JS bundle | ✅ ~1 file, gzip ≈ 55 KB (GSAP+Lenis+SplitText+runtime) |

### Bugs found & fixed in this pass
| # | Severity | Bug | Fix |
|---|---|---|---|
| B1 | 🔴 high (design/mobile) | **S03 pinned scene overflowed mobile viewports** (7 problems + headline > 100svh → clipped content) | scene now `gsap.matchMedia`: pinned scrub on ≥768px, staggered reveals + scrim handoff on mobile; compact mobile typography |
| B2 | 🟡 medium (a11y) | step buttons had `role="tab"` without initial `aria-selected` | ✅ SSR `aria-selected="false"` + JS sync |
| B3 | 🟡 medium (a11y) | keyboard users landed on page with no focus | ✅ start button auto-focused after entry renders |
| B4 | 🟡 medium (config) | `netlify.toml` cached `/assets/video/*` (old paths) — real paths never cached; audio not covered | ✅ `/video/*`, `/images/*`, `/audio/*` |
| B5 | 🟡 medium (SEO) | `robots.txt` pointed to nonexistent `sitemap.xml` | ✅ removed (single-page site) |
| B6 | 🟢 low (bidi) | `<title>`/meta description stayed English in FA mode | ✅ updated on language switch |
| B7 | 🟢 low (a11y) | looping ambient videos played under `prefers-reduced-motion` | ✅ posters only in reduced mode |
| B8 | 🟢 low (compat) | `100svh` unsupported on older browsers → 0-height sections | ✅ `100vh` fallback lines added |
| B9 | 🟢 low (motion) | film chapter switched late for finale (band not tracked) | ✅ band carries `data-section` |

### Content (v1.1 editorial pass, 2026-10-05)
| # | Check | Result |
|---|---|---|
| 1 | No duplicated concepts/sentences across sections | ✅ (s4/s7 punchline dupe, s6 layer echo, s2/s3 mosaic dupe, kicker/chapter dupes — all resolved) |
| 2 | Spelling/grammar EN | ✅ native-review pass done (word-level dedupe: s1, s6, s9) |
| 3 | Persian naturalness (no translationese/bookish tone, ZWNJ, hamza consistency) | ✅ (s1/s2/s5/s6/s7/s9/s10 rewritten, نمونهٔ→نمونه‌ی unified) |
| 4 | Hypothetical cases labeled (EN+FA) | ✅ 3/3 |
| 5 | No internal The Her data claimed as fact | ✅ |
| 6 | Thinking (S07) before credentials (S09) | ✅ |
| 7 | Hardcoded non-i18n user-facing strings | ✅ 0 remaining (mosaic, case labels, footer meta all i18n'd; footer PROTOTYPE line removed) |
| 8 | `content/` source files synced with site copy | ✅ v1.1 noted in both |

### Performance (build measurements)
| Metric | Value | Verdict |
|---|---|---|
| HTML document | ~97 KB (contains inline i18n store) | ✅ acceptable (gzip ~⅓) |
| JS | ≈55 KB gzip total | ✅ |
| CSS | single file, tokens+proto | ✅ |
| Media | 7 videos ≈17 MB (all ≤3.2 MB each) · posters ≤40 KB · score 2.5 MB | ✅ lazy + poster-first |
| Font payload | 22 subset WOFF2, swap + preload of hero poster | ✅ |
| Media loading | `preload="metadata"` + IntersectionObserver (no eager loads); hero `auto` (scrub source) | ✅ |
| ⚠️ Lighthouse field run | — | ⏳ pending Netlify deploy (Phase 10) — run on production URL |

### Interaction & motion (code-verified)
- Score: natural playback on down-scroll; rewind SFX (2.0s, 3-layer) + proportional seek on up-scroll; resync only >20s drift ✅
- Auto-film after 8s idle; any input cancels; scroll follows score timeline ✅
- Hero scrub damped (7.5%/frame, 85% clip map) ✅
- `prefers-reduced-motion`: no Lenis, no pins, no autoplay video, static reveals, chapter indicator hidden ✅
- Language switch: position-preserving, RTL flip, title/meta update, chapter re-render ✅

## 2. PENDING — requires human/device verification (client)

| # | Check | Where | Status |
|---|---|---|---|
| H1 | Sound: natural playback + rewind moment felt | any browser, desktop | ⬜ |
| H2 | iOS Safari: score scrub + entry gesture + `playsinline` | iPhone | ⬜ |
| H3 | Android Chrome: full scroll + FA mode | mid-range Android | ⬜ |
| H4 | Live preview iframe of omidadli.site loads (Mode A) — else Mode B shows | desktop browser | ⬜ |
| H5 | Visual: typography rhythm, contrast, spacing on real screens | designer eye | ⬜ |
| H6 | FA native-speaker read-through of final Persian | native reader | ⬜ |

## 3. VERDICT — Gate 06 readiness

**Code, content and design-level checks: PASS** (9 automated bug-fixes applied this pass).
Site is a **production candidate**. Remaining items are device/field checks (H1–H6) best performed on the deployed Netlify URL.
**Recommendation:** proceed to Phase 10 (Netlify deployment), then run H1–H6 against production and confirm.
