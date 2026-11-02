# Marketingskills (coreyhaines31) beoordeeld en toegepast op Crimson Ledger (2 november 2026)

Jaimy, 2-11: "Graag deze repo toepassen en kijken wat wij kunnen gebruiken: https://github.com/coreyhaines31/marketingskills.git"

Werkwijze: de repo alleen gelezen via `gh api` (README, licentie, plugin-bestanden, alle 53 `SKILL.md` en de
referenties die voor ons tellen). Niets geïnstalleerd, geen script uit de repo gedraaid, niets naar `~/.claude` gekopieerd.
Daarna vijf skills echt uitgevoerd op onze stand: `store/metadata/1.5.0/en-US.json` en `nl-NL.json`, `store/cards-text/`,
de eerste drie winkelbeelden, `app.js` (renderStore, shareAny, meldingen, opstart), `board.js` (oefenzaak, deeltekst),
`web-daily/`, en 114 recente Amerikaanse reviews van Enigmic (App Store-RSS, 30-5 tot 31-10-2026).

## 0. In het kort

**De vijf belangrijkste verbeterpunten**

1. **De deelknop opent het deelvenster niet.** `shareAny()` (app.js r. 1758) probeert eerst het klembord en pas daarna
   `navigator.share`. In de app lukt het klembord vrijwel zeker (één keer op een toestel bevestigen), dus de speler krijgt "Resultaat gekopieerd" en moet zelf
   een andere app openen en plakken. Dat is precies de frictie die de deellus breekt. Daarbij hebben de links geen
   campagnetoken (we kunnen een download via een deelkaart niet meten) en toont een gedeelde link naar de webdagzaak alleen
   het kleine icoon. Prioriteit 1, moeite klein tot middel.
2. **Beoordelingen zijn het enige grote gat op de winkelpagina.** De ASO-scorekaart geeft en-US 67/100: titel, teksten,
   beelden en versheid scoren 8-10, beoordelingen 1 (VS ~0 tegen 9 tot 2.327 bij de concurrenten). Extra hefboom die we
   nog niet gebruiken: een In-App Event van het type "Major Update" voor 1.5, naast de wekelijkse zaak. Prioriteit 1, moeite middel.
3. **De A/B-test van de winkelpagina kan bij ons volume alleen grote verschillen zien.** Bij ~425 vertoningen per variant per
   dag en 1% conversie is voor een verbetering van 20% ruim 100 dagen nodig (Apple stopt na 90). En 1.5 maakt de nieuwe beelden
   standaard. Beslis vóór de release van 1.5 wat de test nog moet meten. Prioriteit 1, moeite klein.
4. **Reclame na elke zaak is wat spelers van Enigmic het meest haten.** 19 van de 47 recente reviews met 3 sterren of minder
   gaan over reclame na elke puzzel. Leg nu vast welke vorm de reclame bij 5.000-10.000 downloads krijgt (vrijwillige
   video voor hints, hooguit één per zoveel zaken, nooit in de eerste zaken) en houd "geen reclame" tot dan als sterkste
   belofte. Prioriteit 2 (besluit nu, bouw later), moeite klein.
5. **Het Crimson Pass-scherm vraagt geld zonder te laten zien wat je krijgt.** Bij een dichte wereld staat er alleen "zit in
   de Crimson Pass". Laat zien wat er achter zit (deel II-VIII, 56 zaken, de wereldbanner), zet de losse werelden samen
   (14 × € 1,99 = € 27,86) naast de Pass (€ 4,99), noem in de hintmelding dat je hints verdient, en werk de onderregel bij
   voor 1.5. Prioriteit 2, moeite middel.

**Welke skills het waard zijn:** `aso`, `paywalls`, `onboarding`, `referrals`, `customer-research`, `copywriting` (met
`copy-editing`), `ab-testing` en `product-marketing` (als fundament). Als naslag: `marketing-psychology`, `launch`,
`public-relations`, `influencer-marketing`. De rest is gemaakt voor SaaS met een website, e-mail, verkoopteam of
advertentiebudget en past niet bij een mobiel spel zonder webfunnel (tabel in §3).

## 1. De repo

| | |
|---|---|
| Wat | 53 "Agent Skills" (markdown-instructies met referenties) voor marketingtaken, plus 66 Node-CLI's voor marketingtools en een Claude Code-plugin-marktplaats |
| Maker | Corey Haines (bureau Conversion Factory); ~58.000 sterren; versie v2.14.0 van 30-10-2026, commit `88c79f6` |
| Licentie | **MIT**, Copyright (c) 2025 Corey Haines. Vrij te gebruiken, aan te passen en commercieel in te zetten. Enige voorwaarde: bij kopieën van (wezenlijke delen van) de bestanden de copyright- en licentietekst meeleveren. Geen garantie. Het advies zelf toepassen in ons spel schept geen verplichting. |
| Opbouw | `skills/<naam>/SKILL.md` + `references/` + `evals/`; `tools/clis/` (scripts die met API-sleutels externe diensten aanroepen); `skills/reverse-engineer-marketing/scripts/teardown.mjs`; `skills/conversion-tracking/scripts/*.py` |
| Plugin | `.claude-plugin/plugin.json` installeert alle 53 skills in één keer (geen hooks, geen MCP-servers) |
| Spil | Elke skill leest eerst `.agents/product-marketing.md` (of `.claude/product-marketing.md`): één contextbestand over product, doelgroep, concurrenten en bewijs. Zonder dat bestand stelt elke skill dezelfde vragen opnieuw. |
| Partners | Vier betaalde partners (Converly, Ploy, AIsa, Omnia) staan in README en tool-lijsten; volgens de README beïnvloeden ze de kernskills niet. Voor ons niet relevant. |

**Waar de repo voor gemaakt is:** SaaS en webproducten: landingspagina's, aanmeldformulieren, e-mailreeksen, Google/Meta-ads,
SEO, B2B-verkoop. Een mobiel spel zonder account, zonder e-maillijst en zonder advertentiebudget raakt maar een deel. De
skills die wél op ons passen (`aso`, `paywalls`, `onboarding`, `referrals`) zijn goed: concreet, met Apple-specifieke regels en
benchmarks uit 2025-2026.

