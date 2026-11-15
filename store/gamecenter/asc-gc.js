// Game Center in App Store Connect for Crimson Ledger (app 6812534368), from spec.js: 36 achievements and 2 leaderboards,
// with a name and descriptions in all 23 store languages and an image per achievement localization (Apple wants one in
// every language; the same file goes everywhere, the images carry no words). Uses the V2 resources (achievements and
// leaderboards with versions); the V1 ones are deprecated. Running it again only adds or corrects what differs.
//   node store/gamecenter/asc-gc.js status            what is there and what is missing (reads only)
//   node store/gamecenter/asc-gc.js apply             creates and corrects what is missing (achievements, texts, images)
//   node store/gamecenter/asc-gc.js apply --only=first_case,points   only these keys
//   node store/gamecenter/asc-gc.js signing [--apply] Game Center on the App ID and an App Store profile that carries the
//                                                     com.apple.developer.game-center entitlement (needed by release-ios.sh)
// Before running: node store/gamecenter/make-images.js (the images) and node store/gamecenter/spec.js (no problems).
// The API key comes from ~/.appstoreconnect (store/asc-api.js); nothing secret is printed or written here.
// After this, Game Center still has to go to App Review with an app version: in App Store Connect, the version page,
// section Game Center, switch it on and add the achievements and leaderboards (or see the gameCenterAppVersions note at
// the end of `status`). Apple allows 3600 API calls per hour; a full apply needs about 2600 and waits when the hour runs out.
const fs = require('fs'), path = require('path'), os = require('os');
const { APP, token, wait } = require('../asc-api');
const { spec, check } = require('./spec.js');

