"""Builds week 1 for TikTok/Reels from the captured cases: carousels (JPEG) and videos (frame lists)."""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import geluid
W, H = 1080, 1920
GB = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"; GI = "/System/Library/Fonts/Supplemental/Georgia Italic.ttf"; GR = "/System/Library/Fonts/Supplemental/Georgia.ttf"
CREAM, RED, INK, SOFT = (250, 245, 239), (139, 46, 28), (44, 24, 16), (110, 90, 78)
F = lambda p, s: ImageFont.truetype(p, s)
def wrap(d, text, font, maxw):
    out, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if d.textlength(t, font=font) <= maxw: cur = t
        else: out.append(cur); cur = w
    out.append(cur); return out
def center(d, y, text, font, fill, maxw=W - 160, lh=1.22):
    for l in wrap(d, text, font, maxw):
        d.text(((W - d.textlength(l, font=font)) / 2, y), l, font=font, fill=fill); y += int(font.size * lh)
    return y
def hook(still, big, small):
    im = Image.open(still).convert("RGB").resize((W, H)); im = ImageEnhance.Brightness(im).enhance(0.55)
    d = ImageDraw.Draw(im); y = center(d, 560, big, F(GB, 118), (255, 250, 240)); center(d, y + 50, small, F(GI, 56), (235, 220, 200)); return im
def band(src, text, size=58):
    im = Image.open(src).convert("RGB").resize((W, H)); ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    f = F(GB, size); lines = wrap(d, text, f, W - 140); lh = int(size * 1.25); h = lh * len(lines) + 70
    d.rectangle([0, 0, W, h + 30], fill=(44, 24, 16, 240)); y = 50
    for l in lines: d.text(((W - d.textlength(l, font=f)) / 2, y), l, font=f, fill=(255, 250, 240, 255)); y += lh
    return Image.alpha_composite(im.convert("RGBA"), ov).convert("RGB")
def statements(case):
    im = Image.new("RGB", (W, H), CREAM); d = ImageDraw.Draw(im)
    y = center(d, 150, "De verklaringen", F(GB, 88), RED); y = center(d, y + 10, "Eén van hen was alleen met het slachtoffer.", F(GI, 44), SOFT) + 60
    n = len(case["statements"]); size = 50 if n <= 5 else 42 if n <= 7 else 38
    for s in case["statements"]:
        d.text((90, y), s["who"], font=F(GB, size), fill=RED); y += int(size * 1.3)
        for l in wrap(d, "“" + s["text"] + "”", F(GR, size), W - 180): d.text((90, y), l, font=F(GR, size), fill=INK); y += int(size * 1.28)
        y += int(size * 0.7)
    return im
