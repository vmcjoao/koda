/**
 * Ingest Maratona Mineira (and Minas de Minas) problems from public archives.
 *
 * Sources (as far back as publicly available statements):
 *  - 2019, 2022, 2023: GitHub problem packs (statement.tex)
 *  - 2022, 2025, 2026: official caderno PDFs
 *  - 2025 Minas de Minas (maratona + meia): official cadernos
 *
 * Older editions (2012–2018, 2020–2021, 2024) only have scoreboards online —
 * no public cadernos found at ingest time.
 *
 * Usage: npm run ingest:mineira
 */

import { execFileSync, execSync } from 'child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'fs';
import { join, resolve } from 'path';
import { SEED_PROBLEMS } from '../../data/seed-problems';
import extraJson from '../../data/extra-problems.json';
import { COMPLEXITY_OPTIONS } from '../../constants/tags';

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

type Draft = {
  id: string;
  title: string;
  source: string;
  url: string | null;
  difficulty_rating: number;
  statement_md: string;
  input_format_md: string;
  output_format_md: string;
  constraints_text: string;
  sample_io: { input: string; output: string }[];
  target_complexity: string;
  approaches: Approach[];
};

const ROOT = resolve('.');
const CACHE = resolve('scripts/ingest/mineira-cache');
const PDF_DIR = join(CACHE, 'pdfs');
const REPO_DIR = join(CACHE, 'repos');

const PDF_SOURCES: {
  year: number;
  edition: string;
  source: string;
  url: string;
  file: string;
  idPrefix: string;
}[] = [
  {
    year: 2022,
    edition: 'IX Maratona Mineira',
    source: 'Maratona Mineira',
    url: 'https://mineira.sbc.org.br/wp-content/uploads/2022/05/IX_Maratona_Mineira_Caderno_de_Problemas.pdf',
    file: 'IX_Maratona_Mineira_Caderno_de_Problemas.pdf',
    idPrefix: 'mineira-2022',
  },
  {
    year: 2025,
    edition: 'XII Maratona Mineira',
    source: 'Maratona Mineira',
    url: 'https://mineira.sbc.org.br/wp-content/uploads/2025/06/contest.rbx_.pdf',
    file: 'contest.rbx_.pdf',
    idPrefix: 'mineira-2025',
  },
  {
    year: 2026,
    edition: 'XIII Maratona Mineira',
    source: 'Maratona Mineira',
    url: 'https://mineira.sbc.org.br/wp-content/uploads/2026/06/MMP2026-Prova.pdf',
    file: 'MMP2026-Prova.pdf',
    idPrefix: 'mineira-2026',
  },
  {
    year: 2025,
    edition: '1ª Maratona Minas de Minas',
    source: 'Minas de Minas',
    url: 'https://mineira.sbc.org.br/wp-content/uploads/2026/11/m3-2025-caderno-maratona.pdf',
    file: 'm3-2025-caderno-maratona.pdf',
    idPrefix: 'minas-2025',
  },
  {
    year: 2025,
    edition: '1ª Meia Maratona Minas de Minas',
    source: 'Minas de Minas',
    url: 'https://mineira.sbc.org.br/wp-content/uploads/2026/11/m3-2025-caderno-meia-maratona.pdf',
    file: 'm3-2025-caderno-meia-maratona.pdf',
    idPrefix: 'minas-meia-2025',
  },
];

const GITHUB_YEARS: {
  year: number;
  edition: string;
  repo: string;
  preferOverPdf?: boolean;
}[] = [
  {
    year: 2019,
    edition: 'VIII Maratona Mineira',
    repo: 'https://github.com/gcmgomes/mineira2019.git',
    preferOverPdf: true,
  },
  {
    year: 2022,
    edition: 'IX Maratona Mineira',
    repo: 'https://github.com/gcmgomes/mineira2022.git',
    preferOverPdf: true,
  },
  {
    year: 2023,
    edition: 'X Maratona Mineira',
    repo: 'https://github.com/gcmgomes/mineira2023.git',
    preferOverPdf: true,
  },
];

function slug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
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

function letterDifficulty(letter: string): number {
  const i = letter.toUpperCase().charCodeAt(0) - 65; // A=0
  return Math.min(2400, 1000 + i * 100);
}

