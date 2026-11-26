import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { spawnSync } from 'child_process';

/**
 * Appends a validated problem draft into data/extra-problems.json
 * (does not touch production Supabase — run generate:seed + SQL after review).
 */

const path = process.argv[2];
if (!path) {
  console.error('Usage: npm run ingest:import -- path/to/draft.json');
  process.exit(1);
}

const check = spawnSync('npx', ['tsx', 'scripts/ingest/validate-draft.ts', path], {
  encoding: 'utf8',
  cwd: resolve('.'),
});
if (check.status !== 0) {
  console.error(check.stdout || check.stderr);
  process.exit(check.status ?? 1);
}

const draft = JSON.parse(readFileSync(path, 'utf8')) as { id: string };
const extrasPath = resolve('data/extra-problems.json');
const extras = JSON.parse(readFileSync(extrasPath, 'utf8')) as { id?: string }[];
if (!Array.isArray(extras)) {
  console.error('data/extra-problems.json must be an array');
  process.exit(1);
}

const idx = extras.findIndex((p) => p.id === draft.id);
if (idx >= 0) {
  extras[idx] = draft;
  console.log(`Updated existing extra: ${draft.id}`);
} else {
  extras.push(draft);
  console.log(`Imported: ${draft.id}`);
}

writeFileSync(extrasPath, `${JSON.stringify(extras, null, 2)}\n`);
console.log('Wrote data/extra-problems.json');
console.log('Next: npm run generate:seed  (then apply supabase/seed.sql if using Supabase)');