const BASE = 'https://api.appstoreconnect.apple.com';
const args = process.argv.slice(2), CMD = args[0] || 'status', APPLY = CMD === 'apply' || args.includes('--apply');
const ONLY = (args.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const q = encodeURIComponent;
let calls = 0, remaining = null;

// one request; waits when Apple says too many (429) or when the hourly budget is nearly used up
async function req(method, p, body, tries = 0) {
  if (remaining !== null && remaining < 40) { console.log(`  (uurbudget bijna op: ${remaining} over; 5 minuten wachten)`); await wait(300000); remaining = null; }
  const res = await fetch(p.startsWith('http') ? p : BASE + p, { method, headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  calls++;
  const rl = res.headers.get('x-rate-limit'), m = rl && rl.match(/user-hour-rem:(\d+)/);
  if (m) remaining = +m[1];
  if (res.status === 429 && tries < 12) { console.log('  (429: te veel verzoeken; 5 minuten wachten)'); await wait(300000); return req(method, p, body, tries + 1); }
  if (res.status >= 500 && tries < 3) { await wait(5000 * (tries + 1)); return req(method, p, body, tries + 1); }
  const text = await res.text(); let json = null; try { json = text ? JSON.parse(text) : null; } catch (e) { /* geen json */ }
  const errors = !res.ok ? ((json && json.errors) || [{ status: res.status, detail: text.slice(0, 300) }]).map(e => `${e.status} ${e.code || ''} ${e.detail || e.title || ''}`.trim()) : [];
  return { ok: res.ok, status: res.status, json, errors };
}
async function all(url) {
  const data = [], included = [];
  while (url) { const r = await req('GET', url); if (!r.ok) throw new Error(`GET ${url}: ${r.errors.join('; ')}`); data.push(...r.json.data); included.push(...(r.json.included || [])); url = r.json.links && r.json.links.next; }
  return { data, included };
}
const rel = (type, id) => ({ data: { type, id } });

// ── reading ─────────────────────────────────────────────────
async function detailId() {
  const r = await req('GET', `/v1/apps/${APP}/gameCenterDetail`);
  if (r.ok && r.json && r.json.data) return r.json.data.id;
  if (!APPLY) return null;
  const made = await req('POST', '/v1/gameCenterDetails', { data: { type: 'gameCenterDetails', relationships: { app: rel('apps', APP) } } });
  if (!made.ok) throw new Error('Game Center aanzetten mislukt: ' + made.errors.join('; '));
  console.log('Game Center aangezet voor de app');
  return made.json.data.id;
}
// kind: 'Achievement' | 'Leaderboard'. Returns vendorIdentifier → { id, attributes, version, locs: locale → { id, attributes, image } }
async function readItems(detail, kind) {
  const plural = kind === 'Achievement' ? 'gameCenterAchievementsV2' : 'gameCenterLeaderboardsV2';
  const { data, included } = await all(`/v1/gameCenterDetails/${detail}/${plural}?limit=200&include=versions&limit[versions]=50`);
  const out = {};
  for (const item of data) {
    const vids = ((item.relationships.versions || {}).data || []).map(v => v.id);
    const versions = included.filter(i => vids.includes(i.id)).sort((a, b) => (b.attributes.version || 0) - (a.attributes.version || 0));
    const version = versions[0] ? { id: versions[0].id, n: versions[0].attributes.version, state: versions[0].attributes.state } : null;
    const locs = {};
    if (version) {
      const L = await all(`/v2/gameCenter${kind}Versions/${version.id}/localizations?limit=200&include=image`);
      for (const l of L.data) {
        const imgRef = l.relationships && l.relationships.image && l.relationships.image.data;
        const img = imgRef && L.included.find(i => i.id === imgRef.id);
        locs[l.attributes.locale] = { id: l.id, attributes: l.attributes, image: img ? { id: img.id, state: ((img.attributes.assetDeliveryState || {}).state) || '?' } : null };
      }
    }
    out[item.attributes.vendorIdentifier] = { id: item.id, attributes: item.attributes, version, locs };
  }
  return out;
}

// ── writing ─────────────────────────────────────────────────
async function uploadImage(kind, locId, file) {
  const buf = fs.readFileSync(file), type = `gameCenter${kind}Images`;
  const made = await req('POST', `/v2/${type}`, { data: { type, attributes: { fileName: path.basename(file), fileSize: buf.length }, relationships: { localization: rel(`gameCenter${kind}Localizations`, locId) } } });
  if (!made.ok) return made.errors.join('; ');
  for (const op of made.json.data.attributes.uploadOperations || []) {
    const headers = {}; for (const h of op.requestHeaders || []) headers[h.name] = h.value;
    const r = await fetch(op.url, { method: op.method, headers, body: buf.subarray(op.offset, op.offset + op.length) });
    if (!r.ok) return `upload ${r.status}`;
  }
  const done = await req('PATCH', `/v2/${type}/${made.json.data.id}`, { data: { type, id: made.json.data.id, attributes: { uploaded: true } } });
  return done.ok ? null : done.errors.join('; ');
}

const badLocales = new Set();   // a locale Apple refuses once is not tried again for the next items
// a few at a time: each language is two to four calls, and Apple answers in one to three seconds
async function pool(list, n, fn) { let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < list.length) await fn(list[i++]); })); }
async function syncLocs(kind, item, want, image, report) {
  const type = `gameCenter${kind}Localizations`;
  await pool(Object.entries(want), 6, async ([locale, t]) => {
    if (!t || badLocales.has(locale)) return;
    let loc = item.locs[locale];
    if (!loc) {
      const r = await req('POST', `/v2/${type}`, { data: { type, attributes: Object.assign({ locale }, t), relationships: { version: rel(`gameCenter${kind}Versions`, item.version.id) } } });
      if (!r.ok) {
        report.push(`${item.key} ${locale}: taal niet aangemaakt: ${r.errors.join('; ')}`);
        if (r.errors.some(e => /locale/i.test(e))) badLocales.add(locale);
        return;
      }
      loc = item.locs[locale] = { id: r.json.data.id, attributes: r.json.data.attributes, image: null };
      report.created++;
    } else {
      const diff = Object.keys(t).filter(k => (loc.attributes[k] || '') !== t[k]);
      if (diff.length) {
        const r = await req('PATCH', `/v2/${type}/${loc.id}`, { data: { type, id: loc.id, attributes: Object.fromEntries(diff.map(k => [k, t[k]])) } });
        if (!r.ok) report.push(`${item.key} ${locale}: tekst niet bijgewerkt (${diff.join(', ')}): ${r.errors.join('; ')}`); else report.patched++;
      }
    }
    if (image && (!loc.image || ['FAILED', 'AWAITING_UPLOAD'].includes(loc.image.state))) {
      if (loc.image) await req('DELETE', `/v2/gameCenter${kind}Images/${loc.image.id}`);   // a half upload of our own: start again
      const err = await uploadImage(kind, loc.id, image);
      if (err) report.push(`${item.key} ${locale}: plaatje mislukt: ${err}`); else { loc.image = { state: 'UPLOAD_COMPLETE' }; report.images++; }
    }
  });
}

