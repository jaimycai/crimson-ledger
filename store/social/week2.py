"""Builds week 2 for TikTok: 21 short "who is the killer?" riddle videos, three a day (8-14 Oct 2026).

Each video: hook in the first second, the floor plan and every statement on one screen, a countdown,
then "answer in the comments". The answer is never shown; it goes in tekst.txt to pin after 24 hours.
Needs the cases captured first: node store/social/capture.js 1:0 1:1 ...
    python3 store/social/week2.py
"""
import json, os, subprocess
from PIL import Image, ImageDraw, ImageFont
import geluid
W, H = 1080, 1920
GB = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"; GI = "/System/Library/Fonts/Supplemental/Georgia Italic.ttf"; GR = "/System/Library/Fonts/Supplemental/Georgia.ttf"
BG, CREAM, RED, GOLD, SOFT = (22, 13, 9), (250, 245, 239), (196, 62, 38), (232, 190, 120), (190, 170, 150)
F = lambda p, s: ImageFont.truetype(p, s)
OUT = "week2"

def wrap(d, text, font, maxw):
    out, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if d.textlength(t, font=font) <= maxw: cur = t
        else: out.append(cur); cur = w
    out.append(cur); return out

def center(d, y, text, font, fill, maxw=W - 140, lh=1.2):
    for l in wrap(d, text, font, maxw):
        d.text(((W - d.textlength(l, font=font)) / 2, y), l, font=font, fill=fill); y += int(font.size * lh)
    return y

# Same order of three per day; the hook rotates so no two videos in a row open the same way.
HOOKS = ["Kun jij de dader vinden in {t} seconden?", "Ze spreken allemaal de waarheid. Wie is de moordenaar?",
         "Lukt dit jou zonder te gokken?", "Eén van hen was alleen met het slachtoffer. Wie?",
         "Lees mee. Wie heeft het gedaan?", "{t} seconden. Eén moordenaar. Jij?", "Speurneus? Bewijs het."]
SLOTS = ["12:00", "16:00", "21:00"]
DAYS = ["do 8 okt", "vr 9 okt", "za 10 okt", "zo 11 okt", "ma 12 okt", "di 13 okt", "wo 14 okt"]
CASES = ["c3-0", "c1-2", "c4-0", "c1-0", "c2-1", "c3-2", "c2-0", "c3-3", "c4-4", "c3-1", "c1-3", "c5-0",
         "c4-1", "c2-2", "c1-4", "c1-1", "c3-4", "c4-2", "c5-2", "c2-3", "c3-5"]

def board_box(src):
    """Bounding box of the dark frame around the floor plan, between the story and the suspect bar."""
    px = src.load(); bottom = next(y for y in range(330, src.height) if min(px[10, y]) > 250)
    mask = src.crop((0, 315, src.width, bottom)).convert("L").point(lambda v: 255 if v < 60 else 0)
    x0, y0, x1, y1 = mask.getbbox(); return (x0, 315 + y0, x1, 315 + y1)

