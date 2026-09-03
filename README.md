# Mosy Math Adventure

A colorful, game-first math learning arcade for kids. Ten playable worlds (Rounding, Shapes, Measurement, Area & Perimeter, Multiplication, Times Tables, Factors & Multiples, Computation, and Order of Operations), each with Easy / Normal / Hard levels, XP progression, a coin shop, and a teacher admin panel.

> **Repo name:** `rush-royal` · **Game brand:** Mosy Math Adventure
> **Live:** https://mosymath.github.io/rush-royal/

## Features

- **10 playable worlds** with hundreds of teacher-aligned questions (4-answer multiple choice).
- **Player profiles** — nickname, 20+ avatars, XP levels 1–10, saved on the device and synced to a local database.
- **Coin shop** — earn coins from correct-answer streaks, then buy avatars, effects, and themes.
- **Admin panel** — password-protected, open/close any unit (OPEN / LOCKED / HIDDEN).
- **Teacher roster** — class summary, filters, saved views, CSV export.
- **Zero-config backend** — an embedded SQLite database, no server setup needed.

## Tech stack

- React 19 + TypeScript + Vite
- Babylon.js (3D), Framer Motion, Radix UI, Tailwind CSS
- tRPC + Express + Drizzle ORM + SQLite (better-sqlite3)

## Running locally

Requirements: [Node.js 22+](https://nodejs.org) and [pnpm](https://pnpm.io).

```bash
pnpm install       # first time only
pnpm dev           # start the dev server (http://localhost:3000)
```

Or just double-click **`start.bat`** on Windows.

Production:

```bash
pnpm build
pnpm start
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server with hot reload |
| `pnpm build` | Build the client + server into `dist/` |
| `pnpm build:web` | Build only the web client (used for GitHub Pages) |
| `pnpm start` | Run the production build |
| `pnpm check` | Type-check the project |
| `pnpm test` | Run the test suite |

## Admin

Open the shield icon in the main menu and enter the admin password (default `mosy-admin`, override with the `ADMIN_PASSWORD` environment variable).

## Project structure

```
client/     React game (components, game logic, styles)
server/     tRPC API + Express server
shared/     Shared types and the shop catalog
drizzle/    SQLite schema and migrations
```

## License

MIT
