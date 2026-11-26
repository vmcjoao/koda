import { readFileSync } from 'fs';
import { COMPLEXITY_OPTIONS } from '../../constants/tags';

type Draft = {
  id: string;
  title: string;
  source: string;
  url: string | null;
  difficulty_rating: number;
  statement_md: string;
  constraints_text: string;
  sample_io: { input: string; output: string }[];
  target_complexity: string;
  approaches: {
    id: string;
    problem_id: string;
    approach_name: string;
    paradigms: string[];
    algorithms: string[];
    data_structures: string[];
    key_insights: string[];
    editorial_summary_md: string;
  }[];
};

function fail(msg: string): never {
  console.error(`Invalid draft: ${msg}`);
  process.exit(1);
}

const path = process.argv[2];
if (!path) {
  console.error('Usage: npm run ingest:validate -- path/to/draft.json');
  process.exit(1);
}

const raw = JSON.parse(readFileSync(path, 'utf8')) as Draft;
if (!raw.id?.trim()) fail('missing id');
if (!raw.title?.trim()) fail('missing title');
if (!raw.statement_md?.trim()) fail('missing statement_md');
if (!raw.constraints_text?.trim()) fail('missing constraints_text');
if (!Number.isFinite(raw.difficulty_rating)) fail('difficulty_rating must be a number');
if (!Array.isArray(raw.sample_io)) fail('sample_io must be an array');
if (!Array.isArray(raw.approaches) || raw.approaches.length < 1) fail('need ≥1 approach');

const complexities = new Set<string>(COMPLEXITY_OPTIONS);
if (!complexities.has(raw.target_complexity)) {
  console.warn(`Warning: target_complexity "${raw.target_complexity}" not in COMPLEXITY_OPTIONS`);
}

for (const a of raw.approaches) {
  if (!a.id || !a.approach_name) fail('approach missing id/name');
  if (a.problem_id !== raw.id) fail(`approach ${a.id} problem_id mismatch`);
  if (!a.paradigms?.length) fail(`approach ${a.id} needs paradigms`);
  if (!a.key_insights?.length) fail(`approach ${a.id} needs key_insights`);
  if (!a.editorial_summary_md?.trim()) fail(`approach ${a.id} needs editorial_summary_md`);
}

console.log(`OK: ${raw.id} — ${raw.title} (${raw.approaches.length} approach(es))`);
