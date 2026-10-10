# TikTok, Reels en Shorts voor Crimson Ledger — plan op basis van onderzoek

*1 oktober 2026. Drie onderzoeken naast elkaar: praktijk van ontwikkelaars met cijfers,
ervaringen uit eerste hand op Reddit, en wat het genre zelf op TikTok doet. Bij elke
bewering staat hoe hard hij is. Waar bronnen elkaar tegenspreken staat dat erbij.*

## 1. Wat je mag verwachten

- De meeste ontwikkelaars halen **een paar honderd views per video** en bijna geen
  installs. Voorbeelden uit eerste hand: Worderer (dagelijkse woordpuzzel), 31 video's in een
  maand, beste 308 views, minder dan 50 downloads. LifePilot: 8 video's, ongeveer 2.000
  views, 11 downloads.
- **Van view naar install: 0,5 tot 1 procent** als vuistregel, in kleine steekproeven eerder minder.
- Resultaat komt van **één uitschieter**, niet van het gemiddelde. Wie wint, herhaalt daarna
  het formaat dat won.
- Eén ontwikkelaar zag na drie weken van drie video's per dag de vertoningen in de App Store
  stijgen van ongeveer 280 naar 1.100 per dag, zonder link. Zelf noemt hij het "correlation, not proof".

Dit kanaal is dus een loterij met veel loten. Het loont alleen als elk lot weinig tijd kost.

## 2. Het voordeel dat wij hebben: het genre is nu een trend

- Het puzzelboek waar dit speltype op lijkt ging in de zomer van 2026 viraal op TikTok, eerst
  in Spanje, daarna BookTok. Euronews (1 sep 2026): meer dan 140.000 boeken verkocht in Spanje.
  Girlscene.nl schreef erover op 16 aug 2026.
- TikTok kent zoeksuggesties als "... puzzle app" en "how to play ...". Er is dus zoekvraag
  naar een app, en een Nederlandse uitleg lijkt nog niet te bestaan.
- Concurrent Enigmic laat een extern account posten met de haak "Can you solve the case
  before anyone else?" en lift mee op de hashtag van het boek.
- Raadselaccounts zonder gezicht zijn groot: @misterriddle rond 917.000 volgers, @myriddle3
  507.700. Eén "Who is the killer?"-video: 27.300 likes en 15.800 reacties. Die verhouding
  is uitzonderlijk hoog; het antwoord achterhouden lokt reacties uit.

**Beslissing voor Jaimy:** de naam van dat boek is een merk van de auteur. De repo-regel
verbiedt die naam in app en winkel. Als hashtag onder een video is het gebruikelijk, maar het
blijft een merkvraag. Kies zelf: wel of niet taggen. Zonder die tag: #moordraadsel #raadsel
#logicpuzzle #whodunnit #detectiveriddles #puzzletok.

## 3. Wat werkt en wat niet

| Werkt (met bron) | Werkt niet (met bron) |
|---|---|
| Eén zaak stap voor stap oplossen, hardop redeneren | Gepolijste, advertentie-achtige video ("higher production value actually performs worse", Zukowski) |
| "Kun jij de dader vinden?" met het antwoord in de reacties | AI-video: Sora-clips "underperformed"; een AI-UGC-video kreeg "that is ai slop" |
| Fotocarrousel (AI-beeld + raadsel + schermafbeelding): 3.000 vertoningen per stuk, soms 20.000 (The Sphinx Riddle) | Kant-en-klare gameplay-clips zonder haak: "completely stuck at 0 views" |
| Uitleg "zo speel je dit" | Watermerk van TikTok op Reels of Shorts |
| Spelers en makers die zelf posten: Murdle, Storyteller, Clues by Sam groeiden zo | Winkelpagina in de verkeerde taal voor het publiek dat de video bereikt |

Gevolg voor onze eerste video (noir-opening uit Higgsfield + spelbeeld + eindkaart): dat is
precies het gepolijste type dat het slechtst scoort. Bewaren voor later als betaalde Spark Ad
of als intro; **niet** het hoofdformaat. Higgsfield gebruiken we voor stilstaande beelden in
carrousels en voor de eerste twee seconden van een raadsel, niet voor hele filmpjes.

## 4. Het account

