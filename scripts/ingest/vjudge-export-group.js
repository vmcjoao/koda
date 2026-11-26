/**
 * VJudge group exporter — run in DevTools Console on a group page.
 *
 * How to use:
 * 1. Open https://vjudge.net/group/<shortName> while logged in
 * 2. Copy this entire IIFE (from (() => { to })();) from the editor — not from chat
 * 3. Paste into the browser console and press Enter
 * 4. Wait for "Done: N contests…" — JSON downloads + clipboard
 * 5. Save under scripts/ingest/inbox/vjudge-group-<shortName>.json
 *
 * Optional: limit contests first —
 *   window.__VJ_MAX_CONTESTS = 5;
 * then paste this script.
 */
(() => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function parseDataJsonFromHtml(html) {
    const m = html.match(/<textarea[^>]*name=["']dataJson["'][^>]*>([\s\S]*?)<\/textarea>/i);
    if (!m) return null;
    const raw = m[1]
      .replace(/&quot;/g, '"')
      .replace(/&#34;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'");
    try {
      return JSON.parse(raw);
    } catch (e) {
      try {
        const ta = document.createElement('textarea');
        ta.innerHTML = m[1];
        return JSON.parse(ta.value);
      } catch (e2) {
        return null;
      }
    }
  }

  function problemsFromData(data) {
    const list = (data && data.problems) || [];
    return list.map((p) => {
      const props = Array.isArray(p.properties) ? p.properties : [];
      let descKey = null;
      for (const x of props) {
        if (!x || typeof x !== 'object') continue;
        if (x.title === 'Description' && x.content) {
          descKey = x.content;
          break;
        }
        if (x.descKey) {
          descKey = x.descKey;
          break;
        }
      }
      return {
        letter: p.num,
        title: p.title,
        oj: p.oj,
        probNum: p.probNum,
        originUrl: p.oj && p.probNum ? 'https://vjudge.net/problem/' + p.oj + '-' + p.probNum : null,
        descKey: descKey,
      };
    });
  }

  function problemsFromDomDoc(doc) {
    const problems = [];
    const rows = doc.querySelectorAll('#contest-problems tbody tr');
    rows.forEach((tr) => {
      const a = tr.querySelector('.prob-title a') || tr.querySelector('a[href*="contest"]');
      const pdf = tr.querySelector('a[href*="descKey"]');
      const href = a ? a.getAttribute('href') || '' : '';
      const letterMatch = href.match(/[#/]([A-Za-z0-9]+)(?:\?|$)/);
      let descKey = null;
      if (pdf && pdf.getAttribute('href')) {
        const m = pdf.getAttribute('href').match(/descKey=([^&]+)/);
        if (m) descKey = m[1];
      }
      problems.push({
        letter: letterMatch ? letterMatch[1] : '',
        title: (a && a.textContent ? a.textContent : '').trim(),
        oj: null,
        probNum: null,
        originUrl: null,
        descKey: descKey,
      });
    });
    return problems;
  }

  function contestIdsFromGroupData(data) {
    const ids = [];
    const seen = {};
    function pushId(id) {
      if (id == null) return;
      const s = String(id);
      if (!/^\d+$/.test(s) || seen[s]) return;
      seen[s] = true;
      ids.push(s);
    }
    function walk(node, depth) {
      if (!node || depth > 6) return;
      if (Array.isArray(node)) {
        node.forEach((x) => walk(x, depth + 1));
        return;
      }
      if (typeof node !== 'object') return;
      if (node.contestId != null) pushId(node.contestId);
      if (node.summaryContestId != null) pushId(node.summaryContestId);
      if (node.id != null && (node.title || node.contestTitle || node.name) &&
          (node.problems || node.begin || node.end || node.length || node.type != null)) {
        pushId(node.id);
      }
      const keys = Object.keys(node);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (/contest/i.test(k)) walk(node[k], depth + 1);
      }
      ['contests', 'contestList', 'groupContests', 'scheduledContests', 'runningContests', 'endedContests', 'data']
        .forEach((k) => {
          if (node[k]) walk(node[k], depth + 1);
        });
    }
    walk(data, 0);
    return ids;
  }

  function contestIdsFromDom() {
    const ids = [];
    const seen = {};
    document.querySelectorAll('a[href*="/contest/"]').forEach((a) => {
      const href = a.getAttribute('href') || '';
      const m = href.match(/\/contest\/(\d+)/);
      if (!m || seen[m[1]]) return;
      seen[m[1]] = true;
      ids.push(m[1]);
    });
    return ids;
  }

  function groupMeta() {
    const parts = location.pathname.split('/').filter(Boolean);
    const shortName = parts[0] === 'group' && parts[1] ? parts[1] : parts[parts.length - 1];
    let groupId = null;
    let title = null;
    const ta = document.querySelector('textarea[name="dataJson"]');
    if (ta && ta.value) {
      try {
        const data = JSON.parse(ta.value);
        groupId = data.id || data.groupId || (data.group && data.group.id) || null;
        title = data.name || data.title || (data.group && (data.group.name || data.group.title)) || null;
      } catch (e) {}
    }
    return { shortName: shortName, groupId: groupId, title: title };
  }

  async function fetchContest(contestId) {
    const url = 'https://vjudge.net/contest/' + contestId;
    const res = await fetch(url, { credentials: 'include', redirect: 'follow' });
    if (!res.ok) {
      return {
        contestId: contestId,
        contestUrl: url,
        title: null,
        error: 'HTTP ' + res.status,
        problems: [],
      };
    }
    const html = await res.text();
    const data = parseDataJsonFromHtml(html);
    let problems = [];
    let title = null;
    if (data) {
      problems = problemsFromData(data);
      title = data.title || data.name || null;
    }
    if (!problems.length) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      problems = problemsFromDomDoc(doc);
      if (!title) {
        const h = doc.querySelector('#time-info h3, h3');
        if (h) title = (h.textContent || '').trim();
      }
    }
    return {
      contestId: contestId,
      contestUrl: url,
      title: title,
      problems: problems,
    };
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

  async function run() {
    if (!/\/group\//i.test(location.pathname)) {
      console.warn('Open a group page first: https://vjudge.net/group/<shortName>');
    }

    const meta = groupMeta();
    let ids = [];
    const ta = document.querySelector('textarea[name="dataJson"]');
    if (ta && ta.value) {
      try {
        ids = contestIdsFromGroupData(JSON.parse(ta.value));
      } catch (e) {
        console.warn('Could not parse group dataJson', e);
      }
    }
    if (!ids.length) ids = contestIdsFromDom();

    const max = typeof window.__VJ_MAX_CONTESTS === 'number' ? window.__VJ_MAX_CONTESTS : ids.length;
    ids = ids.slice(0, max);

    console.log('Found ' + ids.length + ' contest(s) in group ' + meta.shortName);
    if (!ids.length) {
      console.warn('No contest IDs found. Scroll the contests list into view and retry, or run vjudge-diagnose.js');
      return { contests: [] };
    }

    const contests = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      console.log('[' + (i + 1) + '/' + ids.length + '] fetching contest ' + id + '…');
      try {
        const c = await fetchContest(id);
        contests.push(c);
        console.log('  → ' + (c.problems || []).length + ' problems' + (c.error ? ' (' + c.error + ')' : ''));
      } catch (e) {
        contests.push({
          contestId: id,
          contestUrl: 'https://vjudge.net/contest/' + id,
          title: null,
          error: String(e && e.message ? e.message : e),
          problems: [],
        });
        console.warn('  → failed', e);
      }
      await sleep(350);
    }

    const payload = {
      groupUrl: location.href,
      shortName: meta.shortName,
      groupId: meta.groupId,
      title: meta.title,
      exportedAt: new Date().toISOString(),
      contests: contests,
    };
    const text = JSON.stringify(payload, null, 2);
    const filename = 'vjudge-group-' + meta.shortName + '.json';
    downloadJson(filename, text);

    if (typeof copy === 'function') copy(text);
    else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () {});
    }

    const totalProblems = contests.reduce((n, c) => n + ((c.problems && c.problems.length) || 0), 0);
    console.log('Done: ' + contests.length + ' contests, ' + totalProblems + ' problems → downloaded ' + filename);
    console.log(payload);
    return payload;
  }

  return run();
})();
