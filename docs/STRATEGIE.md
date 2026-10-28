# Crimson Ledger: strategie voor groei en in-game (28-10-2026)

Opdracht Jaimy: "analyseer het nog een keer en bedenk goed met alle tools/skills/info ook van
professionals wat onze strategie moet zijn voor zowel in game als dat meer gebruikers het spel gaan
downloaden." Dit document is zelfstandig leesbaar: een volgend model kan er zonder deze chat mee bouwen.
Bronnen: eigen tellers (crimson-meting), App Store Connect, en de onderzoeken in deze repo
(docs/RETENTIE-ONDERZOEK-2026-10-20.md, store/ENIGMIC.md, store/GROEI.md, store/ASO.md,
docs/PLAN-VRIJSPELEN.md, store/TIKTOK-PLAN.md §15-16) plus externe bronnen onderaan.

## 0. Vaste afspraken van Jaimy (niet heronderhandelen)

- Geen betaalde Apple Ads. Geen beloning voor beoordelingen.
- App-updates bundelen: één versie met veel merkbaars, geen losse mini-updates.
- Social posten gaat via Buffer (besluit 26-10); TikTok-accounts rusten tot 29-10 22:00.
- Woordregel in social: geen killer/murder/moordenaar/asesino (TIKTOK-PLAN §13).
- Repo is openbaar: nooit sleutels of tokens committen.
- Auto-modus blokkeert `store/release-ios.sh` en `asc-release.js submit` (Production Deploy): bouwen
  en indienen doet Jaimy, of hij zet een toestemmingsregel.

## 1. Waar we staan (gemeten, 28-10-2026)

