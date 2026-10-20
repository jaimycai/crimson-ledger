// Creates the in-app purchase of a new world in App Store Connect, set up like the existing worlds:
// non-consumable, not family-sharable, € 1,99 with the Netherlands as base territory (Apple fills in the
// other territories), the same territories as De Skihut, a name and description in all 23 store languages,
// and the review screenshot store/screenshots/review-<world>.png (1290×2796: the shop opened on that world).
// The Crimson Pass needs no change: the app unlocks every paid world with it (Store.ownsWorld).
// A new purchase goes to App Review together with the next app version (store/asc.js submit).
//   node store/asc-iap-wereld.js <world> [<world> ...]            shows what is missing (reads only)
//   node store/asc-iap-wereld.js <world> [<world> ...] --apply    creates what is missing
const crypto = require('crypto'); const fs = require('fs'); const path = require('path');
const { api, wait, APP } = require('./asc-api');
const ROOT = path.join(__dirname, '..');
const { THEMES } = require(path.join(ROOT, 'themes.js'));
require(path.join(ROOT, 'i18n', 'en.js'));
const EN = globalThis.LANG_PACKS.en;
const extra = require('./iap-texts.js').build();   // 20 store languages, lengths checked

const PRICE = '1.99', BASE = 'NLD', MODEL = 'nl.crimsonledger.app.world.skihut';
const args = process.argv.slice(2), APPLY = args.includes('--apply');
const worlds = args.filter(a => !a.startsWith('--'));
if (!worlds.length) { console.error('gebruik: node store/asc-iap-wereld.js <wereld> [...] [--apply]'); process.exit(2); }

const texts = id => {
  const nl = THEMES.find(t => t.id === id).title, en = EN.data.themes[id].title;
  return { 'nl-NL': [nl, '64 zaken in acht delen, eigen cast.'], 'en-US': [en, '64 cases in eight parts, own cast.'],
           'en-GB': [en, '64 cases in eight parts, own cast.'], ...extra[`nl.crimsonledger.app.world.${id}`] };
};
async function all(url) { const out = []; while (url) { const r = await api('GET', url); if (!r) break; out.push(...r.data); url = r.links && r.links.next; } return out; }

async function territoriesOf(iapId) {
  const av = await api('GET', `/v2/inAppPurchases/${iapId}/inAppPurchaseAvailability`);
  return av ? (await all(`/v1/inAppPurchaseAvailabilities/${av.data.id}/availableTerritories?limit=200`)).map(t => t.id) : null;
}

async function uploadShot(iapId, file) {
  const buf = fs.readFileSync(file);
  const made = await api('POST', '/v1/inAppPurchaseAppStoreReviewScreenshots', { data: { type: 'inAppPurchaseAppStoreReviewScreenshots',
    attributes: { fileName: path.basename(file), fileSize: buf.length }, relationships: { inAppPurchaseV2: { data: { type: 'inAppPurchases', id: iapId } } } } });
  if (!made) return false;
  for (const op of made.data.attributes.uploadOperations) {
    const headers = {}; for (const h of op.requestHeaders) headers[h.name] = h.value;
    const r = await fetch(op.url, { method: op.method, headers, body: buf.subarray(op.offset, op.offset + op.length) });
    if (!r.ok) { console.log('  upload mislukt', r.status); return false; }
  }
  const md5 = crypto.createHash('md5').update(buf).digest('hex');
  return !!(await api('PATCH', `/v1/inAppPurchaseAppStoreReviewScreenshots/${made.data.id}`, { data: { type: 'inAppPurchaseAppStoreReviewScreenshots', id: made.data.id, attributes: { uploaded: true, sourceFileChecksum: md5 } } }));
}

