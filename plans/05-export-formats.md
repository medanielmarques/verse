# Plan 05: Export Formats

**Goal:** Expand beyond static images for social/viral use.

## Features

### Animated Cards

Export as:

- **GIF**
- **Video**

Ideal for:

- Instagram Stories/Reels
- TikTok
- More engaging than static

### Wallpaper Generator

Transform lyrics into:

- **Phone wallpaper** (9:16 or similar)
- **Desktop wallpaper** (16:9)

- Different aspect ratios
- Optimized for each format
- Can viralize as "make your own lyric wallpaper"

## Implementation Notes

- GIF/Video: use canvas recording, or libraries like gif.js, ccapture.js
- Consider: animated text reveal, subtle background motion
- Wallpaper: new export presets with correct dimensions
- Phone: 1080×1920 or 1170×2532 (common iPhone sizes)
- Desktop: 1920×1080, 2560×1440
