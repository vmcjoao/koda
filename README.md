# Koda

Mobile app for studying competitive programming without writing syntax on a phone. Diagnose paradigms, algorithms, data structures, and key twists — then blueprint for later PC implementation.

## Stack

- **Expo** (React Native + Expo Router), dark mode by default
- **Supabase** (Auth + Postgres) with **offline guest mode** using a local catalog (~60 curated problems + SQLite/remote cache)

## Quick start

```bash
npm install
npx expo start
```

Guest mode works with no backend. To enable sync:

```bash
cp .env.example .env
# fill EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
```

Native builds (when you leave Expo Go):

```bash
npx eas-cli@latest build --profile preview
```

See [`eas.json`](eas.json). Bundle IDs: `app.koda.mobile`.

## Supabase setup

1. Create a project and enable Email auth.
2. Run migrations in order: `001_initial.sql`, `002_grants.sql`, `003_favorites.sql`.
3. Run [`supabase/seed.sql`](supabase/seed.sql) (regenerate with `npm run generate:seed`).

## Features

1. **Encounter → Radar → Hypothesis → Blueprint → Reveal** (statements support KaTeX, monospace grids, SVG/images)
2. **Daily Set** — warm-up / target / boss from your rating **band**
3. **Review deck** — spaced repetition for misses
4. **Implement queue** — copy blueprints, open OJ links, mark AC (`npm run web` as PC companion)
5. **Analytics** — topic mastery, 12-week activity heatmap, blind spots, pipeline funnel, mistakes
6. **Band auto-adjust** (+ manual edit in Settings)
7. **Daily reminder** — pick hour in Settings; tap notification opens Home
8. **Backup** — export / import local training JSON
9. **Offline catalog** — SQLite on device (AsyncStorage fallback on web); migrates legacy cache
10. **Guest → cloud sync** — sign-in uploads attempts, review state, favorites, and XP
11. **History filters** — strong/weak, status, radar bonus

## Ingest new problems

See [`scripts/ingest/README.md`](scripts/ingest/README.md): LLM draft → validate → import → regenerate seed.

## Scripts

| Command | Purpose |
|---|---|
| `npm start` | Expo dev server |
| `npm run typecheck` | TypeScript |
| `npm test` | Scoring + habit + local-data checks |
| `npm run generate:seed` | Rebuild `supabase/seed.sql` |
| `npm run ingest:validate -- <file>` | Validate a problem draft |
| `npm run ingest:import -- <file>` | Merge draft into `data/extra-problems.json` |
