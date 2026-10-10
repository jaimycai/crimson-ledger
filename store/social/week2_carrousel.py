"""Builds the week 2 cases as photo carousels (the format of post 4, the first post with reach).

Same four slides as week 1 (hook on an AI still, crime scene, statements, call to action), with the
rotating hooks from week2.py: a hook about the viewer, the app name only on the last slide.
    python3 store/social/week2_carrousel.py   (run from store/social)
"""
import os
from compose import hook, band, statements, cta, case
from week2 import CASES, HOOKS

STILLS = ["still-0.8.png", "still-2.6.png", "still-4.7.png"]
OUT = "week2c"

def build(k, cid):
    c = case(cid); secs = 15 if len(c["statements"]) <= 5 else 25
    h = HOOKS[k % len(HOOKS)].format(t=secs)
    out = f"{OUT}/{k + 1:02d}-{cid}"; os.makedirs(out, exist_ok=True)
    slides = [hook(STILLS[k % len(STILLS)], h, f"{c['title']} · {len(c['suspects'])} verdachten"),
              band(f"cases/{cid}/board.png", "De plaats delict. De dader was als enige in de kamer van het slachtoffer."),
              statements(c), cta("Weet jij het?", "Zet de naam in de reacties. Het antwoord volgt morgen.")]
    for j, s in enumerate(slides): s.save(f"{out}/{j + 1}.jpg", quality=90)
    open(f"{out}/tekst.txt", "w").write(
        f"{h} 🔍 Beeld 1 is gemaakt met AI. {c['title']}: lees de verklaringen en zet je antwoord in de reacties.\n\n"
        f"#moordraadsel #raadsel #wieishetgeweest #detective #breinbreker #puzzel #logica #whodunnit\n\n"
        f"ANTWOORD (na 24 uur vastpinnen als reactie): {c['suspects'][c['murderer']]}. Speel de hele zaak in Crimson Ledger.\n")
    print(k + 1, cid, c["title"], "|", h)

if __name__ == "__main__":
    for k, cid in enumerate(CASES): build(k, cid)
