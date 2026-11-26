# Problem ingestion

Human-reviewed pipeline — never auto-publish unreviewed approaches.

## VJudge (UFV groups)

1. On a group page, run [`vjudge-export-group.js`](vjudge-export-group.js) (copy from the file, not chat).
2. Save the download under `scripts/ingest/vjudge-exports/`.
3. Index against the catalog + emit playlist templates:

```bash
npm run ingest:vjudge-index
```

4. Enrich keys (browser): [`vjudge-enrich-problems.js`](vjudge-enrich-problems.js) with `window.__VJ_EXPORT__ = …`.
5. Pull statement text + import stubs:

```bash
npm run ingest:vjudge-statements
npm run ingest:vjudge-pdf-extract   # UVA PDF → text via onlinejudge.org + pdftotext
npm run ingest:vjudge-import-statements
npm run ingest:vjudge-index
npm run generate:seed
```

6. In the app: **Playlists → Import UFV VJudge…**

Stub approaches are marked “Pending editorial review” — replace them as you solve. Any PDFs that still fail extraction stay in `vjudge-exports/vjudge-pdf-pending.json` (requires `pdftotext` / poppler).

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

Fetch a curated gap-fill batch (CSES / AtCoder DP / classic CF):

```bash
npm run ingest:curated-expansion
npm run ingest:curated-batch2
npm run ingest:curated-batch3   # fill missing/thin algorithm tags
npm run ingest:curated-batch4
npm run ingest:curated-batch5
npm run ingest:curated-batch6   # grow catalog to ≥550
npm run ingest:curated-batch7   # fill thin TAG_CATALOG slices
npm run ingest:mineira          # Maratona Mineira (+ Minas de Minas) archives
npm run generate:seed
```

## Figures

Statements may include:

| Syntax | Use |
|---|---|
| `` ```grid `` / `` ```text `` | ASCII matrices, tables, layouts |
| `[[figure:id]]` or `![…](asset:id)` | Bundled SVG (`data/figures` + `lib/figures.ts`) |
| `` ```svg `` | Inline SVG diagram |
| `![…](https://…)` | Remote image (online only) |

Never discard PDF figures during ingest — redraw or grid-encode them.
