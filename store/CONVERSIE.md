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
| 1 | **Genrewoord in naam en ondertitel, per taal** | Voorstel hieronder; gaat mee met de volgende versie (naam en ondertitel kunnen alleen met een nieuwe versie). | 1.5 · **klaar** (`store/metadata/1.5.0-namen.json`) |
| 2 | **Nieuwe eerste drie schermafbeeldingen** | Dikke schreefloze kop, 2-4 woorden, lichte achtergrond, bord ingezoomd zodat rooster en portretten het beeld vullen. Beeld 1: "Sudoku + moord" in de taal van de winkel; beeld 2: één verklaring groot met het bord; beeld 3: "Zaak gesloten" met sterren. Eerst twee richtingen laten zien (vakmanschap: referenties eerst), dan alle talen. | **klaar 28-10**: Jaimy koos A "in een iPhone"; alle negen beelden in die stijl, 20 talen, `store/make-store-cards.js`. Beeld 3 werd "Eindeloos puzzelen" (Jaimy: "16 werelden klinkt niet aantrekkelijk"). Mee in 1.5 |
| 3 | **A/B-test van de winkelpagina (Product Page Optimization)** | Oude tegen nieuwe schermafbeeldingen, zonder nieuwe build. Levert de echte conversie per variant. Ruimer dan eerst gepland: alle 23 winkeltalen, 50% van het verkeer, zodat er sneller genoeg gegevens zijn. | ingediend 29-10, wacht op Apple; alle 23 talen 9/9 verwerkt. Stand: `node store/asc-experiment.js list` |
| 4 | **Eerder om een beoordeling vragen** | Nu pas na 5 zaken; maar 21% haalt die. Ook vragen na de eerste ★★★ vanaf zaak 3, nooit na een fout. Apple staat 3 vragen per jaar toe. | 1.5 · **klaar** (`668f671`) |
| 5 | **Conversie per land meten** | App Store Connect: vertoningen, paginaweergaven en downloads per land en per bron, plus de vergelijking met de branche. | **gemeten 8-11**: zie "Conversie per land" onderaan. Opnieuw rond 19-11 (14 dagen na 1.6.0) |

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

## Namen 1.5, per winkeltaal (28-10-2026)

Uitwerking van punt 1, na "ja namen" van Jaimy. Naam, ondertitel en zoekwoorden voor alle 23 winkeltalen staan in
`store/metadata/1.5.0-namen.json`; ze gaan mee met versie 1.5. Er staat nog niets in App Store Connect. Dit vervangt het
voorstel hierboven.

**Hoe gemeten (28-10, rond 20:00).** iTunes-zoek-API, top 50 voor 132 zoektermen in 23 winkels; ondertitels van de
concurrenten van apps.apple.com; en de zoeksuggesties van de App Store per winkel, dus wat mensen echt typen.
"Plek" in de tabel = plek in de zoekresultaten van vandaag; "suggestie" = staat in de zoeksuggesties.

**Wat de metingen aan het voorstel veranderden**
- **ES/MX**: "sudoku crimen" is suggestie 5 na "sudoku" (MX: 10) en suggestie 1 op "sudoku cr", en geen concurrent heeft
  het in de naam. "sudoku asesinato" komt in de suggesties alleen als appnaam voor. Dus Crimen in de naam; "asesinatos" en
  "detective" (suggestie 1 op "sudoku d") in de ondertitel. Met "Sudoku Asesinato" wordt de naam 32 tekens.
- **IT**: Omicidi in plaats van Delitto. Suggesties: "risolvi omicidi", "omicidi", "giochi omicidi"; "delitto" alleen
  "cena con delitto". Met "Sudoku Omicidio" wordt de naam 31 tekens; "omicidio" staat in de zoekwoorden.
- **BR/PT**: in PT is "sudoku crime" suggestie 5 na "sudoku" en 1 op "sudoku c". In BR is "sudoku detetive" suggestie 1 op
  "sudoku det", maar met "Sudoku Detetive" wordt de naam 31 tekens. Dus Sudoku Crime in de naam, en "jogo de detetive"
  (suggestie in beide) en "assassinato" in de ondertitel.