## 2. Onze situatie (zoals de skills haar moeten kennen)

~8 nieuwe spelers per dag; 99% van de vertoningen komt via App Store-zoeken; 11.918 vertoningen → 537 paginabezoeken → 122
downloads (1,0%) in 16-29 okt; 23 winkeltalen; D1 18%, D7 5%; 1 aankoop in 3 weken. Vaste afspraken: geen Apple Ads,
geen beloning voor beoordelingen, social via Buffer, updates bundelen, reclame pas bij 5.000-10.000 downloads, en (2-11) geen
"gratis proberen" of aantallen gratis zaken in de haak: de haak is **eindeloos veel zaken**.

## 3. Elke skill beoordeeld

Bruikbaar: **ja** = direct toepasbaar op ons; **deels** = één onderdeel past; **nee** = gemaakt voor iets wat wij niet hebben.

| Skill | Bruikbaar | Waarvoor bij ons | Waarom |
|---|---|---|---|
| ab-testing | **ja** | Rekensom voor de winkelpagina-test (Product Page Optimization) en latere proeven in de app; hypothese-sjabloon | De steekproeftabel laat zien wat we bij ons volume wel en niet kunnen meten (§4.1) |
| ad-creative | nee | | Geen reclame, geen Apple Ads (vaste afspraak). De haakbibliotheek overlapt met `social` |
| ads | nee | | Betaalde campagnes; vaste afspraak |
| ai-seo | deels | Webdagzaak en GitHub Pages vindbaar maken voor vragen als "games like Murdle" in ChatGPT of Perplexity | Gemaakt voor sites met veel content; wij hebben één kleine site, dus laag rendement |
| analytics | deels | Naamgeving en eventplan voor crimson-meting (bijv. `buy_tap`, `share_done`) | GA4/GTM-gericht; onze teller is eigen werk |
| aso | **ja** | Audit van titel, ondertitel, zoekwoorden, beelden, beoordelingen, events, met scorekaart | Apple-regels en benchmarks 2025-2026; toegepast in §4.1 |
| attribution | deels | Het principe "weet waar een download vandaan komt": campagnetokens in App Store-links | Verder over webfunnels en advertentiekanalen |
| churn-prevention | nee | | Opzegflows en betaalherstel voor abonnementen; wij verkopen eenmalig |
| co-marketing | deels | Kruispromotie met puzzelboekmakers of andere indie-puzzelspellen (gedeeld event, vermelding) | B2B-gericht, maar het partnerraamwerk werkt ook voor ons |
| cold-email | nee | | B2B-outbound. Makers benaderen valt onder `influencer-marketing` |
| community-marketing | deels | Later een groep rond de zaak van de week; nu alleen als maker op Reddit (STRATEGIE §6.3) | Een community vraagt onderhoud; bij 8 downloads per dag te vroeg |
| competitor-profiling | deels | Positionering en prijs van Enigmic, Tiny Crimes, Whodoku op één blad | Werkt via websites en scrapers; we hebben `store/CONCURRENTIE.md` en `store/ENIGMIC.md` al |
| competitors | nee | | Vergelijkingspagina's voor SEO; geen website-funnel |
| content-strategy | nee | | Blog- en SEO-content; niet ons kanaal |
| conversion-tracking | nee | | Pixels en formulieren op websites |
| copy-editing | **ja** | Zeven controles (helderheid, stem, "so what", bewijs, specifiek, emotie, risico) op winkelteksten en schermteksten | Taalonafhankelijk; vond de "geen timers"-tegenspraak (§4.2) |
| copywriting | **ja** | Winkelteksten, promotietekst, paywallkoppen; de driesprongtoets en de lijst met AI-kenmerken | Respecteert een bestaande stem (situatie B); toegepast in §4.2 |
| cro | deels | De webdagzaakpagina (één knop naar de App Store) | Voor webpagina's en formulieren |
| customer-research | **ja** | Reviews van concurrenten en van ons ontginnen voor woorden en klachten; "Wat kan beter?"-berichten | Toegepast in §4.2 met 114 Enigmic-reviews |
| directory-submissions | nee | | SaaS/AI-directories en Product Hunt; voor een spel weinig waarde |
| emails | nee | | Geen e-maillijst (geen account). De reekslogica (één boodschap per bericht) helpt wel bij meldingen |
| events | nee | | Webinars en beurzen. App Store In-App Events vallen onder `aso` |
| free-tools | deels | De webdagzaak is ons gratis gereedschap; de scorekaart helpt kiezen wat er nog op het web komt | Het leadcapture-deel past niet |
| image | deels | Een grote `og:image` voor de linkvoorvertoning van webdagzaak en deelkaart | We hebben al een eigen beeldpijplijn |
| influencer-marketing | **ja** | Makers met gratis Pass-codes (STRATEGIE §6.2): keuze, brief zonder script, disclosure, meten per code | Past op spoor D; vetting- en brieflijst direct bruikbaar |
| launch | deels | Elke update als lancering: Major Update-event, nominatie, wat is er nieuw. ORB: Buffer is gehuurd, de webdagzaak is eigen | Product Hunt, wachtlijst en e-mail niet |
| lead-magnets | nee | | E-mailcaptatie |
| link-building | nee | | Backlinks voor SEO |
| marketing-council | deels | Gesimuleerde adviseurs (Ogilvy, Sutherland, Godin) voor een tweede mening over naam of haak | Speels, geen data |
| marketing-ideas | deels | 140 ideeën; een handvol past (gratis tool, community, partner) | SaaS-gericht |
| marketing-loops | deels | Een terugkerende lus (event + promotietekst + zoekposities) | Hebben we al in taak crimson-social |
| marketing-plan | nee | | Volledige 13-delige plannen voor bedrijven; `docs/STRATEGIE.md` doet dat |
| marketing-psychology | **ja** (naslag) | Zeigarnik (cliffhanger deel I), ankeren (Pass tegen losse werelden), peak-end (de bekentenis), goal-gradient (streak) | Gebruikt in §4.3 en §4.4 |
| offers | deels | Waardeformule (droomuitkomst × kans / tijd × moeite) voor de Pass | Vooral voor diensten en cursussen |
| onboarding | **ja** | Inventaris van de eerste minuten, aha-definitie, peak-end | Toegepast in §4.3 |
| paywalls | **ja** | Crimson Pass-scherm: triggers, onderdelen, toon, App Store-checklist | Toegepast in §4.4; het abonnementsdeel (proefperiode, jaarplan) geldt niet |
| popups | deels | Regels voor zachte vragen (herinnering, beoordeling): timing en frequentie | Webgericht |
| pricing | deels | "Prijs om van te leren", ankerpsychologie, prijsrust | SaaS-tiers niet; ons volume is te laag om prijzen te testen |
| product-marketing | **ja** (fundament) | Eén contextbestand met feiten en vaste afspraken dat elke skill eerst leest | Zonder dit bestand vraagt elke skill hetzelfde opnieuw (concept in bijlage A) |
| programmatic-seo | nee | | Pagina's per zaak op het web kan, maar wordt dun en riskant |
| prospecting | nee | | B2B-leadlijsten |
| public-relations | deels | Pershoek (David tegen Goliath; "een vijand": reclame na elke puzzel), persmap, pitchtoets onder 150 woorden | `store/PERS.md` is verouderd (96 zaken, oude naam) |
| referrals | **ja** | Virale mechanismen (deelkaart, blootstellingslus), regels voor beoordelingen | Toegepast in §4.5; een beloningsprogramma niet (geen account om te controleren) |
| reverse-engineer-marketing | deels | Het pakket "mobile apps and games": welke signalen je bij Enigmic volgt (events, beoordelingssnelheid, eerste sessie) | Handmatig volgen; het script `teardown.mjs` is niet nodig |
| revops | nee | | Leadroutering voor verkoopteams |
| sales-enablement | nee | | Verkoopdecks en demo's |
| schema | nee | | Gestructureerde data voor websites |
| seo-audit | nee | | Website-SEO |
| signup | nee | | Wij hebben geen account, en dat blijft een sterk punt |
| site-architecture | nee | | Sitestructuur |
| sms | nee | | Sms- en WhatsApp-marketing |
| social | deels | Haakformules, hergebruik, weekritme | `store/TIKTOK-PLAN.md` §13-16 is specifieker; skill is LinkedIn/X-gericht |
| video | deels | App-preview en korte video's | Noemt HyperFrames, dat we al gebruiken; overlapt met vakmanschap |