function latexToMd(tex: string): string {
  let s = tex;
  // drop figures / includes
  s = s.replace(/\\begin\{figure\}[\s\S]*?\\end\{figure\}/gi, '');
  s = s.replace(/\\includegraphics(\[[^\]]*\])?\{[^}]*\}/g, '');
  s = s.replace(/\\exemplo\b/g, '');
  s = s.replace(/\\CWD\b/g, '');
  // sections
  s = s.replace(/\\section\*\{([^}]*)\}/g, '\n\n### $1\n\n');
  s = s.replace(/\\subsection\*\{([^}]*)\}/g, '\n\n#### $1\n\n');
  // itemize
  s = s.replace(/\\begin\{itemize\}/g, '\n');
  s = s.replace(/\\end\{itemize\}/g, '\n');
  s = s.replace(/\\item\s*/g, '\n- ');
  // math
  s = s.replace(/\\\[([\s\S]*?)\\\]/g, (_m, inner) => `$$${inner.trim()}$$`);
  s = s.replace(/\\\(([\s\S]*?)\\\)/g, (_m, inner) => `$${inner.trim()}$`);
  s = s.replace(/\$\$([\s\S]*?)\$\$/g, (_m, inner) => `$$${inner.trim()}$$`);
  // common macros
  s = s.replace(/\\(textbf|textit|emph|texttt|mathrm|mathbf)\{([^}]*)\}/g, '$2');
  s = s.replace(/\\(leq|le)\b/g, '≤');
  s = s.replace(/\\(geq|ge)\b/g, '≥');
  s = s.replace(/\\times\b/g, '×');
  s = s.replace(/\\cdot\b/g, '·');
  s = s.replace(/\\ldots\b/g, '…');
  s = s.replace(/\\dots\b/g, '…');
  s = s.replace(/\\to\b/g, '→');
  s = s.replace(/\\rightarrow\b/g, '→');
  s = s.replace(/\\leftarrow\b/g, '←');
  s = s.replace(/\\infty\b/g, '∞');
  s = s.replace(/\\sum\b/g, '∑');
  s = s.replace(/\\prod\b/g, '∏');
  s = s.replace(/\\sqrt\{([^}]*)\}/g, '√($1)');
  s = s.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)');
  s = s.replace(/\\left\(/g, '(').replace(/\\right\)/g, ')');
  s = s.replace(/\\left\[/g, '[').replace(/\\right\]/g, ']');
  s = s.replace(/\\left\|/g, '|').replace(/\\right\|/g, '|');
  s = s.replace(/\\_/g, '_');
  s = s.replace(/\\%/g, '%');
  s = s.replace(/\\#/g, '#');
  s = s.replace(/\\&/g, '&');
  s = s.replace(/~/g, ' ');
  s = s.replace(/\\,/g, ' ');
  s = s.replace(/\\;/g, ' ');
  s = s.replace(/\\!/g, '');
  s = s.replace(/\\\\/g, '\n');
  // leftover commands with one arg
  s = s.replace(/\\[a-zA-Z]+\{([^}]*)\}/g, '$1');
  s = s.replace(/\\[a-zA-Z]+\*?/g, '');
  s = s.replace(/[{}]/g, '');
  s = s.replace(/\n{3,}/g, '\n\n').trim();
  return s;
}

function sectionFromMd(body: string, label: RegExp): string {
  const m = body.match(
    new RegExp(
      `(?:^|\\n)#{0,4}\\s*${label.source}\\s*\\n([\\s\\S]*?)(?=\\n#{0,4}\\s*(?:Entrada|Saída|Saida|Restrições|Restricoes|Exemplos?|Sample|Input|Output|Constraints?)\\b|$)`,
      'i',
    ),
  );
  return m?.[1]?.trim().slice(0, 1500) || '';
}

function extractConstraints(body: string): string {
  const c = sectionFromMd(body, /Restriç(?:ões|oes)|Constraints?/);
  if (c) return c.slice(0, 600);
  const ranges = body.match(/[0-9]+ *≤ *[^.\n]{0,40}/g);
  if (ranges?.length) return ranges.slice(0, 10).join('; ');
  return 'See statement.';
}

