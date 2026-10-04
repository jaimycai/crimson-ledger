// Release an iOS version through App Store Connect.
//   node store/asc-release.js status
//   node store/asc-release.js prepare <version> <build> [notes.json]   create the version, set "What's New", attach the build
//   node store/asc-release.js submit <version>                         submit that version for review
//   node store/asc-release.js cancel                                   withdraw the submission waiting for review
// notes.json holds { "nl-NL": "...", "en-US": "..." }. Builds are uploaded first with xcodebuild (see the memory notes).
const fs = require('fs');
const { api, wait, APP } = require('./asc-api');

async function version(v) {
  const r = await api('GET', `/v1/apps/${APP}/appStoreVersions?filter[versionString]=${v}&filter[platform]=IOS&include=build`);
  return r && r.data[0] ? { v: r.data[0], build: (r.included || []).find(i => i.type === 'builds') } : null;
}

async function status() {
  const r = await api('GET', `/v1/apps/${APP}/appStoreVersions?limit=3&include=build&fields[appStoreVersions]=versionString,appStoreState,build`);
  for (const v of r.data) {
    const b = (r.included || []).find(i => i.type === 'builds' && v.relationships.build.data && i.id === v.relationships.build.data.id);
    console.log('version', v.attributes.versionString, v.attributes.appStoreState, 'build', b ? b.attributes.version : '-');
  }
  const s = await api('GET', `/v1/reviewSubmissions?filter[app]=${APP}&limit=3`);
  for (const x of s.data) console.log('submission', x.id.slice(0, 8), x.attributes.state, x.attributes.submittedDate || '');
}

async function prepare(v, buildNumber, notesFile) {
  let found = await version(v);
  if (!found) {
    const r = await api('POST', '/v1/appStoreVersions', { data: { type: 'appStoreVersions', attributes: { platform: 'IOS', versionString: v, releaseType: 'AFTER_APPROVAL' }, relationships: { app: { data: { type: 'apps', id: APP } } } } });
    if (!r) return;
    found = { v: r.data };
  }
  console.log('version', v, found.v.attributes.appStoreState);
  if (notesFile) {
    const notes = JSON.parse(fs.readFileSync(notesFile, 'utf8'));
    const locs = await api('GET', `/v1/appStoreVersions/${found.v.id}/appStoreVersionLocalizations`);
    for (const l of locs.data) {
      if (!notes[l.attributes.locale]) continue;
      const ok = await api('PATCH', `/v1/appStoreVersionLocalizations/${l.id}`, { data: { type: 'appStoreVersionLocalizations', id: l.id, attributes: { whatsNew: notes[l.attributes.locale] } } });
      console.log('whatsNew', l.attributes.locale, ok ? 'set' : 'failed');
    }
  }
  let b;
  for (let i = 0; i < 60; i++) {
    const r = await api('GET', `/v1/builds?filter[app]=${APP}&filter[version]=${buildNumber}&filter[preReleaseVersion.version]=${v}&limit=1`);
    b = r && r.data[0];
    if (b && b.attributes.processingState === 'VALID') break;
    if (b && ['FAILED', 'INVALID'].includes(b.attributes.processingState)) return console.log('build', buildNumber, b.attributes.processingState);
    if (i % 4 === 0) console.log('waiting for build', buildNumber, b ? b.attributes.processingState : 'not visible yet');
    await wait(30000);
  }
  if (!b || b.attributes.processingState !== 'VALID') return console.log('build', buildNumber, 'not processed after 30 minutes');
  await api('PATCH', `/v1/appStoreVersions/${found.v.id}/relationships/build`, { data: { type: 'builds', id: b.id } });
  const now = await version(v);
  console.log('attached build:', now.build ? now.build.attributes.version : '-');
}

async function submit(v) {
  const found = await version(v);
  if (!found) return console.log('no version', v);
  console.log('version', v, found.v.attributes.appStoreState, 'build', found.build ? found.build.attributes.version : '-');
  if (!found.build) return console.log('STOP: no build attached');
  const open = await api('GET', `/v1/reviewSubmissions?filter[app]=${APP}&filter[state]=READY_FOR_REVIEW,UNRESOLVED_ISSUES&limit=5`);
  let s = open && open.data[0];
  if (!s) { const r = await api('POST', '/v1/reviewSubmissions', { data: { type: 'reviewSubmissions', attributes: { platform: 'IOS' }, relationships: { app: { data: { type: 'apps', id: APP } } } } }); s = r && r.data; }
  if (!s) return;
  const items = await api('GET', `/v1/reviewSubmissions/${s.id}/items`);
  for (const it of items.data) if (it.attributes.state !== 'READY_FOR_REVIEW') await api('PATCH', `/v1/reviewSubmissionItems/${it.id}`, { data: { type: 'reviewSubmissionItems', id: it.id, attributes: { resolved: true } } });
  if (!items.data.length) await api('POST', '/v1/reviewSubmissionItems', { data: { type: 'reviewSubmissionItems', relationships: { reviewSubmission: { data: { type: 'reviewSubmissions', id: s.id } }, appStoreVersion: { data: { type: 'appStoreVersions', id: found.v.id } } } } });
  const r = await api('PATCH', `/v1/reviewSubmissions/${s.id}`, { data: { type: 'reviewSubmissions', id: s.id, attributes: { submitted: true } } });
  console.log('submit:', s.id.slice(0, 8), r ? r.data.attributes.state : 'failed');
}

async function cancel() {
  const s = await api('GET', `/v1/reviewSubmissions?filter[app]=${APP}&filter[state]=WAITING_FOR_REVIEW,IN_REVIEW&limit=5`);
  const x = s && s.data[0];
  if (!x) return console.log('nothing waiting for review');
  const r = await api('PATCH', `/v1/reviewSubmissions/${x.id}`, { data: { type: 'reviewSubmissions', id: x.id, attributes: { canceled: true } } });
  console.log('cancel:', x.id.slice(0, 8), r ? r.data.attributes.state : 'failed');
}

const [cmd, a, b, c] = process.argv.slice(2);
({ status, prepare: () => prepare(a, b, c), submit: () => submit(a), cancel }[cmd] || (() => console.log('usage: status | prepare <version> <build> [notes.json] | submit <version> | cancel')))();
