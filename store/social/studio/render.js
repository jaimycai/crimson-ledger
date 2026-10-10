// Renders a motion page to MP4 with its own soundtrack, and writes a review page next to it (stage 3).
// Every frame is the page frozen at t (COMP.seek), so the video matches the storyboard exactly.
//   node store/social/studio/render.js raadsel.html?zaak=c3-0            -> motion/c3-0/v<N>/{video.mp4,review.html}
//   node store/social/studio/render.js raadsel.html?zaak=c3-0 --snel     half size, for a quick look
const puppeteer = require('puppeteer-core');
const fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');
(async () => {
  const arg = process.argv[2] || 'raadsel.html?zaak=c3-0', snel = process.argv.includes('--snel');
  const [file, query = ''] = arg.split('?');
  const zaak = new URLSearchParams(query).get('zaak') || 'c3-0';
  const base = path.join(__dirname, '..', 'motion', zaak);
  const nr = fs.existsSync(base) ? fs.readdirSync(base).filter(d => /^v\d+$/.test(d)).length + 1 : 1;
  const out = path.join(base, 'v' + nr); fs.mkdirSync(out, { recursive: true });
  const FPS = 30, W = snel ? 540 : 1080, H = snel ? 960 : 1920;

  const browser = await puppeteer.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`file://${path.join(__dirname, file)}?${query}&t=0`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const comp = await page.evaluate(() => ({ duration: COMP.duration, cues: COMP.cues, scenes: COMP.scenes.map(s => ({ t: s.t, title: s.title })) }));

  fs.writeFileSync(path.join(out, 'cues.json'), JSON.stringify(comp.cues));
  execFileSync('python3', [path.join(__dirname, 'klank.py'), path.join(out, 'cues.json'), String(comp.duration), path.join(out, 'klank.wav')]);

  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-i', path.join(out, 'klank.wav'), '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', snel ? '26' : '18',
    '-preset', 'medium', '-c:a', 'aac', '-b:a', '160k', '-ar', '44100', '-shortest', '-movflags', '+faststart', path.join(out, 'video.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
  const frames = Math.round(comp.duration * FPS);
  for (let f = 0; f < frames; f++) {
    await page.evaluate(t => COMP.seek(t), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) process.stdout.write(`frame ${f}/${frames}\n`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  await page.evaluate(() => COMP.seek(COMP.scenes[0].still || 0.9)); await page.screenshot({ path: path.join(out, 'cover.jpg'), type: 'jpeg', quality: 90 });
  await browser.close();

  const tpl = fs.readFileSync(path.join(__dirname, 'review-sjabloon.html'), 'utf8');
  fs.writeFileSync(path.join(out, 'review.html'), tpl.replace('/*REVIEW*/null', JSON.stringify({ zaak, versie: nr, bron: arg, video: 'video.mp4', duur: comp.duration, scenes: comp.scenes, gemaakt: new Date().toISOString() })));
  console.log(`v${nr}: ${path.join(out, 'video.mp4')}\nreview: ${path.join(out, 'review.html')}`);
})();