function tagsFor(text: string): {
  paradigms: string[];
  algorithms: string[];
  data_structures: string[];
  complexity: string;
} {
  const t = text.toLowerCase();
  const paradigms: string[] = [];
  const algorithms: string[] = [];
  const data_structures: string[] = [];
  let complexity = 'O(N log N)';

  if (/interativ/.test(t)) paradigms.push('Interactive');
  if (/graf|árov|arvore|árvore|tree|aresta|vértice|vertice|caminho|estrada|cidade/.test(t)) {
    paradigms.push('Graph Algorithms');
    if (/menor caminho|shortest|dijkstra/.test(t)) {
      algorithms.push('Dijkstra');
      data_structures.push('Priority Queue');
    }
    if (/bfs|largura/.test(t)) algorithms.push('BFS');
    if (/dfs|profundidade|ponte|bridge/.test(t)) algorithms.push('DFS');
    if (/mst|ágvore geradora|arvore geradora/.test(t)) algorithms.push('MST', 'DSU');
    if (/fluxo|matching|emparelh/.test(t)) paradigms.push('Flows / Matching');
  }
  if (/dp|programação dinâmica|programacao dinamica|mochila|knapsack|subsequ|substring|edit/.test(t)) {
    paradigms.push('Dynamic Programming');
  }
  if (/string|palavra|texto|cifra|criptograf|palíndrom|palindrom|prefixo|sufixo/.test(t)) {
    paradigms.push('String Algorithms');
    if (/hash|rolling/.test(t)) algorithms.push('String Hashing');
    if (/kmp|borda|border|z-alg/.test(t)) algorithms.push('KMP');
  }
  if (/geometr|convex|polig|ângulo|angulo|círculo|circulo|reta|segmento/.test(t)) {
    paradigms.push('Geometry');
  }
  if (/prim|módulo|modulo|combinat|fatorial|mdc|mmc|gcd|primo|divisor|matem/.test(t)) {
    paradigms.push('Math / Number Theory');
    if (/crivo|sieve|primo/.test(t)) algorithms.push('Sieve');
  }
  if (/guloso|greedy|ordenar|ordenação|ordenacao/.test(t)) {
    paradigms.push('Greedy');
    algorithms.push('Sorting');
  }
  if (/busca bin|binary search|ternár|ternar/.test(t)) {
    paradigms.push('Binary Search on Answer');
    algorithms.push('Binary Search');
  }
  if (/dois ponteiro|two pointer|janela|sliding/.test(t)) paradigms.push('Two Pointers');
  if (/bitmask|bit DP|máscara|mascara de bits/.test(t)) paradigms.push('Bitmask / Bit DP');
  if (/segment tree|segtree|fenwick|bit\b|sparse/.test(t)) {
    algorithms.push('Segment Tree');
    data_structures.push('Fenwick Tree');
  }
  if (/pilha|stack|monotôn|monoton/.test(t)) data_structures.push('Monotonic Stack', 'Stack');
  if (/fila|queue|deque/.test(t)) data_structures.push('Queue', 'Deque');
  if (/conjunto|set\b|multiset/.test(t)) data_structures.push('Ordered Set');
  if (/mapa|hash|dicionário|dicionario/.test(t)) data_structures.push('Hash Map');
  if (/brute|força bruta|forca bruta|enumer/.test(t)) paradigms.push('Brute Force');
  if (!paradigms.length) paradigms.push('Ad-Hoc');

  if (/o\(n\b/i.test(t)) complexity = 'O(N)';
  if (/o\(n log/i.test(t)) complexity = 'O(N log N)';
  if (/o\(n\^2|o\(n²/i.test(t)) complexity = 'O(N²)';

  return {
    paradigms: [...new Set(paradigms)],
    algorithms: [...new Set(algorithms)],
    data_structures: [...new Set(data_structures)],
    complexity: (COMPLEXITY_OPTIONS as readonly string[]).includes(complexity)
      ? complexity
      : 'O(N log N)',
  };
}

function makeDraft(opts: {
  id: string;
  title: string;
  source: string;
  url: string | null;
  letter: string;
  year: number;
  edition: string;
  statement_md: string;
}): Draft {
  const body = opts.statement_md;
  const tags = tagsFor(`${opts.title}\n${body}`);
  return {
    id: opts.id,
    title: opts.title,
    source: opts.source,
    url: opts.url,
    difficulty_rating: letterDifficulty(opts.letter),
    statement_md: body,
    input_format_md: sectionFromMd(body, /Entrada|Input/) || 'See statement.',
    output_format_md: sectionFromMd(body, /Saída|Saida|Output/) || 'See statement.',
    constraints_text: extractConstraints(body),
    sample_io: [],
    target_complexity: tags.complexity,
    approaches: [
      {
        id: `${opts.id}-a1`,
        problem_id: opts.id,
        approach_name: `${opts.edition} — standard`,
        paradigms: tags.paradigms,
        algorithms: tags.algorithms,
        data_structures: tags.data_structures,
        key_insights: [
          `${opts.edition} (${opts.year}), problem ${opts.letter}. Auto-tagged from statement; refine after solving.`,
        ],
        editorial_summary_md: `From ${opts.edition}. Review tags and write a proper editorial after solving.`,
      },
    ],
  };
}

function ensureDir(p: string) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

async function download(url: string, dest: string): Promise<void> {
  if (existsSync(dest) && readFileSync(dest).length > 1000) return;
  ensureDir(PDF_DIR);
  console.log(`  downloading ${url}`);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; koda-ingest/1.0)' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
}

function pdfToText(pdfPath: string): string {
  return execFileSync('pdftotext', ['-layout', '-enc', 'UTF-8', pdfPath, '-'], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  })
    .replace(/\f/g, '\n')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function splitPdfProblems(text: string): { letter: string; title: string; body: string }[] {
  const re = /Problema\s+([A-Z])\.\s*([^\n]+)/g;
  const matches: { letter: string; title: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    matches.push({ letter: m[1]!, title: m[2]!.trim(), index: m.index });
  }
  const out: { letter: string; title: string; body: string }[] = [];
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i]!;
    const end = i + 1 < matches.length ? matches[i + 1]!.index : text.length;
    let body = text.slice(cur.index, end).trim();
    // drop running headers
    body = body
      .replace(/Maratona Mineira de Programação[^\n]*/g, '')
      .replace(/XIII Maratona Mineira de Programação[^\n]*/g, '')
      .replace(/Caderno de Problemas[^\n]*/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    if (body.length < 80) continue;
    out.push({ letter: cur.letter, title: cur.title.replace(/\s+/g, ' '), body });
  }
  return out;
}

function ensureGithubYear(year: number, repo: string): string {
  const dest = join(REPO_DIR, String(year));
  if (existsSync(join(dest, 'prova', 'prova.tex')) || existsSync(join(dest, 'prova.tex'))) {
    return dest;
  }
  ensureDir(REPO_DIR);
  if (existsSync(dest)) {
    // partial cache from previous run — refresh
    execSync(`rm -rf "${dest}"`);
  }
  console.log(`  cloning ${repo}`);
  execSync(`git clone --depth 1 "${repo}" "${dest}"`, { stdio: 'pipe' });
  return dest;
}

function parseProvaTex(repoRoot: string): { title: string; folder: string; letter: string }[] {
  const candidates = [
    join(repoRoot, 'prova', 'prova.tex'),
    join(repoRoot, 'prova.tex'),
  ];
  const path = candidates.find((p) => existsSync(p));
  if (!path) return [];
  const tex = readFileSync(path, 'utf8');
  const rows: { title: string; folder: string; letter: string }[] = [];
  const re = /\\includeProblem\{([^}]*)\}\{([^}]*)\}/g;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(tex))) {
    rows.push({
      title: m[1]!.trim(),
      folder: m[2]!.trim(),
      letter: String.fromCharCode(65 + i),
    });
    i += 1;
  }
  return rows;
}

