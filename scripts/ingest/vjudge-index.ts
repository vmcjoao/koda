/**
 * Index VJudge group exports against the local catalog and emit playlist templates.
 *
 * Usage:
 *   npm run ingest:vjudge-index
 *
 * Reads:  scripts/ingest/vjudge-exports/vjudge-group-*.json
 *         (falls back to scripts/ingest/inbox/vjudge-group-*.json)
 * Writes: scripts/ingest/vjudge-exports/vjudge-index.json
 *         data/playlist-templates/ufv.json
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { SEED_PROBLEMS } from '../../data/seed-problems';
import extraJson from '../../data/extra-problems.json';

type VjProblem = {
  letter?: string;
  title?: string;
  oj?: string | null;
  probNum?: string | number | null;
  originUrl?: string | null;
  descKey?: string | null;
};

type VjContest = {
  contestId?: string | number;
  contestUrl?: string;
  title?: string | null;
  problems?: VjProblem[];
  error?: string;
};

type VjGroup = {
  groupUrl?: string;
  shortName?: string;
  groupId?: string | number | null;
  title?: string | null;
  exportedAt?: string;
  contests?: VjContest[];
};

type CatalogProblem = {
  id: string;
  title: string;
  source: string;
  url: string | null;
};

export type PlaylistTemplateEntry = {
  letter: string;
  title: string;
  vjudgeKey: string | null;
  originUrl: string | null;
  proposedId: string;
  proposedSource: string;
  proposedUrl: string | null;
  catalogId: string | null;
  status: 'in_catalog' | 'pending' | 'custom';
};

export type PlaylistTemplate = {
  id: string;
  name: string;
  description: string;
  groupShortName: string;
  groupTitle: string | null;
  contestId: string;
  contestUrl: string | null;
  entries: PlaylistTemplateEntry[];
};

type IndexProblem = {
  vjudgeKey: string | null;
  oj: string | null;
  probNum: string | null;
  title: string;
  originUrl: string | null;
  proposedId: string;
  proposedSource: string;
  proposedUrl: string | null;
  catalogId: string | null;
  status: 'in_catalog' | 'pending' | 'custom';
  appearsIn: Array<{ group: string; contestId: string; contestTitle: string; letter: string }>;
};

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#38;/g, '&');
}

function slugPart(s: string): string {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cfParts(probNum: string): { contest: string; letter: string } | null {
  const m = String(probNum).trim().match(/^(\d+)([A-Za-z]\d*)$/);
  if (!m) return null;
  return { contest: m[1], letter: m[2] };
}

function propose(oj: string | null, probNum: string | null, title: string): {
  id: string;
  source: string;
  url: string | null;
} {
  const o = (oj || '').trim();
  const pn = probNum != null ? String(probNum).trim() : '';

  if (o === 'CSES' && pn) {
    return {
      id: `cses-${pn}`,
      source: 'CSES',
      url: `https://cses.fi/problemset/task/${pn}`,
    };
  }
  if ((o === 'CodeForces' || o === 'Codeforces') && pn) {
    const parts = cfParts(pn);
    if (parts) {
      return {
        id: `cf-${parts.contest}${parts.letter.toLowerCase()}`,
        source: 'Codeforces',
        url: `https://codeforces.com/problemset/problem/${parts.contest}/${parts.letter.toUpperCase()}`,
      };
    }
  }
  if (o === 'USACO' && pn) {
    return {
      id: `usaco-${pn}`,
      source: 'USACO',
      url: `http://www.usaco.org/index.php?page=viewproblem2&cpid=${pn}`,
    };
  }
  if (o === 'UVA' && pn) {
    return { id: `uva-${pn}`, source: 'UVA', url: `https://vjudge.net/problem/UVA-${pn}` };
  }
  if (o === 'SPOJ' && pn) {
    return {
      id: `spoj-${slugPart(pn)}`,
      source: 'SPOJ',
      url: `https://www.spoj.com/problems/${pn}/`,
    };
  }
  if (o === 'AtCoder' && pn) {
    return { id: `atc-${slugPart(pn)}`, source: 'AtCoder', url: null };
  }
  if (o === 'Kattis' && pn) {
    return {
      id: `kattis-${slugPart(pn)}`,
      source: 'Kattis',
      url: `https://open.kattis.com/problems/${pn}`,
    };
  }
  if (o === 'POJ' && pn) {
    return {
      id: `poj-${pn}`,
      source: 'POJ',
      url: `http://poj.org/problem?id=${pn}`,
    };
  }
  if (o === 'Gym' && pn) {
    const parts = cfParts(pn);
    if (parts) {
      return {
        id: `gym-${parts.contest}${parts.letter.toLowerCase()}`,
        source: 'Codeforces',
        url: `https://codeforces.com/gym/${parts.contest}/problem/${parts.letter.toUpperCase()}`,
      };
    }
    return { id: `gym-${slugPart(pn)}`, source: 'Codeforces', url: null };
  }
  if (o && pn) {
    return {
      id: `${slugPart(o)}-${slugPart(pn)}`,
      source: o,
      url: `https://vjudge.net/problem/${o}-${pn}`,
    };
  }
  const t = slugPart(title) || 'untitled';
  return { id: `vj-custom-${t}`, source: 'Other', url: null };
}

function vjudgeKey(oj: string | null, probNum: string | null): string | null {
  if (!oj || probNum == null || String(probNum).trim() === '') return null;
  return `${oj}-${probNum}`;
}

function loadCatalog(): CatalogProblem[] {
  const extras = (Array.isArray(extraJson) ? extraJson : []) as CatalogProblem[];
  const seed = SEED_PROBLEMS.map((p) => ({
    id: p.id,
    title: p.title,
    source: p.source,
    url: p.url,
  }));
  const byId = new Map<string, CatalogProblem>();
  for (const p of [...seed, ...extras]) byId.set(p.id, p);
  return [...byId.values()];
}

/** Map lookup keys → catalog id */
function buildCatalogIndex(catalog: CatalogProblem[]): Map<string, string> {
  const index = new Map<string, string>();
  const set = (k: string, id: string) => {
    if (!index.has(k)) index.set(k, id);
  };

  for (const p of catalog) {
    set(`id:${p.id}`, p.id);
    const url = p.url || '';

    let m = url.match(/cses\.fi\/problemset\/task\/(\d+)/);
    if (m) {
      set(`CSES-${m[1]}`, p.id);
      set(`id:cses-${m[1]}`, p.id);
    }
    if (p.id.startsWith('cses-') && /^\d+$/.test(p.id.slice(5))) {
      set(`CSES-${p.id.slice(5)}`, p.id);
    }

    m = url.match(/codeforces\.com\/(?:problemset\/problem|contest)\/(\d+)\/problem\/([A-Za-z0-9]+)/);
    if (!m) m = url.match(/codeforces\.com\/problemset\/problem\/(\d+)\/([A-Za-z0-9]+)/);
    if (m) {
      set(`CodeForces-${m[1]}${m[2]}`, p.id);
      set(`CodeForces-${m[1]}${m[2].toUpperCase()}`, p.id);
      set(`CodeForces-${m[1]}${m[2].toLowerCase()}`, p.id);
      set(`id:cf-${m[1]}${m[2].toLowerCase()}`, p.id);
    }
    const cfId = p.id.match(/^cf-(\d+)([a-z]\d*)$/i);
    if (cfId) {
      set(`CodeForces-${cfId[1]}${cfId[2].toUpperCase()}`, p.id);
      set(`CodeForces-${cfId[1]}${cfId[2]}`, p.id);
      set(`CodeForces-${cfId[1]}${cfId[2].toLowerCase()}`, p.id);
    }

    m = url.match(/[?&]cpid=(\d+)/);
    if (m) {
      set(`USACO-${m[1]}`, p.id);
      set(`id:usaco-${m[1]}`, p.id);
    }
    const usacoId = p.id.match(/^usaco-(\d+)$/);
    if (usacoId) set(`USACO-${usacoId[1]}`, p.id);

    if (p.id.startsWith('uva-')) {
      const num = p.id.replace(/^uva-/, '');
      if (/^\d+$/.test(num)) set(`UVA-${num}`, p.id);
    }
  }
  return index;
}

