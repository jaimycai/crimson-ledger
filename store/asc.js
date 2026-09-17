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

// ── Teksten voor de in-app aankopen ───────────────────────
// App Store Connect staat 30 tekens toe voor de naam en 45 voor de
// beschrijving. Langer wordt geweigerd.
const IAP_TEXT = {
  'nl.crimsonledger.app.pass': {
    'nl-NL': ['Crimson Pass', "Alle werelden, hints en bordthema's."],
    'en-US': ['Crimson Pass', 'All worlds, hints and board themes.']
  },
  'nl.crimsonledger.app.hints10': {
    'nl-NL': ['10 hints', 'Tien extra hints van Van Dam.'],
    'en-US': ['10 hints', 'Ten extra hints from Van Dam.']
  },
  'nl.crimsonledger.app.cosmetics': {
    'nl-NL': ["Bordthema's en lijsten", "Drie bordthema's en drie lijsten."],
    'en-US': ['Board themes and frames', 'Three board themes and three frames.']
  },
  'nl.crimsonledger.app.world.hotel': {
    'nl-NL': ['Grand Hotel Aurora', '48 zaken in zes delen, eigen cast.'],
    'en-US': ['Grand Hotel Aurora', '48 cases in six parts, own cast.']
  },
  'nl.crimsonledger.app.world.ruimte': {
    'nl-NL': ['Station Orion', '48 zaken in zes delen, eigen cast.'],
    'en-US': ['Station Orion', '48 cases in six parts, own cast.']
  },
  'nl.crimsonledger.app.world.museum': {
    'nl-NL': ['Het Museum', '48 zaken in zes delen, eigen cast.'],
    'en-US': ['The Museum', '48 cases in six parts, own cast.']
  },
  'nl.crimsonledger.app.world.trein': {
    'nl-NL': ['De Nachttrein', '48 zaken in zes delen, eigen cast.'],
    'en-US': ['The Night Train', '48 cases in six parts, own cast.']
  },
  'nl.crimsonledger.app.world.circus': {
    'nl-NL': ['Het Circus', '48 zaken in zes delen, eigen cast.'],
    'en-US': ['The Circus', '48 cases in six parts, own cast.']
  },
  'nl.crimsonledger.app.world.skihut': {
    'nl-NL': ['De Skihut', '48 zaken in zes delen, eigen cast.'],
    'en-US': ['The Ski Lodge', '48 cases in six parts, own cast.']
  }
};

// Zet voor elke in-app aankoop de Nederlandse en de Engelse tekst klaar.
// Bestaat een taal al, dan wordt hij bijgewerkt in plaats van toegevoegd.
async function iapLocalizations() {
  const a = await app();
  const list = await get(`/v1/apps/${a.id}/inAppPurchasesV2?limit=50`);
  for (const p of list.data) {
    const pid = p.attributes.productId;
    const texts = IAP_TEXT[pid];
    if (!texts) { console.log(`overgeslagen, geen tekst bekend: ${pid}`); continue; }
    const have = await get(`/v2/inAppPurchases/${p.id}/inAppPurchaseLocalizations`);
    for (const [locale, [name, description]] of Object.entries(texts)) {
      if (name.length > 30) throw new Error(`naam te lang (${name.length}) voor ${pid} ${locale}`);
      if (description.length > 45) throw new Error(`beschrijving te lang (${description.length}) voor ${pid} ${locale}`);
      const existing = have.data.find(l => l.attributes.locale === locale);
      try {
      if (existing) {
        await api('PATCH', `/v1/inAppPurchaseLocalizations/${existing.id}`, {
          data: { type: 'inAppPurchaseLocalizations', id: existing.id, attributes: { name, description } }
        });
        console.log(`bijgewerkt  ${pid}  ${locale}  ${name}`);
      } else {
        await api('POST', '/v1/inAppPurchaseLocalizations', {
          data: {
            type: 'inAppPurchaseLocalizations',
            attributes: { name, description, locale },
            relationships: { inAppPurchaseV2: { data: { type: 'inAppPurchases', id: p.id } } }
          }
        });
        console.log(`toegevoegd  ${pid}  ${locale}  ${name}`);
      }
      } catch (e) {
        // een aankoop die al in een beoordeling zit, is op slot; de rest gaat door
        console.log(`MISLUKT     ${pid}  ${locale}  — ${e.message.split('\n').slice(1).join(' ').slice(0, 120)}`);
      }
    }
  }
}

