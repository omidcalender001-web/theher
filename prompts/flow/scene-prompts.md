# GOOGLE FLOW — SCENE VIDEO PROMPTS

> **Phase 06.** One prompt per modular scene (never one giant video).
> All prompts embed the locked visual direction. Save every generated scene
> + its best still + one poster frame into `assets/video/` and `assets/images/`.

**Visual DNA (append to every prompt):**
> Quiet luxury, editorial cinematic, warm ivory and champagne palette, soft espresso
> tones, natural warm light, slow deliberate camera movement, shallow depth of field,
> elegant and minimal, high whitespace, aspirational, no text overlays, no neon,
> no futuristic tech clichés, photorealistic.

---

## SCENE 01 — THE VISION (Act I — The Her's world)

```text
A slow cinematic dolly through a warm, sunlit creative studio where confident
business women work at an elegant marble table — laptops, notebooks, coffee,
flowers. Soft morning light through sheer curtains. [Visual DNA]
```
- Duration: 6–10s seamless loop · Poster: warm wide frame of the room

## SCENE 02 — THE BUSINESS (Act II — different businesses)

```text
A slow editorial montage feel: a beautifully branded product package on ivory
linen, then a phone showing a clean boutique website, then a warm workspace desk.
Each object lit like a still-life photograph. [Visual DNA]
```
- Mobile fallback: single still of the package

## SCENE 03 — THE COMPLEXITY (Act III — different problems)

```text
Abstract elegant visualization of scattered business artifacts — charts, notes,
cards — drifting slowly on a champagne background, suggesting many different
challenges. Calm, not chaotic. [Visual DNA]
```

## SCENE 04 — THE SYSTEM (Act V — the partnership)

```text
Two streams of warm light — one ivory, one espresso gold — flowing separately,
then gently converging into one luminous thread on a dark soft-black background.
Minimal, painterly, elegant. [Visual DNA]
```

## SCENE 05 — THE GROWTH ENGINE (Act VI)

```text
Four delicate threads of light (data, marketing, experience, AI) weaving slowly
into a single rotating luminous engine — like a quiet mechanical flower of light.
Slow rotation, warm metallic accents. [Visual DNA]
```
- Mobile fallback: CSS/SVG motion instead of video

## SCENE 06 — THE COLLABORATION (Partnership value)

```text
Two pairs of hands — one placing a marble stone, one completing the structure —
building an elegant minimal arrangement together on an ivory table. [Visual DNA]
```

## SCENE 07 — THE FUTURE (CTA)

```text
A slow sunrise over a calm, elegant horizon in ivory and champagne tones,
breathtaking but quiet — a new beginning. Gentle lens flare, warm haze. [Visual DNA]
```

---

## Output requirements (per scene)

| Item | Spec |
|---|---|
| Master | MP4 · H.264 · 1080p · 24fps · 6–10s · target ≤ 8 MB |
| Web-ready | MP4 (CRF 26–28) + optional WebM |
| Poster frame | JPG/WebP · 1920w · ≤ 250 KB |
| Still set | 3–5 editorial stills for `assets/images/` |
| Mobile | 720p vertical crop where the scene supports it |
