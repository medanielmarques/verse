# Verse – Implementation Plans

Plans derived from [roadmap.md](../roadmap.md). Each plan groups related features for staged implementation.

## Execution Order

| # | Plan | Focus |
|---|------|-------|
| 01 | [Visual Customization](./01-visual-customization.md) | Templates, fonts, backgrounds, layouts |
| 02 | [UX & Quality](./02-ux-quality.md) | Real-time preview, copy text |
| 03 | [Sharing & Viral](./03-sharing-viral.md) | Share link, social export, watermark |
| 04 | [Advanced Content](./04-content-advanced.md) | Spotify import, word highlight, auto format |
| 05 | [Export Formats](./05-export-formats.md) | Animated cards, wallpaper generator |
| 06 | [Product Platform](./06-product-platform.md) | Library, collections, trending |

## Dependencies

- **01** → Foundation for all other plans (every card uses templates)
- **02** → Independent, can run in parallel with 01
- **03** → Benefits from 01 (better cards = better sharing)
- **04** → Independent, more complex (APIs, parsing)
- **05** → Builds on 01 (same card engine, new export targets)
- **06** → Needs backend; 03 (share links) may inform data model