// Koppelt een build aan versie 1.0, op nummer (bijvoorbeeld "4").
async function setBuild(versionNumber) {
  const a = await app();
  const versions = await get(`/v1/apps/${a.id}/appStoreVersions?filter[platform]=IOS&limit=1`);
  const v = versions.data[0];
  const builds = await get(`/v1/builds?filter[app]=${a.id}&limit=20&sort=-version`);
  const b = builds.data.find(x => x.attributes.version === String(versionNumber));
  if (!b) throw new Error(`build ${versionNumber} niet gevonden bij Apple`);
  await api('PATCH', `/v1/appStoreVersions/${v.id}`, {
    data: {
      type: 'appStoreVersions',
      id: v.id,
      relationships: { build: { data: { type: 'builds', id: b.id } } }
    }
  });
  console.log(`versie ${v.attributes.versionString} gekoppeld aan build ${b.attributes.version} (${b.id})`);
}

// Zet de versie en alle in-app aankopen in de lopende beoordelingsaanvraag.
// Zonder "--submit" wordt er alleen klaargezet, niet verzonden.
async function submit(doSubmit) {
  const a = await app();
  const versions = await get(`/v1/apps/${a.id}/appStoreVersions?filter[platform]=IOS&limit=1`);
  const v = versions.data[0];
  const iaps = await get(`/v1/apps/${a.id}/inAppPurchasesV2?limit=50`);

  let subs = await get(`/v1/reviewSubmissions?filter[app]=${a.id}&filter[state]=READY_FOR_REVIEW&limit=10`);
  let sub = subs.data[0];
  if (!sub) {
    const made = await api('POST', '/v1/reviewSubmissions', {
      data: {
        type: 'reviewSubmissions',
        attributes: { platform: 'IOS' },
        relationships: { app: { data: { type: 'apps', id: a.id } } }
      }
    });
    sub = made.data;
    console.log(`nieuwe aanvraag gemaakt: ${sub.id}`);
  } else {
    console.log(`bestaande aanvraag: ${sub.id} (${sub.attributes.state})`);
  }

  const items = await get(`/v1/reviewSubmissions/${sub.id}/items?limit=50&include=appStoreVersion,inAppPurchaseVersion`);
  const already = new Set();
  for (const it of items.data) {
    // het item-id is base64 van "<aanvraag>|<soort>|<id van het onderdeel>"
    const parts = Buffer.from(it.id, 'base64').toString('utf8').split('|');
    if (parts.length === 3) already.add(parts[2]);
    const r = it.relationships || {};
    for (const k of ['appStoreVersion', 'inAppPurchaseVersion']) {
      if (r[k] && r[k].data) already.add(r[k].data.id);
    }
  }

  const add = async (rel, id, label) => {
    if (already.has(id)) { console.log(`stond er al   ${label}`); return; }
    try {
      await api('POST', '/v1/reviewSubmissionItems', {
        data: {
          type: 'reviewSubmissionItems',
          relationships: {
            reviewSubmission: { data: { type: 'reviewSubmissions', id: sub.id } },
            [rel]: { data: { type: rel === 'appStoreVersion' ? 'appStoreVersions' : 'inAppPurchases', id } }
          }
        }
      });
      console.log(`toegevoegd    ${label}`);
    } catch (e) {
      console.log(`MISLUKT       ${label} — ${e.message.split('\n').slice(1).join(' ').slice(0, 160)}`);
    }
  };

  await add('appStoreVersion', v.id, `versie ${v.attributes.versionString}`);

  // Een in-app aankoop gaat als versie in de aanvraag, niet als product zelf.
  for (const p of iaps.data) {
    const pid = p.attributes.productId;
    let ver;
    try {
      const vs = await get(`/v2/inAppPurchases/${p.id}/versions`);
      ver = vs.data[0];
    } catch (e) { ver = null; }
    if (!ver) { console.log(`geen versie   ${pid}`); continue; }
    if (already.has(ver.id)) { console.log(`stond er al   ${pid}`); continue; }
    try {
      await api('POST', '/v1/reviewSubmissionItems', {
        data: {
          type: 'reviewSubmissionItems',
          relationships: {
            reviewSubmission: { data: { type: 'reviewSubmissions', id: sub.id } },
            inAppPurchaseVersion: { data: { type: 'inAppPurchaseVersions', id: ver.id } }
          }
        }
      });
      console.log(`toegevoegd    ${pid}`);
    } catch (e) {
      console.log(`MISLUKT       ${pid} — ${e.message.split('\n').slice(1).join(' ').slice(0, 200)}`);
    }
  }

  const after = await get(`/v1/reviewSubmissions/${sub.id}/items?limit=50`);
  console.log(`\nonderdelen in de aanvraag: ${after.data.length}`);

  if (!doSubmit) { console.log('niet verzonden (gebruik: submit --submit)'); return; }
  await api('PATCH', `/v1/reviewSubmissions/${sub.id}`, {
    data: { type: 'reviewSubmissions', id: sub.id, attributes: { submitted: true } }
  });
  const check = await get(`/v1/reviewSubmissions/${sub.id}`);
  console.log(`verzonden. status: ${check.data.attributes.state}`);
}

