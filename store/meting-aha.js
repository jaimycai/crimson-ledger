// Aha-analyse (docs/onderzoek/AHA-2026-11.md): which day-0 behaviour goes with coming back, as far as the anonymous
// counters allow. iOS only. Cohorts per install day, how far players get (solved n=k), correlation over cohort days
// with a bootstrap interval, and the split by app version and language. No player id exists, so all of this is indirect.
//   node store/meting-aha.js [dagen]        default 365; the key is read from ~/.crimson/stats-key and never printed
const fs = require('fs');
const key = fs.readFileSync(process.env.HOME + '/.crimson/stats-key', 'utf8').trim();
const DAYS = Number(process.argv[2]) || 365;
(async () => {
const res = await fetch(`https://crimson-meting.spaarplan-data.workers.dev/stats?days=${DAYS}`, { headers: { 'x-stats-key': key } });
if (!res.ok) { console.error('stats:', res.status); process.exit(1); }
const rows = await res.json();
const ios = rows.filter(r => r.p === 'ios');
const days = [...new Set(rows.map(r => r.day))].sort();
const sum = (f, rs = ios) => rs.filter(f).reduce((t, r) => t + r.c, 0);
const addDays = (d, k) => new Date(Date.parse(d) + k * 864e5).toISOString().slice(0, 10);
const last = days[days.length - 1];
console.log('days', days[0], '…', last, days.length);
// versions seen per event, to know which counters exist when
const ver = {}; for (const r of ios) (ver[r.e] = ver[r.e] || new Set()).add(r.v);
for (const [e, s] of Object.entries(ver)) console.log('  ', e.padEnd(14), [...s].sort().join(' '));
// 1. cohorts per install day (iOS)
const coh = days.map(d => {
  const inst = sum(r => r.e === 'open' && r.n === 0 && r.day === d);
  const back = k => addDays(d, k) <= last ? sum(r => r.e === 'open' && r.n === k && r.day === addDays(d, k)) : null;
  const ev = (e, f = () => true) => sum(r => r.e === e && r.day === d && f(r));
  return { d, inst, d1: back(1), d3: back(3), d7: back(7), tut: ev('tutorial_done'), s1: ev('solved', r => r.n === 1), s3: ev('solved', r => r.n === 3),
    s5: ev('solved', r => r.n === 5), s10: ev('solved', r => r.n === 10), rem: ev('reminder_on'), share: ev('share'), hint: ev('hint'), store: ev('store_open') };
});
console.log('\nday        inst d1 d3 d7 | tut s1 s3 s5 s10 rem share');
for (const c of coh) console.log(c.d, String(c.inst).padStart(4), String(c.d1 ?? '-').padStart(2), String(c.d3 ?? '-').padStart(2), String(c.d7 ?? '-').padStart(2), '|', [c.tut, c.s1, c.s3, c.s5, c.s10, c.rem, c.share].map(x => String(x).padStart(3)).join(' '));
const tot = k => coh.reduce((t, c) => t + (c[k] || 0), 0);
const instWith = k => coh.filter(c => c[k] !== null).reduce((t, c) => t + c.inst, 0);
console.log('\ntotals iOS: installs', tot('inst'), '| D1', tot('d1'), `(${(100 * tot('d1') / instWith('d1')).toFixed(1)}% of ${instWith('d1')})`, '| D3', tot('d3'), `(${(100 * tot('d3') / instWith('d3')).toFixed(1)}% of ${instWith('d3')})`, '| D7', tot('d7'), `(${(100 * tot('d7') / instWith('d7')).toFixed(1)}% of ${instWith('d7')})`);
// 2. reach ladder: share of installs that ever solved case k (any day)
const inst = tot('inst');
const ladder = [1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 50].map(k => [k, sum(r => r.e === 'solved' && r.n === k)]);
console.log('reach ladder (solved n=k, iOS, any day):', ladder.map(([k, v]) => `${k}:${v} (${(100 * v / inst).toFixed(0)}%)`).join('  '));
console.log('tutorial_done', sum(r => r.e === 'tutorial_done'), 'reminder_on', sum(r => r.e === 'reminder_on'), 'share', sum(r => r.e === 'share'), 'review_asked', sum(r => r.e === 'review_asked'));
// open n distribution (how many active days per days-since-install)
const opens = {}; for (const r of ios.filter(r => r.e === 'open')) opens[r.n] = (opens[r.n] || 0) + r.c;
console.log('open by days-since-first-start:', Object.entries(opens).sort((a, b) => a[0] - b[0]).map(([k, v]) => `${k}:${v}`).join(' '));
// 3. ecological correlation across cohort days with >= 3 installs and a known D1
const pear = (xs, ys) => { const n = xs.length, mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
  let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; } return sxy / Math.sqrt(sxx * syy); };
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const boot = (cs, fx, fy) => { const out = []; for (let b = 0; b < 4000; b++) { const s = cs.map(() => cs[Math.floor(rnd() * cs.length)]); const xs = s.map(fx), ys = s.map(fy); const r = pear(xs, ys); if (!isNaN(r)) out.push(r); } out.sort((a, b) => a - b); return [out[Math.floor(.025 * out.length)], out[Math.floor(.975 * out.length)]]; };
for (const [lab, key] of [['D1', 'd1'], ['D3', 'd3']]) {
  const cs = coh.filter(c => c.inst >= 3 && c[key] !== null);
  for (const [xl, fx] of [['tutorial_done/inst', c => c.tut / c.inst], ['solved#1/inst', c => c.s1 / c.inst], ['solved#3/inst', c => c.s3 / c.inst], ['solved#5/inst', c => c.s5 / c.inst]]) {
    const fy = c => c[key] / c.inst; const r = pear(cs.map(fx), cs.map(fy)); const [lo, hi] = boot(cs, fx, fy);
    console.log(`${lab} vs ${xl.padEnd(20)} n=${cs.length} cohort-days  r=${r.toFixed(2)}  95% CI [${lo.toFixed(2)}, ${hi.toFixed(2)}]`);
  }
}
// 4. per-version split: did the day-0 depth and D1 move together between app versions?
const byV = {}; for (const r of ios) { const v = r.v; byV[v] = byV[v] || { inst: 0, d1: 0, s1: 0, s3: 0, tut: 0 };
  if (r.e === 'open' && r.n === 0) byV[v].inst += r.c; if (r.e === 'open' && r.n === 1) byV[v].d1 += r.c; if (r.e === 'solved' && r.n === 1) byV[v].s1 += r.c; if (r.e === 'solved' && r.n === 3) byV[v].s3 += r.c; if (r.e === 'tutorial_done') byV[v].tut += r.c; }
console.log('\nper version (iOS):'); for (const [v, x] of Object.entries(byV).sort()) console.log('  ', v.padEnd(8), JSON.stringify(x));
// 5. per language (segments with >= 10 installs)
const byL = {}; for (const r of ios) { const l = r.l; byL[l] = byL[l] || { inst: 0, d1: 0, s3: 0 };
  if (r.e === 'open' && r.n === 0) byL[l].inst += r.c; if (r.e === 'open' && r.n === 1) byL[l].d1 += r.c; if (r.e === 'solved' && r.n === 3) byL[l].s3 += r.c; }
const segs = Object.entries(byL).filter(([, x]) => x.inst >= 8);
console.log('per language (>=8 installs):', segs.map(([l, x]) => `${l} inst ${x.inst} case3 ${(100 * x.s3 / x.inst).toFixed(0)}% D1 ${(100 * x.d1 / x.inst).toFixed(0)}%`).join(' | '));
if (segs.length > 3) console.log('  r(case3 reach, D1) across languages =', pear(segs.map(([, x]) => x.s3 / x.inst), segs.map(([, x]) => x.d1 / x.inst)).toFixed(2), 'n =', segs.length);
// 6. era (the version label stayed at 1.1.3 until 1.3.1) x English or not: day-0 depth next to D1
const era = v => v.startsWith('1.4') ? '1.4.x' : (v.startsWith('1.1') || v === '1.3.1') ? '1.1-1.3' : v;
const g = {}; for (const r of ios) { const k = `${era(r.v)} ${r.l === 'en' ? 'en' : 'other'}`; const x = g[k] = g[k] || { inst: 0, d1: 0, tut: 0, s1: 0, s3: 0 };
  if (r.e === 'open' && r.n === 0) x.inst += r.c; if (r.e === 'open' && r.n === 1) x.d1 += r.c; if (r.e === 'tutorial_done') x.tut += r.c;
  if (r.e === 'solved' && r.n === 1) x.s1 += r.c; if (r.e === 'solved' && r.n === 3) x.s3 += r.c; }
const p = (a, b) => b ? `${(100 * a / b).toFixed(0)}%` : '-';
console.log('\nera x language:'); for (const [k, x] of Object.entries(g).sort()) console.log('  ', k.padEnd(14), 'inst', x.inst, 'tutorial', p(x.tut, x.inst), 'case1', p(x.s1, x.inst), 'case3', p(x.s3, x.inst), 'D1', p(x.d1, x.inst));
})();