function loadGithubDrafts(
  year: number,
  edition: string,
  repoUrl: string,
): Draft[] {
  const root = ensureGithubYear(year, repoUrl);
  const listed = parseProvaTex(root);
  const drafts: Draft[] = [];
  const problemsRoot = existsSync(join(root, 'problems'))
    ? join(root, 'problems')
    : join(root, 'problems');

  const entries =
    listed.length > 0
      ? listed
      : readdirSync(problemsRoot, { withFileTypes: true })
          .filter((d) => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'nao_utilizados')
          .map((d, i) => ({
            title: d.name,
            folder: d.name,
            letter: String.fromCharCode(65 + i),
          }));

  for (const e of entries) {
    const stmtPath = join(problemsRoot, e.folder, 'documents', 'statement.tex');
    if (!existsSync(stmtPath)) {
      console.warn(`  missing statement ${year}/${e.folder}`);
      continue;
    }
    const md = latexToMd(readFileSync(stmtPath, 'utf8'));
    if (md.length < 40) continue;
    const id = `mineira-${year}-${e.letter.toLowerCase()}-${slug(e.title)}`;
    drafts.push(
      makeDraft({
        id,
        title: e.title,
        source: 'Maratona Mineira',
        url: `https://github.com/gcmgomes/mineira${year}`,
        letter: e.letter,
        year,
        edition,
        statement_md: md,
      }),
    );
  }
  return drafts;
}

