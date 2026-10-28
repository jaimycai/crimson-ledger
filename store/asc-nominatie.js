// Featuring nominations in App Store Connect (Apple's editors pick apps to feature).
//   node store/asc-nominatie.js list
//   node store/asc-nominatie.js <spec.json> [--submit] [--draft <id>]
// The spec holds name, type (APP_LAUNCH, APP_ENHANCEMENTS or NEW_CONTENT), description, publishStartDate,
// deviceFamilies, locales and notes; see store/nominaties/. Without --submit it stays a draft.
// A POST with every field at once got a 500 from Apple on 4 October 2026, so the script creates a small draft
// first and adds the other fields with PATCH. Every PATCH must carry "submitted" or "archived".
// On 28 October the same PATCH that worked for 1.3 got a 500; when that happens the fields go one by one, so the
// failing field shows, and --draft <id> continues on the draft that was already made instead of making a second one.
const fs = require('fs');
const { api, APP } = require('./asc-api');

async function list() {
  for (const st of ['DRAFT', 'SUBMITTED', 'ARCHIVED']) {
    const r = await api('GET', `/v1/nominations?filter[state]=${st}&limit=20`);
    for (const n of (r && r.data) || []) console.log(st, n.id.slice(0, 8), n.attributes.name, '|', n.attributes.publishStartDate, '|', n.attributes.submittedDate || '');
  }
}

async function nominate(file, submit, draft) {
  const spec = JSON.parse(fs.readFileSync(file, 'utf8'));
  const { name, type, description, publishStartDate, ...rest } = spec;
  if (name.length > 60) return console.log(`STOP: name is ${name.length} characters, Apple allows 60`);
  let id = draft;
  if (!id) {
    const created = await api('POST', '/v1/nominations', { data: { type: 'nominations', attributes: { name, type, description, publishStartDate, submitted: false }, relationships: { relatedApps: { data: [{ type: 'apps', id: APP }] } } } });
    if (!created) return;
    id = created.data.id;
    console.log('draft', id);
  }
  const patch = attrs => api('PATCH', `/v1/nominations/${id}`, { data: { type: 'nominations', id, attributes: { ...attrs, submitted: false } } });
  if (!(await patch(rest))) {
    const failed = [];
    for (const [k, v] of Object.entries(rest)) if (!(await patch({ [k]: v }))) failed.push(k);
    if (failed.length) return console.log('STOP: draft', id, 'kept; Apple refused', failed.join(', '), `- continue with --draft ${id}`);
  }
  if (submit) {
    const s = await api('PATCH', `/v1/nominations/${id}`, { data: { type: 'nominations', id, attributes: { submitted: true } } });
    console.log('nomination', s ? s.data.attributes.state : 'not submitted');
  } else console.log('nomination DRAFT; run again with --submit, or submit it in App Store Connect');
}

const [arg, ...flags] = process.argv.slice(2);
const draftAt = flags.indexOf('--draft');
if (arg === 'list') list();
else if (arg) nominate(arg, flags.includes('--submit'), draftAt >= 0 ? flags[draftAt + 1] : null);
else console.log('usage: list | <spec.json> [--submit] [--draft <id>]');
