# Plan 06: Product Platform

**Goal:** Evolve from tool to product with persistence and discovery.

## Features

### Library

Save cards:

- **My cards** – user's generated cards
- Persist across sessions
- Requires auth or local storage

### Collections

Organize cards into collections:

- "Drake quotes"
- "Sad songs"
- "Rap verses"

- User-created collections
- Curate and share collections

### Trending Lyrics

Home page section:

- **Most generated lyrics today**
- Social proof
- Discovery of popular verses
- Drives engagement

## Implementation Notes

- Library: need backend + auth, or start with localStorage
- Collections: CRUD for collections, many-to-many with cards
- Trending: aggregate generation events, cache daily/weekly
- Consider: public vs private cards, collection sharing
