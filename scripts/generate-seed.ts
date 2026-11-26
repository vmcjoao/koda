import { readFileSync, writeFileSync } from 'fs';
import { SEED_PROBLEMS } from '../data/seed-problems';
import { TAG_CATALOG } from '../constants/tags';
import type { ProblemWithApproaches } from '../types/database';

function esc(s: string) {
  return s.replace(/'/g, "''");
}

function arr(a: string[]) {
  if (!a.length) return "ARRAY[]::text[]";
  return `ARRAY[${a.map((x) => `'${esc(x)}'`).join(',')}]::text[]`;
}

const extras = JSON.parse(readFileSync('data/extra-problems.json', 'utf8')) as ProblemWithApproaches[];
const byId = new Map<string, ProblemWithApproaches>();
for (const p of SEED_PROBLEMS) byId.set(p.id, p);
for (const p of extras) {
  if (p?.id && Array.isArray(p.approaches)) byId.set(p.id, p);
}
const problems = [...byId.values()];

let sql = '-- Auto-generated from data/seed-problems.ts + data/extra-problems.json\n';
sql += 'truncate public.solution_approaches, public.problems, public.tag_catalog cascade;\n\n';

for (const t of TAG_CATALOG) {
  sql += `insert into public.tag_catalog (id, kind, label, aliases) values ('${esc(t.id)}', '${esc(t.kind)}', '${esc(t.label)}', ${arr(t.aliases)});\n`;
}
sql += '\n';

for (const p of problems) {
  sql += `insert into public.problems (id, title, source, url, difficulty_rating, statement_md, constraints_text, sample_io, target_complexity) values ('${esc(p.id)}', '${esc(p.title)}', '${esc(p.source)}', ${p.url ? `'${esc(p.url)}'` : 'null'}, ${p.difficulty_rating}, '${esc(p.statement_md)}', '${esc(p.constraints_text)}', '${esc(JSON.stringify(p.sample_io))}'::jsonb, '${esc(p.target_complexity)}');\n`;
  for (const a of p.approaches) {
    sql += `insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('${esc(a.id)}', '${esc(a.problem_id)}', '${esc(a.approach_name)}', ${arr(a.paradigms)}, ${arr(a.algorithms)}, ${arr(a.data_structures)}, ${arr(a.key_insights)}, '${esc(a.editorial_summary_md)}');\n`;
  }
}

writeFileSync('supabase/seed.sql', sql);
console.log(`Wrote supabase/seed.sql (${problems.length} problems)`);
