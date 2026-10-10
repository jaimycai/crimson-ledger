# Motion-werkwijze voor de video's van Crimson Ledger

*10 oktober 2026. Besluit van Jaimy: elke video volgt voortaan de drie niveaus uit "The 3 Levels of AI
Motion Graphics" (RoboNuggets). De algemene regels staan in de skill `vakmanschap`
(`~/.claude/skills/vakmanschap/SKILL.md`). Dit bestand legt uit hoe het in deze repo werkt.*

## Waarom

De video's tot en met week 2 (`week2.py`, `compose.py`) zijn stilstaande dia's: één beeld met alle
tekst, een getal dat aftelt, Georgia als letter. Er beweegt niets. De nieuwe video's zijn HTML-scènes
in de huisstijl van de app (Playfair Display, Inter, de echte plattegrond en portretten), met beweging
en eigen geluid, en Jaimy stuurt bij vóór er gerenderd wordt.

## De stappen

1. **Gegevens ophalen.** De app draait op poort 8093 (preview `crimson-www`).

       node store/social/studio/haal.js 3:0

   Schrijft `motion/c3-0/plan.png` (lege plattegrond, scherp), `zaak.json` en `zaak.js`: kamers met
   hun plek op de plattegrond, verdachten met hun eigen SVG-portret, het slachtoffer, de verklaringen
   en het antwoord.

2. **Storyboard (niveau 2).**

       node store/social/studio/bord.js "raadsel.html?zaak=c3-0"

   Maakt per scène een still en `motion/c3-0/bord.html`. Open die pagina, klik op een plek in een beeld
   om een opmerking te pinnen, en kopieer alles met één knop. Plak de lijst in de chat. Claude past elke
   opmerking toe en verandert niets anders. Dan een nieuw bord of door naar stap 3.

3. **Bewegen en renderen (niveau 3).**

       node store/social/studio/render.js "raadsel.html?zaak=c3-0" --snel

   Maakt `motion/c3-0/v<N>/video.mp4` (met `--snel` op halve grootte) en `review.html`. Daarin: afspelen,
   1x en 2x, tijdlijn, pins op het beeld, "♪ Geluid" voor opmerkingen over wat je hoort, en de randen van
   een scène slepen als een knip niet goed zit. Kopieer alles en plak het in de chat. Pas als Jaimy
   "klaar" zegt: zonder `--snel` renderen (1080 x 1920, 30 fps, -16 LUFS).

4. **Inplannen.** Zoals altijd via Metricool als concept; zie `TIKTOK-PLAN.md`.

## Hoe een videopagina werkt

- `studio/kern.js` geeft elke pagina een podium van 1080 x 1920 en `window.COMP = { duration, scenes,
  cues, seek(t) }`. De pagina tekent alles uit `render(t)`; dezelfde t geeft altijd hetzelfde beeld.
- `?t=4.2` bevriest de pagina op dat moment. `bord.js` en `render.js` gebruiken dat.
- `scenes` heeft per scène een starttijd, een still-moment, een titel en een beschrijving. Die staan op
  het storyboard en in de tijdlijn van de reviewpagina.
- `cues` is de lijst geluiden (`tik`, `tik-hard`, `slag`, `whoosh`, `puls`, `klik`, `gong`).
  `klank.py` maakt daar een spoor van, bovenop de bas en het pianomotief uit `geluid.py`.
- `studio/raadsel.html?zaak=<id>` is het sjabloon voor "wie is de moordenaar?"-video's. De timing volgt
  uit de zaak: 2,2 s per verklaring, een klok van 15 s (25 s als de verklaringen anders niet passen).

## Stand

- 10 okt 2026: gereedschap gebouwd en getest. Eerste storyboard: `motion/c3-0/bord.html` ("De stille
  zee", 12 shots, 27 s), nog zonder beweging. Wacht op Jaimy's opmerkingen.
- Bekend: de plattegrond uit de app kapt het kamerlabel "VOORRAADKAMER" af (ook in de app zelf).
