// In-App Event in App Store Connect. Event images take only uploaded: true (no checksum, unlike app screenshots).
// In-App Event in App Store Connect from a spec in store/events/<name>.json: event, one localization per store
// language, the same wordless card (1920x1080) and details image (1080x1920) for every language, then review.
//   node store/events/asc-event.js store/events/zaak-van-de-week.json            create as draft
//   node store/events/asc-event.js store/events/zaak-van-de-week.json --submit   also submit for review
//   node store/events/asc-event.js list
const fs = require('fs'); const path = require('path');
const { api, wait, APP } = require('../asc-api');

async function uploadShot(locId, file, assetType) {
  const buf = fs.readFileSync(file);
  const made = await api('POST', '/v1/appEventScreenshots', { data: { type: 'appEventScreenshots',
    attributes: { fileName: path.basename(file), fileSize: buf.length, appEventAssetType: assetType },
    relationships: { appEventLocalization: { data: { type: 'appEventLocalizations', id: locId } } } } });
  if (!made) return false;
  for (const op of made.data.attributes.uploadOperations) {
    const headers = {}; for (const h of op.requestHeaders) headers[h.name] = h.value;
    const r = await fetch(op.url, { method: op.method, headers, body: buf.subarray(op.offset, op.offset + op.length) });
    if (!r.ok) { console.log('part failed', r.status); return false; }
  }
  return !!await api('PATCH', `/v1/appEventScreenshots/${made.data.id}`, { data: { type: 'appEventScreenshots', id: made.data.id, attributes: { uploaded: true } } });
}

async function create(file, submit) {
  const s = JSON.parse(fs.readFileSync(file, 'utf8'));
  const terr = await api('GET', '/v1/territories?limit=200');
  const territories = terr.data.map(t => t.id);
  const ev = await api('POST', '/v1/appEvents', { data: { type: 'appEvents', attributes: {
    referenceName: s.referenceName, badge: s.badge, purpose: s.purpose, primaryLocale: s.primaryLocale, priority: s.priority,
    purchaseRequirement: s.purchaseRequirement, deepLink: s.deepLink,   // required by review; the app has no URL scheme, so the store page
    territorySchedules: [{ territories, publishStart: s.publishStart, eventStart: s.eventStart, eventEnd: s.eventEnd }] },
    relationships: { app: { data: { type: 'apps', id: APP } } } } });
  if (!ev) return;
  const id = ev.data.id; console.log('event', id, territories.length, 'territories');
  // Apple creates the primary-locale localization with the event; fill that one and add the rest.
  const have = await api('GET', `/v1/appEvents/${id}/localizations?limit=50`);
  const byLocale = Object.fromEntries(((have && have.data) || []).map(l => [l.attributes.locale, l.id]));
  const art = { EVENT_CARD: path.join(__dirname, 'event-card.png'), EVENT_DETAILS_PAGE: path.join(__dirname, 'event-details.png') };
  let ok = 0;
  for (const [locale, [name, shortDescription, longDescription]] of Object.entries(s.locales)) {
    let locId = byLocale[locale];
    if (locId) await api('PATCH', `/v1/appEventLocalizations/${locId}`, { data: { type: 'appEventLocalizations', id: locId, attributes: { name, shortDescription, longDescription } } });
    else { const l = await api('POST', '/v1/appEventLocalizations', { data: { type: 'appEventLocalizations', attributes: { locale, name, shortDescription, longDescription }, relationships: { appEvent: { data: { type: 'appEvents', id } } } } });
      locId = l && l.data.id; }
    if (!locId) { console.log(locale, 'MISLUKT (tekst)'); continue; }
    const card = await uploadShot(locId, art.EVENT_CARD, 'EVENT_CARD'), details = await uploadShot(locId, art.EVENT_DETAILS_PAGE, 'EVENT_DETAILS_PAGE');
    const shots = card && details;
    console.log(locale, shots ? 'toegevoegd' : 'MISLUKT (beeld)'); if (shots) ok++;
  }
  console.log(ok, 'van', Object.keys(s.locales).length, 'talen compleet');
  if (!submit) return console.log('event DRAFT; run again with --submit on a new spec, or submit in App Store Connect');
  await wait(20000);   // Apple processes the images before the event can go to review
  const sub = await api('POST', '/v1/reviewSubmissions', { data: { type: 'reviewSubmissions', attributes: { platform: 'IOS' }, relationships: { app: { data: { type: 'apps', id: APP } } } } });
  if (!sub) return;
  const item = await api('POST', '/v1/reviewSubmissionItems', { data: { type: 'reviewSubmissionItems', relationships: { reviewSubmission: { data: { type: 'reviewSubmissions', id: sub.data.id } }, appEvent: { data: { type: 'appEvents', id } } } } });
  if (!item) return console.log('STOP: submission', sub.data.id, 'has no item');
  const done = await api('PATCH', `/v1/reviewSubmissions/${sub.data.id}`, { data: { type: 'reviewSubmissions', id: sub.data.id, attributes: { submitted: true } } });
  console.log('review submission', sub.data.id, done ? done.data.attributes.state : 'not submitted');
}

async function list() {
  const r = await api('GET', `/v1/apps/${APP}/appEvents?limit=20`);
  for (const e of (r && r.data) || []) console.log(e.id.slice(0, 8), e.attributes.referenceName, '|', e.attributes.eventState, '|', JSON.stringify(e.attributes.territorySchedules[0] && { start: e.attributes.territorySchedules[0].eventStart, end: e.attributes.territorySchedules[0].eventEnd }));
}

const [arg, flag] = process.argv.slice(2);
if (arg === 'list') list(); else if (arg) create(arg, flag === '--submit'); else console.log('usage: list | <spec.json> [--submit]');
