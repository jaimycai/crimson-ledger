// Winkel: bezit, hints als zachte grens, nep-aankopen, uiterlijk. Zonder DOM.
const { THEMES, Themes } = require('../themes.js');
const { Progress } = require('../progress.js');
const { Store } = require('../store.js');
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
const mem = {};
global.App = { storageGet: k => (k in mem ? mem[k] : null), storageSet: (k, v) => { mem[k] = String(v); }, storageRemove: k => { delete mem[k]; } };
global.Themes = Themes; global.Progress = Progress; global.Store = Store;
global.window = {}; global.document = undefined;

check(Store.ownsWorld('landhuis') && Store.ownsWorld('piraten') && !Store.ownsWorld('hotel') && !Store.ownsWorld('skihut'), 'gratis: landhuis en piratenschip; de rest hoort bij de Pass of een pakket');
check(Store.paidWorlds().length === 6 && Store.allIds().length === 9, 'zes betaalde werelden, negen producten');
check(!Store.available() && !Store.mock(), 'zonder app en zonder nep-winkel: niet te koop');
check(Store.hintsLeft() === 3 && Store.canHint() && Store.hintLabel() === '3', 'drie gratis hints per dag');
Store.useHint(); Store.useHint(); Store.useHint();
check(Store.hintsLeft() === 0 && !Store.canHint() && Store.hintLabel() === '0', 'na drie hints: op voor vandaag');
mem['crimson-hints-day'] = JSON.stringify({ day: 'gisteren', used: 3 });
check(Store.hintsLeft() === 3, 'een nieuwe dag geeft weer drie gratis hints');
// nep-winkel
mem['crimson-store-mock'] = '1';
check(Store.mock() && Store.available(), 'nep-winkel aan (tests en browser)');
(async () => {
  let r = await Store.buy(Store.IDS.hints);
  check(r.ok && Store.hintsBought() === 10 && Store.hintsLeft() === 13, 'hintpakket: tien hints erbij, bovenop de gratis');
  for (let i = 0; i < 3; i++) Store.useHint();
  check(Store.hintsBought() === 10 && Store.freeLeft() === 0, 'eerst de gratis hints van vandaag');
  Store.useHint();
  check(Store.hintsBought() === 9, 'dan de gekochte');
  r = await Store.buy(Store.worldId('hotel'));
  check(r.ok && Store.ownsWorld('hotel') && !Store.ownsWorld('ruimte') && !Store.hasPass(), 'wereldpakket: alleen die wereld');
  check(!Store.ownsCosmetics() && !Store.setSkin('nacht') && Store.setSkin('papier') && Store.skin() === 'papier', 'bordthema nacht is dicht zonder Pass of pakket; papier mag');
  r = await Store.buy(Store.IDS.cosmetics);
  check(r.ok && Store.ownsCosmetics() && Store.setSkin('nacht') && Store.skin() === 'nacht' && Store.setFrame('goud') && Store.frame() === 'goud', 'bordthema\'s gekocht: nacht en gouden lijst');
  check(Progress.maxFreezes() === 2, 'zonder Pass: maximaal twee vrije dagen');
  r = await Store.buy(Store.IDS.pass);
  check(r.ok && Store.hasPass() && Store.ownsWorld('skihut') && Store.hintsLeft() === Infinity && Store.hintLabel() === '∞' && Store.canHint(), 'Crimson Pass: alle werelden, onbeperkt hints');
  check(Progress.maxFreezes() === 4 && Progress.setFreezes(4) === 4, 'met de Pass: tot vier vrije dagen');
  Store.useHint();
  check(Store.hintsBought() === 9, 'met de Pass kost een hint niets');
  // herstel vanuit Apple: bezit uit de lijst van geldige aankopen
  Store.save({ pass: false, worlds: [], cosmetics: false });
  Store.applyEntitlements([Store.worldId('museum'), Store.IDS.cosmetics]);
  check(!Store.hasPass() && Store.ownsWorld('museum') && !Store.ownsWorld('trein') && Store.ownsCosmetics(), 'entitlements van Apple: museum en bordthema\'s hersteld');
  check(Store.price(Store.IDS.pass) === '€ 4,99' && Store.price(Store.worldId('circus')) === '€ 1,99', 'vaste prijzen als App Store Connect niet bereikbaar is');
  mem['crimson-store-prices'] = JSON.stringify({ [Store.IDS.pass]: '€ 5,49' });
  check(Store.price(Store.IDS.pass) === '€ 5,49', 'prijs uit App Store Connect gaat voor');
  console.log(failures === 0 ? 'ALLE STORE CHECKS PASSED' : `${failures} FAILURES`);
  process.exit(failures ? 1 : 0);
})();