(async () => {
  const list = await all(`/v1/apps/${APP}/inAppPurchasesV2?limit=50`);
  const model = list.find(p => p.attributes.productId === MODEL);
  const territories = await territoriesOf(model.id);
  console.log(`voorbeeld ${MODEL}: ${territories.length} landen; ${APPLY ? 'aanmaken' : 'alleen kijken'}\n`);

  for (const id of worlds) {
    const productId = `nl.crimsonledger.app.world.${id}`, shot = path.join(__dirname, 'screenshots', `review-${id}.png`);
    const t = texts(id);
    if (!fs.existsSync(shot)) throw new Error(`geen reviewscreenshot: ${shot}`);
    console.log(`${productId}  (${t['nl-NL'][0]})`);
    let iap = list.find(p => p.attributes.productId === productId);

    // 1. the product
    if (!iap) {
      console.log('  product ontbreekt');
      if (!APPLY) { console.log(`  zou aanmaken: "Wereld: ${t['nl-NL'][0]}", ${Object.keys(t).length} talen, ${PRICE} in ${BASE}, ${territories.length} landen, ${path.basename(shot)}\n`); continue; }
      const made = await api('POST', '/v2/inAppPurchases', { data: { type: 'inAppPurchases',
        attributes: { name: `Wereld: ${t['nl-NL'][0]}`, productId, inAppPurchaseType: 'NON_CONSUMABLE', familySharable: false },
        relationships: { app: { data: { type: 'apps', id: APP } } } } });
      if (!made) continue;
      iap = made.data; console.log(`  product aangemaakt (${iap.id})`);
    } else console.log(`  product bestaat (${iap.id}, ${iap.attributes.state})`);

    // 2. territories
    const have = await territoriesOf(iap.id);
    if (!have) {
      console.log('  landen ontbreken');
      if (APPLY && await api('POST', '/v1/inAppPurchaseAvailabilities', { data: { type: 'inAppPurchaseAvailabilities', attributes: { availableInNewTerritories: true },
        relationships: { inAppPurchase: { data: { type: 'inAppPurchases', id: iap.id } }, availableTerritories: { data: territories.map(x => ({ type: 'territories', id: x })) } } } }))
        console.log(`  ${territories.length} landen gezet`);
    } else console.log(`  landen: ${have.length}`);

    // 3. price
    const sched = await api('GET', `/v2/inAppPurchases/${iap.id}/iapPriceSchedule`);
    const manual = sched && await api('GET', `/v1/inAppPurchasePriceSchedules/${sched.data.id}/manualPrices?limit=5`);
    if (!manual || !manual.data.length) {
      console.log('  prijs ontbreekt');
      if (APPLY) {
        const points = await all(`/v2/inAppPurchases/${iap.id}/pricePoints?filter[territory]=${BASE}&limit=200`);
        const point = points.find(p => p.attributes.customerPrice === PRICE);
        if (!point) { console.log(`  geen prijspunt ${PRICE} in ${BASE}`); }
        else if (await api('POST', '/v1/inAppPurchasePriceSchedules', {
          data: { type: 'inAppPurchasePriceSchedules', relationships: { inAppPurchase: { data: { type: 'inAppPurchases', id: iap.id } },
            baseTerritory: { data: { type: 'territories', id: BASE } }, manualPrices: { data: [{ type: 'inAppPurchasePrices', id: '${price}' }] } } },
          included: [{ type: 'inAppPurchasePrices', id: '${price}', attributes: { startDate: null },
            relationships: { inAppPurchaseV2: { data: { type: 'inAppPurchases', id: iap.id } }, inAppPurchasePricePoint: { data: { type: 'inAppPurchasePricePoints', id: point.id } } } }]
        })) console.log(`  prijs gezet: ${PRICE} in ${BASE}`);
      }
    } else console.log('  prijs staat');

    // 4. names and descriptions
    const locs = await all(`/v2/inAppPurchases/${iap.id}/inAppPurchaseLocalizations?limit=50`);
    const missing = Object.entries(t).filter(([locale]) => !locs.some(l => l.attributes.locale === locale));
    console.log(`  talen: ${locs.length} aanwezig, ${missing.length} ontbreken`);
    if (APPLY) for (const [locale, [name, description]] of missing) {
      const ok = await api('POST', '/v1/inAppPurchaseLocalizations', { data: { type: 'inAppPurchaseLocalizations', attributes: { name, description, locale },
        relationships: { inAppPurchaseV2: { data: { type: 'inAppPurchases', id: iap.id } } } } });
      if (!ok) console.log(`  taal mislukt: ${locale}`);
    }

    // 5. review screenshot
    const cur = await api('GET', `/v2/inAppPurchases/${iap.id}/appStoreReviewScreenshot`);
    if (!cur || !cur.data) {
      console.log('  reviewscreenshot ontbreekt');
      if (APPLY && await uploadShot(iap.id, shot)) console.log(`  reviewscreenshot geüpload (${path.basename(shot)})`);
    } else console.log('  reviewscreenshot staat');

    if (APPLY) { await wait(3000); const now = await api('GET', `/v2/inAppPurchases/${iap.id}`); console.log(`  status: ${now && now.data.attributes.state}`); }
    console.log('');
  }
})();
