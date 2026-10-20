// Campaign parts of worlds 13 and 14 (Filmstudio, Karavaan), in the shape of CAMPAIGN in campaign.js, until their translations exist.
// Seeds: world base + part * 1000 + 101 + case * 97 (Filmstudio 141101.., Karavaan 151101..), outside every seed in use
// and below the archive (200000+). Proven by bewijs.js pointed at this file: one solution each, meester stepwise without guessing.
// Difficulty per part follows the other worlds: parts 1-6 from makkelijk to moeilijk, parts 7-8 moeilijk and meester.
(() => {
  const D = { k: 'makkelijk', g: 'gemiddeld', h: 'moeilijk', M: 'meester' };
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  // part: [icon, title, intro, outro, briefing, difficulty letters, cases as [title, story, item]]
  const build = (theme, base, parts) => parts.map(([icon, title, intro, outro, briefing, diffs, cases], p) => ({
    key: p === 0 ? theme : `${theme}-${p + 1}`, theme, part: p + 1, icon, title: `Deel ${ROMAN[p]} · ${title}`, intro, outro, briefing,
    cases: cases.map(([t, story, item], i) => ({ title: t, story, item, difficulty: D[diffs[i]], seed: base + (p + 1) * 1000 + 101 + i * 97 }))
  }));

  const filmstudio = build('filmstudio', 140000, [
    ['🎬', 'De laatste opname',
      'Paradise Pictures, Hollywood, 1931. De studio draait zijn eerste geluidsfilm. Na de laatste opname van de dag ligt studiobaas Samuel Gold in de projectiezaal, terwijl de film nog loopt.',
      'De projector staat stil en de studiobaas is dood. De film is nog lang niet af.',
      'Een studio is één grote hal met veel deuren. Begin bij wie zegt in welke ruimte hij was; "direct naast" de schijnwerper telt alleen recht ernaast, nooit schuin.',
      'kkkggghh', [
        ['De laatste opname', 'Opname zevenenveertig was eindelijk goed. Het was ook de laatste.', '🎬 Klapbord'],
        ['De projectiezaal', 'Toen ze de studiobaas vonden, liep de film nog. Hij had het einde niet gezien.', '📽️ Projector'],
        ['Regisseur Baxter roept stop', 'Hij riep de hele dag stop. Om zes uur riep hij niets.', '📣 Megafoon'],
        ['De schijnwerper', 'Om zes uur gingen alle lampen uit. Eén lamp was een uur later nog warm.', '💡 Gloeilamp'],
        ['Filmster Vivian wacht', 'Ze wachtte op haar laatste scène, zei ze. Haar make-up was er al af.', '💄 Lippenstift'],
        ['De filmspoel', 'In de projector zat spoel drie. Spoel twee lag op de vloer.', '🎞️ Filmspoel'],
        ['Cameraman Lenny draait door', 'Zijn camera liep nog een minuut na de laatste opname. Niemand had erom gevraagd.', '🎥 Filmcamera'],
        ['Na zessen', 'Om zes uur ging de poort dicht. Om zeven uur ging hij nog één keer open.', '🔑 Poortsleutel']
      ]],
    ['🎞️', 'De verdwenen filmrol',
      'De enige kopie van de nieuwe film is weg. Het blik stond in het archief, achter slot. De première is over een week.',
      'De filmrol ligt weer in het blik. Eén scène is eruit geknipt, en jij weet door wie.',
      'In een studio wijst iedereen naar iemand anders. Een verklaring over twee mensen los je op door eerst één van de twee vast te zetten.',
      'kkggghhh', [
        ['Het lege blik', 'Op het blik staat de titel van de film. Erin zit niets.', '🗃️ Filmblik'],
        ['Agent Sid belt', 'Hij belde om over de film te praten. Niemand had hem nog verteld dat die weg was.', '☎️ Telefoon'],
        ['Het archief', 'Het archief gaat open met één sleutel. Die hangt in de directiekamer, aan een spijker.', '🗝️ Archiefsleutel'],
        ['Schrijfster Peggy herschrijft', 'Ze herschreef het einde voor de vierde keer. Nu zat er een diefstal in.', '⌨️ Typemachine'],
        ['De montagekamer', 'Op de vloer lagen snippers film. Allemaal uit dezelfde scène.', '✂️ Montageschaar'],
        ['Starlet Joy ziet iets', 'Ze zag iemand lopen met een blik onder de arm. Ze dacht dat het koekjes waren.', '🍪 Koekblik'],
        ['De nachtwaker', 'De nachtwaker liep elk uur een ronde. Om drie uur sloeg hij er één over.', '🔦 Zaklamp'],
        ['Nog een week', 'De affiches hangen al in de hele stad. De film ligt nog nergens.', '🖼️ Filmaffiche']
      ]],
    ['🤸', 'De stuntscène',
      'Een sprong van het dak van de saloon op de buitenset, honderd keer geoefend. Vandaag ging het mis. Stuntman Hank zweert dat iemand aan de mat heeft gezeten.',
      'De mat ligt weer op zijn plek en Stuntman Hank loopt alweer. De volgende sprong gaat goed.',
      'Bij een stunt kijkt iedereen omhoog, niet naar elkaar. Wie zegt waar hij níét was, vertelt je ook iets: streep die ruimte meteen weg.',
      'kggghhhh', [
        ['Honderd keer geoefend', 'Honderd sprongen, honderd keer goed. De honderdeerste niet.', '🪜 Ladder'],
        ['Stuntman Hank valt', 'Hij sprong van zes meter hoog. De mat lag een meter verderop.', '🛏️ Valmat'],
        ['Het dak van de saloon', 'Het dak van de saloon is van karton. Eén plank was van hout.', '🪵 Plank'],
        ['Regisseur Baxter wil het nog eens', 'Hij liet de sprong elf keer overdoen. Pas bij de twaalfde keek hij weg.', '⏱️ Stopwatch'],
        ['Het paard', 'Het paard schrok van een knal. In het script stond geen schot.', '🐎 Paard'],
        ['Grimeuse Rita plakt een snor', 'Ze plakte een snor op een tweede stuntman. Er was maar één stuntman.', '🥸 Plaksnor'],
        ['Het touw', 'Het touw kon tweehonderd kilo dragen. Het knapte onder zeventig.', '🪢 Touw'],
        ['Cameraman Lenny filmt alles', 'Hij filmde de sprong van twee kanten. Op de tweede rol staat iemand achter de schoorsteen.', '🎞️ Tweede rol']
      ]],
    ['🎙️', 'De geluidsfilm',
      'De eerste film met geluid. De camera staat in een geluiddichte kast en de microfoons hangen verstopt in bloemstukken. Ze horen meer dan de bedoeling was.',
      'De opnames zijn gemonteerd en de geluidsstudio is stil. Het gesprek op de laatste plaat is geen geheim meer.',
      'Op de geluidsset mag niemand een woord zeggen, dus let op wie direct naast wie stond. Zet eerst de verdachte met de kleinste keus neer; de rest volgt.',
      'kgghghhh', [
        ['Stilte op de set', 'Boven de deur brandt een rood lampje: stilte. Achter de deur werd gefluisterd.', '🔴 Rood lampje'],
        ['De microfoon in de bloemen', 'In het bloemstuk zat een microfoon. Niemand van het geluid had hem daar gehangen.', '💐 Bloemstuk'],
        ['Filmster Vivian krijgt een stem', 'In stomme films was ze een ster. In de geluidsfilm zingt iemand anders voor haar.', '🎵 Bladmuziek'],
        ['De ijskast', 'De camera staat in een kast die ze de ijskast noemen. Die middag stonden er twee mensen in.', '🧊 IJskast'],
        ['Agent Sid fluistert', 'Hij fluisterde een bod in het oor van de ster. De microfoon fluisterde mee.', '🎧 Koptelefoon'],
        ['De wasplaat', 'Het geluid staat op een wasplaat, gelijk met de film. Eén plaat liep drie seconden achter.', '💿 Wasplaat'],
        ['Schrijfster Peggy luistert terug', 'Ze schreef elke zin zelf. Eén zin op de opname kende ze niet.', '📝 Script'],
        ['Wat de microfoon hoorde', 'Op de opname hoor je de scène. En daarachter een deur die dichtgaat.', '🔊 Luidspreker']
      ]],
    ['⭐', 'De auditie',
      'Honderd kandidaten voor één rol, in een rij tot aan de poort. Elk krijgt drie minuten voor de camera. Eén van hen komt niet terug van de proefopname.',
      'De rol is vergeven en de rij is naar huis. Eén proefopname wordt nooit vertoond.',
      'Bij een auditie staat iedereen in de rij, maar niet iedereen in dezelfde ruimte. Begin bij wie zegt alleen te zijn geweest: dat ruimt meteen een hele ruimte op.',
      'kgghghhh', [
        ['Honderd kandidaten', 'Honderd namen op de lijst. Aan het eind van de dag nog negenennegentig.', '📋 Kandidatenlijst'],
        ['Starlet Joy kijkt mee', 'Vorig jaar stond zij nog in die rij. Nu kijkt ze wie er achter haar aan komt.', '🎀 Haarstrik'],
        ['De proefopname', 'Drie minuten voor de camera. De film duurt vier minuten.', '🎞️ Proefopname'],
        ['Grimeuse Rita maakt op', 'Ze maakte honderd gezichten op. Eén gezicht kende ze al.', '🖌️ Poederkwast'],
        ['Agent Sid tekent', 'Hij liet een kandidaat tekenen voor de auditie begon. Die kandidaat kwam niet opdagen.', '🖋️ Vulpen'],
        ['Nummer zeventien', 'Elke kandidaat kreeg een nummer op zijn borst. Nummer zeventien liep twee keer langs.', '🔢 Nummerbord'],
        ['Filmster Vivian blijft kijken', 'Ze kwam even kijken wie haar zou opvolgen. Ze bleef tot het donker was.', '🧣 Bontkraag'],
        ['Eén jas aan de kapstok', 'Om vijf uur hing er nog één jas aan de kapstok. Niemand kwam hem halen.', '🧥 Regenjas']
      ]],
    ['🔥', 'De brand in het archief',
      'Oude films zijn van nitraat, en nitraat brandt sneller dan papier. Midden in de nacht slaan de vlammen uit het archief. Iemand wist hoe snel het zou gaan.',
      'Het vuur is uit en het archief is zwart. Een ongeluk was het niet.',
      'Na een brand weet niemand meer precies waar hij stond. Gebruik het potlood: streep vakjes weg die niet kunnen en kijk wat overblijft.',
      'kghhghhh', [
        ['Nitraat', 'Op elke doos staat: niet roken. Op de vloer lag een peuk.', '🚭 Rookverbod'],
        ['De brandweer', 'De brandweer was er in tien minuten. Het archief brandde in vijf.', '🚒 Brandweerwagen'],
        ['Cameraman Lenny redt een doos', 'Hij rende het vuur in voor één doos. Er zat zijn eigen werk in.', '📦 Filmdoos'],
        ['De brandbel', 'De bel ging om twee uur. Om half twee rook de nachtwaker al iets.', '🔔 Brandbel'],
        ['Schrijfster Peggy werkte laat', 'Ze werkte tot middernacht aan het script. In het archief, zei ze eerst.', '🗒️ Kladblok'],
        ['Stuntman Hank en het vuur', 'Voor de camera loopt hij dwars door vuur. Vannacht liep hij er ver omheen.', '🧯 Brandblusser'],
        ['De lijst van het archief', 'Volgens de lijst stonden er driehonderd blikken. In de as lagen er tweehonderd.', '📒 Archiefboek'],
        ['Regisseur Baxter kijkt toe', 'Al zijn oude films gingen in vlammen op. Hij leek opgelucht.', '👓 Ronde bril']
      ]],
    ['🌵', 'Op locatie',
      'Een western in de woestijn, een dag rijden van de studio. Tien wagens, twintig paarden en een stadje van karton onder de zon. Er is één watervat te weinig.',
      'De wagens rijden terug naar Hollywood. Het watervat is gevonden, half vol en ver van het kamp.',
      'Het bord wordt groter en de verklaringen worden zuiniger. Staat in het rapport dat een ruimte leeg was, dan valt die hele ruimte af voor iedereen.',
      'hhMhMhMM', [
        ['Tien wagens', 'Tien wagens reden de woestijn in. Er gingen negen watervaten mee.', '🛢️ Watervat'],
        ['Stuntman Hank rijdt', 'Hij gooide de postkoets twee keer om. Eén keer stond in het script.', '🐎 Postkoets'],
        ['De middagzon', 'Om twaalf uur stond de zon recht boven de set. Toch viel er één lange schaduw.', '☀️ Middagzon'],
        ['Filmster Vivian in het zand', 'Ze weigerde de woestijn in te gaan. Toch zat er zand in haar laarzen.', '👢 Rijlaars'],
        ['Het kampvuur', 'Rond het vuur zong de hele ploeg. Bij het refrein ontbrak één stem.', '🪕 Banjo'],
        ['Grimeuse Rita poedert', 'Ze poederde elke ochtend tien gezichten. Op één gezicht zat al poeder, van gisteravond.', '🪞 Handspiegel'],
        ['De waterwagen', 'De waterwagen stond de hele nacht bij het kamp. Bij zonsopgang stond hij een kilometer verderop.', '🚚 Waterwagen'],
        ['Agent Sid seint de studio', 'Er was geen telefoon binnen honderd mijl. Toch wist de studio het binnen een uur.', '✉️ Telegram']
      ]],
    ['🏆', 'Het grote gala',
      'De film is af en vanavond is de première. Op het gala in de studiohal gaan de lampen nog één keer aan, met dezelfde gezichten als op de avond van de laatste opname.',
      'Van Dam zet zijn hoed op, knikt naar de lege regiestoel en loopt door de poort de nacht van Hollywood in. Het einde klopt eindelijk.',
      'De laatste zaken, bijna allemaal op het grote bord. Blijf niet hangen bij wie het lastigst is: zet eerst de anderen neer, dan blijft er voor de laatste vaak maar één vakje over.',
      'hMMMMMMM', [
        ['De rode loper', 'Duizend mensen langs de rode loper. Eén van hen liep mee naar binnen.', '🎟️ Premièrekaart'],
        ['Filmster Vivian schittert', 'Iedereen keek naar haar jurk. Niemand keek naar haar handen.', '💎 Broche'],
        ['Schrijfster Peggy ziet haar einde', 'Ze schreef het einde zeven keer. Op het doek zag ze een achtste.', '📜 Slotscène'],
        ['Starlet Joy wordt ontdekt', 'Iedereen wilde met haar op de foto. Eén fotograaf wilde alleen haar tasje.', '👛 Avondtasje'],
        ['Regisseur Baxter bedankt', 'Hij bedankte de hele ploeg bij naam. Eén naam sprak hij uit als een vraag.', '🎙️ Microfoon'],
        ['Agent Sid wil meer', 'Hij kreeg tien procent van alles. Vanavond wilde hij de rest.', '💵 Dollarbiljet'],
        ['Cameraman Lenny draait af', 'Hij draaide de film zelf af in de cabine. Er zat één rol meer in dan er gemonteerd was.', '📽️ Filmprojector'],
        ['Het grote gala', 'Waar het begon, in de projectiezaal. Daar eindigt het ook.', '🎞️ Laatste spoel']
      ]]
  ]);

  const karavaan = build('karavaan', 150000, [
    ['🐫', 'De poort gaat dicht',
      'Karavanserai Al-Nour, een oase op de oude specerijenroute. De karavaan rust één nacht binnen de muren. Bij zonsopgang ligt karavaanleider Idris bij de kamelen, en de poort is de hele nacht dicht geweest.',
      'De karavaanleider is dood en de poort blijft dicht. Niemand vertrekt voordat het verhaal klopt.',
      'Een karavanserai is één binnenplaats met veel deuren. Begin bij wie zegt in welke ruimte hij was; "direct naast" de waterkruik telt alleen recht ernaast, nooit schuin.',
      'kkkggghh', [
        ['De poort gaat dicht', 'Bij zonsondergang ging de poort dicht. Bij zonsopgang was niemand vertrokken, en toch was er één reiziger minder.', '🔒 Poortslot'],
        ['Twaalf kamelen', 'Twaalf kamelen in de stal. Geen van hen maakte die nacht geluid.', '🐪 Kameel'],
        ['Bewaker Karim houdt de wacht', 'Hij zat de hele nacht bij de poort. De sleutel hing de hele nacht aan zijn riem, zegt hij.', '🗝️ Sleutelbos'],
        ['De waterkruik', 'Om tien uur was de kruik bij de put vol. Om middernacht was hij leeg.', '🏺 Waterkruik'],
        ['Koopvrouw Layla weegt', 'Ze woog elke avond haar saffraan. Gisteravond woog ze iets anders.', '⚖️ Koperen weegschaal'],
        ['Het kameelzadel', 'Het zadel van de karavaanleider lag klaar voor vertrek. Hij wilde weg voordat de poort openging.', '🪢 Zadelriem'],
        ['Dichteres Samira schrijft', 'Ze schreef die avond een gedicht over de karavaanleider. Het was een afscheid.', '✒️ Rietpen'],
        ['Voor zonsopgang', 'Om vier uur kraaide de haan. Om drie uur liep er al iemand over het dakterras.', '🐓 Haan']
      ]],
    ['🌸', 'De verdwenen saffraan',
      'Koopvrouw Layla reist met tien zakken saffraan, genoeg voor een huis in de stad. Bij het tellen zijn het er negen. De poort is nog steeds dicht.',
      'De tiende zak ligt weer bij de andere negen. Hij is een handvol lichter.',
      'Binnen de muren praat iedereen over iedereen. Een verklaring over twee mensen los je op door eerst één van de twee vast te zetten.',
      'kkggghhh', [
        ['Tien zakken', 'Tien zakken bij aankomst. Negen bij het ontbijt.', '🌸 Saffraanzak'],
        ['Gids Tariq laadt af', 'Hij laadde de zakken zelf van de kamelen. Hij weet nog welke kameel er één te veel droeg.', '🧭 Kompas'],
        ['De voorraadkamer', 'De voorraadkamer gaat op slot. Het slot zit aan de binnenkant.', '🔐 Hangslot'],
        ['Tapijthandelaar Yusuf rolt op', 'Hij rolde die ochtend al zijn tapijten op. Eén tapijt was zwaarder dan gisteren.', '🧶 Opgerold tapijt'],
        ['Rode draadjes', 'Saffraan is niet meer dan rode draadjes, licht als lucht. Op de keukenvloer lag er één.', '🧵 Saffraandraad'],
        ['Reizigster Beatrix noteert', 'Ze schrijft alles op wat ze ziet. Over die nacht staat er niets.', '📔 Reisboek'],
        ['Negen zakken', 'Negen zakken, alle even zwaar. Eén ervan was voor de helft zand.', '⏳ Woestijnzand'],
        ['Theeschenker Hamid hoort het', 'Hij hoorde iemand over saffraan praten. Een uur voordat die weg was.', '🍯 Suikerpot']
      ]],
    ['🍵', 'Het theehuis',
      'Elke avond zit de hele karavaan in het theehuis bij elkaar. Theeschenker Hamid schenkt, en hoort alles. Eén gesprek hoorde niemand.',
      'Het theehuis is leeg en de glazen staan omgekeerd op het blad. Het gesprek dat niemand hoorde, ken jij nu.',
      'In het theehuis kijkt iedereen naar de pot, niet naar elkaar. Wie zegt waar hij níét was, vertelt je ook iets: streep die ruimte meteen weg.',
      'kggghhhh', [
        ['Drie glazen', 'In het theehuis drinkt iedereen drie glazen. Eén gast liet zijn derde staan.', '🍵 Theeglas'],
        ['Theeschenker Hamid schenkt', 'Hij schenkt van hoog, zodat de thee schuimt. Vanavond trilde zijn hand.', '🫖 Koperen theepot'],
        ['Het lege kussen', 'Rond de lage tafel lagen acht kussens. Op één ervan had niemand gezeten.', '🛋️ Zitkussen'],
        ['Sterrenkijker Zahra luistert', 'Ze zei dat ze naar de sterren keek. Ze zat met haar rug naar het raam.', '🔭 Astrolabium'],
        ['Verse munt', 'In elk glas lag verse munt. In één glas lag gedroogde.', '🌿 Muntblad'],
        ['Bewaker Karim komt binnen', 'Hij haalt elke avond om tien uur een glas thee. Gisteren kwam hij om negen.', '⌛ Zandloper'],
        ['Het gordijn', 'Achter het gordijn van het theehuis zit een tweede deur. De theeschenker zegt dat die nooit opengaat.', '🪟 Gordijn'],
        ['Koopvrouw Layla onderhandelt', 'Ze praatte een uur met de gids over de prijs van de reis. Om elf uur was de prijs ineens hoger.', '💰 Reisgeld']
      ]],
    ['🧺', 'De bazaar',
      'Marktdag in de oase. Kooplieden uit drie dorpen spreiden hun waren uit over de binnenplaats. Duizend stemmen, en één ervan liegt.',
      'De kramen worden afgebroken en de binnenplaats is weer stil. De stem die loog, is gevonden.',
      'Op marktdag staat iedereen schouder aan schouder, dus let op wie direct naast wie stond. Zet eerst de verdachte met de kleinste keus neer; de rest volgt.',
      'kgghghhh', [
        ['Marktdag', 'Duizend mensen op de bazaar. Eén van hen kocht niets en bleef de hele dag.', '🪙 Koperen munt'],
        ['Tapijthandelaar Yusuf verkoopt', 'Hij verkocht vandaag zeven tapijten. Hij had er zes bij zich.', '🧶 Tapijt'],
        ['De specerijenmand', 'Kaneel, kardemom en komijn. Eén mand rook nergens naar.', '🧺 Specerijenmand'],
        ['Reizigster Beatrix koopt', 'Ze kocht een tapijt dat ze niet kon dragen. Ze vroeg niemand om hulp.', '🧳 Reiskoffer'],
        ['Het valse gewicht', 'Alle gewichten op de markt zijn gestempeld. Eén gewicht had geen stempel.', '⚖️ Vals gewicht'],
        ['Gids Tariq ruilt', 'Hij ruilde zijn oude kameel tegen een jonge. De oude kende de weg terug.', '🐪 Oude kameel'],
        ['De waterverkoper', 'Op de bazaar verkocht iemand water uit de put. De put is van iedereen.', '🫗 Waterbeker'],
        ['Dichteres Samira draagt voor', 'Ze droeg een gedicht voor over verraad. Iedereen keek naar dezelfde man.', '📖 Dichtbundel']
      ]],
    ['🌌', 'De nacht van de sterren',
      'Boven op het dakterras leest Sterrenkijker Zahra de weg voor de volgende tocht. De nacht is helder en de karavanserai slaapt. Ze ziet een licht dat er niet hoort.',
      'Het licht was een lantaarn, en de lantaarn had een eigenaar. De route ligt vast.',
      'In het donker op het dak ziet iedereen alleen zichzelf. Begin bij wie zegt alleen te zijn geweest: dat ruimt meteen een hele ruimte op.',
      'kgghghhh', [
        ['Een licht in de woestijn', 'Waar geen dorp is, brandde een licht. Twee keer aan, twee keer uit.', '🏮 Lantaarn'],
        ['Sterrenkijker Zahra rekent', 'Ze mat de hoogte van de Poolster. De ster stond goed, haar kaart niet.', '🗺️ Sterrenkaart'],
        ['Het dakterras', 'Op het dak sliepen vier reizigers onder de sterren. Er lagen vijf slaapmatten.', '🛌 Slaapmat'],
        ['Bewaker Karim ziet het ook', 'Vanaf de poort zag hij hetzelfde licht. Hij meldde het pas de volgende middag.', '🪔 Wachtlamp'],
        ['Een vallende ster', 'Om middernacht viel er een ster. Iedereen deed een wens, op één na.', '🌠 Vallende ster'],
        ['Dichteres Samira telt sterren', 'Ze schreef een gedicht over de sterren boven de woestijn. Ze telde er één te veel.', '📜 Gedicht'],
        ['Theeschenker Hamid brengt thee', 'Om twee uur bracht hij thee naar het dak. Er stonden al twee glazen.', '🍵 Twee glazen'],
        ['Voor de dageraad', 'De sterren verbleekten één voor één. Het licht in de woestijn ging als laatste uit.', '🌄 Dageraad']
      ]],
    ['♨️', 'Het badhuis',
      'Het badhuis is warm en vol damp. Reizigers wassen er het zand van de tocht af, en niemand ziet verder dan zijn hand. Bijna niemand.',
      'De damp is opgetrokken en de stenen koelen af. Wie zich erin verstopte, staat nu in het volle licht.',
      'Damp maakt getuigen onzeker, de plattegrond niet. Gebruik het potlood: streep vakjes weg die niet kunnen en kijk wat overblijft.',
      'kghhghhh', [
        ['Warme stenen', 'Het vuur onder de stenen brandt dag en nacht. Vannacht ging het een uur uit.', '🪨 Hete steen'],
        ['In de damp', 'Iedereen in het badhuis zag alleen damp. Eén gast zag een gezicht.', '🌫️ Damp'],
        ['Reizigster Beatrix wast het zand af', 'Ze bleef een uur in het badhuis. Haar haar was droog.', '🧼 Zeep'],
        ['Acht paar slippers', 'Bij de deur stonden acht paar slippers. Er kwamen negen mensen naar buiten.', '🩴 Badslipper'],
        ['Tapijthandelaar Yusuf zweet', 'Hij zei dat hij zweette van de warmte. Hij was nog niet binnen geweest.', '💦 Zweetdoek'],
        ['De waterput', 'Het badhuis krijgt zijn water uit de put. Vannacht kwam het troebel boven.', '🪣 Putemmer'],
        ['Gids Tariq baadt', 'Voor een tocht baadt hij nooit, zegt hij. Vannacht wel.', '🌹 Rozenwater'],
        ['Koopvrouw Layla mist een ring', 'Haar ring lag op de bodem van het bad. Ze doet hem nooit af.', '💍 Gouden ring']
      ]],
    ['🏜️', 'De lange tocht',
      'De karavaan trekt twintig dagen door de woestijn, van put naar put. Elke avond telt Gids Tariq de kamelen. Niet elke avond komt hij op hetzelfde getal uit.',
      'Na twintig dagen bereikt de karavaan de kust. De gids telt nog één keer, en het getal klopt.',
      'Het bord wordt groter en de verklaringen worden zuiniger. Staat in het rapport dat een ruimte leeg was, dan valt die hele ruimte af voor iedereen.',
      'hhMhMhMM', [
        ['Twintig dagen', 'Water voor twintig dagen. Op dag twaalf was het op.', '💧 Waterzak'],
        ['Gids Tariq telt de kamelen', 'Twaalf kamelen bij vertrek, elf bij de eerste put. Bij de tweede put weer twaalf.', '🐪 Lastkameel'],
        ['Het spoor', 'De gids leest elk spoor in het zand. Eén spoor liep achteruit.', '👣 Spoor'],
        ['Sterrenkijker Zahra wijst de weg', 'Elke nacht wees ze naar het zuiden. In de zesde nacht een beetje meer naar het oosten.', '⭐ Leidster'],
        ['Bewaker Karim reist mee', 'Twintig jaar kwam hij niet buiten de muren. Deze keer wilde hij per se mee.', '⛺ Reistent'],
        ['De droge put', 'Op de kaart stond water. Iemand had de put dichtgegooid.', '🕳️ Droge put'],
        ['Theeschenker Hamid zet thee', 'Elke avond zette hij thee van het laatste water. Elke avond bleef er water over.', '🔥 Kampvuur'],
        ['De zee', 'Na twintig dagen rook de karavaan zout. Eén kameel liep de andere kant op.', '🌊 Zeewind']
      ]],
    ['🌟', 'Afscheid van de oase',
      'De karavaan trekt verder en de karavanserai blijft achter. Nog één avond op het dakterras onder de sterren, met dezelfde gezichten als op de nacht dat de poort dichtging.',
      'Van Dam schudt het zand uit zijn jas, groet de bewaker en loopt bij zonsopgang met de karavaan door de poort. Achter de poort blijft één geheim minder achter.',
      'De laatste zaken, bijna allemaal op het grote bord. Blijf niet hangen bij wie het lastigst is: zet eerst de anderen neer, dan blijft er voor de laatste vaak maar één vakje over.',
      'hMMMMMMM', [
        ['De laatste avond', 'Iedereen zat op het dakterras. Beneden in de stal brandde nog een kaars.', '🕯️ Kaarslicht'],
        ['Dichteres Samira neemt afscheid', 'In haar laatste gedicht staat geen naam. Iedereen wist toch wie ze bedoelde.', '📓 Versboek'],
        ['Koopvrouw Layla rekent af', 'Ze betaalde haar plek in de karavaan. Met saffraan uit de tiende zak.', '👝 Geldbuidel'],
        ['Tapijthandelaar Yusuf vergeet iets', 'Hij liet één tapijt achter, opgerold in de gastenkamer. Hij laat nooit iets achter.', '🧶 Laatste tapijt'],
        ['Reizigster Beatrix sluit haar boek', 'Haar boek over de reis is af. Het laatste hoofdstuk heeft nog geen titel.', '📕 Reisverhaal'],
        ['Bewaker Karim opent de poort', 'Twintig jaar opende hij de poort bij zonsopgang. Vandaag deed hij het een uur eerder.', '🔑 Grote sleutel'],
        ['Het laatste glas', 'Theeschenker Hamid schonk nog één keer voor iedereen in. Hij schonk één glas te veel.', '🫖 Laatste pot'],
        ['Afscheid van de oase', 'Waar het begon, bij de kamelen in de stal. Daar eindigt het ook.', '🔔 Kameelbel']
      ]]
  ]);

  const ZAKEN = [...filmstudio, ...karavaan];
  if (typeof window !== 'undefined') window.ZAKEN = ZAKEN;
  if (typeof module !== 'undefined' && module.exports) module.exports = { ZAKEN };
})();
