"""Original soundtrack for the TikTok/Reels videos: a ticking clock over a low drone with a sparse piano motif.

Scheduled posts go out without a sound picked in the TikTok app, so every video carries its own
audio. Everything here is synthesised, so there are no rights to clear.
    python3 geluid.py <seconds> <out.wav>
"""
import sys, wave
import numpy as np

SR = 44100
NOTES = [220.00, 261.63, 329.63, 293.66, 261.63, 220.00, 196.00, 220.00]  # A3 C4 E4 D4 C4 A3 G3 A3


def tick(freq, length=0.06):
    t = np.arange(int(SR * length)) / SR
    click = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.006)
    noise = np.convolve(np.random.default_rng(int(freq)).standard_normal(t.size), np.ones(6) / 6, "same") * np.exp(-t / 0.002) * 0.3
    return (click + noise) * np.minimum(1, t / 0.0005)


def piano(freq, length=3.2):
    t = np.arange(int(SR * length)) / SR
    tone = sum(a * np.sin(2 * np.pi * freq * h * t) for h, a in ((1, 1.0), (2, 0.45), (3, 0.2), (4, 0.08)))
    return tone * np.exp(-t / 0.7) * np.minimum(1, t / 0.005) * np.minimum(1, (length - t) / 0.3)


def track(seconds):
    n = int(SR * seconds)
    t = np.arange(n) / SR
    swell = 0.75 + 0.25 * np.sin(2 * np.pi * 0.08 * t - np.pi / 2)
    drone = sum(a * np.sin(2 * np.pi * f * t) for f, a in ((55.0, 0.5), (55.4, 0.35), (82.41, 0.3), (110.0, 0.2), (130.81, 0.08))) * swell
    out = 0.22 * drone
    for k, start in enumerate(np.arange(0.5, seconds - 0.2, 1.0)):  # tick, tock, once per second
        s = tick(2300 if k % 2 == 0 else 1750); i = int(start * SR); j = min(n, i + s.size)
        out[i:j] += 0.30 * s[: j - i]
    for k, start in enumerate(np.arange(1.0, seconds - 1.5, 3.0)):  # piano motif, one note every three seconds
        s = piano(NOTES[k % len(NOTES)]); i = int(start * SR); j = min(n, i + s.size)
        out[i:j] += 0.18 * s[: j - i]
    fade = np.minimum(1, np.minimum(t / 0.6, (seconds - t) / 1.5))
    out *= np.clip(fade, 0, 1)
    return out / max(1e-9, np.abs(out).max()) * 0.8


def loudness(path):
    """Integrated loudness in LUFS, measured by ffmpeg."""
    import re, subprocess
    log = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", log)[-1])


def write(seconds, path):
    mono = (track(seconds) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(np.column_stack([mono, mono]).tobytes())


if __name__ == "__main__":
    write(float(sys.argv[1]), sys.argv[2])
