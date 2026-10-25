// Records the voice for a meelossen video: one clip per scene with Kokoro (local, free; via `hyperframes tts`),
// then a single voice.wav with every clip at the start of its scene once the scenes follow the voice.
//   node store/social/studio/stem.js c3-0-en en            -> motion/c3-0-en/stem-en/{<scene>.wav, stem.js, voice.wav}
//   node store/social/studio/stem.js c3-0-es es ef_dora    third argument: Kokoro voice (default per language below)
// Kokoro has no Dutch: Dutch goes to VoiceStudio (OmniVoice, http://localhost:3900, app must be running).
// Needs ~/.venvs/kokoro (pip install kokoro-onnx soundfile) for the other languages.
// Pronunciation: SAY below per language, plus an optional motion/<zaak>/uitspraak.json {"written": "spoken"};
// the screen keeps the written form, only the voice reads the spoken one.
// After this: node store/social/studio/render.js "meelossen.html?zaak=c3-0-en&taal=en&stem=1" --snel
const puppeteer = require('puppeteer-core');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const SAY = {
  nl: { 'Faites vos jeux': 'Plaats je inzet' },   // "Sudoku" as first word gets swallowed; the hook says "Een sudoku"
  en: { 'Faites vos jeux': 'Place your bets' },
  es: { Jack: 'Yak' },
};
const VOICE = { nl: 'voicestudio', en: 'af_heart', es: 'ef_dora', fr: 'ff_siwis', it: 'if_sara', pt: 'pf_dora', hi: 'hf_alpha', ja: 'jf_alpha', zh: 'zf_xiaobei' };
const LEAD = 0.3;   // must match LEAD in meelossen.html
// VoiceStudio voice profiles (local ids on this Mac): one fixed narrator per language, so a new seed never changes
// the speaker. NL "Crimson verteller NL" = 13 s of OmniVoice design (female, middle-aged), made 26-10-2026.
const PROFILE = { nl: 'dc3f22ab' };
const [zaak, taal, voice = VOICE[taal]] = process.argv.slice(2);
if (!zaak || !taal || !voice) { console.error('gebruik: node stem.js <zaak> <taal> [stem]   (Kokoro-talen: ' + Object.keys(VOICE).join(' ') + ')'); process.exit(2); }
const out = path.join(__dirname, '..', 'motion', zaak, 'stem-' + taal);
fs.mkdirSync(out, { recursive: true });
const env = { ...process.env, PATH: `${process.env.HOME}/.venvs/kokoro/bin:${process.env.PATH}` };
const own = path.join(__dirname, '..', 'motion', zaak, 'uitspraak.json');
const say = { ...(SAY[taal] || {}), ...(fs.existsSync(own) ? JSON.parse(fs.readFileSync(own, 'utf8')) : {}) };
const spoken = text => Object.entries(say).reduce((t, [a, b]) => t.split(a).join(b), text);
// VoiceStudio: one fixed voice design and seed, so every line of a video sounds like the same person
// OmniVoice sometimes returns a clip with no words in it, so every clip is transcribed back (whisper large-v3-turbo
// inside VoiceStudio) and recorded again with the next seed until most written words come back.
const words = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(w => w.length > 2);
const match = (want, got) => { const g = new Set(words(got)), w = words(want); return w.length ? w.filter(x => g.has(x)).length / w.length : 1; };
async function voicestudio(text, file, written) {
  let best = null;
  for (let seed = 7; seed < 15; seed++) {
    const res = await fetch('http://localhost:3900/v1/audio/speech', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'omnivoice', input: text, voice: PROFILE[taal] || 'default', language: taal, response_format: 'wav', seed, ...(PROFILE[taal] ? {} : { instruct: 'female, middle-aged, moderate pitch' }) }) });
    if (!res.ok) throw new Error(`VoiceStudio ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const form = new FormData(); form.append('file', new Blob([buf], { type: 'audio/wav' }), 'clip.wav'); form.append('language', taal); form.append('model', 'whisper-1');
    const heard = ((await (await fetch('http://localhost:3900/v1/audio/transcriptions', { method: 'POST', body: form })).json()).text || '');
    const score = match(written, heard);
    if (!best || score > best.score) best = { buf, score, seed, heard };
    if (score >= 0.8) break;
  }
  fs.writeFileSync(file, best.buf);
  console.log(`        seed ${best.seed}, ${Math.round(best.score * 100)}% verstaan: ${best.heard.trim()}`);
  if (best.score < 0.6) console.log('        LET OP: zin slecht verstaanbaar');
  return (best.buf.length - 44) / 2 / 24000;   // 16-bit mono 24 kHz WAV
}

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
    const text = spoken(s.voice);
    const secs = voice === 'voicestudio' ? await voicestudio(text, file, s.voice)
      : JSON.parse(execFileSync('npx', ['-y', 'hyperframes@0.8.199', 'tts', text, '-v', voice, '-o', file, '--json'], { env, encoding: 'utf8' }).trim().split('\n').pop()).durationSeconds;
    lengths[s.id] = Math.round(secs * 1000) / 1000;
    console.log(`${s.id.padEnd(7)} ${String(lengths[s.id]).padStart(6)} s  ${text}`);
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
