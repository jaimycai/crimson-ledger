// Stage 2 of the motion workflow: a storyboard you can comment on.
// Freezes a motion page at each scene's still moment, saves the frames and writes one board page with
// the start time and a description under every frame. Click a frame to pin a comment; "Kopieer alle
// opmerkingen" copies them as one list ("Shot 05, 7,40 s, pin op 52% van links, 46% van boven: ...").
//   node store/social/studio/bord.js raadsel.html?zaak=c3-0    -> store/social/motion/c3-0/bord.html
const puppeteer = require('puppeteer-core');
const fs = require('fs'), path = require('path');
(async () => {
  const arg = process.argv[2] || 'raadsel.html?zaak=c3-0';
  const [file, query = ''] = arg.split('?');
  const zaak = new URLSearchParams(query).get('zaak') || 'c3-0';
  const out = path.join(__dirname, '..', 'motion', zaak); fs.mkdirSync(path.join(out, 'bord'), { recursive: true });
  const url = t => `file://${path.join(__dirname, file)}?${query}&t=${t}`;
  const browser = await puppeteer.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 540, height: 960, deviceScaleFactor: 2 });
  await page.goto(url(0), { waitUntil: 'networkidle0' });
  const comp = await page.evaluate(() => ({ duration: COMP.duration, scenes: COMP.scenes.map(s => ({ t: s.t, still: s.still, title: s.title, beschrijving: s.beschrijving })) }));
  const shots = [];
  for (const [i, s] of comp.scenes.entries()) {
    await page.goto(url(s.still), { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    const name = `bord/${String(i + 1).padStart(2, '0')}.jpg`;
    await page.screenshot({ path: path.join(out, name), type: 'jpeg', quality: 86 });
    shots.push({ nr: i + 1, img: name, ...s });
  }
  await browser.close();
  const tpl = fs.readFileSync(path.join(__dirname, 'bord-sjabloon.html'), 'utf8');
  const html = tpl.replace('/*BORD*/null', JSON.stringify({ zaak, bron: arg, duur: comp.duration, gemaakt: new Date().toISOString(), shots }));
  fs.writeFileSync(path.join(out, 'bord.html'), html);
  console.log(`${shots.length} shots -> ${path.join(out, 'bord.html')}`);
})();
