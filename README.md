# Movie Explorer

A single-page movie search app built with Next.js 16, TypeScript, and Tailwind CSS. Search for movies via the TMDB API, view details, and maintain a personal favorites list with ratings and notes — all stored in your browser.

## Features

- **Search** movies by title (press Enter to search)
- **Movie detail** panel — release date, runtime, TMDB rating, overview
- **Favorites list** — add/remove movies, set a personal rating (0–5), add a note
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

Create a `.env.local` file in the `movie-explorer/` directory:

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

## Known limitations

- **No pagination** — search results are capped at TMDB's default page size (20)
- **No live search** — results only update when you press Enter
- **localStorage only** — favorites are per-device/browser and not synced across devices. (assumed single device)
- **Images use plain `<img>`** — not optimized via `next/image` (would require configuring `images.remotePatterns` in `next.config.ts`)
- **Single favorites list** — no multi-user or auth support