- **NL**: ondertitel "Vind de dader, zonder reclame" in plaats van "Moordmysterie zonder reclame". "Moord Sudoku ·
  Moordmysterie" herhaalt zichzelf, op "vind de dader" stonden we 17 okt op 1, en "sudoku zonder reclame" is suggestie 1
  op "sudoku z". "moordmysterie" blijft zoekwoord.
- **EN**: ondertitel "Mystery logic puzzles, no ads". "murder mystery" (naam plus ondertitel) en "logic puzzles" zijn
  bovenste suggesties in de VS en het VK.
- **"Geen reclame"** in de eigen taal staat in bijna elk land hoog in de suggesties na "sudoku" (zonder reclame, ohne
  Werbung, sin anuncios, sans pub, senza pubblicità, sem anúncio, reklamsız, без рекламы, không quảng cáo, 광고 없음,
  広告なし). Waar het past staat het in de ondertitel, anders in de zoekwoorden.
- **Geen "killer"-woorden in de naam**: "سودوكو القاتل" (SA) en "katil sudoku" (TR) geven Killer Sudoku, een rekenpuzzel.
- **RU**: met "Судоку-детектив" (suggestie 6 na "судоку") wordt de naam 31 tekens. Daarom "Детектив" in de naam en
  "Судоку" vooraan in de ondertitel; de zoekterm valt zo over naam en ondertitel.
- **hi, mr, te, bn, ur**: in eigen schrift wordt bijna niet gezocht (0 of 1 resultaat, geen suggesties). In India en
  Pakistan typen zoekers "murder sudoku" en heten alle concurrenten zo. De naam is daarom de klankvertaling van Murder
  Sudoku; het eigen woord voor detective staat in de ondertitel, het eigen woord voor moord in de zoekwoorden.
- **FR**: met de Franse spatie voor de dubbele punt is de naam 31 tekens; daarom een gewone dubbele punt.

