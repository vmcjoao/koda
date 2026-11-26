import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { spawnSync } from 'child_process';
import { resolve } from 'path';

/**
 * Validate every problem in a JSON array file (e.g. data/extra-problems.json).
 * Usage: npm run ingest:validate-batch -- data/extra-problems.json
 */

const path = process.argv[2];
if (!path) {
  console.error('Usage: npm run ingest:validate-batch -- path/to/problems.json');
  process.exit(1);
}

const raw = JSON.parse(readFileSync(path, 'utf8')) as unknown;
if (!Array.isArray(raw)) {
  console.error('Expected a JSON array of problem drafts');
  process.exit(1);
}

const tmpDir = resolve('scripts/ingest/inbox');
let failed = 0;

for (const draft of raw) {
  const id = (draft as { id?: string }).id ?? 'unknown';
  const file = resolve(tmpDir, `_batch-${id}.json`);
  writeFileSync(file, `${JSON.stringify(draft, null, 2)}\n`);
  const check = spawnSync('npx', ['tsx', 'scripts/ingest/validate-draft.ts', file], {
    encoding: 'utf8',
    cwd: resolve('.'),
  });
  if (check.status !== 0) {
    failed += 1;
    console.error(check.stdout || check.stderr || `Failed: ${id}`);
  } else {
    process.stdout.write(check.stdout);
  }
  try {
    unlinkSync(file);
  } catch {
    /* ignore */
  }
}

if (failed) {
  console.error(`\n${failed}/${raw.length} draft(s) failed`);
  process.exit(1);
}
console.log(`\nAll ${raw.length} drafts OK`);
