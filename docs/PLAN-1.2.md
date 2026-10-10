# Plan voor versie 1.2: mooier, eigen personages, 17 talen

*Opgesteld op 10 oktober 2026 na een volledige speelronde. Volgens de regel "updates bundelen" komt alles
samen in één versie 1.2, met ook de verbeterde beoordelingsvraag die klaarligt voor 1.1.3.*

## 1. Speelronde van 10 oktober (gedaan)

Gespeeld in de webversie, Engels en Nederlands, op telefoonformaat: de oefenzaak, deel I van Het Landhuis
(acht zaken), de minigame "Wie liegt?", de bewijskist, het begin van deel II, de dagelijkse zaak, de zaak
van de week, vrij spel "moeilijk" met een hint, de winkel, de instellingen en de vitrine.

- Geen enkele scriptfout.
- Drie Nederlandse teksten in de Engelse stand: moeilijkheid van de oefenzaak, de geluidsknop, en "punten"
  in de gedeelde uitslag van de zaak van de week. **Hersteld** (commit 5c999dd), met een nieuwe test die
  elke tekst in de code tegen het woordenboek legt (`tests/i18n-keys.test.js`).
- Nog open, voor deze versie:
  - op 375×667 (iPhone SE 2/3) overlappen kamerlabels in smalle kamers ("KELDER" en "STUDEERKAM…");
  - op 320×568 (iPhone SE 1) valt het bord over de uitleg en de verdachten: `fitBoard` houdt minstens
    160 px aan, ook als er geen ruimte is.

## 2. Mooier, volgens het handboek (skill `vakmanschap`)

Op volgorde van effect:
1. **Eigen portretten** in de stijl van Inspecteur Van Dam (gravure, sepia), voor alle 64 verdachten.
   Nu zijn het eenvoudige SVG-gezichtjes die per wereld op elkaar lijken. Het bord houdt een vereenvoudigd
   rond portret; het verhoor, de briefing en het beschuldigen tonen het grote. Maken met Higgsfield (kost
   credits; prijs vooraf noemen, regel 08) met één vaste stijlreferentie.
2. **Eén iconenpakket in plaats van emoji** (trucs 16, 17). Knoppen, beloningen en tabbladen gebruiken nu
   emoji (🗺️ 📤 🪙 🧊 🔥 🎓 …). Die zien er per toestel anders uit en verraden een snel gebouwde app.
   Tabler Icons via iconify.design, SVG, wijnrood en goud uit DESIGN.md.
3. **Openingsscherm met het echte beeldmerk** in plaats van het vergrootglas-emoji.
4. **Lettertype** (truc 05): Playfair + Inter zijn de standaardkeuze die het handboek afraadt, maar ze dekken
   wel Latijn, Cyrillisch en Vietnamees. Met 17 talen telt dekking mee: de keuze gebeurt per schrift, met
   systeemletters voor Arabisch, Urdu, Devanagari, Bengaals, Telugu, Chinees en Japans. Vergelijken in echte
   schermen, dan vastleggen in DESIGN.md.
5. **Copy van de vijf sterkste puzzel- en moordmysterie-apps** bestuderen (truc 06) en het eerste scherm en de
   knoppen daarop aanscherpen.
6. **impeccable-audit en Apple HIG** (trucs 11, 20) op elk scherm, inclusief de twee schermformaten hierboven.

## 3. Nieuwe namen

Uitgangspunten: elke naam is in één keer te onthouden en past bij wie het is; geen typisch Nederlandse
namen meer (Fenna, Ruud, Piet, Greet, Ans) nu het spel 17 talen krijgt; de beroepen blijven (die zijn al
vertaald), alleen de naam erachter verandert; binnen een wereld begint elke naam met een andere letter;
het geslacht klopt met het portret. Slachtoffers blijven zoals ze zijn.

| Wereld | Nu | Voorstel |
|---|---|---|
| Het Landhuis | Clara · Marcus · Dr. Cross · Thomas · Isabelle · Rosalind · Majoor Pike · Tante Agnes | Lady Clementine · Meneer Hargrove · Dr. Quill · Mortimer · Juniper · Odette · Majoor Pike · Tante Agatha |
| Het Piratenschip | Roodbaard · Bootsman Vos · Kok Ada · Stuurman Kwint · Juffrouw Lark · Kanonnier Bo · Dokter Sal · Scheepsjongen Nik | Barnaby · Bootsman Grimsby · Kok Saffron · Stuurman Ronan · Juffrouw Coral · Kanonnier Thorne · Dokter Marlow · Scheepsjongen Pip |
| Grand Hotel Aurora | Gravin Delacroix · Portier Jansen · Pianist Milo · Mevrouw Sato · Journalist Bram · Chef Rosa · Butler Ames · Danseres Lou | Gravin Delacroix · Portier Otis · Pianist Felix · Mevrouw Sato · Journalist Vance · Chef Brigitte · Butler Winslow · Danseres Lulu |
| Station Orion | Dr. Nkemelu · Piloot Reyes · Ingenieur Sol · Botanist Tamsin · Kadet Yuki · Kok Dima · Officier Paz · Bioloog Wren | Dr. Nkemelu · Piloot Reyes · Ingenieur Vega · Botanist Fern · Kadet Yuki · Kok Dima · Officier Paz · Bioloog Wren |
| Het Museum | Gids Fenna · Curator Bas · Restaurateur Imke · Nachtwaker Ruud · Professor Adebayo · Kunsthandelaar Vic · Stagiair Noor · Schoonmaker Piet | Gids Margot · Curator Ellery · Restaurateur Iris · Nachtwaker Gus · Professor Adebayo · Kunsthandelaar Lucian · Stagiair Noor · Schoonmaker Hugo |
| De Nachttrein | Barones Von Stahl · Goochelaar Otto · Schaakmeester Ivo · Verpleegster Ans · Reiziger Sami · Actrice Lola · Stoker Jules · Weduwe Duval | Barones Von Stahl · Goochelaar Orlando · Schaakmeester Ivo · Verpleegster Hedda · Reiziger Sami · Actrice Lola · Stoker Jules · Weduwe Duval |
| Het Circus | Clown Pippo · Trapezeartiest Mira · Leeuwentemmer Kurt · Waarzegster Zora · Sterke Man Boris · Kaartverkoper Els · Jongleur Teo · Dierenarts Nadia | Clown Pippo · Trapezeartiest Mira · Leeuwentemmer Gunther · Waarzegster Zora · Sterke Man Boris · Kaartverkoopster Dottie · Jongleur Teo · Dierenarts Nadia |
| De Skihut | Skilerares Mieke · Bergredder Tom · Toeriste Hana · Kok Luigi · Fotograaf Sven · Dokter Greet · Jongen Kai · Berggids Ilse | Skilerares Astrid · Bergredder Bjorn · Toeriste Hana · Kok Luigi · Fotograaf Emil · Dokter Ingrid · Jongen Kai · Berggids Freya |

