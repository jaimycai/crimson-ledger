// Bouwt de gratis dagzaak voor het web in docs/play/ (GitHub Pages: https://jaimycai.github.io/crimson-ledger/play/).
// Net als build-www.js alleen kopiëren, geen bundelaar. De pagina speelt de oefenzaak en de dagelijkse zaak van
// vandaag met dezelfde code als de app (board.js, floorplan.js, themes.js, ...), zodat de zaak per datum gelijk is.
//   node build-web-daily.js            → docs/play/
//   node build-web-daily.js /tmp/play  → een andere map (de test bouwt zo in een tijdelijke map)
// Bronnen van de webpagina zelf staan in web-daily/ (sjabloon, besturing, teksten in 20 talen, opmaak).
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'web-daily');
// alleen wat het bord, de oefenzaak en de dagzaak nodig hebben: geen campagne, winkel, kaart, minigame of meldingen
const APP_SCRIPTS = ['avatars.js', 'story.js', 'themes.js', 'progress.js', 'mentor.js', 'meting.js', 'i18n.js', 'grammar.js',
  'icons.js', 'sound.js', 'floorplan.js', 'board.js'];
const APP_FILES = ['style.css', 'icon-192.png', 'icon-512.png'];
const ASSETS = ['fonts', 'portretten', 'vandam.jpg', 'vandam-sketch.jpg'];
const WEB_FILES = ['dagzaak.js', 'dagzaak.css', 'teksten.js'];
// stukken uit index.html die de pagina letterlijk overneemt, zodat het bord gelijk blijft aan de app
const BOARD_PARTS = ['screen-board'];
const MODAL_PARTS = ['hint-modal', 'clue-modal', 'newclue-modal', 'toast'];

const hash = file => crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 8);

// De rekenregels van de dagzaak komen woordelijk uit de app (App.getDailySeed, App.getDayNumber, Campaign.starsFor),
// zodat web en app nooit uit elkaar lopen. app.js draait hier in een lege omgeving; alleen de functies worden gelezen.
function sharedLogic() {
  const ctx = { document: { addEventListener() {} }, setTimeout, clearTimeout, console };
  ctx.globalThis = ctx; ctx.window = ctx;
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8') + '\n;globalThis.__App = App;', ctx, { filename: 'app.js' });
  const App = ctx.__App;
  delete require.cache[require.resolve('./campaign.js')];
  const { Campaign } = require('./campaign.js');
  const fns = [App.getDailySeed, App.getDayNumber, Campaign.starsFor];
  for (const fn of fns) if (typeof fn !== 'function' || !/^[a-zA-Z]+\(/.test(fn.toString())) throw new Error(`build-web-daily: kan ${fn && fn.name} niet uit de app lezen`);
  return '// Gemaakt door build-web-daily.js uit app.js (getDailySeed, getDayNumber) en campaign.js (starsFor). Niet met de hand bewerken.\n' +
    'const DagLogica = {\n  ' + fns.map(fn => fn.toString()).join(',\n  ') + '\n};\n';
}

// Een taalbestand zonder de campagneteksten (die speelt het web niet): ongeveer de helft kleiner.
function slimPack(file, code) {
  const ctx = {}; ctx.globalThis = ctx;
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), ctx, { filename: path.basename(file) });
  const pack = ctx.LANG_PACKS && ctx.LANG_PACKS[code];
  if (!pack || !pack.ui || !pack.data) throw new Error(`build-web-daily: ${file} is geen taalbestand`);
  const copy = JSON.parse(JSON.stringify(pack));
  delete copy.campaign;
  if (copy.data) delete copy.data.archiveStories;
  return `// ${code}: taalbestand van de app (i18n/${code}.js) zonder campagneteksten. Gemaakt door build-web-daily.js.\n` +
    `(globalThis.LANG_PACKS = globalThis.LANG_PACKS || {}).${code} = ${JSON.stringify(copy)};\n`;
}

function extractParts(ids) {
  let JSDOM;
  try { ({ JSDOM } = require('jsdom')); } catch (e) { throw new Error('build-web-daily: jsdom ontbreekt (npm install)'); }
  const doc = new JSDOM(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')).window.document;
  return ids.map(id => {
    const el = doc.getElementById(id);
    if (!el) throw new Error(`build-web-daily: #${id} staat niet meer in index.html`);
    return el.outerHTML;
  }).join('\n\n');
}

function build(out = path.join(ROOT, 'docs', 'play')) {
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(path.join(out, 'i18n'), { recursive: true });
  fs.mkdirSync(path.join(out, 'assets'), { recursive: true });
  for (const f of [...APP_SCRIPTS, ...APP_FILES]) fs.copyFileSync(path.join(ROOT, f), path.join(out, f));
  for (const a of ASSETS) fs.cpSync(path.join(ROOT, 'assets', a), path.join(out, 'assets', a), { recursive: true });
  for (const f of WEB_FILES) fs.copyFileSync(path.join(SRC, f), path.join(out, f));
  fs.writeFileSync(path.join(out, 'gedeeld.js'), sharedLogic());
  const packs = fs.readdirSync(path.join(ROOT, 'i18n')).filter(f => /^[a-z]{2}\.js$/.test(f));
  for (const f of packs) fs.writeFileSync(path.join(out, 'i18n', f), slimPack(path.join(ROOT, 'i18n', f), f.slice(0, 2)));

  const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
  let html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8')
    .replace('<!-- @bord -->', extractParts(BOARD_PARTS))
    .replace('<!-- @vensters -->', extractParts(MODAL_PARTS))
    .replace(/\{\{VERSIE\}\}/g, version);
  // ?v=<inhoud>: na een nieuwe bouw haalt de browser meteen de nieuwe bestanden (GitHub Pages bewaart 10 minuten)
  html = html.replace(/(src|href)="([a-z0-9-]+\.(?:js|css))"/g, (m, attr, f) =>
    fs.existsSync(path.join(out, f)) ? `${attr}="${f}?v=${hash(path.join(out, f))}"` : m);
  if (/@bord|@vensters|\{\{/.test(html)) throw new Error('build-web-daily: sjabloon niet volledig ingevuld');
  fs.writeFileSync(path.join(out, 'index.html'), html);

  let files = 0, bytes = 0;
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else { files++; bytes += fs.statSync(p).size; }
  });
  walk(out);
  return { out, files, bytes, packs: packs.length };
}

if (require.main === module) {
  const r = build(process.argv[2] ? path.resolve(process.argv[2]) : undefined);
  console.log(`${path.relative(process.cwd(), r.out) || r.out}/: ${r.files} bestanden, ${(r.bytes / 1048576).toFixed(1)} MB (${r.packs} taalbestanden zonder campagne)`);
}
module.exports = { build, sharedLogic };
