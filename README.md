# Movie Explorer

A single-page movie search app built with Next.js 16, TypeScript, and Tailwind CSS. Search for movies via the TMDB API, view details, and maintain a personal favorites list with ratings and notes — all stored in your browser.

**Live app:** https://movie-explorer-cyan-five.vercel.app

## Features

- **Search** movies by title (press Enter to search)
- **Movie detail** panel — release date, runtime, TMDB rating, overview
- **Favorites list** — add/remove movies, set a personal rating (1–5), add a note
- Favorites persist in `localStorage` (no account needed)
- TMDB API key stays server-side via Next.js API routes

## Tech stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- [tmdb-ts](https://github.com/blakejoy/tmdb-ts) for TMDB API calls
- `localStorage` for favorites persistence

## Getting started

### 1. Get a TMDB API key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org)
2. Go to **Settings → API**
3. Copy the **API Read Access Token** (the long JWT starting with `eyJ...`)

### 2. Set up environment variables

Create a `.env.local` file inside the `movie-explorer/movie-explorer/` directory (next to `package.json`):

```
TMDB_KEY=your_jwt_token_here
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

```bash
npm i -g vercel
vercel
```

Then add `TMDB_KEY` in the Vercel dashboard under **Settings → Environment Variables** and redeploy:

```bash
vercel --prod
```

## Project structure

```
app/
  page.tsx                  # main page — search, layout, state
  api/
    movie/route.ts          # GET /api/movie?query= (search)
    movie/[id]/route.ts     # GET /api/movie/[id]  (detail)
components/
  MovieList.tsx             # search results with clickable cards
  MovieDetail.tsx           # detail panel + add/remove favorite
  FavoriteList.tsx          # favorites sidebar with remove button
lib/
  tmdb.ts                   # TMDB client singleton
  favorites.ts              # localStorage helpers
```

## Technical decisions & tradeoffs

**Single-page layout instead of separate routes**
All views (search, detail, favorites) live on one page with local state controlling which panel is shown. Kept routing simple within the 3-hour scope. Tradeoff: detail views aren't bookmarkable by URL.

**API proxy via Next.js route handlers**
`/api/movie` and `/api/movie/[id]` proxy all TMDB calls server-side using `tmdb-ts`. The API key never reaches the browser. No extra auth layer needed since the routes are read-only and TMDB handles rate limiting.

**localStorage for persistence**
Zero infrastructure — favorites are stored as a JSON array in the browser. Simple to implement and works offline. Tradeoff: per-device only, no cross-device sync.

**`favKey` counter for cross-component sync**
`MovieDetail` and `FavoriteList` both read localStorage independently. A shared counter in the parent increments on every change so both components re-sync without needing a global store.

## Known limitations

- **No pagination** — search results are capped at TMDB's default page size (20)
- **No live search** — results only update when you press Enter
- **localStorage only** — favorites are per-device/browser and not synced across devices. (assumed single device)
- **Images use plain `<img>`** — not optimized via `next/image` (would require configuring `images.remotePatterns` in `next.config.ts`)
- **Single favorites list** — no multi-user or auth support

## What I'd Add With More Time

- **Server-side persistence** — replace `localStorage` with a proper backend. First step: Redis (schema-free, fast, easy to spin up locally with Docker) so favorites sync across devices. With more time, move to PostgreSQL for full relational structure and complete data ownership — also dockerized for local dev parity. Keep `localStorage` as an optimistic cache on top for a snappy UI.
  ```bash
  # Redis
  docker run -d -p 6379:6379 redis:alpine
  # PostgreSQL
  docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=secret postgres:16-alpine
  ```
- **Conflict resolution** — add an `updatedAt` timestamp to each favorite record. On sync, the most recent write wins to handle concurrent edits across devices.
- **Split panels into separate routes** — `/movie/[id]` as its own page so detail views are bookmarkable and shareable; style each view more independently.
- **Pagination** — on both search results and the favorites list.
- **Multi-user support** — add auth (e.g. NextAuth) and a `userId` foreign key on favorites. Once multiple users exist, extend to support comments and replies on favorites. Use a write queue (e.g. BullMQ backed by Redis) and read caching to handle the increased load.



