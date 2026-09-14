// ============================================================
// CAMPAIGN — vaste reeks zaken per thema, zes delen van acht per wereld, met
// titel, verhaaltje, bewijsstuk (voor de vitrine) en oplopende moeilijkheid. Zaken zijn
// deterministisch gegenereerd (vaste seed), dus iedereen speelt
// dezelfde puzzel. Daarnaast een eindeloos archief: genummerde
// dossiers die nooit opraken. Voortgang en sterren lokaal.
// ============================================================

const CAMPAIGN = [
  // ── Het Landhuis ────────────────────────────────────────────
  { key: 'landhuis', theme: 'landhuis', part: 1, icon: '🍷', title: 'Deel I · Het diner',
    intro: 'Landgoed Blackwood, 1927. Na het diner blijft de gastheer in zijn stoel zitten.',
    outro: 'De geheimen van het diner liggen op tafel. Maar de familie komt terug.',
    briefing: 'Welkom op Blackwood. Begin bij wie zegt in welke kamer hij was: dat zijn de makkelijkste verklaringen. En onthoud: alleen de moordenaar was bij het slachtoffer.',
    cases: [
    { title: 'Het glas Bordeaux',     story: 'De avond begon met een toost en eindigde in stilte.', item: '🍷 Wijnglas',        difficulty: 'makkelijk', seed: 5101 },
    { title: 'De verdwenen sleutel',  story: 'De studeerkamer zat op slot. Toch niet, zei de butler.', item: '🗝️ Sleutel',   difficulty: 'makkelijk', seed: 5198 },
    { title: 'Regen op het landgoed', story: 'Het noodweer hield iedereen binnen. Iedereen.', item: '☂️ Paraplu',            difficulty: 'makkelijk', seed: 5295 },
    { title: 'De laatste brief',      story: 'Op het bureau lag een brief die nooit is afgemaakt.', item: '✉️ Brief',       difficulty: 'gemiddeld', seed: 5392 },
    { title: 'Het portret',           story: 'Iemand had het familieportret omgedraaid.', item: '🖼️ Portret',                difficulty: 'gemiddeld', seed: 5489 },
    { title: 'De tuinman zwijgt',     story: 'Het gereedschapsschuurtje was leeg, de tuinman ook.', item: '🧤 Tuinhandschoen',      difficulty: 'gemiddeld', seed: 5586 },
    { title: 'Het testament',         story: 'Iedereen wist wat erin stond. Eén iemand wist het beter.', item: '📜 Testament', difficulty: 'moeilijk',  seed: 5683 },
    { title: 'De Rode Kamer',         story: 'Alles kwam samen in de kamer waar het begon.', item: '🕯️ Rode kaars',             difficulty: 'moeilijk',  seed: 5780 }
  ]},
  { key: 'landhuis-2', theme: 'landhuis', part: 2, icon: '📜', title: 'Deel II · De erfgenamen',
    intro: 'Na de begrafenis komt de familie terug. Iedereen wil iets uit het huis.',
    outro: 'De erfenis is verdeeld. Maar het huis heeft nog meer te vertellen.',
    briefing: 'De familie is terug en iedereen praat over iedereen. Verklaringen over twee personen los je op door eerst één van de twee vast te zetten.',
    cases: [
    { title: 'De verzegelde deur',     story: 'De notaris had de studeerkamer verzegeld. Het zegel was gebroken.', item: '🔏 Notariszegel', difficulty: 'makkelijk', seed: 15101 },
    { title: 'Thee om vier uur',       story: 'Het kopje stond nog vol. De stoel ernaast was leeg.', item: '☕ Theekopje',              difficulty: 'makkelijk', seed: 15198 },
    { title: 'Het dagboek van Agnes',  story: 'Tante Agnes schreef alles op. Bijna alles.', item: '📔 Dagboek',                       difficulty: 'gemiddeld', seed: 15295 },
    { title: 'De kapotte klok',        story: 'De klok in de hal stond stil op tien voor negen.', item: '⏰ Stilstaande klok',                 difficulty: 'gemiddeld', seed: 15392 },
    { title: 'Voetstappen in de kelder', story: 'Niemand ging ooit naar de kelder. Iemand wel.', item: '🥾 Kelderlaars',                 difficulty: 'gemiddeld', seed: 15489 },
    { title: 'De verwisselde glazen',  story: 'Twee glazen, dezelfde wijn, één verschil.', item: '🥂 Twee glazen',                        difficulty: 'moeilijk',  seed: 15586 },
    { title: 'Het geheim van de serre', story: 'Achter de planten stond een deur die niemand kende.', item: '🌿 Serrevaren',            difficulty: 'moeilijk',  seed: 15683 },
    { title: 'De laatste erfgenaam',   story: 'Toen het testament werd gelezen, ontbrak er één naam.', item: '🪶 Notarispen',            difficulty: 'moeilijk',  seed: 15780 }
  ]},
  { key: 'landhuis-3', theme: 'landhuis', part: 3, icon: '⛈️', title: 'Deel III · De nacht van de storm',
    intro: 'Het onweer sluit het landgoed af van de wereld. Niemand komt erin, niemand gaat eruit.',
    outro: 'Bij zonsopgang trekt het onweer weg. Landgoed Blackwood heeft geen geheimen meer.',
    briefing: 'De storm sluit het huis af. Verwacht verklaringen over rijen en kolommen: die lopen dwars door de muren heen. Let goed op de plattegrond.',
    cases: [
    { title: 'Het licht valt uit',     story: 'Eén kaars brandde nog, in de verkeerde kamer.', item: '🔦 Zaklamp',                    difficulty: 'makkelijk', seed: 25101 },
    { title: 'De natte jas',           story: 'Iemand was buiten geweest. Iedereen ontkende.', item: '🧥 Natte jas',                    difficulty: 'gemiddeld', seed: 25198 },
    { title: 'De bibliotheekladder',   story: 'De ladder stond bij een plank die nooit werd gebruikt.', item: '🪜 Ladder',           difficulty: 'gemiddeld', seed: 25295 },
    { title: 'Het gebroken raam',      story: 'De scherven lagen binnen. De wind kwam van buiten.', item: '🔷 Glasscherf',               difficulty: 'gemiddeld', seed: 25392 },
    { title: 'De stille butler',       story: 'Marcus zei niets. Dat was al verdacht genoeg.', item: '🎩 Butlerhoed',                    difficulty: 'moeilijk',  seed: 25489 },
    { title: 'Het portret kijkt mee',  story: 'Vanuit het schilderij kon je de hele eetkamer zien.', item: '🪞 Spiegel',              difficulty: 'moeilijk',  seed: 25586 },
    { title: 'Majoor Pike slaapt niet', story: 'De majoor beweerde dat hij sliep. Zijn laarzen niet.', item: '🎖️ Majoorsmedaille',           difficulty: 'moeilijk',  seed: 25683 },
    { title: 'Blackwood zwijgt',       story: 'De laatste nacht. De laatste leugen.', item: '📷 Familiefoto',                             difficulty: 'moeilijk',  seed: 25780 }
  ]},

  // ── Het Piratenschip ────────────────────────────────────────
  { key: 'piraten', theme: 'piraten', part: 1, icon: '🧭', title: 'Deel I · De stille zee',
    intro: 'De Zwarte Meeuw ligt stil op een spiegelgladde zee. De kapitein reageert niet meer.',
    outro: 'De Zwarte Meeuw hijst de zeilen. Er ligt een eiland op de kaart.',
    briefing: 'Een schip is klein en iedereen heeft elkaar gezien. "Direct naast" betekent het vakje ernaast, nooit schuin. Begin bij de kombuis.',
    cases: [
    { title: 'De stille zee',         story: 'Geen wind, geen golven, geen kapitein.', item: '🧭 Kompas',                    difficulty: 'makkelijk', seed: 7101 },
    { title: 'De gestolen kaart',     story: 'De schatkaart was weg. Het lichaam niet.', item: '🗺️ Schatkaart',                  difficulty: 'makkelijk', seed: 7198 },
    { title: 'Rum in het ruim',       story: 'Drie vaten leeg, één bemanningslid stil.', item: '🛢️ Rumvat',                  difficulty: 'makkelijk', seed: 7295 },
    { title: 'Het kanon zwijgt',      story: 'Niemand hoorde een schot. Toch lag daar iemand.', item: '💣 Kanonskogel',           difficulty: 'gemiddeld', seed: 7392 },
    { title: 'Muiterij',              story: 'Het gemor begon in de kombuis.', item: '🍴 Kombuismes',                            difficulty: 'gemiddeld', seed: 7489 },
    { title: 'De schatkist',          story: 'De kist was open. De inhoud niet.', item: '💰 Gouden munt',                         difficulty: 'gemiddeld', seed: 7586 },
    { title: 'Storm op komst',        story: 'De lucht werd zwart en de bemanning ook.', item: '🏮 Lantaarn',                  difficulty: 'moeilijk',  seed: 7683 },
    { title: 'De laatste zeilen',     story: 'Eén persoon zou nooit meer aan wal komen.', item: '⚓ Anker',                 difficulty: 'moeilijk',  seed: 7780 }
  ]},
  { key: 'piraten-2', theme: 'piraten', part: 2, icon: '🏝️', title: 'Deel II · Het eiland',
    intro: 'De Zwarte Meeuw gaat voor anker bij een naamloos eiland. De schat is dichtbij, en iedereen weet het.',
    outro: 'De schat ligt in het ruim. De rekening is vereffend. Nu nog naar huis.',
    briefing: 'Op het eiland liegt niemand, maar iedereen zwijgt over iets. Gebruik het potlood om vakjes te markeren waar iemand zou kúnnen staan.',
    cases: [
    { title: 'Voetsporen in het zand', story: 'De sporen liepen naar het water. Niet terug.', item: '🐚 Schelp',             difficulty: 'makkelijk', seed: 17101 },
    { title: 'De papegaai spreekt',    story: 'De vogel herhaalde één naam. Steeds weer.', item: '🪶 Papegaaienveer',                difficulty: 'makkelijk', seed: 17198 },
    { title: 'Het lege vat',           story: 'De rum was op. De vragen niet.', item: '🍾 Lege fles',                           difficulty: 'gemiddeld', seed: 17295 },
    { title: 'De valse kaart',         story: 'Er waren twee kaarten. Eén ervan loog.', item: '📜 Valse kaart',                   difficulty: 'gemiddeld', seed: 17392 },
    { title: 'Het kompas draait',      story: 'De naald wees naar de kombuis.', item: '🧲 Kompasnaald',                           difficulty: 'gemiddeld', seed: 17489 },
    { title: 'De verdwenen sloep',     story: 'Eén sloep was weg. Alle bemanning was er nog.', item: '🚣 Roeispaan',            difficulty: 'moeilijk',  seed: 17586 },
    { title: 'Kanonnier Bo telt',      story: 'Twaalf kogels, elf in de kist.', item: '📦 Kogelkist',                           difficulty: 'moeilijk',  seed: 17683 },
    { title: 'De vloek van Zwartoog',  story: 'Iedereen geloofde in de vloek. Behalve de dader.', item: '📿 Amulet',         difficulty: 'moeilijk',  seed: 17780 }
  ]},
  { key: 'piraten-3', theme: 'piraten', part: 3, icon: '💰', title: 'Deel III · De thuisvaart',
    intro: 'Met de schat aan boord begint de terugreis. Rijk worden maakt mensen niet eerlijker.',
    outro: 'De Zwarte Meeuw loopt de haven binnen. De bemanning is kleiner, de schat compleet.',
    briefing: 'Met de schat aan boord wordt de bemanning onrustig. Verklaringen als "links van" en "hoger dan" gelden voor de hele plattegrond, niet alleen voor de kamer.',
    cases: [
    { title: 'De eerste wacht',        story: 'De nachtwacht viel in slaap. Of dat zei hij.', item: '⏳ Zandloper',             difficulty: 'makkelijk', seed: 27101 },
    { title: 'Dokter Sal en het flesje', story: 'Het flesje was leeg. Het etiket was weg.', item: '🧪 Flesje',               difficulty: 'gemiddeld', seed: 27198 },
    { title: 'Storm aan bakboord',     story: 'Alles schoof. Eén ding bleef precies staan.', item: '🪢 Gesneden touw',              difficulty: 'gemiddeld', seed: 27295 },
    { title: 'De scheepskat',          story: 'De kat zat waar ze nooit zat.', item: '🔔 Scheepsbel',                            difficulty: 'gemiddeld', seed: 27392 },
    { title: 'Muiterij, deel twee',    story: 'Dezelfde gezichten. Een ander plan.', item: '🗡️ Dolk',                      difficulty: 'moeilijk',  seed: 27489 },
    { title: 'Het touw is gesneden',   story: 'Niemand had een mes. Iedereen had een mes.', item: '⚔️ Sabel',               difficulty: 'moeilijk',  seed: 27586 },
    { title: 'Land in zicht',          story: 'De haven was nog een dag weg. Voor één iemand te ver.', item: '🔭 Verrekijker',    difficulty: 'moeilijk',  seed: 27683 },
    { title: 'De laatste kapitein',    story: 'Wie de Meeuw voert, moet het verdienen.', item: '🏴‍☠️ Kapiteinsvlag',                  difficulty: 'moeilijk',  seed: 27780 }
  ]},

  // ── Grand Hotel Aurora ──────────────────────────────────────
  { key: 'hotel', theme: 'hotel', part: 1, icon: '🥂', title: 'Deel I · Nieuwjaarsnacht',
    intro: 'Om klokslag twaalf ging het licht uit. Toen het terugkwam, lag de eigenaar op de marmeren vloer.',
    outro: 'De eerste nacht van het jaar is voorbij. De gasten mogen nog niet naar huis.',
    briefing: 'Honderd gasten, één slachtoffer. Een hotel heeft veel ruimtes; streep eerst de ruimtes weg die volgens het rapport leeg waren.',
    cases: [
    { title: 'Middernacht',           story: 'Twaalf slagen, één schreeuw.', item: '⏱️ Zakhorloge',                              difficulty: 'makkelijk', seed: 9101 },
    { title: 'De verkeerde koffer',   story: 'De koffer op kamer 12 was niet van de gast op kamer 12.', item: '🧳 Koffer',   difficulty: 'makkelijk', seed: 9198 },
    { title: 'Champagne in de bar',   story: 'Het glas was nog koud toen het gebeurde.', item: '🍾 Champagne',                  difficulty: 'makkelijk', seed: 9295 },
    { title: 'De pianist speelt door',story: 'De muziek stopte niet. De gastheer wel.', item: '🎼 Bladmuziek',                   difficulty: 'gemiddeld', seed: 9392 },
    { title: 'Roomservice',           story: 'Het wagentje stond voor de deur. Niemand had gebeld.', item: '🛎️ Roomservicebel',      difficulty: 'gemiddeld', seed: 9489 },
    { title: 'De balzaal',            story: 'Honderd gasten, en toch was er maar één getuige.', item: '🎭 Balmasker',          difficulty: 'gemiddeld', seed: 9586 },
    { title: 'Sleutel 404',           story: 'Die kamer bestond niet. Die sleutel wel.', item: '🔑 Sleutel 404',                  difficulty: 'moeilijk',  seed: 9683 },
    { title: 'De laatste gast',       story: 'Bij het uitchecken ontbrak er iemand.', item: '📖 Gastenboek',                     difficulty: 'moeilijk',  seed: 9780 }
  ]},
  { key: 'hotel-2', theme: 'hotel', part: 2, icon: '🧳', title: 'Deel II · De gasten',
    intro: 'De nieuwjaarsgasten mogen het hotel niet verlaten. Het personeel ook niet.',
    outro: 'De gasten vertrekken. Het gastenboek heeft een bladzijde minder.',
    briefing: 'De gasten mogen niet weg en dat merk je aan hun verklaringen: kort en scherp. Twee mensen in dezelfde ruimte: zet de duidelijkste eerst.',
    cases: [
    { title: 'Kamer 7 is leeg',        story: 'De gast van kamer 7 stond op de lijst. Niet in het bed.', item: '🛏️ Kussensloop',  difficulty: 'makkelijk', seed: 19101 },
    { title: 'Ontbijt voor twee',      story: 'Twee borden, één gast.', item: '🍽️ Ontbijtbord',                                   difficulty: 'makkelijk', seed: 19198 },
    { title: 'De lift stopt',          story: 'Tussen de derde en de vierde verdieping. Precies lang genoeg.', item: '🔘 Liftknop', difficulty: 'gemiddeld', seed: 19295 },
    { title: 'Het portiershuisje',     story: 'De portier zag alles. Behalve dit.', item: '🧢 Portierspet',                       difficulty: 'gemiddeld', seed: 19392 },
    { title: 'De vergeten paraplu',    story: 'Het regende niet. Toch was hij nat.', item: '🌂 Natte paraplu',                      difficulty: 'gemiddeld', seed: 19489 },
    { title: 'Mevrouw Sato zingt',     story: 'De bar hoorde haar zingen. De balzaal ook. Onmogelijk.', item: '🎤 Microfoon',   difficulty: 'moeilijk',  seed: 19586 },
    { title: 'De wijnkelder',          story: 'Het slot was heel. De fles niet.', item: '🍷 Wijnfles',                         difficulty: 'moeilijk',  seed: 19683 },
    { title: 'Uitchecken om twaalf',   story: 'Om twaalf uur waren ze weg. Op één na.', item: '🧾 Rekening',                   difficulty: 'moeilijk',  seed: 19780 }
  ]},
  { key: 'hotel-3', theme: 'hotel', part: 3, icon: '🛎️', title: 'Deel III · Het personeel',
    intro: 'Wie het hotel kent, kent de gangen achter de muren. Daar begint dit deel.',
    outro: 'Grand Hotel Aurora dooft de lichten. Deze keer voorgoed.',
    briefing: 'Het personeel kent de gangen achter de muren. Denk aan hoeken en muren: een hoek raakt twee muren, "tegen een muur" raakt er één.',
    cases: [
    { title: 'De dienstlift',          story: 'Alleen het personeel kende de dienstlift. Blijkbaar niet alleen.', item: '🗝️ Dienstsleutel', difficulty: 'makkelijk', seed: 29101 },
    { title: 'Chef Rosa proeft',       story: 'De soep was te zout. De kok was er niet.', item: '🧂 Zoutvat',                 difficulty: 'gemiddeld', seed: 29198 },
    { title: 'De schoonmaakkar',       story: 'De kar stond voor de suite. De suite was leeg.', item: '🧽 Spons',           difficulty: 'gemiddeld', seed: 29295 },
    { title: 'Pianist Milo zwijgt',    story: 'Voor het eerst in tien jaar bleef de piano dicht.', item: '🎹 Pianotoets',        difficulty: 'gemiddeld', seed: 29392 },
    { title: 'Het gebroken kristal',   story: 'De kroonluchter miste één steen.', item: '💎 Kristal',                         difficulty: 'moeilijk',  seed: 29489 },
    { title: 'De kluis',               story: 'De kluis was open. De code kende maar één persoon.', item: '🔢 Kluiscode',       difficulty: 'moeilijk',  seed: 29586 },
    { title: 'Kamer 404',              story: 'De kamer die niet bestond, was weer gebruikt.', item: '🚪 Deurbordje',            difficulty: 'moeilijk',  seed: 29683 },
    { title: 'De laatste dienst',      story: 'Aurora sloot voorgoed. Iemand wilde dat niet.', item: '💡 Laatste lamp',            difficulty: 'moeilijk',  seed: 29780 }
  ]},

  // ── Station Orion ───────────────────────────────────────────
  { key: 'ruimte', theme: 'ruimte', part: 1, icon: '🚨', title: 'Deel I · Alarm',
    intro: 'De commandant meldt zich niet voor haar dienst. Alle luchtsluizen zijn vergrendeld.',
    outro: 'De sluizen blijven dicht. Dan vangt de antenne iets op.',
    briefing: 'Station Orion, alle sluizen dicht. De bemanning spreekt over modules, niet over kamers. Verder werkt het precies zoals thuis.',
    cases: [
    { title: 'Stilte op de brug',     story: 'De commandant meldde zich niet. Nooit meer.', item: '📓 Logboek',               difficulty: 'makkelijk', seed: 3101 },
    { title: 'Het laboratorium',      story: 'Een reageerbuis kapot, een alibi ook.', item: '🧪 Reageerbuis',                     difficulty: 'makkelijk', seed: 3198 },
    { title: 'De kas',                story: 'Tussen de planten lag meer dan bladeren.', item: '🌱 Zaailing',                  difficulty: 'makkelijk', seed: 3295 },
    { title: 'Drukverlies',           story: 'Het alarm ging af. Niet om de druk.', item: '🚨 Alarmlamp',                       difficulty: 'gemiddeld', seed: 3392 },
    { title: 'De onderhoudsrobot',    story: 'De robot had alles gezien, maar zegt niets.', item: '💾 Robotchip',               difficulty: 'gemiddeld', seed: 3489 },
    { title: 'Slaapcyclus',           story: 'Iedereen sliep. Behalve twee mensen.', item: '😴 Slaapmasker',                      difficulty: 'gemiddeld', seed: 3586 },
    { title: 'Het observatorium',     story: 'De sterren waren de enige getuigen.', item: '🌌 Sterrenkaart',                       difficulty: 'moeilijk',  seed: 3683 },
    { title: 'Thuisreis',             story: 'De capsule had plek voor iedereen. Op één na.', item: '🎫 Capsulepas',             difficulty: 'moeilijk',  seed: 3780 }
  ]},
  { key: 'ruimte-2', theme: 'ruimte', part: 2, icon: '📡', title: 'Deel II · Het signaal',
    intro: 'Een signaal van buiten het station. De bemanning raakt verdeeld.',
    outro: 'Het signaal stopt. Aan boord blijft het onrustig.',
    briefing: 'Het signaal maakt iedereen zenuwachtig. Hoe minder verklaringen, hoe meer je elke verklaring moet uitknijpen. Lees ze twee keer.',
    cases: [
    { title: 'Het bericht',            story: 'Het bericht kwam om 03:00. Niemand hoorde het.', item: '📼 Opname',           difficulty: 'makkelijk', seed: 13101 },
    { title: 'De defecte sensor',      story: 'Eén sensor viel uit. Precies boven de kantine.', item: '📟 Sensor',           difficulty: 'makkelijk', seed: 13198 },
    { title: 'Ingenieur Sol soldeert', story: 'Het paneel was open. Het gereedschap weg.', item: '🔥 Soldeerbout',                difficulty: 'gemiddeld', seed: 13295 },
    { title: 'Kok Dima kookt door',    story: 'Het eten stond klaar. Er kwam niemand.', item: '🥣 Rantsoen',                   difficulty: 'gemiddeld', seed: 13392 },
    { title: 'Sluis twee',             story: 'De sluis ging open. Van binnenuit.', item: '🕹️ Sluishendel',                       difficulty: 'gemiddeld', seed: 13489 },
    { title: 'De koepel draait',       story: 'De koepel wees naar de aarde. Niemand had hem gedraaid.', item: '🛰️ Koepelmotor',  difficulty: 'moeilijk',  seed: 13586 },
    { title: 'De robot liegt',         story: 'De logbestanden waren gewist. Bijna allemaal.', item: '💽 Logbestand',            difficulty: 'moeilijk',  seed: 13683 },
    { title: 'Stilte in de kas',       story: 'De planten groeiden. Verder bewoog er niets.', item: '🍃 Kasblad',             difficulty: 'moeilijk',  seed: 13780 }
  ]},
  { key: 'ruimte-3', theme: 'ruimte', part: 3, icon: '🚀', title: 'Deel III · Terugkeer',
    intro: 'De capsule naar huis heeft plaats voor iedereen. Niet iedereen wil mee.',
    outro: 'De capsule koppelt los. Station Orion draait verder, leeg en stil.',
    briefing: 'De laatste reis. Verwacht de moeilijkste zaken van de campagne. Hint: wie alleen was in een module, sluit alle anderen daar uit.',
    cases: [
    { title: 'De eerste slaapcyclus',  story: 'Iedereen sliep acht uur. Eén iemand negen.', item: '⏰ Slaapklok',               difficulty: 'makkelijk', seed: 23101 },
    { title: 'Piloot Reyes checkt',    story: 'De checklist was afgevinkt. Door twee handen.', item: '📋 Checklist',            difficulty: 'gemiddeld', seed: 23198 },
    { title: 'De lekkende leiding',    story: 'Het water liep naar het laboratorium.', item: '🧴 Waterfles',                    difficulty: 'gemiddeld', seed: 23295 },
    { title: 'Kadet Yuki telt',        story: 'Dertien kratten. Gisteren waren het er twaalf.', item: '📦 Krat dertien',           difficulty: 'gemiddeld', seed: 23392 },
    { title: 'Dr. Nkemelu twijfelt',   story: 'De dokter wist meer dan het rapport.', item: '📄 Rapport',                     difficulty: 'moeilijk',  seed: 23489 },
    { title: 'Het lab is verzegeld',   story: 'De deur zat op slot. Aan beide kanten.', item: '🔏 Labzegel',                   difficulty: 'moeilijk',  seed: 23586 },
    { title: 'Officier Paz kiest',     story: 'Er was één stoel te weinig in de capsule.', item: '🪑 Capsulestoel',                difficulty: 'moeilijk',  seed: 23683 },
    { title: 'Orion gaat uit',         story: 'De laatste lichten. De laatste vraag.', item: '🔦 Noodlamp',                    difficulty: 'moeilijk',  seed: 23780 }
  ]},

  // ══════════════════════════════════════════════════════════════
  // Delen IV t/m VI: elke wereld gaat verder. Tussendoor een makkelijke
  // zaak om op adem te komen, aan het eind de zwaarste van de wereld.
  // ══════════════════════════════════════════════════════════════

  // ── Het Landhuis, verder ────────────────────────────────────
  { key: 'landhuis-4', theme: 'landhuis', part: 4, icon: '🗝️', title: 'Deel IV · Een jaar later',
    intro: 'Een jaar na de storm wordt Blackwood verkocht. De nieuwe eigenaar nodigt de oude gasten uit. Niemand had moeten komen.',
    outro: 'De verkoop gaat niet door. Het huis houdt zijn bewoners vast.',
    briefing: 'Dezelfde gezichten, een jaar ouder en een stuk voorzichtiger. Lees elke verklaring twee keer: wie zegt waar hij níét was, vertelt je ook iets.',
    cases: [
    { title: 'De nieuwe eigenaar',     story: 'De koopakte lag klaar. De handtekening ontbrak.', item: '🖊️ Vulpen',                    difficulty: 'makkelijk', seed: 35101 },
    { title: 'Stof op de piano',       story: 'Niemand had gespeeld. Toch stond de klep open.', item: '🎵 Pianoklep',                 difficulty: 'gemiddeld', seed: 35198 },
    { title: 'De kelderdeur',          story: 'De deur klemde al jaren. Vannacht niet.', item: '🚪 Kelderdeur',                        difficulty: 'gemiddeld', seed: 35295 },
    { title: 'Isabelle en het raam',   story: 'Ze zag iets in de tuin. Of dat zei ze.', item: '🔭 Verrekijker',                        difficulty: 'moeilijk',  seed: 35392 },
    { title: 'Het koude haardvuur',    story: 'De haard was uit. De as was nog warm.', item: '🪵 Haardblok',                            difficulty: 'gemiddeld', seed: 35489 },
    { title: 'De oude foto',           story: 'Op de foto stonden acht mensen. Eén was weggeknipt.', item: '✂️ Schaar',                difficulty: 'moeilijk',  seed: 35586 },
    { title: 'Thomas telt het zilver', story: 'Zes lepels. Gisteren zeven.', item: '🥄 Zilveren lepel',                                  difficulty: 'moeilijk',  seed: 35683 },
    { title: 'De sleutel van de zolder', story: 'Niemand ging naar de zolder. Behalve wie de sleutel had.', item: '🔐 Zoldersleutel', difficulty: 'moeilijk',  seed: 35780 }
  ]},
  { key: 'landhuis-5', theme: 'landhuis', part: 5, icon: '💍', title: 'Deel V · De bruiloft',
    intro: 'Rosalind trouwt op Blackwood. De hele familie komt, en met de familie komen de oude ruzies mee.',
    outro: 'De taart is aangesneden, het feest is voorbij. De gasten vertrekken, op één na.',
    briefing: 'Een bruiloft is druk: veel mensen, weinig kamers. Begin met wie zegt alleen te zijn geweest, dat ruimt meteen een hele kamer op.',
    cases: [
    { title: 'Het boeket',             story: 'Het boeket werd gevangen. Door de verkeerde.', item: '💐 Boeket',                       difficulty: 'makkelijk', seed: 45101 },
    { title: 'De bruidstaart',         story: 'Drie lagen. De bovenste was aangeraakt.', item: '🎂 Taartschep',                        difficulty: 'gemiddeld', seed: 45198 },
    { title: 'De ringen',              story: 'Twee ringen in een doosje. Eén doosje leeg.', item: '💍 Ringdoosje',                     difficulty: 'gemiddeld', seed: 45295 },
    { title: 'De speech van Majoor Pike', story: 'Hij sprak tien minuten. Niemand luisterde. Eén iemand wel.', item: '📝 Speech',    difficulty: 'moeilijk',  seed: 45392 },
    { title: 'Tante Agnes ziet alles', story: 'Vanuit haar stoel zag ze de hele hal. Zei ze.', item: '👓 Leesbril',                    difficulty: 'gemiddeld', seed: 45489 },
    { title: 'Dansen in de hal',       story: 'De muziek speelde. Twee mensen dansten niet.', item: '🎻 Viool',                        difficulty: 'moeilijk',  seed: 45586 },
    { title: 'De champagnekoeler',     story: 'Het ijs was gesmolten. Het glas ernaast onaangeraakt.', item: '🧊 IJsemmer',            difficulty: 'moeilijk',  seed: 45683 },
    { title: 'De laatste dans',        story: 'Toen het licht aanging, stond er iemand te veel op de dansvloer.', item: '💃 Dansschoen', difficulty: 'moeilijk', seed: 45780 }
  ]},
  { key: 'landhuis-6', theme: 'landhuis', part: 6, icon: '🚪', title: 'Deel VI · Het geheim van Blackwood',
    intro: 'Onder de trap zit een deur die op geen enkele plattegrond staat. Wat erachter ligt, verandert alles.',
    outro: 'De deur onder de trap is dichtgemetseld. Blackwood zwijgt, en dit keer echt.',
    briefing: 'Het laatste deel van het landhuis. Alles wat je hebt geleerd komt terug: hoeken, meubels, rijen. Zet niemand neer voordat je het zeker weet.',
    cases: [
    { title: 'De deur onder de trap',  story: 'Achter de trap zat een deur. Iemand wist ervan.', item: '🧱 Losse steen',                difficulty: 'makkelijk', seed: 55101 },
    { title: 'De brief van 1912',      story: 'De brief was oud. De inkt niet.', item: '🖋️ Inktpot',                                 difficulty: 'gemiddeld', seed: 55198 },
    { title: 'De plattegrond klopt niet', story: 'Eén kamer was groter dan op de tekening.', item: '📐 Meetlint',                     difficulty: 'moeilijk',  seed: 55295 },
    { title: 'Dr. Cross onderzoekt',   story: 'De dokter vond het als eerste. Te snel.', item: '🩺 Stethoscoop',                       difficulty: 'moeilijk',  seed: 55392 },
    { title: 'Clara zwijgt',           story: 'Ze wist wie het was. Ze zei het tegen niemand.', item: '🤫 Zakdoek',                    difficulty: 'gemiddeld', seed: 55489 },
    { title: 'De verborgen kamer',     story: 'De kamer had geen raam. Toch scheen er licht.', item: '🕯️ Kandelaar',                  difficulty: 'moeilijk',  seed: 55586 },
    { title: 'Marcus bekent',          story: 'De butler bekende alles. Behalve de moord.', item: '🧾 Bekentenis',                     difficulty: 'moeilijk',  seed: 55683 },
    { title: 'Blackwood, het einde',   story: 'De laatste kamer. De laatste naam.', item: '🗝️ Laatste sleutel',                       difficulty: 'moeilijk',  seed: 55780 }
  ]},

  // ── Het Piratenschip, verder ────────────────────────────────
  { key: 'piraten-4', theme: 'piraten', part: 4, icon: '🛞', title: 'Deel IV · De nieuwe kapitein',
    intro: 'Roodbaard neemt het roer. De bemanning is het er niet mee eens. Op zee blijft niets lang stil.',
    outro: 'De Meeuw heeft een kapitein. Voor hoelang, weet niemand.',
    briefing: 'Een nieuwe kapitein en een oude bemanning. Verklaringen met "direct naast" zijn goud waard op zo\'n klein schip: elk vakje telt.',
    cases: [
    { title: 'Het roer wisselt',       story: 'Roodbaard nam het roer. Iemand liet het los.', item: '🛞 Scheepsroer',                 difficulty: 'makkelijk', seed: 37101 },
    { title: 'De kaart van Nik',       story: 'Scheepsjongen Nik tekende een kaart van een plek die niet bestond.', item: '🖍️ Krijtje', difficulty: 'gemiddeld', seed: 37198 },
    { title: 'Kok Ada mist een mes',   story: 'In de kombuis lagen elf messen. Het hoorden er twaalf te zijn.', item: '🔪 Koksmes',   difficulty: 'gemiddeld', seed: 37295 },
    { title: 'Het lek',                story: 'Het water kwam binnen. Precies waar niemand keek.', item: '🪣 Emmer',                   difficulty: 'moeilijk',  seed: 37392 },
    { title: 'Juffrouw Lark luistert', story: 'Ze hoorde stemmen in het ruim. Twee stemmen.', item: '🐚 Hoorschelp',                  difficulty: 'gemiddeld', seed: 37489 },
    { title: 'Het gevecht om de kist', story: 'Twee mensen wilden de kist. Eén kreeg hem.', item: '🔒 Kistslot',                      difficulty: 'moeilijk',  seed: 37586 },
    { title: 'De nacht zonder maan',   story: 'Het was aardedonker. Iemand kende de weg.', item: '🌑 Gedoofde lantaarn',               difficulty: 'moeilijk',  seed: 37683 },
    { title: 'Roodbaard aan het roer', story: 'De kapitein stond aan het roer. Achter hem: niemand. Zei hij.', item: '🎖️ Kapiteinsknoop', difficulty: 'moeilijk', seed: 37780 }
  ]},
  { key: 'piraten-5', theme: 'piraten', part: 5, icon: '🌫️', title: 'Deel V · Het spookschip',
    intro: 'In de mist ligt een schip zonder bemanning. De Meeuw gaat langszij. Iemand had beter thuis kunnen blijven.',
    outro: 'Het spookschip verdwijnt in de mist. De Meeuw vaart verder, één man lichter.',
    briefing: 'Mist en een leeg schip: iedereen is zenuwachtig en praat te veel. Streep eerst de lege ruimtes weg, dan wordt de rest vanzelf klein.',
    cases: [
    { title: 'Het logboek van de ander', story: 'Het laatste stuk was in een bekend handschrift.', item: '📖 Vreemd logboek',          difficulty: 'makkelijk', seed: 47101 },
    { title: 'Het schip in de mist',   story: 'Geen bemanning, geen vlag, één voetstap.', item: '🌫️ Mistlamp',                       difficulty: 'gemiddeld', seed: 47198 },
    { title: 'De lege hangmat',        story: 'Alle hangmatten hingen leeg. Eén was nog warm.', item: '🛏️ Hangmat',                   difficulty: 'gemiddeld', seed: 47295 },
    { title: 'Stuurman Kwint verdwaalt', story: 'Op een schip dat hij niet kende, vond hij de weg te goed.', item: '🧭 Tweede kompas', difficulty: 'moeilijk', seed: 47392 },
    { title: 'Het lied uit het ruim',  story: 'Iemand zong. Niemand gaf het toe.', item: '🎶 Scheepslied',                             difficulty: 'gemiddeld', seed: 47489 },
    { title: 'Dokter Sal en de kist',  story: 'Medicijnen voor een bemanning die er niet was.', item: '💊 Pillendoos',                  difficulty: 'moeilijk',  seed: 47586 },
    { title: 'Bo en het kruit',        story: 'Het kruit was droog. Op één vat na.', item: '🧨 Kruitvat',                              difficulty: 'moeilijk',  seed: 47683 },
    { title: 'De mist trekt op',       story: 'Toen de mist optrok, lag er iemand op het dek van de Meeuw.', item: '⚓ Roestig anker', difficulty: 'moeilijk', seed: 47780 }
  ]},
  { key: 'piraten-6', theme: 'piraten', part: 6, icon: '🪙', title: 'Deel VI · Zwartoogs schat',
    intro: 'De echte schat van Zwartoog ligt niet op een eiland. Hij ligt aan boord. En iedereen weet nu waar.',
    outro: 'De schat is verdeeld. De Meeuw is van de bemanning, en de bemanning van de zee.',
    briefing: 'De laatste zaken op de Meeuw en de moeilijkste. Verklaringen over rijen en kolommen lopen dwars door het schip: gebruik het potlood.',
    cases: [
    { title: 'De dubbele bodem',       story: 'Onder het ruim lag nog een ruim.', item: '🪵 Losse plank',                              difficulty: 'makkelijk', seed: 57101 },
    { title: 'Scheepsjongen Nik zwijgt', story: 'Hij had alles gezien. Hij was pas twaalf.', item: '🪀 Jojo',                          difficulty: 'gemiddeld', seed: 57198 },
    { title: 'Het gouden oog',         story: 'Zwartoogs ooglap was van goud. Nu van niemand.', item: '🪙 Gouden ooglap',               difficulty: 'moeilijk',  seed: 57295 },
    { title: 'De verdeling',           story: 'Acht delen. Zeven mensen aan tafel.', item: '⚖️ Weegschaal',                            difficulty: 'moeilijk',  seed: 57392 },
    { title: 'Het mes van Ada',        story: 'Het mes was terug. Schoon.', item: '🧽 Schoon mes',                                      difficulty: 'gemiddeld', seed: 57489 },
    { title: 'Muiterij, deel drie',    story: 'De derde keer is de gevaarlijkste.', item: '🏴 Zwarte doek',                             difficulty: 'moeilijk',  seed: 57586 },
    { title: 'De laatste wacht',       story: 'Wie de laatste wacht had, zag de zon niet meer opkomen.', item: '🕯️ Wachtkaars',        difficulty: 'moeilijk',  seed: 57683 },
    { title: 'Land van Zwartoog',      story: 'De kust van de kapitein. Het einde van de reis.', item: '🏝️ Kaart van thuis',          difficulty: 'moeilijk',  seed: 57780 }
  ]},

  // ── Grand Hotel Aurora, verder ──────────────────────────────
  { key: 'hotel-4', theme: 'hotel', part: 4, icon: '✂️', title: 'Deel IV · De heropening',
    intro: 'Grand Hotel Aurora gaat weer open. Nieuwe eigenaar, oude gasten, dezelfde gangen.',
    outro: 'De heropening is een succes. Op één recensie na.',
    briefing: 'Het hotel is opnieuw ingericht, dus bekijk de plattegrond goed voordat je begint. Tik op meubels waar je niet zeker van bent.',
    cases: [
    { title: 'Het lint wordt doorgeknipt', story: 'De schaar was scherp. De eigenaar niet meer.', item: '✂️ Feestschaar',              difficulty: 'makkelijk', seed: 39101 },
    { title: 'Kamer 1',                story: 'De eerste gast, de eerste kamer, het eerste probleem.', item: '🔑 Sleutel 1',            difficulty: 'gemiddeld', seed: 39198 },
    { title: 'Gravin Delacroix klaagt', story: 'Het bed was te hard. Het alibi te zacht.', item: '🛎️ Klachtenbel',                    difficulty: 'gemiddeld', seed: 39295 },
    { title: 'De nieuwe kok',          story: 'Chef Rosa had hulp. De hulp had haast.', item: '🍳 Koekenpan',                          difficulty: 'moeilijk',  seed: 39392 },
    { title: 'De lift heeft haast',    story: 'De lift ging naar boven. Niemand had gedrukt.', item: '⬆️ Liftpijl',                    difficulty: 'gemiddeld', seed: 39489 },
    { title: 'Butler Ames herinnert zich', story: 'Hij herinnerde zich elke gast. Op één na.', item: '📒 Gastenlijst',                difficulty: 'moeilijk',  seed: 39586 },
    { title: 'De spiegelzaal',         story: 'Honderd spiegels, honderd getuigen, één leugen.', item: '🪞 Spiegelscherf',              difficulty: 'moeilijk',  seed: 39683 },
    { title: 'De eerste recensie',     story: 'Vijf sterren. Geschreven door iemand die nooit had ingecheckt.', item: '⭐ Recensiekaart', difficulty: 'moeilijk', seed: 39780 }
  ]},
  { key: 'hotel-5', theme: 'hotel', part: 5, icon: '🏷️', title: 'Deel V · Het congres',
    intro: 'Driehonderd congresgangers, één spreker die nooit het podium haalt.',
    outro: 'Het congres is afgelopen. De aanwezigheidslijst klopt niet meer.',
    briefing: 'Veel gasten betekent veel verklaringen over twee mensen tegelijk. Zet altijd eerst degene vast van wie je het meeste weet.',
    cases: [
    { title: 'Koffiepauze',            story: 'Tweehonderd kopjes. Eén ervan met iets extra.', item: '☕ Congreskopje',                 difficulty: 'makkelijk', seed: 49101 },
    { title: 'De naambadge',           story: 'De badge lag op de grond. De naam klopte niet.', item: '🏷️ Naambadge',                  difficulty: 'gemiddeld', seed: 49198 },
    { title: 'De verkeerde zaal',      story: 'Zaal B was leeg. Volgens het programma niet.', item: '🚪 Zaalbordje',                    difficulty: 'gemiddeld', seed: 49295 },
    { title: 'Journalist Bram noteert', story: 'Hij schreef alles op. Ook wat hij niet had gezien.', item: '🗒️ Notitieblok',          difficulty: 'moeilijk',  seed: 49392 },
    { title: 'Portier Jansen slaapt',  story: 'Voor het eerst in dertig jaar. Zei hij.', item: '😴 Portiersstoel',                      difficulty: 'gemiddeld', seed: 49489 },
    { title: 'Danseres Lou treedt op', story: 'Het optreden duurde vier minuten. Precies lang genoeg.', item: '🩰 Balletschoen',        difficulty: 'moeilijk',  seed: 49586 },
    { title: 'De microfoon staat aan', story: 'Iedereen hoorde het. Niemand begreep het.', item: '🎙️ Microfoon',                      difficulty: 'moeilijk',  seed: 49683 },
    { title: 'De slotspeech',          story: 'De spreker kwam niet. De zaal wachtte.', item: '📣 Spreekgestoelte',                     difficulty: 'moeilijk',  seed: 49780 }
  ]},
  { key: 'hotel-6', theme: 'hotel', part: 6, icon: '💡', title: 'Deel VI · De laatste nacht van Aurora',
    intro: 'Het hotel sluit voorgoed. Het personeel blijft één nacht langer. Eén nacht te lang.',
    outro: 'De lichten gaan uit. Grand Hotel Aurora is geschiedenis, en jij kent elke bladzijde.',
    briefing: 'De laatste nacht en de moeilijkste zaken van het hotel. Hoeken, muren, rijen: alles telt. Neem de tijd, de sterren lopen niet weg.',
    cases: [
    { title: 'De sleutels worden ingeleverd', story: 'Alle sleutels aan het bord. Eén haak leeg.', item: '🪝 Sleutelhaak',             difficulty: 'makkelijk', seed: 59101 },
    { title: 'De laatste maaltijd',    story: 'Chef Rosa kookte voor acht. Zeven aten.', item: '🍽️ Zilveren cloche',                  difficulty: 'gemiddeld', seed: 59198 },
    { title: 'Het lege zwembad',       story: 'Het water was weg. Wat op de bodem lag niet.', item: '🏊 Zwembadtegel',                  difficulty: 'moeilijk',  seed: 59295 },
    { title: 'Mevrouw Sato pakt in',   story: 'Twee koffers. Eén ervan niet van haar.', item: '🧳 Tweede koffer',                       difficulty: 'moeilijk',  seed: 59392 },
    { title: 'Pianist Milo speelt uit', story: 'Het laatste lied. De laatste noot kwam niet.', item: '🎼 Laatste partituur',           difficulty: 'gemiddeld', seed: 59489 },
    { title: 'De kluis is leeg',       story: 'De kluis stond open. De code was veranderd.', item: '🔓 Open kluis',                     difficulty: 'moeilijk',  seed: 59586 },
    { title: 'Het licht in kamer 404', story: 'De kamer die niet bestond, brandde licht.', item: '💡 Peertje',                          difficulty: 'moeilijk',  seed: 59683 },
    { title: 'Aurora dooft',           story: 'De hoofdschakelaar. De laatste hand.', item: '🔌 Hoofdschakelaar',                       difficulty: 'moeilijk',  seed: 59780 }
  ]},

  // ── Station Orion, verder ───────────────────────────────────
  { key: 'ruimte-4', theme: 'ruimte', part: 4, icon: '🔘', title: 'Deel IV · Orion herstart',
    intro: 'Een nieuwe bemanning neemt Station Orion in gebruik. De oude logboeken zijn gewist. Niet grondig genoeg.',
    outro: 'Het station draait weer. De logboeken blijven voortaan bewaard.',
    briefing: 'Orion is opnieuw in bedrijf en de modules zijn anders ingedeeld. Lege modules eerst wegstrepen, dat scheelt de helft van het werk.',
    cases: [
    { title: 'De herstart',            story: 'Alle systemen online. Eén bemanningslid offline.', item: '🔘 Startknop',                  difficulty: 'makkelijk', seed: 33101 },
    { title: 'Het gewiste logboek',    story: 'Gewist, maar niet weg.', item: '💾 Herstelde data',                                       difficulty: 'gemiddeld', seed: 33198 },
    { title: 'Bioloog Wren kweekt',    story: 'De kweekbak groeide te snel. Net als de verdenking.', item: '🧫 Petrischaal',            difficulty: 'gemiddeld', seed: 33295 },
    { title: 'Zwaartekracht uit',      story: 'Twee minuten zonder zwaartekracht. Alles zweefde. Behalve de waarheid.', item: '🎈 Zwevende pen', difficulty: 'moeilijk', seed: 33392 },
    { title: 'Kok Dima proeft',        story: 'Het rantsoen smaakte anders. Volgens één iemand.', item: '🥫 Rantsoenblik',              difficulty: 'gemiddeld', seed: 33489 },
    { title: 'De zonnepanelen',        story: 'Het station kantelde naar de zon. Iemand had dat bevolen.', item: '☀️ Zonnepaneel',     difficulty: 'moeilijk',  seed: 33586 },
    { title: 'Kadet Yuki dubbelt',     story: 'Volgens het rooster was Yuki op twee plekken tegelijk.', item: '📅 Dienstrooster',      difficulty: 'moeilijk',  seed: 33683 },
    { title: 'Het nieuwe commando',    story: 'De nieuwe commandant hield het één week vol.', item: '🎖️ Commandantsspeld',             difficulty: 'moeilijk',  seed: 33780 }
  ]},
  { key: 'ruimte-5', theme: 'ruimte', part: 5, icon: '📦', title: 'Deel V · De vreemde capsule',
    intro: 'Een capsule koppelt aan zonder toestemming. Binnen: niemand. Buiten: een bemanning die opeens veel te vertellen heeft.',
    outro: 'De capsule wordt losgekoppeld en weggeduwd. Wat erin zat, weet alleen de bemanning.',
    briefing: 'Een vreemde capsule en zenuwachtige mensen. Verklaringen met "links van" en "hoger dan" gelden voor het hele station, niet voor één module.',
    cases: [
    { title: 'Leeg, zei men',          story: 'De capsule was leeg. Iemand was erin geweest.', item: '👣 Stofvoetstap',                 difficulty: 'makkelijk', seed: 43101 },
    { title: 'Het koppelsignaal',      story: 'De capsule meldde zich beleefd. Daarna niet meer.', item: '📡 Koppelantenne',            difficulty: 'gemiddeld', seed: 43198 },
    { title: 'De koude module',        story: 'De verwarming viel uit. In precies één module.', item: '🌡️ Thermometer',               difficulty: 'gemiddeld', seed: 43295 },
    { title: 'Ingenieur Sol opent de sluis', story: 'Zonder toestemming. Met een goede reden, zei ze.', item: '🔧 Sluissleutel',       difficulty: 'moeilijk',  seed: 43392 },
    { title: 'Officier Paz beveelt',   story: 'Het bevel was duidelijk. Niemand voerde het uit.', item: '📜 Bevelschrift',              difficulty: 'gemiddeld', seed: 43489 },
    { title: 'Piloot Reyes berekent',  story: 'De koers klopte. De tijd niet.', item: '🧮 Koersberekening',                             difficulty: 'moeilijk',  seed: 43586 },
    { title: 'Het pakket',             story: 'In de capsule lag een pakket. Aan één naam gericht.', item: '📦 Pakket',                 difficulty: 'moeilijk',  seed: 43683 },
    { title: 'Loskoppelen',            story: 'De capsule ging weg. Met iets erin dat er eerst niet was.', item: '🔗 Koppelstuk',      difficulty: 'moeilijk',  seed: 43780 }
  ]},
  { key: 'ruimte-6', theme: 'ruimte', part: 6, icon: '🔥', title: 'Deel VI · De laatste omloop',
    intro: 'Orion wordt opgegeven. Nog één omloop om de aarde, dan de capsule naar huis. Iedereen wil mee. Niet iedereen kan.',
    outro: 'De capsule landt. Station Orion verbrandt in de dampkring, met al zijn geheimen. Behalve die van jou.',
    briefing: 'De allerlaatste zaken van de campagne en de zwaarste. Alles komt samen. Wie alleen was in een module sluit iedereen daar uit; begin daar.',
    cases: [
    { title: 'De laatste omloop',      story: 'Negentig minuten om de aarde. Genoeg tijd.', item: '🌍 Aardefoto',                       difficulty: 'makkelijk', seed: 53101 },
    { title: 'Zeven stoelen',          story: 'De capsule had zeven stoelen. Acht namen op de lijst.', item: '🪑 Zevende stoel',        difficulty: 'gemiddeld', seed: 53198 },
    { title: 'Dr. Nkemelu tekent',     story: 'Het rapport was ondertekend. Twee keer.', item: '✒️ Handtekening',                       difficulty: 'moeilijk',  seed: 53295 },
    { title: 'Botanist Tamsin snoeit', story: 'De kas werd opgeruimd. Grondig.', item: '🌿 Snoeischaar',                                difficulty: 'moeilijk',  seed: 53392 },
    { title: 'De zuurstofmeter',       story: 'Genoeg zuurstof voor iedereen. Iets minder voor één iemand.', item: '🫧 Zuurstofmeter', difficulty: 'gemiddeld', seed: 53489 },
    { title: 'Het laatste bericht naar huis', story: 'Het bericht was kort. Het was niet van de commandant.', item: '📨 Laatste bericht', difficulty: 'moeilijk', seed: 53586 },
    { title: 'Koppeling om 04:00',     story: 'De capsule wachtte. Eén bemanningslid ook, ergens anders.', item: '⏱️ Stopwatch',        difficulty: 'moeilijk',  seed: 53683 },
    { title: 'Orion verbrandt',        story: 'De laatste vraag boven de laatste dampkring.', item: '🔥 Hitteschild',                    difficulty: 'moeilijk',  seed: 53780 }
  ]},

  // ── Het Museum ──────────────────────────────────────────────
  { key: 'museum', theme: 'museum', part: 1, icon: '🏛️', title: 'Deel I · Na sluitingstijd',
    intro: 'Het museum sluit om vijf uur. Om zes uur ligt de conservator tussen de beelden en zit elke deur op slot.',
    outro: 'De eerste nacht is voorbij. Het museum blijft dicht, de vragen niet.',
    briefing: 'Een museum heeft veel zalen en weinig mensen. Begin met wie zegt in welke zaal hij was, en let op de vitrines: "direct naast" telt alleen recht ernaast.',
    cases: [
    { title: 'Na sluitingstijd',       story: 'De deuren gingen dicht. Niet iedereen was naar buiten.', item: '🎟️ Toegangskaartje',        difficulty: 'makkelijk', seed: 1101 },
    { title: 'De sarcofaag',           story: 'Het deksel stond op een kier. Het had dicht moeten zitten.', item: '⚱️ Canopenvaas',          difficulty: 'makkelijk', seed: 1198 },
    { title: 'Het scheve schilderij',  story: 'Eén lijst hing scheef. De rest hing al honderd jaar recht.', item: '🖼️ Kleine lijst',        difficulty: 'makkelijk', seed: 1295 },
    { title: 'Gids Fenna sluit af',    story: 'Ze deed elke avond de ronde. Vanavond sloeg ze een zaal over.', item: '🔑 Zaalsleutel',        difficulty: 'gemiddeld', seed: 1392 },
    { title: 'De dinozaal',            story: 'Een bot lag op de verkeerde plek. Zeventig miljoen jaar had het goed gelegen.', item: '🦴 Dinobot', difficulty: 'gemiddeld', seed: 1489 },
    { title: 'Het alarm zwijgt',       story: 'Het alarm ging niet af. Iemand wist de code.', item: '🔔 Alarmkastje',                     difficulty: 'gemiddeld', seed: 1586 },
    { title: 'Nachtwaker Ruud slaapt', story: 'Zijn koffie was koud, zijn stoel warm.', item: '☕ Thermosfles',                             difficulty: 'moeilijk',  seed: 1683 },
    { title: 'De laatste bezoeker',    story: 'Op de camera: één gast die nooit vertrok.', item: '📹 Camerabeeld',                          difficulty: 'moeilijk',  seed: 1780 }
  ]},
  { key: 'museum-2', theme: 'museum', part: 2, icon: '💎', title: 'Deel II · De verdwenen diamant',
    intro: 'De Vlierbeek-diamant is weg uit de kluis. De politie zet het museum af. Iedereen die binnen was, blijft binnen.',
    outro: 'De diamant is terug. Wie hem had, ook.',
    briefing: 'Een diefstal én een moord: mensen liegen over waar ze waren. Twee verklaringen die elkaar tegenspreken kunnen niet allebei kloppen; zet de zekere eerst vast.',
    cases: [
    { title: 'De lege kluis',          story: 'De kluis was open, het kussentje leeg.', item: '🧿 Fluwelen kussen',                       difficulty: 'makkelijk', seed: 11101 },
    { title: 'Stagiair Noor telt',     story: 'Volgens haar lijst was er niets weg. Volgens de kluis wel.', item: '📋 Inventarislijst',     difficulty: 'makkelijk', seed: 11198 },
    { title: 'Het verkeerde beeld',    story: 'Het beeld was een kopie. Sinds gisteren.', item: '🗿 Kopie',                                difficulty: 'gemiddeld', seed: 11295 },
    { title: 'Kunsthandelaar Vic biedt', story: 'Hij bood op iets dat nog niet te koop was.', item: '💳 Visitekaartje',                   difficulty: 'gemiddeld', seed: 11392 },
    { title: 'De valse vloer',         story: 'Onder het tapijt lag een luik. Onder het luik lag stof.', item: '🚪 Luik',                  difficulty: 'gemiddeld', seed: 11489 },
    { title: 'Restaurateur Imke poetst', story: 'Ze werkte aan een schilderij dat niet in de werkplaats hoorde.', item: '🖌️ Penseel',     difficulty: 'moeilijk',  seed: 11586 },
    { title: 'De glazen vitrine',      story: 'Het glas was heel. De diamant weg.', item: '🔍 Loep',                                        difficulty: 'moeilijk',  seed: 11683 },
    { title: 'Steen van Vlierbeek',    story: 'De diamant lag in de zaal waar niemand had gezocht.', item: '💎 Diamant',                    difficulty: 'moeilijk',  seed: 11780 }
  ]},
  { key: 'museum-3', theme: 'museum', part: 3, icon: '🎭', title: 'Deel III · De tentoonstelling',
    intro: 'De grote opening. Driehonderd gasten, één spreker, en een zaal die op slot gaat voordat de champagne op is.',
    outro: 'De tentoonstelling gaat door. Met één schilderij minder aan de muur.',
    briefing: 'Bij de opening lopen veel mensen door dezelfde zalen. Verklaringen over rijen en kolommen lopen dwars door de muren: gebruik het potlood.',
    cases: [
    { title: 'De opening',             story: 'Het lint werd doorgeknipt. Daarna werd het stil.', item: '🎀 Openingslint',                 difficulty: 'makkelijk', seed: 21101 },
    { title: 'Champagne in de hal',    story: 'Honderd glazen. Eén had een vingerafdruk te veel.', item: '🥂 Champagneglas',                difficulty: 'gemiddeld', seed: 21198 },
    { title: 'Professor Adebayo spreekt', story: 'Zijn lezing duurde twintig minuten. Zijn alibi tien.', item: '📖 Lezing',                difficulty: 'gemiddeld', seed: 21295 },
    { title: 'De verkeerde zaal',      story: 'Zaal 4 was gesloten. Volgens het programma niet.', item: '🚧 Afzetlint',                    difficulty: 'gemiddeld', seed: 21392 },
    { title: 'Schoonmaker Piet dweilt', story: 'De vloer was schoon. Te schoon.', item: '🧹 Dweil',                                        difficulty: 'moeilijk',  seed: 21489 },
    { title: 'Het portret kijkt terug', story: 'Het portret hing andersom. Iemand had het gedraaid.', item: '🖼️ Portret',                  difficulty: 'moeilijk',  seed: 21586 },
    { title: 'Curator Bas zwijgt',     story: 'Hij wist welk schilderij vals was. Hij zei het niet.', item: '🏷️ Naamplaatje',              difficulty: 'moeilijk',  seed: 21683 },
    { title: 'Licht uit in zaal 7',    story: 'Het licht viel uit. Toen het aanging, ontbrak er iemand.', item: '💡 Zaallamp',              difficulty: 'moeilijk',  seed: 21780 }
  ]},
  { key: 'museum-4', theme: 'museum', part: 4, icon: '📦', title: 'Deel IV · Het depot',
    intro: 'In de kelders liggen tienduizend voorwerpen die niemand ooit ziet. Iemand zag er één te veel.',
    outro: 'Het depot is weer op slot. De inventaris klopt, op één naam na.',
    briefing: 'Het depot is een doolhof van kisten. Streep lege zalen als eerste weg; wat overblijft is klein.',
    cases: [
    { title: 'Kist 4471',              story: 'De kist stond open. Hij had honderd jaar dicht gezeten.', item: '📦 Kist 4471',              difficulty: 'makkelijk', seed: 31101 },
    { title: 'Het mummiemasker',       story: 'Het masker lag naast de sarcofaag. Niet erin.', item: '🎭 Mummiemasker',                     difficulty: 'gemiddeld', seed: 31198 },
    { title: 'Gids Fenna verdwaalt',   story: 'Ze kende elke gang. Behalve deze.', item: '🗺️ Depotplattegrond',                           difficulty: 'gemiddeld', seed: 31295 },
    { title: 'Stof op de planken',     story: 'Overal stof, behalve op één plank.', item: '🪶 Plumeau',                                     difficulty: 'moeilijk',  seed: 31392 },
    { title: 'De koude kamer',         story: 'De koeling stond aan. Iemand had erin gezeten.', item: '🌡️ Koelmeter',                       difficulty: 'gemiddeld', seed: 31489 },
    { title: 'Nachtwaker Ruud rondt af', story: 'Zijn laatste ronde eindigde te vroeg.', item: '🔦 Zaklamp',                              difficulty: 'moeilijk',  seed: 31586 },
    { title: 'Het gebroken vaasje',    story: 'Duizend jaar oud, vannacht in scherven.', item: '🏺 Scherf',                                 difficulty: 'moeilijk',  seed: 31683 },
    { title: 'Onder het museum',       story: 'Onder het depot lag nog een gang.', item: '🧱 Kelderdeur',                                   difficulty: 'moeilijk',  seed: 31780 }
  ]},
  { key: 'museum-5', theme: 'museum', part: 5, icon: '🦖', title: 'Deel V · De nacht van de dino\'s',
    intro: 'De kindernacht: honderd kinderen slapen tussen de skeletten. Als de lichten aangaan, is er iemand die niet meer wakker wordt.',
    outro: 'De kinderen worden opgehaald. Het skelet staat weer compleet.',
    briefing: 'Veel kleine getuigen en veel verwarring. Verklaringen over twee mensen tegelijk: zet eerst degene vast van wie je het meeste weet.',
    cases: [
    { title: 'Slaapzakken in de zaal', story: 'Honderd slaapzakken. Eén ervan was leeg.', item: '🛌 Slaapzak',                              difficulty: 'makkelijk', seed: 41101 },
    { title: 'Het kampvuurverhaal',    story: 'Gids Fenna vertelde een verhaal. De afloop klopte.', item: '📚 Verhalenboek',                difficulty: 'gemiddeld', seed: 41198 },
    { title: 'De verdwenen tand',      story: 'De T. rex miste een tand. De tand miste een T. rex.', item: '🦷 Dinotand',                   difficulty: 'gemiddeld', seed: 41295 },
    { title: 'Stagiair Noor waakt',    story: 'Ze telde de kinderen. Ze vergat de volwassenen.', item: '🔢 Telmachine',                     difficulty: 'moeilijk',  seed: 41392 },
    { title: 'De zaklamp',             story: 'Iemand scheen met een lamp waar geen lamp mocht.', item: '🔦 Kinderzaklamp',                  difficulty: 'gemiddeld', seed: 41489 },
    { title: 'Het skelet beweegt',     story: 'Het skelet stond vanochtend anders.', item: '🦴 Losse wervel',                              difficulty: 'moeilijk',  seed: 41586 },
    { title: 'Professor Adebayo slaapt niet', story: 'Hij las de hele nacht. Zei hij.', item: '👓 Leesbril',                                difficulty: 'moeilijk',  seed: 41683 },
    { title: 'De laatste dino',        story: 'Als het licht aangaat, staat er iemand te veel in de zaal.', item: '🦖 Dino-figuurtje',      difficulty: 'moeilijk',  seed: 41780 }
  ]},
  { key: 'museum-6', theme: 'museum', part: 6, icon: '🗝️', title: 'Deel VI · Het geheim van Vlierbeek',
    intro: 'Achter de Egyptische zaal zit een deur die op geen plattegrond staat. Wat erachter ligt, is ouder dan het museum.',
    outro: 'De deur is dichtgemetseld. Het museum opent morgen gewoon. Jij weet wat erachter zat.',
    briefing: 'Het laatste deel van het museum en de zwaarste zaken. Alles komt terug: hoeken, meubels, rijen. Zet niemand neer voordat je het zeker weet.',
    cases: [
    { title: 'De deur achter de zaal', story: 'Achter de sarcofaag zat een deur. Iemand wist ervan.', item: '🧱 Losse steen',              difficulty: 'makkelijk', seed: 51101 },
    { title: 'Het oude dagboek',       story: 'De stichter schreef alles op. Bijna alles.', item: '📔 Dagboek',                             difficulty: 'gemiddeld', seed: 51198 },
    { title: 'Restaurateur Imke ontdekt', story: 'Onder de verf zat een tweede schilderij.', item: '🎨 Röntgenfoto',                        difficulty: 'moeilijk',  seed: 51295 },
    { title: 'De plattegrond klopt niet', story: 'Eén zaal was groter dan op de tekening.', item: '📐 Meetlint',                            difficulty: 'moeilijk',  seed: 51392 },
    { title: 'Kunsthandelaar Vic bekent', story: 'Hij bekende de diefstal. Niet de moord.', item: '🧾 Bekentenis',                          difficulty: 'gemiddeld', seed: 51489 },
    { title: 'De verborgen zaal',      story: 'Geen ramen, geen deuren, toch voetstappen.', item: '👣 Stofspoor',                           difficulty: 'moeilijk',  seed: 51586 },
    { title: 'Curator Bas kiest',      story: 'Hij mocht één ding redden. Hij koos verkeerd.', item: '⚖️ Weegschaal',                       difficulty: 'moeilijk',  seed: 51683 },
    { title: 'Vlierbeek, het einde',   story: 'De laatste zaal. De laatste naam.', item: '🗝️ Laatste sleutel',                             difficulty: 'moeilijk',  seed: 51780 }
  ]},

  // ── De Nachttrein ───────────────────────────────────────────
  { key: 'trein', theme: 'trein', part: 1, icon: '🚂', title: 'Deel I · Vertrek',
    intro: 'De nachttrein vertrekt om acht uur. Om negen uur ligt de conducteur in de restauratiewagen en stopt de trein pas bij zonsopgang.',
    outro: 'De trein rijdt door de nacht. De reizigers ook.',
    briefing: 'Een trein is lang en smal: wagons liggen naast elkaar. "Links van" en "hoger dan" gelden voor de hele plattegrond, niet voor één wagon.',
    cases: [
    { title: 'Vertrek om acht uur',    story: 'De fluit klonk. Eén reiziger hoorde hem niet meer.', item: '🎫 Treinkaartje',                difficulty: 'makkelijk', seed: 8101 },
    { title: 'De kaartjescontrole',    story: 'De conducteur knipte elk kaartje. Op één na.', item: '🔖 Geknipt kaartje',                   difficulty: 'makkelijk', seed: 8198 },
    { title: 'De koffer in coupé A',   story: 'De koffer was van niemand. Zei iedereen.', item: '🧳 Hutkoffer',                              difficulty: 'makkelijk', seed: 8295 },
    { title: 'Goochelaar Otto verdwijnt', story: 'Hij deed een truc. De truc duurde te lang.', item: '🎩 Hoge hoed',                        difficulty: 'gemiddeld', seed: 8392 },
    { title: 'Thee uit de samovar',    story: 'Het water kookte. De thee stond koud.', item: '🫖 Theeglas',                                  difficulty: 'gemiddeld', seed: 8489 },
    { title: 'De tunnel',              story: 'Vier minuten donker. Genoeg voor één persoon.', item: '🕯️ Kaarsstompje',                    difficulty: 'gemiddeld', seed: 8586 },
    { title: 'Barones Von Stahl klaagt', story: 'Het bed was te hard, de nacht te lang.', item: '💍 Zegelring',                            difficulty: 'moeilijk',  seed: 8683 },
    { title: 'Het licht gaat aan',     story: 'Toen het licht terugkwam, was de conducteur weg.', item: '💡 Wagonlamp',                     difficulty: 'moeilijk',  seed: 8780 }
  ]},
  { key: 'trein-2', theme: 'trein', part: 2, icon: '❄️', title: 'Deel II · De sneeuw',
    intro: 'De trein staat stil in de sneeuw. Geen station, geen hulp, en de dader zit nog aan boord.',
    outro: 'De sneeuwploeg komt. De trein rijdt verder, met één lege coupé.',
    briefing: 'Vast in de sneeuw: iedereen heeft elkaar gezien. "Direct naast" is goud waard in zo\'n smalle trein: elk vakje telt.',
    cases: [
    { title: 'Stilstand',              story: 'De trein stopte. Iemand niet.', item: '⏱️ Zakhorloge',                                       difficulty: 'makkelijk', seed: 18101 },
    { title: 'Stoker Jules schept',    story: 'De kolen waren op. Behalve in één wagon.', item: '⚫ Kolenbrok',                             difficulty: 'makkelijk', seed: 18198 },
    { title: 'Voetstappen in de sneeuw', story: 'Sporen naar de trein. Niet terug.', item: '👢 Sneeuwlaars',                              difficulty: 'gemiddeld', seed: 18295 },
    { title: 'Verpleegster Ans helpt', story: 'Ze hielp iedereen. Eén iemand te goed.', item: '💊 Pillendoosje',                           difficulty: 'gemiddeld', seed: 18392 },
    { title: 'De bevroren deur',       story: 'De deur zat vast. Van binnenuit.', item: '🧊 IJspegel',                                       difficulty: 'gemiddeld', seed: 18489 },
    { title: 'Het pokerspel',          story: 'Vier spelers, drie handen kaarten.', item: '🃏 Speelkaart',                                  difficulty: 'moeilijk',  seed: 18586 },
    { title: 'Actrice Lola repeteert', story: 'Haar tekst klopte. Haar alibi niet.', item: '📜 Toneeltekst',                                difficulty: 'moeilijk',  seed: 18683 },
    { title: 'De sneeuwploeg',         story: 'Toen de ploeg kwam, ontbrak er een reiziger.', item: '🌨️ Sneeuwbol',                        difficulty: 'moeilijk',  seed: 18780 }
  ]},
  { key: 'trein-3', theme: 'trein', part: 3, icon: '🛂', title: 'Deel III · De grens',
    intro: 'Bij de grens komen de douaniers aan boord. Iedereen laat zijn papieren zien. Eén paspoort is vals.',
    outro: 'De grens is over. Het paspoort blijft achter, met zijn eigenaar.',
    briefing: 'Aan de grens liegt iedereen over zijn naam. Verklaringen over rijen en kolommen lopen dwars door de wagons: gebruik het potlood.',
    cases: [
    { title: 'De douane',              story: 'Twee douaniers stapten in. Eén stapte uit.', item: '🛂 Stempel',                            difficulty: 'makkelijk', seed: 28101 },
    { title: 'Het valse paspoort',     story: 'De foto klopte. De naam niet.', item: '🪪 Paspoort',                                         difficulty: 'gemiddeld', seed: 28198 },
    { title: 'Reiziger Sami verkoopt', story: 'Hij verkocht horloges. En iets anders.', item: '⌚ Horloge',                                 difficulty: 'gemiddeld', seed: 28295 },
    { title: 'De postwagen',           story: 'Een brief zonder postzegel, aan niemand gericht.', item: '✉️ Brief',                         difficulty: 'gemiddeld', seed: 28392 },
    { title: 'Schaakmeester Ivo denkt', story: 'Hij zat een uur over één zet. Of over iets anders.', item: '♟️ Schaakstuk',                difficulty: 'moeilijk',  seed: 28489 },
    { title: 'Weduwe Duval huilt',     story: 'Ze huilde om haar man. Die was al tien jaar dood.', item: '🖤 Rouwsluier',                    difficulty: 'moeilijk',  seed: 28586 },
    { title: 'De gewisselde koffers',  story: 'Twee koffers, dezelfde sloten, één verschil.', item: '🔐 Kofferslot',                        difficulty: 'moeilijk',  seed: 28683 },
    { title: 'Grenspost',              story: 'Bij de grens stapte er iemand uit. Zonder kaartje.', item: '🚧 Slagboom',                     difficulty: 'moeilijk',  seed: 28780 }
  ]},
  { key: 'trein-4', theme: 'trein', part: 4, icon: '🌙', title: 'Deel IV · De Oriënt-route',
    intro: 'Een jaar later, dezelfde trein, dezelfde route naar het oosten. Sommige reizigers zijn terug. Dat hadden ze niet moeten doen.',
    outro: 'De trein bereikt Istanbul. De reis is voorbij, voor bijna iedereen.',
    briefing: 'Dezelfde gezichten, een jaar ouder. Lees elke verklaring twee keer: wie zegt waar hij níét was, vertelt je ook iets.',
    cases: [
    { title: 'Terug aan boord',        story: 'Dezelfde coupé. Een andere reden.', item: '🗓️ Reisdagboek',                                 difficulty: 'makkelijk', seed: 38101 },
    { title: 'De grammofoon',          story: 'De plaat draaide. Niemand had hem opgezet.', item: '🎶 Grammofoonplaat',                     difficulty: 'gemiddeld', seed: 38198 },
    { title: 'Goochelaar Otto komt terug', story: 'Zijn tweede truc was beter. Te goed.', item: '🐇 Konijn',                                difficulty: 'gemiddeld', seed: 38295 },
    { title: 'De kroonluchter',        story: 'Eén kristal miste. Het lag drie wagons verderop.', item: '💎 Kristal',                      difficulty: 'moeilijk',  seed: 38392 },
    { title: 'Stoker Jules ziet alles', story: 'Vanaf de locomotief zag hij elke wagon. Zei hij.', item: '🔥 Kolenschep',                  difficulty: 'gemiddeld', seed: 38489 },
    { title: 'De bar sluit',           story: 'De laatste ronde. De laatste gast.', item: '🍸 Cocktailglas',                                difficulty: 'moeilijk',  seed: 38586 },
    { title: 'De nacht zonder maan',   story: 'Aardedonker. Iemand kende de weg.', item: '🌑 Gedoofde lamp',                                difficulty: 'moeilijk',  seed: 38683 },
    { title: 'Barones Von Stahl bekent', story: 'Ze bekende alles. Behalve de moord.', item: '🧾 Bekentenis',                              difficulty: 'moeilijk',  seed: 38780 }
  ]},
  { key: 'trein-5', theme: 'trein', part: 5, icon: '🎻', title: 'Deel V · Het feest in de salonwagen',
    intro: 'Nieuwjaar in de salonwagen. Om twaalf uur gaat het licht uit. Om vijf over twaalf ontbreekt er iemand.',
    outro: 'Het nieuwe jaar begint. De salonwagen is opgeruimd, op één stoel na.',
    briefing: 'Een feest in een smalle wagon: veel mensen, weinig plek. Begin met wie zegt alleen te zijn geweest, dat ruimt een hele wagon op.',
    cases: [
    { title: 'Middernacht in de trein', story: 'Twaalf slagen. Eén gil.', item: '🎉 Feesttoeter',                                          difficulty: 'makkelijk', seed: 48101 },
    { title: 'Het strijkkwartet',      story: 'Vier muzikanten, drie violen.', item: '🎻 Viool',                                            difficulty: 'gemiddeld', seed: 48198 },
    { title: 'Actrice Lola zingt',     story: 'De salon hoorde haar. De bar ook. Onmogelijk.', item: '🎤 Microfoon',                        difficulty: 'gemiddeld', seed: 48295 },
    { title: 'De champagnekoeler',     story: 'Het ijs was gesmolten. Het glas ernaast onaangeraakt.', item: '🧊 IJsemmer',                 difficulty: 'moeilijk',  seed: 48392 },
    { title: 'Reiziger Sami danst',    story: 'Hij danste met iedereen. Behalve met één.', item: '💃 Dansschoen',                           difficulty: 'gemiddeld', seed: 48489 },
    { title: 'Verpleegster Ans telt',  story: 'Ze telde de gasten. Er ontbrak er een. Er was er een te veel.', item: '📝 Gastenlijst',     difficulty: 'moeilijk',  seed: 48586 },
    { title: 'Het vuurwerk',           story: 'Buiten vuurwerk. Binnen een knal.', item: '🎆 Vuurpijl',                                     difficulty: 'moeilijk',  seed: 48683 },
    { title: 'De laatste dans',        story: 'Toen het licht aanging, stond er iemand te veel op de dansvloer.', item: '🥂 Champagneglas', difficulty: 'moeilijk', seed: 48780 }
  ]},
  { key: 'trein-6', theme: 'trein', part: 6, icon: '🏁', title: 'Deel VI · Eindstation',
    intro: 'De laatste rit van de nachttrein. Bij het eindstation wordt hij gesloopt. Iemand wil dat niet meemaken.',
    outro: 'Eindstation. De trein gaat naar de sloop, de dader naar de politie, en jij naar huis.',
    briefing: 'De allerlaatste zaken van de trein en de zwaarste. Wie alleen was in een wagon sluit iedereen daar uit; begin daar.',
    cases: [
    { title: 'De laatste rit',         story: 'De laatste keer dat de fluit klonk.', item: '🚂 Fluit',                                      difficulty: 'makkelijk', seed: 58101 },
    { title: 'Schaakmeester Ivo geeft op', story: 'Hij gaf de partij op. En iets anders.', item: '♚ Koning',                                difficulty: 'gemiddeld', seed: 58198 },
    { title: 'De locomotief',          story: 'Niemand mocht in de locomotief. Iemand was er.', item: '🔧 Moersleutel',                     difficulty: 'moeilijk',  seed: 58295 },
    { title: 'Weduwe Duval pakt in',   story: 'Twee koffers. Eén ervan niet van haar.', item: '🧳 Tweede koffer',                           difficulty: 'moeilijk',  seed: 58392 },
    { title: 'Het laatste diner',      story: 'De kok kookte voor acht. Zeven aten.', item: '🍽️ Zilveren cloche',                          difficulty: 'gemiddeld', seed: 58489 },
    { title: 'De bagagewagen',         story: 'Tussen de koffers lag meer dan bagage.', item: '🏷️ Bagagelabel',                            difficulty: 'moeilijk',  seed: 58586 },
    { title: 'Stoker Jules stookt niet meer', story: 'De ketel was koud. Iemand had het vuur gedoofd.', item: '🧯 Emmer water',             difficulty: 'moeilijk',  seed: 58683 },
    { title: 'Eindstation',            story: 'De trein stopt. De laatste vraag.', item: '🏁 Eindbord',                                     difficulty: 'moeilijk',  seed: 58780 }
  ]}
];

