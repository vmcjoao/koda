/**
 * Convert fetched VJudge text statements into catalog extras (stub approaches).
 *
 * Skips problems already in the catalog. PDF-only rows are listed but not imported.
 *
 * Usage: npm run ingest:vjudge-import-statements
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { SEED_PROBLEMS } from '../../data/seed-problems';
import extraJson from '../../data/extra-problems.json';
import { COMPLEXITY_OPTIONS } from '../../constants/tags';

type Section = { title: string | null; format: string | null; content: string };
type StatementProblem = {
  vjudgeKey: string;
  oj: string;
  probNum: string;
  title: string;
  originUrl: string | null;
  kind: string;
  pdfUrl: string | null;
  sections: Section[];
  text: string;
};

type IndexProblem = {
  vjudgeKey: string | null;
  title: string;
  proposedId: string;
  proposedSource: string;
  proposedUrl: string | null;
  catalogId: string | null;
};

type Approach = {
  id: string;
  problem_id: string;
  approach_name: string;
  paradigms: string[];
  algorithms: string[];
  data_structures: string[];
  key_insights: string[];
  editorial_summary_md: string;
};

type ProblemDraft = {
  id: string;
  title: string;
  source: string;
  url: string | null;
  difficulty_rating: number;
  statement_md: string;
  input_format_md: string;
  output_format_md: string;
  constraints_text: string;
  sample_io: { input: string; output: string; explanation?: string }[];
  target_complexity: string;
  approaches: Approach[];
};

function sectionByTitle(sections: Section[], re: RegExp): Section | undefined {
  return sections.find((s) => s.title && re.test(s.title));
}

function plain(content: string, format: string | null): string {
  if (!content) return '';
  if (format === 'MD' || format === 'Markdown') return content.trim();
  return content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractSamples(sections: Section[], text: string): { input: string; output: string }[] {
  const ex = sectionByTitle(sections, /example/i);
  const blob = ex ? plain(ex.content, ex.format) : text;
  const samples: { input: string; output: string }[] = [];

  // CF-style: Input / Output alternating after Examples
  const blocks = blob.split(/\n(?=Input\b)/i);
  for (const block of blocks) {
    const m = block.match(/Input\s*([\s\S]*?)\s*Output\s*([\s\S]*?)(?=\nInput\b|$)/i);
    if (m) {
      const input = m[1].trim();
      const output = m[2].trim().split(/\n\n/)[0].trim();
      if (input || output) samples.push({ input, output });
    }
  }
  if (samples.length) return samples.slice(0, 3);

  const m2 = blob.match(/Sample Input\s*([\s\S]*?)\s*Sample Output\s*([\s\S]*?)(?=\n[A-Z][a-z]|$)/i);
  if (m2) return [{ input: m2[1].trim(), output: m2[2].trim().split(/\n\nNote/i)[0].trim() }];

  return [];
}

function extractConstraints(sections: Section[], text: string): string {
  const c = sectionByTitle(sections, /constraint/i);
  if (c) {
    const t = plain(c.content, c.format);
    if (t) return t.slice(0, 500);
  }
  const m = text.match(/(?:Constraints?|limits?)\s*[:\n]+([\s\S]{0,400})/i);
  if (m) return m[1].trim().split(/\n\n/)[0].trim().slice(0, 500);
  // USACO often inline: (1 <= N <= 2000)
  const ranges = text.match(/\([^)]{0,40}\d[^)]{0,40}\)/g);
  if (ranges && ranges.length) return ranges.slice(0, 6).join(' ');
  return 'See statement.';
}

function difficultyFor(oj: string): number {
  switch (oj) {
    case 'CSES':
      return 1400;
    case 'CodeForces':
    case 'Gym':
      return 1500;
    case 'USACO':
      return 1600;
    case 'UVA':
    case 'SPOJ':
    case 'POJ':
      return 1500;
    case 'AtCoder':
      return 1400;
    default:
      return 1500;
  }
}

function paradigmsFor(title: string, contestHints: string[]): string[] {
  const blob = `${title} ${contestHints.join(' ')}`.toLowerCase();
  const tags: string[] = [];
  if (/fluxo|flow|max.?flow|min.?cut/.test(blob)) tags.push('Graph Algorithms');
  if (/caminho m[ií]nimo|shortest|dijkstra|bellman/.test(blob)) tags.push('Graph Algorithms');
  if (/\bdfs\b|\bbfs\b|graph|grafo|árvore|arvore|tree/.test(blob)) tags.push('Graph Algorithms');
  if (/dp|dynamic|knapsack/.test(blob)) tags.push('Dynamic Programming');
  if (/greedy|guloso/.test(blob)) tags.push('Greedy');
  if (/binary search|busca bin/.test(blob)) tags.push('Binary Search on Answer');
  if (/two.?pointer|sliding|dois ponteiros/.test(blob)) tags.push('Two Pointers');
  if (/string|kmp|hash/.test(blob)) tags.push('String Algorithms');
  if (/math|number|primo|gcd|modular/.test(blob)) tags.push('Math / Number Theory');
  if (/complete search|brute|busca completa/.test(blob)) tags.push('Brute Force');
  if (/set|map|sorting|orden/.test(blob)) tags.push('Ad-Hoc');
  if (!tags.length) tags.push('Ad-Hoc');
  return [...new Set(tags)].slice(0, 3);
}

function loadIndexHints(): Map<string, string[]> {
  const path = resolve('scripts/ingest/vjudge-exports/vjudge-index.json');
  const map = new Map<string, string[]>();
  if (!existsSync(path)) return map;
  const data = JSON.parse(readFileSync(path, 'utf8')) as {
    problems?: Array<{
      vjudgeKey: string | null;
      title: string;
      appearsIn?: Array<{ contestTitle: string }>;
    }>;
    templates?: Array<{
      entries: Array<{ vjudgeKey: string | null; title: string }>;
      name: string;
    }>;
  };
  for (const p of data.problems || []) {
    if (!p.vjudgeKey) continue;
    const hints = [p.title, ...(p.appearsIn || []).map((a) => a.contestTitle)];
    map.set(p.vjudgeKey, hints);
  }
  return map;
}

function loadIndexMeta(): Map<string, IndexProblem> {
  const path = resolve('scripts/ingest/vjudge-exports/vjudge-index.json');
  const map = new Map<string, IndexProblem>();
  if (!existsSync(path)) return map;
  const data = JSON.parse(readFileSync(path, 'utf8')) as { problems?: IndexProblem[] };
  for (const p of data.problems || []) {
    if (p.vjudgeKey) map.set(p.vjudgeKey, p);
  }
  return map;
}

function existingIds(): Set<string> {
  const ids = new Set<string>();
  for (const p of SEED_PROBLEMS) ids.add(p.id);
  for (const p of Array.isArray(extraJson) ? extraJson : []) {
    if (p && typeof p === 'object' && typeof (p as { id?: string }).id === 'string') {
      ids.add((p as { id: string }).id);
    }
  }
  return ids;
}

function toDraft(
  p: StatementProblem,
  meta: IndexProblem | undefined,
  hints: string[],
): ProblemDraft {
  const id = meta?.proposedId || `${p.oj.toLowerCase()}-${p.probNum}`.replace(/[^a-z0-9-]+/g, '-');
  const title = (meta?.title || p.title || id).trim();
  const source = meta?.proposedSource || (p.oj === 'CodeForces' ? 'Codeforces' : p.oj);
  const url = meta?.proposedUrl || p.originUrl;
  const inputSec = sectionByTitle(p.sections, /^input$/i);
  const outputSec = sectionByTitle(p.sections, /^output$/i);
  const statement =
    p.text.trim() ||
    p.sections.map((s) => plain(s.content, s.format)).filter(Boolean).join('\n\n');

  const fromBody = (label: RegExp): string => {
    const m = statement.match(
      new RegExp(
        `(?:^|\\n)${label.source}\\s*\\n([\\s\\S]*?)(?=\\n(?:Input|Output|Sample|Example|Note|Constraints?)\\b|$)`,
        'i',
      ),
    );
    return m?.[1]?.trim().slice(0, 800) || '';
  };

  const input_format_md =
    (inputSec ? plain(inputSec.content, inputSec.format) : '') ||
    fromBody(/Input/) ||
    'See statement.';
  const output_format_md =
    (outputSec ? plain(outputSec.content, outputSec.format) : '') ||
    fromBody(/Output/) ||
    'See statement.';

  const paradigms = paradigmsFor(title, hints);
  const fromPdf = /PDF text extraction/i.test(statement);
  const approach: Approach = {
    id: `${id}-a1`,
    problem_id: id,
    approach_name: 'Pending editorial review',
    paradigms,
    algorithms: [],
    data_structures: [],
    key_insights: [
      'Auto-imported from VJudge — replace this approach after you solve / read an editorial',
      `Origin: ${p.vjudgeKey}`,
      ...(fromPdf ? ['Statement text extracted from PDF — check figures against the original'] : []),
    ],
    editorial_summary_md:
      'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.',
  };

  return {
    id,
    title,
    source,
    url,
    difficulty_rating: difficultyFor(p.oj),
    statement_md: statement,
    input_format_md,
    output_format_md,
    constraints_text: extractConstraints(p.sections, statement),
    sample_io: extractSamples(p.sections, statement),
    target_complexity: COMPLEXITY_OPTIONS.includes('O(N log N)' as (typeof COMPLEXITY_OPTIONS)[number])
      ? 'O(N log N)'
      : 'O(N)',
    approaches: [approach],
  };
}

function main() {
  const statementsPath = resolve('scripts/ingest/vjudge-exports/vjudge-statements.json');
  if (!existsSync(statementsPath)) {
    console.error('Missing vjudge-statements.json — run npm run ingest:vjudge-statements first');
    process.exit(1);
  }
  const payload = JSON.parse(readFileSync(statementsPath, 'utf8')) as {
    problems: StatementProblem[];
  };
  const indexMeta = loadIndexMeta();
  const hints = loadIndexHints();
  const have = existingIds();

  const extrasPath = resolve('data/extra-problems.json');
  const extras = (
    Array.isArray(extraJson) ? JSON.parse(JSON.stringify(extraJson)) : []
  ) as ProblemDraft[];

  let added = 0;
  let skippedExisting = 0;
  let skippedPdf = 0;
  const pdfKeys: string[] = [];

  for (const p of payload.problems) {
    if (p.kind === 'pdf') {
      skippedPdf += 1;
      pdfKeys.push(p.vjudgeKey);
      continue;
    }
    if (p.kind !== 'text' || !p.text?.trim()) continue;
    const meta = indexMeta.get(p.vjudgeKey);
    if (meta?.catalogId && have.has(meta.catalogId)) {
      skippedExisting += 1;
      continue;
    }
    const draft = toDraft(p, meta, hints.get(p.vjudgeKey) || []);
    if (have.has(draft.id)) {
      skippedExisting += 1;
      continue;
    }
    extras.push(draft);
    have.add(draft.id);
    added += 1;
  }

  writeFileSync(extrasPath, `${JSON.stringify(extras, null, 2)}\n`);

  const pdfListPath = resolve('scripts/ingest/vjudge-exports/vjudge-pdf-pending.json');
  writeFileSync(
    pdfListPath,
    `${JSON.stringify({ count: pdfKeys.length, problems: pdfKeys }, null, 2)}\n`,
  );

  console.log(`Imported ${added} VJudge text problems into data/extra-problems.json`);
  console.log(`  skipped already in catalog: ${skippedExisting}`);
  console.log(`  pdf-only (not imported):    ${skippedPdf} (see vjudge-pdf-pending.json)`);
  console.log('Next: npm run ingest:vjudge-index && npm run generate:seed');
  console.log('Then in the app: Playlists → Import UFV VJudge…');
}

main();
