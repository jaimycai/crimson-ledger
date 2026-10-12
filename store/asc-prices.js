// Writes store/metadata/prices.json: the real App Store price of the products the shop shows, per territory,
// for the store screenshots (each language shows the prices of its main market).
//   node store/asc-prices.js
const fs = require('fs'); const path = require('path');
const { api, APP } = require('./asc-api');
const TERRITORIES = ['USA', 'NLD', 'DEU', 'ESP', 'FRA', 'ITA', 'BRA', 'RUS', 'TUR', 'IDN', 'VNM', 'SAU', 'PAK', 'IND', 'BGD', 'SGP', 'JPN', 'KOR', 'GBR', 'MEX'];
const PRODUCTS = ['nl.crimsonledger.app.pass', 'nl.crimsonledger.app.hints10', 'nl.crimsonledger.app.cosmetics', 'nl.crimsonledger.app.world.circus'];
(async () => {
  const list = await api('GET', `/v1/apps/${APP}/inAppPurchasesV2?limit=50&fields[inAppPurchases]=productId`);
  const out = {};
  for (const productId of PRODUCTS) {
    const iap = list.data.find(x => x.attributes.productId === productId);
    const s = await api('GET', `/v2/inAppPurchases/${iap.id}/iapPriceSchedule`);
    for (const kind of ['manualPrices', 'automaticPrices']) {
      const r = await api('GET', `/v1/inAppPurchasePriceSchedules/${s.data.id}/${kind}?filter[territory]=${TERRITORIES.join(',')}&include=inAppPurchasePricePoint,territory&limit=50`);
      if (!r) continue;
      const pts = Object.fromEntries((r.included || []).filter(i => i.type === 'inAppPurchasePricePoints').map(i => [i.id, i.attributes.customerPrice]));
      const cur = Object.fromEntries((r.included || []).filter(i => i.type === 'territories').map(i => [i.id, i.attributes.currency]));
      for (const x of r.data) {
        const t = x.relationships.territory.data.id;
        out[t] = out[t] || { currency: cur[t] };
        if (out[t][productId] === undefined) out[t][productId] = +pts[x.relationships.inAppPurchasePricePoint.data.id];
      }
    }
  }
  fs.writeFileSync(path.join(__dirname, 'metadata', 'prices.json'), JSON.stringify(out, null, 1) + '\n');
  console.log(Object.entries(out).map(([t, v]) => `${t} ${v.currency} ${v[PRODUCTS[0]]}`).join(' · '));
})();
