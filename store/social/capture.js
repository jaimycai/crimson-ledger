// Captures real cases from the app for social posts: an empty board, one frame per
// solving step, and the case data (statements, culprit). Needs the built app served on
// http://localhost:8093 and puppeteer-core (npm i --no-save puppeteer-core).
//   node store/social/capture.js <caseIndex> [more indexes]
const puppeteer = require('puppeteer-core'); const fs = require('fs'); const path = require('path');
const wait = ms => new Promise(r => setTimeout(r, ms));
const OUT = path.join(__dirname, 'cases');
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  for (const idx of process.argv.slice(2).map(Number)) {
    const dir = path.join(OUT, String(idx)); fs.mkdirSync(dir, { recursive: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('crimson-lang', 'nl'); localStorage.setItem('crimson-meting', '0');
      localStorage.setItem('crimson-board-tutorial-done', '1'); localStorage.setItem('crimson-board-tip-seen', '1');
      localStorage.setItem('crimson-store-mock', '1');
      localStorage.setItem('crimson-newclue-seen', JSON.stringify(['room', 'not-room', 'room-pos', 'near', 'row', 'col', 'same-room', 'not-same-room', 'left-of', 'above', 'furniture', 'alone', 'corner', 'wall', 'middle', 'next-to']));
      const camp = {}; for (let i = 0; i < 48; i++) camp['landhuis-' + i] = 3; localStorage.setItem('crimson-campaign', JSON.stringify(camp));
    });
    await page.goto('http://localhost:8093/index.html', { waitUntil: 'networkidle0' });
    await page.addStyleTag({ content: '#toast, #medal-toast, .toast { display: none !important }' });
    await wait(900);
    await page.evaluate(() => document.getElementById('btn-splash-start').click()); await wait(500);
    await page.evaluate(i => App.startCampaignCase(Campaign.list()[0].key, i), idx); await wait(500);
    for (const id of ['btn-part-go', 'btn-briefing-go', 'btn-newclue-ok']) { await page.evaluate(id => { const b = document.getElementById(id); if (b && b.offsetParent) b.click(); }, id); await wait(400); }
    const data = await page.evaluate(() => {
      const p = Board.puzzle;
      return { title: (Board.campaignCase && Board.campaignCase.title) || '', story: (document.querySelector('.board-story, #board-story') || {}).innerText || '',
        suspects: p.suspects.map(s => s.label || s.name), murderer: p.murderer,
        statements: p.clues.map(c => { const st = FloorPlan.statement(c, p); return { who: st.who.length ? (p.suspects[st.who[0]].label || p.suspects[st.who[0]].name) : 'Inspecteur Van Dam', whoIdx: st.who.length ? st.who[0] : -1, text: st.text }; }) };
    });
    await page.screenshot({ path: path.join(dir, 'board.png') });
    const n = data.suspects.length;
    for (let i = 0; i < n; i++) {
      await page.evaluate(i => { const p = Board.puzzle; Board.placements[i] = { x: p.solution[i].x, y: p.solution[i].y }; Board.after();
        const ci = p.clues.findIndex(c => { const st = FloorPlan.statement(c, p); return st.who.includes(i); }); Board.deckIdx = ci >= 0 ? ci : 0; if (Board.renderDeck) Board.renderDeck(); }, i);
      await wait(350); await page.screenshot({ path: path.join(dir, `step-${i + 1}.png`) });
    }
    await page.evaluate(() => document.getElementById('btn-board-check').click()); await wait(500);
    await page.screenshot({ path: path.join(dir, 'accuse.png') });
    await page.evaluate(() => document.querySelector(`.murder-opt[data-s="${Board.puzzle.murderer}"]`).click()); await wait(1400);
    await page.evaluate(() => { if (Board.skipCeremony) Board.skipCeremony(); }); await wait(2600);
    await page.evaluate(() => window.scrollTo(0, 0)); await wait(200);
    await page.screenshot({ path: path.join(dir, 'closed.png') });
    fs.writeFileSync(path.join(dir, 'case.json'), JSON.stringify(data, null, 1));
    console.log(idx, data.title, '|', n, 'suspects |', data.statements.length, 'statements | dader:', data.suspects[data.murderer]);
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
