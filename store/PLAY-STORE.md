# Crimson Ledger naar Google Play

*1 oktober 2026. Wat er ligt, wat jij moet doen, en in welke volgorde.*

## Wat er klaar is

- `android/`: Capacitor-project, pakketnaam `nl.crimsonledger.app`, versie 1.1 (versionCode 1).
- Aankopen via Google Play Billing (`StorePlugin.java`), zelfde product-ID's als op iOS.
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
