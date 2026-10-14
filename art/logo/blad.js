// Maakt blad.html: elk logo uit ruw/ groot, als icoon en op beginschermformaat, naast het huidige icoon.
// Afbeeldingen gaan verkleind als JPEG mee (sips op de Mac, anders ImageMagick), zodat de pagina klein blijft.
//   node art/logo/blad.js    daarna blad.html openen of als artifact publiceren
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process'), os = require('os');
const DIR = __dirname, RUW = path.join(DIR, 'ruw');
const { PROMPTS } = require('./prompts.js');
const small = (file, px) => {
  const out = path.join(os.tmpdir(), `logo-${path.basename(file, '.png')}-${px}.jpg`);
  try { execFileSync('sips', ['-Z', String(px), '-s', 'format', 'jpeg', file, '--out', out], { stdio: 'ignore' }); }
  catch (e) { execFileSync('convert', [file, '-resize', `${px}x${px}`, '-quality', '88', out]); }
  return 'data:image/jpeg;base64,' + fs.readFileSync(out).toString('base64');
};
const items = PROMPTS.filter(p => fs.existsSync(path.join(RUW, p.id + '.png')));
if (!items.length) { console.error('Nog geen beelden in art/logo/ruw/.'); process.exit(1); }
const now = path.join(DIR, '../../icon-1024.png');
const card = (img, s, title, sub) => `<figure><img class="groot" src="${img(360)}" alt=""><div class="rij"><img class="klein" src="${s}" alt=""><img class="klein donker" src="${s}" alt=""></div><figcaption><b>${title}</b><span>${sub}</span></figcaption></figure>`;
const cards = items.map(p => { const f = path.join(RUW, p.id + '.png'); const s = small(f, 120); return card(px => small(f, px), s, p.id, `${p.richting} · ${p.stijl}`); });
const nu = small(now, 120); cards.unshift(card(px => small(now, px), nu, 'nu', 'het huidige icoon'));
fs.writeFileSync(path.join(DIR, 'blad.html'), `<title>Crimson Ledger logo-proeven</title>
<meta name="viewport" content="width=device-width,initial-scale=1"><style>:root{--bg:#FAF5EF;--ink:#2C1810;--card:#F3EDE3;--line:#E0D3C3;--sub:#5A3E2B;--tile:#E4D8C8}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#17110D;--ink:#F3EDE3;--card:#221913;--line:#3A2B20;--sub:#C9B8A6;--tile:#E4D8C8}}:root[data-theme="dark"]{--bg:#17110D;--ink:#F3EDE3;--card:#221913;--line:#3A2B20;--sub:#C9B8A6;--tile:#E4D8C8}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,sans-serif}main{max-width:1100px;margin:0 auto;padding:32px max(16px,env(safe-area-inset-left,0px));display:grid;gap:24px}
h1{font:700 30px/1.1 Georgia,serif;margin:0}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(220px,100%),1fr));gap:20px}
figure{margin:0;display:grid;gap:10px;background:var(--card);padding:14px;border:1px solid var(--line)}.groot{width:100%;aspect-ratio:1;border-radius:22.4%;display:block}
.rij{display:flex;gap:10px}.rij img{width:60px;height:60px;border-radius:13.4px;padding:10px;background:var(--tile)}.rij img.donker{background:#1A120E}
figcaption{display:grid;font-size:13px}figcaption span{color:var(--sub)}</style>
<main><h1>Logo-proeven</h1><p>Groot, en op ware grootte op een licht en een donker scherm. Bronnen en opdrachten: art/logo/prompts.js.</p><div class="grid">${cards.join('')}</div></main>`);
console.log(`blad.html: ${items.length} proeven + het huidige icoon`);