- **Eén account, Nederlands, persoonlijk (creator), geen Business-account.** Reden: een
  Business-account mag geen trending geluiden gebruiken. Nederlands eerst omdat de uitleg in
  het Nederlands nog niet bestaat en wij in de Nederlandse winkel al op plek 4 staan voor
  "moordmysterie". Engels volgt als een formaat wint. (Of één account per taal beter is: geen
  betrouwbare bron gevonden.)
- **Naam**: iets wat op het raadsel wijst en de app noemt, bijvoorbeeld `@crimsonledger`,
  weergavenaam "Crimson Ledger · moordraadsels".
- **Opwarmen**: 3 tot 5 dagen gewoon gebruiken in de puzzelhoek (kijken, liken, reageren)
  voor de eerste post. Bewijs is dun (alleen ervaringen en verkopers), kost niets.
- **Link in bio** kan pas vanaf 1.000 volgers. Tot die tijd zoeken kijkers de naam in de
  winkel. Daarom: naam van de app in beeld en in de beschrijving, elke video.
- **Verplicht aanzetten**: "Commerciële inhoud bekendmaken › Je eigen merk" (TikTok-regel).
  AI-beeld dat echt lijkt: label "Door AI gegenereerd".
- **Inplannen per week via Metricool** (besluit Jaimy, 2 oktober 2026). Elke week zet Claude
  zeven posts als concept in Metricool. Jaimy keurt de week één keer goed in de chat ("plan
  week N in"). Daarna zet Claude ze op automatisch publiceren, elke dag om 19:00. Metricool
  plant video's én carrousels; TikTok Studio plant geen carrousels. Instagram Reels en YouTube
  Shorts kunnen later in dezelfde planning.
- **Geluid zit in de video zelf.** Bij ingeplande posts kies je geen trending geluid in de app.
  Elke video krijgt daarom een eigen geluidsspoor uit `social/geluid.py` (tikkende klok, lage
  toon, pianomotief; zelf gemaakt, geen rechten). Bij carrousels staat "Willekeurige muziek
  toevoegen" aan. TikTok staat via Metricool geen AI-label op fotoposts toe; carrousels melden het
  AI-beeld daarom in de tekst: "Beeld 1 is gemaakt met AI." Verkopers beweren dat posten via de API bereik kost;
  onbewezen.

## 5. Drie formaten, 21 dagen

Eén post per dag, 21 dagen. Elk formaat zeven keer, door elkaar. Over frequentie zijn de
bronnen het oneens (2 à 3 per week tot 3 per dag); één per dag is vol te houden en geeft
genoeg loten.

**A. "Wie is de moordenaar?" (carrousel, 4 beelden)**
1. Sfeerbeeld plaats delict met de vraag in beeld (Higgsfield-still).
2. De plattegrond uit de app met het slachtoffer.
3. De verklaringen van de verdachten.
4. "Antwoord in de reacties. Speel de hele zaak in Crimson Ledger."
Eerste reactie zelf: het antwoord, vastgepind, pas na 24 uur.

**B. Meeloos-video (30 tot 60 seconden, schermopname)**
Eén zaak, tekst in beeld bij elke stap: "Thomas stond tegen een muur, dus niet hier". De
eerste seconde toont al het bord. Geen intro, geen logo vooraf. Over de lengte zijn bronnen
het oneens (zo kort mogelijk tegenover één minuut of langer); we testen 30 en 60.

**C. "Zo speel je het" (20 seconden)**
Drie regels van het spel in drie beelden. Dit bedient de zoekvraag en is in het Nederlands nog vrij.

Dezelfde bestanden gaan zonder watermerk naar Instagram Reels en YouTube Shorts. Eén bron
zegt dat tekstrijke spellen en een publiek boven de 35 het op TikTok minder doen; Reels en
Shorts zijn daarom geen bijzaak.

## 6. Meten en stoppen

- **Per post**: views na 48 uur, reacties, bewaard, gedeeld.
- **Per dag**: vertoningen en downloads in App Store Connect, en `node store/meting.js`.
- **Campagnelink** voor de bio zodra die mag: `?pt=<provider>&ct=tiktok_nl_bio&mt=8`. Apple
  toont een campagne pas na 24 uur en pas vanaf 5 downloads; bij kleine aantallen zie je dus niets.
- **Na 7 posts per formaat**: het slechtste formaat eruit, het beste verdubbelen.
- **Stopregel na 21 dagen**: geen enkele post boven 2.000 views én geen stijging van
  vertoningen in de winkel, dan stoppen met eigen posts en alleen nog makers benaderen.

## 7. De grotere hefboom: anderen laten posten

In dit genre kwam het bereik steeds van anderen, niet van het eigen account.
- **Makers benaderen** die het boek oplossen op TikTok en Instagram: gratis Crimson Pass-code
  in ruil voor niets. Geen betaalde post, geen script.
- **Deelkaart in de app** bestaat al (emoji-kaart bij de zaak van de week). Wordle ging van 90
  naar ongeveer 10 miljoen spelers nadat het deelknopje erbij kwam. Controleren dat de kaart
  niets verklapt en de naam van de app bevat.
- **Reddit**: r/dailygames en puzzelsubs worden door ervaringsdeskundigen genoemd; cijfers per
  post niet gevonden, regels per sub niet geverifieerd. Eerst lezen, dan één eerlijke post.

## 8. Wat niet is geverifieerd

Huidige tekst van TikToks AI-regels en eventuele straffen; of een Nederlands account de
bio-link eerder krijgt; effect van land of VPN; of opwarmen iets uitmaakt; alle cijfers van
partijen die zelf een carrousel-tool verkopen.

## 9. Bijstelling na 0 views (7 oktober 2026)

Post 1 had na ruim 24 uur 0 views. Bij 0 views heeft TikTok de post nog niet verspreid. Bij ongeveer 200
views heeft TikTok hem wel aan een testgroep getoond, maar die haakte af. Nieuw onderzoek naar hoe andere
ontwikkelaars het doen, met bronnen:

- **Oorzaken van 0 views.** Vaak genoemd: een nieuw account dat te snel "zakelijk" begint (posts gepland,
  link, veel uploads) of te weinig is opgewarmd. Bronnen: r/appledevelopers juli 2026 (puzzelontwikkelaar,
  zelfde probleem), r/socialmedia mei 2026, r/gamedev. Het bewijs is zwak: losse ervaringen, geen test.
- **Wat ze als oplossing noemen.** Opwarmen: 3 tot 5 dagen scrollen, liken en reageren in de puzzelhoek. Een
  post met 0 views niet verwijderen en niet opnieuw uploaden. 24 tot 48 uur niets posten mag. Geen link in de
  bio tot de eerste posts bereik halen.
- **Plannen via een dienst.** TikTok-documentatie: alleen een *niet* geauditeerde API-dienst zet posts op
  privé. Metricool is wel geauditeerd. Dat zulke posts een straf krijgen, is alleen beweerd, nooit aangetoond.
  Het gebruikte alternatief: laat de dienst de post als concept in de TikTok-inbox zetten, kies in de app een
  geluid en publiceer zelf.
- **Carrousels winnen op zoeken en bewaren.** Een ontwikkelaar die eerlijk zegt dat hij een tool verkoopt:
  85 carrousels in 37 dagen, 690.000 views per 28 dagen, 30 tot 50 downloads per dag. Video's "stierven",
  carrousels bleven weken vindbaar. Sphinx Riddle: ongeveer 3.000 views per carrousel, uitschieters tot
  20.000. Grote datasets spreken elkaar tegen over carrousel tegenover video (Fanpage Karma tegenover Buffer).
- **Haak over een ander werkt beter dan een haak over de app.** Voorbeelden: "Alleen 2% vindt de dader",
  "Mijn vriendin dacht dat het de butler was". Haken over de app bleven steken op 200 tot 900 views, haken
  over een ander haalden 147.000 tot 234.000 (Larry, geen puzzelapp).
- **Op elke reactie reageren.** Eén video ging zo naar 160.000 views (r/IndieDev).
- **Grote raadselaccounts.** @riddle.tang (362.000 volgers) en @riddle.x8 (248.000 volgers, 1.157 video's)
  zetten het raadsel als tekst in beeld en posten veel. Een sterk Nederlands raadselaccount is niet gevonden.

**Regels vanaf nu**
1. Profiel staat klaar: naam "Crimson Ledger · moordraadsels", app-icoon als profielfoto, bio zonder link.
   Je kunt de naam pas na 13 okt weer wijzigen.
2. Week 1 loopt zoals hij in Metricool staat. Verwijder geen post met 0 views en upload hem niet opnieuw.
3. Haal posts 2 tot en met 7 samen niet meer dan 0 tot 50 views (meten op 10 okt), dan gaat week 2 anders.
   Metricool stuurt de posts dan als concept naar de TikTok-inbox, of Jaimy publiceert ze zelf in de app met
   een trending geluid. Dat is één verandering tegelijk; de inhoud blijft gelijk.
4. Nieuwe carrousels openen met een haak over een ander of een getal ("Alleen 2% vindt de dader"), niet met
   de app. De app-naam komt pas in de laatste dia en in de tekst.
5. Elke reactie krijgt binnen een paar uur antwoord van Jaimy, in de app.

## 10. Nieuwe aanpak na week 1 (10 oktober 2026)

Jaimy: "post zoveel mogelijk wat er nog beschikbaar is", en de app krijgt in 1.2 zeventien talen. Twee
onderzoeksronden (gratis planners; marketing van vergelijkbare puzzelgames). Bij elke bewering de sterkte.

**Wat de eerste week liet zien.** Post 4, een carrousel, haalde 234 views in 4,5 uur. De andere zes posts
kwamen niet boven 1 view. Winkel (7 dagen t/m 8 okt): 245 vertoningen, 31 paginaweergaven (12,7%), 7
downloads (22,6% van de bezoekers). De winkelpagina zet bezoekers dus redelijk om; bereik is het probleem.

**Plannen zonder Metricool-limiet**
- TikTok Studio op het web plant nu ook fotoposts (carrousels) in, gratis en zonder maandlimiet. Je kiest daar
  zelf het AI-label en "Jouw merk". Gezien op 10 okt. Video's uploaden lukt alleen als het Chrome-venster
  zichtbaar is; foto's lukken ook in een verborgen tabblad.
- Buffer Free: 3 kanalen, per kanaal 10 posts tegelijk in de wachtrij, geen maandlimiet, carrousels en video,
  en een API waarmee media als URL meegaan (officiële prijspagina en helpartikelen). Dit is de beste route voor
  automatisch plannen naar TikTok, Instagram en YouTube tegelijk. Account aanmaken en koppelen doet Jaimy zelf.
- Publer Free: zelfde wachtrijmodel, carrousels tot 35 foto's, geen API op het gratis plan.
- Valt af: Postiz zelf hosten (eigen TikTok-app, zonder audit alleen privé), upload-post (TikTok alleen
  betaald), Mixpost Lite (geen TikTok), Later en SocialBee (geen bruikbaar gratis plan).
- Metricool blijft voor de drie posts van week 1 die er al staan (10 t/m 12 okt), daarna niet meer.

**Wat werkte bij vergelijkbare spellen**
- Deelkaart na elke puzzel: Wordle en Clues by Sam groeiden vooral door delen (sterk voor Wordle, matig voor
  Clues by Sam). Onze deelkaart bestaat al; 8 keer gedeeld in 7 dagen.
- Carrousels zonder gezicht: alleen bewijs van verkopers (zwak), maar het is ons enige eigen signaal.
- Kleine creators (5.000 tot 100.000 volgers) met een gratis code: Wordbolt werd nummer 1 in Zweden met
  alleen Zweedse Instagram-makers (matig, oud).
- Lokalisatie van de winkelpagina: gemiddeld veel meer downloads per land, het sterkst in Azië (matig, oud).
  Zoekwoorden per taal opnieuw kiezen, niet letterlijk vertalen.
- Apple-featuring: nominatie via App Store Connect › Featuring › Nominations, minstens 3 weken vooruit. Versie
  1.2 met 17 talen past bij "App Enhancements" (matig).
- Eén account per taal: geen onafhankelijk bewijs, wel risico (zwak). Advies: één Nederlands account, later
  hooguit één Engels. De andere talen lopen via de winkel, niet via eigen accounts.

**Regels vanaf 10 oktober**
1. Carrousel is het hoofdformaat. Video's alleen nog als de carrousels stilvallen.
2. Twee posts per dag (12:30 en 19:00) zolang de voorraad strekt; daarna één per dag. Jaimy vroeg om zoveel
   mogelijk; bij geen bereik na een week terug naar één.
3. Inplannen rechtstreeks in TikTok Studio (dat test meteen of posten via een dienst de oorzaak was van 0 views).
4. Na 1.2: dezelfde carrousels in het Engels op Instagram en YouTube Shorts via Buffer, en een featuring-
   nominatie. Winkelteksten per taal met eigen zoekwoorden.
5. Week 3: vijftien Nederlandse puzzel- en BookTok-makers benaderen met een gratis code. Jaimy verstuurt.
