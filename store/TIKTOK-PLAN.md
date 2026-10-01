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
- **Posten vanaf de telefoon.** Via Higgsfield zetten we video's in je TikTok-concepten; jij
  publiceert met de hand en kiest daar een trending geluid. Verkopers beweren dat direct
  posten via de API bereik kost; onbewezen, maar concepten kosten niets extra.

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
