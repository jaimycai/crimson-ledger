// ============================================================
// I18N — taal van de app. Nederlands is de brontaal in de code;
// Engels komt uit een woordenboek. Drie manieren:
//   T`Zaak ${n}: ${title}`  — tekst in de code (sjabloon met gaten)
//   T('Verder')             — losse tekst
//   I18n.translateDom()     — vaste tekst in index.html
// Spelinhoud (werelden, zaken, medailles …) wordt bij het opstarten
// ter plekke vervangen (localizeData), dus de rest van de code
// hoeft niets van talen te weten. Wisselen van taal = herladen.
// ============================================================

const I18n = {
  lang: 'nl',
  LANGS: [['nl', 'Nederlands'], ['en', 'English']],
  KEY: 'crimson-lang',
  read() { try { return localStorage.getItem(this.KEY); } catch (e) { return null; } },
  detect() {
    const saved = this.read();
    if (saved === 'nl' || saved === 'en') return saved;
    const nav = (typeof navigator !== 'undefined' && (navigator.language || '')).toLowerCase();
    return nav.startsWith('nl') ? 'nl' : 'en';
  },
  init() {
    this.lang = this.detect();
    if (typeof document !== 'undefined') document.documentElement.lang = this.lang;
    if (this.lang === 'en') { this.localizeData(); this.translateDom(); }
    return this.lang;
  },
  // kiezen in de instellingen: onthouden en opnieuw laden
  set(lang) {
    if (lang !== 'nl' && lang !== 'en') return;
    try { localStorage.setItem(this.KEY, lang); } catch (e) { /* privémodus */ }
    if (typeof App !== 'undefined' && App.storageSet) App.storageSet(this.KEY, lang);
    if (typeof location !== 'undefined' && location.reload) location.reload();
  },

  // ── Tekst in de code ───────────────────────────────────────
  t(key) { return this.lang === 'en' && this.EN[key] ? this.EN[key] : key; },
  template(strings, vals) {
    const key = strings.map((s, i) => s + (i < vals.length ? `{${i}}` : '')).join('');
    const tpl = this.lang === 'en' && this.EN[key] ? this.EN[key] : key;
    return tpl.replace(/\{(\d+)\}/g, (_, i) => String(vals[+i]));
  },

  // ── Vaste tekst in de pagina ───────────────────────────────
  translateDom(root) {
    if (typeof document === 'undefined') return;
    root = root || document.body;
    const D = this.EN;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const p = n.parentNode;
      if (!p || p.nodeName === 'SCRIPT' || p.nodeName === 'STYLE') return;
      const raw = n.nodeValue, key = raw.trim();
      if (key && D[key]) n.nodeValue = raw.replace(key, D[key]);
    });
    root.querySelectorAll('[aria-label],[title],[placeholder]').forEach(el => {
      ['aria-label', 'title', 'placeholder'].forEach(a => {
        const v = el.getAttribute(a);
        if (v && D[v]) el.setAttribute(a, D[v]);
      });
    });
    const title = document.querySelector('title');
    if (title && D[title.textContent]) title.textContent = D[title.textContent];
  },

  // ── Spelinhoud ter plekke vervangen ────────────────────────
  localizeData() {
    const DATA = typeof I18N_DATA !== 'undefined' ? I18N_DATA : null;
    if (!DATA) return;
    // werelden
    if (typeof THEMES !== 'undefined') THEMES.forEach(t => {
      const e = DATA.themes[t.id]; if (!e) return;
      ['title', 'short', 'victimName', 'roomWord', 'roomWordPlural', 'tagline', 'intro', 'outro'].forEach(k => { if (e[k]) t[k] = e[k]; });
      t.rooms.forEach(r => { if (e.rooms[r.name]) r.name = e.rooms[r.name]; r.article = 'the'; });
      t.furniture.forEach(f => { if (e.furniture[f.id]) f.nl = e.furniture[f.id]; });
      t.suspects.forEach(s => { if (e.suspects[s.label]) s.label = e.suspects[s.label]; });
    });
    // campagne
    const CAMP = typeof I18N_CAMPAIGN !== 'undefined' ? I18N_CAMPAIGN : null;
    if (CAMP && typeof CAMPAIGN !== 'undefined') CAMPAIGN.forEach(ch => {
      const e = CAMP[ch.key]; if (!e) return;
      ch.title = e[0]; ch.intro = e[1]; ch.outro = e[2]; ch.briefing = e[3];
      ch.cases.forEach((c, i) => { const x = e[4][i]; if (x) { c.title = x[0]; c.story = x[1]; c.item = x[2]; } });
    });
    if (typeof ARCHIVE_STORIES !== 'undefined' && DATA.archiveStories) ARCHIVE_STORIES.splice(0, ARCHIVE_STORIES.length, ...DATA.archiveStories);
    // titels, medailles, opdrachten
    if (typeof DAILY_TITLES !== 'undefined') DAILY_TITLES.splice(0, DAILY_TITLES.length, ...DATA.daily);
    if (typeof WEEK_TITLES !== 'undefined') Object.keys(DATA.week).forEach(k => { WEEK_TITLES[k] = DATA.week[k]; });
    if (typeof Progress !== 'undefined') {
      Progress.MEDALS.forEach(m => { const e = DATA.medals[m.id]; if (e) { m.title = e[0]; m.hint = e[1]; } });
      Progress.QUESTS.forEach(q => { if (DATA.quests[q.id]) q.text = DATA.quests[q.id]; });
    }
    // Van Dam
    if (typeof Mentor !== 'undefined') {
      Mentor.name = DATA.mentorName;
      Mentor.TIPS.forEach(t => { if (DATA.tips[t[0]]) t[1] = DATA.tips[t[0]]; });
      Mentor.INTROS.forEach(i => { const e = DATA.intros[i.id]; if (e) { i.title = e[0]; i.text = e[1]; } });
      Mentor.REACT_WRONG.splice(0, Mentor.REACT_WRONG.length, ...DATA.reactWrong);
      Mentor.REACT_RIGHT.splice(0, Mentor.REACT_RIGHT.length, ...DATA.reactRight);
    }
    // rangen, niveaus, oefenzaak
    if (typeof App !== 'undefined' && App.RANKS) App.RANKS.forEach(r => { if (DATA.ranks[r[1]]) r[1] = DATA.ranks[r[1]]; });
    if (typeof DIFFICULTY !== 'undefined') Object.keys(DATA.difficulty).forEach(k => { if (DIFFICULTY[k]) DIFFICULTY[k].label = DATA.difficulty[k]; });
    if (typeof Board !== 'undefined' && Board.TUTORIAL_STEPS) Board.TUTORIAL_STEPS.forEach((s, i) => { if (DATA.boardTutorial[i]) s.text = DATA.boardTutorial[i]; });
  },

  // ── Woordenboek: Nederlands → Engels ───────────────────────
  EN: {
    // titel en startscherm
    'Crimson Ledger — Speur. Redeneer. Ontmasker.': 'Crimson Ledger — Search. Reason. Unmask.',
    'Speur. Redeneer. Ontmasker.': 'Search. Reason. Unmask.',
    'Een moordmysterie logic-puzzel': 'A murder-mystery logic puzzle',
    'Begin': 'Start', 'Verder': 'Continue', 'Laden': 'Loading',
    'Elke puzzel ontmaskert een moordenaar': 'Every puzzle unmasks a murderer',
    // startscherm
    'Alle {0}': 'All {0}', 'Ma,Di,Wo,Do,Vr,Za,Zo': 'Mo,Tu,We,Th,Fr,Sa,Su', 'jan,feb,mrt,apr,mei,jun,jul,aug,sep,okt,nov,dec': 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec', '📁 Het archief · eindeloos': '📁 The archive · endless',
    'Basis': 'Base', 'Tijdbonus': 'Time bonus', 'Zonder hint': 'No hint', 'In één keer': 'First try', 'Archiefdossier': 'Archive file',
    'Dagelijkse zaak': 'Daily case', 'Zaak van vandaag': "Today's case", '🪙 +150 punten': '🪙 +150 points', 'Speel': 'Play',
    'dagen streak': 'day streak', 'Speel vandaag om je streak te houden': 'Play today to keep your streak',
    'Opdrachten van vandaag': "Today's quests", 'Zaak van de week': 'Case of the week', '🪙 +300 punten': '🪙 +300 points',
    '📤 Deel resultaat': '📤 Share result', 'Start': 'Start', 'Verder met de campagne:': 'Continue the campaign:', 'Deel I · Zaak 1': 'Part I · Case 1',
    'Vrij spelen': 'Free play', 'Kies zelf de wereld en het niveau': 'Pick the world and the level yourself',
    'Klassiek deductieraster': 'Classic deduction grid', '📅 Dagelijkse rasterzaak ·': '📅 Daily grid case ·', 'Vrij spel (raster)': 'Free play (grid)', '🎓 Raster-oefenzaak': '🎓 Grid practice case',
    'Hoe werkt het?': 'How does it work?', '🎓 Oefenzaak': '🎓 Practice case', '🏅 Vitrine': '🏅 Cabinet', '🔊 Geluid aan': '🔊 Sound on', '🔇 Geluid uit': '🔇 Sound off',
    'Rang en onderscheidingen': 'Rank and awards',
    // vrij spelen
    '🎲 Vrij spelen': '🎲 Free play', 'Wereld': 'World', 'Moeilijkheidsgraad': 'Difficulty', 'Makkelijk': 'Easy', 'Opwarmer': 'Warm-up', 'Gemiddeld': 'Medium', 'Echt puzzelen': 'Real puzzling',
    'Moeilijk': 'Hard', 'Voor speurneuzen': 'For sleuths', 'Start zaak': 'Start case',
    'Vrij spel telt mee voor je rang en punten, niet voor de campagnesterren.': 'Free play counts towards your rank and points, not the campaign stars.',
    // klassiek raster
    'Zaak — De Rode Kamer': 'Case — The Red Room', 'De Rode Kamer': 'The Red Room', 'Begin Onderzoek': 'Start Investigation', 'Stap 1 van 5': 'Step 1 of 5', 'Overslaan': 'Skip',
    '📋 Aanwijzingen': '📋 Clues', '💡 Hint': '💡 Hint', '↺ Reset': '↺ Reset', '✓ Controleer': '✓ Check',
    // kaart
    '🗺️ Wereldkaart': '🗺️ World map', 'Per zaak:': 'Per case:', 'zonder hint én in één keer ·': 'no hint and first try ·', 'één van de twee ·': 'one of the two ·', 'opgelost': 'solved',
    'Vitrine & Bureau': 'Cabinet & Desk', 'Onderscheidingen': 'Awards', 'Vitrine': 'Cabinet',
    // bord
    'Sleep een verdachte naar een vakje, of tik eerst de verdachte en dan het vakje. Alleen de moordenaar was in de kamer van het slachtoffer.': 'Drag a suspect to a square, or tap the suspect first and then the square. Only the murderer was in the room of the victim.',
    'Stap 1 van 4': 'Step 1 of 4', 'Alle': 'All', 'Plaats': 'Place', 'Potlood': 'Pencil', 'Gum': 'Eraser', 'Terug': 'Undo', 'Hint': 'Hint', 'Controleer': 'Check',
    'Vorige verklaring': 'Previous statement', 'Volgende verklaring': 'Next statement', 'Meer tekst of groter bord': 'More text or bigger board', 'Verklaring afvinken': 'Tick off statement',
    'Wie heeft de moord gepleegd?': 'Who committed the murder?', '← Terug naar het bord': '← Back to the board',
    '🎯 Wie liegt?': '🎯 Who is lying?',
    // resultaat
    'Zaak Opgelost!': 'Case Solved!', 'Zaak Gesloten': 'Case Closed', 'Totaal': 'Total', '0 punten': '0 points', 'Tijd': 'Time', 'Moeilijkheid': 'Difficulty', 'Hints': 'Hints', 'Pogingen': 'Attempts',
    'Hierna': 'Up next', '▶ Volgende zaak': '▶ Next case', '🔔 Herinner me morgen aan de dagelijkse zaak': '🔔 Remind me of the daily case tomorrow', '🗺️ Naar de kaart': '🗺️ To the map', 'Naar het menu': 'To the menu',
    // hoe werkt het
    'Hoe Werkt Het?': 'How Does It Work?', 'Plaats de verdachten': 'Place the suspects',
    'Sleep een verdachte naar een vakje op de plattegrond, of tik eerst de verdachte en dan het vakje. Sleep iemand van het bord af om hem weg te halen. Twijfel je? Met': 'Drag a suspect to a square on the floor plan, or tap the suspect first and then the square. Drag someone off the board to remove them. Not sure? With',
    'zet je een stipje op vakjes waar iemand zou kúnnen staan;': 'you put a dot on squares where someone could stand;', 'haalt stipjes en verdachten weer weg.': 'removes dots and suspects again.',
    'Lees de verklaringen': 'Read the statements',
    'Elke verdachte vertelt waar hij stond. Tik op een verklaring: de kamer of het meubel licht op in de plattegrond. Tik op een meubel om te zien wat het is. Klopt een verklaring met wat je hebt neergezet, dan wordt de kaart groen; klopt hij niet, dan wordt hij rood. "In een hoek" is een hoekvakje, "tegen een muur" raakt een muur maar is geen hoek.': 'Every suspect tells you where they stood. Tap a statement: the room or the furniture lights up on the floor plan. Tap a piece of furniture to see what it is. If a statement matches what you have placed, the card turns green; if not, it turns red. "In a corner" is a corner square, "against a wall" touches a wall but is not a corner.',
    'De spelregel': 'The rule', 'Alleen de moordenaar was in de kamer van het slachtoffer. Niemand anders.': 'Only the murderer was in the room of the victim. Nobody else.',
    'Wijs de moordenaar aan': 'Name the murderer', 'Staat iedereen goed? Dan kies je wie alleen was met het slachtoffer.': 'Is everyone in place? Then choose who was alone with the victim.',
    'Klassiek raster': 'Classic grid', 'Lees de aanwijzingen': 'Read the clues', 'Elke aanwijzing vertelt je iets over wie, wat en waar.': 'Every clue tells you something about who, what and where.',
    'Vul het raster in': 'Fill in the grid', 'Klik op een cel om te wisselen: leeg → ✗ (uitgesloten) → ✓ (bevestigd).': 'Tap a cell to cycle: empty → ✗ (ruled out) → ✓ (confirmed).',
    'Gebruik logica': 'Use logic', 'Als een rij maar één optie heeft, is dat de match. Kruis-verwijs tussen tabellen!': 'If a row has only one option left, that is the match. Cross-reference between tables!',
    'Controleer je antwoord': 'Check your answer', 'Als je denkt dat je alles hebt, klik op "Controleer".': 'When you think you have everything, tap "Check".', 'Begrepen!': 'Got it!',
    // hint en uitleg
    'Inspecteur Van Dam': 'Inspector Van Dam', '1 · Kijk naar': '1 · Look at', '2 · Dat betekent': '2 · That means', '3 · Doe dit': '3 · Do this', 'Laat zien op het bord': 'Show me on the board',
    'Alle verklaringen': 'All statements', 'Tik een verklaring om hem op het bord te bekijken.': 'Tap a statement to see it on the board.', 'Sluiten': 'Close',
    'Aan de slag': "Let's go", 'Nieuw deel': 'New part', 'Deel voltooid': 'Part complete', 'Nieuw in dit deel': 'New in this part', 'Begrepen': 'Got it', 'Open de bewijskist': 'Open the evidence chest',
    // instellingen en winkel
    'Instellingen': 'Settings', 'Privacy': 'Privacy', 'Privacyverklaring ↗': 'Privacy policy ↗', 'Hulp': 'Help', 'Support ↗': 'Support ↗', '🔔 Dagelijkse herinnering (18:30)': '🔔 Daily reminder (18:30)',
    '🎨 Uiterlijk': '🎨 Appearance', '🛒 Winkel': '🛒 Shop', 'Crimson Pass': 'Crimson Pass', 'Aankopen herstellen': 'Restore purchases', 'Herstellen': 'Restore',
    'Alle voortgang wissen': 'Erase all progress', 'Wissen': 'Erase', '· gemaakt in Nederland': '· made in the Netherlands', '🌍 Taal': '🌍 Language',
    'Alles, voor altijd': 'Everything, forever', '🗺️ Alle werelden, ook de werelden die nog komen': '🗺️ All worlds, including the ones still to come', '💡 Onbeperkt hints': '💡 Unlimited hints',
    "🎨 Alle bordthema's en portretlijsten": '🎨 All board themes and portrait frames', '🧊 Twee extra vrije dagen op voorraad': '🧊 Two extra streak freezes in stock', 'Crimson Pass · € 4,99': 'Crimson Pass · € 4.99',
    'Eenmalige aankopen via je Apple ID, geen abonnement. Landhuis, Piratenschip, de dagelijkse zaak, de zaak van de week en het archief blijven altijd gratis.': 'One-off purchases through your Apple ID, no subscription. The Manor, the Pirate Ship, the daily case, the case of the week and the archive always stay free.',
    'Onderscheiding verdiend!': 'Award earned!',
    // ── code: kaart ──
    'Kon geen plattegrond genereren, probeer opnieuw.': 'Could not generate a floor plan, please try again.',
    'Alles opgelost': 'All solved', '✓ Alles opgelost': '✓ All solved',
    'Archief · {0}': 'Archive · {0}', '{0} · Zaak {1}': '{0} · Case {1}',
    '{0} van {1} zaken opgelost': '{0} of {1} cases solved',
    '📁 Het archief · eindeloos': '📁 The archive · endless',
    '{0} van {1} zaken · ★ {2}/{3}': '{0} of {1} cases · ★ {2}/{3}',
    '🔒 Deze wereld hoort bij de Crimson Pass, of koop hem los voor {0}. De dagelijkse zaak en de zaak van de week spelen hier gratis.': '🔒 This world is part of the Crimson Pass, or buy it separately for {0}. The daily case and the case of the week are free here.',
    '🔒 Los nog {0} {1} op (vrij spel of dagelijks) om deze wereld te openen': '🔒 Solve {0} more {1} (free play or daily) to open this world',
    'zaak': 'case', 'zaken': 'cases', 'dag': 'day', 'dagen': 'days', 'hint': 'hint', 'hints': 'hints',
    'nog {0} {1}': '{0} more {1}', '🔒 Pass': '🔒 Pass', '🛒 Ontgrendel {0}': '🛒 Unlock {0}',
    'Wie liegt?': 'Who is lying?', 'Vluchtige blik': 'Quick glance', 'geopend': 'opened', 'Open mij!': 'Open me!', 'bewijskist': 'evidence chest', 'Minigame {0}': 'Mini-game {0}', 'Bewijskist': 'Evidence chest',
    'Los eerst zaak {0} op, dan gaat deze minigame open.': 'Solve case {0} first, then this mini-game opens.',
    'Maak eerst alle acht zaken van dit deel af, dan gaat de bewijskist open.': 'Finish all eight cases of this part first, then the evidence chest opens.',
    'Deze kist is al open. De stempel staat in de vitrine.': 'This chest is already open. The stamp is in the cabinet.',
    '▶ Speel {0}': '▶ Play {0}', 'zaak {0} · {1}': 'case {0} · {1}',
    '{0} hoort bij de Crimson Pass. Ontgrendel de wereld in de winkel, of speel hier de dagelijkse zaak.': '{0} is part of the Crimson Pass. Unlock the world in the shop, or play the daily case here.',
    'Los eerst {0} zaken op (vrij spel of dagelijks) om {1} te openen.': 'Solve {0} cases first (free play or daily) to open {1}.',
    'Het archief opent na {0} campagnezaken.': 'The archive opens after {0} campaign cases.',
    'Los eerst het vorige dossier op.': 'Solve the previous file first.', 'Maak eerst het vorige deel af.': 'Finish the previous part first.', 'Los eerst zaak {0} op.': 'Solve case {0} first.',
    'Zaak {0}: {1}': 'Case {0}: {1}', 'Zaak {0}: ': 'Case {0}: ',
    '★★★ = zonder hint én in één keer goed · ★★ = één van de twee · ★ = opgelost': '★★★ = no hint and right first time · ★★ = one of the two · ★ = solved',
    'Beste score:': 'Best score:', 'Speel opnieuw': 'Play again', 'Deze zaak kon niet geladen worden.': 'This case could not be loaded.',
    // nieuw deel, kist
    '✨ Nieuwe wereld': '✨ New world', 'Nieuw deel · {0} van {1}': 'New part · {0} of {1}',
    '{0} verdachten, {1} delen, {2} zaken. Halverwege elk deel een minigame, aan het eind een bewijskist.': '{0} suspects, {1} parts, {2} cases. A mini-game halfway through every part, an evidence chest at the end.',
    'Halverwege wacht een minigame, aan het eind een bewijskist: punten, een vrije dag en een stempel.': 'A mini-game waits halfway, an evidence chest at the end: points, a streak freeze and a stamp.',
    'Begin {0}': 'Start {0}', '🏆 Wereld voltooid!': '🏆 World complete!', '✓ Deel voltooid': '✓ Part complete', 'Deze kist is al open.': 'This chest is already open.',
    'Alle {0} zaken van {1} opgelost. Tik op de kist.': 'All {0} cases of {1} solved. Tap the chest.', 'Alle acht zaken opgelost. Tik op de bewijskist.': 'All eight cases solved. Tap the evidence chest.',
    '🪙 +{0} punten': '🪙 +{0} points', '🧊 Een vrije dag': '🧊 A streak freeze', '{0} Stempel: {1}': '{0} Stamp: {1}', 'Al geopend': 'Already opened',
    '{0} is helemaal opgelost. Wat een speurder.': '{0} is completely solved. What a sleuth.', 'Goed werk, Rekruut. Dit is van jou.': 'Good work, Recruit. This is yours.',
    // winkel
    'Je gratis hints voor vandaag zijn op ({0} per dag). Morgen krijg je er weer {1}, of kies hieronder.': 'Your free hints for today are used up ({0} a day). Tomorrow you get {1} again, or choose below.',
    '{0} hoort bij de Crimson Pass. Je kunt de wereld ook los kopen.': '{0} is part of the Crimson Pass. You can also buy the world separately.',
    "Bordthema's en portretlijsten horen bij de Crimson Pass, of koop ze los.": 'Board themes and portrait frames are part of the Crimson Pass, or buy them separately.',
    '✓ Je hebt de Crimson Pass': '✓ You have the Crimson Pass', 'Crimson Pass · {0}': 'Crimson Pass · {0}', 'Los te koop': 'Sold separately', 'Werelden': 'Worlds',
    '{0} hints': '{0} hints', 'Met de Pass zijn hints onbeperkt.': 'With the Pass, hints are unlimited.', 'Je hebt er nu {0}. Elke dag krijg je {1} gratis.': 'You have {0} now. Every day you get {1} for free.',
    "Bordthema's en lijsten": 'Board themes and frames', 'Nacht, sepia en kraftpapier; gouden, zilveren en crimson lijst.': 'Night, sepia and kraft paper; gold, silver and crimson frame.',
    '{0} zaken in {1} delen · {2}': '{0} cases in {1} parts · {2}', '✓ Van jou': '✓ Yours',
    'Aankopen werken alleen in de app uit de App Store.': 'Purchases only work in the app from the App Store.',
    '{0} hints erbij. Veel speurplezier!': '{0} more hints. Happy sleuthing!', 'Welkom bij de Crimson Pass: alles staat open.': 'Welcome to the Crimson Pass: everything is open.', 'Gekocht! Veel speurplezier.': 'Purchased! Happy sleuthing.',
    'De aankoop wacht op goedkeuring (bijvoorbeeld van een ouder).': 'The purchase is waiting for approval (for example from a parent).', 'De aankoop is niet gelukt. Probeer het later nog eens.': 'The purchase failed. Please try again later.',
    'Herstellen werkt alleen in de app uit de App Store.': 'Restoring only works in the app from the App Store.', 'Je aankopen zijn hersteld.': 'Your purchases have been restored.', 'Geen eerdere aankopen gevonden voor dit Apple ID.': 'No earlier purchases found for this Apple ID.',
    'Bordthema en lijst om je rang': 'Board theme and frame around your rank', "Bordthema's en lijsten zitten in de Crimson Pass": 'Board themes and frames are part of the Crimson Pass',
    'Papier': 'Paper', 'Nacht': 'Night', 'Sepia': 'Sepia', 'Kraftpapier': 'Kraft paper', 'Geen lijst': 'No frame', 'Gouden lijst': 'Gold frame', 'Zilveren lijst': 'Silver frame', 'Crimson lijst': 'Crimson frame',
    // thuis
    'Zaak van vandaag: {0}': "Today's case: {0}", '{0} {1}. {2}': '{0} {1}. {2}', '✓ Vandaag opgelost': '✓ Solved today', 'Nog een zaak': 'Another case',
    'Opgelost! Week {0} · {1} {2}. Volgende week ligt er een nieuwe zaak.': 'Solved! Week {0} · {1} {2}. A new case is waiting next week.',
    'Week {0} · {1} {2} · moeilijk. Elke week één speciale zaak; iedereen speelt dezelfde. Deel je resultaat met andere speurders.': 'Week {0} · {1} {2} · hard. One special case every week; everyone plays the same one. Share your result with other sleuths.',
    '✓ Opgelost': '✓ Solved', 'Nog eens': 'Again',
    'Vandaag gespeeld. Tot morgen!': 'Played today. See you tomorrow!', 'Nog niet gespeeld. Een vrije dag vangt het op, maar liever niet.': 'Not played yet. A streak freeze would catch it, but better not.',
    'Je streak van {0} dagen loopt vanavond af. Speel één zaak.': 'Your {0}-day streak ends tonight. Play one case.', 'Speel vandaag om je streak van {0} dagen te houden': 'Play today to keep your {0}-day streak',
    '🧊 {0} vrije {1}': '🧊 {0} streak {1}', 'vrije dag': 'freeze', 'freezes': 'freezes', 'Mis je een dag, dan vult een vrije dag het gat en blijft je streak staan.': 'Miss a day and a streak freeze fills the gap so your streak survives.',
    '🎁 Alles klaar! Tot morgen.': '🎁 All done! See you tomorrow.', '🎁 Alle drie: +{0} punten en een vrije dag': '🎁 All three: +{0} points and a streak freeze', '+{0}': '+{0}',
    '🪙 {0} punten': '🪙 {0} points', 'Medailleoverzicht': 'Medal overview', '{0} van de {1} behaald': '{0} of {1} earned', 'Behaald op {0}': 'Earned on {0}', 'Bewijsstukken': 'Evidence', '{0} van de {1} verzameld': '{0} of {1} collected', 'Gesloten': 'Locked', 'Stempels': 'Stamps',
    'Nieuwe trofee: “{0}” ontgrendeld.': 'New trophy: “{0}” unlocked.',
    'Meldingen staan uit. Zet ze aan bij Instellingen › Crimson Ledger.': 'Notifications are off. Turn them on in Settings › Crimson Ledger.',
    'Je dagelijkse zaak wacht. Houd je streak van {0} dagen vast.': 'Your daily case is waiting. Keep your {0}-day streak going.', 'Je streak van {0} dagen loopt vanavond af. Eén zaak is genoeg.': 'Your {0}-day streak ends tonight. One case is enough.',
    'Er ligt een nieuwe zaak op je bureau. Wie was alleen met het slachtoffer?': 'A new case is on your desk. Who was alone with the victim?',
    'Zeker? Tik nogmaals': 'Sure? Tap again', 'Ingesteld: elke dag om 18:30 een herinnering.': 'Set: a reminder every day at 18:30.', 'Alle voortgang is gewist.': 'All progress has been erased.',
    'Los nog {0} {1} op om {2} te openen. De dagelijkse zaak telt mee.': 'Solve {0} more {1} to open {2}. The daily case counts.',
    '{0} verdachten · {1} bij {2} vakjes': '{0} suspects · {1} by {2} squares',
    'nog {0} {1} tot {2}': '{0} more {1} until {2}', 'hoogste rang bereikt': 'highest rank reached', 'Hoogste rang bereikt': 'Highest rank reached',
    'Vandaag opgelost ✓': 'Solved today ✓', 'Vandaag: {0}': 'Today: {0}', 'Nog geen zaak opgelost. Vandaag de eerste?': 'No case solved yet. The first one today?',
    '{0} {1} opgelost': '{0} {1} solved', ' · {0} zonder hint': ' · {0} without a hint', ' · beste: {0}': ' · best: {0}',
    'Resultaat gekopieerd naar klembord!': 'Result copied to clipboard!', 'Delen wordt niet ondersteund in deze browser.': 'Sharing is not supported in this browser.',
    'Vrije dag gebruikt: je streak van {0} dagen is gered.': 'Streak freeze used: your {0}-day streak is saved.', '{0} dagen op rij! Je hebt een vrije dag verdiend voor als je een dag mist.': '{0} days in a row! You earned a streak freeze for when you miss a day.',
    'Opdracht klaar: {0} (+{1} punten)': 'Quest done: {0} (+{1} points)', 'Alle opdrachten klaar: +{0} punten en een vrije dag': 'All quests done: +{0} points and a streak freeze',
    '🔥 {0} dagen streak!': '🔥 {0}-day streak!',
    // ── code: bord ──
    '🗓️ Week {0}': '🗓️ Week {0}', '📁 {0}': '📁 {0}', '📖 {0}. {1}': '📖 {0}. {1}', 'Stap {0} van {1}': 'Step {0} of {1}',
    'In deze zaak zegt {0}: “{1}”': 'In this case {0} says: “{1}”',
    '✓ Klopt': '✓ Holds', '✗ Klopt niet': '✗ Does not hold',
    'Hint {0} · deze zaak levert nu maximaal ★★ op': 'Hint {0} · this case now earns at most ★★', ' · nog {0} {1}': ' · {0} {1} left',
    '📜 De spelregel: alleen de moordenaar was in de {0} van het slachtoffer.': '📜 The rule: only the murderer was in the {0} of the victim.',
    'Potlood: zet een stipje op vakjes waar iemand zou kúnnen staan. Met Plaats zet je iemand echt neer, met Gum haal je het weer weg.': 'Pencil: put a dot on squares where someone could stand. With Place you really put someone down, with Eraser you remove it again.',
    'Bijna! Nog één verdachte staat verkeerd. {0} van de {1} staan al goed.': 'Almost! One suspect is still wrong. {0} of the {1} are already right.',
    '{0} verdachten staan verkeerd, {1} staan goed. Gebruik een hint als je vastzit.': '{0} suspects are wrong, {1} are right. Use a hint if you are stuck.',
    'Iedereen staat op zijn plek. Wie was alleen met het slachtoffer in {0} {1}?': 'Everyone is in place. Who was alone with the victim in {0} {1}?',
    'Goed gedaan!': 'Well done!', '{0} was alleen met het slachtoffer in {1} {2}.': '{0} was alone with the victim in {1} {2}.',
    'Zo werkt elke zaak: plaats iedereen met de verklaringen, en wijs dan aan wie alleen was met het slachtoffer. Tijd voor een echte zaak.': 'This is how every case works: place everyone using the statements, then name who was alone with the victim. Time for a real case.',
    '{0} punten': '{0} points', 'Volgende: {0} · nog {1} {2}': 'Next: {0} · {1} more {2}', 'Van Dam merkt op': 'Van Dam remarks', 'Waar iedereen stond': 'Where everyone stood',
    '▶ Volgende zaak: {0}': '▶ Next case: {0}', '{0}. {1}': '{0}. {1}', 'af!': 'done!', 'nog 1 zaak': '1 case left', 'nog {0} zaken': '{0} cases left', '▶ Nog een zaak · {0}': '▶ Another case · {0}',
    ' punten': ' points', ' · Zaak van de week: {0}': ' · Case of the week: {0}', ' · Dag #{0}': ' · Day #{0}', 'Dagelijkse zaak ': 'Daily case ',
    // ── code: minigame ──
    '👁️ Vluchtige blik': '👁️ Quick glance', 'Ronde {0}: iedereen staat op zijn plek. Wie liegt?': 'Round {0}: everyone is in place. Who is lying?', 'Ronde {0}: kijk goed waar iedereen staat…': 'Round {0}: look carefully where everyone stands…',
    '👁️ Onthoud het… ': '👁️ Remember it… ', 'Waar stond {0}?': 'Where was {0}?', 'Goed gezien! +{0} punten': 'Well spotted! +{0} points', 'Nee: {0} loog.': 'No: {0} was lying.', 'Nee, daar stond {0}.': 'No, that is where {0} stood.',
    'Scherp gezien!': 'Sharp eyes!', 'Bijna allemaal': 'Almost all of them', 'Volgende keer beter': 'Better luck next time', '{0} van de {1} goed': '{0} of {1} right', ' · <b>+{0} punten</b>': ' · <b>+{0} points</b>', ' (eerste keer alles goed: bonus!)': ' (all right first time: bonus!)',
    '🔁 Nog een keer': '🔁 Once more', '🗺️ Terug naar de kaart': '🗺️ Back to the map',
    // ── code: Van Dam ──
    'Je hebt je nieuwe rang verdiend, {0}. Ik zou zeggen: op naar de volgende zaak.': 'You have earned your new rank, {0}. I would say: on to the next case.',
    'De zaak van de week is gesloten, {0}. Deel het resultaat, dan weet de rest van het bureau het ook.': 'The case of the week is closed, {0}. Share the result so the rest of the office knows too.',
    'Uitstekend speurwerk, {0}. Geen hint, geen fout. Zo hoort het.': 'Excellent detective work, {0}. No hint, no mistake. That is how it should be.',
    'Vlekkeloos, {0}. Ik had het zelf niet beter gekund.': 'Flawless, {0}. I could not have done it better myself.',
    'Drie sterren. De dader had geen schijn van kans, {0}.': 'Three stars. The culprit never stood a chance, {0}.',
    'Zonder hint, {0}. Volgende keer ook in één keer?': 'No hint, {0}. Next time first try as well?',
    'Goed gezien, {0}. Eén foute gok, maar je hebt hem.': 'Well spotted, {0}. One wrong guess, but you got them.',
    'In één keer goed, {0}. Probeer het de volgende keer eens zonder hint.': 'Right first time, {0}. Next time try it without a hint.',
    'Opgelost, {0}. Hints zijn er om te gebruiken, maar kijk of je ze de volgende keer kunt missen.': 'Solved, {0}. Hints are there to be used, but see if you can do without them next time.',
    'De zaak is rond, {0}. Lees de verklaringen twee keer, dan heb je de hints niet nodig.': 'The case is closed, {0}. Read the statements twice and you will not need the hints.',
    'Rekruut': 'Recruit',
    // uitleg van een verklaring
    '{0} moet ergens in {1} staan. Elk vrij vakje van die {2} kan.': '{0} must be somewhere in {1}. Any free square of that {2} will do.',
    '{0} mag overal staan, behalve in {1}.': '{0} can stand anywhere except in {1}.',
    '{0} staat {1}': '{0} stands {1}', '{0} staat {1} In welke {2} weet je nog niet.': '{0} stands {1} Which {2} you do not know yet.',
    'in een hoek van {0}. Een hoek is een vakje dat twee muren van die {1} raakt.': 'in a corner of {0}. A corner is a square that touches two walls of that {1}.',
    "tegen een muur van {0}, niet in een hoek. Zo'n vakje raakt precies één muur.": 'against a wall of {0}, not in a corner. Such a square touches exactly one wall.',
    "in het midden van {0}. Zo'n vakje raakt geen enkele muur.": 'in the middle of {0}. Such a square touches no wall at all.', 'een {0}': 'a {0}',
    '{0} staat in een {1} waar {2} staat. Zoek eerst dat meubel; elk vrij vakje in die {3} kan.': '{0} stands in a {1} that has {2}. Find that furniture first; any free square in that {3} will do.',
    '{0} staat op het vakje links, rechts, boven of onder {1}. Schuin telt niet.': '{0} stands on the square left, right, above or below {1}. Diagonal does not count.',
    '{0} staat in {1}, recht naast {2}: links, rechts, boven of onder, niet schuin.': '{0} stands in {1}, right next to {2}: left, right, above or below, not diagonal.',
    '{0} en {1} staan in dezelfde {2}. Weet je waar één van de twee staat, dan weet je ook de {3} van de ander.': '{0} and {1} stand in the same {2}. If you know where one of them is, you know the {3} of the other.',
    '{0} en {1} staan in twee verschillende {2}.': '{0} and {1} stand in two different {2}.',
    '{0} en {1} staan op vakjes die elkaar raken: links, rechts, boven of onder. Een muur ertussen mag.': '{0} and {1} stand on squares that touch: left, right, above or below. A wall in between is fine.',
    '{0} staat niet op een vakje dat {1} raakt (links, rechts, boven of onder). Schuin ernaast mag wel.': '{0} does not stand on a square that touches {1} (left, right, above or below). Diagonally beside is fine.',
    '{0} en {1} staan op dezelfde rij: even hoog op de plattegrond, ook als dat in verschillende {2} is.': '{0} and {1} stand on the same row: the same height on the floor plan, even if that is in different {2}.',
    '{0} en {1} staan in dezelfde kolom: recht boven of onder elkaar. Muren tellen niet.': '{0} and {1} stand in the same column: straight above or below each other. Walls do not count.',
    '{0} staat in een kolom links van {1}, in welke {2} dan ook.': '{0} stands in a column to the left of {1}, in whatever {2}.',
    '{0} staat in een rij hoger dan {1}, in welke {2} dan ook.': '{0} stands in a row higher than {1}, in whatever {2}.',
    'In {0} staat niemand. Die {1} kun je overslaan.': 'Nobody stands in {0}. You can skip that {1}.',
    '{0} staat in een {1} waar verder niemand staat.': '{0} stands in a {1} where nobody else stands.',
    ' Nu staat {0} in {1} {2}.': ' Right now {0} is in {1} {2}.',
    'In {0} {1} mag maar één persoon staan: de moordenaar. Sleep één van de twee naar een andere {2}.': 'Only one person may stand in {0} {1}: the murderer. Drag one of the two to another {2}.',
    'Sleep {0} van het bord af.{1}{2}': 'Drag {0} off the board.{1}{2}', ' Zet {0} daarna ergens in {1} {2}.': ' Then put {0} somewhere in {1} {2}.', ' Lees de verklaring hierboven nog eens en probeer een vakje dat erbij past.': ' Read the statement above again and try a square that fits it.',
    'Er is maar één vakje over: het oplichtende vakje{0}. Sleep {1} daarheen.': 'Only one square is left: the glowing square{0}. Drag {1} there.', ' in {0} {1}': ' in {0} {1}',
    '{0} kan nog op {1} vakjes staan; ze lichten goud op{2}. Zet daar een stipje met het Potlood en probeer ze één voor één: bij elk vakje kijk je of de andere verklaringen nog kloppen.': '{0} can still stand on {1} squares; they glow gold{2}. Put a pencil dot on them and try them one by one: for each square, check whether the other statements still hold.', ', in de {0}': ', in the {0}',
    'Iedereen staat goed. Tik op Controleer en wijs daarna aan wie alleen in {0} {1} staat.': 'Everyone is in place. Tap Check and then name who is alone in {0} {1}.',
    // ── code: plattegrond ──
    'in een hoek van een {0}': 'in a corner of a {0}', 'in een hoek': 'in a corner', 'tegen een muur, niet in een hoek': 'against a wall, not in a corner',
    'midden in een {0}, niet tegen een muur': 'in the middle of a {0}, not against a wall', 'in het midden, niet tegen een muur': 'in the middle, not against a wall',
    '{0} was in {1}.': '{0} was in {1}.', '{0} was niet in {1}.': '{0} was not in {1}.', '{0} was in {1}, {2}.': '{0} was in {1}, {2}.', '{0} stond {1}.': '{0} stood {1}.',
    '{0} was in een {1} met {2}.': '{0} was in a {1} with {2}.', '{0} stond direct naast {1}.': '{0} stood directly next to {1}.', '{0} was in {1}, direct naast {2}.': '{0} was in {1}, directly next to {2}.',
    '{0} en {1} waren in dezelfde {2}.': '{0} and {1} were in the same {2}.', '{0} en {1} waren niet in dezelfde {2}.': '{0} and {1} were not in the same {2}.',
    '{0} stond niet direct naast {1}.': '{0} did not stand directly next to {1}.', '{0} en {1} stonden op dezelfde rij.': '{0} and {1} stood on the same row.', '{0} en {1} stonden in dezelfde kolom.': '{0} and {1} stood in the same column.',
    '{0} stond links van {1} op de plattegrond.': '{0} stood to the left of {1} on the floor plan.', '{0} stond hoger op de plattegrond dan {1}.': '{0} stood higher on the floor plan than {1}.',
    'Er was niemand in {0}.': 'Nobody was in {0}.', '{0} was alleen in de {1}.': '{0} was alone in the {1}.',
    'Ik was in {0}.': 'I was in {0}.', 'Ik was niet in {0}.': 'I was not in {0}.', 'Ik was in {0}, {1}.': 'I was in {0}, {1}.', 'Ik stond {0}.': 'I stood {0}.',
    'Ik was in een {0} met {1}.': 'I was in a {0} with {1}.', 'Ik stond direct naast {0}.': 'I stood directly next to {0}.', 'Ik was in {0}, direct naast {1}.': 'I was in {0}, directly next to {1}.',
    'Ik was in dezelfde {0} als {1}.': 'I was in the same {0} as {1}.', 'Ik was niet in dezelfde {0} als {1}.': 'I was not in the same {0} as {1}.',
    'Ik stond niet direct naast {0}.': 'I did not stand directly next to {0}.', '{0} en ik stonden op dezelfde rij.': '{0} and I stood on the same row.', '{0} en ik stonden in dezelfde kolom.': '{0} and I stood in the same column.',
    'Ik stond links van {0} op de plattegrond.': 'I stood to the left of {0} on the floor plan.', 'Ik stond hoger op de plattegrond dan {0}.': 'I stood higher on the floor plan than {0}.',
    'Volgens het rapport was er niemand in {0}.': 'According to the report nobody was in {0}.', 'Ik was alleen in de {0}.': 'I was alone in the {0}.',
    '{0} werd gevonden in {1} {2}. ': '{0} was found in {1} {2}. ', 'De moordenaar was de enige die zich in die {0} bevond.': 'The murderer was the only one in that {0}.', 'Het slachtoffer': 'The victim',
    '{0} staat verkeerd. Aanwijzing {1} zegt: "{2}"': '{0} is in the wrong place. Clue {1} says: "{2}"', 'Haal de verdachte weg en kijk welke vakjes die aanwijzing wél toelaat.': 'Remove the suspect and see which squares that clue does allow.',
    'Er staan twee verdachten in de {0} van het slachtoffer. Alleen de moordenaar was daar.': 'Two suspects are in the {0} of the victim. Only the murderer was there.', 'Precies één persoon bevond zich in die kamer.': 'Exactly one person was in that room.',
    '{0} staat niet op de juiste plek.': '{0} is not in the right place.', 'Kijk nog eens naar de aanwijzingen over de anderen.': 'Look again at the clues about the others.', 'Lees aanwijzing {0} nog eens.': 'Read clue {0} again.',
    'Iedereen staat goed. Wie was alleen met het slachtoffer?': 'Everyone is in place. Who was alone with the victim?', '{0} kan maar op één plek staan.': '{0} can only be in one place.',
    'Combineer aanwijzing {0} met de spelregel over het slachtoffer.': 'Combine clue {0} with the rule about the victim.', 'De spelregel over het slachtoffer dwingt dit af.': 'The rule about the victim forces this.',
    'in {0} {1}': 'in {0} {1}', 'verdeeld over {0} {1}': 'spread over {0} {1}', 'Begin met {0}: er zijn nog maar {1} mogelijke vakjes, {2}.': 'Start with {0}: only {1} possible squares are left, {2}.',
    'Aanwijzing {0} beperkt de opties. Streep vakjes weg die er niet aan voldoen.': 'Clue {0} limits the options. Cross off squares that do not satisfy it.', 'Gebruik de plaatsen van de anderen om verder te snoeien.': 'Use the positions of the others to narrow it down further.',
    'In deze zaak zegt <b>{0}</b>: “{1}”': 'In this case <b>{0}</b> says: “{1}”', 'Waar stond <b>{0}</b>?': 'Where was <b>{0}</b>?',
    '{0} · Zaak {1}: {2}': '{0} · Case {1}: {2}', 'vrije dagen': 'streak freezes', '🧊 {0} {1}': '🧊 {0} {1}', 'nog {0} {1} tot {2}': '{0} more {1} until {2}',
    'Volgende: {0} · nog {1} {2}': 'Next: {0} · {1} more {2}', 'Alle opdrachten klaar: +{0} punten en een vrije dag': 'All quests done: +{0} points and a streak freeze',
    // korte namen: Engelse titels
    'Alle {0}': 'All {0}'
  }
};

// T`…` met gaten, of T('…') voor losse tekst
function T(strings, ...vals) {
  if (typeof strings === 'string') return I18n.t(strings);
  return I18n.template(strings, vals);
}

if (typeof module !== 'undefined' && module.exports) module.exports = { I18n, T };
