// Pulls everything a motion video needs for one case out of the running app: the empty floor plan as a
// sharp PNG, where each room and cell sits on it, the suspects with their own SVG portraits, the victim,
// the statements and the answer. Needs the app on http://localhost:8093 (preview "crimson-www").
//   node store/social/studio/haal.js 3:0        -> store/social/motion/c3-0/{plan.png,zaak.json,zaak.js}
const puppeteer = require('puppeteer-core');
const fs = require('fs'), path = require('path');
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  for (const arg of process.argv.slice(2)) {
    const [ch, idx] = arg.includes(':') ? arg.split(':').map(Number) : [0, Number(arg)];
    const cid = ch ? `c${ch}-${idx}` : String(idx);
    const dir = path.join(__dirname, '..', 'motion', cid); fs.mkdirSync(dir, { recursive: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 4, isMobile: true, hasTouch: true });
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
    await page.evaluate((i, c) => App.startCampaignCase(Campaign.list()[c].key, i), idx, ch); await wait(500);
    for (const id of ['btn-part-go', 'btn-briefing-go', 'btn-newclue-ok']) { await page.evaluate(id => { const b = document.getElementById(id); if (b && b.offsetParent) b.click(); }, id); await wait(400); }
    const grid = await page.$('#board-grid');
    await grid.screenshot({ path: path.join(dir, 'plan.png') });
    const data = await page.evaluate(() => {
      const p = Board.puzzle, g = document.getElementById('board-grid').getBoundingClientRect();
      const pct = r => ({ x: (r.left - g.left) / g.width, y: (r.top - g.top) / g.height, w: r.width / g.width, h: r.height / g.height });
      const cells = {}; document.querySelectorAll('#board-grid .bcell').forEach(c => { cells[c.dataset.x + ',' + c.dataset.y] = pct(c.getBoundingClientRect()); });
      const box = list => { const rs = list.map(c => cells[c.x + ',' + c.y]); const x0 = Math.min(...rs.map(r => r.x)), y0 = Math.min(...rs.map(r => r.y));
        return { x: x0, y: y0, w: Math.max(...rs.map(r => r.x + r.w)) - x0, h: Math.max(...rs.map(r => r.y + r.h)) - y0 }; };
      return {
        title: (Board.campaignCase && Board.campaignCase.title) || '', caseText: document.getElementById('board-casetext').textContent.replace(/^\S+\s/, ''), icon: p.theme && p.theme.icon,
        cols: p.cols, rows: p.rows, aspect: g.width / g.height, cells,
        rooms: p.rooms.map(r => ({ id: r.id, name: r.name, color: r.color, cells: r.list.map(c => [c.x, c.y]), box: box(r.list) })),
        victim: { x: p.victim.x, y: p.victim.y, roomId: p.victim.roomId, name: (p.theme && p.theme.victimName) || '', svg: Avatars.victim() },
        suspects: p.suspects.map((s, i) => ({ label: s.label || s.name, short: Themes.shortName(s.label || s.name), color: s.color, svg: Avatars.suspect(s, i), at: p.solution[i] })),
        murderer: p.murderer,
        statements: p.clues.map(c => { const st = FloorPlan.statement(c, p); return { whoIdx: st.who.length ? st.who[0] : -1, text: st.text }; }),
      };
    });
    fs.writeFileSync(path.join(dir, 'zaak.json'), JSON.stringify(data, null, 1));
    fs.writeFileSync(path.join(dir, 'zaak.js'), 'window.ZAAK = ' + JSON.stringify(data) + ';\n'); // file:// pages cannot fetch json
    console.log(cid, data.title, '|', data.suspects.length, 'verdachten |', data.statements.length, 'verklaringen | dader:', data.suspects[data.murderer].label);
    await page.close();
  }
  await browser.close();
})();
