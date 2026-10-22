# Winkeltekst na 1.4: verkopen zoals Supercell (22-10-2026)

Aanleiding, Jaimy 22-10-2026: "waarom hebben beide apps zo weinig downloads vandaag en de tekst op
beide apps moeten beter. vooral crimson ledger met de update. er staat koop en dat schrikt mensen af.
wees daarin een goede marketeer en zie hoe toonaangevende games het opbouwen zoals bij de spellen van
supercell"

## Waar "koop" nu staat

1. **Wat is er nieuw van 1.4.0** (live sinds 22-10 10:30): "Je kunt een wereld ook los kopen." In alle
   23 winkeltalen. Vast tot de volgende versie: Apple laat bij een live versie alleen de promotietekst
   wijzigen.
2. **Schermafbeelding 8** (`08-winkel`): het winkelscherm met prijzen, kop "LOS TE KOOP" en onderschrift
   "De rest koop je één keer". Dit gaat in tegen onze eigen regel in ASO.md: geen prijzen op
   schermafbeeldingen.
3. **In de app**, winkelvenster (`app.js` renderStore): "Los te koop", "Je kunt de wereld ook los
   kopen", "of koop ze los".

## Hoe Supercell het doet (iTunes Lookup, 22-10-2026)

Bekeken: Clash of Clans, Clash Royale, Brawl Stars, Hay Day, Boom Beach, Squad Busters, mo.co.

- **Eerste zin = de speler in de wereld zetten**, met een werkwoord: "Enter the Arena!", "Join millions
  of players...", "Welcome to Hay Day", "The battle awaits!".
- **Geld staat er één keer, neutraal**, als mededeling: "...is free to download and play, however, some
  game items can also be purchased for real money". Nooit in de verkopende tekst. Nooit "buy".
- **Kopjes in hoofdletters, met een werkwoord**: "COLLECT AND UPGRADE 100+ CARDS", "BATTLE IN MULTIPLE
  GAME MODES".
- **Wat is er nieuw = een evenement**: een naam voor de update ("UPDATE 69: ROYAL ACADEMY",
  "Builder's Been Busy."), dan per nieuw ding een eigen regel met uitroep: "NEW BRAWLER! Cosmo, a
  magnetic robot scientist who uses gravity to his advantage!". De Pass is inhoud ("Brawl Pass Season
  54"), geen aanbieding.
- **Woorden**: unlock, collect, earn, discover, join. Wat je kunt verdienen staat vóór wat je kunt betalen.
- **Schermafbeeldingen**: personages en actie, nooit de winkel.

## Nu te doen zonder nieuwe versie: promotietekst

Promotietekst mag altijd en zonder beoordeling (max. 170 tekens).

- nl-NL (162): `Nieuw: acht werelden! Van een vervloekt graf in Luxor tot een casino in Monte Carlo. Kun jij de dader vinden? 128 zaken gratis, elke dag een nieuwe. Geen reclame.`
- en-US / en-GB (145): `New: eight worlds! From a cursed tomb in Luxor to a casino in Monte Carlo. Can you find the culprit? 128 free cases, a new one every day. No ads.`
- Overige 21 talen: vertalen per taal (vertaler plus nalezer, zoals bij 1.4).

## Versie 1.4.1: Wat is er nieuw

### nl-NL

```
DE GROTE REIS: ACHT NIEUWE WERELDEN!
Inspecteur Van Dam pakt zijn koffer. 512 nieuwe zaken en 64 nieuwe verdachten wachten op je.

• NIEUWE WERELD! Het Graf van Nefer-Ankh. Luxor, 1922: een vloek op de drempel, en een lord die de eerste stap niet overleeft.
• NIEUWE WERELD! Casino Azur. Monte Carlo, 1960: fiches, champagne, en een eigenaar die zijn laatste gok verliest.
• NIEUWE WERELD! Opéra Lumière. Parijs, 1891: een uitverkochte première, en een directeur die na de pauze niet terugkomt.
• NIEUWE WERELD! Paradise Pictures. Hollywood, 1931: de eerste geluidsfilm, en een studiobaas die zijn laatste scène niet haalt.
• NIEUWE WERELD! Hacienda San Isidro. Het agavefeest, muziek op de patio, en een patrón die niet meer opstaat.
• NIEUWE WERELD! Karavanserai Al-Nour. Een oase op de specerijenroute, en een karavaanleider die niet meer vertrekt.
• NIEUWE WERELD! De Abdij van Sint-Aldric. 1327: een verboden boek, en een abt die de nacht niet overleeft.
• NIEUWE WERELD! Vuurtoren Grauwkaap. 1900: een storm van drie dagen, en een licht dat voor het eerst in twintig jaar uitgaat.
• Elke wereld heeft een eigen onderscheiding om te verdienen.
• Los zeven dagen op rij de dagelijkse zaak op en krijg een wereld cadeau.

Kun jij ze allemaal sluiten?
```

### en-US / en-GB

