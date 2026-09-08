# Crimson Ledger web — plan en status

Gebaseerd op het herbouwplan uit de Antigravity-chat (1 sept 2026) en het marktonderzoek.
Bijgewerkt: 2 september 2026.

## Fasen

| Fase | Inhoud | Status |
| --- | --- | --- |
| 1 | Logic-grid engine, raster-UI, basis gameplay, 3 niveaus | ✅ klaar en getest |
| 2 | Lerend hintsysteem | ✅ herbouwd op 2 sept: 6 regels, loopt elke puzzel uit, meldt fouten |
| 2 | Verkorte onboarding (< 30 s tot eerste puzzel) | ✅ oefenzaak: eerste "Begin" gaat direct een begeleide 2×2-zaak in (5 stappen, overslaan kan), daarna het menu; opnieuw speelbaar vanuit het menu |
| 3 | Dagelijkse zaak, streak, deelbaar emoji-resultaat | ✅ in app.js |
| 4 | Tweetaligheid NL/EN (`i18n.js`) | ⬜ |
| 4 | Hoofdstukken met meerdere zaken en terugkerende personages | ⬜ |

## Wat er op 2 september is gebeurd

- Hersteld: `story.js` en `logic-engine.js` waren op 1 sept meeverhuisd naar
  `../CrimsonLedger/docs/legacy-web-prototype/`, en `app.js` was overschreven door een oude
  editor-buffer (Sudoku-versie). Alle drie teruggezet.
- Generator: gewogen mix van aanwijzingstypen per niveau (positief / negatief / of / noch),
  minimale set, max. 1 directe aanwijzing op Moeilijk, max. 3 op Gemiddeld.
  Gemeten (40 seeds per niveau): Makkelijk 3–5 aanwijzingen, Gemiddeld 6–8, Moeilijk 9–12.
- Nederlandse tekst: lidwoorden per wapen (het Mes, de Kandelaar), alle categorieparen gedekt.
- HintEngine: fout in raster → directe aanwijzing → rij/kolom wegstrepen → laatste cel →
  of-aanwijzing oplossen → kruisverwijzing tussen blokken. Elke hint heeft een korte tekst
  (niveau 1) en een uitleg (niveau 2), en markeert de aanwijzing in de lijst.
- app.js: onderscheid "fout" en "nog niet compleet" bij Controleer, deel-fallback, uitleg bij
  eerste zaak, localStorage veilig in privémodus.
- Tests in `tests/` (engine + jsdom-spelflow), `npm test`.
- Oefenzaak (`TUTORIAL_CASE` in story.js): vaste puzzel Clara/Marcus × Keuken/Tuin, twee
  aanwijzingen, stappenplan met coach-tekst; alleen de gemarkeerde cel accepteert tikken.
  Wordt na afronden of overslaan onthouden (`crimson-tutorial-done`).
- Hint-teller op de hintknop.

## Wat er op 8 september is gebeurd (na de eerste telefoontest van de iOS-build)

Feedback van Jaimy: "Elimineer" past niet op het startscherm; de kleuren van de
moeilijkheidskeuze zijn niet mooi; in het spel moet alles op één scherm (bord en
verdachten vast, aanwijzingen scrollen); wat is het verschil tussen Plaats en Markeer;
de foutmelding-popup viel achter het Dynamic Island.

- Tagline: "Speur. Redeneer. Ontmasker." (splash, titel, meta-omschrijving).
- Moeilijkheidskiezer: drie kaarten naast elkaar met een mini-plattegrond in het gekozen
  thema (vaste seeds, `App.renderDifficultyPreviews`), verdachten als stipjes en de
  bordmaat (6×6 / 7×7 / 8×8).
- Spelscherm: `100dvh`, bord + verdachtenstrook vast, aanwijzingen scrollen in hun eigen
  vak; bordbreedte volgt de schermhoogte zodat er ruimte blijft voor aanwijzingen.
- Veilige randen: `viewport-fit=cover` + `--sat`/`--sab` op alle schermen, ook de toast.
- Toast: onder de veilige rand, nooit breder dan het scherm, tikken gaan erdoorheen.
- "Markeer" heet nu "Potlood" (✏️); eerste keer een uitleg-toast, ook in "Hoe werkt het?".
- Tests: `tests/board.test.js` dekt previews, themawissel en de eenmalige Potlood-uitleg.
- iOS: `npm run build && npx cap sync ios` gedaan; `ios/App/App/public` is bijgewerkt.

Tweede ronde feedback (zelfde avond, Station Orion op de telefoon): meubel-iconen alleen zijn
te moeilijk ("slaapcapsule", "de module"); het spel trekt je niet genoeg naar binnen.

