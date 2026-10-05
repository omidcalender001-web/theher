# ART DIRECTION / VISUAL SYSTEM

> **Phase 05 deliverable** — must pass **Gate 04 (Visual Approval)** before Phase 07/08.
> Principle: the site must feel like **"The Her, expanded into a growth story"** —
> NOT "The Her + generic AI website". No neon, no cyber, no SaaS clichés.

**Status:** ⬜ Draft

---

## 1. Color system (quiet luxury)

| Token | Value (v0) | Role |
|---|---|---|
| `--color-ivory` | `#F6F1E9` | primary background |
| `--color-champagne` | `#E9DFCE` | soft surfaces |
| `--color-taupe` | `#A99383` | secondary text, hairlines |
| `--color-espresso` | `#3B2E27` | headings on light |
| `--color-soft-black` | `#1C1714` | dark scenes, footer |
| `--color-accent` | `#B08D57` | *provisional* metallic accent |

## 2. Typography

| Role | EN candidate | FA candidate | Notes |
|---|---|---|---|
| Display | Cormorant Garamond / Marcellus | Vazirmatn (light) | large editorial headlines, thin weights |
| Body | Inter / Jost (300–400) | Vazirmatn (300–400) | quiet, minimal UI |
| Uppercase tracking | `0.18em` | **none** | Persian has no uppercase; letter-spacing must reset |

- Numbers in FA: decide Persian digits (۰۱۲۳) vs Latin in stats — **lock one system**
- Line-height FA: needs more generous leading than EN

## 3. Spacing & grid

- High whitespace: section padding `clamp(6rem, 14vh, 12rem)`
- 12-col grid desktop, single column mobile, generous gutters
- Sharp corners (editorial) — `border-radius: 0`

## 4. Image direction

- Large editorial imagery, warm, lifestyle-oriented, aspirational
- AI imagery must match palette (warm ivory / champagne / espresso) — never neon/tech

## 5. Video direction

- Slow cinematic camera moves, 6–10s seamless loops, no aggressive cuts
- Poster frame for every video (mobile fallback + performance)

## 6. Motion principles

- Slow · intentional · elegant · cinematic · meaningful
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`, durations 700–1200ms
- `prefers-reduced-motion` → static fallback (mandatory)
- Avoid: animation for animation's sake, excessive parallax, aggressive transitions

## 7. RTL / LTR rules

- CSS logical properties only (`margin-inline`, `padding-block`, `inset-inline-start`)
- `dir="rtl"` switches font stack + disables uppercase/tracking
- Icons with direction (arrows) must flip or be neutral
- Language switch preserves scroll position

## 8. Mobile rules

- Poster images instead of video where weak connection
- Reduced headline scale (`clamp()` already handles)
- Touch-friendly diagnostic stepper (Proof of Thinking)

## 9. Component language

- Minimal UI: hairline dividers, quiet buttons (no heavy fills), uppercase micro-labels
- See `src/components/README.md` for the component list
