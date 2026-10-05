# THE HER × OMID

**A bilingual, scroll-driven proposal for a practical digital growth partnership with The Her.**

- **Default language:** English (LTR)
- **Secondary language:** Persian / فارسی (RTL)
- **Visual direction:** Editorial Cinematic / Quiet Luxury
- **Brand balance:** 70% The Her / 30% Omid
- **Stack:** [Astro](https://astro.build) SSR · Netlify Functions · GSAP ScrollTrigger · CSS design tokens
- **Deployment:** GitHub → Netlify (auto-build on push; Node.js 22)
- **Workflow:** GitHub → Arena Agent + Google AI Studio → Google Flow → Netlify

---

## Core narrative

> **The Her understands the woman behind the business.**
> **I focus on the system behind the business.**
>
> *Different businesses. Different problems. One partner. Many possibilities.*

---

## Repository map

| Folder | Purpose | Handoff phase |
|---|---|---|
| `هندآف ساخت پروژه.md` | Master handoff / single source of truth for the brief | — |
| `docs/` | Strategy documents: intelligence report, architecture, storyboard, art direction, decision gates, QA | 01–05, 09 |
| `research/` | Public research material about The Her (screenshots, notes, references) | 01 |
| `strategy/` | Working strategy drafts (before they are approved into `docs/`) | 01–02 |
| `content/` | Locked bilingual copy — `en/` source of truth, `fa/` transcreation | 03 |
| `prompts/` | AI prompts per tool: `arena/`, `ai-studio/`, `flow/` | 06–08 |
| `assets/` | Raw/source assets: `brand/`, `images/`, `video/`, `audio/` | 00, 06 |
| `src/` | Site source: Astro pages, layouts, components, styles, i18n dictionaries | 08 |
| `public/` | Static files served as-is: favicon, robots, OG image | 08–10 |
| `qa/` | QA reports, browser/device matrices | 09 |
| `.github/` | Issue & PR templates — the project task system | 00 |

📄 **Complete file manifest & requirements (فارسی):** [`docs/setup-guide-fa.md`](docs/setup-guide-fa.md)

📘 **Step-by-step execution playbook — which tool, which prompt, which file (فارسی):** [`docs/playbook-fa.md`](docs/playbook-fa.md)

## Status

**Phase 09 — QA** ✅ complete ([`qa/qa-report.md`](qa/qa-report.md)) — production candidate.
9 automated bug-fixes in final audit (mobile S03 overflow, a11y SSR, netlify cache paths, robots, reduced-motion video, svh fallbacks…).
**Gates 01–05 passed** · Gate 06 (launch) pending device checks on production URL.
**Next: Phase 10 — Netlify deployment.**
**Gates 01–03 passed.** Visual system locked: observed The Her palette (7 hex) · Cormorant Garamond + Jost + Vazirmatn · digits follow language (FA ۱۲۳ / EN 123) · RTL & mobile rules final · `src/styles/global.css` synced.
**Locked decisions:** CTA = live preview of omidadli.site · bilingual from day one · scroll-synced score (AI Studio → Lyria).
See [`docs/decision-gates.md`](docs/decision-gates.md) · Playbook: [`docs/playbook-fa.md`](docs/playbook-fa.md).

## Golden content rules (from handoff §15)

1. Hypotheses are not facts — never claim internal The Her data.
2. Hypothetical cases must be labeled **"Hypothetical client scenario."**
3. Do not overclaim AI — AI is a capability layer, not the identity.
4. Do not turn the page into a CV.
5. The Her comes first (70/30).
6. Omid is introduced as a partner, not a service list.
7. Show thinking before credentials.

## Running locally (Phase 08+)

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # Astro and TypeScript diagnostics
npm run build    # SSR bundle + Netlify Function → dist/
```

---

**THE HER × OMID — A partnership built around possibilities.**
