# Plan 02: UX & Quality

**Goal:** Make the product much more pleasant to use.

## Features

### Real-time Preview

**Current flow:**
```
select verses → generate
```

**Target flow:**
```
select verses → preview updates live
```

- Preview updates as user selects/deselects verses
- No need to click "generate" to see result
- Instant feedback loop

### Copy Text

Beyond image download:

- **Copy lyrics** button – copies plain text to clipboard
- Useful for sharing in messages, notes, etc.

## Implementation Notes

- Real-time preview: may need debouncing if card generation is heavy
- Copy: use `navigator.clipboard.writeText()`
- Consider copy as image too (for paste in social apps)