## 4. De skills toegepast

### 4.1 `aso`: scorekaart van de 1.5-winkelpagina

Categorie volgens de skill: **Challenger** (minder dan 100.000 beoordelingen), dus streng volgens het boekje. Gewichten
van de skill: titel 20%, beschrijving 15%, beelden 25%, beoordelingen 20%, versheid 10%, conversiesignalen 10%.

| Dimensie | en-US | nl-NL | Waarom |
|---|---|---|---|
| Titel en ondertitel | 9 | 9 | "Crimson Ledger: Murder Sudoku" (29/30) + "Mystery logic puzzles, no ads" (29/30); "Crimson Ledger: Moord Sudoku" (28/30) + "Vind de dader, zonder reclame" (29/30). Genrewoord in de naam, geen herhaling met de zoekwoorden. Wel: 7 van de top-10 in de VS voor "murder sudoku" hebben die woorden ook in de naam, dus de naam brengt je in het rijtje maar onderscheidt niet |
| Beschrijving | 8 | 7 | Sterke eerste drie regels, kopjes met een werkwoord, promotietekst in gebruik. Min: geen bewijs (beoordelingen, pers); een rij ontkenningen; NL zegt "geen timers" terwijl beeld 1-3 een klok tonen (§4.2) |
| Beelden | 8 | 8 | Negen beelden met korte, dikke koppen; de eerste drie vertellen genre → handeling → eindeloos, en zijn op postzegelformaat (110 px, zoals in een zoekresultaat) leesbaar; app-preview per taal in 1.5. Min: beeld 1 en 3 tonen allebei een bord in spel; beeld 3 zegt "eindeloos" maar laat het niet zien |
| Beoordelingen | 1 | 3 | VS ~0; NL 5 met gemiddeld 4,6. Concurrenten VS: Enigmic 2.327, Tiny Crimes 244, Whodoku 59, GridNoir 31 |
| Versheid | 10 | 10 | Maandelijkse updates, 23 winkeltalen, wekelijks In-App Event, iPad |
| Conversiesignalen | 5 | 5 | Gratis + aankopen helder, "geen reclame" helder. Geen bewijs, geen gepromote aankoop |
| **Totaal** | **67** (C) | **70** (B) | Met beoordelingen op 7 komt en-US op 79 |

Conclusie van de skill, in één zin: aan de tekst en de beelden valt weinig meer te winnen; vrijwel het hele gat zit in
beoordelingen. Dat bevestigt `docs/STRATEGIE.md` §4.1.

**Wat de skill-checklist verder opleverde**

- **In-App Events**: de skill noemt 2-4 actieve events per maand als optimum en meldt dat events in zoekresultaten en op
  Vandaag staan. Wij hebben er één (badge CHALLENGE, `store/events/zaak-van-de-week.json`). Voor 1.5 een tweede event met
  badge **MAJOR_UPDATE** ("De grote opening: alle zestien werelden staan open"), 23 talen, 2-4 weken. Kan met
  `store/events/asc-event.js` en `make-event-art.js`.
- **Gepromote aankopen**: volgens de skill telt Apple de namen van in-app-aankopen mee in zoeken. Een gepromote Crimson Pass
  staat op de productpagina en kan in zoekresultaten verschijnen: extra ruimte in het rijtje. Vraagt één beeld van 1024 px
  per aankoop.
- **Reageren op beoordelingen**: de skill weegt reacties van de ontwikkelaar mee. Elke beoordeling een antwoord, in de taal
  van de schrijver (zoals bij Cool cat134 op 18-10).