- Aanwijzingen: meubel-icoon staat nu in de zin zelf; "in een hoek van de module" werd
  "in een hoek" (kamernaam staat al in de zin); tik op een meubel of het slachtoffer toont
  een naamkaartje (`Board.peek`); tik op een aanwijzing laat de kamer, de meubels en de
  genoemde verdachten oplichten (`Board.focusOnClue`).
- Live feedback (de "trekkracht"): elke kaart toont direct of hij klopt met wat er staat
  (groen ✓ als alle genoemde verdachten staan en het klopt, rood ✗ bij een schending,
  via `FloorPlan.holds`); twee verdachten in de kamer van het slachtoffer krijgen een rode
  rand; staat alles goed, dan pulseert Controleer. Het eigen afvinkje is het rondje rechts.
- Doorspelen: na vrij spel of de dagelijkse zaak staat er meteen "Nog een zaak · thema".
- Voortgang: rang in het menu met balk (Rekruut → Speurder 3 → Rechercheur 8 →
  Inspecteur 15 → Hoofdinspecteur 25 → Meesterdetective 40, `App.rankFor`); nieuwe rang
  wordt op het resultaatscherm gemeld.
- Beslissing: fouten direct tonen (zoals sudoku-apps) in plaats van pas bij Controleer —
  Jaimy vindt het spel te moeilijk en wil dat spelers blijven; de hint-engine blijft
  bestaan voor de uitleg.

Derde ronde (zelfde avond): "32 zaken is veel te weinig, we gaan hier zo doorheen" en "wat kan er
nog meer beter, en push het".

- Campagne: 96 vaste zaken in 12 delen (drie per wereld, elk deel acht zaken met eigen titel,
  intro en afsluiting). Deel II/III gaan open als het vorige deel af is; de laatste zaak van een
  deel toont de afsluiting en "Volgende zaak" loopt door naar het volgende deel. Voortgang van
  deel I gebruikt dezelfde sleutels als voorheen (`landhuis-0` …), dus niets gaat verloren.
- Eindeloos archief: genummerde dossiers (`Campaign.archive(n)`, thema wisselt per dossier,
  moeilijkheid loopt mee, seed `200000 + n·9973`), open na 8 campagnezaken; de lijst toont de
  laatste drie opgeloste en de volgende drie. Nooit op.
- Dagelijkse herinnering (alleen iOS, `@capacitor/local-notifications`): schakelaar in de
  instellingen en een knop op het resultaatscherm na de dagelijkse zaak. Eén melding, elke keer
  opnieuw gepland: vandaag 18:30 als de dagelijkse zaak nog open staat, anders morgen; de tekst
  noemt de streak. Op het web onzichtbaar.
- Geluid `clue` als een aanwijzing groen wordt.
- Tests: campagne-test bewijst alle 96 zaken + 12 dossiers uniek oplosbaar, unieke seeds,
  hoofdstuklogica; bordtest dekt de nieuwe campagnelijst (13 secties, 99 kaarten).

## Openstaande punten (volgorde van voorstel)

1. App Store: stappen in `store/CHECKLIST.md` (Apple-account, archiveren, uploaden).
2. Onderscheidingen (eerste zaak, 7 dagen streak, 10× zonder hint) met een eigen scherm.
3. Vierde moeilijkheid "Expert" (9×9, zes verdachten) als beloning vanaf rang Inspecteur.
4. Sterren ook bij vrij spel en de dagelijkse zaak; weekoverzicht van de dagelijkse zaken.
5. Verhaallijn met terugkerende personages tussen de delen (nu: intro/outro per deel).
6. Engelse versie (i18n) voor een grotere markt; Game Center voor streaks en ranglijsten.

## Beslissingen

- 2026-09-01 — Naam Crimson Ledger, geen MurDoku/Murdle/Cluedo — juridisch risico en verwarring.
- 2026-09-01 — Sudoku vervangen door logic-grid — dat is het echte genre.
- 2026-09-02 — Moeilijkheid via de mix van aanwijzingstypen, niet via het aantal — anders wordt "moeilijk" twintig keer "X was niet in Y".
- 2026-09-02 — Hints wijzen de fout in het raster als eerste aan — anders leidt een fout tot hints die nergens toe leiden.
- 2026-09-02 — Geen auto-wegstrepen na ✓ — een hint legt de techniek uit, de speler zet de kruisjes zelf.
- 2026-09-02 — Oefenzaak is 2 categorieën × 2 items met een vast stappenplan, geen gegenereerde puzzel — voorspelbaar, in dertig seconden klaar, en hij vervangt de uitleg-modal bij de eerste keer.
