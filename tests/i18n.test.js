// Taal: Engels woordenboek, inhoud ter plekke vervangen, verklaringen in het Engels. Zonder DOM.
const { THEMES, Themes } = require('../themes.js');
const { CAMPAIGN, Campaign } = require('../campaign.js');
const { Progress, DAILY_TITLES, WEEK_TITLES } = require('../progress.js');
const { Mentor } = require('../mentor.js');
const { I18N_DATA } = require('../i18n-data.js');
const { I18N_CAMPAIGN } = require('../i18n-campaign.js');
const { I18n, T } = require('../i18n.js');
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
Object.assign(global, { THEMES, Themes, CAMPAIGN, Campaign, Progress, DAILY_TITLES, WEEK_TITLES, Mentor, I18N_DATA, I18N_CAMPAIGN, T, I18n });
const { FloorPlan } = require('../floorplan.js');
global.FloorPlan = FloorPlan;

// Nederlands: alles blijft zoals het is
I18n.lang = 'nl';
check(T('Verder') === 'Verder' && T`Zaak ${3}: ${'x'}` === 'Zaak 3: x', 'Nederlands: T geeft de brontekst terug');
const dutchStatement = FloorPlan.statement({ kind: 'room', s: 0, room: 0 }, { theme: THEMES[0], suspects: THEMES[0].suspects, rooms: [{ id: 0, name: 'Keuken', article: 'de' }], furnitureNl: {} }).text;
check(dutchStatement === 'Ik was in de Keuken.', 'verklaring in het Nederlands: ' + dutchStatement);

// Engels
I18n.lang = 'en';
check(T('Verder') === 'Continue' && T`Zaak ${3}: ${'x'}` === 'Case 3: x' && T`nog ${2} ${T('zaken')}` === '2 more cases', 'Engels: sjablonen met gaten');
const missing = Object.keys(I18n.EN).filter(k => !I18n.EN[k]);
check(missing.length === 0, 'geen lege vertalingen');
I18n.localizeData();
check(THEMES[0].title === 'The Manor' && THEMES[0].rooms[0].name === 'Living Room' && THEMES[0].rooms[0].article === 'the' && THEMES[0].furniture[0].nl === 'a plant', 'werelden vertaald: titel, kamers, meubels');
const dutchRooms = THEMES.flatMap(t => t.rooms.map(r => r.name)).filter(n => /kamer|zaal|wagen|ruimte|kelder|keuken|hal$/i.test(n));
check(dutchRooms.length === 0, 'geen Nederlandse kamernamen over: ' + dutchRooms.join(', '));
check(Themes.shortName('Major Pike') === 'Pike' && Themes.shortName('Cabin Boy Nik') === 'Nik' && Themes.shortName('Trapeze Artist Mira') === 'Mira', 'korte namen werken met Engelse titels');
const untranslated = CAMPAIGN.filter(ch => /^Deel /.test(ch.title) || ch.cases.some(c => /^De |^Het |^Een /.test(c.title) && !/^The |^A /.test(c.title)));
check(CAMPAIGN.every(ch => /^Part /.test(ch.title)) && untranslated.length === 0, 'alle 48 delen en 384 zaken in het Engels');
check(CAMPAIGN[0].cases[0].title === 'The Glass of Bordeaux' && CAMPAIGN[0].cases[0].item === '🍷 Wine glass' && Campaign.caseAt('trein', 0).story.startsWith('The whistle'), 'zaaktitels, bewijsstukken en verhaaltjes');
check(Progress.MEDALS.find(m => m.id === 'eerste-zaak').title === 'First Case' && Progress.QUESTS[0].text === 'Solve a case' && DAILY_TITLES[0] === 'Poisonous Herbs' && WEEK_TITLES.landhuis[0] === 'The Mystery of the Wills', 'medailles, opdrachten, dag- en weektitels');
check(Mentor.name === 'Inspector Van Dam' && Mentor.INTROS[0].title === 'Rooms' && Mentor.REACT_WRONG[0] === 'Me? Never!', 'Van Dam in het Engels');
// verklaringen en zaaktekst uit de generator
const p = FloorPlan.generate(4242, 'gemiddeld', THEMES[0]);
const texts = p.clues.map(c => FloorPlan.statement(c, p).text);
check(texts.every(t => /^(I |According to|.+ and I )/.test(t)), 'verklaringen in het Engels: ' + texts[0]);
check(/was found in the .+\. The murderer was the only one in that room\./.test(p.caseText), 'zaaktekst in het Engels: ' + p.caseText);
const h = FloorPlan.hint(p, new Array(p.suspects.length).fill(null));
check(/Start with|can only be in one place/.test(h.text), 'hint in het Engels: ' + h.text);
check(/stands|must be|can stand/.test(Mentor.explain(p.clues[0], p)), 'uitleg van Van Dam in het Engels: ' + Mentor.explain(p.clues[0], p));
console.log(failures === 0 ? 'ALLE I18N CHECKS PASSED' : `${failures} FAILURES`);
process.exit(failures ? 1 : 0);
