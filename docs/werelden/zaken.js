// Campaign parts of the next approved worlds, in the shape of CAMPAIGN in campaign.js, until their translations exist.
// Seeds: world base + part * 1000 + 101 + case * 97 (Opgraving 121101.., Casino 131101..), outside every seed in use
// and below the archive (200000+). Proven by bewijs.js: one solution each, meester stepwise without guessing.
// Difficulty per part follows the other worlds: parts 1-6 from makkelijk to moeilijk, parts 7-8 moeilijk and meester.
(() => {
  const D = { k: 'makkelijk', g: 'gemiddeld', h: 'moeilijk', M: 'meester' };
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  // part: [icon, title, intro, outro, briefing, difficulty letters, cases as [title, story, item]]
  const build = (theme, base, parts) => parts.map(([icon, title, intro, outro, briefing, diffs, cases], p) => ({
    key: p === 0 ? theme : `${theme}-${p + 1}`, theme, part: p + 1, icon, title: `Deel ${ROMAN[p]} · ${title}`, intro, outro, briefing,
    cases: cases.map(([t, story, item], i) => ({ title: t, story, item, difficulty: D[diffs[i]], seed: base + (p + 1) * 1000 + 101 + i * 97 }))
  }));

  const opgraving = build('opgraving', 120000, [
    ['🏺', 'De verzegelde deur',
      'Vallei der Koningen, november 1922. Na zes jaar graven vindt de expeditie een verzegelde deur. Lord Ashcombe gaat als eerste naar binnen. Hij komt er niet meer uit.',
      'De deur staat open en de lord is dood. Het graf heeft nog meer kamers.',
      'Een graf is donker en smal, het kamp groot en open. Begin bij wie zegt in welke ruimte hij was; "direct naast" de olielamp telt alleen recht ernaast, nooit schuin.',
      'kkkggghh', [
        ['De verzegelde deur', 'Zes jaar zand. Daarna één deur en één lord minder.', '🔏 Grafzegel'],
        ['De eerste stap', 'Lord Ashcombe wilde als eerste naar binnen. Iemand liet hem.', '🔦 Zaklamp'],
        ['Professor Hartley meet', 'Hij mat elke trede. Eén trede was nieuw.', '📏 Duimstok'],
        ['De olielamp', 'De lamp in de gang brandde nog. Niemand had olie gebracht.', '🪔 Olielamp'],
        ['Tekenares Maud tekent', 'Op haar tekening stond de deur dicht. Om tien uur was hij open.', '✏️ Tekenpotlood'],
        ['Water uit Luxor', 'Kameeldrijver Omar bracht acht zakken water. Er kwamen er zeven terug.', '💧 Waterzak'],
        ['De nacht in het kamp', 'Iedereen sliep in zijn tent. Bijna iedereen.', '⛺ Tentstok'],
        ['Na middernacht', 'Om twaalf uur huilden de jakhalzen. Om één uur werd er gegraven.', '🌙 Wassende maan']
      ]],
    ['📜', 'De vloek',
      'Op de drempel staan tekens. Opzichter Ahmed leest ze voor: wie dit graf verstoort, sterft. Het kamp gelooft het.',
      'De vloek blijkt een vertaling. Een slechte, en een bewuste.',
      'Bijgeloof maakt getuigen onzeker, de plattegrond niet. Een verklaring over twee mensen los je op door eerst één van de twee vast te zetten.',
      'kkggghhh', [
        ['Tekens op de drempel', 'Drie regels hiërogliefen. Vier vertalingen.', '👁️ Oog van Horus'],
        ['De gravers staken', 'Honderd gravers, honderd scheppen. Niemand graaft.', '⛏️ Schep'],
        ['Egyptologe Clara vertaalt', 'Ze kende de tekst uit haar hoofd. Te goed.', '📖 Woordenboek'],
        ['De zwarte kat', 'Een kat liep het graf in. Hij kwam er met iets terug.', '🐈‍⬛ Zwarte kat'],
        ['Correspondente Ivy telegrafeert', 'Haar bericht over de vloek stond al in de krant. Voordat er een vloek was.', '📨 Telegram'],
        ['Een slang in de tent', 'Er was nog nooit een slang in het kamp geweest. Tot vannacht.', '🐍 Slangenhuid'],
        ['Lady Rosamund wil weg', 'Ze pakte haar koffers. Eén koffer vergat ze.', '👒 Strohoed'],
        ['De vloek gebroken', 'Vloeken doden niet. Iemand wel.', '🪬 Amulet']
      ]],
    ['💎', 'De schatkamer',
      'Achter de grafkamer ligt een tweede deur. Erachter: goud tot aan het plafond. Een gouden beeldje is al weg.',
      'Elk stuk staat weer op de lijst. Het beeldje is terug, de dief niet meer vrij.',
      'In de schatkamer telt elk stuk, en elke verklaring. Wie zegt waar hij níét was, vertelt je ook iets: streep die ruimte meteen weg.',
      'kggghhhh', [
        ['Goud tot aan het plafond', 'Tweehonderd stukken op de lijst. Honderdnegenennegentig op de plank.', '📋 Vondstenlijst'],
        ['Het gouden beeldje', 'Het beeldje was zo groot als een hand. En net zo makkelijk mee te nemen.', '✨ Gouden beeldje'],
        ['Verzamelaar Von Hagen biedt', 'Hij bood een fortuin. Voor iets wat nog niet gevonden was.', '🧾 Cheque'],
        ['De scarabee', 'Een scarabee van lapis. Hij lag in de verkeerde kist.', '🪲 Scarabee'],
        ['Opzichter Ahmed telt', 'Hij telde elke avond de mannen. Vanavond was er één te veel.', '🧮 Telraam'],
        ['De borstplaat', 'De gouden borstplaat lag op de vloer. Gisteren hing hij aan de muur.', '🛡️ Borstplaat'],
        ['Een vingerafdruk in het stof', 'Stof van drieduizend jaar. En één verse vingerafdruk.', '🔍 Vergrootglas'],
        ['Het lege voetstuk', 'Op het voetstuk stond niets meer. Er lag wel zand op, uit het kamp.', '⏳ Zandloper']
      ]],
    ['🌪️', 'De zandstorm',
      'Drie dagen zandstorm. De tenten klapperen, het graf is dicht, en niemand komt het kamp in of uit.',
      'De storm gaat liggen. Het zand heeft alle sporen bedekt, op één na.',
      'In de storm ziet niemand verder dan een meter, dus let op wie direct naast wie stond. Zet eerst de verdachte met de kleinste keus neer; de rest volgt.',
      'kgghghhh', [
        ['Zand in alles', 'Zand in de thee, zand in de tent, zand in een verhaal dat niet klopte.', '🫖 Zandige thee'],
        ['De werktent', 'De werktent waaide weg. Wat erin lag, niet.', '🧰 Gereedschapskist'],
        ['Kameeldrijver Omar zoekt', 'Een kameel was weg in de storm. Omar vond hem terug, met een volle zadeltas.', '🐪 Kameel'],
        ['De donkere kamer', 'Tijdens de storm ontwikkelde iemand foto\'s. Eén plaat is verdwenen.', '🎞️ Fotoplaat'],
        ['Licht in de storm', 'Midden in de storm brandde er licht bij het graf.', '🏮 Stormlamp'],
        ['Professor Hartley schrijft', 'Zijn dagboek liep tot dinsdag. Daarna schreef een andere hand.', '📓 Dagboek'],
        ['Correspondente Ivy wacht', 'Ze had een bericht klaar. Over iets wat nog moest gebeuren.', '⌨️ Typemachine'],
        ['Na de storm', 'Alle sporen waren weg. Op één na.', '👣 Voetafdruk']
      ]],
    ['📰', 'De pers komt',
      'De vondst is wereldnieuws. Correspondenten uit Londen en Caïro staan aan de rand van het kamp, en iedereen wil de eerste foto.',
      'De kranten hebben hun foto. De echte is nooit gedrukt.',
      'Met de pers in het kamp staat iedereen ergens anders. Begin bij wie zegt alleen te zijn geweest: dat ruimt meteen een hele ruimte op.',
      'kgghghhh', [
        ['De eerste foto', 'Twintig fotografen. Eén flits te veel.', '📸 Flitslamp'],
        ['Exclusief', 'Eén krant mocht naar binnen. Een andere krant wist het eerder.', '🗞️ Ochtendkrant'],
        ['Correspondente Ivy belt', 'De lijn naar Caïro was een uur bezet. Door iemand anders.', '☎️ Telefoon'],
        ['Lady Rosamund poseert', 'Ze stond op elke foto. Op één ervan staat ze ergens anders.', '🖼️ Krantenfoto'],
        ['Het interview', 'Professor Hartley zei drie zinnen. De krant drukte er vier.', '🎙️ Microfoon'],
        ['De omgekochte bewaker', 'Hij kreeg een pond om weg te kijken. Hij keek toch.', '💷 Pondbiljet'],
        ['Tekenares Maud tekent de pers', 'Op haar schets stonden twaalf journalisten. Er waren er elf.', '🖍️ Krijt'],
        ['Voorpaginanieuws', 'De kop klopte. Het verhaal eronder niet.', '📰 Voorpagina']
      ]],
    ['⚱️', 'De sarcofaag',
      'In de grafkamer staat een stenen sarcofaag. Het deksel weegt een ton. Als het opengaat, ligt eronder meer dan één geheim.',
      'Het deksel ligt weer op zijn plek. Nefer-Ankh rust, en jij weet waarom het kamp zo stil was.',
      'De verklaringen worden zuiniger en het graf wordt donkerder. Gebruik het potlood: streep vakjes weg die niet kunnen en kijk wat overblijft.',
      'kghhghhh', [
        ['Het deksel', 'Tien mannen tilden het deksel. Elf mannen hadden het gezien.', '🪨 Stenen deksel'],
        ['De mummie', 'In de sarcofaag lag de koningin. En een briefje van gisteren.', '📃 Briefje'],
        ['Egyptologe Clara herkent', 'Ze herkende het gezicht op het deksel. Ze zei niet van wie het was.', '📐 Gradenboog'],
        ['De canopenkruiken', 'Vier kruiken, vier goden. In één ervan zat geen hart.', '🏺 Canopenkruik'],
        ['Opzichter Ahmed waakt', 'Hij waakte de hele nacht bij het graf. Hij sliep één uur.', '🕰️ Zakhorloge'],
        ['De papyrusrol', 'In de sarcofaag lag een papyrus. Het papier was te nieuw.', '📜 Papyrus'],
        ['Verzamelaar Von Hagen wil kopen', 'Hij wilde alleen de rol. Hij wist wat erop stond.', '💼 Aktetas'],
        ['Wat onder het deksel lag', 'Drieduizend jaar stilte. Eén week was genoeg om die te breken.', '🗝️ Bronzen sleutel']
      ]],
    ['⛵', 'De Nijl af',
      'De vondsten gaan per boot de Nijl af naar Caïro. Twaalf kisten aan dek, acht passagiers aan boord, en één kist komt niet aan.',
      'In Caïro worden de kisten geteld. Twaalf. Jij weet waarom het er twaalf zijn.',
      'Het bord wordt groter en de verklaringen worden zuiniger. Staat in het rapport dat een ruimte leeg was, dan valt die hele ruimte af voor iedereen.',
      'hhMhMhMM', [
        ['Twaalf kisten', 'Twaalf kisten aan dek. Bij Assioet nog elf.', '📦 Vondstenkist'],
        ['Kameeldrijver Omar aan boord', 'Hij had nog nooit op een boot gestaan. Hij kende de weg naar het ruim.', '⚓ Anker'],
        ['Het ruim', 'Beneden in het ruim was het warm en donker. Iemand had er een lamp laten branden.', '🕯️ Scheepslamp'],
        ['Lady Rosamund zwijgt', 'Ze sprak de hele reis met niemand. Behalve één keer, midden in de nacht.', '🧣 Reissjaal'],
        ['Het douanestempel', 'Elke kist had een stempel. Eén stempel was nog nat.', '🛂 Douanestempel'],
        ['Professor Hartley rekent', 'De verzekering betaalde per kist. Hij telde er één te veel.', '🧾 Verzekeringspolis'],
        ['Krokodillen', 'Midden in de nacht viel er iets overboord. Te zwaar voor een kist.', '🐊 Krokodillenleer'],
        ['Aankomst in Caïro', 'Op de kade in Caïro stonden twaalf kisten. Eén meer dan er aan boord waren.', '🏛️ Museumlabel']
      ]],
    ['🔥', 'Terug naar het zand',
      'Het seizoen is voorbij en het graf gaat dicht tot volgend jaar. Nog één nacht rond het kampvuur, met dezelfde gezichten als op de eerste dag.',
      'Van Dam schudt het zand uit zijn hoed, groet het kamp en stapt in de trein naar Caïro. Het graf van Nefer-Ankh heeft geen geheimen meer.',
      'De laatste zaken, bijna allemaal op het grote bord. Blijf niet hangen bij wie het lastigst is: zet eerst de anderen neer, dan blijft er voor de laatste vaak maar één vakje over.',
      'hMMMMMMM', [
        ['Het laatste kampvuur', 'Iedereen zat rond het vuur. Eén plek bleef warm, en leeg.', '🔥 Gloeiend kooltje'],
        ['De deur gaat dicht', 'Ze metselden de deur weer dicht. Achter de stenen bleef het stil. Bijna.', '🧱 Baksteen'],
        ['Tekenares Maud pakt in', 'Driehonderd tekeningen in één map. Eén tekening hoorde er niet bij.', '🗂️ Tekenmap'],
        ['De laatste ronde', 'Opzichter Ahmed liep zijn laatste ronde. Hij kwam terug met een steen in zijn hand.', '🪨 Kalksteen'],
        ['Egyptologe Clara blijft', 'Iedereen vertrok. Zij bleef nog één dag, alleen.', '⛺ Laatste tent'],
        ['De rekening', 'Lord Ashcombe betaalde alles. Na zijn dood betaalde iemand anders.', '💰 Geldkist'],
        ['Het oog van de koningin', 'Op het deksel staan twee geschilderde ogen. Eén ervan kijkt naar de dader.', '👁️ Geschilderd oog'],
        ['Terug naar het zand', 'Waar het begon, bij de verzegelde deur. Daar eindigt het ook.', '🏜️ Woestijnzand']
      ]]
  ]);

  const casino = build('casino', 130000, [
    ['🎰', 'De grote avond',
      'Casino Azur, Monte Carlo, mei 1960. Het is Grand Prix-weekend en alle tafels zijn vol. Om middernacht ligt eigenaar Lorenzo Vitali in zijn eigen kluis, tussen de stapels fiches.',
      'De tafels gaan dicht. Maar het weekend is nog lang.',
      'Een casino is één grote zaal met veel hoeken. Begin bij wie zegt in welke ruimte hij was; "direct naast" de fruitautomaat telt alleen recht ernaast, nooit schuin.',
      'kkkggghh', [
        ['Faites vos jeux', 'Het eerste spel van de avond. Het laatste van de eigenaar.', '🎲 Dobbelsteen'],
        ['De open kluis', 'De kluis stond open. Hij gaat alleen open met twee sleutels.', '🔐 Kluissleutel'],
        ['Croupier Marcel deelt', 'Hij deelde de hele avond. Om middernacht stond er een ander aan zijn tafel.', '🃏 Speelkaart'],
        ['De champagnetoren', 'Honderd glazen in een toren. Eén glas ontbrak.', '🥂 Coupe'],
        ['Zangeres Gigi zingt', 'Haar laatste lied ging over een kluis. Niemand lachte.', '🎤 Microfoon'],
        ['De fiches', 'Rood, groen, zwart. Eén kleur bestond niet in dit casino.', '🔴 Valse fiche'],
        ['Huisdetective Fenna let op', 'Ze zag elke speler. Op één na.', '🕵️‍♀️ Detectivepas'],
        ['Middernacht in Monaco', 'De klok sloeg twaalf. Buiten zweeg het geluid van de motoren.', '🕛 Casinoklok']
      ]],
    ['🔐', 'De kluis',
      'De politie van Monaco sluit het casino. In de kluis ligt alles nog op zijn plek. Er ontbreekt niets, behalve de eigenaar.',
      'De kluis is weer dicht. Morgen draait het wiel gewoon verder.',
      'Hier speelt iedereen met twee kaarten tegelijk. Een verklaring over twee mensen los je op door eerst één van de twee vast te zetten.',
      'kkggghhh', [
        ['Twee sleutels', 'De kluis ging alleen open met twee sleutels. Er was er maar één gevonden.', '🗝️ Tweede sleutel'],
        ['Bankier Sterling rekent', 'Hij wist precies wat er in de kluis lag. Tot op de laatste fiche.', '🧮 Rekenliniaal'],
        ['De garderobe', 'Achtenveertig jassen. Er werden er zevenenveertig opgehaald.', '🧥 Avondjas'],
        ['Erfgename Delphine verliest', 'Ze verloor elke avond. Vanavond verloor ze niets.', '💍 Diamanten ring'],
        ['Het codeslot', 'Vier cijfers. De eigenaar vertelde ze aan niemand. Bijna niemand.', '🔢 Codeslot'],
        ['Coureur Rocco komt te laat', 'Hij kwam om half één binnen. Zijn helm was nog warm.', '🪖 Racehelm'],
        ['De nachtwaker', 'De nachtwaker sliep in de garage. Hij hoorde een motor.', '🚨 Alarmbel'],
        ['Een volle kluis', 'Alles lag er nog. Te veel zelfs.', '💵 Bankbiljet']
      ]],
    ['🎯', 'Rien ne va plus',
      'Het casino gaat weer open. Aan tafel vijf valt het balletje steeds op hetzelfde getal, en iemand weet waarom.',
      'Het wiel is gewogen en rechtgezet. Het balletje valt weer waar het wil.',
      'Bij de roulette kijkt iedereen naar het wiel, niet naar elkaar. Wie zegt waar hij níét was, vertelt je ook iets: streep die ruimte meteen weg.',
      'kggghhhh', [
        ['Zeventien', 'Zes keer achter elkaar zeventien. De croupier keek niet op.', '🎯 Rouletteballetje'],
        ['Gokker Duke wint', 'Hij zette alles op zeventien. Voordat het wiel draaide.', '🎩 Fedora'],
        ['Het scheve wiel', 'Het wiel helde één millimeter. Genoeg voor een fortuin.', '⚙️ Kogellager'],
        ['Fotomodel Tess kijkt toe', 'Ze keek de hele avond naar het wiel. Of naar de man ernaast.', '🕶️ Zonnebril'],
        ['De magneet', 'Onder tafel vijf zat een magneet. Iemand had hem er gisteren onder geplakt.', '🧲 Magneet'],
        ['Croupier Marcel wordt geschorst', 'Hij moest naar huis. Hij ging naar de jachthaven.', '🪪 Personeelspas'],
        ['Het geld van de bank', 'De bank verloor in één nacht een miljoen. De bankier lachte.', '💸 Verloren inzet'],
        ['Rien ne va plus', 'Niets gaat meer. Behalve één inzet.', '🎰 Laatste fiche']
      ]],
    ['🏁', 'De Grand Prix',
      'Zondag de Grand Prix. Motoren brullen door de straten van Monte Carlo, en het casino is één grote tribune.',
      'De vlag valt en de winnaar drinkt champagne. Op de tribune is één stoel leeg.',
      'Op de racedag staat iedereen bij het raam. Zet eerst de verdachte met de kleinste keus neer; de rest volgt.',
      'kgghghhh', [
        ['De start', 'Twintig wagens op de startlijn. Negentien kwamen terug.', '🏁 Startvlag'],
        ['Coureur Rocco in de pits', 'Zijn wagen stond klaar. De banden niet.', '🛞 Racewiel'],
        ['De tribune', 'Iedereen zat op de tribune. Eén stoel bleef de hele race leeg.', '🎟️ Tribunekaart'],
        ['De garage', 'In de garage van het casino stond een raceauto. Hij was niet van Rocco.', '🏎️ Raceauto'],
        ['Bankier Sterling wedt', 'Hij wedde op de verliezer. Hij won.', '📈 Wedbriefje'],
        ['Benzine', 'De garage rook naar benzine. Er stond geen auto meer.', '⛽ Jerrycan'],
        ['Fotomodel Tess op de foto', 'Ze stond op de foto met de winnaar. Op de achtergrond: de kluis.', '📷 Persfoto'],
        ['De laatste ronde', 'In de laatste ronde viel één motor stil. Niet op het circuit.', '🏆 Beker']
      ]],
    ['🛥️', 'Het jacht',
      'Een feest aan boord van het jacht van de erfgename, in de haven. Lampions, jazz en champagne. Als de zon opkomt, is er één sloep weg.',
      'De sloep ligt weer aan de kade. Het jacht vaart uit, met één gast minder.',
      'Op een jacht is het smal en staat iedereen dicht op elkaar. Begin bij wie zegt alleen te zijn geweest: dat ruimt meteen een hele ruimte op.',
      'kgghghhh', [
        ['Lampions op het water', 'Honderd lampions. Eén ging uit.', '🏮 Lampion'],
        ['Erfgename Delphine geeft een feest', 'Ze nodigde iedereen uit. Behalve één.', '💌 Uitnodiging'],
        ['De sloep', 'Om twee uur lag de sloep nog aan het jacht. Om drie uur niet meer.', '🛶 Sloep'],
        ['Zangeres Gigi zingt aan dek', 'Ze zong tot drie uur. Haar laatste lied hoorde niemand.', '🎷 Saxofoon'],
        ['Het kompas', 'Het kompas wees de verkeerde kant op. Iemand had een magneet in zijn zak.', '🧭 Kompas'],
        ['Gokker Duke zwemt', 'Hij kon niet zwemmen, zei hij. Zijn haar was nat.', '🏊 Natte handdoek'],
        ['De haven bij nacht', 'Om vier uur was de haven stil. Op één motor na.', '⚓ Bootanker'],
        ['Bij zonsopgang', 'De zon kwam op boven de baai. Er stond één gast minder aan dek.', '🌅 Zonsopgang']
      ]],
    ['🃏', 'Het valse spel',
      'In de pokerkamer wint dezelfde speler elke hand. De kaarten zijn gemerkt, en de huisdetective wil weten door wie.',
      'De gemerkte kaarten liggen in de kluis. De speler die ze gebruikte zit niet meer aan tafel.',
      'Valsspelers liegen graag, de plattegrond niet. De verklaringen worden zuiniger: streep weg wat niet kan en kijk wat overblijft.',
      'kghhghhh', [
        ['Tafel drie', 'Vijf spelers, één deler. Een van hen kende elke kaart.', '♠️ Schoppenaas'],
        ['Het merkteken', 'Op de achterkant van de kaarten zat een stip. Je zag hem alleen met een gekleurde bril.', '👓 Gekleurde bril'],
        ['Huisdetective Fenna verhoort', 'Ze stelde iedereen één vraag. Eén speler gaf twee antwoorden.', '📝 Verhoorblok'],
        ['De mouw', 'Hij had een kaart in zijn mouw. Zijn jasje hing in de garderobe.', '👔 Overhemd'],
        ['Bankier Sterling verliest', 'Hij verloor voor het eerst in tien jaar. Met opzet.', '💳 Kredietbrief'],
        ['De spiegel achter de bar', 'In de spiegel zag je de kaarten van tafel drie.', '🪞 Barspiegel'],
        ['Coureur Rocco speelt', 'Hij speelde zoals hij reed: te snel, en zonder remmen.', '🎲 Dobbelstenen'],
        ['Gemerkte kaarten', 'Alle kaarten waren gemerkt. Op één stapel na.', '🃏 Gemerkt spel']
      ]],
    ['💃', 'Het galabal',
      'Het galabal van het seizoen in de balzaal. Smoking verplicht, het orkest speelt tot drie uur, en één gast draagt de hele avond handschoenen.',
      'Het orkest pakt in en de balzaal is leeg. De handschoenen liggen in de garderobe.',
      'Het bord wordt groter en de verklaringen worden zuiniger. Staat in het rapport dat een ruimte leeg was, dan valt die hele ruimte af voor iedereen.',
      'hhMhMhMM', [
        ['Smoking verplicht', 'Iedereen in het zwart. Eén smoking was gehuurd, op een andere naam.', '🤵 Smoking'],
        ['De handschoenen', 'Ze droeg de hele avond handschoenen. Ook tijdens het eten.', '🧤 Avondhandschoen'],
        ['Zangeres Gigi en de bankier', 'Ze dansten één dans. Daarna zat hij alleen aan de bar.', '🍸 Martini'],
        ['Het orkest', 'Twaalf muzikanten, twaalf stoelen. Eén stoel stond in de garderobe.', '🎺 Trompet'],
        ['Erfgename Delphine danst', 'Ze danste met iedereen. Haar armband danste mee, tot middernacht.', '💠 Armband'],
        ['De verloren schoen', 'Om drie uur lag er één schoen op de dansvloer. De eigenaar was weg.', '👠 Pump'],
        ['Het vuurwerk', 'Om middernacht vuurwerk boven de baai. Eén knal kwam van binnen.', '🎆 Vuurwerk'],
        ['De laatste wals', 'De laatste wals duurde vier minuten. Genoeg tijd voor één ding.', '🎻 Strijkstok']
      ]],
    ['🍾', 'De laatste inzet',
      'Het casino krijgt een nieuwe eigenaar. Nog één avond onder de oude kroonluchters, met dezelfde gezichten als in het Grand Prix-weekend.',
      'Van Dam zet zijn laatste fiche op rood, laat hem liggen en loopt de nacht van Monte Carlo in. Het huis wint niet altijd.',
      'De laatste zaken, bijna allemaal op het grote bord. Blijf niet hangen bij wie het lastigst is: zet eerst de anderen neer, dan blijft er voor de laatste vaak maar één vakje over.',
      'hMMMMMMM', [
        ['De nieuwe eigenaar', 'Niemand kende de nieuwe eigenaar. Op één gast na.', '📝 Koopcontract'],
        ['Croupier Marcel neemt afscheid', 'Dertig jaar aan dezelfde tafel. Vanavond keek hij naar de deur.', '🏅 Afscheidsspeld'],
        ['De laatste champagne', 'De laatste fles uit de kelder. Iemand had hem al geopend.', '🍾 Laatste fles'],
        ['Huisdetective Fenna sluit haar dossier', 'Ze schreef de naam op. Ze streepte hem niet door.', '📁 Dossier'],
        ['Coureur Rocco vertrekt', 'Zijn auto stond klaar. De sleutel lag in de kluis.', '🔑 Autosleutel'],
        ['Gokker Duke zet alles in', 'Alles op één getal. Hij wist het al.', '🪙 Laatste munt'],
        ['De kroonluchter dooft', 'Om twee uur ging het licht uit. Eén kaars bleef branden.', '🕯️ Kaarsvet'],
        ['De laatste inzet', 'Waar het begon, in de kluis. Daar eindigt het ook.', '♦️ Ruitenaas']
      ]]
  ]);

  const ZAKEN = [...opgraving, ...casino];
  if (typeof window !== 'undefined') window.ZAKEN = ZAKEN;
  if (typeof module !== 'undefined' && module.exports) module.exports = { ZAKEN };
})();
