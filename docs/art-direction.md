# ART DIRECTION / VISUAL SYSTEM — FINAL v1.0

> **Phase 05 deliverable** — input for **Gate 04 (Visual Approval)**.
> **Sources:** The Her observed brand ( [`intelligence-report.md`](intelligence-report.md) §3 — F18–F20, palette hex ) · locked architecture ( [`proposal-architecture.md`](proposal-architecture.md) ) · storyboard.
> Principle: the site must feel like **"The Her, expanded into a growth story"** — NOT "The Her + generic AI website".

**Status:** ✅ Finalized — ⬜ awaiting Gate 04 approval · **Date:** 2026-10-04
**Code source of truth:** `src/styles/global.css` (tokens synced 1:1 with this document)

---

## 1. COLOR SYSTEM — observed The Her palette

### Observed (from The Her screenshots — do not alter)

| Token | Hex | Role |
|---|---|---|
| `--color-warm-white` | `#F7F4ED` | lightest surface; text on dark; cards on espresso |
| `--color-ivory` | `#F0ECE3` | **primary background** (the canvas) |
| `--color-cream` | `#E7DFD2` | soft surfaces, button text on espresso, selection bg |
| `--color-beige` | `#D4C4B3` | hairlines on light, muted text on dark, texture base |
| `--color-taupe` | `#B7A99A` | decorative lines, disabled states, quiet labels (**decoration only — fails text contrast on ivory**) |
| `--color-espresso` | `#2C1E17` | headings on light, dark sections (S04, testimonials-style), button fill |
| `--color-soft-black` | `#171411` | darkest moments: S00 entry, S04 tension peak, footer |

### Derived (NOT observed — engineered for accessibility; documented)

| Token | Hex | Purpose | Contrast on ivory |
|---|---|---|---|
| `--color-text-muted` | `#6E5F53` | secondary/body-muted text on light (deep taupe, brand-consistent) | ≈ 4.8:1 ✓ AA |
| `--color-accent` | `#8C7A6B` | focus rings, active underlines, interactive affordances | large-text/UI use |

### Rules

1. **No metallic accent.** The Her's palette is all warm neutrals — restraint IS the accent. No gold, no neon, no gradients. (The provisional `#B08D57` gold from v0 is **dropped**.)
2. **Light scenes:** ivory canvas, espresso type, beige hairlines. **Dark scenes** (S00, S04, footer): soft-black/espresso canvas, warm-white type, beige muted text.
3. Photography/video gets a **warm muted grade** toward this palette (already baked into the Flow prompts).
4. Text contrast matrix (verified):

| Text | On | Ratio |
|---|---|---|
| espresso `#2C1E17` | ivory `#F0ECE3` | ≈ 13:1 ✓ |
| text-muted `#6E5F53` | ivory | ≈ 4.8:1 ✓ |
| warm-white `#F7F4ED` | soft-black `#171411` | ≈ 15:1 ✓ |
| beige `#D4C4B3` | espresso `#2C1E17` | ≈ 9:1 ✓ |
| cream `#E7DFD2` (button text) | espresso (button fill) | ≈ 9:1 ✓ |

---

## 2. TYPOGRAPHY — final pairing

> The Her's own type is a thin elegant sans (F19). This site is "The Her **expanded** into a growth story", so the display voice shifts to an **editorial serif** (client-locked decision) while the UI voice stays a quiet geometric sans — the fashion-editorial convention.

