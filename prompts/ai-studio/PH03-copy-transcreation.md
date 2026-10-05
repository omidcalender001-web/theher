# PH03 — English Copy + Persian Transcreation

- **Phase:** 03 — Copy & Transcreation
- **Tool:** Google AI Studio (aistudio.google.com) — Gemini
- **Date:** 2026-10-04
- **Output (client-delivered, LOCKED):** [`content/en/copy.md`](../../content/en/copy.md) · [`content/fa/copy.md`](../../content/fa/copy.md)
- **Applied to:** `src/i18n/en.json` + `src/i18n/fa.json` (schema s1–s11, key parity verified)
- **Gate:** 03 ✅ passed 2026-10-04

---

## PROMPT (from playbook step 3)

```text
You are a world-class bilingual copywriter for premium editorial websites:
native-level English + native Persian (Farsi).

CONTEXT: A cinematic scroll-driven partnership proposal:
"The Her" (a brand for business women) × "Omid" (growth, data, marketing,
digital experience, AI).
Narrative: The Her understands the woman behind the business. Omid focuses on
the system behind the business.
Tone: quiet luxury, editorial, premium, concise. No fluff, no buzzwords,
no exclamation marks.

TASK 1 — ENGLISH FINAL COPY
For each section write: kicker, headline, subheadline (max 12 words),
body (max 40 words), plus microcopy for buttons.
Sections:
1. Opening — A world of business women
2. Behind every ambitious woman, there is a different business
3. Different businesses. Different problems. (the 7 problems list)
4. So why should they all receive the same solution?
5. The partnership split (The Her = the woman / Omid = the system)
6. Growth engine — DATA + MARKETING + EXPERIENCE + AI → one engine
7. Proof of thinking — "We need more sales." (7-step diagnostic)
8. Three hypothetical cases — quote → diagnosis → response → key line,
   each labeled "Hypothetical client scenario"
9. Proof numbers (5+ yrs, +50% organic, −30% CPA, 3.5% CTR, 15 keywords)
10. Partnership value + 3 collaboration models (Direct / Client / White label)
11. CTA — Let's explore what we could build together.

TASK 2 — PERSIAN TRANSCREATION
Transcreate, do NOT translate literally. Preserve meaning, emotional effect,
clarity, persuasion, premium tone. Rules:
- Use نیم‌فاصله (ZWNJ) correctly.
- Keep "The Her" and "Omid" in Latin script.
- Natural Persian — no translated-page feeling, like an elegant Persian editorial.
- Numbers in Persian digits (۱۲۳).

Output two Markdown chapters: "## ENGLISH" and "## فارسی".
```

---

## USAGE LOG

| Pass | Result | Decision |
|---|---|---|
| 1 | Full 11-section bilingual copy with kickers/subheads/buttons; all 3 cases labeled "Hypothetical client scenario" / «سناریوی فرضیِ مشتری» | ✅ Accepted & locked (client authored/delivered via PR branch, commits 90384c7 + 95de6a7) |

## QA NOTES (from application pass)

- EN copy arrived with Persian digits (۵+, +۵۰%) → normalized to Latin digits in `en.json` (EN convention). FA keeps Persian digits — final digit-system decision: Phase 05.
- Key lines and case labels all present; no internal The Her data claimed; The Her leads (Rule 05 ✓).
- i18n schema restructured act-based → `s1…s11` to mirror `content/` 1:1; parity verified programmatically.
