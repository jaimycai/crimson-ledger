# Versie 1.3 — meer zaken en een eerlijk meesterniveau

*Begonnen 14 okt 2026, terwijl 1.2.1 (nieuw icoon) bij Apple lag. Jaimy koos: twee delen per wereld erbij en
moeilijkere zaken, en "bekijk de reviews van onze concurrenten zodat wij daar beter in zijn en echte waarde leveren".*

## Wat erin zit

| Onderdeel | Stand | Waar |
|---|---|---|
| Deel VII en VIII voor alle acht werelden: 128 zaken, van 384 naar 512 (gratis van 96 naar 128) | klaar in nl en en; 18 talen in vertaling | `campaign.js`, `i18n/en.js`, bron in `docs/delen-1.3/` |
| Meesterniveau: 9×9, vijf verdachten, zwakkere directe aanwijzingen | klaar | `floorplan.js` (DIFF/WEIGHTS `meester`), vrij spel, deel VII/VIII |
| Eerlijk moeilijk: elke meesterzaak is stap voor stap op te lossen zonder gokken, heeft een kamer als houvast en hooguit twee "links van/hoger dan" | klaar; alle 128 nieuwe zaken slagen | `FloorPlan.stepwise`, generator |
| Zaak van de week op meesterniveau, onderscheiding Meesterspeurder (vijf meesterzaken; 24 in totaal) | klaar | `progress.js`, `board.js` |
| Verder waar je was: één onafgemaakte campagne-, dag- of weekzaak blijft bewaard | klaar | `board.js` (`saveResume`/`restoreResume`) |
| Klok verbergen (rustige stand) | klaar | instellingen, `app.js` |
| Winkelteksten 1.3 in 23 winkeltalen, bijschriften 512/24, aankoopteksten 64 zaken in 8 delen | in de maak | `store/metadata/1.3.0.json`, `store/cards-text/`, `store/iap-texts.js` |

## Waarom (uit `docs/REVIEWS-1.3.md`, 15.861 reviews van 23 apps)

- "Niet eerlijk" (meer oplossingen, gokken nodig) is de op één na grootste klacht (95 reviews, 2,3★), vaak juist
  bij moeilijke levels. Daarom de stapsgewijze toets.
- "Moeilijk is echt moeilijk, en ik kies zelf" scoort het hoogst (4,9★); "te makkelijk" 2,7★. Daarom een apart
  meesterniveau, vrij te kiezen.
- Fans spelen snel alles uit ("76 levels in een week"): 128 nieuwe zaken.
- Lange zaken: hervatten en een rustige stand zonder klok.

## Nog niet (later)

Kruisjes-modus en rij/kolom dimmen, zoom op 9×9, afsluitregel per zaak (wie en waarom), gemiste dagzaken
naspelen, Game Center-ranglijst. Zie de lijst in `docs/REVIEWS-1.3.md` §5.