// Eindeloos archief: genummerde dossiers, thema wisselt per dossier,
// moeilijkheid loopt mee. Nooit op.
const ARCHIVE_THEMES = ['landhuis', 'piraten', 'hotel', 'ruimte', 'museum', 'trein'];
const ARCHIVE_STORIES = [
  'Een oud dossier uit het archief. De feiten zijn koud, de vraag niet.',
  'Niemand heeft deze zaak ooit gesloten. Tot nu.',
  'De getuigen zijn het oneens. De plattegrond niet.',
  'Het rapport was kort. Te kort.',
  'Iedereen had een alibi. Eén ervan klopte niet.',
  'Het dossier lag onderop de stapel. Met reden.',
  'De naam van de dader is doorgestreept. Jij vult hem opnieuw in.',
  'Volgens het archief opgelost. Volgens de feiten niet.'
];
const ARCHIVE_DIFF = ['gemiddeld', 'moeilijk', 'gemiddeld', 'makkelijk', 'moeilijk', 'gemiddeld', 'moeilijk'];

const Campaign = {
  KEY: 'crimson-campaign',
  ARCHIVE: 'archief',
  ARCHIVE_UNLOCK: 8,   // campagnezaken nodig om het archief te openen
  list: () => CAMPAIGN,
  chapter: key => CAMPAIGN.find(ch => ch.key === key) || null,
  chaptersFor: themeId => CAMPAIGN.filter(ch => ch.theme === themeId),
  id: (key, idx) => `${key}-${idx}`,
  total: () => CAMPAIGN.reduce((n, ch) => n + ch.cases.length, 0),

  // dossier n (1-based)
  archive(n) {
    const difficulty = n <= 2 ? 'makkelijk' : ARCHIVE_DIFF[n % ARCHIVE_DIFF.length];
    return { chapter: this.ARCHIVE, theme: ARCHIVE_THEMES[(n - 1) % ARCHIVE_THEMES.length], idx: n - 1,
             title: `Dossier ${n}`, story: ARCHIVE_STORIES[(n - 1) % ARCHIVE_STORIES.length], difficulty, seed: 200000 + n * 9973 };
  },
  caseAt(key, idx) {
    if (key === this.ARCHIVE) return this.archive(idx + 1);
    const ch = this.chapter(key);
    return ch && ch.cases[idx] ? { chapter: key, theme: ch.theme, idx, ...ch.cases[idx] } : null;
  },

  progress() {
    try { return JSON.parse((typeof App !== 'undefined' ? App.storageGet(this.KEY) : null) || '{}'); } catch (e) { return {}; }
  },
  stars(key, idx) { return this.progress()[this.id(key, idx)] || 0; },
  doneCount() { return Object.entries(this.progress()).filter(([k, s]) => s > 0 && !k.startsWith(this.ARCHIVE + '-')).length; },
  archiveCount() { return Object.entries(this.progress()).filter(([k, s]) => s > 0 && k.startsWith(this.ARCHIVE + '-')).length; },
  archiveMax() {   // hoogste opgeloste dossiernummer
    return Object.entries(this.progress()).filter(([k, s]) => s > 0 && k.startsWith(this.ARCHIVE + '-'))
      .reduce((m, [k]) => Math.max(m, +k.slice(this.ARCHIVE.length + 1) + 1), 0);
  },
  save(key, idx, stars) {
    const p = this.progress();
    p[this.id(key, idx)] = Math.max(p[this.id(key, idx)] || 0, stars);
    if (typeof App !== 'undefined') App.storageSet(this.KEY, JSON.stringify(p));
  },
  chapterDone(key) {
    const ch = this.chapter(key);
    return !!ch && ch.cases.every((_, i) => this.stars(key, i) > 0);
  },
  // deel 1 volgt het thema (open zodra het thema open is); latere delen: vorige deel af
  chapterOpen(key, themeOpen = true) {
    if (key === this.ARCHIVE) return this.doneCount() >= this.ARCHIVE_UNLOCK;
    const ch = this.chapter(key);
    if (!ch || !themeOpen) return false;
    if (ch.part === 1) return true;
    const prev = this.chaptersFor(ch.theme).find(c => c.part === ch.part - 1);
    return !!prev && this.chapterDone(prev.key);
  },
  // zaak is speelbaar als de vorige gehaald is (ook in het archief: dossier n na n-1)
  isUnlocked(key, idx) { return idx === 0 || this.stars(key, idx - 1) > 0; },
  next(key, idx) {
    if (key === this.ARCHIVE) return this.archive(idx + 2);
    const ch = this.chapter(key);
    if (!ch) return null;
    if (idx + 1 < ch.cases.length) return this.caseAt(key, idx + 1);
    const following = this.chaptersFor(ch.theme).find(c => c.part === ch.part + 1);
    return following ? this.caseAt(following.key, 0) : null;
  },
  // ── Per wereld: sterren, voortgang, de zaak waar je nu bent ──
  worldStars(themeId) { return this.chaptersFor(themeId).reduce((n, ch) => n + ch.cases.reduce((m, _, i) => m + this.stars(ch.key, i), 0), 0); },
  worldTotal(themeId) { return this.chaptersFor(themeId).reduce((n, ch) => n + ch.cases.length, 0); },
  worldDone(themeId) { return this.chaptersFor(themeId).reduce((n, ch) => n + ch.cases.filter((_, i) => this.stars(ch.key, i) > 0).length, 0); },
  // het archief op de kaart: alle opgeloste dossiers, het eerstvolgende open dossier en `extra` dichte
  archiveList(extra = 2) {
    const out = [];
    const archOpen = this.chapterOpen(this.ARCHIVE);
    let n = 1, locked = 0;
    while (locked < extra && n < 10000) {
      const c = this.archive(n);
      const solved = this.stars(this.ARCHIVE, c.idx) > 0;
      const open = !solved && archOpen && this.isUnlocked(this.ARCHIVE, c.idx);
      out.push({ ...c, state: solved ? 'done' : open ? 'open' : 'locked' });
      if (!solved && !open) locked++;
      n++;
    }
    return out;
  },
  // de eerstvolgende speelbare, nog niet opgeloste campagnezaak in een wereld (null als alles af is of dicht)
  current(themeId, themeOpen = true) {
    for (const ch of this.chaptersFor(themeId)) {
      if (!this.chapterOpen(ch.key, themeOpen)) return null;
      for (let i = 0; i < ch.cases.length; i++) {
        if (this.stars(ch.key, i) > 0) continue;
        return this.isUnlocked(ch.key, i) ? this.caseAt(ch.key, i) : null;
      }
    }
    return null;
  },
  // eerstvolgende zaak over alle werelden heen (voor "Verder met de campagne"); daarna het archief
  nextOverall(themeOpenFn, preferTheme) {
    const order = ARCHIVE_THEMES.slice();
    if (preferTheme && order.includes(preferTheme)) order.splice(order.indexOf(preferTheme), 1), order.unshift(preferTheme);
    for (const t of order) {
      const c = this.current(t, themeOpenFn ? themeOpenFn(t) : true);
      if (c) return c;
    }
    const arch = this.archiveList(1).find(c => c.state === 'open');
    return arch ? this.caseAt(this.ARCHIVE, arch.idx) : null;
  },
  threeStarCount() { return Object.entries(this.progress()).filter(([k, s]) => s === 3 && !k.startsWith(this.ARCHIVE + '-')).length; },
  nextChapter(key) { const ch = this.chapter(key); return ch ? this.chaptersFor(ch.theme).find(c => c.part === ch.part + 1) || null : null; },
  lastPart(key) { const ch = this.chapter(key); return !!ch && ch.part === this.chaptersFor(ch.theme).length; },

  // ── Tussenstops op de kaart ────────────────────────────────
  // Halverwege elk deel een minigame (open zodra zaak 4 is opgelost), aan het
  // eind een bewijskist (open zodra het deel af is). Beide net als de
  // oefenrondes en kisten op het pad van Duolingo: kort, en met beloning.
  MINI_AFTER: 4,
  CHEST_POINTS: 300, WORLD_CHEST_POINTS: 1000,
  read(k, fb) { try { const v = JSON.parse((typeof App !== 'undefined' ? App.storageGet(k) : null) || 'null'); return v === null ? fb : v; } catch (e) { return fb; } },
  write(k, v) { if (typeof App !== 'undefined') App.storageSet(k, JSON.stringify(v)); },
  miniKind(key) { const ch = this.chapter(key); return ch && ch.part % 2 === 0 ? 'memory' : 'liar'; },
  miniOpen(key) { return this.stars(key, this.MINI_AFTER - 1) > 0; },
  miniBest(key) { return this.read('crimson-mini', {})[key] || 0; },
  // geeft terug of dit de eerste keer was
  saveMini(key, score) {
    const st = this.read('crimson-mini', {});
    const first = !st[key];
    st[key] = Math.max(st[key] || 0, score);
    this.write('crimson-mini', st);
    return first;
  },
  chestOpened(key) { return this.read('crimson-chests', []).includes(key); },
  stamps() { return this.read('crimson-chests', []); },
  chestReward(key) {
    const world = this.lastPart(key);
    return { points: world ? this.WORLD_CHEST_POINTS : this.CHEST_POINTS, freeze: true, stamp: key, world };
  },
  // opent de kist (één keer); geeft de beloning terug, of null als hij al open was
  openChest(key) {
    if (!this.chapter(key) || !this.chapterDone(key) || this.chestOpened(key)) return null;
    const list = this.read('crimson-chests', []);
    list.push(key);
    this.write('crimson-chests', list);
    return this.chestReward(key);
  },

  // Dezelfde herkansing als Board.start, zodat de test precies kan bewijzen wat de speler krijgt
  generateFor(key, idx, FP, Th) {
    const c = this.caseAt(key, idx);
    if (!c) return null;
    const theme = Th.get(c.theme);
    for (let i = 0; i < 12; i++) {
      const p = FP.generate(c.seed + i * 7919, c.difficulty, theme);
      if (p) return p;
    }
    return null;
  },
  starsFor(hintsUsed, attempts) {
    if (hintsUsed === 0 && attempts === 0) return 3;
    if (hintsUsed === 0 || attempts === 0) return 2;
    return 1;
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = { CAMPAIGN, Campaign };
