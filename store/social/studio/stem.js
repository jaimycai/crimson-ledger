// Records the voice for a meelossen video: one clip per scene with Kokoro (local, free; via `hyperframes tts`),
// then a single voice.wav with every clip at the start of its scene once the scenes follow the voice.
//   node store/social/studio/stem.js c3-0-en en            -> motion/c3-0-en/stem-en/{<scene>.wav, stem.js, voice.wav}
//   node store/social/studio/stem.js c3-0-es es ef_dora    third argument: Kokoro voice (default per language below)
// Kokoro has no Dutch; Dutch waits for VoiceStudio. Needs ~/.venvs/kokoro (pip install kokoro-onnx soundfile).
// After this: node store/social/studio/render.js "meelossen.html?zaak=c3-0-en&taal=en&stem=1" --snel
const puppeteer = require('puppeteer-core');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const VOICE = { en: 'af_heart', es: 'ef_dora', fr: 'ff_siwis', it: 'if_sara', pt: 'pf_dora', hi: 'hf_alpha', ja: 'jf_alpha', zh: 'zf_xiaobei' };
const LEAD = 0.3;   // must match LEAD in meelossen.html
const [zaak, taal, voice = VOICE[taal]] = process.argv.slice(2);
if (!zaak || !taal || !voice) { console.error('gebruik: node stem.js <zaak> <taal> [stem]   (Kokoro-talen: ' + Object.keys(VOICE).join(' ') + ')'); process.exit(2); }
const out = path.join(__dirname, '..', 'motion', zaak, 'stem-' + taal);
fs.mkdirSync(out, { recursive: true });
const env = { ...process.env, PATH: `${process.env.HOME}/.venvs/kokoro/bin:${process.env.PATH}` };

async function scenesOf(stem) {
  const browser = await puppeteer.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.goto(`file://${path.join(__dirname, 'meelossen.html')}?zaak=${zaak}&taal=${taal}${stem ? '&stem=1' : ''}&t=0`, { waitUntil: 'networkidle0' });
  const r = await page.evaluate(() => ({ duration: COMP.duration, scenes: COMP.scenes.map(s => ({ id: s.id, t: s.t, dur: s.dur, voice: s.voice || '' })) }));
  await browser.close();
  return r;
}

(async () => {
  const first = await scenesOf(false);
  const lengths = {};
  for (const s of first.scenes) {
    if (!s.voice) continue;
    const file = path.join(out, s.id + '.wav');
    const res = JSON.parse(execFileSync('npx', ['-y', 'hyperframes@0.8.199', 'tts', s.voice, '-v', voice, '-o', file, '--json'], { env, encoding: 'utf8' }).trim().split('\n').pop());
    lengths[s.id] = Math.round(res.durationSeconds * 1000) / 1000;
    console.log(`${s.id.padEnd(7)} ${String(lengths[s.id]).padStart(6)} s  ${s.voice}`);
  }
  fs.writeFileSync(path.join(out, 'stem.js'), `// written by stem.js (${voice}); seconds of voice per scene\nwindow.STEM = ${JSON.stringify(lengths)};\n`);
  const final = await scenesOf(true);
  fs.writeFileSync(path.join(out, 'plaatsing.json'), JSON.stringify({ duration: final.duration, clips: final.scenes.filter(s => lengths[s.id]).map(s => ({ file: s.id + '.wav', at: s.t + LEAD })) }));
  execFileSync('python3', ['-c', `
import json, wave, sys
import numpy as np
d = json.load(open(sys.argv[1] + '/plaatsing.json')); sr = 24000
mix = np.zeros(int((d['duration'] + 1) * sr), dtype=np.float32)
for c in d['clips']:
    w = wave.open(sys.argv[1] + '/' + c['file']); assert w.getframerate() == sr and w.getnchannels() == 1
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    a = int(c['at'] * sr); mix[a:a + len(x)] += x[:len(mix) - a]
o = wave.open(sys.argv[1] + '/voice.wav', 'wb'); o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr)
o.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()); o.close()
`, out]);
  console.log(`duur ${final.duration.toFixed(1)} s (zonder stem ${first.duration.toFixed(1)} s) -> ${path.join(out, 'voice.wav')}`);
})();
