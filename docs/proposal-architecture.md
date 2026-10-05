# PROPOSAL ARCHITECTURE v1.0 — FINAL

> **Phase 02 deliverable** — input for **Gate 02 (Narrative Approval)**.
> The complete experience must be understandable from this document alone — no design, no code.
> **Sources:** handoff master narrative · [`intelligence-report.md`](intelligence-report.md) (F/H references)

**Status:** ✅ Finalized — ⬜ awaiting Gate 02 approval · **Date:** 2026-10-04

---

## 0. LOCKED DECISIONS (client, 2026-10-04)

| # | Decision | Value |
|---|---|---|
| D1 | **CTA destination** | Live **preview box of `omidadli.site`** — visible inside the landing (embedded) AND openable in a new tab |
| D2 | **Bilingual** | **From day one** — EN default (LTR) + FA (RTL), language switch preserves narrative position |
| D3 | **Music** | Instrumental ambient score, **synced to scroll position** — first scroll starts it, scrolling back rewinds it proportionally |
| D4 | **Audio production tool** | **Google AI Studio → Lyria** (music model) — Flow is for video, not music |

---

## 1. EMOTIONAL SEQUENCE (fixed)

Curiosity → Recognition → Tension → Understanding → Possibility → Trust → Action

## 2. SECTION ORDER (S00–S11 — locked)

### S00 — ENTRY MOMENT *(new, for D2/D3)*
- **Purpose:** unlock the film — one gesture enables the scroll-synced score (browser autoplay policy requires a click before audible audio; a wheel-scroll is *not* a legal gesture).
- **Experience:** near-black screen · THE HER × OMID lockup fades in · line: "Scroll to begin" · two quiet options: **Begin with sound** / **Continue in silence**.
- **Interaction:** click either → overlay dissolves (1.2s) → score armed → from here on, music position = scroll position.
- **Fallback:** user chose silence → minimal sound toggle in nav; one tap enables the score at the current scroll point.
- **Reduced motion:** overlay without fade; music still optional.

### S01 — ACT I · THE WOMAN — Scene 01
- **Headline (EN):** A WORLD OF BUSINESS WOMEN.
- **Emotion:** Curiosity. First impression must feel unmistakably The Her (F1, F18–F24).
- **Visual:** Flow scene 01 (warm studio, business women, morning light) full-viewport, poster first.
- **Interaction:** scroll scrubs the video forward slowly; headline letters ease in with generous tracking (F19).
- **Asset:** `scene-01-vision.mp4` + poster. **Analytics:** `scroll_depth 25`.