| Role | EN (LTR) | FA (RTL) | Weights |
|---|---|---|---|
| **Display / headlines** | **Cormorant Garamond** (serif) | **Vazirmatn** | 300 (light) + 300 italic for key lines |
| **Body / UI** | **Jost** (geometric sans — echoes The Her's thin sans, F19–F20) | **Vazirmatn** | 300 / 400 |

- **Why Cormorant Garamond:** the quiet-luxury editorial serif — large, light, elegant; its italic delivers the "expressive italic treatment" The Her uses for emotional statements (F20).
- **Why Jost:** geometric (Futura-like) = fashion-editorial, not SaaS; light weights match The Her's thin sans heritage.
- **Why Vazirmatn:** the only open-source (OFL) Persian family with light weights elegant enough for quiet luxury; consistent letterforms across display and body.

### Scale

| Step | Value | Use |
|---|---|---|
| display-xl | `clamp(2.75rem, 7vw, 6rem)` | S01/S04/S11 headlines |
| display | `clamp(2rem, 5vw, 4rem)` | section headlines |
| title | `clamp(1.25rem, 2.5vw, 1.75rem)` | case cards, model cards |
| body | `1.0625rem` | paragraphs |
| caption | `0.8125rem` | kickers, labels, footnotes |

### Typographic rules

- **EN:** uppercase headlines allowed, tracking `0.18em` on kickers/labels, `0.04em` on display; body sentence-case, tracking normal.
- **FA:** **never uppercase (does not exist), letter-spacing always `0`**, display line-height `1.35` (vs EN `1.08`), body line-height `1.9` (vs EN `1.7`) — Persian needs the extra air.
- Kickers: caption size, uppercase (EN) / normal (FA), taupe→text-muted color, hairline rule beside.
- Key lines (case punchlines): display italic (EN) / Vazirmatn 400 (FA), cream on espresso or espresso on cream.
- Italic is **Latin-only** — never italicize Persian (fake slant is forbidden); emphasis in FA = weight or color shift.

### Loading plan (Phase 08)

- Self-host via `@fontsource` packages (WOFF2, subsets: `latin` for CG/Jost, `arabic` for Vazirmatn)
- `font-display: swap`; preload the two display fonts (latin + arabic subsets)
- Total font budget: ≤ 250 KB across all weights

---

## 3. DIGIT SYSTEM — DECISION (LOCKED)

> **Digits follow the language: FA shows Persian digits ۱۲۳ — EN shows Latin digits 123.**

**Why (recommendation rationale):**
1. **Bidi safety:** Latin digits inside RTL text trigger Unicode bidi reordering bugs (`+50%` can visually flip to `%50+` in Persian sentences). Persian digits eliminate the entire bug class.
2. **Editorial convention:** premium Persian publications use Persian numerals; Latin digits inside an elegant Persian editorial break the reading rhythm.
3. **Already consistent:** the locked FA copy uses Persian digits (۵+, +۵۰٪, ۳٫۵٪) and the EN JSON is normalized to Latin (5+, +50%, 3.5%) — zero content changes needed.

**Mechanics:**
- FA percent sign: `٪` (U+066A) · FA decimal separator: `٫` — as already in the locked copy.
- **Always Latin in both languages:** `THE HER × OMID` lockup, URLs (`omidadli.site`), acronyms (UX, UI, CRM, CTR, SEO, CPA), and The Her / Omid brand names.
- Implementation: digits live in the i18n JSON (already correct); NO runtime conversion.

---

## 4. SPACE, GRID & LAYOUT

- Section rhythm: `--space-section: clamp(6rem, 14vh, 12rem)` — high whitespace is the luxury signal.
- Gutters: `--space-gutter: clamp(1.25rem, 5vw, 6rem)`.
- Grid: 12-col desktop (≥1024), 6-col tablet (768), single column mobile (<640) with full-bleed scenes allowed.
- Max content width: `72rem` (1152px); media may bleed wider (`85rem`).
- **Radius = 0 everywhere** (editorial sharpness). No shadows except a single soft elevation on the preview frame.
- Hairlines: 1px `--color-beige` (light) / `rgba(183,169,154,.25)` (dark).
- Vertical rhythm unit: `0.5rem` scale; paragraph spacing `1.25em`.

## 5. IMAGERY & VIDEO DIRECTION

- Editorial portraiture, warm interiors, premium artifacts, muted warm grade toward palette (F3, F18, F21).
- Full-viewport scenes: video first (lazy, poster-first), grain overlay allowed (subtle, ≤3% opacity).
- Per-scene visuals: see [`storyboard.md`](storyboard.md) + [`prompts/flow/scene-prompts.md`](../prompts/flow/scene-prompts.md) (already on-palette by prompt).
- OG share image (Phase 06): ivory canvas, espresso Cormorant lockup `THE HER × OMID`, caption line — 1200×630.

## 6. MOTION PRINCIPLES

| Property | Value |
|---|---|
| Easing | `--ease-editorial: cubic-bezier(0.22, 1, 0.36, 1)` |
| Durations | slow `1200ms` (scene transitions) · medium `700ms` (element reveals) · fast `300ms` (hovers only) |
| Reveal pattern | fade + `0.5–1rem` rise, staggered `80–120ms` per item |
| Scroll video | scrubbed slowly; never janky (rAF, will-change on transform only) |
| Score | scroll-synced (spec: architecture §4) |
| Reduced motion | `prefers-reduced-motion` → static posters, no parallax/scrub, content fully readable ⚠️ mandatory |

**Forbidden:** animation for animation's sake, aggressive transitions, bouncy easings, autoplaying sound, floating particles, neon glows.

## 7. RTL RULES — FINAL (hard rules)

1. CSS uses **logical properties only** (`margin-inline`, `padding-block`, `inset-inline-start`, `border-inline-start`, `text-align: start`). Physical `left/right` is a code-review error.
2. `html[dir]` drives everything: font stack swap, `letter-spacing: 0`, `text-transform: none`, line-height bumps (all in `global.css`).
3. Embedded Latin inside FA (The Her, Omid, UX, CRM, URLs) is wrapped in `<bdi>` or `dir="ltr"` spans for bidi isolation.
4. Directional icons (→) flip via `[dir="rtl"] svg { transform: scaleX(-1) }` — prefer neutral (↓) where possible.
5. Language switch preserves scroll position; `lang` + `dir` attributes set together; shareable `?lang=fa`.
6. FA punctuation only in FA copy: `، ؛ ؟ « » ٪` — never Latin `, ; ? "`.
7. Number badges/counters use the FA digit set from i18n JSON (no runtime conversion).

## 8. MOBILE RULES — FINAL

| Rule | Spec |
|---|---|
| Breakpoints | `<640` mobile · `768` tablet · `1024` desktop · `1280+` wide |
| Video | poster-first; 720p mobile variants; IntersectionObserver; `playsinline muted` |
| S05 Growth Engine | CSS/SVG motion instead of video |
| S07 Stepper | tap-through, ≥48px touch targets, one diagnostic step per viewport |
| S11 Preview | Mode B (screen-capture video) on mobile; Mode A iframe desktop |
| S00 Entry | full-screen overlay, both buttons ≥48px |
| Safe areas | `env(safe-area-inset-*)` padding |
| Interaction | never hover-dependent — everything tappable |
| Budget | LCP < 2.5s on Fast 3G; hero poster ≤ 250 KB; score lazy-loaded after entry |

## 9. COMPONENT / UI LANGUAGE

- **Buttons:** espresso fill + cream text (primary); hairline outline + espresso text (secondary); uppercase EN / normal FA; tracking 0.14em (EN); quiet hover = beige fill shift `300ms`. Thin underline links (echo of The Her's "START", F4).
- **Kicker:** caption-size label + 1px hairline, top of every section.
- **Cards (cases/models):** cream surface on ivory, 1px beige hairline, no radius, generous padding (`2.5rem`).
- **Preview frame (S11):** browser-chrome outline (1px beige, dot accents taupe), soft elevation `0 24px 60px rgba(23,20,17,.12)`, cream toolbar.
- **Stepper (S07):** numbered hairline progress, active step espresso, completed taupe.
- **Nav:** transparent over hero → ivory with beige hairline on scroll; language switch `EN | فا` caption style.
- **Icons:** minimal line icons, 1.5px stroke, espresso/beige only.

## 10. WHAT CHANGED FROM v0

| v0 (provisional) | v1 final | Why |
|---|---|---|
| gold accent `#B08D57` | **removed** — accent = deep taupe `#8C7A6B` (focus only) | The Her has no metallic; restraint is the accent |
| ivory `#F6F1E9`, champagne `#E9DFCE`, taupe `#A99383`, espresso `#3B2E27`, black `#1C1714` | **observed** `#F0ECE3 / #E7DFD2 / #B7A99A / #2C1E17 / #171411` + `#F7F4ED`, `#D4C4B3` | measured from The Her screenshots (intelligence §3) |
| EN body "Inter" | **Jost** | geometric = fashion editorial; Inter reads SaaS |
| FA line-heights = EN | FA display `1.35`, body `1.9` | Persian needs more air |
| digits undecided | **digits follow language** | bidi safety + editorial convention (§3) |

---

**Gate 04 check:** palette = observed The Her ✓ · type pairing locked ✓ · digits locked ✓ · RTL/mobile rules final ✓ · tokens synced to code ✓
