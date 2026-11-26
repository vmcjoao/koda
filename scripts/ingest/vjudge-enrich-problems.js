/**
 * Enrich a VJudge group export with statement HTML from each unique problem page.
 *
 * How to use (while logged in on vjudge.net):
 * 1. Open any vjudge.net tab
 * 2. In console, set the export (paste the group JSON):
 *      window.__VJ_EXPORT__ = { ...paste group file... };
 *    Or load from a previous group-exporter run still in memory.
 * 3. Copy this IIFE from the editor (not chat) and paste into the console
 * 4. Wait — downloads vjudge-enriched-<shortName>.json
 *
 * Optional:
 *   window.__VJ_MAX_PROBLEMS = 5;  // dry run
 */
(() => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function parseDataJsonFromHtml(html) {
    const m = html.match(/<textarea[^>]*name=["']dataJson["'][^>]*>([\s\S]*?)<\/textarea>/i);
    if (!m) return null;
    try {
      const ta = document.createElement('textarea');
      ta.innerHTML = m[1];
      return JSON.parse(ta.value);
    } catch (e) {
      try {
        return JSON.parse(
          m[1]
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>'),
        );
      } catch (e2) {
        return null;
      }
    }
  }

  function uniqueProblems(exportData) {
    const map = {};
    const contests = (exportData && exportData.contests) || [];
    contests.forEach((c) => {
      (c.problems || []).forEach((p) => {
        if (!p || !p.oj || p.probNum == null || String(p.probNum).trim() === '') return;
        const key = p.oj + '-' + p.probNum;
        if (map[key]) return;
        map[key] = {
          oj: p.oj,
          probNum: String(p.probNum),
          title: p.title || null,
          originUrl: p.originUrl || 'https://vjudge.net/problem/' + key,
          letter: p.letter || null,
        };
      });
    });
    return Object.keys(map).map((k) => map[k]);
  }

  function parseDescPage(html) {
    const m = html.match(/<textarea class="data-json-container"[^>]*>([\s\S]*?)<\/textarea>/i);
    if (!m) return null;
    try {
      const ta = document.createElement('textarea');
      ta.innerHTML = m[1];
      return JSON.parse(ta.value);
    } catch (e) {
      try {
        return JSON.parse(
          m[1]
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>'),
        );
      } catch (e2) {
        return null;
      }
    }
  }

  async function fetchDescription(descKey, version) {
    if (!descKey) return null;
    let url = 'https://vjudge.net/problem/description/' + encodeURIComponent(descKey);
    if (version != null && version !== '') url += '?' + version;
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) return null;
    const html = await res.text();
    return parseDescPage(html);
  }

  function sectionContent(s) {
    if (!s) return { title: null, format: null, content: '' };
    const value = s.value;
    if (value && typeof value === 'object') {
      return {
        title: s.title || s.name || null,
        format: value.format || null,
        content: value.content || '',
      };
    }
    return { title: s.title || s.name || null, format: null, content: String(value || s.content || '') };
  }

  function pickDescBrief(data) {
    const briefs = (data && data.descBriefs) || [];
    if (!Array.isArray(briefs) || !briefs.length) return null;
    const en = briefs.find((b) => b && /en/i.test(String(b.language || b.lang || '')));
    return en || briefs[0];
  }

  function downloadJson(filename, text) {
    const blob = new Blob([text], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  async function enrichOne(meta) {
    const url = meta.originUrl;
    const res = await fetch(url, { credentials: 'include', redirect: 'follow' });
    if (!res.ok) {
      return { ...meta, error: 'HTTP ' + res.status };
    }
    const html = await res.text();
    const data = parseDataJsonFromHtml(html);
    if (!data) {
      return { ...meta, error: 'no dataJson on problem page' };
    }
    const brief = pickDescBrief(data);
    const descKey = brief && (brief.key || brief.descKey) ? String(brief.key || brief.descKey) : null;
    const version = brief && brief.version != null ? brief.version : null;
    const desc = await fetchDescription(descKey, version);
    const sections = desc && Array.isArray(desc.sections) ? desc.sections.map(sectionContent) : [];
    return {
      ...meta,
      vjudgeTitle: data.title || meta.title,
      timeLimit: data.timeLimit || null,
      memoryLimit: data.memoryLimit || null,
      descKey: descKey,
      descVersion: version,
      sections: sections,
    };
  }

  async function run() {
    const exportData = window.__VJ_EXPORT__;
    if (!exportData || !exportData.contests) {
      console.warn('Set window.__VJ_EXPORT__ to a group export JSON first, then re-run.');
      return null;
    }
    let list = uniqueProblems(exportData);
    const max = typeof window.__VJ_MAX_PROBLEMS === 'number' ? window.__VJ_MAX_PROBLEMS : list.length;
    list = list.slice(0, max);
    console.log('Enriching ' + list.length + ' unique problem(s)…');

    const problems = [];
    for (let i = 0; i < list.length; i++) {
      const meta = list[i];
      console.log('[' + (i + 1) + '/' + list.length + '] ' + meta.oj + '-' + meta.probNum);
      try {
        const row = await enrichOne(meta);
        problems.push(row);
        console.log('  → sections=' + ((row.sections && row.sections.length) || 0) + (row.error ? ' ' + row.error : ''));
      } catch (e) {
        problems.push({ ...meta, error: String(e && e.message ? e.message : e) });
        console.warn('  → failed', e);
      }
      await sleep(400);
    }

    const payload = {
      sourceGroup: exportData.shortName || null,
      groupUrl: exportData.groupUrl || null,
      enrichedAt: new Date().toISOString(),
      problems: problems,
    };
    const text = JSON.stringify(payload, null, 2);
    const filename = 'vjudge-enriched-' + (exportData.shortName || 'problems') + '.json';
    downloadJson(filename, text);
    if (typeof copy === 'function') copy(text);
    console.log('Done — downloaded ' + filename);
    console.log(payload);
    return payload;
  }

  return run();
})();