**Toegepast op 10 oktober** (nog niet door Jaimy bevestigd; een naam wijzigen kan nog, in alle talen tegelijk):
in `themes.js`, de verhalen in `campaign.js` en `i18n/en.js`, de oefenzaak en de Engelse titels. Het klassieke
raster (`story.js`, alleen Nederlands) houdt zijn eigen personages. Elke verdachte heeft nu ook een geslacht
(31 vrouwen, 33 mannen), gecontroleerd tegen de portretten en tegen "hij/zij" in 61 verhaaltjes; de zinsbouw
van veel talen heeft dat nodig. `tests/names.test.js` zoekt elke oude naam.

## 4. Vijftien extra talen

De vijftien meest gesproken talen ter wereld (Ethnologue 2025, totaal aantal sprekers), zonder Engels en
Nederlands, en zonder talen die iOS of de App Store niet ondersteunt (Nigeriaans Pidgin, Hausa; Egyptisch
Arabisch valt onder Arabisch):

Chinees (vereenvoudigd) · Hindi · Spaans · Arabisch · Frans · Bengaals · Portugees · Russisch · Indonesisch ·
Urdu · Duits · Japans · Marathi · Vietnamees · Telugu

Alle vijftien zijn sinds maart 2026 ook winkeltaal in de App Store. Daarna zouden Turks, Koreaans en
Italiaans volgen. Let op: in die drie landen worden veel meer iPhones verkocht dan in de vier Indiase
talen samen, dus voor downloads kan ruilen lonen.

**Techniek**
- Elke taal krijgt één bestand (`i18n/<taal>.js`) met de schermteksten, de spelinhoud, de verhalen en de
  zinsbouw van de verklaringen. Alleen de gekozen taal wordt geladen, dus de app blijft snel.
- **Zinsbouw.** Verklaringen worden nu uit Nederlandse zinssjablonen gebouwd ("Ik stond direct naast een
  plant"). Per taal komt een eigen zinsbouw: kamers en meubels krijgen per taal de vorm die de zin nodig
  heeft ("в кухне", "रसोई में", "mutfakta"), werkwoorden volgen het geslacht van de spreker (Russisch,
  Hindi, Urdu, Marathi, Frans, Spaans, Portugees), en zinnen met twee namen gebruiken "X en ik …" zodat
  namen niet verbogen hoeven te worden.
- **Meervoud** via `Intl.PluralRules` (Arabisch kent zes vormen, Russisch drie).
- **Rechts naar links** voor Arabisch en Urdu. De plattegrond zelf blijft links naar rechts, want "links van"
  in een verklaring gaat over de plattegrond.
- Weekdagen, getallen en datums via `Intl`. In-app-aankopen en winkelteksten per taal via de bestaande
  scripts in `store/`.

**Werkwijze per taal**
1. Alle teksten automatisch uit de code halen (de nieuwe test doet dat al).
2. Een agent vertaalt alles in één keer, met een woordenlijst (namen, beroepen, werelden) en de toon uit
   DESIGN.md.
3. Een tweede agent leest het na als moedertaalspreker, en een test controleert gaten, lengte en
   ontbrekende teksten.
4. Per taal 200 gegenereerde verklaringen laten nalezen, plus schermafbeeldingen van tien schermen op het
   kleinste toestel, om te kijken of iets wordt afgekapt.

## 5. Volgorde

1. Namen (na akkoord) en de schermfouten van §1.
2. De taalmotor (zinsbouw, laden per taal, meervoud, rechts naar links), eerst met Nederlands en Engels erop
   omgezet, zodat alle bestaande tests blijven slagen.
3. De vijftien talen, parallel, met nalezen.
4. Ontwerp: iconen, beeldmerk, letters per schrift, portretten (na akkoord over de kosten).
5. Winkelteksten en aankopen in 17 talen, schermafbeeldingen in de grootste talen.
6. Versie 1.2 indienen.