| Taal | Naam: oud → nieuw | Ondertitel: oud → nieuw | Genrewoord | Bron (plek vandaag; wij) |
|---|---|---|---|---|
| nl-NL | Vind de dader → **Moord Sudoku** | Moord sudoku zonder reclame → Vind de dader, zonder reclame | moord sudoku | "moord sudoku": Enigmic 1 (ondertitel), Motive 3, CrimeDoku 6, Mysteryic 7; wij 12. "murder sudoku" (suggestie 1 op "murder s") dekt en-GB, dat NL ook leest (ASO.md). |
| en-US | Crime Sudoku → **Murder Sudoku** | Murder mystery logic, no ads → Mystery logic puzzles, no ads | murder sudoku | Suggestie 1 op "murder s". "murder sudoku": Enigmic 1 (ondertitel), Tiny Crimes 2, Whodoku 3, GridNoir 4, Cozy Culprits 5; wij niet in top 50 ("crime sudoku": 28). |
| en-GB | Crime Sudoku → **Murder Sudoku** | Murder mystery logic, no ads → Mystery logic puzzles, no ads | murder sudoku | "murder sudoku": Tiny Crimes 1, Whodoku 2, Enigmic 3, GridNoir 4, Logic Puzzles 5; wij niet in top 50 ("crime sudoku": 21). |
| ar-SA | لعبة محقق → **سودوكو الجريمة** | سودوكو جريمة قتل بدون إعلانات → لعبة محقق: لغز قتل بلا إعلانات | سودوكو جريمة | "سودوكو جريمة": Mysteryic 1, Sudoku Detective 2, Enigmic 3 (Engelse namen met "Murder"); wij 5; "سودوكو جريمة قتل": wij 3. Suggesties "لغز الجريمة", "لعبة محقق", "سودوكو بدون نت". |
| bn-BD | গোয়েন্দা গেম → **মার্ডার সুডোকু** | খুনের রহস্য, যুক্তির ধাঁধা → গোয়েন্দা ধাঁধা, বিজ্ঞাপন নেই | Murder Sudoku (klank) | De zoek-API kent de winkel BD niet (0 resultaten, ook voor "sudoku"). Buurwinkels IN en PK: suggestie "murder sudoku", alle concurrenten Engels. |
| de-DE | Detektivspiel → **Mord-Sudoku** | Mord-Sudoku ohne Werbung → Krimi-Rätsel ohne Werbung | Mord-Sudoku | "mord sudoku": Enigmic 1 (ondertitel "Mord Sudoku", naam "Krimi-Rätsel"), Murdoria 7, Mysteryic 8; wij 9. "Krimi-Sudoku": Cluedoku 3, CrimeDoku 6, Roomdoku 10; wij 14. Suggesties "krimi spiele", "sudoku ohne werbung", "mordfall lösen". |
| es-ES | Detectives → **Sudoku Crimen** | Sudoku de asesinatos y lógica → Resuelve asesinatos, detective | sudoku crimen | Suggestie 5 na "sudoku"; in geen enkele naam (Enigmic 1 "crímenes", Crimoku 5); wij 19. "sudoku asesinato": Murdoria 3, Sudoku Detective 4, Mysteryic 5, Roomers 6; wij 8. "sudoku detective": wij 17. |
| es-MX | Detectives → **Sudoku Crimen** | Sudoku de asesinatos y lógica → Resuelve asesinatos, detective | sudoku crimen | Suggestie 10 na "sudoku", plus "crimen detective". "sudoku crimen": Whodoku 1, GridNoir 2, Enigmic 4; wij 19. "sudoku asesinato": Sudoku Detective 2, Roomers 3, Murdoria 4, Mysteryic 5; wij 6. |
| fr-FR | Jeu d'enquête → **Sudoku Meurtre** | Sudoku meurtre, sans pub → Enquête criminelle, sans pub | sudoku meurtre | "sudoku meurtre": Sudoku Détective 1, Mysteryic 2, Murdoria 3, Cluedoku 6 (ondertitel); wij 8. Suggesties "enquête criminelle", "enquete meurtre", "sudoku sans pub". |
| hi | जासूसी गेम → **मर्डर सुडोकू** | मर्डर मिस्ट्री वाली तर्क पहेली → जासूसी पहेली, बिना विज्ञापन | Murder Sudoku (klank) | IN: suggestie "murder sudoku"; Tiny Crimes 1, Whodoku 2, Enigmic 3, GridNoir 4; wij niet in top 50 ("crime sudoku": 9). "हत्या सुडोकू" 1 resultaat, "मर्डर सुडोकू" 0. |
| id | Game Detektif → **Sudoku Misteri** | Sudoku pembunuhan tanpa iklan → Game detektif pembunuhan | sudoku misteri, game detektif | Concurrenten Engels; "sudoku detektif": Sudoku Detective 1, Cluedoku 2; wij 8 van 10. Suggesties "game detektif", "game misteri", "game pembunuhan". Met "Sudoku Detektif" of "Sudoku Pembunuhan" wordt de naam 31 of 33 tekens. "sudoku misteri": wij 18. |
| it | Detective → **Sudoku Omicidi** | Sudoku omicidio: chi è stato? → Detective senza pubblicità | sudoku omicidio | "sudoku omicidio": Mysteryic 1, Enigmic 2 (ondertitel), Sudoku Detective 4, Murdoria 6 ("Sudoku Omicidi"), Cluedoku 7; wij 3. Suggesties "risolvi omicidi", "giochi omicidi", "sudoku senza pubblicità". |
| ja | 犯人探しの推理ゲーム → **殺人数独** | 殺人数独：広告なしの論理パズル → 犯人探しの推理ゲーム・広告なし | 殺人数独 | "殺人数独": Enigmic 1 (ondertitel), 数独探偵：殺人事件推理ゲーム 4, Mysteryic 殺人ナンプレ 9; wij 5. "犯人 数独": wij 2. Suggesties "犯人探しゲーム", "推理ゲーム", "数独 広告なし". |
| ko | 범인 찾기 추리 게임 → **살인 스도쿠** | 살인 스도쿠 · 광고 없는 논리 퍼즐 → 범인 찾기 추리 게임, 광고 없음 | 살인 스도쿠 | "살인 스도쿠": 스도쿠 탐정: 살인 사건 1, Enigmic 2 (ondertitel), Murdoria 4, Mysteryic 7; wij 13 (laatste). Suggesties "범인 찾기", "추리 게임", "스도쿠 광고". |
| mr-IN | गुप्तहेर खेळ → **मर्डर सुडोकू** | खून, रहस्य आणि तर्काची कोडी → गुप्तहेर कोडी, जाहिराती नाहीत | Murder Sudoku (klank) | Als hi; Marathi in eigen schrift: 0 resultaten. |
| pt-BR | Ache o Culpado → **Sudoku Crime** | Sudoku de assassinato e lógica → Jogo de detetive: assassinato | sudoku crime, sudoku detetive | "sudoku detetive" (suggestie 1 op "sudoku det"): Sudoku Detetive 1, Detetive Sudoku 3, Cluedoku 4; wij 17. "sudoku crime": Enigmic 1, Whodoku 2, CrimeDoku 3; wij 14. "sudoku assassinato": Sudoku Detetive 1; wij 4. |
| pt-PT | Detetive → **Sudoku Crime** | Sudoku de assassinato e lógica → Jogo de detetive: assassinato | sudoku crime | Suggestie 5 na "sudoku", 1 op "sudoku c". "sudoku crime": Enigmic 1, Crimoku 4, CrimeDoku 5; wij 28. "sudoku assassinato": Enigmic 1, Sudoku Detetive 2; wij 9. |
| ru | Найди убийцу → **Детектив** | Детектив-судоку без рекламы → Судоку-убийство без рекламы | судоку-детектив | Suggestie 6 na "судоку", 1 op "судоку д". "детектив судоку": Детектив Судоку 1, Whodoku 2, Enigmic 3 (ondertitel), Cluedoku 4; wij 17 (laatste). Suggesties "судоку без рекламы", "детектив кто убийца". |
| te-IN | డిటెక్టివ్ ఆట → **మర్డర్ సుడోకు** | హత్య మిస్టరీ లాజిక్ పజిల్స్ → డిటెక్టివ్ ఆట, ప్రకటనలు లేవు | Murder Sudoku (klank) | Als hi; Telugu in eigen schrift: 0 resultaten. |
| tr | Dedektif Oyunu → **Cinayet Sudoku** | Reklamsız cinayet sudoku → Reklamsız dedektif oyunu | cinayet sudoku | Geen Turkse concurrentnaam; "cinayet sudoku": Cozy Culprits 1, Cluedoku 2, GridNoir 4 (Engels); wij 5. "dedektif sudoku": wij 3. Suggesties "cinayet oyunu", "dedektif oyunu", "sudoku reklamsız". |
| ur-PK | جاسوسی گیم → **مرڈر سوڈوکو** | قتل کا معمہ، منطقی پہیلیاں → جاسوسی پہیلیاں، بغیر اشتہارات | Murder Sudoku (klank) | PK: suggestie "murder sudoku"; Logic Puzzles 1, Tiny Crimes 2, Whodoku 3, Enigmic 4; wij 46. Urdu schrift: geen suggesties. |
| vi | Thám tử phá án → **Sudoku Thám Tử** | Sudoku án mạng: tìm hung thủ → Phá án mạng, không quảng cáo | sudoku thám tử | Suggesties "game thám tử", "game phá án", "sudoku không quảng cáo"; "án mạng" alleen als appnaam. "sudoku thám tử": Detective Sudoku 1, Cluedoku 4; wij 6. "sudoku án mạng": wij 37. |
| zh-Hans | 侦探推理破案游戏 → **谋杀数独** | 谋杀数独：无广告的逻辑解谜 → 找出凶手的侦探推理游戏·无广告 | 谋杀数独 | China gesloten (app daar niet te koop). Referentie TW/HK: "謀殺數獨" bij Enigmic 1 (ondertitel); "偵探數獨": app 偵探數獨 1, Cluedoku 3. CN-suggesties "侦探推理游戏", "推理游戏". |