async function createAchievement(detail, a) {
  const r = await req('POST', '/v2/gameCenterAchievements', {
    data: { type: 'gameCenterAchievements',
      attributes: { referenceName: a.referenceName, vendorIdentifier: a.id, points: a.points, showBeforeEarned: a.showBeforeEarned, repeatable: a.repeatable },
      relationships: { gameCenterDetail: rel('gameCenterDetails', detail), versions: { data: [{ type: 'gameCenterAchievementVersions', id: '${v1}' }] } } },
    included: [{ type: 'gameCenterAchievementVersions', id: '${v1}' }]
  });
  return r;
}
async function createLeaderboard(detail, l) {
  const attributes = { referenceName: l.referenceName, vendorIdentifier: l.id, defaultFormatter: l.defaultFormatter, submissionType: l.submissionType,
    scoreSortType: l.scoreSortType, scoreRangeStart: l.scoreRangeStart, scoreRangeEnd: l.scoreRangeEnd };
  if (l.recurrenceRule) {
    // the first day must lie ahead: the next midnight (UTC) if the spec's date has passed
    const next = new Date(); next.setUTCHours(24, 0, 0, 0);
    Object.assign(attributes, { recurrenceStartDate: new Date(l.recurrenceStartDate) > new Date() ? l.recurrenceStartDate : next.toISOString(),
      recurrenceDuration: l.recurrenceDuration, recurrenceRule: l.recurrenceRule });
  }
  return req('POST', '/v2/gameCenterLeaderboards', {
    data: { type: 'gameCenterLeaderboards', attributes,
      relationships: { gameCenterDetail: rel('gameCenterDetails', detail), versions: { data: [{ type: 'gameCenterLeaderboardVersions', id: '${v1}' }] } } },
    included: [{ type: 'gameCenterLeaderboardVersions', id: '${v1}' }]
  });
}

