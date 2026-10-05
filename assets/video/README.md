# Video assets (Google Flow output → web-ready)

## ⚠️ GitHub constraints (read first)

- GitHub **rejects any file > 100 MB** and warns above 50 MB.
- Videos live fine in this repo **only if compressed** to the specs below.
- If a master file must stay full-quality, either use **Git LFS**, or keep masters
  outside Git (Drive/Frame.io) and commit only the web versions.

## Naming convention

`scene-{nn}-{slug}.mp4` → `scene-01-vision.mp4` … `scene-07-future.mp4`

| File | Scene | Duration | Target size |
|---|---|---|---|
| `scene-01-vision.mp4` | The Vision | 6–10s loop | ≤ 8 MB |
| `scene-02-business.mp4` | The Business | 6–10s loop | ≤ 8 MB |
| `scene-03-complexity.mp4` | The Complexity | 6–10s loop | ≤ 8 MB |
| `scene-04-system.mp4` | The System | 6–10s loop | ≤ 8 MB |
| `scene-05-engine.mp4` | The Growth Engine | 6–10s loop | ≤ 8 MB |
| `scene-06-collaboration.mp4` | The Collaboration | 6–10s loop | ≤ 8 MB |
| `scene-07-future.mp4` | The Future | 6–10s loop | ≤ 8 MB |
| `scene-{nn}-{slug}-mobile.mp4` | 720p vertical crop | same | ≤ 4 MB |

## Compression recipe (ffmpeg)

```bash
# Web master (1080p, film-like, small)
ffmpeg -i input.mov -vf "scale=-2:1080" -c:v libx264 -crf 27 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -an scene-01-vision.mp4

# Mobile (720p)
ffmpeg -i input.mov -vf "scale=-2:720" -c:v libx264 -crf 28 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -an scene-01-vision-mobile.mp4

# Poster frame
ffmpeg -i scene-01-vision.mp4 -ss 00:00:03 -vframes 1 -q:v 4 scene-01-vision-poster.jpg
```

## Implementation rules (Phase 08)

- `preload="none"` / `metadata`, `playsinline`, `muted`, `loop`
- Poster image always set (mobile fallback + no-JS fallback)
- Only render/load the video when the scene approaches the viewport
  (IntersectionObserver) — never autoplay the whole set on load
- If `prefers-reduced-motion` → show poster only

## STATUS (2026-10-04)

- All **7 final Flow scene videos delivered** (client-produced) → web copies live in `public/video/scene-01…07.mp4` (each ≤ 3.2 MB ✓)
- Posters generated → `public/images/posters/scene-XX-*-poster.jpg`
- Master zip (Flow originals) → `assets/video/source/the-her-scenes-master.zip`
- Score: placeholder warm drone at `public/audio/score-placeholder.mp3` — **replace with the Lyria track** (`score.mp3`) in Phase 06/09
