# PH01 — The Her Intelligence (brand analysis)

- **Phase:** 01 — The Her Intelligence
- **Tool:** Google AI Studio (aistudio.google.com) — Gemini
- **Input:** The Her public website screenshots (hero, Women Business Club, program cards, testimonial, case-studies sections) attached to the chat
- **Date:** 2026-10-04
- **Raw output (evidence):** [`research/the-her-ai-studio-raw-analysis.md`](../../research/the-her-ai-studio-raw-analysis.md)
- **Final synthesized deliverable:** [`docs/intelligence-report.md`](../../docs/intelligence-report.md)

---

## PROMPT (copy-paste verbatim)

```text
You are a senior brand strategist analyzing a women-focused business brand
called "The Her". I have attached screenshots of The Her's public material.

Produce a Markdown report with EXACTLY these 8 sections:

## 1. FACTS
Only what is directly visible in the screenshots. Number them F1, F2, …
(colors, typography, imagery style, tone, offers, programs, audience cues)

## 2. HYPOTHESES
Everything you infer but cannot verify. Number them H1, H2, …
Each MUST start with "Hypothesis:" or "Potential opportunity:".
NEVER present an inference as a fact.

## 3. VISUAL LANGUAGE MAP
Palette (approximate hex), typography style, imagery direction, tone of voice.

## 4. AUDIENCE MAP
Apparent primary audience, their needs and desires.

## 5. VISIBLE OFFERS
Every product / service / program visible.

## 6. BRAND STRENGTHS
5 bullets.

## 7. DIGITAL OPPORTUNITIES
5 bullets — every one phrased as a hypothesis, e.g.
"If acquisition is primarily social-led, a funnel opportunity may exist."

## 8. PARTNERSHIP FIT
One paragraph: where a growth / data / AI partner could complement The Her —
written as potential opportunity, not fact.

RULES: premium quiet-luxury editorial tone, no fluff. Anything not visible in
the screenshots MUST go to Hypotheses. Output pure Markdown, in English.
```

---

## USAGE LOG

| Pass | Result | Decision |
|---|---|---|
| 1 | 24 facts (F1–F24), 12 hypotheses (H1–H12), observed palette hex values | ✅ Accepted — good fact/hypothesis separation; palette usable for Phase 05 |
| — | Client–service opportunity map not requested by this prompt | Completed during Arena synthesis (§8 of final report) |

## NOTES FOR REUSE

- Attach as many screenshots as available; more material → more FACTS, fewer HYPOTHESES.
- If new The Her material arrives later (e.g. case-study pages), re-run this prompt
  with the new screenshots and merge new facts into `docs/intelligence-report.md` §1.
- Keep the facts/hypotheses numbering stable — Gate decisions and the architecture
  reference these IDs (F/H codes).