**Lengtes gecontroleerd met een script** (tekens geteld als `[...s].length`): alle 23 talen binnen de grenzen. Naam
hoogstens 30/30 (ar-SA, bn-BD, fr-FR, id, it, tr, vi), ondertitel hoogstens 30/30 (ar-SA, es-ES, es-MX), zoekwoorden
hoogstens 100/100 (de-DE, it). Geen zoekwoord herhaalt een woord uit naam of ondertitel, geen spaties naast komma's, geen
merknamen van anderen (Murdle, Cluedo, Enigmic, Murdoku en "Mordoku" staan er niet in).

**Meten na 1.5**: dezelfde termen als in de kolom Bron, 7 en 14 dagen na goedkeuring (GROEI §4).

## Conversie per land (gemeten 8-11-2026)

Uitwerking van punt 5. Vraag Jaimy: "We hebben veel vertoningen maar weinig downloads. De meeste downloads komen uit NL,
terwijl we veel meer vertoningen uit andere landen krijgen. Komt het door de landingspagina of door ongebruikelijke woorden?
Japan heeft bijvoorbeeld veel vertoningen maar amper downloads."

**Hoe gemeten.** App Store Connect Analytics, 9 oktober t/m 7 november 2026 (30 dagen), per land en per bron. Opgehaald in
de ingelogde Chrome-tab met `POST /analytics/api/v1/data/timeseries` (measures `impressionsTotal`, `pageViewCount`,
`units`, `redownloads`; group `storefront` of `source`). Zoekposities dezelfde dag via de iTunes-zoek-API (`limit=200`).

