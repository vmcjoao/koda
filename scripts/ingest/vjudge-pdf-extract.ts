/**
 * Extract text from PDF-only UVA (and similar) VJudge statements.
 *
 * Prefers onlinejudge.org/external/{vol}/{num}.pdf for UVA; falls back to
 * the VJudge CDN pdfUrl when present. Requires `pdftotext` (poppler).
 *
 * Usage: npm run ingest:vjudge-pdf-extract
 *
 * Updates scripts/ingest/vjudge-exports/vjudge-statements.json in place.
 */

import { execFileSync } from 'child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
} from 'fs';
import { join, resolve } from 'path';

type Section = { title: string | null; format: string | null; content: string };
type StatementRow = {
  vjudgeKey: string;
  oj: string;
  probNum: string;
  title: string;
  originUrl: string | null;
  kind: string;
  pdfUrl: string | null;
  sections: Section[];
  text: string;
  error?: string;
};

const CACHE_DIR = resolve('scripts/ingest/vjudge-exports/pdf-cache');
const STATEMENTS_PATH = resolve('scripts/ingest/vjudge-exports/vjudge-statements.json');

function uvaExternalUrl(probNum: string): string | null {
  const n = Number(probNum);
  if (!Number.isFinite(n) || n <= 0) return null;
  const vol = Math.floor(n / 100);
  return `https://onlinejudge.org/external/${vol}/${n}.pdf`;
}

function candidateUrls(row: StatementRow): string[] {
  const urls: string[] = [];
  if (row.oj === 'UVA') {
    const u = uvaExternalUrl(row.probNum);
    if (u) urls.push(u);
  }
  if (row.pdfUrl) urls.push(row.pdfUrl);
  return [...new Set(urls)];
}

async function downloadPdf(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/pdf,*/*',
        'User-Agent': 'Mozilla/5.0 (compatible; koda-ingest/1.0)',
      },
      redirect: 'follow',
    });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 500 || buf.subarray(0, 4).toString() !== '%PDF') return false;
    writeFileSync(dest, buf);
    return true;
  } catch {
    return false;
  }
}

function extractText(pdfPath: string): string {
  const raw = execFileSync('pdftotext', ['-layout', '-enc', 'UTF-8', pdfPath, '-'], {
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
  });
  return raw
    .replace(/\f/g, '\n\n')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function lookLikeStatement(text: string): boolean {
  if (text.length < 80) return false;
  // Reject pure garbage / scanned-image OCR failure stubs
  const letters = (text.match(/[A-Za-z]/g) || []).length;
  return letters / text.length > 0.35;
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, i: number) => Promise<R>,
): Promise<R[]> {
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
  if (!existsSync(STATEMENTS_PATH)) {
    console.error('Missing vjudge-statements.json — run npm run ingest:vjudge-statements first');
    process.exit(1);
  }
  try {
    execFileSync('pdftotext', ['-v'], { stdio: 'pipe' });
  } catch {
    console.error('pdftotext not found — install poppler (e.g. pacman -S poppler)');
    process.exit(1);
  }

  mkdirSync(CACHE_DIR, { recursive: true });
  const payload = JSON.parse(readFileSync(STATEMENTS_PATH, 'utf8')) as {
    fetchedAt?: string;
    summary?: Record<string, number>;
    problems: StatementRow[];
  };

  const pdfRows = payload.problems
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => p.kind === 'pdf' || (p.kind === 'text' && !p.text?.trim() && p.pdfUrl));

  console.log(`Extracting text for ${pdfRows.length} PDF statements…`);

  let ok = 0;
  let fail = 0;

  await mapPool(pdfRows, 4, async ({ p, i }, done) => {
    const urls = candidateUrls(p);
    const cachePath = join(CACHE_DIR, `${p.vjudgeKey.replace(/[^a-zA-Z0-9_-]+/g, '_')}.pdf`);
    let got = existsSync(cachePath);
    if (!got) {
      for (const url of urls) {
        if (await downloadPdf(url, cachePath)) {
          got = true;
          break;
        }
      }
    }
    if (!got) {
      fail += 1;
      console.warn(`  fail ${p.vjudgeKey}: download`);
      return;
    }
    try {
      const text = extractText(cachePath);
      if (!lookLikeStatement(text)) {
        fail += 1;
        console.warn(`  fail ${p.vjudgeKey}: weak text (${text.length} chars)`);
        return;
      }
      const note =
        '\n\n_Source: PDF text extraction — figures/diagrams may be missing; verify against the original._';
      payload.problems[i] = {
        ...p,
        kind: 'text',
        text: `${text}${note}`,
        sections: [
          {
            title: 'Statement',
            format: 'MD',
            content: text,
          },
        ],
      };
      ok += 1;
      if ((done + 1) % 10 === 0 || done === pdfRows.length - 1) {
        console.log(`  ${done + 1}/${pdfRows.length} last=${p.vjudgeKey} chars=${text.length}`);
      }
    } catch (e) {
      fail += 1;
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`  fail ${p.vjudgeKey}: ${msg}`);
      try {
        unlinkSync(cachePath);
      } catch {
        /* keep */
      }
    }
  });

  const summary = {
    total: payload.problems.length,
    text: payload.problems.filter((r) => r.kind === 'text').length,
    pdf: payload.problems.filter((r) => r.kind === 'pdf').length,
    empty: payload.problems.filter((r) => r.kind === 'empty').length,
    error: payload.problems.filter((r) => r.kind === 'error').length,
  };
  payload.summary = summary;
  writeFileSync(STATEMENTS_PATH, `${JSON.stringify(payload, null, 2)}\n`);

  console.log('Done');
  console.log(`  extracted ok: ${ok}`);
  console.log(`  failed:       ${fail}`);
  console.log(`  now text:     ${summary.text}  pdf-left: ${summary.pdf}`);
  console.log('Next: npm run ingest:vjudge-import-statements');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
