# Crimson Ledger 1.0 — alles wat je in App Store Connect invult

Deze pagina loopt van boven naar beneden mee met App Store Connect. Alles wat je
kunt kopiëren staat erin. De twee lange beschrijvingen staan in
`store/METADATA.md`, omdat ze daar op één plek onderhouden worden.

App-ID 6812534368 · Bundle ID `nl.crimsonledger.app` · versie 1.0 · build 1

---

## Klaar op deze computer

| Wat | Waar |
|---|---|
| Schermafbeeldingen met kop, Nederlands, 8 stuks, 1290×2796 | `store/cards/` |
| Schermafbeeldingen met kop, Engels, 8 stuks, 1290×2796 | `store/cards-en/` |
| Kale schermafbeeldingen zonder kop, beide talen | `store/screenshots/`, `store/screenshots-en/` |
| App-preview Nederlands, 24 s, **886×1920**, H.264 | `store/previews/crimson-ledger-nl-886x1920.mp4` |
| App-preview Engels, 24 s, **886×1920**, H.264 | `store/previews/crimson-ledger-en-886x1920.mp4` |
| Dezelfde previews op 1290×2796, reserve | `store/previews/*-1290x2796.mp4` |
| Support-pagina, live | https://jaimycai.github.io/crimson-ledger/support.html |
| Privacyverklaring, live | https://jaimycai.github.io/crimson-ledger/privacy.html |
| Marketingpagina, live | https://jaimycai.github.io/crimson-ledger/ |

De video's staan bewust niet in de repo; samen zijn ze 34 MB en ze zijn opnieuw
te maken met het commando onderaan deze pagina.

---

## 1. Eerst dit, anders loopt de rest vast

- [ ] **Business › Agreements, Tax, and Banking**: de Paid Apps-overeenkomst tekenen, bankgegevens invullen (IBAN en BIC, tenaamstelling gelijk aan de accountnaam) en de belastinggegevens invullen (W-8BEN voor de Verenigde Staten). Zolang dit op *Pending* staat, kun je geen in-app aankopen indienen. De uitleg staat in `store/UITBETALING.md`.
- [ ] **Small Business Program** aanvragen. Dat verlaagt de commissie van 30 naar 15 procent en gaat in op de eerste van de maand na goedkeuring, dus doe het vóór je eerste verkoop.

## 2. App Information (geldt voor de hele app, niet per versie)

| Veld | Wat je invult |
|---|---|
| Name | `Crimson Ledger` |
| Subtitle | `Moordmysterie op plattegrond` |
| Privacy Policy URL | `https://jaimycai.github.io/crimson-ledger/privacy.html` |
| Category · Primary | Games › Puzzle |
| Category · Secondary | Games › Board |
| Content Rights | "Bevat deze app inhoud van derden?" → **Nee** |
| Age Rating | zie hieronder |
| License Agreement | de standaard-EULA van Apple laten staan |

**Age Rating.** Beantwoord alles met "Geen", behalve *Cartoon or Fantasy
Violence* → **Infrequent/Mild**. Het slachtoffer is een krijtomtrek en er is geen
geweld in beeld. Bij de vragen over advertenties, gebruikersinhoud, chat en
onbeperkt internet antwoord je overal "Nee". Uitkomst: **9+**.

## 3. Pricing and Availability

- [ ] Prijs: **Gratis**. De in-app aankopen hebben hun eigen prijs.
- [ ] Beschikbaarheid: alle landen laten staan.
- [ ] Pre-orders: uit.

## 4. App Privacy

- [ ] "Verzamelt deze app gegevens?" → **Nee, wij verzamelen geen gegevens van deze app.** Geen analytics, geen accounts, geen advertenties, geen trackers; voortgang blijft op het toestel en betalingen lopen via Apple.
- [ ] Privacy Policy URL invullen (zie hierboven).

## 5. In-app aankopen (negen stuks)

