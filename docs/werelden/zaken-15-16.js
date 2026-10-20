// Campaign parts of worlds 15 and 16 (Abdij, Vuurtoren), in the shape of CAMPAIGN in campaign.js, until their translations exist.
// Seeds: world base + part * 1000 + 101 + case * 97 (Abdij 161101.., Vuurtoren 171101..), outside every seed in use
// and below the archive (200000+). Not yet run through bewijs.js.
// Difficulty per part follows the other worlds: parts 1-6 from makkelijk to moeilijk, parts 7-8 moeilijk and meester.
(() => {
  const D = { k: 'makkelijk', g: 'gemiddeld', h: 'moeilijk', M: 'meester' };
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  // part: [icon, title, intro, outro, briefing, difficulty letters, cases as [title, story, item]]
  const build = (theme, base, parts) => parts.map(([icon, title, intro, outro, briefing, diffs, cases], p) => ({
    key: p === 0 ? theme : `${theme}-${p + 1}`, theme, part: p + 1, icon, title: `Deel ${ROMAN[p]} · ${title}`, intro, outro, briefing,
    cases: cases.map(([t, story, item], i) => ({ title: t, story, item, difficulty: D[diffs[i]], seed: base + (p + 1) * 1000 + 101 + i * 97 }))
  }));

  const abdij = build('abdij', 160000, [
    ['⛪', 'De dode abt',
      'Abdij van Sint-Aldric, winter 1327. De sneeuw sluit de bergpas af. Na het nachtgebed ligt abt Bertram in het scriptorium, met inkt aan zijn vingers.',
      'De broeders bidden voor hun abt. De sneeuw blijft liggen, en de winter is nog lang.',
      'Een abdij is vol stille gangen en gesloten deuren. Begin bij wie zegt in welke ruimte hij was; "direct naast" de kandelaar telt alleen recht ernaast, nooit schuin.',
      'kkkggghh', [
        ['Na het nachtgebed', 'Twaalf broeders zongen de metten. Daarna klonk er één stem minder.', '📿 Paternostersnoer'],
        ['Inkt aan zijn vingers', 'De abt schreef nooit zelf. Zijn vingers waren zwart van de inkt.', '🪶 Ganzenveer'],
        ['Broeder Anselm telt', 'Zeven sleutels aan zijn ring. Gisteren waren het er acht.', '🗝️ Sleutelbos'],
        ['De kandelaar', 'De kaars in het scriptorium brandde nog. Na de metten mag daar geen licht zijn.', '🕯️ Waskaars'],
        ['Novice Elias schrijft', 'Op zijn wastablet stond een psalm. Eronder, half uitgewist, een naam.', '📝 Wastablet'],
        ['Sneeuw op de pas', 'Niemand kon de abdij in of uit. Toch hing er een touw over de muur.', '🪢 Hennepkoord'],
        ['Gravin Mathilde wacht', 'Ze wilde de abt na de metten spreken. Ze zegt dat hij niet kwam.', '💍 Zegelring'],
        ['De eerste nacht', 'De poort was dicht en de pas was dicht. De deur van het scriptorium stond open.', '🔩 Deurgrendel']
      ]],
    ['📕', 'Het verboden boek',
      'In de bibliotheek staat één boek dat niemand mag lezen. Alleen de abt had de sleutel. Iemand heeft het toch gelezen.',
      'Het boek ligt weer achter slot. De vraag is niet meer wie het las, maar waarom.',
      'In de bibliotheek fluistert iedereen, en elk woord telt. Een verklaring over twee mensen los je op door eerst één van de twee vast te zetten.',
      'kkggghhh', [
        ['Achter slot', 'Het boek lag achter twee sloten. Eén slot was nog dicht.', '🔒 Hangslot'],
        ['Broeder Anselm zwijgt', 'Hij wist welk boek het was. Hij wist ook wie erom had gevraagd.', '📚 Catalogus'],
        ['Een blad minder', 'Het boek telde tweehonderd bladen. Eén blad was er recht uitgesneden.', '🔪 Pennenmes'],
        ['Verluchtster Odile kijkt', 'Het goud in de marge is van haar hand. Het boek zelf had ze nooit gezien, zegt ze.', '✨ Bladgoud'],
        ['Lezen bij kaarslicht', 'Op het perkament zat kaarsvet. Talg uit de keuken, geen was uit de kapel.', '🕯️ Talgkaars'],
        ['Novice Elias leest', 'Hij kent nauwelijks Latijn, zegt hij. Op zijn wastablet stond een zin uit het verboden boek.', '✍️ Overgeschreven zin'],
        ['Kelderbroeder Waldo en de gravin', 'Ze spraken samen in de kloostergang. Daarna zeiden ze geen woord meer tegen elkaar.', '✉️ Verzegeld briefje'],
        ['Het verboden boek', 'Niemand mocht het lezen. Twee mensen hebben het toch gedaan.', '📕 Verboden boek']
      ]],
    ['🌿', 'De kruidentuin',
      'De kruidentuin ligt onder de sneeuw, maar de gedroogde kruiden hangen binnen. In de ziekenboeg wordt een oude broeder zieker in plaats van beter. Iemand mengt zijn drank opnieuw.',
      'De oude broeder zit weer rechtop en vraagt om soep. De verkeerde pot is weg uit de ziekenboeg.',
      'Tussen de kruiden weet iedereen wat waar groeit. Wie zegt waar hij níét was, vertelt je ook iets: streep die ruimte meteen weg.',
      'kggghhhh', [
        ['Elk kruid geneest', 'Salie voor de keel, munt voor de maag. In de pot zat geen van beide.', '🌿 Gedroogde salie'],
        ['Broeder Cuthbert mengt', 'Hij mengde de drank zoals elke avond. Alleen proefde hij er deze keer niet van.', '🥣 Kruidendrank'],
        ['De vijzel', 'In de vijzel zat nog poeder. Van een kruid dat niet in deze tuin groeit.', '🌰 Gemalen wortel'],
        ['Kruidenvrouw Hilde komt binnen', 'Ze kwam uit het dorp met een mand vol kruiden. De pas was al een week dicht.', '🧺 Kruidenmand'],
        ['Bijen in de winter', 'In de winter slapen de bijen. Iemand heeft de korf toch opengemaakt.', '🍯 Honingraat'],
        ['De ziekenboeg', 'Drie bedden, twee zieken. Het derde bed was warm.', '🛏️ Strozak'],
        ['Pelgrim Gisela helpt', 'Ze bood aan de zieke te verzorgen. Ze wist welke drank hij kreeg, voordat iemand het haar zei.', '🍶 Drinkkalebas'],
        ['Monnikskap', 'Een mooie paarse bloem. In elk kruidenboek staat een kruisje naast haar naam.', '🪻 Monnikskap']
      ]],
    ['❄️', 'De lange winter',
      'De pas is dicht tot het voorjaar. Kelderbroeder Waldo telt elke week de voorraden, en elke week is de kelder leger dan hij hoort te zijn.',
      'De kelder is geteld en het brood eerlijk verdeeld. Wie at voor twee, eet nu voor één.',
      'In de winter blijft iedereen dicht bij het vuur, en dicht bij elkaar. Zet eerst de verdachte met de kleinste keus neer; de rest volgt.',
      'kgghghhh', [
        ['Tot het voorjaar', 'Genoeg graan voor vier maanden, zei de kelderbroeder. Na één maand was de helft op.', '🌾 Graanzak'],
        ['Kelderbroeder Waldo weegt', 'Elke week woog hij de kazen. Er ontbrak er geen, maar ze werden lichter.', '🧀 Kaaswiel'],
        ['De bakkerij', 'De oven is koud sinds de metten. Toch ruikt de bakkerij naar vers brood.', '🍞 Roggebrood'],
        ['Gravin Mathilde vast', 'Ze vast de hele advent, zegt ze. Onder haar bed liggen kruimels van wittebrood.', '🥖 Broodkorst'],
        ['De zandloper', 'In de keuken draait iemand elk uur de zandloper om. Om drie uur vergat hij het.', '⏳ Zandloper'],
        ['Novice Elias heeft honger', 'Hij was de magerste van allemaal. Tot half januari.', '🍽️ Houten nap'],
        ['Wijn voor de mis', 'Voor de mis is een kan per week genoeg. Er verdween een heel vat.', '🍷 Miswijn'],
        ['Sneeuw tot de luiken', 'De sneeuw lag tot aan de luiken van de refter. Eén luik stond open, van binnenuit.', '🧊 IJspegel']
      ]],
    ['🐎', 'Het bezoek van de bisschop',
      'Een week dooi opent de pas. De bisschop is op weg om een nieuwe abt te kiezen, en niet iedereen wil dat hij aankomt.',
      'De bisschop komt veilig aan en zegent de abdij. De nieuwe abt wordt gekozen, en geen stem is gekocht.',
      'Voor het bezoek staat iedereen ergens anders klaar. Begin bij wie zegt alleen te zijn geweest: dat ruimt meteen een hele ruimte op.',
      'kgghghhh', [
        ['Een brief met zegel', 'De brief van de bisschop had een rood zegel. Het zegel was al eens gebroken.', '📜 Bisschopsbrief'],
        ['Broeder Anselm wil abt worden', 'Hij wil het niet, zegt hij. Hij kent de eed al uit zijn hoofd.', '📃 Abtseed'],
        ['De klokkentoren', 'Als de bisschop aankomt, luidt de klok. Het touw was doorgesneden, op ooghoogte.', '🔔 Klokkentouw'],
        ['Gravin Mathilde schenkt', 'Ze schenkt de abdij een gouden kelk. Als de bisschop haar kandidaat kiest.', '🏆 Gouden kelk'],
        ['Stenen op het pad', 'Iemand had stenen op het bergpad gerold. Ze lagen boven op de sneeuw, niet eronder.', '🪨 Rotsblok'],
        ['Broeder Cuthbert kookt', 'Voor de bisschop een feestmaal. Eén schotel was voor hem alleen.', '🍲 Stoofpot'],
        ['Kruidenvrouw Hilde kent de weg', 'Ze kent elk pad door de bergen. Ook het pad dat de bisschop zou nemen.', '🥾 Natte laars'],
        ['De bisschop komt', 'Zijn muildier kwam als eerste de poort door. De bisschop een uur later, te voet.', '🐴 Muildier']
      ]],
    ['🔥', 'Vuur in het scriptorium',
      'Midden in de nacht staat het scriptorium in brand. De broeders blussen met sneeuw en emmers. Eén boek is gered, door de verkeerde.',
      'Het vuur is uit en de muren zijn zwart. Het geredde boek ligt in de kapel, uit de verkeerde handen.',
      'Rook maakt getuigen vaag, de plattegrond niet. De verklaringen worden zuiniger: gebruik het potlood, streep vakjes weg die niet kunnen en kijk wat overblijft.',
      'kghhghhh', [
        ['Rook na de metten', 'Na de metten hing er rook in de kloostergang. Alle kaarsen waren al gedoofd.', '💨 Rookspoor'],
        ['Emmers sneeuw', 'De broeders blusten met sneeuw van de binnenplaats. Bij het scriptorium was de sneeuw al weggeschept, voor het vuur begon.', '🪣 Houten emmer'],
        ['Verluchtster Odile rent', 'Ze rende als eerste het vuur in, voor haar boeken. Ze kwam terug met lege handen en schone mouwen.', '🎨 Verfpotje'],
        ['De lessenaar', 'Alle lessenaars waren verbrand. Het zwartst was de lessenaar die het verst van de kaarsen stond.', '🪵 Verkoold hout'],
        ['Kelderbroeder Waldo blust', 'Hij droeg de zwaarste emmers. Zijn habijt rook niet naar vuur, maar naar olie.', '🫙 Oliekruik'],
        ['As in de refter', 'In de haard van de refter lag as van perkament. Het vuur in het scriptorium begon pas later.', '🌫️ Perkamentas'],
        ['Pelgrim Gisela bidt', 'Ze bad de hele brand lang in de kapel. Haar mantel was zwart van het roet.', '🧥 Pelgrimsmantel'],
        ['De verkeerde redder', 'Eén boek werd gered. Door iemand die zegt dat hij niet kan lezen.', '📘 Geschroeide band']
      ]],
    ['🚪', 'De pelgrims',
      'Twaalf pelgrims kloppen aan en vragen om onderdak. De regel zegt dat elke gast ontvangen wordt als Christus zelf. Na drie dagen trekken er elf verder.',
      'De elf pelgrims trekken verder naar Rome. De twaalfde blijft, maar niet als gast.',
      'Het bord wordt groter en de abdij voller. Staat in het rapport dat een ruimte leeg was, dan valt die hele ruimte af voor iedereen.',
      'hhMhMhMM', [
        ['Twaalf aan de poort', 'Twaalf pelgrims vroegen om brood en een bed. In de sneeuw voor de poort stonden dertien paar voetsporen.', '👣 Voetsporen'],
        ['Pelgrim Gisela herkent iemand', 'Ze kende één van de twaalf. Ze zei het pas toen hij weg was.', '🐚 Sint-Jakobsschelp'],
        ['Het gastenboek', 'Elke gast schreef zijn naam in het boek. Twee namen staan er in dezelfde hand.', '✒️ Gastenboek'],
        ['Broeder Cuthbert verbindt', 'Hij verbond de voeten van elf pelgrims. De twaalfde had geen blaren.', '🩹 Linnen verband'],
        ['Het brood van de armen', 'Elke pelgrim kreeg één brood. De bakkerij bakte er dertien.', '🥖 Pelgrimsbrood'],
        ['Novice Elias spreekt', 'Hij sprak met de pelgrims in hun eigen taal. Hij komt uit een dorp hier vlakbij, zei hij in de zomer.', '🧾 Vrijgeleide'],
        ['Verluchtster Odile tekent', 'Ze tekende de twaalf in de marge van een psalter. Eén gezicht had ze al eens geschilderd.', '🖌️ Penseel'],
        ['Elf vertrekken', 'Twaalf kwamen er binnen. Elf trokken verder naar Rome.', '⛰️ Bergpad']
      ]],
    ['🔔', 'Het laatste getijde',
      'Het voorjaar komt en de sneeuw smelt van de pas. Nog één nacht in de kloostergang, met dezelfde gezichten als in de eerste winternacht.',
      'Van Dam trekt zijn mantel dicht, buigt voor de broeders en loopt over de open pas het dal in. De klok luidt voor het avondgebed. Het boek staat weer op zijn plank.',
      'De laatste zaken, bijna allemaal op het grote bord. Blijf niet hangen bij wie het lastigst is: zet eerst de anderen neer, dan blijft er voor de laatste vaak maar één vakje over.',
      'hMMMMMMM', [
        ['De sneeuw smelt', 'Onder de sneeuw bij de muur lag een sleutel. De achtste.', '🔑 IJzeren sleutel'],
        ['Broeder Anselm geeft de sleutels af', 'Veertig jaar droeg hij de sleutels. Vanavond legt hij ze neer, op één na.', '⛓️ Sleutelring'],
        ['Kruidenvrouw Hilde gaat naar huis', 'Ze kwam met een volle mand kruiden. Ze gaat met een volle mand, en geen kruiden.', '🧺 Volle mand'],
        ['De nieuwe abt', 'Hij zegent de broeders voor het eerst. Eén broeder buigt zijn hoofd niet.', '⚜️ Abtsstaf'],
        ['Kelderbroeder Waldo sluit de kelder', 'De kelder is weer gevuld voor de zomer. Achter het laatste vat staat iets wat er niet hoort.', '🍺 Kloosterbier'],
        ['Gravin Mathilde vertrekt', 'Haar wagen staat klaar aan de poort. Hij is zwaarder dan toen ze kwam.', '🛞 Wagenwiel'],
        ['De vespers', 'Het laatste avondgebed van de winter. Eén stem zong een andere psalm.', '🎼 Antifonarium'],
        ['Het laatste getijde', 'Waar het begon, in het scriptorium. Daar eindigt het ook.', '🖋️ Inkthoorn']
      ]]
  ]);

  const vuurtoren = build('vuurtoren', 170000, [
    ['🌑', 'Het licht gaat uit',
      'Vuurtoren Grauwkaap, november 1900. Een storm sluit het eiland af van de wal. Om middernacht gaat het licht uit. Boven in de lantaarnkamer ligt wachter Silas Mourne.',
      'Het licht brandt weer, maar de wachter ziet het niet meer. De storm houdt nog dagen aan.',
      'Een eiland is klein, een vuurtoren hoog en smal. Begin bij wie zegt in welke ruimte hij was; "direct naast" de reddingsboei telt alleen recht ernaast, nooit schuin.',
      'kkkggghh', [
        ['Middernacht', 'Twintig jaar brandde het licht elke nacht. Vannacht hield het om twaalf uur op.', '🪔 Petroleumbrander'],
        ['De lantaarnkamer', 'De wachter lag onder de lens. De deur zat van binnen op slot.', '🔐 Lantaarnsleutel'],
        ['Assistent Jonas klimt', 'Honderdtwaalf treden naar boven. Hij was in twee minuten boven, zegt hij.', '🕰️ Zakhorloge'],
        ['De reddingsboei', 'De boei hangt altijd naast de deur van het wachtershuis. Vannacht dreef hij in de branding.', '🛟 Reddingsboei'],
        ['Telegrafiste Fien seint', 'Om vijf voor twaalf seinde ze naar de wal dat het licht uit was. Om twaalf uur ging het uit.', '📨 Seinbericht'],
        ['Het draaiwerk', 'Het draaiwerk van de lens stond stil. Er zat een zeemansknoop omheen.', '🪢 Zeemansknoop'],
        ['Huishoudster Martha slaapt', 'Ze sliep al om tien uur, zegt ze. Om middernacht was de theepot nog warm.', '🫖 Theepot'],
        ['Storm uit het westen', 'Geen boot kon het eiland op of af. Aan de steiger lag er toch één minder.', '⚓ Los meertouw']
      ]],
    ['🚢', 'De schipbreuk',
      'In de tweede stormnacht valt het licht een uur uit. In dat uur loopt een schip op de rotsen onder het klif. Eén man spoelt aan, zonder papieren.',
      'Het wrak breekt in de branding. Waarom het schip zo dicht onder de kust voer, weet jij nu.',
      'Na een schipbreuk vertelt iedereen wat hij zag, en wie. Een verklaring over twee mensen los je op door eerst één van de twee vast te zetten.',
      'kkggghhh', [
        ['Op de rotsen', 'Zonder licht voer het schip recht op het klif af. Op het strand brandde wel een lamp.', '🏮 Stormlamp'],
        ['Schipbreukeling Lev spoelt aan', 'Hij spoelde aan zonder papieren. Zijn tabaksdoos was droog.', '🚬 Tabaksdoos'],
        ['Visser Bartel ziet het', 'Hij keek vanaf het klif toe, zegt hij. Zijn riemen waren nog nat.', '🚣 Roeiriem'],
        ['Het wrak', 'Van het schip bleef alleen de boeg over. De naam op de boeg was overgeschilderd.', '🖌️ Verse verf'],
        ['Loodsman Kees en de kapitein', 'Hij kende de kapitein van het schip. Ze hadden die nacht een afspraak, voor de kust.', '🗺️ Zeekaart'],
        ['Vogelkundige Dorien noteert', 'In haar veldboek: drie uur, strand, één scholekster. En een man.', '📓 Veldboek'],
        ['Kisten op het strand', 'Twaalf kisten spoelden aan. In het botenhuis stonden er negen.', '📦 Scheepskist'],
        ['Telegrafiste Fien en de wal', 'De wal vroeg naar de naam van het schip. Ze seinde hem door voordat iemand de boeg had gezien.', '📃 Seinstrook']
      ]],
    ['🌫️', 'De mist',
      'Na de storm komt de mist. Drie dagen lang blaast de misthoorn elk kwartier. Op de tweede nacht blaast hij één keer te vaak.',
      'De mist trekt op en de misthoorn zwijgt. De boot die op het sein wachtte, is nooit aangekomen.',
      'In de mist ziet niemand iets, maar iedereen weet waar hij niet stond. Wie zegt waar hij níét was, vertelt je ook iets: streep die ruimte meteen weg.',
      'kggghhhh', [
        ['Elk kwartier', 'Vier stoten per uur. Om twee uur waren het er vijf.', '📯 Misthoorn'],
        ['Assistent Jonas blaast', 'Hij blies de hoorn de hele nacht, zegt hij. Om drie uur sliep hij in de keuken.', '⚙️ Slinger'],
        ['De verrekijker', 'Bij mist heb je niets aan een verrekijker. Toch stond hij op het klif, gericht op zee.', '🔭 Verrekijker'],
        ['Onderwijzeres Wilma verdwaalt', 'Ze loopt al tien jaar van de school naar het wachtershuis. In de mist kwam ze uit bij het botenhuis.', '👓 Beslagen bril'],
        ['Een stem in de mist', 'Iemand riep vanaf de steiger om hulp. Toen ze er kwamen, lag er alleen een pet.', '🧢 Natte pet'],
        ['Visser Bartel vaart uit', 'Geen visser gaat de mist in. Hij kwam terug met lege fuiken, op één na.', '🦞 Kreeftenfuik'],
        ['Schipbreukeling Lev verstaat het', 'Hij spreekt geen Nederlands, zegt hij. Hij lachte om een grap van de visser.', '🧶 Wollen deken'],
        ['Eén keer te vaak', 'Die vijfde stoot was geen vergissing. Het was een sein, voor een boot in de mist.', '⛵ Sloep']
      ]],
    ['📖', 'Het logboek',
      'Elke nacht schreef de wachter in het logboek: het weer, de schepen, het licht. De laatste bladzijde is eruit gescheurd.',
      'De laatste bladzijde is terecht, verfrommeld en half verbrand. Wat erop stond, wist jij al.',
      'In een logboek staat alles op volgorde, en elke regel wijst naar een ruimte. Zet eerst de verdachte met de kleinste keus neer; de rest volgt.',
      'kgghghhh', [
        ['De laatste bladzijde', 'De bladzijde is eruit gescheurd. Op de volgende staat de afdruk van zijn pen.', '📄 Doordruk'],
        ['Huishoudster Martha poetst', 'Het logboek raakte ze nooit aan, zegt ze. Er zat boenwas op de kaft.', '🧽 Poetsdoek'],
        ['Inkt en potlood', 'De wachter schreef altijd met inkt. De laatste regel staat er in potlood.', '✏️ Timmermanspotlood'],
        ['Loodsman Kees leest mee', 'Hij wist welke schepen in het logboek stonden. Ook welk schip er niet in stond.', '📋 Scheepslijst'],
        ['Het weer volgens de wachter', 'Windkracht negen, schreef hij op dinsdag. Op dinsdag was het windstil.', '🌬️ Windmeter'],
        ['Onderwijzeres Wilma kent het handschrift', 'Ze kent elk handschrift op het eiland. Dit kende ze ook, zei ze, en toen zweeg ze.', '🖋️ Kroontjespen'],
        ['Telegrafiste Fien schrijft over', 'Elk bericht naar de wal schrijft ze ook in haar eigen boek. Eén bericht staat er twee keer in.', '📒 Seinboek'],
        ['As in de kachel', 'In de kachel van de seinkamer lag as. Daartussen een hoekje papier met een getal.', '🔥 Verbrand hoekje']
      ]],
    ['⛴️', 'De bevoorradingsboot',
      'Eens per maand komt de boot met petroleum, meel en post. Het hele eiland staat op de steiger. Deze keer neemt de boot iets mee terug.',
      'De boot vertrekt zonder de kist. De schipper heeft nooit geweten wat hij bijna meenam.',
      'Als de boot komt, sjouwt iedereen ergens anders. Begin bij wie zegt alleen te zijn geweest: dat ruimt meteen een hele ruimte op.',
      'kgghghhh', [
        ['Eens per maand', 'Petroleum, meel en post, zoals elke maand. Deze keer ook een kist zonder naam.', '🛢️ Petroleumvat'],
        ['De post', 'Er kwam een brief voor de wachter. Verstuurd vanaf de wal, een dag na zijn dood.', '✉️ Brief'],
        ['Huishoudster Martha bestelt', 'Op haar lijst: meel, zout en rattengif. Er zijn geen ratten op het eiland.', '☠️ Rattengif'],
        ['Het botenhuis', 'In het botenhuis stond een kist die mee terug moest. In het deksel zaten luchtgaten.', '📦 Kist met luchtgaten'],
        ['Schipbreukeling Lev wil mee', 'Hij heeft geen geld, zegt hij. Hij bood de schipper een gouden munt.', '🪙 Gouden munt'],
        ['Vogelkundige Dorien verstuurt', 'Tien opgezette vogels voor het museum. Eén ervan is zwaarder dan een vogel hoort te zijn.', '🐦 Opgezette meeuw'],
        ['De vrachtlijst', 'Alles op de vrachtlijst klopte. Het gewicht niet.', '⚖️ Bascule'],
        ['Loodsman Kees brengt de boot weg', 'Hij loodste de boot langs de rotsen, zoals altijd. Deze keer duurde het een uur langer.', '🧭 Kompas']
      ]],
    ['🐦', 'De vogeltrek',
      'Duizenden trekvogels rusten op het eiland, op weg naar het zuiden. Vogelkundige Dorien telt ze vanaf het klif, en iedereen helpt mee. Niet iedereen kijkt naar de vogels.',
      'De vogels trekken verder naar het zuiden. In het veldboek van Dorien klopt de telling weer.',
      'Op het klif kijkt iedereen omhoog, niet naar elkaar. De verklaringen worden zuiniger: gebruik het potlood, streep vakjes weg die niet kunnen en kijk wat overblijft.',
      'kghhghhh', [
        ['Duizend vleugels', 'Bij zonsopgang zat het klif vol vogels. Eén plek bleef leeg, alsof daar iemand had gelegen.', '🪶 Meeuwenveer'],
        ['Vogelkundige Dorien kijkt', 'Haar kijker stond de hele ochtend op het botenhuis gericht. Daar nestelen geen vogels.', '🔭 Veldkijker'],
        ['Het lege nest', 'Het nest op het klif was leeg, zoals in november hoort. Op een sleutel na.', '🪺 Vogelnest'],
        ['Assistent Jonas zoekt eieren', 'Hij klom het klif af voor meeuweneieren, zegt hij. In november.', '🧗 Klimtouw'],
        ['De postduif', 'Tussen de trekvogels zat één duif. Die vloog niet naar het zuiden, maar naar de wal.', '🕊️ Postduif'],
        ['Visser Bartel voert de meeuwen', 'Elke ochtend gooit hij visafval naar de meeuwen. Vanmorgen gooide hij iets anders in zee.', '🐟 Visemmer'],
        ['Schipbreukeling Lev kent de vogels', 'Hij is matroos, zegt hij. Hij kent elke vogel bij zijn Latijnse naam.', '📚 Vogelboek'],
        ['Eén die niet rust', 'Duizenden vogels sliepen op het eiland. Eén vogelaar liep de hele nacht met een lamp over het strand.', '🥾 Zanderige laarzen']
      ]],
    ['⛈️', 'De winterstorm',
      'De zwaarste storm in twintig jaar. De golven slaan over het klif, en het eiland is drie weken afgesloten van de wal.',
      'De storm gaat liggen en de telegraaf tikt weer. Wat drie weken binnen bleef, blijft niet langer binnen.',
      'Het bord wordt groter en het eiland kleiner. Staat in het rapport dat een ruimte leeg was, dan valt die hele ruimte af voor iedereen.',
      'hhMhMhMM', [
        ['Drie weken binnen', 'Acht mensen, één huis, drie weken. Op dag twaalf zei niemand meer iets.', '🪵 Brandhout'],
        ['De kabel', 'Op de eerste stormdag brak de kabel naar de wal. Een kabel breekt niet zo recht af.', '🔌 Telegraafkabel'],
        ['Huishoudster Martha deelt uit', 'Elke avond acht kommen soep. Er kwamen er negen leeg terug.', '🥣 Soepkom'],
        ['De kelder loopt onder', 'Het water stond tot de knieën in de kelder. Alles dreef, op één kist na.', '⚓ Loden kist'],
        ['Onderwijzeres Wilma geeft les', 'Haar dictee ging over een schip dat zonk. Schipbreukeling Lev verbeterde de naam.', '📝 Dictee'],
        ['Loodsman Kees mist een knoop', 'Aan zijn jas ontbreekt een koperen knoop. Die lag in de lantaarnkamer, sinds de eerste nacht.', '🟡 Koperen knoop'],
        ['Assistent Jonas houdt het licht aan', 'Drie weken hield hij alleen het licht brandend. Hij gebruikte maar de helft van de petroleum.', '🪔 Lampenpit'],
        ['Visser Bartel herinnert zich', 'Zo een storm zag hij één keer eerder, twintig jaar geleden. Toen ging het licht ook uit.', '📰 Oude krant']
      ]],
    ['🌅', 'Het laatste licht',
      'Er komt een nieuwe wachter van de wal. Nog één nacht onder het draaiende licht, met dezelfde gezichten als in de eerste stormnacht.',
      'Van Dam stapt in de bevoorradingsboot, tikt tegen zijn hoed en kijkt niet meer om. Het licht draait weer. Elke schipper ziet het, en jij weet wie het doofde.',
      'De laatste zaken, bijna allemaal op het grote bord. Blijf niet hangen bij wie het lastigst is: zet eerst de anderen neer, dan blijft er voor de laatste vaak maar één vakje over.',
      'hMMMMMMM', [
        ['De nieuwe wachter', 'Hij kwam met de boot en klom meteen naar boven. Hij wist de weg al.', '🧳 Reiskoffer'],
        ['Huishoudster Martha pakt in', 'Twintig jaar kookte ze voor de wachter. In haar koffer zit zijn trouwring.', '💍 Trouwring'],
        ['Telegrafiste Fien seint af', 'Haar laatste bericht naar de wal: alles in orde. Ze seinde het twee keer, de tweede keer in een andere code.', '🔤 Morsecode'],
        ['Schipbreukeling Lev krijgt een naam', 'Na twee maanden zegt hij hoe hij heet. Het is de naam van het schip.', '🏷️ Naambord'],
        ['Vogelkundige Dorien vertrekt', 'Ze telde vierduizend vogels voor het museum. Ze neemt er vierduizend en één mee.', '🗃️ Vogelkist'],
        ['Assistent Jonas wordt geen wachter', 'Drie jaar hielp hij de wachter. Ze kozen een ander, en hij wist het al een maand.', '📜 Benoemingsbrief'],
        ['Onderwijzeres Wilma blijft', 'Iedereen gaat met de boot mee. Zij blijft, voor de school, en de school is al een maand dicht.', '🔔 Schoolbel'],
        ['Het laatste licht', 'Waar het begon, in de lantaarnkamer. Daar eindigt het ook.', '🔆 Fresnellens']
      ]]
  ]);

  const ZAKEN = [...abdij, ...vuurtoren];
  if (typeof window !== 'undefined') window.ZAKEN = ZAKEN;
  if (typeof module !== 'undefined' && module.exports) module.exports = { ZAKEN };
})();
