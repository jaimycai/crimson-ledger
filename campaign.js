// ============================================================
// CAMPAIGN — vaste reeks zaken per thema, in delen van acht, met
// titel, verhaaltje en oplopende moeilijkheid. Zaken zijn
// deterministisch gegenereerd (vaste seed), dus iedereen speelt
// dezelfde puzzel. Daarnaast een eindeloos archief: genummerde
// dossiers die nooit opraken. Voortgang en sterren lokaal.
// ============================================================

const CAMPAIGN = [
  // ── Het Landhuis ────────────────────────────────────────────
  { key: 'landhuis', theme: 'landhuis', part: 1, title: 'Deel I · Het diner',
    intro: 'Landgoed Blackwood, 1927. Na het diner blijft de gastheer in zijn stoel zitten.',
    outro: 'De geheimen van het diner liggen op tafel. Maar de familie komt terug.',
    cases: [
    { title: 'Het glas Bordeaux',     story: 'De avond begon met een toost en eindigde in stilte.',        difficulty: 'makkelijk', seed: 5101 },
    { title: 'De verdwenen sleutel',  story: 'De studeerkamer zat op slot. Toch niet, zei de butler.',   difficulty: 'makkelijk', seed: 5198 },
    { title: 'Regen op het landgoed', story: 'Het noodweer hield iedereen binnen. Iedereen.',            difficulty: 'makkelijk', seed: 5295 },
    { title: 'De laatste brief',      story: 'Op het bureau lag een brief die nooit is afgemaakt.',       difficulty: 'gemiddeld', seed: 5392 },
    { title: 'Het portret',           story: 'Iemand had het familieportret omgedraaid.',                difficulty: 'gemiddeld', seed: 5489 },
    { title: 'De tuinman zwijgt',     story: 'Het gereedschapsschuurtje was leeg, de tuinman ook.',      difficulty: 'gemiddeld', seed: 5586 },
    { title: 'Het testament',         story: 'Iedereen wist wat erin stond. Eén iemand wist het beter.', difficulty: 'moeilijk',  seed: 5683 },
    { title: 'De Rode Kamer',         story: 'Alles kwam samen in de kamer waar het begon.',             difficulty: 'moeilijk',  seed: 5780 }
  ]},
  { key: 'landhuis-2', theme: 'landhuis', part: 2, title: 'Deel II · De erfgenamen',
    intro: 'Na de begrafenis komt de familie terug. Iedereen wil iets uit het huis.',
    outro: 'De erfenis is verdeeld. Maar het huis heeft nog meer te vertellen.',
    cases: [
    { title: 'De verzegelde deur',     story: 'De notaris had de studeerkamer verzegeld. Het zegel was gebroken.', difficulty: 'makkelijk', seed: 15101 },
    { title: 'Thee om vier uur',       story: 'Het kopje stond nog vol. De stoel ernaast was leeg.',              difficulty: 'makkelijk', seed: 15198 },
    { title: 'Het dagboek van Agnes',  story: 'Tante Agnes schreef alles op. Bijna alles.',                       difficulty: 'gemiddeld', seed: 15295 },
    { title: 'De kapotte klok',        story: 'De klok in de hal stond stil op tien voor negen.',                 difficulty: 'gemiddeld', seed: 15392 },
    { title: 'Voetstappen in de kelder', story: 'Niemand ging ooit naar de kelder. Iemand wel.',                 difficulty: 'gemiddeld', seed: 15489 },
    { title: 'De verwisselde glazen',  story: 'Twee glazen, dezelfde wijn, één verschil.',                        difficulty: 'moeilijk',  seed: 15586 },
    { title: 'Het geheim van de serre', story: 'Achter de planten stond een deur die niemand kende.',            difficulty: 'moeilijk',  seed: 15683 },
    { title: 'De laatste erfgenaam',   story: 'Toen het testament werd gelezen, ontbrak er één naam.',            difficulty: 'moeilijk',  seed: 15780 }
  ]},
  { key: 'landhuis-3', theme: 'landhuis', part: 3, title: 'Deel III · De nacht van de storm',
    intro: 'Het onweer sluit het landgoed af van de wereld. Niemand komt erin, niemand gaat eruit.',
    outro: 'Bij zonsopgang trekt het onweer weg. Landgoed Blackwood heeft geen geheimen meer.',
    cases: [
    { title: 'Het licht valt uit',     story: 'Eén kaars brandde nog, in de verkeerde kamer.',                    difficulty: 'makkelijk', seed: 25101 },
    { title: 'De natte jas',           story: 'Iemand was buiten geweest. Iedereen ontkende.',                    difficulty: 'gemiddeld', seed: 25198 },
    { title: 'De bibliotheekladder',   story: 'De ladder stond bij een plank die nooit werd gebruikt.',           difficulty: 'gemiddeld', seed: 25295 },
    { title: 'Het gebroken raam',      story: 'De scherven lagen binnen. De wind kwam van buiten.',               difficulty: 'gemiddeld', seed: 25392 },
    { title: 'De stille butler',       story: 'Marcus zei niets. Dat was al verdacht genoeg.',                    difficulty: 'moeilijk',  seed: 25489 },
    { title: 'Het portret kijkt mee',  story: 'Vanuit het schilderij kon je de hele eetkamer zien.',              difficulty: 'moeilijk',  seed: 25586 },
    { title: 'Majoor Pike slaapt niet', story: 'De majoor beweerde dat hij sliep. Zijn laarzen niet.',           difficulty: 'moeilijk',  seed: 25683 },
    { title: 'Blackwood zwijgt',       story: 'De laatste nacht. De laatste leugen.',                             difficulty: 'moeilijk',  seed: 25780 }
  ]},

  // ── Het Piratenschip ────────────────────────────────────────
  { key: 'piraten', theme: 'piraten', part: 1, title: 'Deel I · De stille zee',
    intro: 'De Zwarte Meeuw ligt stil op een spiegelgladde zee. De kapitein reageert niet meer.',
    outro: 'De Zwarte Meeuw hijst de zeilen. Er ligt een eiland op de kaart.',
    cases: [
    { title: 'De stille zee',         story: 'Geen wind, geen golven, geen kapitein.',                    difficulty: 'makkelijk', seed: 7101 },
    { title: 'De gestolen kaart',     story: 'De schatkaart was weg. Het lichaam niet.',                  difficulty: 'makkelijk', seed: 7198 },
    { title: 'Rum in het ruim',       story: 'Drie vaten leeg, één bemanningslid stil.',                  difficulty: 'makkelijk', seed: 7295 },
    { title: 'Het kanon zwijgt',      story: 'Niemand hoorde een schot. Toch lag daar iemand.',           difficulty: 'gemiddeld', seed: 7392 },
    { title: 'Muiterij',              story: 'Het gemor begon in de kombuis.',                            difficulty: 'gemiddeld', seed: 7489 },
    { title: 'De schatkist',          story: 'De kist was open. De inhoud niet.',                         difficulty: 'gemiddeld', seed: 7586 },
    { title: 'Storm op komst',        story: 'De lucht werd zwart en de bemanning ook.',                  difficulty: 'moeilijk',  seed: 7683 },
    { title: 'De laatste zeilen',     story: 'Eén persoon zou nooit meer aan wal komen.',                 difficulty: 'moeilijk',  seed: 7780 }
  ]},
  { key: 'piraten-2', theme: 'piraten', part: 2, title: 'Deel II · Het eiland',
    intro: 'De Zwarte Meeuw gaat voor anker bij een naamloos eiland. De schat is dichtbij, en iedereen weet het.',
    outro: 'De schat ligt in het ruim. De rekening is vereffend. Nu nog naar huis.',
    cases: [
    { title: 'Voetsporen in het zand', story: 'De sporen liepen naar het water. Niet terug.',             difficulty: 'makkelijk', seed: 17101 },
    { title: 'De papegaai spreekt',    story: 'De vogel herhaalde één naam. Steeds weer.',                difficulty: 'makkelijk', seed: 17198 },
    { title: 'Het lege vat',           story: 'De rum was op. De vragen niet.',                           difficulty: 'gemiddeld', seed: 17295 },
    { title: 'De valse kaart',         story: 'Er waren twee kaarten. Eén ervan loog.',                   difficulty: 'gemiddeld', seed: 17392 },
    { title: 'Het kompas draait',      story: 'De naald wees naar de kombuis.',                           difficulty: 'gemiddeld', seed: 17489 },
    { title: 'De verdwenen sloep',     story: 'Eén sloep was weg. Alle bemanning was er nog.',            difficulty: 'moeilijk',  seed: 17586 },
    { title: 'Kanonnier Bo telt',      story: 'Twaalf kogels, elf in de kist.',                           difficulty: 'moeilijk',  seed: 17683 },
    { title: 'De vloek van Zwartoog',  story: 'Iedereen geloofde in de vloek. Behalve de dader.',         difficulty: 'moeilijk',  seed: 17780 }
  ]},
  { key: 'piraten-3', theme: 'piraten', part: 3, title: 'Deel III · De thuisvaart',
    intro: 'Met de schat aan boord begint de terugreis. Rijk worden maakt mensen niet eerlijker.',
    outro: 'De Zwarte Meeuw loopt de haven binnen. De bemanning is kleiner, de schat compleet.',
    cases: [
    { title: 'De eerste wacht',        story: 'De nachtwacht viel in slaap. Of dat zei hij.',             difficulty: 'makkelijk', seed: 27101 },
    { title: 'Dokter Sal en het flesje', story: 'Het flesje was leeg. Het etiket was weg.',               difficulty: 'gemiddeld', seed: 27198 },
    { title: 'Storm aan bakboord',     story: 'Alles schoof. Eén ding bleef precies staan.',              difficulty: 'gemiddeld', seed: 27295 },
    { title: 'De scheepskat',          story: 'De kat zat waar ze nooit zat.',                            difficulty: 'gemiddeld', seed: 27392 },
    { title: 'Muiterij, deel twee',    story: 'Dezelfde gezichten. Een ander plan.',                      difficulty: 'moeilijk',  seed: 27489 },
    { title: 'Het touw is gesneden',   story: 'Niemand had een mes. Iedereen had een mes.',               difficulty: 'moeilijk',  seed: 27586 },
    { title: 'Land in zicht',          story: 'De haven was nog een dag weg. Voor één iemand te ver.',    difficulty: 'moeilijk',  seed: 27683 },
    { title: 'De laatste kapitein',    story: 'Wie de Meeuw voert, moet het verdienen.',                  difficulty: 'moeilijk',  seed: 27780 }
  ]},

  // ── Grand Hotel Aurora ──────────────────────────────────────
  { key: 'hotel', theme: 'hotel', part: 1, title: 'Deel I · Nieuwjaarsnacht',
    intro: 'Om klokslag twaalf ging het licht uit. Toen het terugkwam, lag de eigenaar op de marmeren vloer.',
    outro: 'De eerste nacht van het jaar is voorbij. De gasten mogen nog niet naar huis.',
    cases: [
    { title: 'Middernacht',           story: 'Twaalf slagen, één schreeuw.',                              difficulty: 'makkelijk', seed: 9101 },
    { title: 'De verkeerde koffer',   story: 'De koffer op kamer 12 was niet van de gast op kamer 12.',   difficulty: 'makkelijk', seed: 9198 },
    { title: 'Champagne in de bar',   story: 'Het glas was nog koud toen het gebeurde.',                  difficulty: 'makkelijk', seed: 9295 },
    { title: 'De pianist speelt door',story: 'De muziek stopte niet. De gastheer wel.',                   difficulty: 'gemiddeld', seed: 9392 },
    { title: 'Roomservice',           story: 'Het wagentje stond voor de deur. Niemand had gebeld.',      difficulty: 'gemiddeld', seed: 9489 },
    { title: 'De balzaal',            story: 'Honderd gasten, en toch was er maar één getuige.',          difficulty: 'gemiddeld', seed: 9586 },
    { title: 'Sleutel 404',           story: 'Die kamer bestond niet. Die sleutel wel.',                  difficulty: 'moeilijk',  seed: 9683 },
    { title: 'De laatste gast',       story: 'Bij het uitchecken ontbrak er iemand.',                     difficulty: 'moeilijk',  seed: 9780 }
  ]},
  { key: 'hotel-2', theme: 'hotel', part: 2, title: 'Deel II · De gasten',
    intro: 'De nieuwjaarsgasten mogen het hotel niet verlaten. Het personeel ook niet.',
    outro: 'De gasten vertrekken. Het gastenboek heeft een bladzijde minder.',
    cases: [
    { title: 'Kamer 7 is leeg',        story: 'De gast van kamer 7 stond op de lijst. Niet in het bed.',  difficulty: 'makkelijk', seed: 19101 },
    { title: 'Ontbijt voor twee',      story: 'Twee borden, één gast.',                                   difficulty: 'makkelijk', seed: 19198 },
    { title: 'De lift stopt',          story: 'Tussen de derde en de vierde verdieping. Precies lang genoeg.', difficulty: 'gemiddeld', seed: 19295 },
    { title: 'Het portiershuisje',     story: 'De portier zag alles. Behalve dit.',                       difficulty: 'gemiddeld', seed: 19392 },
    { title: 'De vergeten paraplu',    story: 'Het regende niet. Toch was hij nat.',                      difficulty: 'gemiddeld', seed: 19489 },
    { title: 'Mevrouw Sato zingt',     story: 'De bar hoorde haar zingen. De balzaal ook. Onmogelijk.',   difficulty: 'moeilijk',  seed: 19586 },
    { title: 'De wijnkelder',          story: 'Het slot was heel. De fles niet.',                         difficulty: 'moeilijk',  seed: 19683 },
    { title: 'Uitchecken om twaalf',   story: 'Om twaalf uur waren ze weg. Op één na.',                   difficulty: 'moeilijk',  seed: 19780 }
  ]},
  { key: 'hotel-3', theme: 'hotel', part: 3, title: 'Deel III · Het personeel',
    intro: 'Wie het hotel kent, kent de gangen achter de muren. Daar begint dit deel.',
    outro: 'Grand Hotel Aurora dooft de lichten. Deze keer voorgoed.',
    cases: [
    { title: 'De dienstlift',          story: 'Alleen het personeel kende de dienstlift. Blijkbaar niet alleen.', difficulty: 'makkelijk', seed: 29101 },
    { title: 'Chef Rosa proeft',       story: 'De soep was te zout. De kok was er niet.',                 difficulty: 'gemiddeld', seed: 29198 },
    { title: 'De schoonmaakkar',       story: 'De kar stond voor de suite. De suite was leeg.',           difficulty: 'gemiddeld', seed: 29295 },
    { title: 'Pianist Milo zwijgt',    story: 'Voor het eerst in tien jaar bleef de piano dicht.',        difficulty: 'gemiddeld', seed: 29392 },
    { title: 'Het gebroken kristal',   story: 'De kroonluchter miste één steen.',                         difficulty: 'moeilijk',  seed: 29489 },
    { title: 'De kluis',               story: 'De kluis was open. De code kende maar één persoon.',       difficulty: 'moeilijk',  seed: 29586 },
    { title: 'Kamer 404',              story: 'De kamer die niet bestond, was weer gebruikt.',            difficulty: 'moeilijk',  seed: 29683 },
    { title: 'De laatste dienst',      story: 'Aurora sloot voorgoed. Iemand wilde dat niet.',            difficulty: 'moeilijk',  seed: 29780 }
  ]},

  // ── Station Orion ───────────────────────────────────────────
  { key: 'ruimte', theme: 'ruimte', part: 1, title: 'Deel I · Alarm',
    intro: 'De commandant meldt zich niet voor haar dienst. Alle luchtsluizen zijn vergrendeld.',
    outro: 'De sluizen blijven dicht. Dan vangt de antenne iets op.',
    cases: [
    { title: 'Stilte op de brug',     story: 'De commandant meldde zich niet. Nooit meer.',               difficulty: 'makkelijk', seed: 3101 },
    { title: 'Het laboratorium',      story: 'Een reageerbuis kapot, een alibi ook.',                     difficulty: 'makkelijk', seed: 3198 },
    { title: 'De kas',                story: 'Tussen de planten lag meer dan bladeren.',                  difficulty: 'makkelijk', seed: 3295 },
    { title: 'Drukverlies',           story: 'Het alarm ging af. Niet om de druk.',                       difficulty: 'gemiddeld', seed: 3392 },
    { title: 'De onderhoudsrobot',    story: 'De robot had alles gezien, maar zegt niets.',               difficulty: 'gemiddeld', seed: 3489 },
    { title: 'Slaapcyclus',           story: 'Iedereen sliep. Behalve twee mensen.',                      difficulty: 'gemiddeld', seed: 3586 },
    { title: 'Het observatorium',     story: 'De sterren waren de enige getuigen.',                       difficulty: 'moeilijk',  seed: 3683 },
    { title: 'Thuisreis',             story: 'De capsule had plek voor iedereen. Op één na.',             difficulty: 'moeilijk',  seed: 3780 }
  ]},
  { key: 'ruimte-2', theme: 'ruimte', part: 2, title: 'Deel II · Het signaal',
    intro: 'Een signaal van buiten het station. De bemanning raakt verdeeld.',
    outro: 'Het signaal stopt. Aan boord blijft het onrustig.',
    cases: [
    { title: 'Het bericht',            story: 'Het bericht kwam om 03:00. Niemand hoorde het.',           difficulty: 'makkelijk', seed: 13101 },
    { title: 'De defecte sensor',      story: 'Eén sensor viel uit. Precies boven de kantine.',           difficulty: 'makkelijk', seed: 13198 },
    { title: 'Ingenieur Sol soldeert', story: 'Het paneel was open. Het gereedschap weg.',                difficulty: 'gemiddeld', seed: 13295 },
    { title: 'Kok Dima kookt door',    story: 'Het eten stond klaar. Er kwam niemand.',                   difficulty: 'gemiddeld', seed: 13392 },
    { title: 'Sluis twee',             story: 'De sluis ging open. Van binnenuit.',                       difficulty: 'gemiddeld', seed: 13489 },
    { title: 'De koepel draait',       story: 'De koepel wees naar de aarde. Niemand had hem gedraaid.',  difficulty: 'moeilijk',  seed: 13586 },
    { title: 'De robot liegt',         story: 'De logbestanden waren gewist. Bijna allemaal.',            difficulty: 'moeilijk',  seed: 13683 },
    { title: 'Stilte in de kas',       story: 'De planten groeiden. Verder bewoog er niets.',             difficulty: 'moeilijk',  seed: 13780 }
  ]},
  { key: 'ruimte-3', theme: 'ruimte', part: 3, title: 'Deel III · Terugkeer',
    intro: 'De capsule naar huis heeft plaats voor iedereen. Niet iedereen wil mee.',
    outro: 'De capsule koppelt los. Station Orion draait verder, leeg en stil.',
    cases: [
    { title: 'De eerste slaapcyclus',  story: 'Iedereen sliep acht uur. Eén iemand negen.',               difficulty: 'makkelijk', seed: 23101 },
    { title: 'Piloot Reyes checkt',    story: 'De checklist was afgevinkt. Door twee handen.',            difficulty: 'gemiddeld', seed: 23198 },
    { title: 'De lekkende leiding',    story: 'Het water liep naar het laboratorium.',                    difficulty: 'gemiddeld', seed: 23295 },
    { title: 'Kadet Yuki telt',        story: 'Dertien kratten. Gisteren waren het er twaalf.',           difficulty: 'gemiddeld', seed: 23392 },
    { title: 'Dr. Nkemelu twijfelt',   story: 'De dokter wist meer dan het rapport.',                     difficulty: 'moeilijk',  seed: 23489 },
    { title: 'Het lab is verzegeld',   story: 'De deur zat op slot. Aan beide kanten.',                   difficulty: 'moeilijk',  seed: 23586 },
    { title: 'Officier Paz kiest',     story: 'Er was één stoel te weinig in de capsule.',                difficulty: 'moeilijk',  seed: 23683 },
    { title: 'Orion gaat uit',         story: 'De laatste lichten. De laatste vraag.',                    difficulty: 'moeilijk',  seed: 23780 }
  ]}
];

// Eindeloos archief: genummerde dossiers, thema wisselt per dossier,
// moeilijkheid loopt mee. Nooit op.
const ARCHIVE_THEMES = ['landhuis', 'piraten', 'hotel', 'ruimte'];
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
  // zaak is speelbaar als de vorige in het deel gehaald is
  isUnlocked(key, idx) { return idx === 0 || this.stars(key, idx - 1) > 0; },
  next(key, idx) {
    if (key === this.ARCHIVE) return this.archive(idx + 2);
    const ch = this.chapter(key);
    if (!ch) return null;
    if (idx + 1 < ch.cases.length) return this.caseAt(key, idx + 1);
    const following = this.chaptersFor(ch.theme).find(c => c.part === ch.part + 1);
    return following ? this.caseAt(following.key, 0) : null;
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
