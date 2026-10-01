// Leest de anonieme tellers uit en rekent retentie uit.
//   node store/meting.js [dagen]
// De sleutel staat in ~/.crimson/stats-key (niet in de repo).
const fs = require('fs');
const key = fs.readFileSync(process.env.HOME + '/.crimson/stats-key', 'utf8').trim();
const days = Number(process.argv[2]) || 30;
(async () => {
  const res = await fetch(`https://crimson-meting.spaarplan-data.workers.dev/stats?days=${days}`, { headers: { 'x-stats-key': key } });
  if (!res.ok) { console.error('stats:', res.status); process.exit(1); }
  const rows = await res.json();
  const sum = f => rows.filter(f).reduce((t, r) => t + r.c, 0);
  const installs = sum(r => r.e === 'open' && r.n === 0);
  const back = n => sum(r => r.e === 'open' && r.n === n);
  const pct = x => installs ? `${(100 * x / installs).toFixed(0)}%` : '-';
  console.log(`Laatste ${days} dagen`);
  console.log(`Nieuwe spelers (eerste start):  ${installs}`);
  console.log(`Terug op dag 1 / 3 / 7 / 30:    ${back(1)} (${pct(back(1))}) / ${back(3)} (${pct(back(3))}) / ${back(7)} (${pct(back(7))}) / ${back(30)} (${pct(back(30))})`);
  console.log(`Oefenzaak afgemaakt:            ${sum(r => r.e === 'tutorial_done')} (${pct(sum(r => r.e === 'tutorial_done'))})`);
  console.log(`Zaken gestart / opgelost:       ${sum(r => r.e === 'start')} / ${sum(r => r.e === 'solved')}`);
  for (const n of [1, 3, 5, 10]) console.log(`  spelers die zaak ${n} haalden:     ${sum(r => r.e === 'solved' && r.n === n)} (${pct(sum(r => r.e === 'solved' && r.n === n))})`);
  console.log(`Hints: ${sum(r => r.e === 'hint')}  Winkel geopend: ${sum(r => r.e === 'store_open')}  Aankopen: ${sum(r => r.e === 'purchase' && !r.a.startsWith('gift'))}  Cadeauwerelden: ${sum(r => r.e === 'purchase' && r.a.startsWith('gift'))}`);
  console.log(`Beoordeling gevraagd: ${sum(r => r.e === 'review_asked')}  Gedeeld: ${sum(r => r.e === 'share')}`);
  const by = k => Object.entries(rows.filter(r => r.e === 'open').reduce((m, r) => (m[r[k]] = (m[r[k]] || 0) + r.c, m), {})).map(([a, b]) => `${a} ${b}`).join(', ');
  console.log(`Opens per platform: ${by('p') || '-'}   per taal: ${by('l') || '-'}`);
})();