// Toont de laatste builds van Xcode Cloud, met de fouten van de laatste.
async function ci() {
  const products = await get('/v1/ciProducts?limit=10');
  for (const prod of products.data) {
    console.log(`Product ${prod.attributes.name} (${prod.id})`);
    const runs = await get(`/v1/ciProducts/${prod.id}/buildRuns?limit=5&sort=-number`);
    for (const r of runs.data) {
      const a = r.attributes;
      const sc = a.sourceCommit || {};
      console.log(`  build ${a.number}  ${a.executionProgress}  ${a.completionStatus || ''}  ${(sc.commitSha || '').slice(0, 8)}  ${(sc.message || '').split('\n')[0].slice(0, 50)}`);
    }
    const last = runs.data[0];
    if (last && last.attributes.completionStatus === 'FAILED') {
      const actions = await get(`/v1/ciBuildRuns/${last.id}/actions`);
      for (const act of actions.data) {
        if (act.attributes.completionStatus !== 'FAILED') continue;
        const issues = await get(`/v1/ciBuildActions/${act.id}/issues?limit=20`);
        const seen = new Set();
        console.log(`\n  fouten in "${act.attributes.name}":`);
        for (const i of issues.data) {
          if (i.attributes.issueType !== 'ERROR') continue;
          const m = (i.attributes.message || '').slice(0, 200);
          if (seen.has(m)) continue;
          seen.add(m);
          console.log(`    ${m}`);
        }
      }
    }
  }
}

const cmd = process.argv[2] || 'status';
(async () => {
  if (cmd === 'status') return status();
  if (cmd === 'get') return console.log(JSON.stringify(await get(process.argv[3]), null, 2));
  if (cmd === 'post') return console.log(JSON.stringify(await api('POST', process.argv[3], JSON.parse(process.argv[4])), null, 2));
  if (cmd === 'iap-locs') return iapLocalizations();
  if (cmd === 'set-build') return setBuild(process.argv[3]);
  if (cmd === 'submit') return submit(process.argv.includes('--submit'));
  if (cmd === 'ci') return ci();
  console.error(`onbekende opdracht: ${cmd}`);
  process.exit(2);
})().catch(e => { console.error(e.message); process.exit(1); });
