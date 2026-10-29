# Crimson Ledger naar Google Play

*1 oktober 2026. Wat er ligt, wat jij moet doen, en in welke volgorde.*

## Wat er klaar is

- `android/`: Capacitor-project, pakketnaam `nl.crimsonledger.app`, versie 1.4.1 (versionCode 5).
- Doel-API 36, minimale API 24 en Play Billing 8.3: Google eist ze voor nieuwe apps (minSdk 24 voor de automatische Play-beveiliging)
  en updates (bijgewerkt 28 oktober).
- Aankopen via Google Play Billing (`StorePlugin.java`), zelfde product-ID's als op iOS.
  Aankopen buiten de koopknop (ingewisselde promocode, betaling die later doorkomt) gaan via
  hetzelfde `transaction`-bericht naar `store.js` als op iOS; een hintpakket wordt per
  aankooptoken maar één keer uitgedeeld.
- Beoordelingsvraag via Google's eigen venster (`ReviewPlugin.java`).
- Iconen en startscherm uit `resources/`.
- Ondertekende bundel: `android/app/build/outputs/bundle/release/app-release.aab`.

Opnieuw bouwen:

```
export JAVA_HOME="$(brew --prefix openjdk@21)/libexec/openjdk.jdk/Contents/Home"
export ANDROID_HOME=$HOME/Library/Android/sdk
npm run build && npx cap sync android && cd android && ./gradlew bundleRelease
```

Gradle 8.11 werkt niet met de Java 25 uit Android Studio; daarom JDK 21.

## De uploadsleutel: maak hier vandaag een kopie van

`~/.crimson/upload.jks` en `~/.crimson/keystore.properties`. Ze staan bewust niet in de repo.
Zonder deze twee bestanden kun je geen update meer uploaden. Google kan een verloren
uploadsleutel laten vervangen (Play App Signing), maar dat kost dagen. Zet een kopie in je
wachtwoordmanager of op een tweede schijf.

## Stand 29 oktober

Account geverifieerd (toestel en telefoonnummer). De app bestaat in Play Console als
"Crimson Ledger: Murder Sudoku" (app-ID 4974726224417293386, pakket `nl.crimsonledger.app`,
standaardtaal en-US, Game, Puzzel, gratis).

Klaar:
- Alle verklaringen onder App-content behalve de contentclassificatie: privacybeleid, geen
  advertenties, inloggegevens ("Nee": geen account, en de betaalde werelden voegen alleen zaken toe),
  doelgroep 13+, data safety (app-interacties en feedbacktekst, optioneel, analyse, niet gedeeld),
  geen advertentie-ID, geen overheids-, financiële of gezondheidsfuncties.
- Winkelinstellingen: contact jaimycai@gmail.com, website jaimycai.github.io/crimson-ledger.
- Winkelpagina in 23 talen: titel, korte en volledige beschrijving uit `store/play/listing.json`
  (`node store/play-listing.js`), per taal een eigen banner en acht schermafbeeldingen in de
  App Store-volgorde. en-GB gebruikt de Engelse afbeeldingen. Icoon en banner zijn als AI-beeld gelabeld.
- Gesloten test "Alpha": 178 landen, testerslijst "Crimson Ledger testers" (nu twee eigen adressen),
  feedback naar jaimycai@gmail.com.

Ook klaar (29-10, 21:25): contentclassificatie (PEGI 3, USK 6, ESRB 10+, Brazilië 14, Korea 15+,
Saoedi-Arabië 16; geweld alleen genoemd, gokthema door Casino Azur, alcohol genoemd, digitale aankopen),
bundel 5 (1.4.1) met minSdk 24 in de gesloten test, releasetekst en-US en nl-NL, en alle 38 wijzigingen
ter beoordeling ingediend. Google beoordeelt meestal binnen 7 dagen.

Ook klaar (29-10, avond): betalingsprofiel "Jaimy Cai" gekoppeld en verkopersprofiel verzonden
(Cai Enterprise, afschrift CRIMSON LEDGER), de 17 producten met eenmalige betaling actief met
aankoopoptie `buy` (store/play/products.json). Basisprijzen 4,12 / 0,82 / 1,65 EUR zonder btw, zodat
Nederland €4,99 / €0,99 / €1,99 betaalt zoals in de App Store; andere landen rekent Play om (VS $4,59
voor de Pass, App Store $3,99). Gelijktrekken per markt kan later met een prijssjabloon. Google Groep
crimson-ledger-testers hangt aan de gesloten test; de beoordeling is opnieuw gestart met de groep erin.

Open:
- Testers werven via een ruilgroep (store/PLAY-TESTERS.md); de testlink werkt na goedkeuring.
- Inschrijven voor 15% servicekosten (Play Console › Betalingsprofiel): voorwaarden, dus Jaimy.
- Bankrekening en belastinggegevens in het Payments-centrum (Jaimy).
- Productie aanvragen kan pas na 14 dagen met 12 testers; daarna beoordeelt Google nog.

Afbeeldingen opnieuw maken: `node store/make-store-cards.js play <talen>` (1080×1920, Android-toestel)
en `node store/make-play-graphics.js <talen>` (banner 1024×500 en icoon 512).

## Wat alleen jij kunt doen

1. **Play Console-account** aanmaken op play.google.com/console: eenmalig 25 dollar,
   identiteitscontrole met paspoort of ID. Kies "Personal" of "Organization"; met je
   KvK-inschrijving kan Organization, en dan vervalt stap 5.
2. **App aanmaken**: naam `Crimson Ledger: Moordmysterie`, standaardtaal Nederlands, type Game, gratis.
3. **Betalingsprofiel** koppelen (voor de aankopen), zelfde IBAN als bij Apple.
4. **Negen producten** aanmaken onder Monetize › Products › In-app products, met precies de
   ID's uit `store/CHECKLIST.md` en dezelfde prijzen. Dat kan pas nadat de eerste bundel is geüpload.
5. **Gesloten test**: een nieuw persoonlijk account moet 12 testers 14 dagen lang een gesloten
   test laten draaien voordat productie mag. Testers melden zich aan met hun Google-adres.
6. **Vragenlijsten**: Data safety (zie hieronder), inhoudsclassificatie, doelgroep 13+, geen advertenties.

## Data safety, de antwoorden

- Verzamelt de app gegevens? **Ja.**
- Soort: App activity › App interactions. Doel: Analytics.
- Verplicht of optioneel: **optioneel** (schakelaar in Instellingen).
- Gekoppeld aan identiteit: **nee**. Gedeeld met derden: **nee**.
- Versleuteld onderweg: **ja** (https). Verwijderverzoek: niet van toepassing, er is geen id om op te zoeken.

Dezelfde antwoorden horen bij Apple onder App Privacy: Usage Data › Product Interaction,
doel Analytics, niet gekoppeld aan de gebruiker, geen tracking. Dat label staat nu nog op
"Data Not Collected" en moet aangepast zijn voordat versie 1.1 live gaat.

## Winkelteksten

Dezelfde als `store/METADATA.md`. Korte beschrijving (80 tekens):

- NL: `Los moordzaken op met pure logica. Elke dag een nieuwe zaak, geen gokwerk.`
- EN: `Solve murder cases with pure logic. A new case every day, never a guess.`

Schermafbeeldingen: de bestaande 1290×2796 uit `store/screenshots/` voldoen. Extra nodig:
een feature graphic van 1024×500.