def cta(top, sub):
    im = Image.new("RGB", (W, H), CREAM); d = ImageDraw.Draw(im)
    y = center(d, 330, top, F(GB, 96), RED); y = center(d, y + 40, sub, F(GI, 54), INK)
    icon = Image.open("../../icon-1024.png").convert("RGBA").resize((300, 300)); m = Image.new("L", (300, 300), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, 300, 300], 66, fill=255)
    im.paste(icon, ((W - 300) // 2, 1010), m); y = center(d, 1350, "Crimson Ledger", F(GB, 84), RED); center(d, y + 10, "Elke dag een nieuwe zaak. Gratis in de App Store.", F(GI, 46), INK); return im
def case(i): return json.load(open(f"cases/{i}/case.json"))
def carousel(day, i, still, level):
    c = case(i); out = f"week1/dag{day}-carrousel"; os.makedirs(out, exist_ok=True)
    slides = [hook(still, "Wie is de moordenaar?", f"{c['title']} · {len(c['suspects'])} verdachten · {level}"),
              band(f"cases/{i}/board.png", "De plaats delict. De dader was als enige in de kamer van het slachtoffer."),
              statements(c), cta("Weet jij het?", "Zet de naam in de reacties. Het antwoord volgt morgen.")]
    for k, s in enumerate(slides): s.save(f"{out}/{k + 1}.jpg", quality=92)
    open(f"{out}/tekst.txt", "w").write(f"Wie is de moordenaar? 🔍 Lees de verklaringen en zet je antwoord in de reacties.\n\n#moordraadsel #raadsel #detective #logicpuzzle #whodunnit #breinbreker #puzzel\n\nANTWOORD (na 24 uur vastpinnen als reactie): {c['suspects'][c['murderer']]}. Speel de hele zaak in Crimson Ledger.\n")
def video(day, name, frames, caption_file_text):
    out = f"week1/dag{day}-{name}"; os.makedirs(out + "/f", exist_ok=True); lst = []
    for k, (im, sec) in enumerate(frames): p = f"{out}/f/{k:02d}.png"; im.save(p); lst.append((p, sec))
    with open(f"{out}/f/list.txt", "w") as fh:
        for p, sec in lst: fh.write(f"file '{os.path.abspath(p)}'\nduration {sec}\n")
        fh.write(f"file '{os.path.abspath(lst[-1][0])}'\n")
    geluid.write(sum(sec for _, sec in lst) + 0.5, f"{out}/f/geluid.wav")  # scheduled posts carry their own sound
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", f"{out}/f/list.txt", "-i", f"{out}/f/geluid.wav", "-vf", "fps=30,format=yuv420p", "-af", f"volume={-16 - geluid.loudness(out + '/f/geluid.wav'):.1f}dB,alimiter=limit=0.89", "-c:v", "libx264", "-crf", "20", "-c:a", "aac", "-b:a", "160k", "-ar", "44100", "-shortest", "-movflags", "+faststart", f"{out}/video.mp4"], check=True)
    subprocess.run(["rm", "-rf", f"{out}/f"]); open(f"{out}/tekst.txt", "w").write(caption_file_text)
def solve(day, i):
    c = case(i); fr = [(band(f"cases/{i}/board.png", f"Kun jij '{c['title']}' oplossen? Wie was alleen met het slachtoffer?"), 3.5)]
    for k, name in enumerate(c["suspects"]):
        st = next((s for s in c["statements"] if s["whoIdx"] == k), None)
        fr.append((band(f"cases/{i}/step-{k + 1}.png", f"{name}: “{st['text']}”" if st else f"{name} past alleen nog hier."), 3.2))
    fr.append((band(f"cases/{i}/accuse.png", "Iedereen staat. Wie was er alleen in die kamer?"), 3.0))
    fr.append((band(f"cases/{i}/closed.png", "Zaak gesloten. Had jij hem goed?"), 2.5)); fr.append((cta("Jouw beurt.", "Elke dag een nieuwe moordzaak, op te lossen met pure logica."), 2.8))
    video(day, "meelossen", fr, f"Los mee: {c['title']} 🔍 Had jij de dader eerder dan ik?\n\n#moordraadsel #raadsel #detective #logicpuzzle #puzzel #breinbreker\n")
def howto(day, i):
    c = case(i); s0 = c["statements"][0]
    fr = [(hook("still-2.6.png", "Zo los je een moord op", "in drie stappen"), 2.5),
          (band(f"cases/{i}/board.png", "1. Elke verdachte zegt waar hij stond. Lees een verklaring."), 4.0),
          (band(f"cases/{i}/step-1.png", "2. Zet de verdachte op de enige plek die klopt. Groen is goed."), 4.0),
          (band(f"cases/{i}/step-{len(c['suspects'])}.png", "3. Staat iedereen? Wie alleen was met het slachtoffer is de dader."), 4.5),
          (band(f"cases/{i}/closed.png", "Geen gokwerk. Alleen logica."), 2.5), (cta("Probeer het zelf.", "De eerste 96 zaken zijn gratis."), 2.8)]
    video(day, "uitleg", fr, "Zo werkt een moordraadsel op een plattegrond: drie stappen, geen gokwerk 🔍\n\n#moordraadsel #raadsel #uitleg #logicpuzzle #detective #puzzel\n")
carousel(1, 2, "still-0.8.png", "makkelijk"); solve(2, 0); howto(3, 1); carousel(4, 3, "still-2.6.png", "gemiddeld")
solve(5, 4); carousel(6, 5, "still-4.7.png", "gemiddeld"); carousel(7, 6, "still-0.8.png", "pittig")
print("ok")