function resolveCatalogId(
  index: Map<string, string>,
  oj: string | null,
  probNum: string | null,
  proposedId: string,
): string | null {
  if (index.has(`id:${proposedId}`)) return index.get(`id:${proposedId}`) ?? null;
  const key = vjudgeKey(oj, probNum);
  if (key && index.has(key)) return index.get(key) ?? null;
  if (oj === 'CodeForces' && probNum) {
    const parts = cfParts(String(probNum));
    if (parts) {
      for (const letter of [parts.letter, parts.letter.toUpperCase(), parts.letter.toLowerCase()]) {
        const k = `CodeForces-${parts.contest}${letter}`;
        if (index.has(k)) return index.get(k) ?? null;
      }
      const idKey = `id:cf-${parts.contest}${parts.letter.toLowerCase()}`;
      if (index.has(idKey)) return index.get(idKey) ?? null;
    }
  }
  return null;
}

function findExportDirs(): string[] {
  const root = resolve('.');
  const dirs = [resolve(root, 'scripts/ingest/vjudge-exports'), resolve(root, 'scripts/ingest/inbox')];
  return dirs.filter((d) => existsSync(d));
}

function loadGroups(): Array<{ file: string; group: VjGroup }> {
  const out: Array<{ file: string; group: VjGroup }> = [];
  const seen = new Set<string>();
  for (const dir of findExportDirs()) {
    for (const name of readdirSync(dir)) {
      if (!name.startsWith('vjudge-group-') || !name.endsWith('.json')) continue;
      if (seen.has(name)) continue;
      seen.add(name);
      const file = join(dir, name);
      const group = JSON.parse(readFileSync(file, 'utf8')) as VjGroup;
      out.push({ file, group });
    }
  }
  return out;
}

