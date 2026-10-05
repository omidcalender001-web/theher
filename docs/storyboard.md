# MASTER STORYBOARD — FINAL v1.0

> **Phase 04 deliverable** — derived 1:1 from the locked architecture ([`proposal-architecture.md`](proposal-architecture.md) §2, S00–S11) and the production-ready Flow prompts ([`prompts/flow/scene-prompts.md`](../prompts/flow/scene-prompts.md)). No new decisions introduced.
> **Status:** ✅ Finalized 2026-10-04

---

## Audio (LOCKED — decision D3)

Scroll-synced instrumental score (music position = scroll position; scrolling back rewinds). Produced with **AI Studio → Lyria** — prompt + spec: [`assets/audio/README.md`](../assets/audio/README.md) · Engineering: architecture §4.

## Visual system

Palette, type, motion values: [`art-direction.md`](art-direction.md) — all scenes inherit it. Mobile fallback for every video scene = **poster frame** (plus CSS/SVG motion for Scene 5).

---

## SCENE 0 — THE ENTRY (S00)
- **Purpose:** unlock the film + the score (browser gesture requirement)
- **Narrative line:** Scroll to begin
- **Visual:** near-black `#171411`, THE HER × OMID lockup (Cormorant, warm-white)
- **Motion:** lockup fade-in 1200ms; overlay dissolve 1200ms on choice
- **Interaction:** two buttons — Begin with sound / Continue in silence (≥48px)
- **Audio:** silence → score armed on "with sound"
- **Asset:** none (pure typography)
- **Mobile fallback:** identical

## SCENE 1 — THE VISION (S01 · Act I)
- **Purpose:** curiosity; first impression unmistakably The Her
- **Narrative line:** A WORLD OF BUSINESS WOMEN.
- **Visual:** Flow scene 01 — warm sunlit studio, business women at marble table (full-viewport)
- **Motion:** scroll scrubs video slowly; headline letters ease in, staggered
- **Interaction:** hero video scrub; ENTER THE WORLD button
- **Audio:** score 0:00–; soft piano bed
- **Asset:** `scene-01-vision.mp4` + poster
- **Mobile fallback:** poster + CSS parallax-free reveal