async function loadPdfDrafts(spec: (typeof PDF_SOURCES)[number]): Promise<Draft[]> {
  const dest = join(PDF_DIR, spec.file);
  await download(spec.url, dest);
  const text = pdfToText(dest);
  const parts = splitPdfProblems(text);
  const drafts: Draft[] = [];
  for (const p of parts) {
    const id = `${spec.idPrefix}-${p.letter.toLowerCase()}-${slug(p.title)}`;
    drafts.push(
      makeDraft({
        id,
        title: p.title,
        source: spec.source,
        url: spec.url,
        letter: p.letter,
        year: spec.year,
        edition: spec.edition,
        statement_md: p.body,
      }),
    );
  }
  return drafts;
}

async function main() {
  ensureDir(CACHE);
  ensureDir(PDF_DIR);
  ensureDir(REPO_DIR);

  const have = existingIds();
  const collected: Draft[] = [];
  const seenSlug = new Set<string>();

  console.log('Loading GitHub years…');
  for (const g of GITHUB_YEARS) {
    try {
      const drafts = loadGithubDrafts(g.year, g.edition, g.repo);
      console.log(`  ${g.year}: ${drafts.length} from GitHub`);
      for (const d of drafts) {
        if (have.has(d.id) || seenSlug.has(d.id)) continue;
        seenSlug.add(d.id);
        collected.push(d);
      }
    } catch (e) {
      console.warn(`  fail github ${g.year}:`, e instanceof Error ? e.message : e);
    }
  }

  console.log('Loading PDF cadernos…');
  // Skip PDF years already covered by GitHub (prefer tex)
  const githubYears = new Set(GITHUB_YEARS.map((g) => g.year));
  for (const spec of PDF_SOURCES) {
    if (spec.source === 'Maratona Mineira' && githubYears.has(spec.year)) {
      console.log(`  skip PDF ${spec.year} (GitHub preferred)`);
      continue;
    }
    try {
      const drafts = await loadPdfDrafts(spec);
      console.log(`  ${spec.edition}: ${drafts.length} from PDF`);
      for (const d of drafts) {
        if (have.has(d.id) || seenSlug.has(d.id)) continue;
        // Meia Maratona overlaps titles with full Minas — keep both with distinct prefixes
        seenSlug.add(d.id);
        collected.push(d);
      }
    } catch (e) {
      console.warn(`  fail pdf ${spec.file}:`, e instanceof Error ? e.message : e);
    }
  }

  const extrasPath = resolve('data/extra-problems.json');
  const extras = (
    Array.isArray(extraJson) ? JSON.parse(JSON.stringify(extraJson)) : []
  ) as Draft[];

  let added = 0;
  for (const d of collected) {
    if (have.has(d.id)) continue;
    extras.push(d);
    have.add(d.id);
    added += 1;
  }

  writeFileSync(extrasPath, `${JSON.stringify(extras, null, 2)}\n`);
  console.log(`Added ${added} Mineira/Minas problems; extras now ${extras.length}`);
  console.log(
    'Note: public statements were not found for 2012–2018, 2020–2021, or 2024 (scoreboards only).',
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