- **Custom Product Pages**: sinds juli 2025 ook voor zoekwoorden in organisch zoeken, maar voor spellen gemiddeld +3,5%.
  `store/ASO.md` stelde dit uit tot 25 VS-beoordelingen; de skill geeft geen reden om dat te veranderen.
- **Google Play**: Play leest de lange beschrijving wél voor zoeken (2-3% genrewoorden). `store/play-listing.js` neemt de
  App Store-beschrijving over, waar "sudoku" één keer in staat. Bij livegang van Play een eigen versie met "murder sudoku"
  en "detective puzzle" op natuurlijke plekken.

**Rekensom voor de lopende A/B-test (skill `ab-testing`)**

11.918 vertoningen in 14 dagen is ~850 per dag; met 50% naar de nieuwe beelden ~425 per variant per dag. Bij 1% conversie
(vertoning → download) zegt de steekproeftabel van de skill (95% zekerheid, 80% kracht):

| Verschil dat we willen zien | Nodig per variant | Duur bij ons |
|---|---|---|
| +10% | 160.000 | ~376 dagen |
| +20% | 43.000 | ~101 dagen |
| +50% | 7.700 | ~18 dagen |

Apple stopt een test na 90 dagen en meldt bij 90% zekerheid, dus iets milder, maar de orde blijft: alleen een groot verschil
wordt zichtbaar. Bovendien gaan de nieuwe beelden in 1.5 standaard mee; Apple waarschuwt dat een nieuwe versie die de geteste
beelden verandert de uitkomst beïnvloedt (en oudere bronnen melden dat de test dan stopt). Advies: lees de test vóór de
release van 1.5 af; kies daarna een nieuwe test met één groot verschil (bijvoorbeeld beeld 1 met of zonder "Sudoku" in de kop,
of het icoon), niet kleine tekstwijzigingen.

### 4.2 `copywriting` + `copy-editing` + `customer-research`: de winkelteksten

**Diagnose volgens de skill:** situatie B, "echte stem aanwezig": de evenementstijl van wat is er nieuw (hoofdletters,
uitroepen, Supercell, `store/TEKST-1.4.1.md`) is een bewuste keuze. De skill zegt dan: niet herschrijven naar eigen smaak,
alleen gericht verbeteren. De uitroeptekens laten we dus staan.

**Driesprongtoets** (kan de lezer het zien? is het te bewijzen? kan een concurrent precies deze zin schrijven?):

| Regel | Zien | Bewijs | Alleen wij? | Oordeel |
|---|---|---|---|---|
| Promo en: "Endless cases: a new murder every day … From a cursed tomb in Luxor to a casino in Monte Carlo. Can you find the killer?" | ja | ja | ja (Luxor, Monte Carlo) | houden |
| Beschrijving en r.1: "A cozy whodunit you solve like a sudoku." | ja | ja | nee: Tiny Crimes of Cozy Culprits kan dit schrijven | houden, maar r.2-3 moeten het onderscheid dragen |
| Beschrijving en r.2: "Every case has one solution. Pure logic, no guessing." | half | ja | nee: elke concurrent belooft dit | vervangen door ons echte verschil (zie hieronder) |
| Beschrijving nl r.1: "Sudoku, maar met een moord: vind de dader." | ja | ja | half | houden |

**Wat spelers bij de concurrent zeggen** (customer-research, modus 2: bestaande signalen). 114 recente reviews van Enigmic
in de VS (30-5 tot 31-10-2026; 48 met 5 sterren, 47 met 3 of minder):

| Thema | in reviews met ≤3 sterren | in reviews met 5 sterren |
|---|---|---|
| Reclame (na elke puzzel, betalen om weg te halen) | **19 van 47** | 6 van 48 |
| Hints (werken niet, gewijzigd, video voor hints bevriest) | 7 van 47 | 5 van 48 |
| Betalen, prijs | 7 van 47 | 5 van 48 |
| Logica, hersens | 4 van 47 | 10 van 48 |
| "Sudoku" (als vergelijking) | 0 van 47 | 8 van 48 |
| Verslavend | 0 van 47 | 5 van 48 |

Twee losse klachten raken ons direct: "ad free"-aankoop zonder Gezinsdeling (1 ster), en voortgang kwijt na een nieuwe
telefoon. Tiny Crimes (12) en Whodoku (9) hadden te weinig recente reviews om te tellen.

Wat dit voor de tekst betekent: onze twee echte verschillen zijn precies de twee grootste klachten bij Enigmic: **geen
reclame tussen zaken** en **hints die uitleggen, nooit verklappen**. Zet die in regel 2-3 in plaats van "one solution",
dat iedereen belooft. Voorstel en-US (voor de volgende versie; beschrijving verandert alleen met een nieuwe versie):

> A cozy whodunit you solve like a sudoku.
> No ads between cases. Hints that explain, never spoil.
> Endless cases: a new murder every day.

**Ontkenningsrijen** (AI-kenmerk 2 van de skill: "No X, no Y, no Z"). en: "PLAY OFFLINE, NO ACCOUNT, NO ADS … No lives and no
energy to wait for." nl: "Geen account, geen reclame, geen abonnement, geen levens, geen timers." De skill: noem een echt
gemis één keer, dicht bij de actie, en beschrijf verder wat wél gebeurt. "Geen reclame" staat al in ondertitel en eerste
regels, dus hier kan het korter:

> nl: SPEUR OVERAL, OOK OFFLINE
> Op iPhone en nu ook op iPad, in de trein of het vliegtuig. Je speelt zo lang je wilt, zonder account en zonder wachttijd.
> Je voortgang blijft op je toestel; alleen anonieme tellers helpen ons het spel te verbeteren (uit te zetten in Instellingen).

**Tegenspraak (copy-editing, controle "bewijs"):** de NL-beschrijving zegt "geen timers", maar beeld 1-3 tonen bovenaan een
klok (00:00). Bedoeld is "geen wachttijd zoals bij levens of energie". Vervang door "zonder wachttijd". Controleer de andere
talen op hetzelfde woord.