| Meting | Waarde | Bron |
|---|---|---|
| Nieuwe spelers per dag (laatste 2 weken) | 5-11, gemiddeld ~8; 1.4/1.4.1 veranderde dit niet | crimson-meting |
| Verkeersbron downloads | 94% App Store-zoeken; TikTok ~0 | ASC 11-24 okt |
| Vertoningen → paginabezoek → download | 8.989 → 445 → 110 (conversie boven het 75e percentiel Puzzle) | ASC 11-24 okt |
| D1 / D7 | 18% / 5% (puzzelmediaan 20% / 4-5%; top-kwartiel 32% / 12%) | crimson-meting, 14 d; GameAnalytics |
| Oefenzaak af / zaak 1 / zaak 10 | 60% / 44% / 13% | crimson-meting, 14 d |
| Aankopen | 1 in 3 weken ($1); winkel 45× geopend (24× hints-op, 16× thema's, 5× wereld) | crimson-meting |
| Beoordelingen | NL 5 (★4,6), VS/VK/DE ~0; Enigmic heeft er 12.000 | iTunes lookup; ENIGMIC.md |
| Zoekpositie kleine markten | BR 4, IT 5, FR/ES/MX 7, TR 9 op de genreterm; VS 30, VK 47 | GROEI.md §1 |
| TikTok | 3 accounts op 0 views sinds 22-23 okt (stille rem); video's met stem liggen klaar | TIKTOK-PLAN §16 |
| In-App Event "Zaak van de week" | goedgekeurd, loopt sinds 26 okt | LOGBOEK |

**Diagnose.** Dit is geen kwaliteits- of conversieprobleem (conversie is top-kwartiel) maar een
distributieprobleem: te weinig mensen zien de app. Het enige kanaal dat werkt is App Store-zoeken,
gedragen door de 20 talen. TikTok is tot nu toe een mislukte loterij. Monetisatie is op dit volume
irrelevant: zelfs 3% betalers (het Enigmic-niveau) zou bij 8 downloads/dag ~7 kopers per maand zijn.
Retentie is wél direct waardevol: elke bezoeker die blijft, vermenigvuldigt alles wat distributie
oplevert, en D7 bepaalt of shares en beoordelingen ooit op gang komen.

## 2. De strategie in één alinea

Versterk het kanaal dat al werkt (App Store: beoordelingen, events, featuring, kleine markten eerst),
bouw één eigen kanaal dat niet van een algoritme-loterij afhangt (een gratis speelbare dagzaak op het
web met een deelbare emoji-kaart, het Wordle/LinkedIn-mechanisme), en maak de eerste week in de app zo
goed dat spelers terugkomen en delen (1.5: sneller naar zaak 1, hints verdienen, streak met vrije
dagen, meldingenreeks, deel I van elke wereld gratis). Geld vragen we pas scherper als er ≥100 nieuwe
spelers per dag zijn; tot die tijd is "geen reclame, geen abonnement" ons marketingwapen tegenover
Enigmic, niet onze omzetbron.

## 3. Spoor A — In-game (versie 1.5, één gebundelde update)

Doelen: D1 ≥ 25%, D7 ≥ 8%, zaak 1 opgelost ≥ 60% van nieuwe spelers, deel-knop gebruikt ≥ 10%.
De onderbouwing per punt staat in docs/RETENTIE-ONDERZOEK-2026-10-20.md §3-4; hieronder alleen wat en waar.

1. **Meting per oefenstap** (eerst!): teller per stap van de oefenzaak en per zaak start/opgelost/verlaten
   (meting.js kent al `e`/`a`/`n`). Zonder dit is alles hierna blind. 40% haakt tussen oefenzaak en zaak 1 af.
2. **Eén tik van oefenzaak naar zaak 1**: resultaatscherm krijgt één primaire knop "Volgende zaak:
   Het glas Bordeaux →"; deel-splash + briefing + nieuwe-aanwijzing-modals samenvoegen tot één kaart
   (keten startCampaignCase → showPartSplash → showBriefing in app.js; vanaf deel II de volle splash houden).
3. **Zaak 1-3 bijna zeker winnen**: na ~60 s stilstand in zaak 1-3 een gratis "Vastgelopen?"-hint buiten
   het dagtegoed. Doel: ≥90% van de starters lost zaak 1 op (LinkedIn mikt op 60-70% first-win).
4. **Hints verdienen**: start met 10 hints (nu 3/dag); +1 hint per zaak met drie sterren. De hintmuur is
   ons meest geraakte geldmoment (24× in 2 weken, 0 aankopen) en raakt juist nieuwelingen. Pass blijft
   onbeperkt hints geven.
5. **Deel I (8 zaken) van elke wereld gratis** (PLAN-VRIJSPELEN optie A): iedereen proeft alle 16
   werelden; de betaalvraag komt na de cliffhanger van deel I in plaats van bij een dichte deur.
6. **Meldingen als reeks**: scheduleReminder() (app.js ~regel 755) plant nu één melding; plan dag 1, 2,
   3, 5, 7 ineens, annuleer bij openen, streak-saver 21:30 bij streak ≥2 en dagzaak open, 5-8 roterende
   teksten met zaaknaam, stoppen na dag 7. Zachte vraag ("Herinnering morgen?") pas ná de eerste
   campagnewinst; alleen [Ja] opent de iOS-prompt. @capacitor/local-notifications op 7.x houden.
7. **Streak vanaf dag 1 met 2 vrije dagen** (progress.js ~regel 102 geeft nu 0): "Zet in op 7 dagen,
   verdien een wereld" met [Ik doe mee]; terugverdienen van een gebroken streak in 2 dagen.
8. **Elke winst eindigt met morgen**: resultaatscherm toont streak, "volgende dagzaak over 7 u 12 m",
   [Volgende zaak] en [Delen] met spoilervrije emoji-kaart (bestaat al voor de weekzaak; overal tonen).
9. **Beoordelingsvraag**: huidige drempel (≥5 zaken én ≥2 sterren, sinds 1.3.1) houden, maar ook vragen
   bij de cadeauwereld op dag 7 — het loyaalste moment. Nooit na een fout (Enigmic-les).

Niet doen (onderzocht, zie RETENTIE-ONDERZOEK "What NOT to do"): koude notificatie-prompt, paywall of
account vóór zaak 1, 3+ vrije dagen, gebroken streak benadrukken, oefenzaak verlengen.

## 4. Spoor B — App Store (het kanaal dat al werkt)

Doelen: top 5 op de genreterm in BR, IT, FR, ES, MX, TR; eerste 25 VS-beoordelingen; featuring in ≥1 land.

1. **Beoordelingen zijn de enige blokkade in de grote markten** (GROEI §2). Motor: spoor A punt 9 plus
   meer spelers die dag 7 halen. Wekelijks per land meten (lookup-API), vastleggen in LOGBOEK.
2. **In-App Event elke week**: "Zaak van de week" roteren (store/events/); events staan gratis in
   zoekresultaten en op Vandaag, per land. Loopt sinds 26 okt — elke week verversen.
3. **Featuring-nominaties serieus spelen** (Apple's eigen regels): per update één nominatie, minstens
   3 weken vooraf (verhalen 8 weken), met TestFlight-link — editors spelen alles zelf vóór ze featuren.
   Benoem wat Apple weegt en wij al hebben: 20 talen in-game + 23 winkeltalen, toegankelijkheid,
   één onafhankelijke maker, geen reclame. Volgende: nominatie voor 1.5 ("earn-and-play update").
   Effectgrootte elders gemeten: een kleine indie ging door featuring van ~25 naar ~600 downloads/dag
   gedurende een week (r/iOSProgramming, juni 2025). Niet plannen op, wel voor klaarstaan.
4. **Promotietekst wekelijks roteren** per taal met de zaak van de week (mag zonder review; script
   scratchpad/promo/zet.js-patroon → maak er store/asc-promo.js van).
5. **Eigen productpagina "murder sudoku"** (VS/VK): pas bouwen bij ≥25 VS-beoordelingen; eerder is het
   verspilde moeite (ASO.md hefboom 5).
6. **Kleine markten eerst**: BR en IT staan al top 5; FR/ES/MX/TR op 7-9 met nummers 1 die bijna geen
   beoordelingen hebben. Eén lokale persvermelding (zoals Hipertextual Enigmic's golf in ES startte) of
   een handvol beoordelingen kantelt zo'n markt. Persbericht per taal ligt op store/PERS.md.

## 5. Spoor C — Eigen kanaal: de speelbare dagzaak op het web

Het bewezen groeimechanisme in dit genre is niet video maar **delen van een dagelijks resultaat**:
Wordle ging van 90 → 300.000 → 2.000.000 spelers in drie maanden op één emoji-share; 40% van LinkedIn's
dagelijkse spelers komt via een share van een ander, en 80% komt de volgende dag terug; NYT gebruikt
gratis webpuzzels als grootste instroom. Wij hebben alles al: de app is HTML/JS (www/), GitHub Pages
staat aan (jaimycai.github.io/crimson-ledger → docs/), en de emoji-kaart bestaat voor de weekzaak.

Bouw: een aparte webbuild "dagzaak only" (build-www.js-variant) op een eigen pad of subdomein:
- Alleen de dagelijkse zaak + de oefenzaak; geen campagne, geen winkel (StoreKit werkt daar toch niet).
- Na de oplossing: emoji-kaart + [Delen] (navigator.share / klembord) met link naar de pagina, en één
  knop "128 zaken gratis in de app" naar de App Store (met ?ct=web campagnetoken voor meting).
- De share-tekst noemt de zaaknaam en de tijd, geen spoilers.
- Meting: aparte `p=webdaily` in meting.js zodat web- en appgebruik uit elkaar blijven.
- Risico laag: de repo is al openbaar; dit geeft niets weg wat niet al vrij is, en de app houdt
  campagne, streaks, medailles en werelden als reden om te installeren.
Doel: ≥10% van de webspelers tikt door naar de App Store; shares per speler meten.

## 6. Spoor D — Social en makers (teruggeschroefd naar experimenten)

1. **TikTok**: rust tot 29-10 22:00. Daarna per account één test via Buffer (besluit Jaimy). 100-300
   views binnen een uur = door met 1 video/dag ("Los met mij op", stem; alles ligt klaar in
   store/social/motion/). Blijft het 0 na 7 dagen video: account is verbrand → één nieuw account, op
   de telefoon aangemaakt, een week opwarmen, Engels eerst. Harde regel: social krijgt samen hoogstens
   ~20% van de wekelijkse inzet tot een post aantoonbaar ≥1 download oplevert (ASC-bron "AppRef").
2. **Makers met gratis Pass-codes** (GROEI #7): 15 kleine puzzel/BookTok-makers in BR, IT, ES, MX
   aanschrijven; geen script, wel "gift" vermelden. Precedent: Wordbolt werd zo nummer 1 in Zweden.
   De views in de niche gaan naar spelers die het spel spelen, niet naar de accounts van spellen zelf
   (onderzoek 20-10: 289 topposts, allemaal video van spelende mensen).
3. **Reddit**: alleen als maker ("ik maakte dit, feedback welkom") in r/puzzles / r/iosgaming, met
   een eigen Crimson-account, nooit @jaimycai. Lage frequentie, geen linkspam.
4. **Boekgolf**: het Murdoku-puzzelboek maakte de vraag; Enigmic reed die golf met advertenties. Wij
   rijden hem gratis: zoekwoorden staan al goed, de webdagzaak (spoor C) is deelbaar in boek-communities.

## 7. Monetisatie: bewust parkeren, reclame vanaf 5.000-10.000 downloads

**Besluit Jaimy (28-10-2026):** "zodat we bij 5/10k plus downloads ads gaan toevoegen; we moeten zsm snel veel downloads
hebben." Dus: nu alles op groei; reclame komt erbij zodra het totaal aan downloads 5.000-10.000 haalt (ASC, alle landen).
Wat dan mee moet in die versie (vooraf weten, want het raakt de winkel):
- Alle winkelteksten en schermafbeeldingen noemen nu "geen reclame" / "No ads": die moeten in alle 23 talen aangepast.
- App Privacy-label: advertentiegegevens en waarschijnlijk tracking (ATT-prompt) als het een netwerk als AdMob wordt.
- Vorm die bij Enigmic werkt: reclame na een opgeloste zaak (niet tijdens), "reclame weg" als aankoop, hints verdienen via
  een vrijwillige reclamevideo. De Crimson Pass haalt dan ook de reclame weg (meerwaarde voor bestaande kopers).
- Tot die drempel blijft "geen reclame" het verkoopargument tegenover Enigmic.


- Tot ≥100 nieuwe spelers/dag: geen nieuwe betaalmomenten, alleen frictie weg (hints verdienen,
  deel I gratis). De Pass blijft "alles meteen"; prijzen blijven staan.
- "Geen reclame, geen abonnement, geen energie" blijft in elke winkeltekst: het is het scherpste
  verschil met Enigmic (ads na elke zaak) en kost ons nu vrijwel niets (1 aankoop in 3 weken).
- Herijken zodra het volume er is, met de dan gemeten winkel-opens per aanleiding.

## 8. Volgorde en meetpunten

| # | Wat | Wie | Wanneer |
|---|---|---|---|
| 1 | Spoor A punt 1 (metingen) + 2 + 3 bouwen | model | nu |
| 2 | Rest spoor A (4 t/m 9) → 1.5 bundelen | model | deze week |
| 3 | 1.5 bouwen/indienen + featuring-nominatie 1.5 met TestFlight-link | Jaimy (of toestemmingsregel) | na 1-2 |
| 4 | Webdagzaak (spoor C) bouwen op Pages | model | parallel aan 2 |
| 5 | Wekelijks: event + promotekst roteren; maandag zoekposities/beoordelingen meten | taak crimson-social | doorlopend |
| 6 | TikTok-test na de rust; makerslijst (15) opstellen | model meet, Jaimy post/beslist | 30-10 |
| 7 | Herijken op cijfers | samen | elke maandag |

Wekelijkse meetlat (LOGBOEK): nieuwe spelers/dag, D1, D7, zaak-1-%, shares, webdagzaak→App Store-kliks,
beoordelingen per land, zoekpositie per land, downloads via AppRef/WebRef.

## 9. Externe bronnen (naast de repo-onderzoeken)

- GameAnalytics benchmarks 2024-2026; Adjust puzzle 2024; AppsFlyer Q3 2022 (via RETENTIE-ONDERZOEK §2).
- Duolingo groei/streaks/meldingen: research.duolingo.com (KDD'20), blog.duolingo.com, Lenny's Podcast.
- LinkedIn games: 40% van dagelijkse spelers via shares, 80% D1 (LinkedIn-post Somasundaram, 2024).
- Wordle: 90 → 300k → 2M spelers in ~3 maanden; share-mechanisme kwam uit de community (The Conversation,
  Growth Memo, Semetrical, 2022). NYT-funnel: gratis games → abonnement (Strategy Breakdowns, 2024).
- Apple featuring: developer.apple.com/app-store/getting-featured + "Explore game curation" (Meet with
  Apple, dec 2025): editors spelen elke build, 3 weken lead, 8 weken voor verhalen, localization weegt mee.
- Featuring-effect klein indie-spel: r/iOSProgramming "Got featured — here's the stats" (jun 2025):
  25→600 downloads/dag, en 66% van zijn downloads kwam alsnog via Search.
- Academisch: top-charts en featured-lijsten hebben het grootste effect op downloads; updates helpen
  naar rato van hun omvang (Aydin Gokgoz, EUR, o.b.v. 979 apps).
- Schedulers vs. native op TikTok en 0-views-herstel: zie TIKTOK-PLAN §16 met Reddit-bronnen.