def board_screen(cid, c, secs, hook, left):
    """One frame: hook on top, story, floor plan, statements, countdown."""
    src = Image.open(f"cases/{cid}/board.png").convert("RGB")
    im = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(im)
    y = center(d, 70, hook.format(t=secs), F(GB, 66), CREAM) + 10
    story = src.crop((0, 145, 1080, 315)).resize((960, 151))
    im.paste(story, (60, y)); y += 165
    n = len(c["statements"]); bs = 640 if n <= 5 else 560
    plan = src.crop(board_box(src)); pw = bs if plan.width >= plan.height else int(bs * plan.width / plan.height)
    plan = plan.resize((pw, int(pw * plan.height / plan.width))); im.paste(plan, ((W - pw) // 2, y)); y += plan.height + 25
    size = 40 if n <= 5 else 34
    for s in c["statements"]:
        name = s["who"] + ": "; d.text((70, y), name, font=F(GB, size), fill=GOLD)
        x0 = 70 + d.textlength(name, font=F(GB, size)); lines = wrap(d, s["text"], F(GR, size), W - 150 - x0)
        for l in lines: d.text((x0, y), l, font=F(GR, size), fill=CREAM); y += int(size * 1.22)
        y += int(size * 0.3)
    # countdown badge, bottom right of the plan area
    r = 78; cx, cy = W - 110, 70 + 66 * 2 + 300
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=RED if left <= 3 else (60, 30, 22), outline=GOLD, width=5)
    t = str(left); f = F(GB, 76); d.text((cx - d.textlength(t, font=f) / 2, cy - 44), t, font=f, fill=CREAM)
    return im

def end_screen():
    im = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(im)
    y = center(d, 520, "Tijd!", F(GB, 150), RED); y = center(d, y + 40, "Wie is de moordenaar?", F(GB, 86), CREAM)
    y = center(d, y + 50, "Zet je antwoord in de reacties. Het juiste antwoord volgt morgen.", F(GI, 54), SOFT)
    icon = Image.open("../../icon-1024.png").convert("RGBA").resize((190, 190)); m = Image.new("L", (190, 190), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, 190, 190], 42, fill=255); im.paste(icon, ((W - 190) // 2, 1380), m)
    center(d, 1600, "Meer zaken: Crimson Ledger, in de App Store", F(GI, 42), GOLD); return im

def build(k, cid):
    c = json.load(open(f"cases/{cid}/case.json")); day, slot = DAYS[k // 3], SLOTS[k % 3]
    secs = 15 if len(c["statements"]) <= 5 else 25; hook = HOOKS[k % len(HOOKS)]
    out = f"{OUT}/{k + 1:02d}-{day.split()[1]}okt-{slot.replace(':', '')}-{cid}"; os.makedirs(out + "/f", exist_ok=True)
    frames = [(board_screen(cid, c, secs, hook, secs - i), 1.0) for i in range(secs)] + [(end_screen(), 3.0)]
    lst = []
    for j, (im, sec) in enumerate(frames): p = f"{out}/f/{j:02d}.png"; im.save(p); lst.append((p, sec))
    with open(f"{out}/f/list.txt", "w") as fh:
        for p, sec in lst: fh.write(f"file '{os.path.abspath(p)}'\nduration {sec}\n")
        fh.write(f"file '{os.path.abspath(lst[-1][0])}'\n")
    geluid.write(sum(s for _, s in lst) + 0.5, f"{out}/f/geluid.wav")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", f"{out}/f/list.txt", "-i", f"{out}/f/geluid.wav",
                    "-vf", "fps=30,format=yuv420p", "-af", f"volume={-16 - geluid.loudness(out + '/f/geluid.wav'):.1f}dB,alimiter=limit=0.89",
                    "-c:v", "libx264", "-crf", "20", "-c:a", "aac", "-b:a", "160k", "-ar", "44100", "-shortest", "-movflags", "+faststart", f"{out}/video.mp4"], check=True)
    im = frames[0][0]; im.save(f"{out}/cover.jpg", quality=90); subprocess.run(["rm", "-rf", f"{out}/f"])
    open(f"{out}/tekst.txt", "w").write(
        f"{hook.format(t=secs)} 🔍 {c['title']}. Zet je antwoord in de reacties, morgen volgt het juiste antwoord. "
        f"Moordraadsels om zelf op te lossen: Crimson Ledger in de App Store.\n\n"
        f"#moordraadsel #raadsel #wieishetgeweest #detective #breinbreker #puzzel #logica #whodunnit\n\n"
        f"PLANNING: {day} {slot}\nANTWOORD (na 24 uur vastpinnen als reactie): {c['suspects'][c['murderer']]}.\n")
    print(k + 1, day, slot, cid, c["title"], "|", secs, "s | dader:", c["suspects"][c["murderer"]])

if __name__ == "__main__":
    import sys
    picks = [int(a) - 1 for a in sys.argv[1:]] or range(len(CASES))
    for k in picks: build(k, CASES[k])
