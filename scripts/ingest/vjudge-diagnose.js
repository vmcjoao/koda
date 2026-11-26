/**
 * Paste on a VJudge group or contest page if an exporter returns 0 items.
 * Copy from this file in the editor — not from chat.
 */
(() => {
  const ta = document.querySelector('textarea[name="dataJson"]');
  let dataJsonKeys = null;
  let contestIdSample = [];
  if (ta && ta.value) {
    try {
      const data = JSON.parse(ta.value);
      dataJsonKeys = Object.keys(data).slice(0, 40);
      const raw = ta.value;
      const re = /"contestId"\s*:\s*(\d+)|"id"\s*:\s*(\d+)/g;
      let m;
      const seen = {};
      while ((m = re.exec(raw)) && contestIdSample.length < 12) {
        const id = m[1] || m[2];
        if (!seen[id]) {
          seen[id] = true;
          contestIdSample.push(id);
        }
      }
    } catch (e) {
      dataJsonKeys = ['PARSE_ERROR: ' + e.message];
    }
  }
  const info = {
    path: location.pathname,
    isGroup: /\/group\//i.test(location.pathname),
    isContest: /\/contest\//i.test(location.pathname),
    hasDataJson: !!ta,
    dataJsonLength: ta && ta.value ? ta.value.length : 0,
    dataJsonKeys: dataJsonKeys,
    contestIdSample: contestIdSample,
    contestLinks: document.querySelectorAll('a[href*="/contest/"]').length,
    tableRows: document.querySelectorAll('#contest-problems tbody tr').length,
    descKeyLinks: document.querySelectorAll('a[href*="descKey"]').length,
    titleLinks: document.querySelectorAll('.prob-title a').length,
  };
  console.log(info);
  return info;
})();
