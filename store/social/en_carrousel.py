"""English photo carousels for Instagram, YouTube Shorts and TikTok, in the style of Enigmic's store pages:
light pastel background, one bold headline per slide with one coloured word, the real board large in the middle.
No AI image, so no AI label is needed. The answer goes in tekst.txt, never on a slide.
Needs English captures first:  LANG_CAPTURE=en node store/social/capture.js 3:0 1:2 ...
    python3 store/social/en_carrousel.py   (run from store/social)
"""
import json, os
from PIL import Image, ImageDraw, ImageFont
from week2 import CASES, board_box

W, H = 1080, 1920
AV = "/System/Library/Fonts/Avenir Next.ttc"
F = lambda size, idx=8: ImageFont.truetype(AV, size, index=idx)   # 8 = Heavy, 5 = Medium, 0 = Bold
INK, MUTED = (40, 34, 30), (110, 98, 90)
BGS = [(250, 240, 228), (240, 236, 252), (232, 242, 250), (236, 246, 232)]
ACCENTS = [(214, 92, 34), (126, 76, 214), (38, 108, 196), (40, 128, 70)]
SRC, OUT = "cases-en", "en"
HOOKS = [("Can you find the", "killer?"), ("Only one of them was", "alone."), ("Solve it without", "guessing."),
         ("Who did it? You have", "25 seconds."), ("Everyone tells the", "truth."), ("Think like a real", "detective."),
         ("Find the killer with pure", "logic.")]

def wrap(d, text, font, maxw):
    out, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if d.textlength(t, font=font) <= maxw: cur = t
        else: out.append(cur); cur = w
    out.append(cur); return out

def headline(d, y, plain, coloured, accent, size=92):
    """Two-tone headline: the last word(s) in the accent colour, centred, wrapped."""
    f = F(size); words = [(w, INK) for w in plain.split()] + [(w, accent) for w in coloured.split()]
    lines, cur = [], []
    for w in words:
        test = " ".join(x for x, _ in cur + [w])
        if cur and d.textlength(test, font=f) > W - 140: lines.append(cur); cur = [w]
        else: cur.append(w)
    lines.append(cur)
    for line in lines:
        x = (W - d.textlength(" ".join(w for w, _ in line), font=f)) / 2
        for w, c in line:
            d.text((x, y), w, font=f, fill=c); x += d.textlength(w + " ", font=f)
        y += int(size * 1.15)
    return y

def badge(d, y, text, accent):
    f = F(40); tw = d.textlength(text, font=f); x = (W - tw) / 2
    d.rounded_rectangle([x - 28, y, x + tw + 28, y + 64], 32, fill=accent); d.text((x, y + 7), text, font=f, fill=(255, 255, 255))
    return y + 64

def card(im, src, y, width):
    """Paste a crop as a rounded card with a soft border."""
    src = src.resize((width, int(width * src.height / src.width)))
    m = Image.new("L", src.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, *src.size], 36, fill=255)
    x = (W - width) // 2; ImageDraw.Draw(im).rounded_rectangle([x - 6, y - 6, x + width + 6, y + src.height + 6], 40, fill=(255, 255, 255))
    im.paste(src, (x, y), m); return y + src.height

def plan_crop(path):
    src = Image.open(path).convert("RGB"); story = src.crop((0, 120, 1080, 315)); plan = src.crop(board_box(src))
    both = Image.new("RGB", (1080, story.height + plan.height + 20), (245, 238, 228))
    both.paste(story, (0, 0)); both.paste(plan, ((1080 - plan.width) // 2, story.height + 20)); return both

def build(k, cid):
    c = json.load(open(f"{SRC}/{cid}/case.json")); acc = ACCENTS[k % 4]; bg = BGS[k % 4]
    plain, col = HOOKS[k % len(HOOKS)]
    slides = []
    im = Image.new("RGB", (W, H), bg); d = ImageDraw.Draw(im)
    y = headline(d, 200, plain, col, acc, 104); y = badge(d, y + 30, f"{c['title']} · {len(c['suspects'])} suspects", acc)
    card(im, plan_crop(f"{SRC}/{cid}/board.png"), y + 90, 1000); slides.append(im)

    im = Image.new("RGB", (W, H), bg); d = ImageDraw.Draw(im)
    y = headline(d, 130, "Read the", "clues", acc, 96) + 40
    n = len(c["statements"]); size = 48 if n <= 5 else 42
    for s in c["statements"]:
        d.text((100, y), s["who"], font=F(size), fill=acc); y += int(size * 1.3)
        for l in wrap(d, "“" + s["text"] + "”", F(size, 5), W - 200): d.text((100, y), l, font=F(size, 5), fill=INK); y += int(size * 1.3)
        y += int(size * 0.6)
    d.text((100, y + 10), "The killer was the only one in the victim's room.", font=F(36, 5), fill=MUTED); slides.append(im)

    im = Image.new("RGB", (W, H), bg); d = ImageDraw.Draw(im)
    y = headline(d, 150, "Place, eliminate,", "deduce", acc, 96)
    card(im, Image.open(f"{SRC}/{cid}/step-1.png").convert("RGB").crop((0, 120, 1080, 1760)), y + 70, 860); slides.append(im)

    im = Image.new("RGB", (W, H), bg); d = ImageDraw.Draw(im)
    y = headline(d, 330, "Who did it?", "Comment below", acc, 100)
    d.text(((W - d.textlength("Answer in the comments tomorrow.", font=F(46, 5))) / 2, y + 30), "Answer in the comments tomorrow.", font=F(46, 5), fill=MUTED)
    icon = Image.open("../../icon-1024.png").convert("RGBA").resize((300, 300)); m = Image.new("L", (300, 300), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, 300, 300], 66, fill=255); im.paste(icon, ((W - 300) // 2, 960), m)
    d.text(((W - d.textlength("Crimson Ledger", font=F(84))) / 2, 1300), "Crimson Ledger", font=F(84), fill=INK)
    badge(d, 1420, "96 free cases · App Store", acc); slides.append(im)

    out = f"{OUT}/{k + 1:02d}-{cid}"; os.makedirs(out, exist_ok=True)
    for j, s in enumerate(slides): s.save(f"{out}/{j + 1}.jpg", quality=90)
    open(f"{out}/tekst.txt", "w").write(
        f"{plain} {col} 🔍 {c['title']}: read the statements and put your answer in the comments.\n\n"
        f"#murdermystery #logicpuzzle #whodunit #riddle #detective #puzzle #brainteaser #murdersudoku\n\n"
        f"ANSWER (pin as a comment after 24 hours): {c['suspects'][c['murderer']]}. Play the full case in Crimson Ledger.\n")
    print(k + 1, cid, c["title"], "|", plain, col)

if __name__ == "__main__":
    for k, cid in enumerate(CASES): build(k, cid)
