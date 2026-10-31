// Screenshots and app previews of an App Store version, per store localization.
//   node store/asc-assets.js list <version>                          what each localization has now (reads only)
//   node store/asc-assets.js screenshots <version> [storeLocale...]  replace the 6.5" screenshots (APP_IPHONE_65)
//   node store/asc-assets.js screenshots <version> --ipad [...]      the same for the iPad 13" set (APP_IPAD_PRO_3GEN_129)
//   node store/asc-assets.js previews <version>                      list the app preview videos
//   node store/asc-assets.js previews <version> delete               delete every app preview video of that version
// screenshots: the locales default to all of store/metadata/<version>.json (or, without that file, all localizations
// the version has). Each locale gets the cards of its app language: nl-NL from store/cards-65, every other locale from
// store/cards-65-<language> (en-US and en-GB → -en, es-ES and es-MX → -es, pt-BR and pt-PT → -pt, zh-Hans → -zh,
// de-DE → -de, ja → -ja, ...). A new version copies the screenshots of the previous one, so those are deleted first;
// then the PNGs are uploaded in file-name order and the script waits until Apple has processed each one.
// A locale the version does not have yet is skipped: create it first with asc-release.js metadata.
const crypto = require('crypto'); const fs = require('fs'); const path = require('path');
const { api, wait, APP } = require('./asc-api');

async function upload(kind, setId, file, extra = {}) {
  const buf = fs.readFileSync(file);
  const type = kind === 'appScreenshots' ? 'appScreenshots' : 'appPreviews';
  const rel = kind === 'appScreenshots' ? { appScreenshotSet: { data: { type: 'appScreenshotSets', id: setId } } } : { appPreviewSet: { data: { type: 'appPreviewSets', id: setId } } };
  const made = await api('POST', `/v1/${type}`, { data: { type, attributes: { fileName: path.basename(file), fileSize: buf.length, ...extra }, relationships: rel } });
  if (!made) return null;
  for (const op of made.data.attributes.uploadOperations) {
    const headers = {}; for (const h of op.requestHeaders) headers[h.name] = h.value;
    const r = await fetch(op.url, { method: op.method, headers, body: buf.subarray(op.offset, op.offset + op.length) });
    if (!r.ok) { console.log('part failed', r.status, path.basename(file)); return null; }
  }
  const md5 = crypto.createHash('md5').update(buf).digest('hex');
  const done = await api('PATCH', `/v1/${type}/${made.data.id}`, { data: { type, id: made.data.id, attributes: { uploaded: true, sourceFileChecksum: md5 } } });
  if (!done) console.log('FAIL', path.basename(file));
  return done ? made.data.id : null;
}

// The App Store version with this versionString, and its localizations by locale.
async function findVersion(v) {
  const r = await api('GET', `/v1/apps/${APP}/appStoreVersions?filter[versionString]=${v}&filter[platform]=IOS`);
  const ver = r && r.data[0];
  if (!ver) { console.log('no version', v, '(create it first: node store/asc-release.js prepare', v + ')'); return null; }
  const locs = await api('GET', `/v1/appStoreVersions/${ver.id}/appStoreVersionLocalizations?limit=200`);
  if (!locs) return null;
  console.log('version', v, ver.attributes.appStoreState, '-', locs.data.length, 'localizations');
  return { ver, locs: Object.fromEntries(locs.data.map(l => [l.attributes.locale, l])) };
}

// iPhone 6.5" (APP_IPHONE_65) from store/cards-65[-lang]; with --ipad the iPad 12.9"/13" set (APP_IPAD_PRO_3GEN_129,
// 2048×2732) from store/cards-ipad[-lang] (store/make-screenshots.js ipad + store/make-store-cards.js ipad).
const IPAD = process.argv.includes('--ipad');
const DISPLAY = IPAD ? 'APP_IPAD_PRO_3GEN_129' : 'APP_IPHONE_65';
function cardsFor(locale) {
  const lang = locale.split('-')[0], base = IPAD ? 'cards-ipad' : 'cards-65';
  return path.join(__dirname, lang === 'nl' ? base : `${base}-${lang}`);
}

async function setsOf(locId) {
  const r = await api('GET', `/v1/appStoreVersionLocalizations/${locId}/appScreenshotSets?limit=50`);
  return r ? r.data : [];
}
async function shotsOf(setId) {
  const r = await api('GET', `/v1/appScreenshotSets/${setId}/appScreenshots?limit=50`);
  return r ? r.data : [];
}
async function previewSetsOf(locId) {
  const r = await api('GET', `/v1/appStoreVersionLocalizations/${locId}/appPreviewSets?limit=50`);
  return r ? r.data : [];
}
async function previewsOf(setId) {
  const r = await api('GET', `/v1/appPreviewSets/${setId}/appPreviews?limit=50`);
  return r ? r.data : [];
}