function main() {
  const catalog = loadCatalog();
  const catIndex = buildCatalogIndex(catalog);
  const groups = loadGroups();
  if (!groups.length) {
    console.error('No vjudge-group-*.json found in vjudge-exports/ or inbox/');
    process.exit(1);
  }

  const problems = new Map<string, IndexProblem>();
  const templates: PlaylistTemplate[] = [];

  for (const { group } of groups) {
    const shortName = group.shortName || 'unknown';
    const groupTitle = group.title ? decodeEntities(String(group.title)) : null;

    for (const contest of group.contests || []) {
      const contestId = String(contest.contestId ?? '');
      if (!contestId) continue;
      const contestTitle = contest.title ? decodeEntities(String(contest.title)) : `Contest ${contestId}`;
      const entries: PlaylistTemplateEntry[] = [];

      for (const pr of contest.problems || []) {
        const oj = pr.oj != null ? String(pr.oj) : null;
        const probNum = pr.probNum != null && String(pr.probNum).trim() !== '' ? String(pr.probNum) : null;
        const title = (pr.title || '').trim() || `${oj || 'Problem'}-${probNum || pr.letter || '?'}`;
        const key = vjudgeKey(oj, probNum);
        const mapKey = key || `custom:${shortName}:${contestId}:${pr.letter || ''}:${title}`;
        const proposed = propose(oj, probNum, title);
        const catalogId = resolveCatalogId(catIndex, oj, probNum, proposed.id);
        const status: PlaylistTemplateEntry['status'] = !key
          ? 'custom'
          : catalogId
            ? 'in_catalog'
            : 'pending';

        const entry: PlaylistTemplateEntry = {
          letter: String(pr.letter || ''),
          title,
          vjudgeKey: key,
          originUrl: pr.originUrl || (key ? `https://vjudge.net/problem/${key}` : null),
          proposedId: proposed.id,
          proposedSource: proposed.source,
          proposedUrl: proposed.url,
          catalogId,
          status,
        };
        entries.push(entry);

        const existing = problems.get(mapKey);
        const appearance = {
          group: shortName,
          contestId,
          contestTitle,
          letter: entry.letter,
        };
        if (existing) {
          existing.appearsIn.push(appearance);
          if (!existing.catalogId && catalogId) existing.catalogId = catalogId;
          if (existing.status !== 'in_catalog' && status === 'in_catalog') existing.status = 'in_catalog';
        } else {
          problems.set(mapKey, {
            vjudgeKey: key,
            oj,
            probNum,
            title,
            originUrl: entry.originUrl,
            proposedId: proposed.id,
            proposedSource: proposed.source,
            proposedUrl: proposed.url,
            catalogId,
            status,
            appearsIn: [appearance],
          });
        }
      }

      templates.push({
        id: `vj-${contestId}`,
        name: `${groupTitle || shortName} · ${contestTitle}`,
        description: `VJudge contest ${contestId} (${shortName})`,
        groupShortName: shortName,
        groupTitle,
        contestId,
        contestUrl: contest.contestUrl || `https://vjudge.net/contest/${contestId}`,
        entries,
      });
    }
  }

  templates.sort((a, b) => a.name.localeCompare(b.name));
  const problemList = [...problems.values()].sort((a, b) =>
    (a.vjudgeKey || a.proposedId).localeCompare(b.vjudgeKey || b.proposedId),
  );

  const summary = {
    catalogSize: catalog.length,
    groups: groups.map((g) => g.group.shortName),
    contests: templates.length,
    uniqueProblems: problemList.length,
    inCatalog: problemList.filter((p) => p.status === 'in_catalog').length,
    pending: problemList.filter((p) => p.status === 'pending').length,
    custom: problemList.filter((p) => p.status === 'custom').length,
    byOj: problemList.reduce<Record<string, number>>((acc, p) => {
      const k = p.oj || 'custom';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {}),
  };

  const indexPayload = {
    generatedAt: new Date().toISOString(),
    summary,
    problems: problemList,
    templates,
  };

  const exportDir = resolve('scripts/ingest/vjudge-exports');
  mkdirSync(exportDir, { recursive: true });
  mkdirSync(resolve('data/playlist-templates'), { recursive: true });

  const indexPath = join(exportDir, 'vjudge-index.json');
  writeFileSync(indexPath, `${JSON.stringify(indexPayload, null, 2)}\n`);

  const templatesPath = resolve('data/playlist-templates/ufv.json');
  writeFileSync(
    templatesPath,
    `${JSON.stringify(
      {
        generatedAt: indexPayload.generatedAt,
        summary,
        templates,
      },
      null,
      2,
    )}\n`,
  );

  console.log('Indexed VJudge exports');
  console.log(`  groups:          ${summary.groups.join(', ')}`);
  console.log(`  contests:        ${summary.contests}`);
  console.log(`  unique problems: ${summary.uniqueProblems}`);
  console.log(`  already in Koda: ${summary.inCatalog}`);
  console.log(`  pending ingest:  ${summary.pending}`);
  console.log(`  custom (no OJ#): ${summary.custom}`);
  console.log(`  wrote ${indexPath}`);
  console.log(`  wrote ${templatesPath}`);
  console.log('Next: import UFV templates in the Playlists screen (matched problems only until you ingest the rest).');
}

main();
