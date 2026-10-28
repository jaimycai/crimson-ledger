// Product Page Optimization: an A/B test of the store page against the live version, without a new build.
//   node store/asc-experiment.js list                                  experiments and their state (reads only)
//   node store/asc-experiment.js create <name> <traffic%> [locale...]  draft with one treatment: the cards in
//                                                                      store/cards-65{-<language>}, for every locale of
//                                                                      store/metadata/<live version>.json unless named
//   node store/asc-experiment.js fill <experimentId> [locale...]       upload the cards again into an existing draft
//   node store/asc-experiment.js submit <experimentId>                 send the draft to App Review; Apple starts it
//                                                                      after approval, and it runs until stopped
//   node store/asc-experiment.js stop <experimentId>                   end a running test (the original stays)
// Why (store/CONVERSIE.md, step 3): the real conversion of the new cards per country, before they go into 1.5.
// A treatment localization takes the same 6.5" set (APP_IPHONE_65) as the version itself (store/asc-assets.js).
// Apple copies the live screenshots into each new treatment localization, so those are deleted before the upload.
const fs = require('fs'); const path = require('path');
const { api, APP } = require('./asc-api');
const { upload, processed, cardsFor } = require('./asc-assets');

async function list() {
  const r = await api('GET', `/v1/apps/${APP}/appStoreVersionExperimentsV2?limit=20`);
  for (const e of (r && r.data) || []) {
    const a = e.attributes;
    console.log(e.id, a.state, `${a.trafficProportion}%`, a.name, '|', a.startDate || '', a.endDate || '');
  }
  if (r && !r.data.length) console.log('no experiments');
}

async function liveLocales() {
  const r = await api('GET', `/v1/apps/${APP}/appStoreVersions?filter[platform]=IOS&filter[appStoreState]=READY_FOR_SALE`);
  const v = r && r.data[0] && r.data[0].attributes.versionString;
  const file = v && path.join(__dirname, 'metadata', `${v}.json`);
  if (!file || !fs.existsSync(file)) { console.log('STOP: no store/metadata file for the live version', v); return null; }
  console.log('live version', v);
  return Object.keys(JSON.parse(fs.readFileSync(file, 'utf8')));
}

// The 6.5" set of one treatment localization gets the cards of its language, in file-name order.
async function fillLocalization(locId, locale) {
  const dir = cardsFor(locale), short = path.relative(path.join(__dirname, '..'), dir);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort() : [];
  if (!files.length || files.length > 10) return console.log(locale.padEnd(8), `SKIP: ${short} has ${files.length} PNGs`);
  const sets = await api('GET', `/v1/appStoreVersionExperimentTreatmentLocalizations/${locId}/appScreenshotSets?limit=50`);
  let set = sets && sets.data.find(x => x.attributes.screenshotDisplayType === 'APP_IPHONE_65');
  if (!set) {
    const r = await api('POST', '/v1/appScreenshotSets', { data: { type: 'appScreenshotSets', attributes: { screenshotDisplayType: 'APP_IPHONE_65' }, relationships: { appStoreVersionExperimentTreatmentLocalization: { data: { type: 'appStoreVersionExperimentTreatmentLocalizations', id: locId } } } } });
    set = r && r.data;
    if (!set) return console.log(locale.padEnd(8), 'FAIL: no screenshot set');
  }
  const old = await api('GET', `/v1/appScreenshotSets/${set.id}/appScreenshots?limit=50`);
  let deleted = 0;
  for (const x of (old && old.data) || []) if (await api('DELETE', `/v1/appScreenshots/${x.id}`)) deleted++;
  const ids = [];
  for (const f of files) { const sid = await upload('appScreenshots', set.id, path.join(dir, f)); if (sid) ids.push(sid); }
  const ok = await processed(ids, locale);
  const ordered = ids.length ? await api('PATCH', `/v1/appScreenshotSets/${set.id}/relationships/appScreenshots`, { data: ids.map(x => ({ type: 'appScreenshots', id: x })) }) : null;
  console.log(locale.padEnd(8), short.padEnd(22), `deleted ${deleted}  uploaded ${ids.length}/${files.length}  processed ${ok}/${files.length}  order ${ordered ? 'set' : 'not set'}`);
}

