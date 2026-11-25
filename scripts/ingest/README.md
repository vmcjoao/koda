# Problem ingestion (Phase 3)

Pipeline sketch for later:

1. Feed a problem URL or raw statement into an LLM prompt that emits `Problem` + `Solution_Approaches` JSON matching `types/database.ts`.
2. Human-review the tags and editorial summary.
3. Append to `data/seed-problems.ts` and run `npm run generate:seed`.
4. Apply `supabase/seed.sql` (or upsert rows) in your Supabase project.

Do not auto-publish unreviewed approaches into production.
