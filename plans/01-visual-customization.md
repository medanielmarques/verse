# Plan 01: Visual Customization

**Goal:** Expand from 1 template to multiple styles. Biggest immediate impact.

## Features

### Templates

Add 4 distinct styles:

| Template | Description |
|----------|-------------|
| **Minimal** | White background, serif font, center text |
| **Spotify style** | Green accent, dark background, album cover |
| **Poster** | Big typography, bold font, edge-to-edge layout |
| **Tweet style** | Square card, short lines, very shareable |

### Fonts

Add 4–6 font options:

- Serif (literary)
- Sans (clean)
- Mono (dev vibe)
- Script (handwritten)
- Bold display

### Backgrounds

- Solid color
- Gradient
- Noise texture
- **Album cover blur** (Spotify Canvas vibe – very strong idea)
- Photo background

### Layouts

- Center text
- Left aligned
- Big quote style
- Stacked lines

## Implementation Notes

- Start with templates as presets (combine font + background + layout)
- Fonts: use Google Fonts or similar CDN
- Album cover blur: integrate with lyrics API to fetch cover art
- Consider a "customize" panel vs template selector
