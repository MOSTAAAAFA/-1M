// Audits every media URL referenced in src/data/cars.js with a real ranged GET.
// Classifies OK / SOFT (2xx but not media) / DEAD / FORBIDDEN / TIMEOUT.
// Run: node scripts/audit-images.mjs
import { readFileSync } from 'node:fs';

const src = readFileSync('src/data/cars.js', 'utf8');

// every quoted http(s) literal, whatever the field
const urls = new Map(); // url -> [{field, line}]
const lit = /(['"])(https?:\/\/[^'"]*)\1/g;
const fieldRe = /([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(['"])(https?:\/\/[^'"]*)\2/g;

let m;
while ((m = lit.exec(src))) {
  const before = src.slice(0, m.index);
  const line = before.split(/\r?\n/).length;
  const km = /([A-Za-z_][A-Za-z0-9_]*)\s*:\s*$/.exec(before);
  const field = km ? km[1] : '(array/other)';
  const ctrl = [...m[2]].filter((c) => c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127);
  const rec = { field, line, ctrl };
  if (!urls.has(m[2])) urls.set(m[2], []);
  urls.get(m[2]).push(rec);
}

console.log(`${urls.size} unique media URLs\n`);

console.log('--- control characters inside URL literals (always fatal) ---');
let ctrlCount = 0;
for (const [u, recs] of urls) {
  for (const r of recs) {
    if (r.ctrl.length) {
      ctrlCount++;
      console.log(`  line ${r.line}  ${r.field}`);
      console.log(`    ${r.ctrl.map((c) => '0x' + c.charCodeAt(0).toString(16)).join(',')}`);
      console.log(`    ${JSON.stringify(u)}`);
    }
  }
}
if (!ctrlCount) console.log('  none');

// wipe control chars before probing so we test the intended URL
const clean = (u) => [...u].filter((c) => c.charCodeAt(0) >= 32 && c.charCodeAt(0) !== 127).join('');

const hostOf = (u) => { try { return new URL(u).host; } catch { return '(malformed)'; } };

const results = [];
let done = 0;
await Promise.all(
  [...urls.keys()].map(async (raw) => {
    const u = clean(raw);
    const host = hostOf(u);
    const base = { raw, u, host };
    try {
      const res = await fetch(u, {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(15000),
        headers: {
          Range: 'bytes=0-4095',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
          Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
        },
      });
      const ct = (res.headers.get('content-type') || '').split(';')[0].trim();
      const isMedia = /^(image|video)\//.test(ct);
      let verdict;
      if (!res.ok) verdict = res.status === 404 || res.status === 410 ? 'DEAD' : res.status === 401 || res.status === 403 ? 'FORBIDDEN' : `HTTP_${res.status}`;
      // A 2xx with a non-image content-type is what Opaque Response Blocking
      // rejects in a real browser, even though Node's fetch calls it a success.
      else if (!isMedia) verdict = 'SOFT';
      else verdict = 'OK';
      // a media body that is really HTML is a soft failure
      if (verdict === 'OK' && /text\/html/i.test(ct)) verdict = 'SOFT';
      results.push({ ...base, status: res.status, ct, verdict, bytes: res.headers.get('content-length') });
    } catch (e) {
      results.push({ ...base, status: 0, ct: '', verdict: 'ERROR', err: e.name || String(e.message).slice(0, 60) });
    }
    if (++done % 20 === 0) process.stdout.write(`  ...${done}/${urls.size}\n`);
  })
);

const order = ['DEAD', 'FORBIDDEN', 'SOFT', 'ERROR'];
const tally = {};
for (const r of results) tally[r.verdict] = (tally[r.verdict] || 0) + 1;
console.log('\n--- verdict tally ---');
console.log(`  OK         ${tally.OK || 0}`);
for (const v of order) if (tally[v]) console.log(`  ${v.padEnd(10)} ${tally[v]}`);

const bad = results.filter((r) => r.verdict !== 'OK');
if (bad.length) {
  console.log(`\n--- problems grouped by host (${bad.length}) ---`);
  const byHost = new Map();
  for (const r of bad) {
    if (!byHost.has(r.host)) byHost.set(r.host, []);
    byHost.get(r.host).push(r);
  }
  for (const [h, list] of [...byHost].sort((a, b) => b[1].length - a[1].length)) {
    const kinds = [...new Set(list.map((r) => r.verdict))].join(',');
    console.log(`\n  ${h}  (${list.length} url(s): ${kinds})`);
    for (const r of list.slice(0, 4)) {
      const fields = (urls.get(r.raw) || []).map((x) => `${x.field}@L${x.line}`).join(' ');
      console.log(`    [${r.status || r.err}] ${r.ct || '-'}  ${fields}`);
      console.log(`      ${r.u.slice(0, 130)}`);
    }
    if (list.length > 4) console.log(`    ... +${list.length - 4} more`);
  }
} else {
  console.log('\nAll referenced media URLs return real image/video bytes.');
}