// ── status / apply ──────────────────────────────────────────
async function run() {
  const s = spec(), problems = check(s);
  if (problems.length) { console.log('spec.js meldt problemen; eerst oplossen:\n' + problems.map(p => '  ' + p).join('\n')); process.exit(1); }
  const pick = x => !ONLY.length || ONLY.includes(x.key);
  const detail = await detailId();
  console.log(`Game Center: ${detail ? 'aan (' + detail + ')' : 'nog niet aan'}; ${APPLY ? 'aanmaken en bijwerken' : 'alleen kijken'}\n`);
  if (!detail) { console.log('apply zet Game Center aan en maakt alles aan.'); return; }

  const report = Object.assign([], { created: 0, patched: 0, images: 0, items: 0 });
  for (const [kind, list] of [['Achievement', s.achievements], ['Leaderboard', s.leaderboards]]) {
    const have = await readItems(detail, kind);
    console.log(`${kind === 'Achievement' ? 'Prestaties' : 'Ranglijsten'}: ${Object.keys(have).length} in App Store Connect, ${list.length} in spec.js`);
    for (const x of list.filter(pick)) {
      let item = have[x.id];
      const want = x.loc, image = kind === 'Achievement' ? x.image : fs.existsSync(path.join(__dirname, 'images', `board.${x.key}.png`)) ? path.join(__dirname, 'images', `board.${x.key}.png`) : null;
      if (!APPLY) {
        const locs = item ? Object.keys(item.locs) : [], imgs = item ? Object.values(item.locs).filter(l => l.image && l.image.state !== 'FAILED').length : 0;
        const diff = item ? Object.entries(want).filter(([lc, t]) => item.locs[lc] && Object.keys(t).some(k => (item.locs[lc].attributes[k] || '') !== t[k])).length : 0;
        const missing = s.locales.filter(lc => !locs.includes(lc));
        console.log(`  ${x.id.padEnd(30)} ${item ? `v${item.version ? item.version.n : '?'} ${item.version ? item.version.state : ''}`.padEnd(28) : 'ontbreekt'.padEnd(28)} talen ${locs.length}/${s.locales.length}  plaatjes ${imgs}/${image ? s.locales.length : 0}${diff ? `  ${diff} tekst(en) anders` : ''}${missing.length && item ? '  mist: ' + missing.join(' ') : ''}`);
        continue;
      }
      if (!item) {
        const r = kind === 'Achievement' ? await createAchievement(detail, x) : await createLeaderboard(detail, x);
        if (!r.ok) {
          console.log(`\nSTOP: ${x.id} niet aangemaakt: ${r.errors.join('; ')}`);
          console.log(`Klaar tot hier; ${calls} API-verzoeken. Zie de fout hierboven, pas spec.js of dit script aan en draai opnieuw: node store/gamecenter/asc-gc.js apply`);
          process.exit(1);
        }
        const id = r.json.data.id;
        let v = (r.json.included || []).find(i => i.type === `gameCenter${kind}Versions`);
        if (!v) { const vs = await req('GET', `/v2/gameCenter${kind}s/${id}/versions?limit=5`); v = vs.ok && vs.json.data[0]; }
        if (!v) { console.log(`\nSTOP: ${x.id} aangemaakt (${id}), maar zonder versie terug te lezen`); process.exit(1); }
        item = { id, attributes: r.json.data.attributes, version: { id: v.id, n: v.attributes.version, state: v.attributes.state }, locs: {} };
        report.items++;
        console.log(`  ${x.id}: aangemaakt (${item.id})`);
      }
      item.key = x.key;
      if (!item.version) { report.push(`${x.id}: geen versie gevonden`); continue; }
      if (!['PREPARE_FOR_SUBMISSION', 'READY_FOR_REVIEW', 'DEVELOPER_REJECTED', 'REJECTED'].includes(item.version.state) && Object.keys(item.locs).length === s.locales.length) {
        continue;   // live or under review: leave it as it is
      }
      const before = [report.created, report.patched, report.images];
      await syncLocs(kind, item, want, image, report);
      console.log(`  ${x.id.padEnd(30)} talen +${report.created - before[0]}, teksten bijgewerkt ${report.patched - before[1]}, plaatjes +${report.images - before[2]}  (${calls} verzoeken, ${remaining ?? '?'} over dit uur)`);
    }
    console.log('');
  }
  if (APPLY) {
    console.log(`Klaar: ${report.items} nieuw, ${report.created} talen, ${report.patched} teksten bijgewerkt, ${report.images} plaatjes; ${calls} API-verzoeken.`);
    if (badLocales.size) console.log(`Talen die Apple weigert voor Game Center: ${[...badLocales].join(', ')}`);
    if (report.length) { console.log(`\n${report.length} meldingen:`); report.slice(0, 60).forEach(r => console.log('  ' + r)); }
  }
  // Game Center on an app version (the switch on the version page in App Store Connect)
  const av = await all(`/v1/gameCenterDetails/${detail}/gameCenterAppVersions?limit=20&include=appStoreVersion`);
  for (const v of av.data) {
    const sv = av.included.find(i => i.type === 'appStoreVersions' && v.relationships.appStoreVersion && v.relationships.appStoreVersion.data && i.id === v.relationships.appStoreVersion.data.id);
    console.log(`\nGame Center op appversie ${sv ? sv.attributes.versionString + ' (' + (sv.attributes.appStoreState || sv.attributes.appVersionState) + ')' : '?'}: ${v.attributes.enabled ? 'aan' : 'uit'}`);
  }
  console.log('Game Center gaat met de volgende appversie naar App Review: zet in App Store Connect bij die versie Game Center aan en voeg de prestaties en ranglijsten toe.');
  console.log(`(${calls} API-verzoeken)`);
}