// Polls until every screenshot is COMPLETE or FAILED (at most ten minutes). Returns the number that is COMPLETE.
async function processed(ids, locale) {
  const state = {};
  for (let i = 0; i < 120; i++) {
    for (const id of ids) {
      if (['COMPLETE', 'FAILED'].includes(state[id])) continue;
      const r = await api('GET', `/v1/appScreenshots/${id}?fields[appScreenshots]=fileName,assetDeliveryState`);
      const d = r && r.data.attributes.assetDeliveryState;
      state[id] = d ? d.state : 'UNKNOWN';
      if (state[id] === 'FAILED') console.log(locale, 'processing FAILED', r.data.attributes.fileName, JSON.stringify(d.errors || []).slice(0, 300));
    }
    if (ids.every(id => ['COMPLETE', 'FAILED'].includes(state[id]))) break;
    await wait(5000);
  }
  return ids.filter(id => state[id] === 'COMPLETE').length;
}

async function screenshots(v, only) {
  const found = await findVersion(v); if (!found) return;
  const metaFile = path.join(__dirname, 'metadata', `${v}.json`);
  const locales = only.length ? only : fs.existsSync(metaFile) ? Object.keys(JSON.parse(fs.readFileSync(metaFile, 'utf8'))) : Object.keys(found.locs);
  for (const locale of locales) {
    const loc = found.locs[locale];
    const dir = cardsFor(locale), short = path.relative(path.join(__dirname, '..'), dir);
    if (!loc) { console.log(locale.padEnd(8), 'SKIP: the version has no such localization (run asc-release.js metadata first)'); continue; }
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort() : [];
    if (!files.length || files.length > 10) { console.log(locale.padEnd(8), `SKIP: ${short} has ${files.length} PNGs (needs 1 to 10), nothing deleted`); continue; }
    const sets = await setsOf(loc.id);
    let set = sets.find(s => s.attributes.screenshotDisplayType === DISPLAY);
    if (!set) {
      const r = await api('POST', '/v1/appScreenshotSets', { data: { type: 'appScreenshotSets', attributes: { screenshotDisplayType: DISPLAY }, relationships: { appStoreVersionLocalization: { data: { type: 'appStoreVersionLocalizations', id: loc.id } } } } });
      set = r && r.data;
      if (!set) { console.log(locale.padEnd(8), `FAIL: could not create the ${DISPLAY} set`); continue; }
    }
    const old = await shotsOf(set.id);
    let deleted = 0;
    for (const s of old) if (await api('DELETE', `/v1/appScreenshots/${s.id}`)) deleted++;
    const ids = [];
    for (const f of files) { const id = await upload('appScreenshots', set.id, path.join(dir, f)); if (id) ids.push(id); }
    const ok = await processed(ids, locale);
    // Upload order is normally the display order; this makes it certain.
    const ordered = ids.length ? await api('PATCH', `/v1/appScreenshotSets/${set.id}/relationships/appScreenshots`, { data: ids.map(id => ({ type: 'appScreenshots', id })) }) : null;
    const others = sets.filter(s => s.attributes.screenshotDisplayType !== DISPLAY).map(s => s.attributes.screenshotDisplayType);
    console.log(locale.padEnd(8), short.padEnd(22), `deleted ${deleted}/${old.length}  uploaded ${ids.length}/${files.length}  processed ${ok}/${files.length}  order ${ordered ? 'set' : 'not set'}${others.length ? '  other sets still there: ' + others.join(', ') : ''}`);
  }
}

async function previews(v, mode) {
  const found = await findVersion(v); if (!found) return;
  let total = 0, deleted = 0;
  for (const [locale, loc] of Object.entries(found.locs)) {
    const parts = [];
    for (const ps of await previewSetsOf(loc.id)) {
      const vids = await previewsOf(ps.id);
      total += vids.length;
      if (mode === 'delete') for (const p of vids) if (await api('DELETE', `/v1/appPreviews/${p.id}`)) deleted++;
      if (vids.length) parts.push(`${ps.attributes.previewType} ${vids.map(p => p.attributes.fileName).join(', ')}`);
    }
    if (parts.length) console.log(locale.padEnd(8), mode === 'delete' ? 'deleted' : 'has', parts.join('; '));
  }
  console.log(mode === 'delete' ? `deleted ${deleted} of ${total} app previews` : `${total} app previews (add "delete" to remove them all)`);
}

async function list(v) {
  const found = await findVersion(v); if (!found) return;
  for (const [locale, loc] of Object.entries(found.locs)) {
    const parts = [];
    for (const s of await setsOf(loc.id)) parts.push(`${s.attributes.screenshotDisplayType} ${(await shotsOf(s.id)).length}`);
    for (const ps of await previewSetsOf(loc.id)) parts.push(`${ps.attributes.previewType} video ${(await previewsOf(ps.id)).length}`);
    console.log(locale.padEnd(8), parts.join('  ') || 'no screenshots or previews');
  }
}

const [cmd, v, ...rest] = process.argv.slice(2);
const usage = () => console.log('usage: list <version> | screenshots <version> [--ipad] [storeLocale...] | previews <version> [delete]');
module.exports = { upload, processed, cardsFor };
if (require.main !== module) {}
else if (!v) usage();
else ({ list: () => list(v), screenshots: () => screenshots(v, rest.filter(a => a !== '--ipad')), previews: () => previews(v, rest[0]) }[cmd] || usage)();
