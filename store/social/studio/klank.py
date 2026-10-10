"""Soundtrack for a motion video: a low bed (drone and the piano motif from geluid.py) plus one effect per cue.

The page lists its cues in COMP.cues ({t, s}); render.js writes them to cues.json and calls this. Everything is
synthesised, so there are no rights to clear, and a scheduled post still has sound without picking one in TikTok.
    python3 klank.py cues.json <seconds> out.wav
"""
import json, os, sys, wave
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import geluid

SR = geluid.SR
rng = np.random.default_rng(7)


def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / decay)


def noise(n):
    return rng.standard_normal(n)


def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, "same")


def sfx(kind):
    if kind == "tik":
        return 0.55 * geluid.tick(2300)
    if kind == "tik-hard":
        return hard_tick()
    if kind == "slag":  # low hit for words slamming in
        n = int(SR * 0.9); t = np.arange(n) / SR
        boom = np.sin(2 * np.pi * (70 * np.exp(-t * 3)) * t) * env(n, 0.003, 0.35)
        hit = lowpass(noise(n), 4) * env(n, 0.001, 0.03)
        return 0.9 * boom + 0.35 * hit
    if kind == "whoosh":
        n = int(SR * 0.55); t = np.arange(n) / SR
        shape = np.sin(np.pi * t / t[-1]) ** 2
        return 0.35 * lowpass(noise(n), 18) * shape
    if kind == "puls":  # heartbeat, two thumps
        n = int(SR * 0.7); out = np.zeros(n)
        for start, a in ((0.0, 1.0), (0.22, 0.7)):
            m = int(SR * 0.25); t = np.arange(m) / SR; i = int(start * SR)
            out[i:i + m] += a * np.sin(2 * np.pi * 55 * t) * env(m, 0.004, 0.06)
        return 0.9 * out
    if kind == "klik":
        return 0.4 * geluid.tick(3200, 0.04)
    if kind == "gong":
        n = int(SR * 2.5); t = np.arange(n) / SR
        tone = sum(a * np.sin(2 * np.pi * f * t) for f, a in ((196, 1), (392.8, .5), (523, .3), (781, .15)))
        return 0.5 * tone * env(n, 0.004, 0.8)
    raise ValueError(kind)


def hard_tick():
    n = int(SR * 0.25); t = np.arange(n) / SR
    out = 0.8 * np.sin(2 * np.pi * (90 - 40 * t) * t) * env(n, 0.002, 0.07)
    tk = geluid.tick(1500); out[:tk.size] += 0.7 * tk
    return out


def bed(seconds):
    n = int(SR * seconds); t = np.arange(n) / SR
    drone = sum(a * np.sin(2 * np.pi * f * t) for f, a in ((55.0, 0.5), (55.4, 0.35), (82.41, 0.3), (110.0, 0.2)))
    out = 0.16 * drone * (0.75 + 0.25 * np.sin(2 * np.pi * 0.08 * t - np.pi / 2))
    for k, start in enumerate(np.arange(1.0, seconds - 1.5, 3.0)):
        s = geluid.piano(geluid.NOTES[k % len(geluid.NOTES)]); i = int(start * SR); j = min(n, i + s.size)
        out[i:j] += 0.12 * s[: j - i]
    return out


def build(cues, seconds):
    out = bed(seconds); n = out.size
    for c in cues:
        s = sfx(c["s"])
        i = int(c["t"] * SR); j = min(n, i + s.size)
        if i < n: out[i:j] += s[: j - i]
    t = np.arange(n) / SR
    out *= np.clip(np.minimum(t / 0.05, (seconds - t) / 1.2), 0, 1)
    return out / max(1e-9, np.abs(out).max()) * 0.85


if __name__ == "__main__":
    cues = json.load(open(sys.argv[1])); seconds = float(sys.argv[2])
    mono = (build(cues, seconds) * 32767).astype(np.int16)
    with wave.open(sys.argv[3], "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(np.column_stack([mono, mono]).tobytes())