async function fill(id, only) {
  const trs = await api('GET', `/v2/appStoreVersionExperiments/${id}/appStoreVersionExperimentTreatments`);
  for (const tr of (trs && trs.data) || []) {
    const locs = await api('GET', `/v1/appStoreVersionExperimentTreatments/${tr.id}/appStoreVersionExperimentTreatmentLocalizations?limit=50`);
    for (const l of (locs && locs.data) || []) if (!only.length || only.includes(l.attributes.locale)) await fillLocalization(l.id, l.attributes.locale);
  }
}

async function create(name, traffic, only) {
  const locales = only.length ? only : await liveLocales(); if (!locales) return;
  const exp = await api('POST', '/v2/appStoreVersionExperiments', { data: { type: 'appStoreVersionExperiments', attributes: { name, trafficProportion: traffic, platform: 'IOS' }, relationships: { app: { data: { type: 'apps', id: APP } } } } });
  if (!exp) return;
  const id = exp.data.id; console.log('experiment', id, exp.data.attributes.state);
  const tr = await api('POST', '/v1/appStoreVersionExperimentTreatments', { data: { type: 'appStoreVersionExperimentTreatments', attributes: { name: 'Bold headline, iPhone' }, relationships: { appStoreVersionExperimentV2: { data: { type: 'appStoreVersionExperiments', id } } } } });
  if (!tr) return console.log('STOP: experiment', id, 'has no treatment');
  for (const locale of locales) {
    const loc = await api('POST', '/v1/appStoreVersionExperimentTreatmentLocalizations', { data: { type: 'appStoreVersionExperimentTreatmentLocalizations', attributes: { locale }, relationships: { appStoreVersionExperimentTreatment: { data: { type: 'appStoreVersionExperimentTreatments', id: tr.data.id } } } } });
    if (loc) await fillLocalization(loc.data.id, locale); else console.log(locale.padEnd(8), 'FAIL: no treatment localization');
  }
  console.log(`draft ready; submit with: node store/asc-experiment.js submit ${id}`);
}

async function submit(id) {
  const sub = await api('POST', '/v1/reviewSubmissions', { data: { type: 'reviewSubmissions', attributes: { platform: 'IOS' }, relationships: { app: { data: { type: 'apps', id: APP } } } } });
  if (!sub) return;
  const item = await api('POST', '/v1/reviewSubmissionItems', { data: { type: 'reviewSubmissionItems', relationships: { reviewSubmission: { data: { type: 'reviewSubmissions', id: sub.data.id } }, appStoreVersionExperimentV2: { data: { type: 'appStoreVersionExperiments', id } } } } });
  if (!item) return console.log('STOP: review submission', sub.data.id, 'made but the experiment is not in it');
  const s = await api('PATCH', `/v1/reviewSubmissions/${sub.data.id}`, { data: { type: 'reviewSubmissions', id: sub.data.id, attributes: { submitted: true } } });
  console.log('review submission', sub.data.id, s ? s.data.attributes.state : 'not submitted');
}

async function stop(id) {
  const r = await api('PATCH', `/v2/appStoreVersionExperiments/${id}`, { data: { type: 'appStoreVersionExperiments', id, attributes: { started: false } } });
  console.log(r ? `experiment ${id} ${r.data.attributes.state}` : 'not stopped');
}

const [cmd, a, b, ...rest] = process.argv.slice(2);
const usage = () => console.log('usage: list | create <name> <traffic%> [locale...] | fill <experimentId> [locale...] | submit <experimentId> | stop <experimentId>');
if (cmd === 'list') list();
else if (cmd === 'create' && a && Number(b) > 0) create(a, Number(b), rest);
else if (cmd === 'fill' && a) fill(a, [b, ...rest].filter(Boolean));
else if (cmd === 'submit' && a) submit(a);
else if (cmd === 'stop' && a) stop(a);
else usage();
