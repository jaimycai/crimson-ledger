// Writes every generated sentence for a fixed set of cases to a JSON file, per language:
// clue texts, statements, the case text, Van Dam's explanation per clue and the hints for a few board states.
//   node tests/grammar-snapshot.js <out.json> [nl|en|…]
// Used to compare the sentence output before and after a change in the sentence engine.
const fs = require('fs'), path = require('path');
function loadJsdom() { try { return require('jsdom'); } catch (e) {} return require('/Users/jaimycai/Documents/Claude/CrimsonLedger/app/node_modules/jsdom'); }
const { JSDOM, VirtualConsole } = loadJsdom();
const DIR = path.join(__dirname, '..');
const [out, ...langs] = process.argv.slice(2);

async function run(lang) {
  let html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => `<script>${fs.readFileSync(path.join(DIR, src), 'utf8')}</script>`);
  const pack = path.join(DIR, 'i18n', lang + '.js');
  const packJs = fs.existsSync(pack) ? `<script>${fs.readFileSync(pack, 'utf8')}</script>` : '';
  html = html.replace('<head>', () => `<head><script>localStorage.setItem("crimson-lang", "${lang}");</script>${packJs}`).replace(/<link[^>]+>/g, '')
    .replace('</body>', '<script>window.FloorPlan = FloorPlan; window.Themes = Themes; window.Mentor = Mentor; window.Board = Board;</script></body>');
  const errors = [];
  const vc = new VirtualConsole(); vc.on('jsdomError', e => errors.push(String(e.message || e)));
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost:8080/', virtualConsole: vc });
  await new Promise(r => setTimeout(r, 80));
  const { FloorPlan, Themes, Mentor, Board } = dom.window;
  const res = { cases: [], errors };
  for (const theme of Themes.list()) for (const diff of ['makkelijk', 'gemiddeld', 'moeilijk']) for (let seed = 1; seed <= 6; seed++) {
    const p = FloorPlan.generate(seed * 7919 + diff.length, diff, theme);
    if (!p) continue;
    const c = { theme: theme.id, diff, seed, caseText: p.caseText, clues: p.clueTexts,
      statements: p.clues.map(cl => FloorPlan.statement(cl, p)), explain: p.clues.map(cl => Mentor.explain(cl, p)), hints: [] };
    // hints: empty board, one suspect misplaced, everyone right
    const empty = p.suspects.map(() => null);
    const wrong = p.solution.map((s, i) => (i === 0 ? { x: (s.x + 1) % p.cols, y: s.y } : s));
    for (const pl of [empty, wrong, p.solution.slice()]) {
      const h = FloorPlan.hint(p, pl);
      c.hints.push({ text: h.text, detail: h.detail, action: Mentor.hintAction(h, p, pl) });
    }
    res.cases.push(c);
  }
  dom.window.close();
  return res;
}
(async () => {
  const all = {};
  for (const lang of (langs.length ? langs : ['nl', 'en'])) all[lang] = await run(lang);
  fs.writeFileSync(out, JSON.stringify(all, null, 1));
  for (const [lang, r] of Object.entries(all)) console.log(lang, r.cases.length, 'cases,', r.errors.length, 'errors', r.errors.slice(0, 3).join(' | '));
})();
