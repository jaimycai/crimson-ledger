# DESIGN.md — Crimson Ledger

*Opgesteld op 10 oktober 2026 volgens de skill `vakmanschap` (trucs 01, 02, 03, 05 en 07). De
app-waarden komen uit `style.css` en `themes.js`. De keuzes voor video komen uit een vergelijking
op Refero Styles en Fontshare. Bouw elk scherm, elke winkelafbeelding en elke video volgens dit
bestand. Wijk je af, pas dan eerst dit bestand aan.*

## 1. Karakter

Een logboek van een rechercheur. Bordeauxrode inkt op crèmepapier, een plattegrond als bewijsstuk,
en een gezellige "cozy whodunnit" in plaats van een gruwelfilm. Rustig en precies. Elke hoek van
het scherm voelt als papier en inkt.

Twee standen:
- **Papier** (de app, winkelbeelden): crème ondergrond, wijnrode inkt, goud als randversiering.
- **Kluis** (TikTok, Reels, trailers): bijna zwart, crèmewitte letters, één rode accentkleur voor
  het moment van spanning en goud voor de klok.

## 2. Referenties (Refero Styles, 10 okt 2026)

Gekozen uit de zoekvraag "dark noir detective mystery, oxblood red, parchment, vintage serif":

1. **Daylit**: "Burgundy ink on cream parchment — a modern ledger". Bijna letterlijk onze
   app. Daaruit nemen we: één wijnrode inkt voor tekst, randen en de hoofdknop; grote koppen met
   strakke spatiëring; platte vlakken, haarlijnranden, één zachte schaduw alleen op het grootste
   niveau. https://styles.refero.design/style/5076959f-f849-4b50-8f8a-2040d4756f98
2. **Slash**: "Midnight vault with gilded ledger lines". Het voorbeeld voor de kluisstand: bijna
   zwart doek, een serif met veel contrast op extreme grootte tegenover een rustige schreefloze
   letter, en één warme koper- of goudkleur als accent.
   https://styles.refero.design/style/7c38e84b-aea0-4c8f-b3e9-60b994ee6c6b
3. **Henry**: "Gothic broadside poster on warm cream paper". Daaruit komt de regel voor
   videohaken: een scherm draagt twee of drie enorme woorden, en scènes wisselen tussen papier
   en inkt zoals een krant. https://styles.refero.design/style/ff4b9eff-dc0b-4886-bd65-c2f5e9069318

Mix (truc 07): de kleuren en vlakken van Daylit voor de app, het donkere doek en de letters van
Slash voor video, en het scherm met weinig woorden van Henry voor elke haak.

## 3. Kleur

| Token | Waarde | Gebruik |
|---|---|---|
| `--bg-primary` | `#FAF5EF` | papier, ondergrond van de app |
| `--bg-secondary` | `#F3EDE3` | tweede vlak, banden |
| `--bg-card` | `#FFFFFF` | kaarten |
| `--text-primary` | `#2C1810` | inkt, alle hoofdtekst |
| `--text-secondary` | `#5A3E2B` | tweede tekst |
| `--text-light` | `#6B5445` | hulptekst (niet kleiner dan 13 px) |
| `--accent` | `#8B2E1C` | wijnrood: hoofdknop, actieve stand, het enige sterke accent |
| `--accent-light` | `#A8432E` | ingedrukt of hover |
| `--gold` / `--gold-light` | `#B8955C` / `#D4B074` | randen, medailles, de klok; nooit als tekst op wit |
| `--border` / `--border-light` | `#D4C4B0` / `#E8DDD0` | haarlijnen |
| `--success` / `--error` | `#2E7D32` / `#C62828` | alleen voor goed of fout bij het oplossen |

**Kluisstand (video)**: doek `#140B08` met een zachte radiale gloed naar `#2A1810`, tekst `#FAF5EF`,
gedempte tekst `#C9B7A4`, goud `#E8BE78`, rood `#C43E26`. Rood alleen voor het slachtoffer, de
laatste drie seconden en "Tijd!".

Kamerkleuren en verdachtekleuren komen per wereld uit `themes.js`. Verzin ze niet opnieuw.

## 4. Typografie

