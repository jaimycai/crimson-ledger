// Leest de anonieme tellers uit en rekent retentie uit.
//   node store/meting.js [dagen]
//   node store/meting.js feedback [dagen]   de berichten uit Instellingen → "Wat kan beter?" (sinds 1.3.1)
// De sleutel staat in ~/.crimson/stats-key (niet in de repo).
const fs = require('fs');
const key = fs.readFileSync(process.env.HOME + '/.crimson/stats-key', 'utf8').trim();
const feedback = process.argv[2] === 'feedback';
const days = Number(process.argv[feedback ? 3 : 2]) || 30;
(async () => {
  if (feedback) {
    const res = await fetch(`https://crimson-meting.spaarplan-data.workers.dev/feedback?days=${days}`, { headers: { 'x-stats-key': key } });
    if (!res.ok) { console.error('feedback:', res.status); process.exit(1); }
    const rows = await res.json();
    console.log(`Feedback, laatste ${days} dagen: ${rows.length} bericht(en)`);
    for (const r of rows) console.log(`\n${r.day}  ${r.l}  ${r.p}  ${r.v}\n${r.t}`);
    return;
  }
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
  console.log(`Beoordeling gevraagd: ${sum(r => r.e === 'review_asked')}  Gedeeld: ${sum(r => r.e === 'share')}  Herinnering aangezet: ${sum(r => r.e === 'reminder_on')} (${pct(sum(r => r.e === 'reminder_on'))})`);
  // 1.5: where new players stop in the practice case, and which cases they leave unsolved
  const steps = [...new Set(rows.filter(r => r.e === 'tut_step').map(r => r.n))].sort((x, y) => x - y);
  if (steps.length) console.log(`Oefenzaak per stap:             ${steps.map(n => `${n}: ${sum(r => r.e === 'tut_step' && r.n === n)}`).join('  ')}  · overgeslagen ${sum(r => r.e === 'tut_skip')}`);
  // 1.7: the same steps per app version (iOS and Android only), so a change to step 1 (the hand) can be compared with
  // the version before it: the share of players who reached step 1 that also reached step 2, 3 and 4
  const app = r => r.p === 'ios' || r.p === 'android';
  const versions = [...new Set(rows.filter(r => r.e === 'tut_step' && app(r)).map(r => r.v))].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  for (const v of versions) {
    const at = n => sum(r => r.e === 'tut_step' && app(r) && r.v === v && r.n === n), s1 = at(1);
    console.log(`  versie ${v.padEnd(7)} stap 1-4: ${[1, 2, 3, 4].map(at).join(' / ')}` + (s1 ? `  (${[2, 3, 4].map(n => `${n}: ${Math.round(100 * at(n) / s1)}%`).join(', ')} van stap 1)` : '') +
      `  · overgeslagen ${sum(r => r.e === 'tut_skip' && app(r) && r.v === v)}`);
  }
  // 1.7: Van Dam asks about the reminder (a = shown/yes/no) and "Daag een vriend uit" after the daily case
  const ask = a => sum(r => r.e === 'reminder_ask' && r.a === a);
  if (ask('shown')) console.log(`Herinnering gevraagd:           ${ask('shown')} (ja ${ask('yes')}, nu niet ${ask('no')})`);
  const ch = sum(r => r.e === 'share' && r.a === 'challenge'), chDone = sum(r => r.e === 'share_done' && /^challenge/.test(r.a));
  if (ch) console.log(`Vriend uitgedaagd:              ${ch} keer getikt, ${chDone} keer gedeeld · webdagzaak geopend via een uitdaging: ${sum(r => r.e === 'open' && r.p === 'webdaily' && r.a === 'challenge')}`);
  const quits = rows.filter(r => r.e === 'quit').reduce((m, r) => (m[`${r.a}${r.n ? ' ' + r.n : ''}`] = (m[`${r.a}${r.n ? ' ' + r.n : ''}`] || 0) + r.c, m), {});
  if (Object.keys(quits).length) console.log(`Verlaten zonder oplossing:      ${Object.entries(quits).sort((x, y) => y[1] - x[1]).slice(0, 8).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
  console.log(`Hints verdiend (★★★): ${sum(r => r.e === 'hint_earned')}  Gratis hint bij vastlopen: ${sum(r => r.e === 'stuck_hint')}  Webdagzaak → App Store: ${sum(r => r.e === 'cta')}`);
  const by = k => Object.entries(rows.filter(r => r.e === 'open').reduce((m, r) => (m[r[k]] = (m[r[k]] || 0) + r.c, m), {})).map(([a, b]) => `${a} ${b}`).join(', ');
  console.log(`Opens per platform: ${by('p') || '-'}   per taal: ${by('l') || '-'}`);
})();
