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
check(Store.paidWorlds().length === 22 && Store.allIds().length === 25, 'tweeëntwintig betaalde werelden, vijfentwintig producten');
check(!Store.available() && !Store.mock(), 'zonder app en zonder nep-winkel: niet te koop');
// 1.6: het anker op de Pass-kaart en de korte productnamen voor de tellers
check(Store.label(Store.IDS.pass) === 'pass' && Store.label(Store.IDS.hints) === 'hints10' && Store.label(Store.worldId('hotel')) === 'world.hotel', 'korte productnamen voor buy_tap/buy_cancel/purchase');
{
  const a = Store.worldsApart();
  check(a && a.count === 22 && a.total === '€ 43,78', 'anker zonder App Store: 22 werelden los voor € 43,78 (vaste europrijs): ' + JSON.stringify(a));
  mem['crimson-store-prices'] = JSON.stringify({ [Store.IDS.pass]: '$4.99' });
  check(Store.worldsApart() === null, 'een App Store-prijs zonder getal: geen anker (liever niets dan een verkeerd bedrag)');
  const values = { [Store.IDS.pass]: { v: 4.99, c: 'USD', l: 'en_US@currency=USD' } };
  Store.paidWorlds().forEach(w => { values[Store.worldId(w)] = { v: 1.99, c: 'USD', l: 'en_US@currency=USD' }; });
  mem['crimson-store-values'] = JSON.stringify(values);
  check((Store.worldsApart() || {}).total === '$43.78', 'anker met App Store-prijzen: som in de munt en schrijfwijze van de winkel ($43.78)');
  values[Store.worldId('hotel')] = { v: 1.99, c: 'EUR', l: 'nl_NL' };
  mem['crimson-store-values'] = JSON.stringify(values);
  check(Store.worldsApart() === null, 'verschillende munten: geen anker');
  delete mem['crimson-store-prices']; delete mem['crimson-store-values'];
}
check(Store.hintsLeft() === 3 && Store.canHint() && Store.hintLabel() === '3', 'drie gratis hints per dag');
Store.useHint(); Store.useHint(); Store.useHint();
check(Store.hintsLeft() === 0 && !Store.canHint() && Store.hintLabel() === '0', 'na drie hints: op voor vandaag');
mem['crimson-hints-day'] = JSON.stringify({ day: 'gisteren', used: 3 });
check(Store.hintsLeft() === 3, 'een nieuwe dag geeft weer drie gratis hints');
// nep-winkel
mem['crimson-store-mock'] = '1';
check(Store.mock() && Store.available(), 'nep-winkel aan (tests en browser)');
(async () => {
  mem['crimson-store-mock'] = 'cancel';
  let r = await Store.buy(Store.IDS.pass);
  check(Store.mock() && !r.ok && r.state === 'cancelled' && !Store.hasPass(), 'nep-winkel "cancel": het aankoopvenster gaat dicht zonder aankoop');
  mem['crimson-store-mock'] = '1';
  r = await Store.buy(Store.IDS.hints);
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
  check(Store.price(Store.IDS.pass) === '€\u00a04,99' && Store.price(Store.worldId('circus')) === '€\u00a01,99', 'vaste prijzen als App Store Connect niet bereikbaar is (harde spatie)');
  mem['crimson-store-prices'] = JSON.stringify({ [Store.IDS.pass]: '€ 5,49' });
  check(Store.price(Store.IDS.pass) === '€\u00a05,49', 'prijs uit App Store Connect gaat voor');
  // 1.5: een ingewisselde aanbiedingscode terwijl de app open is (StorePlugin meldt "transaction")
  {
    let handler = null; const news = [];
    global.window.Capacitor = { Plugins: { Store: { addListener: (ev, fn) => { if (ev === 'transaction') handler = fn; }, entitlements: async () => ({ ids: [] }) } } };
    delete mem['crimson-store-mock'];
    Store.save({ pass: false, worlds: [], cosmetics: false });
    Store.listen(n => news.push(n));
    handler({ id: Store.IDS.pass, revoked: false, ids: [Store.IDS.pass] });
    check(Store.hasPass() && news.length === 1 && news[0].pass && !news[0].hints, 'ingewisselde Pass-code: meteen open, één keer gemeld als nieuw');
    handler({ id: Store.IDS.pass, revoked: false, ids: [Store.IDS.pass] });
    check(news.length === 1, 'dezelfde melding nog eens: niets nieuws');
    const before = Store.hintsBought();
    handler({ id: Store.IDS.hints, revoked: false, ids: [Store.IDS.pass] });
    check(Store.hintsBought() === before + Store.HINT_PACK && news.length === 2 && news[1].hints, 'hintpakket via een code: hints erbij');
    delete global.window.Capacitor;
  }
  // 1.6: StorePlugin geeft de prijs ook als getal met munt en schrijfwijze; loadPrices bewaart dat voor het anker
  {
    const usd = (id, price, v) => ({ id, price, value: v, currency: 'USD', locale: 'en_US@currency=USD' });
    global.window.Capacitor = { Plugins: { Store: { products: async () => ({ products: [usd(Store.IDS.pass, '$4.99', 4.99), ...Store.paidWorlds().map(w => usd(Store.worldId(w), '$1.99', 1.99))] }) } } };
    Store.save({ pass: false, worlds: ['hotel'], cosmetics: false });
    await Store.loadPrices();
    const a = Store.worldsApart();
    check(Store.price(Store.IDS.pass) === '$4.99' && a && a.count === 21 && a.total === '$41.79', 'prijzen uit de App Store als getal: anker telt alleen de werelden die je nog niet hebt (21 × $1.99): ' + JSON.stringify(a));
    delete global.window.Capacitor;
  }
  console.log(failures === 0 ? 'ALLE STORE CHECKS PASSED' : `${failures} FAILURES`);
  process.exit(failures ? 1 : 0);
})();