**App, nu**: koppen in Playfair Display (400–900, cursief beschikbaar), tekst in Inter
(variabel). Beide staan in `assets/fonts/` (SIL OFL, vrij te verspreiden). Typeschaal in
`style.css`: vooral 0,7–1 rem voor UI-tekst, 1,5 rem en groter voor koppen.

**Video, sinds 10 okt 2026**: **Zodiak** (Fontshare, serif met veel contrast) voor koppen en
**General Sans** (Fontshare) voor tekst. Gekozen uit vier paren, naast elkaar getest in echte
videobeelden: Playfair + Inter (huidig), Zodiak + General Sans, Boska + Satoshi, Gambetta +
Switzer. Zodiak gaf de haak "15 seconden?" en "Tijd!" het meeste gewicht, en lijkt het meest op
de didone van Slash. Boska is het reservepaar.

**Licentie**: Fontshare-fonts zijn gratis voor commercieel gebruik in elk medium. Closed-source
fonts vallen onder de ITF Free Font License: **de fontbestanden mogen niet openbaar gedeeld
worden**. Deze repo is openbaar. Daarom:
- video's laden de fonts via `api.fontshare.com` en de MP4 bevat alleen beeld (mag);
- **nooit** Fontshare-bestanden in deze repo committen;
- voor de app: ofwel een open-source (OFL) font kiezen, ofwel de bestanden buiten git houden en
  bij de build toevoegen. Eerst de licentie op de pagina van het font zelf controleren.

**Voorstel (nog niet besloten)**: de app overzetten naar Zodiak + General Sans in de volgende
versie met merkbare verbeteringen (zie de regel over gebundelde updates). Tot dan blijft de app
op Playfair + Inter.

Regels:
- Koppen: zwaar (700–900), strakke spatiëring (−0,5 tot −1 px op grote maten).
- Hoogstens drie lettergroottes per scherm. De stap tussen kop en tekst is minstens 1,25×.
- Cursief alleen voor verhaaltekst en sfeerzinnen ("dood gevonden in de Voorraadkamer").

## 5. Vorm, ruimte, beweging

- Hoeken: `--radius-sm` 6 px (velden), `--radius-md` 12 px (kaarten), `--radius-lg` 20 px
  (panelen), `--radius-full` voor pillen en portretten.
- Schaduw: `--shadow-sm` en `--shadow-md` voor kaarten, `--shadow-lg` alleen voor het grootste
  paneel. Geen gekleurde gloed rond knoppen (impeccable: dark-glow).
- Beweging in de app: `--duration-fast` 0,15 s, `--duration-mid` 0,3 s, `--duration-slow` 0,5 s;
  `--ease-out` voor binnenkomen, `--ease-spring` alleen voor een beloning.
- Iconen: geen zelfgetekende iconen. Portretten, meubels en het slachtoffer komen uit
  `avatars.js` (SVG). Nieuwe UI-iconen: één pakket, één stijl (Tabler via iconify.design).

## 6. Video (TikTok, Reels, Shorts)

- 1080 × 1920, 30 fps, −16 LUFS, eigen geluid (`store/social/studio/klank.py`).
- Veilige zone: belangrijke inhoud tussen y 160 en 1600 en links van x 960 (TikTok-knoppen).
- Werkwijze: storyboard met pins, dan beweging, dan review, dan pas de definitieve render. Zie
  `store/social/MOTION-WERKWIJZE.md`.
- Eén idee per scène. Een haak draagt hoogstens acht woorden.

## 7. Copy

Uit `store/TIKTOK-PLAN.md` §9 en `store/ASO.md`:
- Een haak gaat over de kijker of een getal ("Kun jij de dader vinden in 15 seconden?"), niet
  over de app.
- De naam van de app komt pas op de laatste dia of in de laatste scène.
- Kort, Nederlands, geen uitroeptekens behalve "Tijd!". Geen AI-woorden ("ontdek", "ultiem",
  "naadloos", "duik in").
- Nog te doen (truc 06): de vijf sterkste puzzel- en moordmysterie-apps in de Nederlandse winkel
  bestuderen (koppen, eerste scherm, knoppen) en de patronen hier als regels toevoegen.
