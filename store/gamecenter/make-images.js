// The images of the Game Center achievements and leaderboards: 1024 × 1024 px, RGB without alpha, 72 ppi (Apple).
// Game Center lays a circle over an achievement image, so each one is a medal: a gold rim, a hairline of ink and a
// disc. A world shows its own map banner (mapart.js); the others an icon from icons.js (Tabler, the app's one icon set)
// and where it says something, a number in Playfair Display. No words, so one image serves all 23 languages.
// Colours and type from DESIGN.md (paper, oxblood, ink, gold).
//   node store/gamecenter/make-images.js            all images to store/gamecenter/images/
//   node store/gamecenter/make-images.js sheet      also a contact sheet (sheet.png) to look at them together
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const puppeteer = require('puppeteer');
const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(__dirname, 'images');
const { GameCenter } = require(path.join(ROOT, 'gamecenter.js'));
const { MapArt } = require(path.join(ROOT, 'mapart.js'));
const { ICONS } = require(path.join(ROOT, 'icons.js'));

const C = { paper: '#FAF5EF', paper2: '#F3EDE3', ink: '#2C1810', oxblood: '#8B2E1C', oxblood2: '#6E2214', gold: '#B8955C', goldLight: '#D4B074', goldPale: '#EBD7A8' };
const font = b => `url(data:font/woff2;base64,${fs.readFileSync(path.join(ROOT, 'assets/fonts', b)).toString('base64')}) format('woff2')`;
const icon = (name, color, size, sw = 1.6) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="color:${color}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name].replace(/stroke-width="2"/g, `stroke-width="${sw}"`)}</svg>`;
const star = (size, fill) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="${(ICONS.star.match(/d="([^"]+)"/) || [])[1]}" fill="${fill}" stroke="${C.ink}" stroke-width="0.9" stroke-linejoin="round"/></svg>`;

// worlds whose middle alone says little: show this much more of the banner (disc width × factor)
const WIDE = { filmstudio: 1.45 };

// what sits on the disc, per achievement key: [disc colour, inner html]
function face(key) {
  const num = (n, size = 300, color = C.goldLight) => `<div class="num" style="font-size:${size}px;color:${color}">${n}</div>`;
  const stack = (...parts) => `<div class="stack">${parts.join('')}</div>`;
  switch (key) {
    case 'first_case': return [C.oxblood, icon('search', C.paper, 470, 1.7)];
    case 'first_three_stars': return [C.oxblood, `<div class="stars">${star(250, C.goldLight)}${star(330, C.goldLight)}${star(250, C.goldLight)}</div>`];
    case 'first_part': return [C.oxblood, stack(icon('book', C.paper, 330, 1.6), num('I', 230, C.goldLight))];
    case 'streak_3': return [C.ink, stack(icon('flame', C.goldLight, 300, 1.6), num('3', 250))];
    case 'streak_7': return [C.ink, stack(icon('flame', C.goldLight, 300, 1.6), num('7', 250))];
    case 'streak_30': return [C.ink, stack(icon('flame', C.goldPale, 300, 1.6), num('30', 250, C.goldPale))];
    case 'solved_10': return [C.oxblood, stack(icon('folder', C.paper, 250, 1.6), num('10', 280))];
    case 'solved_50': return [C.oxblood, stack(icon('folder', C.paper, 250, 1.6), num('50', 280))];
    case 'solved_100': return [C.oxblood2, stack(icon('folder', C.paper, 230, 1.6), num('100', 250))];
    case 'solved_500': return [C.ink, stack(icon('folder', C.goldPale, 230, 1.6), num('500', 250, C.goldPale))];
    case 'first_master': return [C.ink, icon('crown', C.goldLight, 480, 1.4)];
    case 'case_of_week': return [C.oxblood, icon('calendar', C.paper, 440, 1.5)];
    case 'board.points': return [C.oxblood, icon('trophy', C.goldLight, 470, 1.5)];
    case 'board.daily_time': return [C.ink, icon('clock', C.goldLight, 480, 1.5)];
  }
  if (key.startsWith('world.')) {
    const id = key.slice(6), svg = MapArt.banner(id), wide = WIDE[id];
    if (!wide) return [C.paper, `<div class="banner">${svg}</div>`];
    // a wider view: the whole banner a bit smaller, on the ground line, with its own sky above it
    const sky = (svg.match(/<rect width="393" height="200" fill="([^"]+)"/) || [])[1] || C.paper;
    return [sky, `<div class="banner wide" style="width:${Math.round(wide * 100)}%">${svg}</div>`];
  }
  throw new Error('geen ontwerp voor ' + key);
}

