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

## Openstaande punten (volgorde van voorstel)

1. Testen op een echte telefoon (tik-gedrag, 5×5-raster op 375 px, fonts).
2. Score op basis van tijd, hints en pogingen; sterren op het resultaatscherm.
3. Tijdstip als vierde categorie op Moeilijk (engine ondersteunt N categorieën al; raster heeft dan een extra blok).
4. Auto-wegstrepen na een ✓ als instelling (nu bewust uit: "geen gokken" blijft eerlijk).
5. Meerdere zaakthema's (nu alleen De Rode Kamer) en hoofdstukken met terugkerende personages.
6. i18n (NL/EN).

## Beslissingen

- 2026-09-01 — Naam Crimson Ledger, geen MurDoku/Murdle/Cluedo — juridisch risico en verwarring.
- 2026-09-01 — Sudoku vervangen door logic-grid — dat is het echte genre.
- 2026-09-02 — Moeilijkheid via de mix van aanwijzingstypen, niet via het aantal — anders wordt "moeilijk" twintig keer "X was niet in Y".
- 2026-09-02 — Hints wijzen de fout in het raster als eerste aan — anders leidt een fout tot hints die nergens toe leiden.
- 2026-09-02 — Geen auto-wegstrepen na ✓ — een hint legt de techniek uit, de speler zet de kruisjes zelf.
- 2026-09-02 — Oefenzaak is 2 categorieën × 2 items met een vast stappenplan, geen gegenereerde puzzel — voorspelbaar, in dertig seconden klaar, en hij vervangt de uitleg-modal bij de eerste keer.
