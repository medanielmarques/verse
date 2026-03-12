# Plan 03: Sharing & Viral Growth

**Goal:** Transform the tool into something that grows organically.

## Features

### Share Link

Generate shareable URLs:

```
verse.so/card/abc123
```

- User generates card → gets unique link
- Anyone with link can view the card
- Enables sharing without downloading first

### Social Export

- Share to Twitter
- Share to Instagram

### Watermark (Optional)

Small watermark in corner:

```
verse.so
```

- User can toggle on/off
- Drives traffic back to product when cards are shared

## Implementation Notes

- Share link: need backend to store card data, or encode in URL (size limits)
- Social share: use Web Share API + platform-specific deep links
- Watermark: subtle, non-intrusive placement
- Consider analytics on shared links
