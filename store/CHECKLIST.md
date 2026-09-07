# Indienen bij de App Store — stappen voor morgen

Alles wat vanaf de code kan is gedaan. Dit zijn de stappen die jouw account en Xcode nodig hebben, in volgorde.

## Vooraf (kan vandaag al)
- [ ] **Apple Developer Program** actief (developer.apple.com, €99/jaar). Zonder dit kan niets worden geüpload. Nieuwe aanmelding: 1–2 dagen goedkeuring.
- [ ] **Xcode** geïnstalleerd uit de Mac App Store (~15 GB) en één keer geopend (accepteer de licentie). Daarna in Terminal: `sudo xcode-select -s /Applications/Xcode.app`
- [ ] In Xcode: *Settings › Accounts* → je Apple ID toevoegen.

## Project openen
```bash
cd ~/Documents/Claude/Murdoku
npm run ios          # kopieert www/, synct Capacitor en opent Xcode
```
In Xcode, doel **App**:
- [ ] *Signing & Capabilities* → Team kiezen → "Automatically manage signing" aan. Bundle ID staat op `com.jaimycai.crimsonledger`.
- [ ] *General* → Version 1.0.0, Build 1 (staan al). Deployment target iOS 14+.
- [ ] Kies een simulator (bijv. iPhone 16) en druk ▶ — controleer: oefenzaak start, tik werkt, haptiek, geluid, geen witte randen onder de notch.

## App Store Connect (appstoreconnect.apple.com)
- [ ] *Mijn apps › +* → Nieuwe app: naam **Crimson Ledger**, taal Nederlands, Bundle ID kiezen, SKU `crimson-ledger-ios`.
- [ ] Vul alle velden uit `store/METADATA.md` in (beschrijving, trefwoorden, URL's, leeftijd, privacy-vragenlijst = "verzamelt geen gegevens").
- [ ] Upload de schermafbeeldingen uit `store/screenshots/` (6,7"). App-icoon komt uit de build zelf.

## Bouwen en uploaden
- [ ] Xcode: bovenin het doel op **Any iOS Device (arm64)** zetten → *Product › Archive*.
- [ ] In het Organizer-venster: *Distribute App › App Store Connect › Upload* (standaardopties). Verwerking duurt 10–30 min.
- [ ] Terug in App Store Connect: bij versie 1.0 de build selecteren → *Verzenden voor beoordeling*.

## Wat je kunt verwachten
- Beoordeling duurt meestal 24–48 uur. Bij afwijzing op richtlijn 4.2 ("minimale functionaliteit"): antwoord dat het een volledig offline spel is met haptiek, geluid, campagne en dagelijkse zaak — geen ingepakte website. Meestal volstaat dat.
- TestFlight is gratis en werkt met dezelfde upload: handig om het eerst op je eigen iPhone te installeren.

## Nog open (jouw keuze)
- Contact-e-mail in App Store Connect (verplicht veld) — niet in de code gezet, vul je zelf in.
- Het klassieke deductieraster staat nog ingeklapt in het menu. Voor een strakkere eerste indruk kan het eruit; zeg het en ik verwijder het.
