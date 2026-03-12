# Verse

**Lyrics to image.** Search for songs, pick your favorite verses, and generate shareable lyric cards as PNG images.

## What it does

Verse lets you:

1. **Search** — Find songs by name via the [lrclib.net](https://lrclib.net) lyrics API
2. **Select** — Choose a song and highlight the verses you want
3. **Generate** — Create a clean, minimal lyric card with artist and track attribution
4. **Download** — Save the card as a PNG image

## Tech stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React 19, Vite)
- **Routing:** TanStack Router
- **Data:** TanStack Query
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Package manager:** [bun](https://bun.sh)

## Getting started

```bash
# Install dependencies
bun install

# Start dev server (http://localhost:3000)
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server on port 3000 |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run test` | Run tests |
| `bun run check` | Lint and format with Biome |

## Project structure

```
src/
├── components/     # LyricsSearch, CardPreview, Header, Footer
├── integrations/   # TanStack Query setup
├── routes/         # TanStack Router file-based routes
└── styles.css      # Tailwind entry
```

## License

MIT — do whatever you want with it. See [LICENSE](LICENSE) for details.