### Totaal

21.409 vertoningen, 904 paginaweergaven, 224 eerste downloads. Conversie volgens App Store Connect: 1,4% (daggemiddelde).
Buiten NL komt 97 tot 100% van de vertoningen uit App Store-zoeken.

### Per land

| Land | Vertoningen | Paginaweergaven | Downloads | Vertoning → pagina | Pagina → download |
|---|---|---|---|---|---|
| VS | 3.663 | 105 | 26 | 2,9% | 25% |
| Saoedi-Arabië | 3.215 | 103 | 21 | 3,2% | 20% |
| Japan | 2.348 | 63 | 6 | 2,7% | 10% |
| Brazilië | 1.246 | 26 | 7 | 2,1% | 27% |
| Turkije | 1.148 | 17 | 4 | 1,5% | 24% |
| Rusland | 1.139 | 38 | 12 | 3,3% | 32% |
| Mexico | 1.065 | 45 | 9 | 4,2% | 20% |
| Frankrijk | 783 | 28 | 16 | 3,6% | 57% |
| Colombia | 617 | 29 | 14 | 4,7% | 48% |
| **Nederland** | 567 | 161 | 30 | **28,4%** | 19% |
| Duitsland | 499 | 19 | 8 | 3,8% | 42% |
| Spanje | 409 | 43 | 12 | 10,5% | 28% |
| Italië | 275 | 29 | 9 | 10,5% | 31% |
| **Alles behalve NL** | 20.842 | 743 | 194 | **3,6%** | **26%** |

Alleen via zoeken: NL 503 vertoningen en 121 paginaweergaven (24%), Japan 2.317 en 52 (2,2%), VS 3.611 en 76 (2,1%),
Saoedi-Arabië 3.209 en 103 (3,2%).

### Wat het zegt

1. **Het verlies zit niet op de winkelpagina.** Wie de pagina opent, downloadt buiten NL vaker (26%) dan in NL (19%). De
   pagina en de vertalingen zijn dus niet de oorzaak.
2. **Het verlies zit in de lijst met zoekresultaten.** Buiten NL tikt 2 tot 4% door op ons, in NL 28%. Dat gebeurt voordat
   iemand de pagina ziet.
3. **Nederlanders zoeken ons bij naam.** Op "crimson ledger" staan we op plek 1. Die zoekers komen via TikTok NL en
   bekenden, en tikken bijna altijd door.
4. **In de andere landen komen de vertoningen uit brede zoektermen, waarop we laag staan.** Wie "sudoku" of "数独" zoekt,
   wil meestal een gewone sudoku en scrollt langs ons heen. Apple telt een vertoning al na 1 seconde in beeld.