Maak ze aan onder *Monetization › In-App Purchases*. Elk product heeft een
Nederlandse en een Engelse lokalisatie; de teksten staan in `store/METADATA.md`
onder "In-app-aankopen" en in het Engelse blok. Elk product heeft ook een
schermafbeelding voor de beoordeling nodig: gebruik `store/screenshots/08-winkel.png`.

| Type | Product-ID | Naam | Prijs |
|---|---|---|---|
| Niet-verbruikbaar | `nl.crimsonledger.app.pass` | Crimson Pass | € 4,99 |
| Verbruikbaar | `nl.crimsonledger.app.hints10` | 10 hints | € 0,99 |
| Niet-verbruikbaar | `nl.crimsonledger.app.cosmetics` | Bordthema's en lijsten | € 1,99 |
| Niet-verbruikbaar | `nl.crimsonledger.app.world.hotel` | Wereld: Grand Hotel Aurora | € 1,99 |
| Niet-verbruikbaar | `nl.crimsonledger.app.world.ruimte` | Wereld: Station Orion | € 1,99 |
| Niet-verbruikbaar | `nl.crimsonledger.app.world.museum` | Wereld: Het Museum | € 1,99 |
| Niet-verbruikbaar | `nl.crimsonledger.app.world.trein` | Wereld: De Nachttrein | € 1,99 |
| Niet-verbruikbaar | `nl.crimsonledger.app.world.circus` | Wereld: Het Circus | € 1,99 |
| Niet-verbruikbaar | `nl.crimsonledger.app.world.skihut` | Wereld: De Skihut | € 1,99 |

Zet ze bij de eerste versie op *Submit with App Review*, dan gaan ze samen met
de app mee de beoordeling in.

---

## 6. De versiepagina 1.0

### App Previews and Screenshots

Kies bovenaan **iPhone 6.9"**. Die ene maat is genoeg; Apple schaalt hem door
naar de kleinere iPhones. iPad hoef je niet te doen, de app is alleen voor iPhone.

- [ ] Sleep eerst de video erin: `store/previews/crimson-ledger-nl-886x1920.mp4`. App Store Connect neemt voor de app-preview 886×1920 aan, niet de maat van de schermafbeeldingen. Kies als posterbeeld ongeveer seconde 12, het bord met de verklaringen.
- [ ] Daarna de acht platen uit `store/cards/`. Ze staan al in de goede volgorde, dus je kunt ze in één keer selecteren en erin slepen:
  1. `01-verklaringen.png` — De verdachten praten.
  2. `02-wereldkaart.png` — Acht werelden, één kronkelpad
  3. `03-zaak-gesloten.png` — Zaak gesloten.
  4. `04-thuis.png` — Elke dag een nieuwe zaak
  5. `05-beschuldiging.png` — Wie was alleen met het slachtoffer?
  6. `06-briefing.png` — Inspecteur Van Dam helpt je op weg
  7. `07-vitrine.png` — Drieëntwintig onderscheidingen
  8. `08-winkel.png` — Geen levens. Geen advertenties.

Die platen hebben een kop boven het scherm, zoals de meeste spellen in de App
Store doen. De eerste twee zijn wat de meeste mensen te zien krijgen; daarom
staan het bord en de wereldkaart vooraan. Wil je liever de kale schermen zonder
kop, gebruik dan `store/screenshots/` in de volgorde 04, 02, 06, 01, 05, 03, 07, 08.

### Promotional Text

Dit veld kun je later wijzigen zonder nieuwe versie.

```
Elke dag een nieuwe moordzaak. Plaats de verdachten op de plattegrond, combineer de aanwijzingen en wijs aan wie alleen was met het slachtoffer.
```

### Description

De volledige tekst staat in `store/METADATA.md` onder het kopje **Beschrijving**.
Kopieer het blok van "Crimson Ledger is een logisch moordmysterie" tot en met de
laatste regel over de Crimson Pass.

### Keywords

```
logica,deductie,detective,speurder,misdaad,raadsel,denkspel,breinbreker,dagelijks,puzzel,offline
```

