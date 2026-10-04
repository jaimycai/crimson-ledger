// Featuring nominations in App Store Connect (Apple's editors pick apps to feature).
//   node store/asc-nominatie.js list
//   node store/asc-nominatie.js <spec.json> [--submit]
// The spec holds name, type (APP_LAUNCH, APP_ENHANCEMENTS or NEW_CONTENT), description, publishStartDate,
// deviceFamilies, locales and notes; see store/nominaties/. Without --submit it stays a draft.
// A POST with every field at once got a 500 from Apple on 4 October 2026, so the script creates a small draft
// first and adds the other fields with PATCH. Every PATCH must carry "submitted" or "archived".
const fs = require('fs');
const { api, APP } = require('./asc-api');

async function list() {
  for (const st of ['DRAFT', 'SUBMITTED', 'ARCHIVED']) {
    const r = await api('GET', `/v1/nominations?filter[state]=${st}&limit=20`);
    for (const n of (r && r.data) || []) console.log(st, n.id.slice(0, 8), n.attributes.name, '|', n.attributes.publishStartDate, '|', n.attributes.submittedDate || '');
  }
}

async function nominate(file, submit) {
  const spec = JSON.parse(fs.readFileSync(file, 'utf8'));
  const { name, type, description, publishStartDate, ...rest } = spec;
  const created = await api('POST', '/v1/nominations', { data: { type: 'nominations', attributes: { name, type, description, publishStartDate, submitted: false }, relationships: { relatedApps: { data: [{ type: 'apps', id: APP }] } } } });
  if (!created) return;
  const id = created.data.id;
  console.log('draft', id);
  const r = await api('PATCH', `/v1/nominations/${id}`, { data: { type: 'nominations', id, attributes: { ...rest, submitted: false } } });
  if (!r) return console.log('STOP: draft', id, 'kept without the extra fields');
  if (submit) {
    const s = await api('PATCH', `/v1/nominations/${id}`, { data: { type: 'nominations', id, attributes: { submitted: true } } });
    console.log('nomination', s ? s.data.attributes.state : 'not submitted');
  } else console.log('nomination DRAFT; run again with --submit, or submit it in App Store Connect');
}

const [arg, flag] = process.argv.slice(2);
if (arg === 'list') list();
else if (arg) nominate(arg, flag === '--submit');
else console.log('usage: list | <spec.json> [--submit]');