```
THE GRAND TOUR: EIGHT NEW WORLDS!
Inspector Van Dam packs his suitcase. 512 new cases and 64 new suspects are waiting for you.

• NEW WORLD! The Tomb of Nefer-Ankh. Luxor, 1922: a curse on the threshold, and a lord who does not survive the first step.
• NEW WORLD! Casino Azur. Monte Carlo, 1960: chips, champagne, and an owner who loses his last bet.
• NEW WORLD! Opéra Lumière. Paris, 1891: a sold-out premiere, and a director who does not come back after the interval.
• NEW WORLD! Paradise Pictures. Hollywood, 1931: the first talking picture, and a studio boss who does not make it through his final scene.
• NEW WORLD! Hacienda San Isidro. The agave festival, music on the patio, and a patrón who will not get up again.
• NEW WORLD! The Caravanserai of Al-Nour. An oasis on the spice route, and a caravan leader who never sets out again.
• NEW WORLD! The Abbey of Saint Aldric. 1327: a forbidden book, and an abbot who does not survive the night.
• NEW WORLD! Greycape Lighthouse. 1900: a three-day storm, and a light that goes dark for the first time in twenty years.
• Every world has its own award to earn.
• Solve the daily case seven days in a row and get a world as a gift.

Can you close them all?
```

Bron van elke zin: de taglines in `themes.js` en `i18n/en.js`, de cadeauregel in `store.js` (`giftForStreak`,
7 en 30 dagen, niet met de Pass). Geen prijs, geen "kopen".

## Versie 1.4.1: beschrijving

Alleen de opening en het slot veranderen; de kopjes ertussen blijven feitelijk wat ze nu zijn.

### nl-NL, opening (vervangt de eerste twee alinea's)

```
Jij bent de detective. Iemand is vermoord, en iedereen heeft een verklaring: in een hoek, naast een plant, links van Mortimer. Zet de verdachten op de plattegrond, vind wie alleen was met het slachtoffer en wijs de dader aan. Klopt het? Dan bekent hij.

Elke zaak heeft precies één oplossing. Nog nooit zo'n puzzel opgelost? Een begeleide oefenzaak helpt je op weg.
```

### nl-NL, slot (vervangt "GRATIS SPELEN, OF ALLES INEENS")

```
GRATIS TE SPELEN
Het Landhuis en Het Piratenschip (128 zaken), de dagelijkse zaak, de zaak van de week en het archief van elke wereld zijn gratis, net als drie hints per dag. Los zeven dagen op rij de dagelijkse zaak op en je krijgt een wereld cadeau. Alles meteen open? De Crimson Pass geeft alle werelden en onbeperkt hints: eenmalig, geen abonnement.
```

### en-US, opening

```
You are the detective. Someone has been murdered, and everyone has a statement: in a corner, next to a plant, to the left of Mortimer. Place the suspects on the floor plan, find who was alone with the victim and name the culprit. Got it right? Then they confess.

Every case has exactly one solution. New to this kind of puzzle? A guided practice case shows you how.
```

### en-US, slot

```
FREE TO PLAY
The Manor and The Pirate Ship (128 cases), the daily case, the case of the week and the archive of every world are free, and so are three hints a day. Solve the daily case seven days in a row and you get a world as a gift. Want everything open right away? The Crimson Pass opens every world with unlimited hints: one purchase, no subscription.
```

## Versie 1.4.1: schermafbeeldingen

- **08-winkel eruit.** In de plaats: een zaak in een nieuwe wereld (Het Graf van Nefer-Ankh of Casino
  Azur, het rijkste palet). Onderschrift nl "Acht nieuwe werelden" / "Van een graf in Luxor tot een casino
  in Monte Carlo."; en "Eight new worlds" / "From a tomb in Luxor to a casino in Monte Carlo." Zolang de
  update nieuw is op plek 2, daarna weer achteraan.
- **Eerste schermafbeelding**: kop "Vind de dader." / "Find the culprit.", onderschrift "Elke zaak heeft
  één oplossing. Geen reclame." / "Every case has one solution. No ads." (stond al als hefboom in ASO.md).

## Versie 1.4.1: woorden in de app

In `app.js` (renderStore) en daarna in alle 19 andere taalbestanden:

| Nu | Wordt |
|---|---|
| Los te koop | Extra's |
| `${titel}` hoort bij de Crimson Pass. Je kunt de wereld ook los kopen. | `${titel}` zit in de Crimson Pass. Je kunt deze wereld ook los openen. |
| Bordthema's en portretlijsten horen bij de Crimson Pass, of koop ze los. | Bordthema's en portretlijsten zitten in de Crimson Pass. Je kunt ze ook los openen. |

De prijs blijft op de knop: dat doet Supercell ook.

## Cijfers achter de keuze

Eigen tellers (crimson-meting), laatste 30 dagen tot 22-10 18:48: de winkel is 60 keer geopend en er is 1
echte aankoop gedaan (10 hints). Een wereld cadeau via de streak: 1 keer.
De winkel levert dus nu bijna niets op. Wie hem op de winkelpagina ziet, kan wel afhaken.
