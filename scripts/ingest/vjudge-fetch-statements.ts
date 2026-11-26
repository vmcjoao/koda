/**
 * Re-fetch VJudge statements using descKeys from enriched inbox files.
 * The browser enricher stored keys but empty sections (API returns HTML, not JSON).
 *
 * Usage: npm run ingest:vjudge-statements
 *
 * Writes: scripts/ingest/vjudge-exports/vjudge-statements.json
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';

type EnrichedProblem = {
  oj?: string;
  probNum?: string | number;
  title?: string | null;
  originUrl?: string | null;
  letter?: string | null;
  descKey?: string | null;
  descVersion?: string | number | null;
};

type Section = {
  title: string | null;
  format: string | null;
  content: string;
};

type StatementRow = {
  vjudgeKey: string;
  oj: string;
  probNum: string;
  title: string;
  originUrl: string | null;
  descKey: string;
  descVersion: string | number | null;
  kind: 'text' | 'pdf' | 'empty' | 'error';
  pdfUrl: string | null;
  sections: Section[];
  text: string;
  error?: string;
};

const CDN_BASE = 'https://vjudge.net';

function loadEnriched(): EnrichedProblem[] {
  const dirs = [resolve('scripts/ingest/inbox'), resolve('scripts/ingest/vjudge-exports')];
  const byKey = new Map<string, EnrichedProblem>();
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!name.startsWith('vjudge-enriched-') || !name.endsWith('.json')) continue;
      const data = JSON.parse(readFileSync(join(dir, name), 'utf8')) as {
        problems?: EnrichedProblem[];
      };
      for (const p of data.problems || []) {
        if (!p.oj || p.probNum == null || !p.descKey) continue;
        const key = `${p.oj}-${p.probNum}`;
        if (!byKey.has(key)) byKey.set(key, p);
      }
    }
  }
  return [...byKey.values()];
}

function unescapeHtml(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function htmlToText(html: string): string {
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<\/p>/gi, '\n\n');
  s = s.replace(/<\/div>/gi, '\n');
  s = s.replace(/<\/li>/gi, '\n');
  s = s.replace(/<\/h[1-6]>/gi, '\n\n');
  s = s.replace(/<li[^>]*>/gi, '- ');
  s = s.replace(/<[^>]+>/g, '');
  s = unescapeHtml(s);
  s = s.replace(/\r/g, '');
  s = s.replace(/[ \t]+\n/g, '\n');
  s = s.replace(/\n{3,}/g, '\n\n');
  return s.trim();
}

function extractPdfUrl(content: string): string | null {
  const m1 = content.match(/\[pdf:(CDN_BASE_URL\/[^\]]+)\]/);
  if (m1) return `${CDN_BASE}/${m1[1].replace(/^CDN_BASE_URL\//, '')}`;
  const m2 = content.match(/href="(https?:\/\/[^"]+\.pdf)"/i);
  if (m2) return m2[1];
  const m3 = content.match(/\[pdf:([^\]]+)\]/);
  if (m3) {
    const path = m3[1].replace(/^CDN_BASE_URL\//, '');
    if (path.startsWith('http')) return path;
    return `${CDN_BASE}/${path}`;
  }
  return null;
}

async function fetchDescription(descKey: string, version: string | number | null | undefined) {
  let url = `https://vjudge.net/problem/description/${encodeURIComponent(descKey)}`;
  if (version != null && version !== '') url += `?${version}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'text/html',
      'User-Agent': 'Mozilla/5.0 (compatible; koda-ingest/1.0)',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const m = html.match(/<textarea class="data-json-container"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (!m) throw new Error('no data-json-container');
  return JSON.parse(unescapeHtml(m[1])) as {
    sections?: Array<{ title?: string; value?: unknown }>;
  };
}

function normalizeSections(data: {
  sections?: Array<{ title?: string; value?: unknown }>;
}): Section[] {
  const out: Section[] = [];
  for (const s of data.sections || []) {
    const value = s.value;
    let format: string | null = null;
    let content = '';
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const v = value as { format?: string; content?: string };
      format = v.format || null;
      content = String(v.content ?? '');
    } else if (typeof value === 'string') {
      content = value;
    }
    out.push({
      title: s.title != null ? String(s.title) : null,
      format,
      content,
    });
  }
  return out;
}

function classify(sections: Section[]): { kind: StatementRow['kind']; pdfUrl: string | null; text: string } {
  if (!sections.length) return { kind: 'empty', pdfUrl: null, text: '' };
  const blob = sections.map((s) => s.content).join('\n');
  const pdfUrl = extractPdfUrl(blob);
  if (pdfUrl || /\[pdf:/i.test(blob)) {
    return { kind: 'pdf', pdfUrl, text: '' };
  }
  const parts: string[] = [];
  for (const s of sections) {
    const body =
      s.format === 'MD' || s.format === 'Markdown' ? s.content.trim() : htmlToText(s.content);
    if (!body) continue;
    if (s.title && s.title.trim()) parts.push(`## ${s.title.trim()}\n\n${body}`);
    else parts.push(body);
  }
  const text = parts.join('\n\n').trim();
  if (text.length < 40) return { kind: 'empty', pdfUrl: null, text };
  return { kind: 'text', pdfUrl: null, text };
}

async function mapPool<T, R>(items: T[], concurrency: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

async function main() {
  const enriched = loadEnriched();
  if (!enriched.length) {
    console.error('No vjudge-enriched-*.json with descKeys found in inbox/ or vjudge-exports/');
    process.exit(1);
  }
  console.log(`Fetching statements for ${enriched.length} problems…`);

  const rows = await mapPool(enriched, 6, async (p, i) => {
    const oj = String(p.oj);
    const probNum = String(p.probNum);
    const vjudgeKey = `${oj}-${probNum}`;
    const base: StatementRow = {
      vjudgeKey,
      oj,
      probNum,
      title: String(p.title || vjudgeKey),
      originUrl: p.originUrl || `https://vjudge.net/problem/${vjudgeKey}`,
      descKey: String(p.descKey),
      descVersion: p.descVersion ?? null,
      kind: 'error',
      pdfUrl: null,
      sections: [],
      text: '',
    };
    try {
      const data = await fetchDescription(String(p.descKey), p.descVersion);
      const sections = normalizeSections(data);
      const { kind, pdfUrl, text } = classify(sections);
      if ((i + 1) % 25 === 0 || i === enriched.length - 1) {
        console.log(`  ${i + 1}/${enriched.length} last=${vjudgeKey} kind=${kind}`);
      }
      return { ...base, kind, pdfUrl, sections, text };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`  fail ${vjudgeKey}: ${msg}`);
      return { ...base, kind: 'error' as const, error: msg };
    }
  });

  const summary = {
    total: rows.length,
    text: rows.filter((r) => r.kind === 'text').length,
    pdf: rows.filter((r) => r.kind === 'pdf').length,
    empty: rows.filter((r) => r.kind === 'empty').length,
    error: rows.filter((r) => r.kind === 'error').length,
  };

  const outDir = resolve('scripts/ingest/vjudge-exports');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 'vjudge-statements.json');
  writeFileSync(
    outPath,
    `${JSON.stringify({ fetchedAt: new Date().toISOString(), summary, problems: rows }, null, 2)}\n`,
  );

  console.log('Done');
  console.log(`  text statements: ${summary.text}`);
  console.log(`  pdf-only:        ${summary.pdf}`);
  console.log(`  empty:           ${summary.empty}`);
  console.log(`  errors:          ${summary.error}`);
  console.log(`  wrote ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
