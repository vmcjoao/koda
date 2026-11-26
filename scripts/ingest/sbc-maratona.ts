/**
 * Ingest Maratona SBC de Programação problems from public PDF archives.
 *
 * Covers as far back as public cadernos allow:
 *  - Primeira fase / Subregional: 2005, 2008–2026
 *  - Final BR (= LATAM regional set): 2003, 2011–2017, 2019–2025
 *  - Fase Zero: 2025 (only year with a public contest PDF; 2022–2024 are on Beecrowd)
 *
 * Usage: npm run ingest:sbc
 */

import { execFileSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
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

type Source = {
  idPrefix: string;
  year: number;
  phase: 'fase0' | 'primeira' | 'final';
  edition: string;
  source: string;
  url: string;
  file: string;
};

const CACHE = resolve('scripts/ingest/sbc-cache');
const PDF_DIR = join(CACHE, 'pdfs');

/** Public statement PDFs discovered on maratona.sbc.org.br / scorelatam / CF gym. */
const SOURCES: Source[] = [
  // ── Primeira fase / Subregional Brasil ──
  {
    idPrefix: 'sbc-2005-p1',
    year: 2005,
    phase: 'primeira',
    edition: 'SBC 2005 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2005/primeira-fase/problem_set2005.pdf',
    file: '2005-p1.pdf',
  },
  {
    idPrefix: 'sbc-2008-p1',
    year: 2008,
    phase: 'primeira',
    edition: 'SBC 2008 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2008/primeira-fase/maratona_v5.pdf',
    file: '2008-p1.pdf',
  },
  {
    idPrefix: 'sbc-2009-p1',
    year: 2009,
    phase: 'primeira',
    edition: 'SBC 2009 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2009/primeira-fase/primeirafase09/maratona.pdf',
    file: '2009-p1.pdf',
  },
  {
    idPrefix: 'sbc-2010-p1',
    year: 2010,
    phase: 'primeira',
    edition: 'SBC 2010 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2010/primeira-fase/maratona.pdf',
    file: '2010-p1.pdf',
  },
  {
    idPrefix: 'sbc-2011-p1',
    year: 2011,
    phase: 'primeira',
    edition: 'SBC 2011 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2011/primeira-fase/competicao/maratona.pdf',
    file: '2011-p1.pdf',
  },
  {
    idPrefix: 'sbc-2012-p1',
    year: 2012,
    phase: 'primeira',
    edition: 'SBC 2012 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2012/primeira-fase/maratona.pdf',
    file: '2012-p1.pdf',
  },
  {
    idPrefix: 'sbc-2013-p1',
    year: 2013,
    phase: 'primeira',
    edition: 'SBC 2013 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2013/primeira-fase/prim-fase2013/maratona.pdf',
    file: '2013-p1.pdf',
  },
  {
    idPrefix: 'sbc-2014-p1',
    year: 2014,
    phase: 'primeira',
    edition: 'SBC 2014 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2014/primeira-fase/maratona.pdf',
    file: '2014-p1.pdf',
  },
  {
    idPrefix: 'sbc-2015-p1',
    year: 2015,
    phase: 'primeira',
    edition: 'SBC 2015 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2015/primeira-fase/maratona.pdf',
    file: '2015-p1.pdf',
  },
  {
    idPrefix: 'sbc-2016-p1',
    year: 2016,
    phase: 'primeira',
    edition: 'SBC 2016 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2016/primeira-fase/maratona.pdf',
    file: '2016-p1.pdf',
  },
  {
    idPrefix: 'sbc-2017-p1',
    year: 2017,
    phase: 'primeira',
    edition: 'SBC 2017 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2017/prim-fase17/maratona.pdf',
    file: '2017-p1.pdf',
  },
  {
    idPrefix: 'sbc-2018-p1',
    year: 2018,
    phase: 'primeira',
    edition: 'SBC 2018 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2018/prim-fase18/maratona.pdf',
    file: '2018-p1.pdf',
  },
  {
    idPrefix: 'sbc-2019-p1',
    year: 2019,
    phase: 'primeira',
    edition: 'SBC 2019 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2019/primfase19/provas/competicao/maratona.pdf',
    file: '2019-p1.pdf',
  },
  {
    idPrefix: 'sbc-2020-p1',
    year: 2020,
    phase: 'primeira',
    edition: 'SBC 2020 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://codeforces.com/gym/102861/attachments/download/12360/statements-pt.pdf',
    file: '2020-p1.pdf',
  },
  {
    idPrefix: 'sbc-2021-p1',
    year: 2021,
    phase: 'primeira',
    edition: 'SBC 2021 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://scorelatam.naquadah.com.br/subbr-2021/maratona.pdf',
    file: '2021-p1.pdf',
  },
  {
    idPrefix: 'sbc-2022-p1',
    year: 2022,
    phase: 'primeira',
    edition: 'SBC 2022 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://scorelatam.naquadah.com.br/subbr-2022/maratona.pdf',
    file: '2022-p1.pdf',
  },
  {
    idPrefix: 'sbc-2023-p1',
    year: 2023,
    phase: 'primeira',
    edition: 'SBC 2023 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://scorelatam.naquadah.com.br/subbr-2023/maratona.pdf',
    file: '2023-p1.pdf',
  },
  {
    idPrefix: 'sbc-2024-p1',
    year: 2024,
    phase: 'primeira',
    edition: 'SBC 2024 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://scorelatam.naquadah.com.br/subbr-2024/maratona.pdf',
    file: '2024-p1.pdf',
  },
  {
    idPrefix: 'sbc-2025-p1',
    year: 2025,
    phase: 'primeira',
    edition: 'SBC 2025 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://scorelatam.naquadah.com.br/subbr-2025/maratona.pdf',
    file: '2025-p1.pdf',
  },
  {
    idPrefix: 'sbc-2026-p1',
    year: 2026,
    phase: 'primeira',
    edition: 'SBC 2026 — 1ª fase',
    source: 'SBC Maratona',
    url: 'https://scorelatam.naquadah.com.br/subbr-2026/documentos/contest.pt.pdf',
    file: '2026-p1.pdf',
  },

  // ── Final brasileira (LATAM regional problem set) ──
  {
    idPrefix: 'sbc-2003-final',
    year: 2003,
    phase: 'final',
    edition: 'SBC 2003 — Final',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2003/problem_set.pdf',
    file: '2003-final.pdf',
  },
  {
    idPrefix: 'sbc-2011-final',
    year: 2011,
    phase: 'final',
    edition: 'SBC 2011 — Final (LATAM)',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2011/contest_br.pdf',
    file: '2011-final.pdf',
  },
  {
    idPrefix: 'sbc-2012-final',
    year: 2012,
    phase: 'final',
    edition: 'SBC 2012 — Final (LATAM)',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2012/resultados12/data/contest_br.pdf',
    file: '2012-final.pdf',
  },
  {
    idPrefix: 'sbc-2013-final',
    year: 2013,
    phase: 'final',
    edition: 'SBC 2013 — Final (LATAM)',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2013/resultados13/data/contest_onesided.pdf',
    file: '2013-final.pdf',
  },
  {
    idPrefix: 'sbc-2014-final',
    year: 2014,
    phase: 'final',
    edition: 'SBC 2014 — Final (LATAM)',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2014/resultados14/icpcla2014/contest_onesided.pdf',
    file: '2014-final.pdf',
  },
  {
    idPrefix: 'sbc-2015-final',
    year: 2015,
    phase: 'final',
    edition: 'SBC 2015 — Final (LATAM)',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2015/resultados/contest_onesided.pdf',
    file: '2015-final.pdf',
  },
  {
    idPrefix: 'sbc-2016-final',
    year: 2016,
    phase: 'final',
    edition: 'SBC 2016 — Final (LATAM)',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2016/resultados/contest.pdf',
    file: '2016-final.pdf',
  },
  {
    idPrefix: 'sbc-2017-final',
    year: 2017,
    phase: 'final',
    edition: 'SBC 2017 — Final (LATAM)',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2017/resultados/contest.pdf',
    file: '2017-final.pdf',
  },
  {
    idPrefix: 'sbc-2019-final',
    year: 2019,
    phase: 'final',
    edition: 'SBC 2019 — Final (LATAM)',
    source: 'SBC Maratona',
    url: 'https://maratona.sbc.org.br/hist/2019/resultados19/prova/prova/contest_onesided.pdf',
    file: '2019-final.pdf',
  },
  {
    idPrefix: 'sbc-2020-final',
    year: 2020,
    phase: 'final',
    edition: 'SBC 2020 — Final (LATAM)',
    source: 'SBC Maratona',
    url: 'https://scorelatam.naquadah.com.br/latam-2020/pdfs/contest.pdf',
    file: '2020-final.pdf',
  },
  {
    idPrefix: 'sbc-2021-final',
    year: 2021,
    phase: 'final',
    edition: 'SBC 2021 — Final (LATAM)',
    source: 'SBC Maratona',
    url: 'https://scorelatam.naquadah.com.br/latam-2021/contest/contest.pdf',
    file: '2021-final.pdf',
  },
  {
    idPrefix: 'sbc-2022-final',
    year: 2022,
    phase: 'final',
    edition: 'SBC 2022 — Final (LATAM)',
    source: 'SBC Maratona',
    url: 'https://scorelatam.naquadah.com.br/latam-2022/contest.pdf',
    file: '2022-final.pdf',
  },
  {
    idPrefix: 'sbc-2023-final',
    year: 2023,
    phase: 'final',
    edition: 'SBC 2023 — Final (LATAM)',
    source: 'SBC Maratona',
    url: 'https://scorelatam.naquadah.com.br/latam-2023/contest.pdf',
    file: '2023-final.pdf',
  },
  {
    idPrefix: 'sbc-2024-final',
    year: 2024,
    phase: 'final',
    edition: 'SBC 2024 — Final (LATAM)',
    source: 'SBC Maratona',
    url: 'https://scorelatam.naquadah.com.br/latam-2024/contest.pdf',
    file: '2024-final.pdf',
  },
  {
    idPrefix: 'sbc-2025-final',
    year: 2025,
    phase: 'final',
    edition: 'SBC 2025 — Final (LATAM)',
    source: 'SBC Maratona',
    url: 'https://scorelatam.naquadah.com.br/latam-2025/contest.pdf',
    file: '2025-final.pdf',
  },

  // ── Fase Zero ──
  {
    idPrefix: 'sbc-2025-f0',
    year: 2025,
    phase: 'fase0',
    edition: 'SBC 2025 — Fase Zero',
    source: 'SBC Maratona',
    url: 'https://scorelatam.naquadah.com.br/fzero-2025/contest.br.pdf',
    file: '2025-f0.pdf',
  },
];

function slug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 55);
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

