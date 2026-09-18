# App Review 2.1 "Information Needed" — wat er nu moet gebeuren

*18 september 2026. Inzending `bd8f6d73-3b89-42a4-9f7e-9e7e64ac89bc`, versie 1.0, build 4.
Apple heeft de app niet op een fout afgewezen: een nieuw ontwikkelaarsaccount krijgt
standaard dit verzoek om extra informatie. De negen in-app aankopen staan nog op
"Ready for Review" en gaan mee zodra de versie is geaccepteerd.*

De antwoordtekst staat kant-en-klaar in `store/REVIEW-REPLY.txt` (het bericht aan Apple)
en `store/REVIEW-NOTES.txt` (2.794 tekens, past in het Notes-veld van 4.000).

## 0. Eerst dit, anders keurt Apple de aankopen alsnog af

App Store Connect › **Business › Agreements** meldt twee dingen:

1. De **Paid Apps Agreement** is getekend (18 september) maar staat op **Pending User
   Info**: er ontbreekt nog een **bankrekening** (Add Bank Account, IBAN en BIC op je eigen
   naam) en het **belastingformulier** (Add Tax Info: U.S. Tax Questionnaire, dat wordt een
   W-8BEN). Pas als de status **Active** is kan Apple de negen aankopen goedkeuren en
   laadt StoreKit in TestFlight producten.
2. "Complete Compliance Requirements" voor de Digital Services Act: de **trader
   status**. Zonder dit wordt de app niet in de EU aangeboden, dus ook niet in Nederland.
   Kies **"I'm a trader under the DSA"**: wie in-app aankopen verkoopt en een
   KvK-inschrijving heeft, is een handelaar in de zin van de DSA. Apple vraagt dan een
   adres, telefoonnummer en e-mailadres die **openbaar op de productpagina in de EU**
   komen te staan; ze veranderen niets aan je Apple-account. Je mag daar een zakelijk
   adres, nummer en e-mailadres voor gebruiken. Apple stuurt een code naar het nummer en
   het e-mailadres om ze te bevestigen.

Beide zijn invulwerk dat alleen jij kunt doen (eigen gegevens). Uitleg in `store/UITBETALING.md`.

## 1. De build op je iPhone zetten (TestFlight, interne test, geen extra review)

1. App Store Connect › Crimson Ledger › tabblad **TestFlight** › Internal Testing › **Create Group**
   (naam bijvoorbeeld "Jaimy"). Vink **Enable automatic distribution** aan.
2. Voeg jezelf toe als tester (je Apple ID van het ontwikkelaarsaccount).
3. Kies build **1.0 (4)** voor de groep.
4. Op de iPhone: app **TestFlight** uit de App Store installeren, inloggen met hetzelfde
   Apple ID, Crimson Ledger installeren.
5. Werk de iPhone eerst bij: Instellingen › Algemeen › Software-update. Apple vraagt
   een opname op "the latest operating system".

Aankopen in een TestFlight-build lopen via de sandbox en kosten niets.

## 2. De opname (2 tot 3 minuten, staand, zonder geluid is prima)

Instellingen › Bedieningspaneel › "Schermopname" toevoegen als hij er nog niet staat.
Verwijder Crimson Ledger eerst en installeer opnieuw via TestFlight, zodat de opname met
een echte eerste start begint.

Volgorde, precies wat Apple vraagt ("begin with launching the app, show the typical user flow"):

1. Bedieningspaneel › Schermopname starten › naar het beginscherm › **Crimson Ledger openen**.
2. Splash › **Begin** › de begeleide **oefenzaak** afmaken (vier tikken).
3. Thuisscherm: laat de kaart **Dagelijkse zaak** en **Verder met de campagne** zien.
4. Wereldkaart › zaak 1 **Het glas Bordeaux** › briefing van Van Dam › **Aan de slag**.
5. Op het bord: twee of drie verdachten plaatsen, laat een verklaring **groen** en één **rood**
   worden, tik één keer op **Hint** (drie stappen), maak de zaak af, **Controleer**.
6. Beschuldiging: wijs de dader aan › **Zaak gesloten** (stempel, sterren, punten).
7. Terug naar de wereldkaart, scroll naar een vergrendelde wereld (Grand Hotel Aurora),
   tik erop › **Ontgrendel** › de **Winkel** opent. Laat alle negen producten zien.
8. Tik op **10 hints**: het StoreKit-venster verschijnt. Rond de sandbox-aankoop af
   (als de Paid Apps Agreement al getekend is) of annuleer hem.
9. Instellingen (tandwiel rechtsboven): taal naar **English** (app herlaadt), laat het
   Engelse thuisscherm zien, tik op **Restore purchases**.
10. Opname stoppen.

Het bestand staat in Foto's. AirDrop naar de Mac; .mov of .mp4 is goed. Hou het onder
een paar minuten; duurt het uploaden te lang, exporteer dan via Foto's in lagere kwaliteit.

## 3. Antwoorden in App Store Connect

1. Crimson Ledger › **App Review** › inzending van 17 september › onderaan **Reply to App Review**:
   plak `store/REVIEW-REPLY.txt`, voeg de video als bijlage toe, verstuur.
2. Versiepagina 1.0 › **App Review Information**:
   - **Notes**: vervang de huidige tekst (739 tekens) door `store/REVIEW-NOTES.txt`.
   - **Attachment**: dezelfde video.
   - **Notes** is op 18 september al vervangen door REVIEW-NOTES.txt en opgeslagen.
   - **Game Center**: op 18 september is Game Center uitgezet op de App ID, de entitlement
     uit het project gehaald (commit `a53a571`) en **build 1.0 (5)** geüpload (Delivery UUID
     `994a05a0-12e8-421d-acc4-0a9d4bcc7435`). Zodra Apple hem verwerkt heeft: op de
     versiepagina bij **Build** build 5 kiezen in plaats van 4, Save. Het Game Center-vinkje
     hoort dan te verdwijnen. De zin over Game Center in Notes en reply kan dan weg, mag ook blijven.
     Uploaden vanaf de Mac werkt met het Apple ID dat in Xcode staat (`xcodebuild
     -exportArchive ... -allowProvisioningUpdates` zonder API-sleutel); de API-sleutel
     `CQ6TPURNQ9` mag niet cloud-signen ("Cloud signing permission error").
   - Sign-in required staat al uit, contactgegevens staan al ingevuld.
   - **Save**.
3. Bovenaan op **Resubmit to App Review** als die knop actief is; anders is het antwoord
   genoeg en gaat de beoordeling verder vanuit het bericht.

## 4. Wat er verder klopt en niet hoeft te veranderen

- Schermafbeeldingen: 10 platen met een kop boven een echt scherm van de app (2.3.3 in orde).
- Geen inlog, geen account, geen gebruikersinhoud: de eerste drie opnamepunten van Apple vervallen.
- Alleen iPhone (TARGETED_DEVICE_FAMILY = 1), staand, iOS 15.0 en hoger.
- Privacy-URL en support-URL zijn live op GitHub Pages.

## 5. Wat een volgende vraag kan worden (en het antwoord al klaarstaat)

- **4.2 Minimum functionality** ("website in een schil"): antwoord staat in punt 4 van
  REVIEW-REPLY.txt: volledig offline, alle inhoud in de bundel, native StoreKit, haptiek,
  meldingen, geen enkele externe pagina in de app zelf.
- **3.1.1**: de winkel toont vaste prijzen als StoreKit niets laadt. Dat gebeurt alleen
  zolang de Paid Apps Agreement niet getekend is; zie punt 0.
