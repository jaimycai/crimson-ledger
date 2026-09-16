// Schermafbeeldingen met een kop erboven, zoals de meeste App Store-pagina's ze
// tonen. 1290×2796, dezelfde maat als de kale schermafbeeldingen. De kale versie
// blijft staan in store/screenshots; deze set staat in store/cards.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:8090';
const OUT = { nl: '/Users/jaimycai/Developer/Murdoku/store/cards', en: '/Users/jaimycai/Developer/Murdoku/store/cards-en' };
const SRC = { nl: 'store/screenshots', en: 'store/screenshots-en' };

// volgorde zoals ze in App Store Connect komen te staan
const CARDS = {
  nl: [
    ['04-verklaringen', 'De verdachten praten.', 'Klopt een verklaring, dan kleurt hij groen.'],
    ['02-wereldkaart', 'Acht werelden,\néén kronkelpad', '384 zaken, van makkelijk naar moeilijk.'],
    ['06-zaak-gesloten', 'Zaak gesloten.', 'Sterren voor wie het zonder hint en in één keer doet.'],
    ['01-thuis', 'Elke dag\neen nieuwe zaak', 'Met een weekstrook, opdrachten en een streak.'],
    ['05-beschuldiging', 'Wie was alleen\nmet het slachtoffer?', 'Wijs de dader aan. Hij bekent, of hij ontkent.'],
    ['03-briefing', 'Inspecteur Van Dam\nhelpt je op weg', 'Een briefing vooraf, hints in drie stappen.'],
    ['07-vitrine', 'Drieëntwintig\nonderscheidingen', 'En een vitrine met een bewijsstuk per zaak.'],
    ['08-winkel', 'Geen levens.\nGeen advertenties.', 'Twee werelden gratis. De rest koop je één keer.']
  ],
  en: [
    ['04-verklaringen', 'The suspects talk.', 'A statement that fits turns green.'],
    ['02-wereldkaart', 'Eight worlds,\none winding path', '384 cases, from easy to hard.'],
    ['06-zaak-gesloten', 'Case closed.', 'Stars for solving without a hint, on the first try.'],
    ['01-thuis', 'A new case\nevery day', 'With a week strip, quests and a streak.'],
    ['05-beschuldiging', 'Who was alone\nwith the victim?', 'Name the culprit. They confess, or they deny it.'],
    ['03-briefing', 'Inspector Van Dam\nsets you going', 'A briefing first, hints in three steps.'],
    ['07-vitrine', 'Twenty-three\nawards to earn', 'And a cabinet with one piece of evidence per case.'],
    ['08-winkel', 'No lives.\nNo ads.', 'Two worlds free. The rest is a single purchase.']
  ]
};

const card = (src, head, sub, dark) => `
<style>
  @font-face { font-family: 'Playfair Display'; font-style: normal; font-weight: 400 900; src: url('${BASE}/assets/fonts/PlayfairDisplay-normal.woff2') format('woff2'); }
  @font-face { font-family: 'Inter'; font-style: normal; font-weight: 100 900; src: url('${BASE}/assets/fonts/Inter-normal.woff2') format('woff2'); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 430px; height: 932px; overflow: hidden;
    display: flex; flex-direction: column; align-items: center;
    background: ${dark
      ? 'radial-gradient(120% 80% at 50% 0%, #33261d 0%, #201812 60%, #17110d 100%)'
      : 'radial-gradient(120% 80% at 50% 0%, #fbf5ea 0%, #f2e8d4 55%, #e7d9bd 100%)'};
  }
  /* vaste hoogte, zodat een kop van één of twee regels het toestel
     op alle acht de platen even hoog laat staan */
  .top {
    height: 176px; width: 100%;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
  }
  .head {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 700; font-size: 30px; line-height: 1.12; text-align: center;
    color: ${dark ? '#f6e9cf' : '#8c2f2f'};
    padding: 0 24px; white-space: pre-line;
    letter-spacing: .005em;
  }
  .sub {
    font-family: Inter, -apple-system, sans-serif;
    font-size: 13.5px; line-height: 1.4; text-align: center;
    color: ${dark ? '#bda787' : '#6b5b48'};
    margin-top: 10px; padding: 0 34px;
  }
  .rule { width: 46px; height: 2px; margin-top: 16px; background: ${dark ? '#a8802c' : '#a8802c'}; opacity: .85; }
  .phone {
    width: 340px; margin-top: 10px;
    border: 3px solid ${dark ? '#0d0a07' : '#2b2118'};
    border-radius: 30px; overflow: hidden;
    box-shadow: 0 18px 40px rgba(0,0,0,${dark ? '.55' : '.28'});
    background: #fff;
  }
  .phone img { display: block; width: 100%; }
</style>
<div class="top">
  <div class="head">${head}</div>
  <div class="sub">${sub}</div>
  <div class="rule"></div>
</div>
<div class="phone"><img src="${src}"></div>
`;

async function run(lang) {
  fs.mkdirSync(OUT[lang], { recursive: true });
  const chrome = fs.readdirSync(process.env.HOME + '/.cache/puppeteer/chrome')[0];
  const exe = `${process.env.HOME}/.cache/puppeteer/chrome/${chrome}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
  const browser = await puppeteer.launch({ headless: true, executablePath: fs.existsSync(exe) ? exe : undefined });
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 3 });

  const list = CARDS[lang];
  for (let i = 0; i < list.length; i++) {
    const [name, head, sub] = list[i];
    const url = `${BASE}/${SRC[lang]}/${name}.png`;
    await page.setContent(card(url, head, sub, i % 2 === 1), { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    const file = path.join(OUT[lang], `${String(i + 1).padStart(2, '0')}-${name.slice(3)}.png`);
    await page.screenshot({ path: file });
    console.log(lang, path.basename(file));
  }
  await browser.close();
}

(async () => { await run('nl'); await run('en'); })().catch(e => { console.error(e); process.exit(1); });
