# App Review 2.1 — hoe het afliep

*Bijgewerkt 22 september 2026. Elk gegeven hieronder is voor deze versie opnieuw
afgelezen uit App Store Connect zelf, niet overgenomen uit de vorige versie van deze
pagina. Die vorige versie beschreef de nacht van 18 september, toen het verzoek net
binnen was, en is blijven staan terwijl de zaak allang was afgelopen.*

## De uitkomst: goedgekeurd

Inzending `bd8f6d73-3b89-42a4-9f7e-9e7e64ac89bc`, ingediend 18 september om 23:44,
tien onderdelen. **Review Completed.** Alle tien staan op *Approved*:

| Onderdeel | Type |
|---|---|
| iOS App 1.0 (5) | App Version |
| Crimson Pass | In-App Purchase |
| 10 hints | In-App Purchase |
| Bordthema's en lijsten | In-App Purchase |
| Wereld: Grand Hotel Aurora, Station Orion, Het Museum, De Nachttrein, Het Circus, De Skihut | In-App Purchase (zes) |

Versie 1.0 staat op **Ready for Distribution**, met build 5 en "Automatically release
this version". De app is live: `apps.apple.com/us/app/crimson-ledger/id6812534368`.

## De opname bleek niet nodig

De vorige versie van deze pagina schreef een opname van tien stappen voor, en
`REVIEW-REPLY.txt` en `REVIEW-NOTES.txt` zijn daarvoor geschreven. Wat er werkelijk
gebeurd is: build 5 ging omhoog op 18 september om 11:01, de versie is dezelfde avond
opnieuw ingediend, en Apple heeft hem goedgekeurd. Het veld **Attachment** in App Review
Information is nog altijd leeg, en Notes bevat 1.091 tekens — niet de 2.794 uit
`REVIEW-NOTES.txt`.

Die twee tekstbestanden blijven staan als wat ze zijn: voorbereid materiaal dat niet
verstuurd hoefde te worden. Ze beschrijven een opname die nooit gemaakt is, dus gebruik
ze niet ongelezen bij een volgende inzending.

De les voor de volgende keer: een 2.1 "Information Needed" bij een nieuw
ontwikkelaarsaccount is geen afwijzing op de app. Een complete herinzending kan genoeg
zijn.

## Wat nog wél blokkeert: de Europese Unie

Beschikbaarheid, afgelezen 22 september: **147 landen Available, 1 Processing (China
mainland), 27 Cannot Sell.**

Die 27 zijn de EU-lidstaten, Nederland inbegrepen. Bij elk land staat
**"Trader Status Not Provided"** met de toelichting *"Trader status is required for
distribution on the App Store in the European Union."* Daarom geeft
`apps.apple.com/nl/app/id6812534368` een 404 terwijl de Amerikaanse pagina gewoon laadt.

Op *Business › Agreements* staat de Digital Services Act sinds 18 september op
**In Review**. Er is dus ingediend en Apple verifieert. Let op: bij trader status stuurt
Apple een code naar het opgegeven telefoonnummer en e-mailadres. Blijft die code
onbeantwoord, dan blijft de status hangen zonder dat er iets misgaat wat je ziet.

## Wat er verder op orde is

| | Status | Sinds |
|---|---|---|
| Paid Apps Agreement | Active | 17 sep 2026 (tot 8 sep 2027) |
| Free Apps Agreement | Active | 7 sep 2026 |
| Bankrekening ING (7965), Nederland, EUR | Active | 18 sep 2026 |
| U.S. Form W-8BEN | Active | 18 sep 2026 |
| U.S. Certificate of Foreign Status of Beneficial Owner | Active | 18 sep 2026 |
| Directive on Administrative Cooperation – 7th Amendment | Active | 18 sep 2026 |

De blokkade uit de vorige versie van deze pagina — "Pending User Info, er ontbreekt nog
een bankrekening en het belastingformulier" — bestaat niet meer. `UITBETALING.md` legt
nog steeds goed uit hoe het geld loopt; alleen de vinkjes daarin zijn inmiddels gezet.

## TestFlight

Interne groep "Jaimy" bestaat, met vier builds.

| Build | Invites | Installs | Sessies |
|---|---|---|---|
| 5 | 1 | 1 | – |
| 4 | 1 | 1 | 2 |
| 2 | 1 | – | – |
| 1 | 1 | – | – |

## Wat er nu openstaat

- [ ] **DSA trader status** laten afkomen. Controleer de mailbox op een
      verificatieverzoek van Apple sinds 18 september. Zonder dit geen Nederland.
- [ ] **App Store Small Business Program** — aanmelden via
      `developer.apple.com/app-store/small-business-program/enroll/`. 15% in plaats van
      30% commissie. Gaat pas in vijftien dagen na afloop van de fiscale maand waarin de
      aanmelding is goedgekeurd, dus hoe eerder hoe beter. Het formulier vraagt of de
      Paid Applications Agreement is geaccepteerd — dat is zo, sinds 17 september.
- [ ] **Apple Silicon Mac-compatibiliteit** staat op niet geverifieerd, terwijl de
      pagina meldt dat versie 1.0 compatibel is. Eén knop, en de app wordt vindbaar in
      de Mac App Store.
