# Groeiplan: top 5 in het genre, internationaal (17 oktober 2026)

Doel van Jaimy: bij de concurrentie in de top 5 van downloads komen. Downloads van concurrenten zijn niet te meten
zonder betaalde tools. Daarom meten we twee dingen die wel vrij te zien zijn:

1. **Zoekpositie per land** op de genreterm in de eigen taal (iTunes-zoek-API, wekelijks op maandag).
   Top 5 = doel bereikt in dat land.
2. **Aantal beoordelingen** tegenover de concurrent die in dat land op 1 staat. Beoordelingen bepalen de positie
   in de grote markten (zie §2).

## 1. Waar we staan (gemeten 17 okt)

| Land | Genreterm | Wij | #1 in die term (beoordelingen) |
|---|---|---|---|
| BR | sudoku assassinato | **4** | Sudoku Detetive (3) |
| IT | sudoku omicidio | **5** | Mysteryic (0) |
| FR | sudoku meurtre | 7 | Murdoria (0) |
| ES | sudoku asesinato | 7 | Enigmic (2.313) |
| MX | sudoku asesinato | 7 | Murder Sudoku: Tiny Crimes (103) |
| TR | cinayet sudoku | 9 | Murder Sudoku: Cozy Culprits (1) |
| NL | moord sudoku | 12 | Enigmic (1.886) |
| KR | 살인 스도쿠 | 13 | 스도쿠 탐정 (10) |
| RU | детектив судоку | 16 | Детектив Судоку (19) |
| JP | 殺人数独 | 20 | Enigmic (47) |
| DE | mord sudoku | 21 | Enigmic (807) |
| US | crime sudoku | 30 | Enigmic (2.162) |
| GB | crime sudoku | 47 | Enigmic (242) |
| US/GB | murder sudoku | niet in top 200 | Enigmic / Tiny Crimes |

Wij: 0 beoordelingen in de VS en het VK, 1 in NL. Bezoekers komen bijna alleen via App Store-zoeken (30 dagen);
TikTok leverde in 7 dagen 8 profielweergaven. Paginaweergaven 10 t/m 16 okt: Spaanstalig 25, NL 20, VS 13, SA 9.

## 2. Wat dit betekent

- **In kleine markten winnen we op taal.** In BR en IT staan we al in de top 5; in FR, ES, MX en TR op 7 tot 9. Daar
  hebben de nummers 1 weinig beoordelingen. Een paar beoordelingen en een In-App Event kunnen ons daar naar de top 5 tillen.
- **In de VS, het VK en Duitsland winnen we niet zonder beoordelingen.** Enigmic heeft er honderden tot duizenden.
  Teksten zijn daar niet het knelpunt.
- **TikTok levert nog geen downloads.** Het blijft een loterij met goedkope loten (TIKTOK-PLAN §1); we houden het klein
  en meten de route (Metricool tegenover Buffer, week 3).

## 3. Volgorde (wat eerst, en wie)

| # | Actie | Waarom | Wie | Status |
|---|---|---|---|---|
| 1 | **In-App Event "Zaak van de week"** in alle 20 winkeltalen | Events staan in zoekresultaten en op de Vandaag-pagina, per land, gratis. Grootste hefboom in de landen waar we al 4 tot 9 staan. | Claude (`store/events/asc-event.js`) | ingediend 17 okt, loopt 26 okt t/m 25 nov |
| 2 | **Featuring-nominatie 1.3** (20 talen, meesterniveau) | Eén nominatie per release is gratis; 1.3 is de grootste update tot nu toe | Claude via `asc-nominatie.js` | ingediend 17 okt (ebb2170c) |
| 3 | **Beoordelingen** | Vraagmomenten zitten al in de app (tweede zaak, cadeauwereld, zaak van de week; `app.js` maybeAskReview). Meer kan alleen door meer spelers. Beloning voor een beoordeling mag niet. | — | staat |
| 4 | **Promotietekst per taal** elke week roteren met de zaak van de week | Kost niets, geen review nodig | Claude, wekelijks | te doen |
| 5 | **Spaanstalige content** (`social/es/`, 7 carrousels klaar) | Grootste groep bezoekers; het genre ging in Spanje viraal | Jaimy maakt het account, Claude plant | wacht op account |
| 6 | **Engels TikTok-account** (`social/en/`, 21 carrousels klaar) | 36 van de opens zijn Engels | Jaimy maakt het account, Claude plant | wacht op account |
| 7 | **Makers met een gratis Crimson Pass-code** (BR, IT, ES, MX: puzzel- en BookTok) | Wordbolt werd zo nummer 1 in Zweden; kleine makers in kleine markten zijn goedkoop | Claude zoekt 15 makers en schrijft de berichten; Jaimy verstuurt | te doen |
| 8 | **Eigen productpagina** voor "murder sudoku" (US/GB) | Pas zinvol met meer beoordelingen | later | later |

Niet doen: betaalde Apple Ads (besluit Jaimy), beloning voor beoordelingen, accounts per taal zonder bereik in het eerste.

## 4. Meten

Elke maandag in de taak `crimson-social`: zoekposities uit de tabel van §1, beoordelingen per land
(`itunes.apple.com/lookup?id=6812534368&country=<cc>`), paginaweergaven per land in App Store Connect.
Doel per land vastleggen in `social/LOGBOEK.md` zodra het in de top 5 staat.
