// Praat met de App Store Connect API. Geen sleutels in dit bestand en niet in
// de repo: die komen uit omgevingsvariabelen.
//
//   export ASC_KEY_ID=XXXXXXXXXX
//   export ASC_ISSUER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
//   export ASC_KEY_PATH=~/.appstoreconnect/private_keys/AuthKey_XXXXXXXXXX.p8
//   node store/asc.js status
//
// Opdrachten:
//   status          toont app, versie, build, teksten en in-app aankopen
//   get <pad>       rauwe GET, bijvoorbeeld: get /v1/apps
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const KEY_ID = process.env.ASC_KEY_ID;
const ISSUER = process.env.ASC_ISSUER_ID;
const KEY_PATH = (process.env.ASC_KEY_PATH || '').replace(/^~/, process.env.HOME);
const BUNDLE_ID = process.env.ASC_BUNDLE_ID || 'nl.crimsonledger.app';
const BASE = 'https://api.appstoreconnect.apple.com';

if (!KEY_ID || !ISSUER || !KEY_PATH) {
  console.error('Zet eerst ASC_KEY_ID, ASC_ISSUER_ID en ASC_KEY_PATH.');
  process.exit(2);
}
if (!fs.existsSync(KEY_PATH)) {
  console.error(`Sleutelbestand niet gevonden: ${KEY_PATH}`);
  process.exit(2);
}

const b64url = b => Buffer.from(b).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

function token() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'ES256', kid: KEY_ID, typ: 'JWT' };
  const payload = { iss: ISSUER, iat: now, exp: now + 900, aud: 'appstoreconnect-v1' };
  const input = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const key = crypto.createPrivateKey(fs.readFileSync(KEY_PATH));
  const sig = crypto.sign('sha256', Buffer.from(input), { key, dsaEncoding: 'ieee-p1363' });
  return `${input}.${b64url(sig)}`;
}

async function api(method, p, body) {
  const res = await fetch(p.startsWith('http') ? p : BASE + p, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (e) { /* geen json */ }
  if (!res.ok) {
    const detail = json && json.errors
      ? json.errors.map(e => `${e.status} ${e.code}: ${e.title} — ${e.detail || ''}`).join('\n')
      : text.slice(0, 500);
    const err = new Error(`${method} ${p}\n${detail}`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

const get = p => api('GET', p);

async function app() {
  const r = await get(`/v1/apps?filter[bundleId]=${encodeURIComponent(BUNDLE_ID)}`);
  if (!r.data.length) throw new Error(`Geen app met bundle id ${BUNDLE_ID}`);
  return r.data[0];
}

async function status() {
  const a = await app();
  console.log(`App: ${a.attributes.name}  (id ${a.id})`);
  console.log(`Bundle: ${a.attributes.bundleId}`);
  console.log(`Primaire taal: ${a.attributes.primaryLocale}`);
  console.log(`Content rights: ${a.attributes.contentRightsDeclaration || 'NIET INGEVULD'}`);

  const versions = await get(`/v1/apps/${a.id}/appStoreVersions?filter[platform]=IOS&limit=3`);
  for (const v of versions.data) {
    console.log(`\nVersie ${v.attributes.versionString} — ${v.attributes.appStoreState}`);
    console.log(`  copyright: ${v.attributes.copyright || 'NIET INGEVULD'}`);
    console.log(`  release: ${v.attributes.releaseType}`);
    try {
      const b = await get(`/v1/appStoreVersions/${v.id}/build`);
      console.log(`  build: ${b.data ? b.data.id : 'GEEN BUILD GEKOZEN'}`);
    } catch (e) { console.log('  build: GEEN BUILD GEKOZEN'); }
    const locs = await get(`/v1/appStoreVersions/${v.id}/appStoreVersionLocalizations`);
    for (const l of locs.data) {
      const at = l.attributes;
      console.log(`  [${at.locale}] support: ${at.supportUrl || 'LEEG'} | marketing: ${at.marketingUrl || 'LEEG'} | keywords: ${at.keywords ? 'ja' : 'LEEG'} | beschrijving: ${at.description ? at.description.length + ' tekens' : 'LEEG'} | promo: ${at.promotionalText ? 'ja' : 'leeg'}`);
    }
  }

  const builds = await get(`/v1/builds?filter[app]=${a.id}&limit=5&sort=-version`);
  console.log('\nBuilds bij Apple:');
  for (const b of builds.data) {
    console.log(`  ${b.attributes.version} — ${b.attributes.processingState} — geüpload ${b.attributes.uploadedDate}  (id ${b.id})`);
  }

  const iaps = await get(`/v1/apps/${a.id}/inAppPurchasesV2?limit=50`);
  console.log(`\nIn-app aankopen (${iaps.data.length}):`);
  for (const p of iaps.data) {
    console.log(`  ${p.attributes.productId} — ${p.attributes.name} — ${p.attributes.inAppPurchaseType} — ${p.attributes.state}`);
  }
}

const cmd = process.argv[2] || 'status';
(async () => {
  if (cmd === 'status') return status();
  if (cmd === 'get') return console.log(JSON.stringify(await get(process.argv[3]), null, 2));
  console.error(`onbekende opdracht: ${cmd}`);
  process.exit(2);
})().catch(e => { console.error(e.message); process.exit(1); });
