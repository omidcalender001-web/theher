# Components (Phase 08)

Planned Astro components — build after Gates 04/05 pass.

| Component | Section | Notes |
|---|---|---|
| `EntryOverlay.astro` | S00 | "Scroll to begin" — Begin with sound / silence; unlocks scroll-synced score (D3) |
| `Score.astro` (or `audio.ts`) | global | scroll-synced score: `currentTime = progress × duration`, rAF + lerp, iOS fallback |
| `SoundToggle.astro` | nav | quiet sound on/off; enables score at current position if entered silently |
| `Nav.astro` | global | minimal, transparent → solid on scroll |
| `LanguageSwitch.astro` | nav | EN⇄FA, preserves scroll position, sets `dir` |
| `SitePreview.astro` | S11 CTA | browser-chrome frame with live iframe of omidadli.site (Mode A) or looping screen-capture video (Mode B / mobile) + open-in-new-tab (D1) |
| `SceneHero.astro` | Act I | full-viewport video + headline overlay + poster |
| `BusinessMosaic.astro` | Act II | different business artifacts |
| `ProblemList.astro` | Act III | the 7 problems |
| `TheQuestion.astro` | Act IV | tension moment |
| `PartnershipSplit.astro` | Act V | The Her / Omid split-screen |
| `GrowthEngine.astro` | Act VI | 4 layers → 1 engine (converge animation) |
| `DiagnosticStepper.astro` | Proof of thinking | ⭐ interactive "We need more sales" |
| `CaseStudy.astro` | Cases | quote → diagnose → response → key line + label |
| `ProofNumbers.astro` | Proof | evidence stats |
| `PartnershipModels.astro` | Models | 3 collaboration models |
| `CtaSection.astro` | CTA | final action |
| `Footer.astro` | global | closing lockup + tagline |

Rules: semantic HTML, CSS logical properties (RTL-free), lazy video + poster,
prefers-reduced-motion respected, analytics events on interactions.