function letterDifficulty(letter: string, phase: Source['phase']): number {
  const i = letter.toUpperCase().charCodeAt(0) - 65;
  const base = phase === 'fase0' ? 900 : phase === 'primeira' ? 1100 : 1400;
  return Math.min(2600, base + i * 100);
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

  if (/interativ|interactive/.test(t)) paradigms.push('Interactive');
  if (/graph|graf|árov|arvore|árvore|tree|edge|aresta|vértice|vertice|path|caminho/.test(t)) {
    paradigms.push('Graph Algorithms');
    if (/dijkstra|shortest|menor caminho/.test(t)) {
      algorithms.push('Dijkstra');
      data_structures.push('Priority Queue');
    }
    if (/bfs|breadth/.test(t)) algorithms.push('BFS');
    if (/dfs|depth|bridge|ponte/.test(t)) algorithms.push('DFS');
    if (/mst|spanning/.test(t)) algorithms.push('MST', 'DSU');
    if (/flow|fluxo|matching|emparelh/.test(t)) paradigms.push('Flows / Matching');
  }
  if (/dynamic|dp\b|programação dinâmica|programacao dinamica|knapsack|mochila/.test(t)) {
    paradigms.push('Dynamic Programming');
  }
  if (/string|palavra|texto|palindr|prefix|suffix|cifra/.test(t)) {
    paradigms.push('String Algorithms');
    if (/hash/.test(t)) algorithms.push('String Hashing');
    if (/kmp|z-alg|border/.test(t)) algorithms.push('KMP');
  }
  if (/geometr|convex|polygon|polig|circle|círculo|circulo|angle/.test(t)) {
    paradigms.push('Geometry');
  }
  if (/prime|primo|modulo|módulo|gcd|mdc|combinat|math|matem|divisor|sieve|crivo/.test(t)) {
    paradigms.push('Math / Number Theory');
    if (/sieve|crivo|primo/.test(t)) algorithms.push('Sieve');
  }
  if (/greedy|guloso|sort|orden/.test(t)) {
    paradigms.push('Greedy');
    algorithms.push('Sorting');
  }
  if (/binary search|busca bin|ternar/.test(t)) {
    paradigms.push('Binary Search on Answer');
    algorithms.push('Binary Search');
  }
  if (/two pointer|dois ponteiro|sliding|janela/.test(t)) paradigms.push('Two Pointers');
  if (/bitmask|bit dp|máscara|mascara/.test(t)) paradigms.push('Bitmask / Bit DP');
  if (/segment tree|fenwick|sparse/.test(t)) {
    algorithms.push('Segment Tree');
    data_structures.push('Fenwick Tree');
  }
  if (/stack|pilha|monoton/.test(t)) data_structures.push('Monotonic Stack', 'Stack');
  if (/queue|fila|deque/.test(t)) data_structures.push('Queue', 'Deque');
  if (/set\b|conjunto|multiset/.test(t)) data_structures.push('Ordered Set');
  if (/map|hash|dict/.test(t)) data_structures.push('Hash Map');
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

function sectionFromMd(body: string, label: RegExp): string {
  const m = body.match(
    new RegExp(
      `(?:^|\\n)#{0,4}\\s*${label.source}\\s*\\n([\\s\\S]*?)(?=\\n#{0,4}\\s*(?:Entrada|Saída|Saida|Input|Output|Restrições|Restricoes|Constraints?|Exemplos?|Sample)\\b|$)`,
      'i',
    ),
  );
  return m?.[1]?.trim().slice(0, 1500) || '';
}

function extractConstraints(body: string): string {
  const c = sectionFromMd(body, /Restriç(?:ões|oes)|Constraints?/);
  if (c) return c.slice(0, 600);
  const ranges = body.match(/[0-9]+ *≤ *[^.\n]{0,50}|[0-9]+ *<= *[^.\n]{0,50}/g);
  if (ranges?.length) return ranges.slice(0, 10).join('; ');
  return 'See statement.';
}

function makeDraft(
  spec: Source,
  letter: string,
  title: string,
  body: string,
): Draft {
  const id = `${spec.idPrefix}-${letter.toLowerCase()}-${slug(title) || 'problem'}`;
  const tags = tagsFor(`${title}\n${body}`);
  return {
    id,
    title,
    source: spec.source,
    url: spec.url,
    difficulty_rating: letterDifficulty(letter, spec.phase),
    statement_md: body,
    input_format_md: sectionFromMd(body, /Entrada|Input/) || 'See statement.',
    output_format_md: sectionFromMd(body, /Saída|Saida|Output/) || 'See statement.',
    constraints_text: extractConstraints(body),
    sample_io: [],
    target_complexity: tags.complexity,
    approaches: [
      {
        id: `${id}-a1`,
        problem_id: id,
        approach_name: `${spec.edition} — standard`,
        paradigms: tags.paradigms,
        algorithms: tags.algorithms,
        data_structures: tags.data_structures,
        key_insights: [
          `${spec.edition}, problem ${letter}. Auto-tagged from statement; refine after solving.`,
        ],
        editorial_summary_md: `From ${spec.edition}. Review tags and write a proper editorial after solving.`,
      },
    ],
  };
}

function ensureDir(p: string) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

async function download(url: string, dest: string): Promise<void> {
  if (existsSync(dest)) {
    const n = readFileSync(dest).length;
    if (n > 20000) return;
  }
  ensureDir(PDF_DIR);
  const res = await fetch(url, {
    headers: {
      Accept: 'application/pdf,*/*',
      'User-Agent': 'Mozilla/5.0 (compatible; koda-ingest/1.0)',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000 || buf.subarray(0, 4).toString() !== '%PDF') {
    throw new Error(`not a PDF (${buf.length} bytes)`);
  }
  writeFileSync(dest, buf);
}

function pdfToText(pdfPath: string): string {
  return execFileSync('pdftotext', ['-layout', '-enc', 'UTF-8', pdfPath, '-'], {
    encoding: 'utf8',
    maxBuffer: 24 * 1024 * 1024,
  })
    .replace(/\f/g, '\n')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function splitProblems(text: string): { letter: string; title: string; body: string }[] {
  // Portuguese + English headers used across years
  const re =
    /(?:^|\n)[ \t]*(?:Problema|Problem)\s+([A-Z])(?:\s*[.––—:-]\s*|\s+)([^\n]{0,120})/g;
  const matches: { letter: string; title: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    let title = (m[2] || '').trim();
    // Some booklets put the real title on the next non-empty line
    if (!title || /^(tempo|time|limite|memory|memória|memoria)/i.test(title)) {
      const after = text.slice(m.index + m[0].length, m.index + m[0].length + 400);
      const next = after.match(/\n[ \t]*([A-ZÁÉÍÓÚÂÊÔÃÕÀÜ][^\n]{2,80})\n/);
      if (next) title = next[1]!.trim();
    }
    title = title.replace(/\s+/g, ' ').replace(/^[#\s]+/, '');
    matches.push({ letter: m[1]!, title: title || `Problem ${m[1]}`, index: m.index });
  }

  // Deduplicate repeated running headers (same letter appearing again for page headers)
  const filtered: typeof matches = [];
  for (const cur of matches) {
    const prev = filtered[filtered.length - 1];
    if (prev && prev.letter === cur.letter && cur.index - prev.index < 400) continue;
    // Skip if letter goes backwards a lot (running header reprint) unless restarting booklet
    if (prev) {
      const d = cur.letter.charCodeAt(0) - prev.letter.charCodeAt(0);
      if (d < 0 && cur.index - prev.index < 2500) continue;
      if (d === 0) continue;
    }
    filtered.push(cur);
  }

  const out: { letter: string; title: string; body: string }[] = [];
  for (let i = 0; i < filtered.length; i++) {
    const cur = filtered[i]!;
    const end = i + 1 < filtered.length ? filtered[i + 1]!.index : text.length;
    let body = text.slice(cur.index, end).trim();
    body = body
      .replace(/Maratona de Programa[^\n]*/g, '')
      .replace(/International Collegiate Programming Contest[^\n]*/g, '')
      .replace(/Sub-Regional Brasil[^\n]*/g, '')
      .replace(/Latin American Regional[^\n]*/g, '')
      .replace(/Caderno de Problemas[^\n]*/g, '')
      .replace(/Fase Zero da Maratona[^\n]*/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    if (body.length < 100) continue;
    out.push({ letter: cur.letter, title: cur.title, body });
  }
  return out;
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, i: number) => Promise<R>,
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]!, i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return out;
}

async function loadSource(spec: Source): Promise<{ drafts: Draft[]; error?: string }> {
  const dest = join(PDF_DIR, spec.file);
  try {
    await download(spec.url, dest);
    const text = pdfToText(dest);
    const parts = splitProblems(text);
    const drafts = parts.map((p) => makeDraft(spec, p.letter, p.title, p.body));
    return { drafts };
  } catch (e) {
    return { drafts: [], error: e instanceof Error ? e.message : String(e) };
  }
}

async function main() {
  ensureDir(CACHE);
  ensureDir(PDF_DIR);
  const have = existingIds();
  console.log(`SBC ingest: ${SOURCES.length} PDF sources; catalog ids=${have.size}`);

  const results = await mapPool(SOURCES, 4, async (spec, i) => {
    process.stdout.write(`  [${i + 1}/${SOURCES.length}] ${spec.edition}… `);
    const r = await loadSource(spec);
    if (r.error) {
      console.log(`FAIL ${r.error}`);
    } else {
      console.log(`${r.drafts.length} problems`);
    }
    return { spec, ...r };
  });

  const extrasPath = resolve('data/extra-problems.json');
  const extras = (
    Array.isArray(extraJson) ? JSON.parse(JSON.stringify(extraJson)) : []
  ) as Draft[];

  let added = 0;
  let failedSources = 0;
  const byPhase: Record<string, number> = { fase0: 0, primeira: 0, final: 0 };

  for (const r of results) {
    if (r.error || !r.drafts.length) {
      failedSources += 1;
      continue;
    }
    for (const d of r.drafts) {
      if (have.has(d.id)) continue;
      extras.push(d);
      have.add(d.id);
      added += 1;
      byPhase[r.spec.phase] = (byPhase[r.spec.phase] || 0) + 1;
    }
  }

  writeFileSync(extrasPath, `${JSON.stringify(extras, null, 2)}\n`);
  console.log(
    `Added ${added} (fase0=${byPhase.fase0}, 1ªfase=${byPhase.primeira}, final=${byPhase.final}); failed/empty sources=${failedSources}; extras=${extras.length}`,
  );
  console.log(
    'Note: Fase Zero 2022–2024 live on Beecrowd without public PDFs; 2000–2004/2006–2007 first-phase cadernos not found; 2018 final PDF missing.',
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