### S02 — ACT II · THE BUSINESS — Scene 02
- **Headline:** Behind every ambitious woman, there is a different business.
- **Emotion:** Recognition.
- **Visual:** editorial mosaic of business artifacts — journal/planning, a product package, phone with a boutique site, packaging, dashboard (echo of The Her's four program worlds F13–F17: planning, lifestyle, branding, income).
- **Interaction:** mosaic items reveal sequentially on scroll; hover/tap enlarges one artifact.
- **Asset:** `scene-02-business.mp4` + stills.

### S03 — ACT III · THE PROBLEM — Scene 03
- **Headline:** Different businesses. Different problems.
- **Emotion:** Tension (calm, not chaotic).
- **Content:** the 7 problems — More sales · More leads · Better conversion · A better website · Better data · AI & automation · A digital product.
- **Interaction:** each problem surfaces one scroll-tick at a time, typewriter-of-facts rhythm.
- **Asset:** `scene-03-complexity.mp4` background, low opacity.

### S04 — ACT IV · THE QUESTION — tension peak
- **Headline:** So why should they all receive the same solution?
- **Emotion:** Tension peak. Darkest visual moment (espresso `#2C1E17` / soft black `#171411` — F18).
- **Interaction:** single line, center screen, slow scale-in; silence-friendly pause in the score's arc.
- **Asset:** none (pure typography on dark).

### S05 — ACT V · THE PARTNERSHIP — Scene 04
- **Headlines (split screen):** *The Her understands the woman behind the business.* / *I focus on the system behind the business.*
- **Emotion:** Understanding.
- **Visual:** two streams of light converging (Flow scene 04); EN/FA both honor 70/30 brand balance — The Her panel leads, larger.
- **Interaction:** scroll draws the two panels together into one seam.
- **Intelligence link:** H1, H3, H11.

### S06 — ACT VI · THE GROWTH ENGINE — Scene 05
- **Headline:** DATA · MARKETING · EXPERIENCE · AI → **ONE GROWTH ENGINE**
- **Emotion:** Understanding → Possibility.
- **Lines:** Understand what is happening. / Create demand and acquire customers. / Turn attention into action. / Make the system smarter and more scalable.
- **Interaction:** four capability threads converge into one engine as user scrolls; each layer highlights with its one-liner.
- **Mobile fallback:** CSS/SVG motion (no video).
- **Analytics:** `case_interaction` style event on each layer tap.

### S07 — PROOF OF THINKING ⭐ (the strategic heart)
- **Client says:** "We need more sales."
- **Interaction:** 7-step diagnostic stepper — Is it traffic? → the offer? → trust? → the experience? → conversion? → follow-up? → *What does the data say?* Each step reveals on scroll/tap.
- **Punchline:** **The problem defines the solution.**
- **Emotion:** Possibility. **Analytics:** `case_interaction {step}`.
- **Mobile:** tap-through stepper, large touch targets.

### S08 — HYPOTHETICAL CASES 01–03
- Each: quote → diagnose → possible response → key line. **Every case carries the label "Hypothetical client scenario" (rule 02).**
- Case 01 Sales (traffic ≠ sales) · Case 02 Digital Experience (strategy→UX→UI→Dev→Measurement) · Case 03 AI/Operations (manual → capable).
- **Interaction:** tabbed or scroll-stacked cards; key line appears in italic editorial treatment (F20).

### S09 — PROOF OF WORK — evidence, not a CV
- 5 quiet numbers: 5+ yrs · +50% organic · −30% retargeting CPA · 3.5% avg CTR · 15 keywords → page 1.
- Capability words appear as a restrained word-cloud footnote, NOT a dense list (rule 04).
- **Emotion:** Trust.

### S10 — PARTNERSHIP VALUE + MODELS
- **Headline:** What if The Her could offer more — without becoming more?
- The Her / Omid / Together triptych + support line: *A trusted growth partner behind the scenes.*
- 3 models — Direct · Client Project · White Label (each maps to opportunity-map rows in intelligence report §8).
- **Emotion:** Trust.

### S11 — CTA + LIVE PREVIEW *(D1)*
- **Headline:** Let's explore what we could build together.
- **The preview box (destination):** an elegant browser-chrome frame containing a **live preview of `omidadli.site`**, with a quiet button **"Open in a new tab"** (target=_blank, rel=noopener). The frame itself is also clickable.
- Caption: *A live example — a digital experience built end-to-end: strategy, design, content, code.*
- **Dual-mode implementation (engineering):**
  - **Mode A — live iframe:** if `omidadli.site` sends no `X-Frame-Options`/`frame-ancestors` restriction → lazy-loaded iframe in the frame. **Status 2026-10-04: site confirmed LIVE by client** (sandbox verification blocked by network — final iframe test happens empirically in the Phase 07/08 prototype).
  - **Mode B — cinematic mockup (fallback, also mobile default):** looping muted screen-capture video of the site inside the same browser frame + poster + open-in-new-tab button. Works 100%, loads faster, looks more premium on mobile.
  - Mode chosen automatically at build time; Mode B also used for weak connections.
- **Emotion:** Action. **Analytics:** `cta_click {target: preview|new_tab}`, `contact_initiation`.
- **Closing lockup:** THE HER × OMID — *A partnership built around possibilities.* + tagline.

## 3. BILINGUAL BEHAVIOR (D2 — day one)

| Behavior | Rule |
|---|---|
| Default | EN, LTR |
| Switch | FA ⇄ EN in nav — one tap, no page reload |
| Position | scroll position preserved across switch (narrative position kept) |
| Direction | `dir` flips → logical CSS properties mirror layout automatically |
| Typography | FA: no uppercase, no letter-spacing, Vazirmatn, generous line-height; numbers per Phase 05 decision |
| Copy | FA is a **transcreation** — never literal (Phase 03) |
| URLs | `?lang=fa` for shareable Persian link |

## 4. AUDIO SYSTEM — SCROLL-SYNCED SCORE (D3 — engineering spec)

### The experience
One continuous instrumental track is the film's score. **Music position = scroll position:** first scroll starts it from 0; scrolling forward advances it; scrolling back rewinds it proportionally — the page is the timeline.

### Technical mapping
```text
scrollProgress p = scrollY / (docHeight − viewportHeight)   // 0…1, eased
target:  audio.currentTime = p × audio.duration
update:  requestAnimationFrame loop, lerp toward target (no jumps, no jitter)
```

### Browser reality (why S00 exists)
Audible audio requires a **user gesture**; a wheel/scroll event does NOT count. So: S00's "Begin with sound" click unlocks the `AudioContext`/media element → from that moment the score is armed and strictly scroll-driven. Users who skip sound get the nav toggle; one tap unlocks at current position.

### Track spec (produced in Phase 06 — see `assets/audio/README.md`)
| Property | Value |
|---|---|
| Tool | **Google AI Studio → Lyria** (music generation) |
| Length | 2–3 min (must cover typical full-scroll duration; seamless loop) |
| Character | slow 60–70 BPM, felt piano + warm strings + airy pads, no drums, no vocals |
| Files | MP3 128kbps (≤ ~3 MB) + OGG fallback, lazy-loaded after first paint |
| Volume | low bed level; never fights the visuals; respects system mute |
| iOS Safari | scrub after `canplaythrough`; fallback = gentle play/pause sync if scrub stutters |
| License | verify AI Studio output terms permit this use — document in `assets/audio/README.md` before launch |

## 5. ANALYTICS — DROPPED (decision D5, 2026-10-04)

**Client decision: no analytics on this site.** GA4 / event tracking removed from the build
(was: page_view, language_switch, scroll_depth, case_interaction, layer_tap, cta_click).

## 6. KEY DECISIONS LOG

| Date | Decision | Reason |
|---|---|---|
| 2026-10-04 | Gate 01 passed | Client approval |
| 2026-10-04 | CTA = live preview box of omidadli.site + new tab (D1) | Client decision — the proposal ends by *showing* a built system, not describing one |
| 2026-10-04 | Bilingual from day one (D2) | The Her itself is FA\|EN bilingual (F2) — audience includes Persian speakers |
| 2026-10-04 | Scroll-synced instrumental score (D3) | Client decision — deepens "the scroll is the narrative"; page = timeline |
| 2026-10-04 | S00 entry moment added | Browser autoplay policy requires a click before audible audio; also sets cinematic tone |
| 2026-10-04 | Preview dual-mode (iframe / video mockup) | omidadli.site not verifiable today; iframe framing permission unknown — Mode B guarantees the moment |

| 2026-10-04 | **D5 — Analytics dropped** (GA4 removed entirely) | Client decision — the proposal is a cinematic experience, not a measured funnel |

## 7. EXIT CRITERIA (Gate 02)

- [x] Section order locked with headlines
- [x] Bilingual behavior defined
- [x] CTA destination specified (D1)
- [x] Audio experience specified (D3)
- [x] Analytics events defined
- [ ] Client confirms: this document alone tells the whole story → **Gate 02**