**Taal van spelers:** in de 5-sterrentitels komen "addictive", "logic game", "fun", "relaxing" en "like sudoku but better"
terug, plus merknamen die wij niet mogen gebruiken (Clue, Murdoku). "Addictive" en "brain teaser" staan niet in onze
en-US-zoekwoorden; een proef om "grid,story" daarvoor te ruilen is goedkoop, maar zonder zoekvolumes (de skill noemt dat
eerlijk als grens zonder betaalde tools) alleen te beoordelen met de zoekpositiemeting van `store/GROEI.md` §4.

### 4.3 `onboarding`: de eerste minuten

**Inventaris van stappen tot de eerste waarde** (de skill: "inventariseer, schrap, bouw opnieuw"):

| # | Stap | Wat de speler doet | Nodig? |
|---|---|---|---|
| 1 | Icoon → native startscherm → webstartscherm met laadbalk (minstens 0,9 s, hooguit 2,5 s) | wachten | deels |
| 2 | Knop "Begin" | tikken | de tik mag blijven, maar het woord belooft niets |
| 3 | Oefenzaak: Clementine plaatsen, Hargrove plaatsen, Controleer, Hargrove aanwijzen (4 stappen, ~1 minuut) | doen | **ja: hier zit het aha-moment, de bekentenis** |
| 4 | Resultaat oefenzaak → "Volgende zaak: <titel>" | tikken | ja |
| 5 | Briefing Van Dam → "Aan de slag" | lezen, tikken | sfeer, maar een extra tik |
| 6 | Eventueel een kaart "nieuwe aanwijzing" | lezen, tikken | in de simulator nakijken of die bij zaak 1 nog komt |
| 7 | Zaak 1; na een minuut zonder zet een gratis hint | spelen | ja |
| 8 | Resultaat zaak 1: sterren, deelknop, herinneringsknop, volgende zaak | tikken | ja |

Het oordeel van de skill: dit is al een goed pad. "Doen, niet uitleggen" klopt (de eerste start gaat meteen het bord op),
de oefenzaak is kort, en 1.5 haalt de deel-splash tussen oefenzaak en zaak 1 al weg. De val zat tussen stap 3 en 7
(oefenzaak 60-70% af, zaak 1 44-48%), en dat is waar 1.5 op mikt. Wat de skill nog toevoegt:

1. **Aha-moment meten in plaats van aannemen.** De skill: kies een vroeg venster (dag 0) en een later resultaat (actief op
   dag 7), en vergelijk wat spelers in dat vroege venster deden. crimson-meting heeft alles (`tutorial_done`, `solved`,
   `reminder_on`, `share`). Vraag: voorspelt "zaak 1 opgelost", "3 zaken op dag 0" of "herinnering aan" D7 het best? Dan
   weten we welk getal 1.5 en 1.6 moeten opdrijven.
2. **Startknop met een belofte.** Bij de eerste start "Los je eerste zaak op" in plaats van "Begin" (Fogg: de prompt moet
   zeggen wat er gebeurt). Klein, 19 vertalingen.
3. **Geschonken voortgang** (endowed progress, +40% afronding in de bron van de skill): toon de oefenzaak als al
   afgevinkte eerste stap op het pad van Het Landhuis, zodat een nieuwe speler niet bij nul begint.
4. **Meldingen met een open lus** (Zeigarnik). De reeks van dag 1, 2, 3, 5, 7 (app.js r. 771) gebruikt voor dag 2-7 steeds
   dezelfde zin. "Verder waar je was" bestaat al; een melding als "Je zaak in Het Landhuis staat nog open" of met de naam
   van de dagzaak van die dag trekt harder. Past in het meldingenonderzoek van `docs/PLAN-1.6.md`.
5. **Klopt de belofte?** Na "Herinner me morgen" zegt de toast "elke dag om 18:30", maar de tijd past zich aan het
   speelmoment aan en de reeks stopt na dag 7. Maak er "We herinneren je morgen aan de dagzaak" van.

### 4.4 `paywalls` (met `pricing` en `marketing-psychology`): het Crimson Pass-scherm

