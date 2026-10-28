# Waarom zoekers ons overslaan, en wat we eraan doen (28-10-2026)

Vraag Jaimy: "Hoe krijgen we een hogere conversie als mensen ons zoeken of de app tegenkomen in de store? Is dat bij alle
talen zo aantrekkelijk met de tekst en foto's erbij? We hebben best prima mooie foto's."

## Wat een zoeker ziet

In een zoekresultaat staan per app alleen: icoon, naam, sterren met aantal beoordelingen, en de eerste drie
schermafbeeldingen op postzegelformaat. Op die vier dingen kiest iemand in een paar tellen. Vergelijking per land
(iTunes Search, 28-10, top 5 plus wij; zie `store/zoekresultaat-es-2026-10-28.jpg`):

| Land en zoekterm | Wij | Bovenaan |
|---|---|---|
| ES "sudoku asesinato" | 8 · "Crimson Ledger: **Detectives**" · 0 beoordelingen | Enigmic 2.372 · Tiny Crimes 704 · Murdoria "**Sudoku Asesinato**" · Sudoku Detective "**Asesinato**" · Mysteryic "**Sudoku Asesinato**" |
| MX "sudoku asesinato" | 6 · "Detectives" · 0 | Tiny Crimes 109 · vier apps met "Sudoku Asesinato" in de naam |
| BR "sudoku assassinato" | 4 · "Ache o Culpado" · 0 | Sudoku Detetive "**Assassinato**" · Enigmic 87 · Tiny Crimes 20 |
| IT "sudoku omicidio" | 3 · "**Detective**" · 0 | Mysteryic "**Sudoku Omicidio**" · Enigmic 436 |
| FR "sudoku meurtre" | 8 · "Jeu d'enquête" · 1 | Sudoku Détective "**Meurtre**" · Mysteryic, Murdoria "**Sudoku Meurtre**" |
| DE "mord sudoku" | 9 · "Detektivspiel" · 0 | Enigmic 871 · Tiny Crimes 76 · Cluedoku "**Krimi-Sudoku**" |
| NL "moord sudoku" | 12 · "Vind de dader" · 5 | Enigmic 1.964 · Motive "**Moord Sudoku**" · Tiny Crimes 311 |
| US "crime sudoku" | niet in top 25 | Enigmic 2.289 · Tiny Crimes 233 · GridNoir 31 |

## De vier oorzaken, op volgorde van gewicht

1. **Onze naam zegt niet wat de zoeker zocht.** Wie "sudoku asesinato" typt, ziet vijf apps die letterlijk "Sudoku
   Asesinato" heten en dan ons: "Detectives". Dat leest als een ander soort spel. Behalve in het Engels ("Crime Sudoku")
   staat het genrewoord nergens in onze naam. De naam is ook het zwaarste zoekwoord voor de positie: dubbel verlies.
2. **0 beoordelingen naast honderden tot duizenden.** In elk land behalve NL en FR staat er bij ons niets. Dat is het
   eerste vertrouwenssignaal in een zoekresultaat.
3. **Onze schermafbeeldingen zijn mooi op ware grootte, maar niet op postzegelformaat.**
   - Onderschrift in een dunne schreefletter, klein, op een donkerbruine achtergrond. De concurrenten gebruiken een
     dikke schreefloze letter, groot, 2-4 woorden, op een lichte, felle achtergrond ("RESUELVE CRÍMENES EN SUDOKUS",
     "UN ASESINATO. UNA SOLUCIÓN.").
   - Ons bord is klein in de telefoon, met veel knoppen eromheen. Bij hen vult het bord het beeld: je ziet in één blik
     "rooster + personages = puzzel".
   - Geen van onze drie eerste beelden zegt "sudoku". Bij hen staat het genre in beeld 1.
   - Ons derde beeld (de wereldkaart) is in klein formaat een vage kronkellijn.
4. **Het icoon is in orde.** Een getekend gezicht, net als Tiny Crimes; Enigmic springt eruit met fel oranje. Niet het
   eerste werk.

Dat het in elke taal zo is, komt door punt 1 en 3: de namen per taal kozen we op 7 oktober voor aantrekkingskracht
("Vind de dader", "Detectives"), voordat het genre zich in de winkel als "sudoku + moord" vestigde. De beelden zijn in alle
20 talen hetzelfde ontwerp.

## Wat we doen

| # | Wat | Hoe | Wanneer |
|---|---|---|---|
| 1 | **Genrewoord in naam en ondertitel, per taal** | Voorstel hieronder; gaat mee met de volgende versie (naam en ondertitel kunnen alleen met een nieuwe versie). | 1.5 |
| 2 | **Nieuwe eerste drie schermafbeeldingen** | Dikke schreefloze kop, 2-4 woorden, lichte achtergrond, bord ingezoomd zodat rooster en portretten het beeld vullen. Beeld 1: "Sudoku + moord" in de taal van de winkel; beeld 2: één verklaring groot met het bord; beeld 3: "Zaak gesloten" met sterren. Eerst twee richtingen laten zien (vakmanschap: referenties eerst), dan alle talen. | ontwerp nu, mee in 1.5 |
| 3 | **A/B-test van de winkelpagina (Product Page Optimization)** | Oude tegen nieuwe schermafbeeldingen in ES, MX, BR, IT, FR, zonder nieuwe build. Levert de echte conversie per variant. | zodra 2 klaar is |
| 4 | **Eerder om een beoordeling vragen** | Nu pas na 5 zaken; maar 21% haalt die. Ook vragen na de eerste ★★★ vanaf zaak 3, nooit na een fout. Apple staat 3 vragen per jaar toe. | 1.5 |
| 5 | **Conversie per land meten** | App Store Connect: vertoningen, paginaweergaven en downloads per land en per bron, plus de vergelijking met de branche. De sessie in Chrome is verlopen; na opnieuw inloggen haal ik het op. | zodra Jaimy inlogt |

### Voorstel naam en ondertitel (30 tekens max)

| Winkel | Naam | Ondertitel |
|---|---|---|
| es-ES / es-MX | Crimson Ledger: Sudoku Crimen | Sudoku de asesinato y lógica |
| pt-BR | Crimson Ledger: Sudoku Crime | Sudoku assassinato e lógica |
| it | Crimson Ledger: Sudoku Delitto | Sudoku omicidio, pura logica |
| fr-FR | Crimson Ledger: Sudoku Meurtre | (huidige, of "Enquêtes logiques sans pub") |
| de-DE | Crimson Ledger: Mord-Sudoku | Krimi-Rätsel ohne Werbung |
| nl-NL | Crimson Ledger: Moord Sudoku | Moordmysterie zonder reclame |
| en-US / en-GB | Crimson Ledger: Murder Sudoku | (huidige) |

Let op: "Vind de dader" (NL) en "Crime Sudoku" (EN) koos een sparringronde op 7 oktober. De metingen sindsdien (NL plek 12,
VS buiten de top 25) zeggen dat het genrewoord zwaarder weegt. Woordregel "geen moord/murder" geldt alleen voor TikTok.
