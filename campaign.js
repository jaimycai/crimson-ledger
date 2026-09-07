// ============================================================
// CAMPAIGN — vaste reeks zaken per thema met titel, verhaaltje en
// oplopende moeilijkheid. Zaken zijn deterministisch gegenereerd
// (vaste seed), dus iedereen speelt dezelfde puzzel. Voortgang en
// sterren worden lokaal bewaard.
// ============================================================

const CAMPAIGN = [
  { theme: 'landhuis', cases: [
    { title: 'Het glas Bordeaux',     story: 'De avond begon met een toost en eindigde in stilte.',        difficulty: 'makkelijk', seed: 5101 },
    { title: 'De verdwenen sleutel',  story: 'De studeerkamer zat op slot. Toch niet, zei de butler.',   difficulty: 'makkelijk', seed: 5198 },
    { title: 'Regen op het landgoed', story: 'Het noodweer hield iedereen binnen. Iedereen.',            difficulty: 'makkelijk', seed: 5295 },
    { title: 'De laatste brief',      story: 'Op het bureau lag een brief die nooit is afgemaakt.',       difficulty: 'gemiddeld', seed: 5392 },
    { title: 'Het portret',           story: 'Iemand had het familieportret omgedraaid.',                difficulty: 'gemiddeld', seed: 5489 },
    { title: 'De tuinman zwijgt',     story: 'Het gereedschapsschuurtje was leeg, de tuinman ook.',      difficulty: 'gemiddeld', seed: 5586 },
    { title: 'Het testament',         story: 'Iedereen wist wat erin stond. Eén iemand wist het beter.', difficulty: 'moeilijk',  seed: 5683 },
    { title: 'De Rode Kamer',         story: 'Alles kwam samen in de kamer waar het begon.',             difficulty: 'moeilijk',  seed: 5780 }
  ]},
  { theme: 'piraten', cases: [
    { title: 'De stille zee',         story: 'Geen wind, geen golven, geen kapitein.',                    difficulty: 'makkelijk', seed: 7101 },
    { title: 'De gestolen kaart',     story: 'De schatkaart was weg. Het lichaam niet.',                  difficulty: 'makkelijk', seed: 7198 },
    { title: 'Rum in het ruim',       story: 'Drie vaten leeg, één bemanningslid stil.',                  difficulty: 'makkelijk', seed: 7295 },
    { title: 'Het kanon zwijgt',      story: 'Niemand hoorde een schot. Toch lag daar iemand.',           difficulty: 'gemiddeld', seed: 7392 },
    { title: 'Muiterij',              story: 'Het gemor begon in de kombuis.',                            difficulty: 'gemiddeld', seed: 7489 },
    { title: 'De schatkist',          story: 'De kist was open. De inhoud niet.',                         difficulty: 'gemiddeld', seed: 7586 },
    { title: 'Storm op komst',        story: 'De lucht werd zwart en de bemanning ook.',                  difficulty: 'moeilijk',  seed: 7683 },
    { title: 'De laatste zeilen',     story: 'Eén persoon zou nooit meer aan wal komen.',                 difficulty: 'moeilijk',  seed: 7780 }
  ]},
  { theme: 'hotel', cases: [
    { title: 'Middernacht',           story: 'Twaalf slagen, één schreeuw.',                              difficulty: 'makkelijk', seed: 9101 },
    { title: 'De verkeerde koffer',   story: 'De koffer op kamer 12 was niet van de gast op kamer 12.',   difficulty: 'makkelijk', seed: 9198 },
    { title: 'Champagne in de bar',   story: 'Het glas was nog koud toen het gebeurde.',                  difficulty: 'makkelijk', seed: 9295 },
    { title: 'De pianist speelt door',story: 'De muziek stopte niet. De gastheer wel.',                   difficulty: 'gemiddeld', seed: 9392 },
    { title: 'Roomservice',           story: 'Het wagentje stond voor de deur. Niemand had gebeld.',      difficulty: 'gemiddeld', seed: 9489 },
    { title: 'De balzaal',            story: 'Honderd gasten, en toch was er maar één getuige.',          difficulty: 'gemiddeld', seed: 9586 },
    { title: 'Sleutel 404',           story: 'Die kamer bestond niet. Die sleutel wel.',                  difficulty: 'moeilijk',  seed: 9683 },
    { title: 'De laatste gast',       story: 'Bij het uitchecken ontbrak er iemand.',                     difficulty: 'moeilijk',  seed: 9780 }
  ]},
  { theme: 'ruimte', cases: [
    { title: 'Stilte op de brug',     story: 'De commandant meldde zich niet. Nooit meer.',               difficulty: 'makkelijk', seed: 3101 },
    { title: 'Het laboratorium',      story: 'Een reageerbuis kapot, een alibi ook.',                     difficulty: 'makkelijk', seed: 3198 },
    { title: 'De kas',                story: 'Tussen de planten lag meer dan bladeren.',                  difficulty: 'makkelijk', seed: 3295 },
    { title: 'Drukverlies',           story: 'Het alarm ging af. Niet om de druk.',                       difficulty: 'gemiddeld', seed: 3392 },
    { title: 'De onderhoudsrobot',    story: 'De robot had alles gezien, maar zegt niets.',               difficulty: 'gemiddeld', seed: 3489 },
    { title: 'Slaapcyclus',           story: 'Iedereen sliep. Behalve twee mensen.',                      difficulty: 'gemiddeld', seed: 3586 },
    { title: 'Het observatorium',     story: 'De sterren waren de enige getuigen.',                       difficulty: 'moeilijk',  seed: 3683 },
    { title: 'Thuisreis',             story: 'De capsule had plek voor iedereen. Op één na.',             difficulty: 'moeilijk',  seed: 3780 }
  ]}
];

const Campaign = {
  KEY: 'crimson-campaign',
  list: () => CAMPAIGN,
  chapter: themeId => CAMPAIGN.find(ch => ch.theme === themeId),
  id: (themeId, idx) => `${themeId}-${idx}`,
  total: () => CAMPAIGN.reduce((n, ch) => n + ch.cases.length, 0),

  progress() {
    try { return JSON.parse((typeof App !== 'undefined' ? App.storageGet(this.KEY) : null) || '{}'); } catch (e) { return {}; }
  },
  stars(themeId, idx) { return this.progress()[this.id(themeId, idx)] || 0; },
  doneCount() { return Object.values(this.progress()).filter(s => s > 0).length; },
  save(themeId, idx, stars) {
    const p = this.progress();
    p[this.id(themeId, idx)] = Math.max(p[this.id(themeId, idx)] || 0, stars);
    if (typeof App !== 'undefined') App.storageSet(this.KEY, JSON.stringify(p));
  },
  // zaak is speelbaar als de vorige in het hoofdstuk gehaald is
  isUnlocked(themeId, idx) { return idx === 0 || this.stars(themeId, idx - 1) > 0; },
  next(themeId, idx) {
    const ch = this.chapter(themeId);
    if (idx + 1 < ch.cases.length) return { theme: themeId, idx: idx + 1, ...ch.cases[idx + 1] };
    return null;
  },
  // Dezelfde herkansing als Board.start, zodat de test precies kan bewijzen wat de speler krijgt
  generateFor(themeId, idx, FP, Th) {
    const c = this.chapter(themeId).cases[idx];
    const theme = Th.get(themeId);
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