// ── signing: Game Center on the App ID, and an App Store profile with the entitlement ──
async function signing() {
  const ID = 'nl.crimsonledger.app', PROFILE = 'Crimson Ledger App Store GC', OLD = 'Crimson Ledger App Store';
  const b = await req('GET', `/v1/bundleIds?filter[identifier]=${q(ID)}&include=bundleIdCapabilities&limit=5`);
  const bid = b.json.data.find(x => x.attributes.identifier === ID);
  const caps = (b.json.included || []).filter(i => i.type === 'bundleIdCapabilities').map(i => i.attributes.capabilityType);
  console.log(`App ID ${ID}: ${caps.join(', ') || 'geen'}`);
  const profile = async name => { const r = await req('GET', `/v1/profiles?filter[name]=${q(name)}&limit=5`); return ((r.json || {}).data || []).find(p => p.attributes.profileState === 'ACTIVE'); };
  const hasGC = p => p && Buffer.from(p.attributes.profileContent, 'base64').toString('latin1').includes('com.apple.developer.game-center');
  const old = await profile(OLD), gc = await profile(PROFILE);
  console.log(`profiel "${OLD}": ${old ? (hasGC(old) ? 'met' : 'zonder') + ' Game Center' : 'niet actief'}; "${PROFILE}": ${gc ? (hasGC(gc) ? 'met' : 'zonder') + ' Game Center' : 'bestaat niet'}`);
  if (!APPLY) { console.log(`\nnode store/gamecenter/asc-gc.js signing --apply zet Game Center op het App ID (als dat nodig is) en maakt "${PROFILE}" met Game Center. Let op: een nieuwe capability op het App ID kan de bestaande profielen van dat App ID ongeldig maken, ook "${OLD}" (de bouw van main zonder Game Center); doe het pas als de versie met Game Center gebouwd wordt.`); return; }
  if (!caps.includes('GAME_CENTER')) {
    const r = await req('POST', '/v1/bundleIdCapabilities', { data: { type: 'bundleIdCapabilities', attributes: { capabilityType: 'GAME_CENTER' }, relationships: { bundleId: rel('bundleIds', bid.id) } } });
    console.log(r.ok ? 'Game Center aangezet op het App ID' : 'Game Center op het App ID mislukt: ' + r.errors.join('; '));
  }
  let prof = gc && hasGC(gc) ? gc : null;
  if (!prof) {
    const main = await req('GET', `/v1/profiles?filter[name]=${q(OLD)}&include=certificates&limit=5`);
    const cert = ((main.json || {}).included || []).find(i => i.type === 'certificates');
    if (!cert) { console.log(`geen certificaat gevonden op "${OLD}"`); return; }
    const made = await req('POST', '/v1/profiles', { data: { type: 'profiles', attributes: { name: PROFILE, profileType: 'IOS_APP_STORE' },
      relationships: { bundleId: rel('bundleIds', bid.id), certificates: { data: [{ type: 'certificates', id: cert.id }] } } } });
    if (!made.ok) { console.log('profiel niet gemaakt: ' + made.errors.join('; ')); return; }
    prof = made.json.data;
    console.log(`profiel "${PROFILE}" gemaakt: ${hasGC(prof) ? 'met' : 'ZONDER'} Game Center`);
  }
  const bytes = Buffer.from(prof.attributes.profileContent, 'base64');
  for (const dir of ['Library/Developer/Xcode/UserData/Provisioning Profiles', 'Library/MobileDevice/Provisioning Profiles']) {
    const d = path.join(os.homedir(), dir); fs.mkdirSync(d, { recursive: true }); fs.writeFileSync(path.join(d, `${prof.attributes.uuid}.mobileprovision`), bytes);
  }
  console.log(`geïnstalleerd voor Xcode (${prof.attributes.uuid}); store/build/ExportOptions-manual.plist gebruikt "${PROFILE}"`);
}

(CMD === 'signing' ? signing() : ['status', 'apply'].includes(CMD) ? run() : Promise.resolve(console.log('gebruik: node store/gamecenter/asc-gc.js status | apply [--only=a,b] | signing [--apply]'))).catch(e => { console.error(e.message || e); process.exit(1); });
