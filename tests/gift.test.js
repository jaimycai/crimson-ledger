const { Store } = require('../store.js');

// ── cadeauwerelden via een streak ──
(() => {
  const mem = {};
  global.App = { storageGet: k => (k in mem ? mem[k] : null), storageSet: (k, v) => { mem[k] = String(v); } };
  global.Themes = { list: () => ['landhuis', 'piraten', 'hotel', 'ruimte'].map(id => ({ id })) };
  const assert = require('assert');
  assert.strictEqual(Store.giftForStreak(6), null, 'geen cadeau op dag 6');
  assert.strictEqual(Store.giftForStreak(7), 'hotel', 'dag 7 geeft de eerste betaalde wereld');
  assert.strictEqual(Store.ownsWorld('hotel'), true);
  assert.strictEqual(Store.giftForStreak(7), null, 'dag 7 geeft maar één keer');
  assert.strictEqual(Store.giftForStreak(30), 'ruimte', 'dag 30 geeft de volgende');
  Store.applyEntitlements([]);
  assert.strictEqual(Store.ownsWorld('hotel'), true, 'herstellen laat cadeaus staan');
  console.log('ok   cadeauwerelden via streak');
})();
