# Crimson Ledger

Moordmysterie-puzzels op een plattegrond, in het Nederlands. Pure HTML/CSS/JS, geen build-stap, installeerbaar als app (PWA).

Plaats de verdachten op de plattegrond met de aanwijzingen en wijs aan wie alleen was met het slachtoffer.

## Spelen

- **Oefenzaak** bij het eerste bezoek, daarna **Dagelijkse Zaak** (thema wisselt per dag, weekstrook met streak), **Zaak van de week** (iedereen dezelfde, deelbaar), **Campagne** op een **wereldkaart** (12 delen × 8 zaken met sterren, plus een eindeloos archief per wereld) en **Vrij spelen** per wereld en niveau.
- Vier werelden: Het Landhuis, Het Piratenschip, Grand Hotel Aurora, Station Orion — elk met eigen kamers, meubels, verdachten, vloer en kaart. Werelden gaan open naarmate je zaken oplost.
- Aanwijzingen zijn **verklaringen** in de ik-vorm met portret; ze kleuren live groen of rood. Een "Nieuw in dit deel"-kaart legt elke nieuwe soort één keer uit.
- **Inspecteur Van Dam** geeft een briefing voor elke campagnezaak en een opmerking erna.
- **Zaak Gesloten**: stempel, confetti, sterren, punten (basis, tijd, zonder hint, in één keer), rang. Punten, 17 onderscheidingen en een vitrine met 96 bewijsstukken onder "Vitrine".
- Hints leggen de logische stap uit en verklappen nooit de plek.
- Het klassieke deductieraster (de eerdere versie) staat ingeklapt onder "Klassiek deductieraster".

## Lokaal starten

```bash
python3 -m http.server 8080      # of: npm start
open http://localhost:8080
```

## Testen

```bash
npm test   # engine, plattegrond-engine, campagne, voortgang/mentor, e2e (raster) en bord (jsdom)
```

De engine-tests bewijzen voor honderden gegenereerde puzzels én alle 96 campagnezaken dat er precies één oplossing is (onafhankelijk bevestigd met brute force) en dat de aanwijzingssets minimaal zijn.

## Bestanden

| Bestand | Rol |
| --- | --- |
| `index.html` | schermen: splash, menu, campagne, plattegrondzaak, resultaat, klassiek raster, modals |
| `style.css` | design-systeem, bord, campagne, thema-vloeren |
| `floorplan.js` | plattegrond-engine: kamers (incl. L-vormen), meubels, slachtoffer, 17 aanwijzingssoorten, oplosser, minimale aanwijzingssets, hint-engine |
| `board.js` | het speelbord: plaatsen, markeren, ongedaan, hints, moordenaarsvraag, oefenzaak, resultaten, delen |
| `themes.js` | de vier werelden |
| `campaign.js` | 96 vaste zaken in 12 delen (titel, verhaal, bewijsstuk, moeilijkheid, sterren, briefing) + eindeloos archief per wereld |
| `progress.js` | punten, weekstrook, zaak van de week, onderscheidingen, vitrine |
| `mentor.js` | Inspecteur Van Dam: briefing, opmerkingen, "Nieuw!"-uitleg, reacties bij de beschuldiging |
| `assets/` | wereldkaart-achtergronden en de portretten van Van Dam (uit de Figma-mock-ups) |
| `avatars.js` | SVG-portretten, meubels en slachtoffer, zonder externe assets |
| `sound.js` | gesynthetiseerde geluiden (WebAudio) |
| `app.js` | navigatie, thuisscherm, wereldkaart, vitrine, briefing/nieuw deel, dagelijkse zaak, streak, klassiek raster |
| `story.js`, `logic-engine.js` | inhoud en engine van het klassieke deductieraster |
| `manifest.json`, `sw.js`, `icon-*.png` | PWA: installeerbaar, offline via netwerk-eerst cache |
| `tests/` | `engine`, `floorplan`, `campaign`, `progress`, `e2e`, `board` |
| `privacy.html`, `support.html` | privacyverklaring en supportpagina (vereist voor de App Store) |
| `ios/`, `capacitor.config.json`, `build-www.js` | native iOS-app via Capacitor: `npm run ios` (vereist Xcode) |
| `store/` | App Store-metadata, indien-checklist en schermafbeeldingen (1290×2796) |

## Regels

- Elke puzzel is met pure logica oplosbaar en heeft precies één oplossing.
- Hints leggen de stap uit, ze verklappen geen antwoord.
- Gebruik nooit de namen MurDoku, Murdle of Cluedo in UI of code.