Wat er nu is (app.js r. 503-539, index.html r. 567-585): de winkel opent bij een dichte wereld (`world:<id>`), lege
hints (`hint`), thema's (`cosmetics`) of uit het menu. Bovenaan een regel per reden, dan de Pass-kaart ("Alles, voor altijd",
vier punten, knop "Crimson Pass · € 4,99"), dan losse rijen (10 hints € 0,99, thema's € 1,99, 14 werelden à € 1,99),
een onderregel, Herstellen en Sluiten.

**Toets aan de zeven onderdelen van de skill**

| Onderdeel | Stand | Advies |
|---|---|---|
| Waarde vóór de vraag | Goed: met 1.5 komt de vraag pas na deel I van een wereld | Houden |
| Kop | Goed: "Alles, voor altijd" | Houden |
| Waarde laten zien | Ontbreekt: bij `world:` staat alleen "<wereld> zit in de Crimson Pass" | Toon wat er achter de deur zit: "Je sloot deel I. Deel II tot VIII: 56 zaken met <n> verdachten." met de wereldbanner (`MapArt.banner` bestaat). Zeigarnik: de cliffhanger is het verkoopargument |
| Vergelijking en anker | Ontbreekt: niemand ziet dat 14 losse werelden samen € 27,86 kosten | "14 werelden los: € 27,86" klein boven de Pass-knop (bedragen uit de prijzen van de winkel per land, niet vast) |
| Prijs | Helder, eenmalig, geen abonnement | Houden |
| Bewijs | Geen | Later: gemiddelde beoordeling zodra er genoeg zijn |
| Knop | "Crimson Pass · € 4,99" zegt wat het is, niet wat je krijgt | "Open alles · € 4,99" (volgt de regel "nooit koop/buy") |
| Ontsnapping | Goed: Sluiten, geen druk, Herstellen aanwezig | Houden |

**Losse punten**

- **Hintmelding** zegt "Morgen krijg je er weer 3, of kies hieronder." Sinds 1.5 verdien je hints met drie sterren; noem dat
  ("of verdien er één: sluit een zaak met drie sterren"). De skill: respecteer het nee door de gratis weg te laten zien.
- **Onderregel** noemt alleen Landhuis, Piratenschip, dagzaak, weekzaak en archief als gratis. Sinds 1.5 ook deel I van elke
  wereld. Neutraal bijwerken, zonder het woord gratis groot te maken (bijstelling 2-11 gaat over de winkelpagina; in de app
  mag het feitelijk blijven).
- **"Twee extra vrije dagen op voorraad"** is jargon voor wie de streak nog niet kent. "Twee keer je streak redden als je
  een dag mist" zegt wat het doet.
- **Meten**: nu alleen `store_open` (met reden) en `purchase`. Voeg `buy_tap` (tik op een prijsknop) en `buy_cancel` toe;
  dan zie je of mensen afhaken op ons scherm (aanbod) of in het Apple-venster (prijs).
- **Gezinsdeling**: de werelden staan op `familySharable: false` (store/asc-iap-wereld.js r. 66). Enigmic kreeg er een
  1-sterrenreview om. Aanzetten maakt de Pass meer waard voor gezinnen, maar is bij Apple **onomkeerbaar**. Besluit Jaimy.
- **Prijs**: de skill `pricing` zegt "kies een prijs waarvan je leert". Bij 1 aankoop in 3 weken leren we niets van een
  prijswijziging; laat de prijzen staan (zoals STRATEGIE §7).

**Reclame later (pricing + customer-research).** STRATEGIE §7 noemt als vorm "reclame na een opgeloste zaak, zoals Enigmic".
Dat is precies wat in de reviews het zwaarst wordt afgestraft (19 van 47 lage reviews: reclame na elk level, langer dan
de puzzel zelf, en 5,99 om het weg te halen vinden ze te veel). Een vorm die de beoordelingen spaart: (1) vrijwillige video voor een extra hint; (2) als er gedwongen
reclame komt, hooguit één per drie zaken of per tien minuten, nooit in de eerste tien zaken of de eerste drie dagen, en
nooit na een fout; (3) de Pass haalt alles weg. En positionering: zolang "geen reclame" ons verschil is, is een pershoek
"puzzelspellen die na elke puzzel reclame tonen" (public-relations: "een vijand", een systeem en geen concurrent) sterk,
maar die botst met het reclameplan. Kies bewust: "geen reclame" (tot 5.000-10.000) of meteen "geen gedwongen reclame".

### 4.5 `referrals`: de deellus en de beoordelingen

De skill plaatst producten op een schaal van viraal vermogen. Een dagpuzzel met een deelbaar resultaat is "natuurlijk viraal"
(uitvoer die anderen zien), dus: bouw de lus in het product, geen beloningsprogramma. Toets van onze lus
(moment → delen → ontvanger klikt → ontvanger speelt):

| Schakel | Stand | Bevinding |
|---|---|---|
| Moment | Goed: deelknop op elk resultaat, plus de weekzaak | Houden; eventueel prominenter na een dagzaak en na drie sterren |
| Delen | **Klembord eerst** (app.js r. 1758-1768): `viaClipboard().catch(viaShare)` | In de app lukt het klembord, dus het deelvenster (Berichten, WhatsApp) opent nooit; de speler moet zelf een app openen en plakken. De skill: "elke extra stap kost deelratio; één tik". Omdraaien: deelvenster eerst, klembord als terugval. Robuust in de app met de officiële plugin `@capacitor/share`. Even op een toestel bevestigen |
| Meting delen | `share` wordt geteld bij de tik, niet bij het delen | Met het deelvenster komt er een resultaat terug: tel `share_done` apart |
| Tekst | Spoilervrij, met sterren, tijd, rode/groene vakjes en link (board.js r. 1105) | Goed. Eén uitdagende regel erbij ("Kun jij het sneller?") is de "vooraf geschreven boodschap" uit de skill |
| Link | `apps.apple.com/app/id6812534368` en de webdagzaak, zonder campagnetoken | Voeg `?pt=<provider-token>&ct=share` (deelkaart), `ct=webdaily` (knop op de webdagzaak) en `ct=tiktok_bio` toe. Dan telt App Store Connect downloads per bron. Plekken: `board.js` (SHARE_STORE_URL), `web-daily/dagzaak.js` r. 10, `web-daily/index.html` r. 69 |
| Ontvanger | Linkvoorvertoning toont het icoon van 512 px (`og:image`, `twitter:card summary`) | Een beeld van 1200×630 met een bord zonder oplossing en "Kun jij de dader vinden?", plus `summary_large_image`. In Berichten en WhatsApp wordt dat een grote kaart |
| Ontvanger op iPhone | Geen Smart App Banner op de webdagzaak | `<meta name="apple-itunes-app" content="app-id=6812534368">` in `web-daily/index.html` (en docs/index.html): Safari toont dan bovenaan "Openen/Download" |

**Beoordelingen (review-programma's in de skill).** Onze aanpak volgt de regels: de systeemvraag op drie hoogtepunten,
vanaf zaak 3 met drie sterren, nooit na een fout, geen beloning, en "Wat kan beter?" staat los van de beoordelingsvraag (dus
geen "alleen tevreden spelers doorsturen", wat de skill als gating afwijst). De drie momenten (zaak opgelost, weekzaak
zonder hint, 7 dagen streak) passen precies in Apple's drie vragen per jaar. Toevoegen: op elke beoordeling reageren.

## 5. Alle verbeterpunten

Prioriteit: **1** = nu, zonder nieuwe build, of nog in 1.5 als die niet is ingediend; **2** = in 1.6; **3** = later.
Moeite: **klein** (minder dan een uur), **middel** (een halve dag, vaak door 19 vertalingen), **groot** (een dag of meer).

| # | Verbeterpunt | Skill | Prio | Moeite | Waar |
|---|---|---|---|---|---|
| 1 | Deelvenster eerst, klembord als terugval; `share_done` meten | referrals | 1 | klein (middel met `@capacitor/share` + build) | app.js `shareAny` |
| 2 | Campagnetokens `pt`/`ct` in alle App Store-links | referrals, attribution | 1 | klein | board.js, web-daily/, socialbio |
| 3 | Webdagzaak: Smart App Banner, `og:image` 1200×630, `summary_large_image` | referrals, image | 1 | klein | web-daily/index.html, docs/play/ (geen app-build nodig) |
| 4 | Lees de A/B-test af vóór de release van 1.5; daarna één groot verschil testen | ab-testing | 1 | klein | `node store/asc-experiment.js list` |
| 5 | In-App Event "Major Update" voor 1.5 in 23 talen, naast de zaak van de week | aso, launch | 1 | middel | store/events/ |
| 6 | Op elke beoordeling reageren, in de taal van de schrijver | aso, referrals | 1 (doorlopend) | klein | App Store Connect |
| 7 | "geen timers" weg uit de NL-beschrijving (andere talen nakijken); ontkenningsrij inkorten | copy-editing | 1 als 1.5 nog open is, anders 2 | klein | store/metadata/1.5.0/*.json |
| 8 | Beschrijving r.2-3: "No ads between cases. Hints that explain, never spoil." per taal | copywriting, customer-research | 2 | middel | store/metadata |
| 9 | Vorm van de reclame vastleggen vóór 5.000 downloads (vrijwillig, frequentielimiet, niet in de eerste zaken, Pass haalt weg) | pricing, customer-research | 2 (besluit nu) | klein | docs/STRATEGIE.md §7 |
| 10 | Pass-scherm: inhoud achter de deur tonen, anker "14 werelden los", knop "Open alles", hintmelding met verdienen, onderregel 1.5, "vrije dagen" uitleggen | paywalls, marketing-psychology | 2 | middel | app.js `renderStore`, index.html, i18n/ |
| 11 | `buy_tap` en `buy_cancel` meten | paywalls, analytics | 2 | klein | app.js `buy`, meting/src/index.js |
| 12 | Gezinsdeling voor Pass en werelden overwegen (onomkeerbaar) | pricing | 2 | klein | besluit Jaimy, App Store Connect |
| 13 | Gepromote aankoop: Crimson Pass op de productpagina | aso | 2 | middel | App Store Connect, beeld 1024 px |
| 14 | Aha-analyse: welk gedrag op dag 0 voorspelt D7 | onboarding | 2 | middel | crimson-meting |
| 15 | Meldingen per dag anders, met dagzaak of open zaak | onboarding | 2 | middel | app.js `scheduleReminder`, PLAN-1.6 |
| 16 | Toast "elke dag om 18:30" corrigeren | onboarding | 2 | klein | app.js r. 849 |
| 17 | Startknop eerste keer: "Los je eerste zaak op" | onboarding | 2 | klein | index.html r. 47, app.js r. 81 |
| 18 | Persmap-pagina en `store/PERS.md` bijwerken (1.5, nieuwe naam, pitch onder 150 woorden met nieuwshaak) | public-relations | 2 | middel | docs/, store/PERS.md |
| 19 | Makersbrief volgens de skill: 2-3 punten, geen script, "gifted"/#ad, één code per maker | influencer-marketing | 2 | klein | store/social/ |
| 20 | Oefenzaak als eerste afgevinkte stap op het pad | onboarding | 3 | middel | campaign.js, app.js |
| 21 | Beeld 3 laat "eindeloos" zien (archief of pad) in plaats van een bord | aso | 3 | middel | store/make-store-cards.js |
| 22 | Play-beschrijving met genrewoorden (Play leest de beschrijving) | aso | 3 (bij livegang) | klein | store/play-listing.js |
| 23 | Zoekwoordenproef en-US: "addictive", "brain teaser" | aso, customer-research | 3 | klein | 1.6-metadata, zoekposities meten |

## 6. Installeren als Claude-skill: advies en stappen

**Advies: niet de hele plugin, wel zeven skills plus het contextbestand, in het Murdoku-project.**

Waarom niet alles: (1) 53 skills met lange beschrijvingen staan in elke sessie in de lijst (ruwweg 30 kB beschrijvingstekst), ook in
Spaarplan, Forma en Helios; (2) ze overlappen met wat er al is (`marketing:*`, `small-business:*`, `writing-skills:*`,
`vakmanschap`); (3) driekwart is SaaS/web/B2B en zou bij een vraag over Crimson de verkeerde skill kunnen laten winnen.
Waarom wel deze zeven: ze waren in §4 bruikbaar en de inhoud is goed. Waarom per project: dan lezen ze ons contextbestand en
staan ze niet in andere projecten in de weg. Kopieer alleen `SKILL.md` en `references/`, niet `tools/` of `scripts/` (die
roepen externe diensten aan met sleutels).

Installeren doet Jaimy zelf (de auto-modus weigert het schrijven naar `.claude/skills` als "persistence"; zie het geheugen
over plugins). Alles via HTTPS, want SSH naar GitHub werkt op deze Mac niet.

```bash
# 1. Vaste versie ophalen (HTTPS), buiten de Murdoku-repo
cd ~/Developer
git clone --depth 1 --branch v2.14.0 https://github.com/coreyhaines31/marketingskills.git marketingskills-v2.14.0

# 2. Zeven skills naar het project, zonder evals
mkdir -p ~/Developer/Murdoku/.claude/skills
cd ~/Developer/marketingskills-v2.14.0/skills
for s in aso onboarding paywalls referrals copywriting customer-research ab-testing product-marketing; do
  cp -R "$s" ~/Developer/Murdoku/.claude/skills/
  rm -rf ~/Developer/Murdoku/.claude/skills/$s/evals
done

# 3. MIT vraagt de licentietekst bij kopieën (de Murdoku-repo is openbaar)
cp ~/Developer/marketingskills-v2.14.0/LICENSE ~/Developer/Murdoku/.claude/skills/MARKETINGSKILLS-LICENSE.txt
```

(Dat zijn er acht met `product-marketing`; die schrijft alleen het contextbestand.)

4. **Contextbestand**: maak `~/Developer/Murdoku/.agents/product-marketing.md` (concept in bijlage A), of start een sessie in
   Murdoku en vraag `/product-marketing` om het samen in te vullen. Zet de vaste afspraken erin, anders stelt een skill
   bijvoorbeeld Apple Ads voor.
5. **Proef**: nieuwe sessie in `~/Developer/Murdoku`, typ `/aso` en vraag "audit store/metadata/1.5.0/nl-NL.json". De skill
   moet het contextbestand eerst lezen.
6. **Git**: kies of `.claude/skills/` mee in de repo gaat (mag, met het licentiebestand) of in `.gitignore`. Niets
   committen tot Jaimy kiest.
7. **Bijwerken**: niet automatisch. Bij een nieuwe release opnieuw stap 1-2 met de nieuwe tag, na het lezen van `VERSIONS.md`.

Wie toch alles wil (niet aangeraden), met de HTTPS-omleiding uit het geheugen:

```bash
GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0='url.https://github.com/.insteadOf' GIT_CONFIG_VALUE_0='git@github.com:' \
  claude plugin marketplace add coreyhaines31/marketingskills
GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0='url.https://github.com/.insteadOf' GIT_CONFIG_VALUE_0='git@github.com:' \
  claude plugin install marketing-skills@marketingskills --scope project
```

## Bijlage A. Concept `.agents/product-marketing.md` voor Crimson Ledger

```markdown
# Crimson Ledger: product marketing context (bijgewerkt 2-11-2026)

## Product
iOS-detectivepuzzelspel (iPhone en iPad; Android in gesloten test). Elke zaak: een plattegrond, verdachten met
verklaringen; wie alleen was met het slachtoffer is de dader. 16 werelden, 1.024 zaken, elke dag een nieuwe zaak,
zaak van de week op meesterniveau, eindeloos archief. Hints leggen uit, verklappen nooit; elke zaak één oplossing.
Gratis te downloaden; Crimson Pass (€ 4,99 eenmalig) opent alles; losse werelden € 1,99. Geen abonnement, geen account,
offline, 20 talen in het spel, 23 winkeltalen. Eén onafhankelijke maker uit Nederland.

## Doelgroep en kanalen
Puzzelaars die "murder sudoku" en varianten zoeken (99% van de vertoningen via App Store-zoeken). Grootste winkels naar
vertoningen: VS, Saoedi-Arabië, Japan, Brazilië, Mexico, Turkije, Frankrijk, Nederland.

## Concurrenten
Enigmic (2.327 VS-beoordelingen, reclame na elke zaak), Tiny Crimes, Whodoku, GridNoir, Mysteryic, Murdoria, Cluedoku.

## Verschil
Geen reclame tussen zaken; hints die uitleggen; eindeloos veel zaken; 16 werelden van Luxor tot Hollywood; Inspecteur Van Dam.

## Vaste afspraken (niet heronderhandelen)
- Geen Apple Ads, geen betaalde reclame, geen beloning voor beoordelingen.
- Haak = eindeloos veel zaken. Nooit "gratis proberen", nooit aantallen gratis zaken in promotietekst, wat is er nieuw of
  onderschriften; gratis/aankoop hooguit één keer neutraal in de laatste alinea van de beschrijving. Nooit "koop/buy".
- Geen ★ of emoji in App Store-teksten. Geen merknamen van anderen (Murdle, Cluedo, Enigmic, Murdoku).
- Social via Buffer; in social niet de woorden killer/murder/moordenaar/asesino.
- Updates bundelen. Reclame pas vanaf 5.000-10.000 downloads.

## Bewijs
NL 5 beoordelingen, gemiddeld 4,6. Conversie vertoning → download 1,0% (16-29 okt). D1 18%, D7 5%.

## Lessen
- Genrewoord in de naam werkt beter dan een sfeernaam (CONVERSIE.md).
- "Gratis proberen" en "240 gratis zaken" schrikken af (Jaimy, 2-11).
- "16 werelden" klinkt niet aantrekkelijk; "eindeloos" wel.
- Bij Enigmic gaat 40% van de lage reviews over reclame na elke puzzel.
```

## Bronnen

- Repo: https://github.com/coreyhaines31/marketingskills (v2.14.0, commit 88c79f6, 30-10-2026), licentie `LICENSE` (MIT).
- Gelezen skills en referenties: `aso` (+ scoring-criteria, benchmarks, apple-specs), `onboarding` (+ minimum-path-to-value),
  `paywalls` (+ mobile-subscription-paywalls), `pricing`, `referrals` (+ viral-mechanisms, review-platform-rules), `launch`,
  `public-relations` (+ story-angles), `copywriting`, `copy-editing`, `marketing-psychology`, `offers`, `ab-testing`,
  `influencer-marketing`, `reverse-engineer-marketing` (industries/mobile-apps-games); van de overige alle koppen en beschrijvingen.
- Apple, Product Page Optimization: https://developer.apple.com/app-store/product-page-optimization/ (90 dagen, 90% zekerheid).
- App Store Connect Help, een test uitvoeren: https://developer.apple.com/help/app-store-connect/create-product-page-optimization-tests/run-a-test
- Phiture over PPO en nieuwe versies: https://phiture.com/asostack/ios15-product-page-optimization/ ; AppTweak:
  https://www.apptweak.com/en/aso-blog/product-page-optimization-a-guide-to-app-store-a-b-testing
- Reviews: App Store-RSS `itunes.apple.com/us/rss/customerreviews/id=6763931528` (Enigmic), 6776382837 (Tiny Crimes),
  6787716218 (Whodoku), 10 pagina's, opgehaald 2-11-2026. Zoekresultaat VS "murder sudoku": iTunes Search API, 2-11-2026.
- Eigen bestanden: docs/STRATEGIE.md, store/CONVERSIE.md, store/metadata/1.5.0/OPDRACHT.md, store/ASO.md,
  store/TIKTOK-PLAN.md §16, docs/PLAN-1.6.md, docs/RETENTIE-2026-10-20.md.