## SCENE 2 — THE BUSINESS (S02 · Act II)
- **Purpose:** recognition — different businesses
- **Narrative line:** Behind every ambitious woman, there is a different business.
- **Visual:** editorial mosaic — journal/planning, product package, phone with boutique site, dashboard (echo of The Her's four program worlds)
- **Motion:** mosaic items reveal sequentially (stagger 100ms)
- **Interaction:** hover/tap enlarges one artifact
- **Asset:** `scene-02-business.mp4` + stills
- **Mobile fallback:** single-column mosaic, tap-to-expand

## SCENE 3 — THE COMPLEXITY (S03 · Act III)
- **Purpose:** tension (calm) — different problems
- **Narrative line:** Different businesses. Different problems.
- **Visual:** 7 problems surfacing one per scroll-tick over scene 03 video (low opacity)
- **Motion:** typewriter-of-facts rhythm; each problem fades + rises
- **Interaction:** scroll-driven list build
- **Asset:** `scene-03-complexity.mp4` (background, ≤20% opacity)
- **Mobile fallback:** poster bg, static list with staggered reveal

## SCENE 4 — THE QUESTION (S04 · Act IV) — tension peak
- **Purpose:** the strategic tension, darkest moment
- **Narrative line:** So why should they all receive the same solution?
- **Visual:** pure typography on soft-black `#171411`, single centered line
- **Motion:** slow scale-in 1200ms; score thins to near-silence
- **Interaction:** none — a held breath
- **Asset:** none (typography only)
- **Mobile fallback:** identical

## SCENE 5 — THE SYSTEM (S05 · Act V)
- **Purpose:** understanding — the partnership
- **Narrative line:** The Her understands the woman. Omid focuses on the system.
- **Visual:** two light streams (ivory / espresso-gold... → ivory / warm beige) converging; split panels THE WOMAN / THE SYSTEM
- **Motion:** scroll draws the two panels together into one seam
- **Interaction:** SEE HOW IT CONNECTS scrolls to S06
- **Asset:** `scene-04-system.mp4` + poster
- **Mobile fallback:** stacked panels, seam animation via CSS

## SCENE 6 — THE GROWTH ENGINE (S06 · Act VI)
- **Purpose:** understanding → possibility
- **Narrative line:** DATA + MARKETING + EXPERIENCE + AI → one engine
- **Visual:** four capability threads weaving into one luminous engine
- **Motion:** threads converge on scroll; each layer highlights with its one-liner
- **Interaction:** layer tap/click → `layer_tap` analytics event
- **Asset:** `scene-05-engine.mp4`
- **Mobile fallback:** **CSS/SVG motion only** (no video) — locked rule

## SCENE 7 — PROOF OF THINKING (S07) ⭐
- **Purpose:** possibility — diagnosis before prescription
- **Narrative line:** "We need more sales."
- **Visual:** espresso section; 7-step hairline stepper (Traffic → Offer → Trust → Experience → Conversion → Follow-up → Data)
- **Motion:** one step per scroll-tick; punchline THE PROBLEM DEFINES THE SOLUTION. in italic display
- **Interaction:** scroll/tap stepper; `case_interaction {step}`
- **Asset:** none (typographic system)
- **Mobile fallback:** tap-through, one step per viewport, ≥48px targets

## SCENE 8 — THE CASES (S08)
- **Purpose:** possibility — three hypothetical worlds
- **Narrative line:** 3 × quote → diagnosis → response → key line (labeled «سناریوی فرضی»)
- **Visual:** cream cards on ivory, hairline, key line in italic (EN) / regular (FA)
- **Motion:** cards rise staggered on scroll
- **Interaction:** EXPLORE THE APPROACH expands full diagnosis
- **Asset:** optional still from scenes 2/3 per card
- **Mobile fallback:** stacked cards

## SCENE 9 — THE EVIDENCE (S09)
- **Purpose:** trust — evidence, not a CV
- **Narrative line:** Built through years of growth work.
- **Visual:** 5 quiet numbers (display serif, espresso), generous whitespace
- **Motion:** numbers count/fade in once (600ms), no loop
- **Interaction:** none — stillness = confidence
- **Asset:** none
- **Mobile fallback:** 2-col grid → 1-col

## SCENE 10 — THE PARTNERSHIP (S10)
- **Purpose:** trust — value + 3 models
- **Narrative line:** What if The Her could offer more — without becoming more?
- **Visual:** DIRECT / CLIENT / WHITE LABEL cards with formulas (The Her ↔ Omid …)
- **Motion:** cards reveal staggered; formulas type-in
- **Interaction:** EXPLORE THE PARTNERSHIP scrolls to S11
- **Asset:** `scene-06-collaboration.mp4` (background, optional)
- **Mobile fallback:** poster / none

## SCENE 11 — THE FUTURE / CTA (S11)
- **Purpose:** action + live proof
- **Narrative line:** Let's explore what we could build together.
- **Visual:** sunrise scene as backdrop; browser-chrome **preview frame** (iframe Mode A desktop / screen-capture video Mode B mobile) of `omidadli.site`
- **Motion:** frame rises with soft elevation; content fades in
- **Interaction:** frame click + "Open in a new tab" → `cta_click {preview|new_tab}`
- **Audio:** score resolves to warm resolve at 100% scroll
- **Asset:** `scene-07-future.mp4` + poster + preview video (Mode B)
- **Mobile fallback:** Mode B video + button

## CLOSING LOCKUP (footer)
- THE HER × OMID — *A partnership built around possibilities.* + tagline, on soft-black
