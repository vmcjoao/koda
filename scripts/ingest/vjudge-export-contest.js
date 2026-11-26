/**
 * VJudge contest exporter — run in DevTools Console on a contest page.
 *
 * How to use:
 * 1. Open https://vjudge.net/contest/<id> while logged in
 * 2. Open this file in your editor, copy ALL of the IIFE below (from (() => { to })();)
 * 3. Paste into the browser console and press Enter
 * 4. JSON is copied to clipboard; save as scripts/ingest/inbox/vjudge-<id>.json
 *
 * For a whole group (many contests), use vjudge-export-group.js on /group/<shortName> instead.
 */
(() => {
  const ta = document.querySelector('textarea[name="dataJson"]');
  let problems = [];

  if (ta && ta.value) {
    const data = JSON.parse(ta.value);
    problems = (data.problems || []).map((p) => {
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
  } else {
    const rows = document.querySelectorAll('#contest-problems tbody tr');
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
  }

  const parts = location.pathname.split('/').filter(Boolean);
  const contestId = parts[parts.length - 1];
  const payload = { contestId: contestId, contestUrl: location.href, problems: problems };
  const text = JSON.stringify(payload, null, 2);

  function done() {
    console.log('Copied ' + problems.length + ' problems from contest ' + contestId);
    console.log(payload);
  }

  if (typeof copy === 'function') {
    copy(text);
    done();
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(function () {
      console.log(text);
      done();
    });
  } else {
    console.log(text);
    done();
  }

  return payload;
})();
