# Koda

Mobile app for studying competitive programming without writing syntax on a phone. Diagnose paradigms, algorithms, data structures, and key twists — then blueprint for later PC implementation.

## Stack

- **Expo** (React Native + Expo Router), dark mode by default
- **Supabase** (Auth + Postgres) with **offline guest mode** using a local 20-problem seed

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
3. Run [`supabase/seed.sql`](supabase/seed.sql) (regenerate anytime with `npm run generate:seed`).

## Core loop

1. **Encounter** — statement, constraints, samples + insight timer  
2. **Constraint Radar** — guess target complexity (bonus XP)  
3. **Hypothesis** — paradigm / algorithm / DS / twist chips  
4. **Blueprint** — optional pseudocode scratchpad  
5. **Reveal** — score vs editorial approaches → Implement Queue / review  

Tabs: **Home**, **Implement** (coding backlog), **Analytics** (topic bars + mistake breakdown + pipeline).

## Scripts

| Command | Purpose |
|---|---|
| `npm start` | Expo dev server |
| `npm run typecheck` | TypeScript |
| `npm run test:scoring` | Scoring unit checks |
| `npm run generate:seed` | Rebuild `supabase/seed.sql` from `data/seed-problems.ts` |
