# Plan 04: Advanced Content Features

**Goal:** Differentiate the product with smart content handling.

## Features

### Spotify Import

User pastes Spotify link → resolve song → fetch lyrics.

```
spotify link → song → lyrics
```

- Parse Spotify URLs (track, album, playlist)
- Use Spotify API or third-party to get track info
- Match with lyrics database

### Word Highlight

Highlight specific words in the verse:

```
I woke up this mornin'
```

→

```
I woke up this MORNING
```

- User selects word(s) to emphasize
- Visual treatment: bold, color, size, etc.

### Auto Format Verse

Music lyrics often come as:

```
line
line
line
line
```

Better grouped as:

```
2–4 lines per block
```

- Auto-detect verse structure
- Group lines logically (by rhyme, rhythm, or fixed count)
- Improves card readability

## Implementation Notes

- Spotify: requires API key, OAuth for full access, or use public/unoffical APIs
- Word highlight: UI for word selection, store selection in card state
- Auto format: heuristic-based (line length, punctuation) or ML if available