5. **Beoordelingen tellen per land.** NL heeft 6 beoordelingen (4,7★). In elk ander land staat er 0, naast concurrenten met
   honderden tot duizenden.

### Japan

- Zoekposities op 8-11 (live 1.6.0, naam 数独×謎解き): 数独 plek 76 van 189; ナンプレ, 謎解き, 推理, 推理ゲーム en 探偵
  niet in de top 190; 犯人探し 40. Op combinaties wel hoog: 数独 犯人 plek 3, mystery sudoku 3, 謎解き 数独 7, crime
  sudoku 18.
- De Japanse beschrijving en het eerste beeld ("数独で解くミステリー") lezen natuurlijk. De woorden zijn niet de oorzaak.
- Japanse zoekers gebruiken vaker ナンプレ dan 数独, en 数独 is een merk van Nikoli. Het voorstel ナンプレ×謎解き staat in
  `docs/onderzoek/ZOEKWOORDEN-2026-11.md` §6.
- Pagina → download is in Japan het laagst (10%), maar op 63 paginaweergaven is dat geen betrouwbaar getal.

### Wat dit verandert

| # | Wat | Waarom |
|---|---|---|
| 1 | Zoekwoorden van 1.6.1 en ナンプレ×謎解き mee met de volgende versie | Hoger op nichetermen, waar wie zoekt ook ons spel wil |
| 2 | Beoordelingen per land volgen | De vraag na de eerste ★★★ zit in 1.5; 0 beoordelingen is buiten NL het zwakste punt in het zoekresultaat |
| 3 | Opnieuw meten rond 19-11, 14 dagen na 1.6.0 | 1.6.0 staat sinds 5-11 live; bijna alle cijfers hierboven horen bij oudere versies |
| 4 | Optioneel: kleine Apple Ads-campagne (Search Match) in JP en VS | De enige bron die laat zien op welke zoektermen we echt verschijnen. Kost geld; keuze van Jaimy |

A/B-test "Bold iPhone cards" (punt 3) op 8-11: origineel 2,23%, nieuw 2,42% (+8,41%), volgens Apple nog niet beslist.

### Wat een zoeker ziet, en wat er in 1.6.1 veranderde (8-11)

Apple-benchmark (puzzelapps, gratis met aankopen, week 19-25 okt): onze conversie 1,26%, mediaan 1,34%, bovenste kwart
2,85%. Het zoekresultaat op ware grootte naast Enigmic, Tiny Crimes en Motive liet drie dingen zien:

1. **Het eerste vak was een kale schermopname.** Elke taal had een preview-video. Apple zet die in het zoekresultaat
   vooraan en speelt hem af. Vanaf seconde 0 een vol bord met piepkleine tekst, zonder kop en zonder "sudoku". Door de
   video viel ook beeld 3 uit het zoekresultaat (Apple toont video plus beeld 1 en 2).
2. **Onze koppen zijn kleiner en ons bord drukker** dan bij de concurrenten, die in alle drie de vakken een grote kop en
   een eenvoudig rooster met grote portretten tonen.
3. **De naam begon met een merk dat niemand kent.** Een zoeker las eerst "Crimson Ledger" en pas daarna het genre.

Besluit Jaimy, 8-11, mee in 1.6.1 (build 22, zelfde code als 1.6.0, ingediend 8-11):
- Preview-video's uit alle 23 talen. Het zoekresultaat toont nu de drie kaarten met kop. De video's staan nog in
  `store/previews/`.
- Genre vooraan, merk achteraan: "Mystery Sudoku: Crimson Ledger", "ナンプレ×謎解き: Crimson Ledger", enzovoort.
  `check-1.6.1.js` eist nu die vorm.
- Geen "murder" in welke taal dan ook, ook niet in het onzichtbare trefwoordveld; "murdoku" (merk van een ander) ook weg.

Volgende stappen: A/B-test (PPO) zodra 1.6.1 live is; nieuwe kaarten met een kop van ongeveer 25% van de hoogte en een
eenvoudig, ingezoomd bord; een video v2 die in de eerste 2 seconden de kop toont, pas daarna testen tegen geen video.
