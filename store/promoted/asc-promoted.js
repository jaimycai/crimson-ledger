// Promoted in-app purchase on the product page: the Crimson Pass with its own 1024x1024 image (make-pass-art.js).
//   node store/promoted/asc-promoted.js status                 promoted purchases, image and versions of the Pass (reads only)
//   node store/promoted/asc-promoted.js setup                  upload the image and promote the Pass (visible, enabled)
// The image hangs on a new version of the in-app purchase; that version goes to App Review with the next app version
// (store/asc.js submit adds the newest version of every in-app purchase to the review submission).
// The app must accept a purchase that starts on the App Store: StoreKit 2 PurchaseIntent.intents (iOS 16.4+).
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const { api, wait, APP } = require('../asc-api');
const PRODUCT = 'nl.crimsonledger.app.pass', IMAGE = path.join(__dirname, 'pass-1024.png');

async function pass() {
  const r = await api('GET', `/v1/apps/${APP}/inAppPurchasesV2?limit=50&filter[productId]=${PRODUCT}`);
  const p = r && r.data[0]; if (!p) console.log('STOP: no in-app purchase', PRODUCT); return p;
}

async function status() {
  const p = await pass(); if (!p) return;
  console.log('in-app purchase', p.id, p.attributes.name, p.attributes.state);
  const pr = await api('GET', `/v1/apps/${APP}/promotedPurchases?limit=50&include=inAppPurchaseV2`);
  for (const d of (pr && pr.data) || []) console.log('promoted', d.id, JSON.stringify(d.attributes), (d.relationships.inAppPurchaseV2.data || {}).id);
  const im = await api('GET', `/v2/inAppPurchases/${p.id}/images`);
  for (const d of (im && im.data) || []) console.log('image', d.id, d.attributes.state, d.attributes.fileName || '');
  const vs = await api('GET', `/v2/inAppPurchases/${p.id}/versions`);
  for (const d of (vs && vs.data) || []) console.log('version', d.id, d.attributes.version, d.attributes.state);
}

async function uploadImage(iapId) {
  const buf = fs.readFileSync(IMAGE);
  const made = await api('POST', '/v1/inAppPurchaseImages', { data: { type: 'inAppPurchaseImages',
    attributes: { fileName: path.basename(IMAGE), fileSize: buf.length },
    relationships: { inAppPurchase: { data: { type: 'inAppPurchases', id: iapId } } } } });
  if (!made) return null;
  for (const op of made.data.attributes.uploadOperations) {
    const headers = {}; for (const h of op.requestHeaders) headers[h.name] = h.value;
    const r = await fetch(op.url, { method: op.method, headers, body: buf.subarray(op.offset, op.offset + op.length) });
    if (!r.ok) { console.log('part failed', r.status); return null; }
  }
  const checksum = crypto.createHash('md5').update(buf).digest('hex');
  const done = await api('PATCH', `/v1/inAppPurchaseImages/${made.data.id}`, { data: { type: 'inAppPurchaseImages', id: made.data.id, attributes: { sourceFileChecksum: checksum, uploaded: true } } });
  return done && made.data.id;
}

async function setup() {
  const p = await pass(); if (!p) return;
  const have = await api('GET', `/v2/inAppPurchases/${p.id}/images`);
  let imageId = have && have.data[0] && have.data[0].id;
  if (imageId) console.log('image exists', imageId, have.data[0].attributes.state);
  else { imageId = await uploadImage(p.id); console.log('image', imageId || 'NOT uploaded'); }
  if (imageId) for (let i = 0; i < 12; i++) {
    const im = await api('GET', `/v1/inAppPurchaseImages/${imageId}`);
    const st = im && im.data.attributes; console.log('image state', st && st.state);
    if (!st || !['AWAITING_UPLOAD', 'UPLOAD_COMPLETE'].includes(st.state)) break;   // processed: PREPARE_FOR_SUBMISSION or FAILED
    await wait(5000);
  }
  const pr = await api('GET', `/v1/apps/${APP}/promotedPurchases?limit=50&include=inAppPurchaseV2`);
  let promo = pr && pr.data.find(d => d.relationships.inAppPurchaseV2.data && d.relationships.inAppPurchaseV2.data.id === p.id);
  if (!promo) {
    const made = await api('POST', '/v1/promotedPurchases', { data: { type: 'promotedPurchases', attributes: { visibleForAllUsers: true, enabled: true },
      relationships: { app: { data: { type: 'apps', id: APP } }, inAppPurchaseV2: { data: { type: 'inAppPurchases', id: p.id } } } } });
    promo = made && made.data;
  } else if (!promo.attributes.visibleForAllUsers || promo.attributes.enabled === false) {
    const upd = await api('PATCH', `/v1/promotedPurchases/${promo.id}`, { data: { type: 'promotedPurchases', id: promo.id, attributes: { visibleForAllUsers: true, enabled: true } } });
    promo = upd ? upd.data : promo;
  }
  console.log('promoted purchase', promo ? `${promo.id} ${JSON.stringify(promo.attributes)}` : 'NOT made');
  if (promo) await api('PATCH', `/v1/apps/${APP}/relationships/promotedPurchases`, { data: [{ type: 'promotedPurchases', id: promo.id }] });
  await status();
}

const cmd = process.argv[2];
if (cmd === 'status') status(); else if (cmd === 'setup') setup(); else console.log('usage: status | setup');
