// Campaign parts for the new worlds of 1.4, in the shape of CAMPAIGN in campaign.js.
// Kept here until the translations exist, so campaign.js and its tests stay as they are.
// Seeds: world base + part * 1000 + 101 + case * 97 (Hacienda 101101.., Opera 111101..), outside every seed in use
// and below the archive (200000+). Proven by bewijs.js: one solution each, meester stepwise without guessing.
// Difficulty per part follows De Skihut: parts 1-6 from makkelijk to moeilijk, parts 7-8 moeilijk and meester.
(() => {
  const D = { k: 'makkelijk', g: 'gemiddeld', h: 'moeilijk', M: 'meester' };
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  // part: [icon, title, intro, outro, briefing, difficulty letters, cases as [title, story, item]]
  const build = (theme, base, parts) => parts.map(([icon, title, intro, outro, briefing, diffs, cases], p) => ({
    key: p === 0 ? theme : `${theme}-${p + 1}`, theme, part: p + 1, icon, title: `Deel ${ROMAN[p]} · ${title}`, intro, outro, briefing,
    cases: cases.map(([t, story, item], i) => ({ title: t, story, item, difficulty: D[diffs[i]], seed: base + (p + 1) * 1000 + 101 + i * 97 }))
  }));

  const hacienda = build('hacienda', 100000, [
    ['🌵', 'Het agavefeest',
      'Hacienda San Isidro, Jalisco, 1952. De agave is binnen en de familie viert feest. Dan ligt Don Rafael in de stokerij, tussen de koperen ketels.',
      'Het feest is stilgevallen. Maar de familie blijft voor het testament.',
      'Een hacienda is groot, maar op een feest staat iedereen bij elkaar. Begin bij wie zegt in welke ruimte hij was; "direct naast" de ketel telt alleen recht ernaast, nooit schuin.',
      'kkkggghh', [
        ['Het agavefeest', 'De oogst was binnen. De patrón kwam niet naar buiten.', '🌵 Agaveblad'],
        ['De koperen ketel', 'De ketel was nog warm. De stokerij zat op slot.', '🔑 Stokerijsleutel'],
        ['Mariachi Rubén zingt', 'Hij zong het lievelingslied van Don Rafael. Niemand klapte.', '🎺 Trompet'],
        ['Vuurwerk boven de patio', 'Iedereen keek omhoog. Bijna iedereen.', '🎆 Vuurpijl'],
        ['Kokkin Lupita telt de borden', 'Ze dekte voor negen. Er aten er acht.', '🍽️ Aardewerken bord'],
        ['De eerste fles', 'De eerste fles van de oogst was open. Niemand had hem opengemaakt.', '🍾 Kurk'],
        ['Doña Inés rouwt', 'Ze droeg al zwart voordat iemand het wist.', '🖤 Zwarte mantilla'],
        ['Middernacht in San Isidro', 'De klok sloeg twaalf. Eén slag te veel.', '🕛 Wandklok']
      ]],
    ['⚗️', 'De stokerij',
      'De politie is nog onderweg uit Guadalajara. In de stokerij zijn de ketels nog warm, en iemand heeft de kraan opengezet.',
      'De stokerij is verzegeld. Morgen leest de notaris het testament voor.',
      'In de stokerij draait alles om de ketels. Een verklaring over twee mensen los je op door eerst één van de twee vast te zetten.',
      'kkggghhh', [
        ['De open kraan', 'Een hele ketel liep leeg op de vloer. Niemand hoorde iets.', '🚰 Koperen kraan'],
        ['Voorman Esteban proeft', 'Hij proefde elke ketel. Eén ketel sloeg hij over.', '🥃 Proefglas'],
        ['Het oogstboek', 'In het boek stonden tien karren. Op het erf stonden er negen.', '📒 Oogstboek'],
        ['Het vuur onder de ketel', 'Het vuur brandde de hele nacht. Iemand had hout bijgelegd.', '🪵 Mesquitehout'],
        ['Neef Tomás uit de stad', 'Hij kwam pas morgen aan, zei hij. Zijn auto stond al op het erf.', '🎩 Stadshoed'],
        ['Twee vaten te veel', 'In de kelder lagen twee vaten zonder merk.', '🛢️ Eiken vat'],
        ['Schilderes Paloma schetst', 'Ze tekende de stokerij om negen uur. Op de tekening brandde licht.', '🖌️ Schets'],
        ['Het geheim van de ketel', 'Wat er in de ketel zat, was geen tequila.', '⚗️ Distilleerkolf']
      ]],
    ['📜', 'Het testament',
      'De familie zit in de salon. Notaris Guzmán opent het testament, en niet iedereen hoort zijn naam.',
      'Het testament is gelezen. De erfgenamen kijken elkaar niet meer aan.',
      'Iedereen wil iets van de erfenis en iedereen praat over iedereen. Wie zegt waar hij níét was, vertelt je ook iets: streep die ruimte meteen weg.',
      'kggghhhh', [
        ['De voorlezing', 'De notaris las drie bladzijden voor. Het testament had er vier.', '📜 Testament'],
        ['Het verzegelde kistje', 'Het zegel was heel. Het kistje was leeg.', '🔏 Lakzegel'],
        ['Notaris Guzmán zweet', 'Hij poetste zijn bril drie keer. Het was niet warm.', '👓 Notarisbril'],
        ['De vergeten erfgenaam', 'In het testament stond een naam die niemand kende.', '🪪 Oud paspoort'],
        ['Neef Tomás rekent', 'Hij had zijn erfdeel al uitgegeven. Vorig jaar.', '🧾 Schuldbekentenis'],
        ['De handtekening', 'Twee handtekeningen van Don Rafael. Eén ervan te mooi.', '🖋️ Vulpen'],
        ['Doña Inés tekent niet', 'Ze weigerde te tekenen. Ze wist waarom.', '💍 Trouwring'],
        ['Het laatste codicil', 'Onder de vloer van de bibliotheek lag nog één brief.', '✉️ Codicil']
      ]],
    ['⛪', 'De kapel',
      'Voor de begrafenis brandt de kapel de hele nacht. Iedereen komt bidden, en één bank blijft leeg.',
      'De kaarsen zijn opgebrand. De familie draagt Don Rafael naar buiten.',
      'In de kapel zit iedereen stil, dus let op wie naast wie zat. Zet eerst de verdachte met de kleinste keus neer; de rest volgt.',
      'kgghghhh', [
        ['De nachtwake', 'Tot middernacht zat de familie samen. Daarna niet meer.', '🕯️ Altaarkaars'],
        ['Zuster Bárbara bidt', 'Ze bad voor iedereen. Eén naam sloeg ze over.', '📿 Rozenkrans'],
        ['De lege bank', 'Acht plaatsen in de voorste bank. Zeven mensen.', '🪑 Kerkbank'],
        ['De klokkentoren', 'Om drie uur luidde de klok. Niemand had het touw aangeraakt.', '🔔 Klokkentouw'],
        ['Kokkin Lupita kookt', 'Ze kookte voor de hele wake. Eén pan bleef onaangeroerd.', '🍲 Pozole'],
        ['Wierook', 'De wierook brandde te vroeg. Iemand was al eerder in de kapel.', '🪔 Wierookvat'],
        ['De biecht', 'Iemand had gebiecht. De zuster zei niet wie.', '🚪 Biechtstoel'],
        ['Het afscheid', 'De kist was nog dicht. Er lag al één bloem op.', '🌹 Rode roos']
      ]],
    ['💀', 'Dag van de Doden',
      'Een jaar later. Goudsbloemen op het altaar, suikerschedels op tafel, en de hele familie is terug op San Isidro.',
      'De kaarsen op het altaar doven. Don Rafael heeft zijn rust, bijna.',
      'Op de Dag van de Doden staat het huis vol mensen. Begin bij wie zegt alleen te zijn geweest: dat ruimt meteen een hele ruimte op.',
      'kgghghhh', [
        ['Het altaar', 'Op het altaar stonden acht foto\'s. Gisteren waren het er zeven.', '🖼️ Fotolijstje'],
        ['Goudsbloemen', 'Een spoor van oranje bloemen liep naar de kelder.', '🌼 Goudsbloem'],
        ['Suikerschedels', 'Op elke schedel een naam. Op één ervan de naam van iemand die nog leefde.', '💀 Suikerschedel'],
        ['Mariachi Rubén speelt voor de doden', 'Hij speelde het lied van Don Rafael. Iemand zong mee die het niet kon kennen.', '🎸 Gitaarsnaar'],
        ['De piñata', 'De piñata was al open voordat de kinderen kwamen.', '🪅 Piñata'],
        ['Schilderes Paloma komt terug', 'Ze schilderde het altaar. Op het doek stond iemand die er niet was.', '🎨 Palet'],
        ['Pan de muerto', 'Kokkin Lupita bakte twaalf broden. Er waren er elf.', '🍞 Pan de muerto'],
        ['De nacht van de geesten', 'Iedereen zag een geest op de patio. Eén geest had schoenen aan.', '👞 Modderschoen']
      ]],
    ['☀️', 'Het droge seizoen',
      'Het regent al maanden niet. De put staat leeg, de agave verdort, en iemand heeft het water verkocht.',
      'Eindelijk regen. Het water is terug, de schuldige ook.',
      'Droogte maakt mensen kort van stof en de verklaringen worden zuiniger. Gebruik het potlood: streep vakjes weg die niet kunnen en kijk wat overblijft.',
      'kghhghhh', [
        ['De lege put', 'De emmer kwam droog boven. Gisteren nog niet.', '🪣 Putemmer'],
        ['Voorman Esteban graaft', 'Hij groef een nieuwe put. Op de verkeerde plek.', '⛏️ Houweel'],
        ['Het waterboek', 'Elke kan water stond in het boek. Behalve de laatste tien.', '📘 Waterboek'],
        ['De verdorde agave', 'Een hele rij agave was dood. Alleen die rij.', '🥀 Verdord blad'],
        ['Kokkin Lupita spaart', 'Ze bewaarde water voor de keuken. Haar kruik was leeg.', '🏺 Waterkruik'],
        ['Neef Tomás verkoopt', 'Hij verkocht water aan de buren. Water van wie?', '💵 Pesobiljet'],
        ['De hangmat', 'In de hangmat lag niemand. Toch schommelde hij.', '🪢 Hangmatkoord'],
        ['De eerste regen', 'Toen de regen kwam, liep iedereen naar buiten. Op één na.', '🌧️ Regenton']
      ]],
    ['🐎', 'De paardenmarkt',
      'Kopers uit drie dorpen op het erf. Paarden, geld en zadels wisselen van eigenaar, en één paard komt niet terug.',
      'De kopers zijn weg en de stal is stil. Het verdwenen paard staat weer in zijn box.',
      'Het bord wordt groter en de verklaringen worden zuiniger. Staat in het rapport dat een ruimte leeg was, dan valt die hele ruimte af voor iedereen.',
      'hhMhMhMM', [
        ['De eerste koper', 'Hij betaalde in goud. Voor een paard dat niet te koop was.', '🪙 Gouden munt'],
        ['Het zwarte paard', 'Zijn box was leeg. Het zadel hing er nog.', '🐎 Zwart paard'],
        ['Voorman Esteban onderhandelt', 'Hij vroeg te weinig. Veel te weinig.', '🤝 Handdruk'],
        ['De hoefsmid', 'Vier hoefijzers besteld. Er lagen er drie.', '🔨 Smidshamer'],
        ['Zuster Bárbara zegent', 'Ze zegende elk paard. Het laatste paard schrok van haar.', '💧 Wijwater'],
        ['Het stalboek', 'Elk paard stond erin. Het verdwenen paard niet meer.', '📖 Stalboek'],
        ['De nachtelijke rit', 'Om twee uur hoorde iedereen hoeven. Niemand ging kijken.', '🌙 Halve maan'],
        ['Het zadel van Don Rafael', 'Zijn zadel hing een jaar aan de muur. Vandaag was het leer warm.', '🏇 Zilveren zadel']
      ]],
    ['🌅', 'Afscheid van San Isidro',
      'De hacienda wordt verkocht. Nog één feest op de patio, met dezelfde gezichten als op de eerste avond.',
      'Van Dam zet zijn hoed op, groet de familie en rijdt met de laatste kar naar het station. San Isidro heeft geen geheimen meer.',
      'De laatste zaken, bijna allemaal op het grote bord. Blijf niet hangen bij wie het lastigst is: zet eerst de anderen neer, dan blijft er voor de laatste vaak maar één vakje over.',
      'hMMMMMMM', [
        ['De koper', 'De koper kwam uit Mexico-Stad. Hij kende de weg naar de kelder.', '📝 Koopakte'],
        ['Het laatste vat', 'Eén vat bleef achter. Er stond een jaartal op: 1952.', '🏷️ Vatlabel'],
        ['Doña Inés pakt in', 'Ze nam alleen een kistje mee. Het was zwaar.', '🧳 Reiskoffer'],
        ['De torenklok blijft', 'De klok van de toren ging niet mee. Iemand wilde dat wel.', '🕰️ Torenklok'],
        ['Mariachi Rubén speelt het laatste lied', 'Het lied van de eerste avond. Nu met een ander couplet.', '🎼 Bladmuziek'],
        ['Het portret van Don Rafael', 'Het portret ging de kist in. Achter de lijst zat een brief.', '💌 Verborgen brief'],
        ['Notaris Guzmán sluit af', 'Hij stempelde de laatste akte. De stempel was nog nat.', '📎 Laatste akte'],
        ['Afscheid van San Isidro', 'Waar het begon, bij de ketels. Daar eindigt het ook.', '🍶 Laatste fles']
      ]]
  ]);

  const opera = build('opera', 110000, [
    ['🎟️', 'De première',
      'Opéra Lumière, Parijs, 1891. Goud, kristal en een uitverkochte zaal. In de pauze ligt directeur Leclerc achter het toneel, onder het touwwerk.',
      'Het doek is gevallen en de zaal is leeg. Maar de voorstelling gaat morgen door.',
      'Een operagebouw is een doolhof van gangen en trappen. Begin bij wie zegt in welke ruimte hij was; "direct naast" de harp telt alleen recht ernaast, nooit schuin.',
      'kkkggghh', [
        ['Het doek gaat op', 'De zaal was uitverkocht. De loge van de directeur bleef leeg.', '🎟️ Toegangskaartje'],
        ['De pauze', 'Twintig minuten pauze. Genoeg tijd voor één ding.', '🥂 Champagneglas'],
        ['Diva Colette zingt', 'Ze haalde de hoge noot. Achter het toneel viel iets.', '💎 Diamanten oorbel'],
        ['Het touwwerk', 'Honderd touwen achter het toneel. Eén was doorgesneden.', '✂️ Schaar'],
        ['Toneelmeester Hugo telt', 'Hij telde de contragewichten. Er hing er één te veel.', '⚖️ Contragewicht'],
        ['Het applaus', 'Tien minuten applaus. Niemand hoorde de klap erachter.', '💐 Bos bloemen'],
        ['Baron Viktor betaalt', 'De baron betaalde de première. Hij bleef niet tot het einde.', '💰 Geldbuidel'],
        ['Na de voorstelling', 'De zaal liep leeg. Achter het doek lag de directeur.', '🎭 Theatermasker']
      ]],
    ['🪢', 'Achter het doek',
      'De voorstelling gaat door, de politie loopt achter het toneel. Touwen, valluiken en contragewichten: hier kent alleen de ploeg de weg.',
      'Het touwwerk is geteld. Morgen staat er een nieuwe aria op het programma.',
      'Achter het doek is alles dichtbij. Een verklaring over twee mensen los je op door eerst één van de twee vast te zetten.',
      'kkggghhh', [
        ['Het valluik', 'Het luik in het toneel stond open. Niemand had het gebruikt.', '🕳️ Valluik'],
        ['Gefluister in de coulisse', 'Iemand fluisterde in de coulisse. Iedereen hoorde het, niemand wist wie.', '🧣 Zijden sjaal'],
        ['Toneelmeester Hugo knoopt', 'Hij legt elke knoop zelf. Deze knoop niet.', '🪢 Scheepsknoop'],
        ['Het decor van de tweede akte', 'Een kasteel van karton. Achter de deur stond iemand echt.', '🏰 Kartonnen kasteel'],
        ['Danseres Ninon wacht', 'Ze wachtte op haar opkomst. Die kwam niet.', '🩰 Spitzen'],
        ['De souffleur', 'Uit het souffleurshokje kwam geen woord. Er zat niemand in.', '📃 Souffleursboek'],
        ['De zandzak', 'Een zandzak viel twee meter naast de tenor.', '🪨 Zandzak'],
        ['Achter het doek', 'Toen het doek opging, stond er iemand te veel op het toneel.', '💡 Voetlicht']
      ]],
    ['🎼', 'De verdwenen partituur',
      'Een uur voor de voorstelling is de nieuwe aria weg. Zonder partituur geen première, en iemand weet dat.',
      'De partituur ligt weer in de orkestbak. Diva Colette zingt, alsof er niets gebeurd is.',
      'Iedereen zoekt de partituur en iedereen wijst naar een ander. Wie zegt waar hij níét was, vertelt je ook iets: streep die ruimte meteen weg.',
      'kggghhhh', [
        ['De lege map', 'De dirigent sloeg de map open. Hij was leeg.', '🎼 Lege map'],
        ['Dirigent Armand zoekt', 'Hij zocht in de orkestbak. Hij wist waar hij moest kijken.', '🪄 Dirigeerstok'],
        ['Drie kopieën', 'Drie kopieën van de aria. Twee gevonden.', '📄 Kopie'],
        ['Kostumière Eloise naait', 'In de zoom van een jurk zat papier.', '🪡 Naald'],
        ['De inktvlek', 'Op iemands vingers zat inkt. Van de componist.', '🫙 Inktpot'],
        ['Recensente Simone weet het al', 'Haar recensie stond al klaar. Over een aria die niemand had gehoord.', '📰 Ochtendkrant'],
        ['De kachel brandt', 'In de directiekamer brandde de kachel. Er lag papier naast.', '🔥 Verbrand papier'],
        ['De aria', 'De aria werd gezongen. Door de verkeerde stem.', '🎶 Aria']
      ]],
    ['🎭', 'Het gemaskerd bal',
      'Het jaarlijkse gemaskerd bal in de foyer. Iedereen draagt een masker, en niemand weet wie naast wie stond.',
      'Om middernacht gaan de maskers af. Niet iedereen lacht.',
      'Met maskers op kent niemand elkaar, maar de plattegrond liegt niet. Zet eerst de verdachte met de kleinste keus neer; de rest volgt.',
      'kgghghhh', [
        ['Maskers op', 'Tweehonderd gasten, tweehonderd maskers. Eén masker te veel.', '🦚 Pauwenveer'],
        ['De wals', 'Het orkest speelde een wals. Eén paar danste niet mee.', '🎻 Viool'],
        ['Baron Viktor herkent niemand', 'Hij kende iedereen in Parijs. Vanavond niemand.', '🧐 Monocle'],
        ['Het rode masker', 'Iedereen droeg wit. Behalve één.', '🪶 Rode veer'],
        ['Danseres Ninon danst met de baron', 'Ze dansten drie dansen. De derde danste ze alleen.', '👠 Balschoen'],
        ['Champagne om middernacht', 'De fles knalde om twaalf uur. De tweede knal niet.', '🍾 Champagnefles'],
        ['De spiegelzaal', 'In de spiegels stond iemand die er niet was.', '🪞 Handspiegel'],
        ['Maskers af', 'Om middernacht gingen de maskers af. Eén gezicht kende niemand.', '🎀 Maskerlint']
      ]],
    ['🕯️', 'De toneelkelder',
      'Onder het toneel ligt een tweede gebouw: gangen, machines en een ondergronds meer. Daar dwaalt iemand rond.',
      'De luiken zijn dicht. Wat beneden lag, is boven gekomen.',
      'In de kelder zie je weinig. Verklaringen over rijen en kolommen lopen dwars door de muren heen; gebruik het potlood.',
      'kgghghhh', [
        ['De trap naar beneden', 'Honderd treden naar de kelder. Op de laatste lag een handschoen.', '🧤 Witte handschoen'],
        ['Het ondergrondse meer', 'Onder het gebouw ligt water. Er lag een bootje dat niemand kende.', '🛶 Roeibootje'],
        ['Toneelmeester Hugo daalt af', 'Hij ging met een lantaarn naar beneden. Hij kwam zonder terug.', '🏮 Lantaarn'],
        ['Het spook van de opera', 'Iedereen sprak over een spook. Het spook had natte voeten.', '🧥 Natte cape'],
        ['Tenor Matteo oefent', 'Hij oefende beneden, waar niemand hem hoorde. Bijna niemand.', '🎵 Stemvork'],
        ['De machinekamer', 'Het rad dat het decor draait, stond stil. Er zat iets tussen.', '⚙️ Tandwiel'],
        ['Brieven van het spook', 'Elke week een brief in rode inkt. Deze week twee.', '✉️ Rode brief'],
        ['Loge vijf', 'Loge vijf werd nooit verkocht. Toch zat er vanavond iemand.', '🗝️ Logesleutel']
      ]],
    ['🎻', 'Generale repetitie',
      'De nieuwe opera moet perfect zijn. Generale repetitie tot diep in de nacht, en één rekwisiet is echt.',
      'De repetitie is voorbij. Morgen gaat het gezelschap op tournee.',
      'Op een repetitie staat iedereen steeds ergens anders en de verklaringen worden zuiniger. Streep weg wat niet kan en kijk wat overblijft.',
      'kghhghhh', [
        ['Nog één keer', 'De dirigent liet alles opnieuw spelen. Eén musicus speelde iets anders.', '🥁 Pauk'],
        ['Het echte zwaard', 'Alle zwaarden waren van hout. Op één na.', '🗡️ Toneelzwaard'],
        ['Kostumière Eloise past', 'Elk kostuum paste. Eén was vermaakt voor iemand anders.', '📏 Meetlint'],
        ['De gifbeker', 'In de derde akte drinkt de koning gif. Vanavond smaakte het bitter.', '🍷 Gouden beker'],
        ['Recensente Simone kijkt mee', 'Ze mocht er niet zijn. Ze zat op de derde rij.', '📝 Notitieboekje'],
        ['De rekwisietenkamer', 'Elk stuk had een nummer. Nummer veertien was weg.', '🏷️ Nummerlabel'],
        ['Diva Colette weigert', 'Ze weigerde op te komen. Ze wist wat er boven hing.', '👑 Toneelkroon'],
        ['De doorloop', 'Van begin tot eind, zonder te stoppen. Eén deur bleef dicht.', '🚪 Kleedkamerdeur']
      ]],
    ['🚂', 'De tournee',
      'Wenen, Milaan, Londen. Het gezelschap reist met het hele decor, en de moeilijkheden reizen mee.',
      'Na de laatste stad gaat het decor terug naar Parijs. Het gezelschap ook, op één na.',
      'Het bord wordt groter en de verklaringen worden zuiniger. Staat in het rapport dat een ruimte leeg was, dan valt die hele ruimte af voor iedereen.',
      'hhMhMhMM', [
        ['Wenen', 'In Wenen klapte het publiek staand. Op één stoel na.', '🍰 Sachertaart'],
        ['De verloren koffer', 'Twaalf koffers vertrokken uit Parijs. Elf kwamen aan.', '🧳 Decorkoffer'],
        ['Milaan', 'In de Scala zong Tenor Matteo thuis. Iemand wilde dat niet.', '🎫 Scala-kaartje'],
        ['Baron Viktor reist mee', 'Hij betaalde de reis. Hij zat in een ander rijtuig dan zijn kaartje zei.', '🎩 Hoge hoed'],
        ['Londen in de mist', 'Door de mist zag niemand de overkant van het toneel.', '🫖 Theepot'],
        ['Kostumière Eloise pakt in', 'Tweehonderd kostuums in vijftig manden. Eén mand was te zwaar.', '🧺 Kostuummand'],
        ['De nachttrein', 'De trein reed door de nacht. Bij het ontbijt ontbrak er iemand.', '🛏️ Slaapcoupé'],
        ['Terug naar Parijs', 'Op het perron wachtte de politie. Ze wisten welke trein.', '🚉 Perronkaartje']
      ]],
    ['🌹', 'Laatste voorstelling',
      'De Opéra Lumière gaat dicht voor een verbouwing. Nog één keer gaat het doek op, voor dezelfde zaal als op de première.',
      'Van Dam staat als laatste op uit de zaal, klapt één keer en loopt de trap af, de Parijse nacht in.',
      'De laatste zaken, bijna allemaal op het grote bord. Blijf niet hangen bij wie het lastigst is: zet eerst de anderen neer, dan blijft er voor de laatste vaak maar één vakje over.',
      'hMMMMMMM', [
        ['Dezelfde zaal', 'Iedereen zat op dezelfde stoel als op de première. Op één na.', '💺 Fluwelen stoel'],
        ['Dirigent Armand neemt afscheid', 'Dertig jaar dirigeerde hij hier. Vanavond keek hij niet naar het orkest.', '🎖️ Erepenning'],
        ['Het laatste boeket', 'Op het toneel lagen veertig boeketten. Eén zonder kaartje.', '💐 Boeket zonder kaartje'],
        ['De kroonluchter', 'De grote kroonluchter hing scheef. Iemand was boven geweest.', '✨ Kristallen druppel'],
        ['Danseres Ninon danst solo', 'Haar eerste solo. Iedereen keek naar haar, behalve één.', '🌸 Haarbloem'],
        ['Recensente Simone schrijft', 'Haar laatste recensie. Over de voorstelling, en over de dader.', '✒️ Kroontjespen'],
        ['Toneelmeester Hugo laat zakken', 'Het doek zakte voor de laatste keer. Eén touw hield hij vast.', '🧰 Gereedschapskist'],
        ['Laatste voorstelling', 'Waar het begon, achter het doek. Daar eindigt het ook.', '🎟️ Laatste kaartje']
      ]]
  ]);

  const ZAKEN = [...hacienda, ...opera];
  if (typeof window !== 'undefined') window.ZAKEN = ZAKEN;
  if (typeof module !== 'undefined' && module.exports) module.exports = { ZAKEN };
})();