const page = (key) => {
  const [disc, inner] = face(key);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face { font-family: 'Playfair Display'; font-weight: 400 900; src: ${font('PlayfairDisplay-normal.woff2')}; }
    html, body { margin: 0; background: ${C.paper}; }
    .medal { position: relative; width: 1024px; height: 1024px; background: ${C.paper}; overflow: hidden; }
    .rim { position: absolute; inset: 0; border-radius: 50%;
      background: radial-gradient(circle at 34% 28%, #F1DDAE 0, ${C.goldLight} 30%, ${C.gold} 62%, #8E6E3C 100%); }
    .rim::after { content: ''; position: absolute; inset: 24px; border-radius: 50%; border: 5px solid ${C.ink}; opacity: .85; }
    .disc { position: absolute; inset: 44px; border-radius: 50%; background: ${disc}; overflow: hidden;
      box-shadow: inset 0 0 0 4px ${C.ink}, inset 0 18px 40px rgba(0,0,0,.28); display: grid; place-items: center; }
    .disc::after { content: ''; position: absolute; inset: 30px; border-radius: 50%; border: 3px dotted ${C.goldLight}; opacity: .55; }
    .banner { position: absolute; inset: 0; }
    .banner svg { width: 100%; height: 100%; display: block; }
    .banner.wide { inset: auto; left: 50%; bottom: 0; height: auto; aspect-ratio: 393 / 200; transform: translateX(-50%); }
    .banner.wide::after { display: none; }
    .banner::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle, transparent 58%, rgba(44,24,16,.35) 100%); }
    .stack { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0; margin-top: -20px; }
    .num { font-family: 'Playfair Display', Georgia, serif; font-weight: 900; line-height: .9; letter-spacing: -6px; margin-top: 6px; }
    .stars { display: flex; align-items: center; gap: 6px; margin-top: -10px; }
    .stars svg:nth-child(1), .stars svg:nth-child(3) { transform: translateY(40px); }
    svg { overflow: visible; }
  </style></head><body><div class="medal"><div class="rim"></div><div class="disc">${inner}</div></div></body></html>`;
};

function chromePath() {
  const dir = path.join(process.env.HOME, '.cache/puppeteer/chrome');
  let v; try { v = fs.readdirSync(dir).filter(d => !d.startsWith('.')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop(); } catch (e) { v = null; }
  const exe = v && path.join(dir, v, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  return exe && fs.existsSync(exe) ? exe : undefined;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const keys = [...GameCenter.list().map(a => a.key), ...Object.keys(GameCenter.BOARDS).map(b => 'board.' + b)];
  const browser = await puppeteer.launch({ headless: true, executablePath: chromePath() });
  const tab = await browser.newPage();
  await tab.setViewport({ width: 1024, height: 1024, deviceScaleFactor: 1 });
  const raw = path.join(OUT, '.raw');
  fs.mkdirSync(raw, { recursive: true });
  for (const key of keys) {
    await tab.setContent(page(key), { waitUntil: 'load' });
    await tab.evaluate(() => document.fonts.ready);
    await tab.screenshot({ path: path.join(raw, key + '.png'), clip: { x: 0, y: 0, width: 1024, height: 1024 } });
  }
  await browser.close();
  // Chrome writes RGBA; Apple wants RGB at 72 ppi: Pillow drops the alpha channel and sets the resolution
  execFileSync('python3', ['-I', '-c', `
import sys, os
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
for f in sorted(os.listdir(src)):
    if not f.endswith('.png'): continue
    im = Image.open(os.path.join(src, f)).convert('RGB')
    assert im.size == (1024, 1024), (f, im.size)
    im.save(os.path.join(dst, f), 'PNG', dpi=(72, 72), optimize=True)
`, raw, OUT]);
  fs.rmSync(raw, { recursive: true, force: true });
  console.log(`${keys.length} plaatjes in ${path.relative(ROOT, OUT)}/`);
  if (process.argv.includes('sheet')) {
    execFileSync('python3', ['-I', '-c', `
import sys, os
from PIL import Image
d = sys.argv[1]; files = sorted(f for f in os.listdir(d) if f.endswith('.png') and f != 'sheet.png')
n = 8; s = 200; rows = (len(files) + n - 1) // n
sheet = Image.new('RGB', (n * s, rows * s), (250, 245, 239))
for i, f in enumerate(files):
    sheet.paste(Image.open(os.path.join(d, f)).resize((s - 10, s - 10)), ((i % n) * s + 5, (i // n) * s + 5))
sheet.save(sys.argv[2])
`, OUT, path.join(require('os').tmpdir(), 'crimson-gc-sheet.png')]);
    console.log('overzicht: ' + path.join(require('os').tmpdir(), 'crimson-gc-sheet.png'));
  }
})().catch(e => { console.error(e); process.exit(1); });
