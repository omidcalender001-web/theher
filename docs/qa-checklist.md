# QA CHECKLIST (Phase 09)

> Deliverable: `qa/qa-report.md` — one row per check with PASS/FAIL + notes/screenshots.
> Do not deploy (Gate 06) while any 🔴 FAIL is open.

## Visual QA
- [ ] Typography matches `art-direction.md` (EN + FA)
- [ ] Spacing / whitespace consistent across sections
- [ ] Imagery & video on-palette (no neon/AI-cliché look)
- [ ] Alignment & hairlines pixel-checked
- [ ] Brand consistency (70% The Her / 30% Omid feel)

## Interaction QA
- [ ] Scroll narrative smooth, no jank (check on 4G throttle)
- [ ] Transitions slow/intentional, no aggressive cuts
- [ ] Buttons & hover states (EN + FA)
- [ ] Language switch: EN↔FA keeps narrative position, `dir` flips correctly
- [ ] Case interactions (diagnostic stepper) work on touch
- [ ] `prefers-reduced-motion` fallback verified

## Responsive QA
- [ ] Desktop (1920 / 1440 / 1280)
- [ ] Tablet (768 / 1024)
- [ ] Mobile (360 / 390 / 414) — poster fallbacks where video disabled

## Accessibility
- [ ] Semantic structure (h1→h3, sections, landmarks)
- [ ] Keyboard navigation through all interactive elements
- [ ] Contrast ratio ≥ 4.5:1 for body text
- [ ] Reduced motion honored
- [ ] Readable FA type (line-height, no Latin letter-spacing bugs)

## Performance
- [ ] Initial load < 3s on Fast 3G (t Stout target: LCP < 2.5s)
- [ ] Videos lazy-loaded with poster images
- [ ] Responsive images served (srcset)
- [ ] No layout shift (CLS < 0.1)
- [ ] Minimal blocking JS
- [ ] Lighthouse mobile ≥ 90 (perf) / ≥ 95 (a11y)

## Analytics

- **DROPPED (D5, 2026-10-04):** no analytics on this site — skip this section.

## Content (final verification)
- [ ] All hypothetical cases labeled **"Hypothetical client scenario"**
- [ ] No internal The Her data claimed as fact
- [ ] Proof numbers match Omid's real resume
- [ ] EN copy locked & FA transcreation final
