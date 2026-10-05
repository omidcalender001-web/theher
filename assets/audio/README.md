# Audio — Scroll-Synced Score (ACTIVE decision D3)

> **Decision (2026-10-04):** the page has an instrumental score.
> Music position = scroll position (first scroll starts, scrolling back rewinds).
> Full engineering spec: [`docs/proposal-architecture.md` §4](../../docs/proposal-architecture.md)

---

## ⚠️ Tool correction — use AI Studio, not Flow

**Google Flow generates video, not music.** The score is produced with **Google AI Studio → Lyria**
(music generation model — same AI Studio you already used for the intelligence report).

- Open `aistudio.google.com` → model picker → **Lyria** (music)
- Paste the prompt below → generate 2–3 variants → pick the calmest, warmest one
- Download MP3

## PROMPT (copy-paste)

```text
A slow, elegant, cinematic ambient instrumental for a luxury brand film.
Instrumentation: soft felt piano, warm string swells, deep gentle bass, airy pads.
Tempo & rhythm: very slow, 60–70 BPM, free-flowing, no drums, no percussion.
Soundscape: warm spacious reverb, intimate and quiet, like sunrise in an ivory room.
Emotional arc: calm curiosity → quiet confidence → warm optimism. Seamless loop.
Instrumental only, no vocals.
```

**Negative prompt (if the field is available):**
```text
vocals, drums, percussion, loud dynamics, sudden changes, complex melodies,
drops, EDM, bright synth leads, dark tension, melancholy
```

## Tips

- Generate 3–5 variants; choose the one that stays interesting but **never demands attention**.
- The track must work as a **loop** — no obvious ending.
- If only short clips are available, generate one theme in multiple lengths and crossfade into a 2–3 min track.

## File spec (after generation)

| Property | Value |
|---|---|
| Name | `assets/audio/score.mp3` (+ `score.ogg` fallback) |
| Length | 2–3 minutes, seamless loop |
| Bitrate | 128 kbps MP3 → target ≤ 3 MB total |
| Loading | lazy — fetch after first paint / S00 click, never block LCP |
| Playback | scroll-synced via `currentTime = progress × duration` (rAF + lerp) |
| Start | S00 "Begin with sound" click (browser gesture requirement) + nav toggle fallback |
| iOS | begin scrubbing only after `canplaythrough`; fallback to play/pause sync |

## License ⚠️

Before launch, verify that AI Studio / Lyria output terms permit use on a commercial client
proposal site, and record the conclusion here:

- [ ] Terms checked (date / conclusion): …
