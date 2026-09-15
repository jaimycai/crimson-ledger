# Hoe het geld op je bankrekening komt

Korte versie: **Apple int het geld en maakt het maandelijks over naar je IBAN.**
Je hebt geen Stripe, geen betaalprovider en geen eigen server nodig. Wat je wél
moet doen staat hieronder, in volgorde.

## Waarom geen Stripe (en wanneer wel)

App Store-richtlijn 3.1.1 zegt: alles wat functies in de app ontgrendelt —
werelden, hints, bordthema's, een pass — moet via In-App Purchase van Apple.
Een eigen betaalscherm of een link naar Stripe voor deze producten leidt tot
afwijzing bij de beoordeling, en bij herhaling tot verwijdering van het
ontwikkelaarsaccount. Stripe mag in een iOS-app alleen voor fysieke goederen en
diensten buiten de app (denk aan een T-shirt of een concertkaartje).

Apple is ook *merchant of record*: Apple rekent de btw af met de klant en met de
belastingdienst van elk land. Jij krijgt het netto bedrag. Dat scheelt je een
btw-administratie per land.

Stripe is wél de juiste keuze als je later een **webversie** verkoopt. Crimson
Ledger is gewone HTML, CSS en JavaScript, dus hij draait in elke browser. Wat
daarvoor nodig is staat onderaan bij *Later: de webversie*.

## Wat Apple inhoudt

| | Commissie Apple | Jij houdt over |
|---|---|---|
| Standaard | 30 % | 70 % |
| **Small Business Program** | **15 %** | **85 %** |

Het Small Business Program geldt voor iedereen met minder dan 1 miljoen dollar
opbrengst per kalenderjaar. Dat ben jij. **Je moet je er apart voor aanmelden**,
het gaat niet automatisch. Bij € 4,99 scheelt het ongeveer 75 cent per verkoop.

Aanmelden: App Store Connect › *Business* (of *Agreements, Tax, and Banking*) ›
**Apple Small Business Program** › aanmelden. Het gaat in op de eerste van de
maand ná goedkeuring, dus doe dit vóór je eerste verkoop.

## Stap 1 — Overeenkomsten, belasting en bankgegevens

App Store Connect › *Business* › *Agreements, Tax, and Banking*. Alleen de
**Account Holder** (de eigenaar van het account) kan dit doen.

- [ ] **Paid Apps-overeenkomst** tekenen. Zolang deze op *Pending* staat, kun je
      geen betaalde producten of in-app-aankopen indienen.
- [ ] **Bankgegevens**: IBAN en BIC/SWIFT. De naam op de rekening moet exact
      overeenkomen met de naam of het bedrijf op het ontwikkelaarsaccount.
      Anders weigert Apple de uitbetaling.
- [ ] **Belastinggegevens**, drie formulieren:
      - *U.S. Tax Form*: als je in Nederland woont vul je **W-8BEN** in
        (particulier) of **W-8BEN-E** (bedrijf). Nederland heeft een
        belastingverdrag met de Verenigde Staten, dus vul het verdragsartikel in
        en geef je Nederlandse fiscaal nummer (BSN of RSIN) op. Doe je dit niet,
        dan houdt Apple 30 % Amerikaanse bronbelasting in op de Amerikaanse
        verkopen.
      - *Netherlands Tax Info*: btw-nummer als je dat hebt. Heb je geen
        onderneming, dan kun je dit leeg laten; Apple draagt de btw dan zelf af.
      - *Australia / andere landen*: alleen invullen als het formulier verschijnt.

## Stap 2 — Prijzen instellen

- De app zelf blijft **gratis**.
- De negen in-app-aankopen krijgen elk een prijs. Je kiest een prijspunt; Apple
  rekent zelf de bedragen voor alle 175 landen uit, inclusief btw.
- Prijzen uit `store/METADATA.md`: Crimson Pass € 4,99, hintpakket € 0,99,
  bordthema's € 1,99, wereldpakketten € 1,99 per stuk.

## Stap 3 — Wanneer komt het geld binnen

- Apple sluit elke maand af en betaalt ongeveer **30 tot 45 dagen na het einde
  van die maand** uit. Verkoop je in januari, dan staat het geld eind februari
  of begin maart op je rekening.
- Apple betaalt pas uit als je saldo boven de **minimumdrempel** komt. Die
  drempel zie je in App Store Connect › *Payments and Financial Reports*. Kom je
  er niet boven, dan schuift het bedrag door naar de volgende maand.
- Dagelijkse verkoopcijfers staan in App Store Connect › *Trends*. De officiële
  afrekening staat onder *Payments and Financial Reports*.

## Stap 4 — Belasting in Nederland

Dit is geen belastingadvies; laat het één keer nakijken door een boekhouder
zodra er echt geld binnenkomt.

- Inkomsten uit een app zijn belastbaar. Verkoop je structureel, dan is een
  inschrijving bij de **Kamer van Koophandel** (eenmanszaak) meestal de juiste
  vorm; bij incidentele inkomsten kan het onder *resultaat uit overige
  werkzaamheden* vallen in je aangifte inkomstenbelasting.
- Apple betaalt uit vanuit Luxemburg en Australië. Bewaar de maandelijkse
  afrekeningen uit *Payments and Financial Reports* als onderbouwing.
- Omdat Apple merchant of record is, hoef jij geen btw per land af te dragen.

## Testen vóór de eerste echte verkoop

- **In Xcode, zonder App Store Connect**: *Product › Scheme › Edit Scheme › Run ›
  Options › StoreKit Configuration* → kies `App/Products.storekit`. Je koopt dan
  met nepgeld in de simulator; er gaat geen geld heen en weer.
- **Met een echte Apple-omgeving**: App Store Connect › *Users and Access* ›
  *Sandbox Testers* → maak een testaccount. Log op je iPhone in onder
  *Instellingen › App Store › Sandbox-account* en koop in de app. Ook hier gaat
  geen echt geld heen en weer, maar de hele keten wordt getest: kopen,
  herstellen, gezinsdeling.
- **In de browser**: `localStorage.setItem('crimson-store-mock', '1')` zet de
  nep-winkel aan, zodat je de schermen kunt bekijken zonder Apple.

## Later: de webversie (hier hoort Stripe wél)

Als je Crimson Ledger ook op het web wilt verkopen, buiten de App Store om, dan
is Stripe de juiste keuze en houd je bijna alles zelf (Stripe rekent ongeveer
1,5 % plus € 0,25 per Europese kaartbetaling, tegen 15 % bij Apple). Wat daar
nog voor moet worden gebouwd:

1. Een plek om de app te hosten (de map `www/` is een complete statische site).
2. Een klein stukje server voor Stripe Checkout en de webhook; zonder server kan
   een betaling niet veilig worden gecontroleerd. Een sleutel die `sk_` heet
   hoort alléén op die server, nooit in `www/` of in de repo.
3. Een manier om te onthouden wie betaald heeft: een licentiecode of een
   e-mailinlog, plus een controle in `store.js` naast de bestaande
   Apple-controle.

Dat is een eigen project van een dag of twee. Zeg het als je het wilt; het staat
los van de App Store-versie en verandert niets aan de app die je nu uploadt.
