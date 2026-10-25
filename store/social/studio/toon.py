"""Median pitch (Hz) of one or more WAV files; stem.js uses it to keep every line in the narrator's range.
    python3 toon.py clip.wav            -> 241
    python3 toon.py <folder> ...        -> per clip, plus the ones that stray more than 18% from the median"""
import sys, wave, glob, os, numpy as np
def f0(path):
    w = wave.open(path); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    fr, hop = int(0.04 * sr), int(0.01 * sr); out = []
    for i in range(0, len(x) - fr, hop):
        s = x[i:i + fr] * np.hanning(fr)
        if np.sqrt((s ** 2).mean()) < 0.02: continue
        ac = np.correlate(s, s, 'full')[fr - 1:]; lo, hi = int(sr / 400), int(sr / 70)
        k = lo + np.argmax(ac[lo:hi])
        if ac[k] > 0.3 * ac[0]: out.append(sr / k)
    return np.median(out) if out else 0
if len(sys.argv) == 2 and sys.argv[1].endswith('.wav'):
    print(round(f0(sys.argv[1]))); sys.exit()
for d in sys.argv[1:]:
    vals = {os.path.basename(p)[:-4]: f0(p) for p in sorted(glob.glob(d + '/*.wav')) if not p.endswith('voice.wav')}
    m = np.median([v for v in vals.values() if v])
    print(os.path.basename(os.path.dirname(d)), ' '.join(f'{k}:{v:.0f}' for k, v in vals.items()), '| afwijkend:', [k for k, v in vals.items() if abs(v - m) / m > 0.18])