Komma's zonder spaties, 96 van de 100 tekens. Geen merknamen van anderen: Cluedo
is een merk van Hasbro en daar wijst Apple metadata op af. Woorden uit de naam en
de ondertitel hoef je niet te herhalen, die tellen al mee in de zoekresultaten.

### Support URL

```
https://jaimycai.github.io/crimson-ledger/support.html
```

### Marketing URL (optioneel)

```
https://jaimycai.github.io/crimson-ledger/
```

### Version

```
1.0
```

### Copyright

```
2026 Jaimy Cai
```

Zonder het teken ©; Apple zet dat er zelf voor.

---

## 7. Engelse lokalisatie

Rechtsboven op de versiepagina staat de taalkiezer. Kies *Nederlands ▾ ›
Toevoegen › English (U.S.)* en vul in:

- Name, Subtitle, Promotional Text, Keywords, Description: het blok **Engelse lokalisatie (en-US)** in `store/METADATA.md`.
- Video: `store/previews/crimson-ledger-en-886x1920.mp4`
- Schermafbeeldingen: de acht platen uit `store/cards-en/`, ze staan al op volgorde.

## 8. App Review Information

| Veld | Wat je invult |
|---|---|
| Sign-in required | **Nee** |
| First name / Last name | je eigen naam |
| Phone number | je eigen nummer, met +31 ervoor |
| Email | jaimycai001@gmail.com |
| Notes | de tekst onder "Notities voor App Review" in `store/METADATA.md` |
| Attachment | niet nodig |

## 9. Version Release

- [ ] **Automatically release this version** aanvinken, tenzij je zelf op de knop wilt drukken.

---

## 10. De build uploaden

1. Terminal: `cd ~/Developer/Murdoku && npm run build && npx cap sync ios && open ios/App/App.xcworkspace`
2. Xcode: *Product › Clean Build Folder* (Shift-Cmd-K). Dat is nodig omdat de Bundle ID gewijzigd is.
3. Doel bovenin op **Any iOS Device (arm64)** zetten.
4. *Signing & Capabilities*: Team kiezen, "Automatically manage signing" aan. De Bundle ID staat op `nl.crimsonledger.app`.
5. *Product › Archive*. Dat duurt een paar minuten.
6. In het Organizer-venster: *Distribute App › App Store Connect › Upload*, verder de standaardopties. Het verwerken bij Apple duurt tien tot dertig minuten.
7. Terug in App Store Connect: bij **Build** op **+** klikken en de verwerkte build kiezen.

De vraag over exportregels krijg je niet meer; `ITSAppUsesNonExemptEncryption`
staat al op `false` in `Info.plist`. De app gebruikt alleen de standaard-HTTPS
van Apple.

## 11. Verzenden

- [ ] Bovenaan op **Add for Review** en daarna **Submit to App Review**.
- [ ] De vraag over de Advertising Identifier (IDFA) beantwoord je met **Nee**. De app bevat geen advertenties en geen tracking.
- [ ] Beoordeling duurt meestal één tot drie dagen. Bij een afwijzing krijg je in *Resolution Center* te horen wat er moet veranderen; dat is normaal en je stuurt gewoon opnieuw in.

---

## Schermafbeeldingen en video opnieuw maken

Zet eerst een lokale server aan en laat die staan:

```
cd ~/Developer/Murdoku && npm run build && python3 -m http.server 8090
```

In een tweede venster:

```
cd ~/Developer/Murdoku
node store/make-screenshots.js
node store/make-store-cards.js
node store/make-preview.js /tmp/crimson-preview
swift store/encode-preview.swift /tmp/crimson-preview/nl store/previews/crimson-ledger-nl-886x1920.mp4 30 886 1920
swift store/encode-preview.swift /tmp/crimson-preview/en store/previews/crimson-ledger-en-886x1920.mp4 30 886 1920
```

`make-preview.js` en `make-screenshots.js` hebben puppeteer nodig. Staat dat er
niet, dan installeer je het eenmalig met `npm install --no-save puppeteer`.
