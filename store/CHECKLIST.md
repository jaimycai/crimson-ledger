# Indienen bij de App Store — stappen voor morgen

Alles wat vanaf de code kan is gedaan. Dit zijn de stappen die jouw account en Xcode nodig hebben, in volgorde.

## Vooraf (kan vandaag al)
- [ ] **Apple Developer Program** actief (developer.apple.com, €99/jaar). Zonder dit kan niets worden geüpload. Nieuwe aanmelding: 1–2 dagen goedkeuring.
- [x] **Xcode** geïnstalleerd (26.6), licentie geaccepteerd, iOS 26.5-platform gedownload, `xcode-select` staat goed.
- [ ] In Xcode: *Settings › Accounts* → je Apple ID toevoegen.

## Project openen
```bash
cd ~/Developer/Murdoku
npm run ios          # kopieert www/, synct Capacitor en opent Xcode
```
Let op: gebruik de map `~/Developer/Murdoku` (de kopie in `~/Documents/Claude/Murdoku` loopt via iCloud en wordt alleen gespiegeld). Na een `git pull` in Xcode eerst *Product › Clean Build Folder*.
In Xcode, doel **App**:
- [ ] *Signing & Capabilities* → Team kiezen → "Automatically manage signing" aan. Bundle ID staat op `com.jaimycai.crimsonledger`.
- [ ] *General* → Version 1.0.0, Build 1 (staan al). Deployment target iOS 15 (nodig voor StoreKit 2). Localizations: Dutch en English staan in `Info.plist` (`CFBundleLocalizations`), zodat de App Store beide talen toont.
- [x] Project compileert voor simulator én toestel (arm64 Release, gecontroleerd op 8 sep). App draait in de iPhone 17 Pro-simulator.
- [ ] Druk zelf ▶ op een simulator of je iPhone — controleer: oefenzaak start, tik werkt, haptiek, geluid.

