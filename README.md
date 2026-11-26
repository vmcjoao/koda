# Koda

Mobile app for studying competitive programming without writing syntax on a phone. Diagnose paradigms, algorithms, data structures, and key twists — then blueprint for later PC implementation.

## Stack

- **Expo** (React Native + Expo Router), dark mode by default
- **Supabase** (Auth + Postgres) with **offline guest mode** using a local catalog

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

## Supabase setup

1. Create a project and enable Email auth.
2. Run [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql).
3. Run [`supabase/migrations/002_grants.sql`](supabase/migrations/002_grants.sql) if needed.
4. Run [`supabase/seed.sql`](supabase/seed.sql) (regenerate with `npm run generate:seed`).

## Features

1. **Encounter → Radar → Hypothesis → Blueprint → Reveal**
2. **Daily Set** — warm-up / target / boss from your rating **band**
3. **Review deck** — spaced repetition for misses
4. **Implement queue** — copy blueprints, open OJ links, mark AC (also works as a **web companion**: `npm run web`)
5. **Analytics** — topic mastery, blind spots, pipeline funnel, mistakes
6. **Band auto-adjust** (+ manual edit in Settings)

## Ingest new problems

See [`scripts/ingest/README.md`](scripts/ingest/README.md): LLM draft → validate → import → regenerate seed.

## Scripts

| Command | Purpose |
|---|---|
| `npm start` | Expo dev server |
| `npm run typecheck` | TypeScript |
| `npm run test:scoring` / `test:habit` | Unit checks |
| `npm run generate:seed` | Rebuild `supabase/seed.sql` |
| `npm run ingest:validate -- <file>` | Validate a problem draft |
| `npm run ingest:import -- <file>` | Merge draft into `data/extra-problems.json` |
