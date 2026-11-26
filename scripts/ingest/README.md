# Problem ingestion

Human-reviewed pipeline — never auto-publish unreviewed approaches.

## Flow

1. Paste a statement into an LLM with [`prompt.md`](prompt.md).
2. Save the JSON draft under `scripts/ingest/inbox/<id>.json`.
3. Validate:

```bash
npm run ingest:validate -- scripts/ingest/inbox/my-problem.json
```

4. Import into the local catalog (`data/extra-problems.json`):

```bash
npm run ingest:import -- scripts/ingest/inbox/my-problem.json
```

Or validate an entire array file (e.g. after editing extras in bulk):

```bash
npm run ingest:validate-batch -- data/extra-problems.json
```

5. Regenerate SQL seed and apply in Supabase if needed:

```bash
npm run generate:seed
# then run supabase/seed.sql in the SQL editor
```

The app merges `SEED_PROBLEMS` + `extra-problems.json` offline, and prefers Supabase when the remote catalog is available.

## Coverage goals

Prefer filling thin slices before stacking more CSES greedy:

- Dynamic Programming, String Algorithms, Trees / LCA
- Math / Number Theory, Binary Search on Answer
- AtCoder / USACO / harder CF (≥1800) for band stretch