## In-app-aankopen (App Store Connect › je app › In-App Purchases)
De app heeft een winkel (Crimson Pass, hintpakket, bordthema's, zes wereldpakketten). Zonder deze producten toont de app vaste prijzen en lukt kopen niet.
- [ ] *Overeenkomsten, belasting en bankgegevens* (Agreements, Tax, and Banking): de **Paid Apps**-overeenkomst tekenen en bank- en belastinggegevens invullen. Zonder dit worden betaalde producten niet goedgekeurd. Volledige uitleg, inclusief belastingformulieren en uitbetaling: **`store/UITBETALING.md`**.
- [ ] **Apple Small Business Program** aanvragen (15 % commissie in plaats van 30 %). Gaat in op de eerste van de maand ná goedkeuring, dus vóór je eerste verkoop aanvragen. Zie `store/UITBETALING.md`.
- [ ] Maak deze producten aan, met precies deze Product-ID's (de app zoekt erop):

| Type | Product-ID | Referentienaam | Prijs (tier) |
|---|---|---|---|
| Niet-verbruikbaar | `com.jaimycai.crimsonledger.pass` | Crimson Pass | € 4,99 |
| Verbruikbaar | `com.jaimycai.crimsonledger.hints10` | 10 hints | € 0,99 |
| Niet-verbruikbaar | `com.jaimycai.crimsonledger.cosmetics` | Bordthema's en lijsten | € 1,99 |
| Niet-verbruikbaar | `com.jaimycai.crimsonledger.world.hotel` | Wereld: Grand Hotel Aurora | € 1,99 |
| Niet-verbruikbaar | `com.jaimycai.crimsonledger.world.ruimte` | Wereld: Station Orion | € 1,99 |
| Niet-verbruikbaar | `com.jaimycai.crimsonledger.world.museum` | Wereld: Het Museum | € 1,99 |
| Niet-verbruikbaar | `com.jaimycai.crimsonledger.world.trein` | Wereld: De Nachttrein | € 1,99 |
| Niet-verbruikbaar | `com.jaimycai.crimsonledger.world.circus` | Wereld: Het Circus | € 1,99 |
| Niet-verbruikbaar | `com.jaimycai.crimsonledger.world.skihut` | Wereld: De Skihut | € 1,99 |

- [ ] Per product: naam en omschrijving in het Nederlands én Engels (teksten staan in `store/METADATA.md`, onderaan), een schermafbeelding voor de beoordelaar (`store/screenshots/08-winkel.png`).
- [ ] Zet "Gezinsdeling" (Family Sharing) aan voor de niet-verbruikbare producten.
- [ ] Bij het indienen van de app-versie: de producten **aanvinken** bij "In-App Purchases", anders worden ze niet mee beoordeeld.
- [ ] Testen zonder App Store Connect: in Xcode *Product › Scheme › Edit Scheme › Run › Options › StoreKit Configuration* → kies `App/Products.storekit`. Dan kun je in de simulator kopen met nepgeld.
- [ ] Testen met een echte Apple-omgeving: *Users and Access › Sandbox Testers* → een testaccount maken, op je iPhone onder *Instellingen › App Store › Sandbox-account* inloggen, dan kopen in de app.
- [ ] "Aankopen herstellen" staat in Instellingen en in de winkel (verplicht voor de beoordeling).

## App Store Connect (appstoreconnect.apple.com)

### Het venster "New App" — wat je invult

| Veld | Wat je kiest |
|---|---|
| Platforms | alleen **iOS** aanvinken (geen macOS, tvOS, visionOS) |
| Name | `Crimson Ledger` |
| Primary Language | **Dutch (Netherlands)** — Engels voeg je later toe als extra taal |
| Bundle ID | `com.jaimycai.crimsonledger` |
| SKU | `crimson-ledger-ios` |
| User Access | **Full Access** |

De naam moet uniek zijn in de hele App Store. Is "Crimson Ledger" bezet, probeer
dan `Crimson Ledger: Moordpuzzel`; de naam in de lijst mag afwijken van de naam
op het toestel (die staat vast op "Crimson Ledger" via `CFBundleDisplayName`).

Staat de Bundle ID niet in de lijst? Registreer hem eerst: developer.apple.com ›
*Certificates, Identifiers & Profiles* › *Identifiers* › **+** › App IDs › App ›
Description `Crimson Ledger`, Bundle ID **Explicit** `com.jaimycai.crimsonledger`,
geen extra Capabilities aanvinken → Register. Daarna verschijnt hij in het
dropdownmenu (soms na een keer verversen).

### Daarna
- [ ] Vul alle velden uit `store/METADATA.md` in (beschrijving, trefwoorden, URL's, leeftijd, privacy-vragenlijst = "verzamelt geen gegevens"; aankopen lopen via Apple, de app slaat zelf niets op over de koper).
- [ ] Upload de schermafbeeldingen uit `store/screenshots/` (6,7").
- [ ] Voeg de lokalisatie **English (U.S.)** toe (rechtsboven bij de versie: *Nederlands ▾ › Engels (V.S.)*) en vul naam, ondertitel, promotietekst, beschrijving, trefwoorden en "Wat is er nieuw" in uit het Engelse blok in `store/METADATA.md`. Schermafbeeldingen uit `store/screenshots-en/`.
- [ ] Prijs en beschikbaarheid: app **Gratis**; de in-app aankopen hebben hun eigen prijs (tabel hierboven).
- [ ] Leeftijdsclassificatie invullen (antwoorden staan in `store/METADATA.md`) en de privacy-vragenlijst op "verzamelt geen gegevens". App-icoon komt uit de build zelf.

## Bouwen en uploaden
- [ ] Xcode: bovenin het doel op **Any iOS Device (arm64)** zetten → *Product › Archive*.
- [ ] In het Organizer-venster: *Distribute App › App Store Connect › Upload* (standaardopties). Verwerking duurt 10–30 min.
- [ ] Terug in App Store Connect: bij versie 1.0 de build selecteren → *Verzenden voor beoordeling*.

## Wat je kunt verwachten
- Beoordeling duurt meestal 24–48 uur. Bij afwijzing op richtlijn 4.2 ("minimale functionaliteit"): antwoord dat het een volledig offline spel is met haptiek, geluid, campagne en dagelijkse zaak — geen ingepakte website. Meestal volstaat dat.
- TestFlight is gratis en werkt met dezelfde upload: handig om het eerst op je eigen iPhone te installeren.

## Betalen en uitbetalen
Het geld loopt via Apple, niet via een eigen betaalprovider: Apple int, houdt
15 % of 30 % in en maakt de rest maandelijks over naar je IBAN. Een eigen
betaaloplossing (Stripe, PayPal, iDEAL) voor werelden, hints of de Pass is
verboden onder richtlijn 3.1.1 en leidt tot afwijzing. Alles hierover, inclusief
de belastingformulieren en wanneer het geld binnenkomt, staat in
**`store/UITBETALING.md`**.

## Nog open (jouw keuze)
- Contact-e-mail in App Store Connect (verplicht veld) — niet in de code gezet, vul je zelf in.
- Het klassieke deductieraster staat nog ingeklapt in het Nederlandse menu (in het Engels is het verborgen). Voor een strakkere eerste indruk kan het eruit; zeg het en ik verwijder het.
- Meer talen (Duits, Frans, Spaans): elke taal is één nieuw blok in `i18n.js` plus een kopie van `i18n-data.js` en `i18n-campaign.js`; de code hoeft niet meer aangeraakt te worden.
