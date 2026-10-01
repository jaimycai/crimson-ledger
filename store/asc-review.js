const crypto = require('crypto'); const fs = require('fs');
const KEY_ID = 'CQ6TPURNQ9', ISSUER = '5806efa4-3fc7-4385-bdaf-847dd6ce866d';
const KEY_PATH = process.env.HOME + '/.appstoreconnect/private_keys/AuthKey_CQ6TPURNQ9.p8';
const b64 = b => Buffer.from(b).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
function token() { const now = Math.floor(Date.now() / 1000);
  const input = `${b64(JSON.stringify({ alg: 'ES256', kid: KEY_ID, typ: 'JWT' }))}.${b64(JSON.stringify({ iss: ISSUER, iat: now, exp: now + 900, aud: 'appstoreconnect-v1' }))}`;
  return `${input}.${b64(crypto.sign('sha256', Buffer.from(input), { key: crypto.createPrivateKey(fs.readFileSync(KEY_PATH)), dsaEncoding: 'ieee-p1363' }))}`; }
async function api(method, p, body) {
  const res = await fetch('https://api.appstoreconnect.apple.com' + p, { method, headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text(); let j = null; try { j = JSON.parse(text); } catch (e) {}
  if (!res.ok) { console.log('FAIL', method, p.slice(0, 90), res.status, text.slice(0, 400)); return null; }
  return j || {};
}
const APP = '6812534368', V = '74e559a1-1f32-4c81-bc97-36e2bc876283';
(async () => {
  const mode = process.argv[2];
  const subs = await api('GET', `/v1/reviewSubmissions?filter[app]=${APP}&limit=10`);
  for (const s of subs.data) console.log(s.id, s.attributes.state, s.attributes.submittedDate);
  if (mode === 'cancel') {
    const s = subs.data.find(x => ['WAITING_FOR_REVIEW', 'IN_REVIEW'].includes(x.attributes.state));
    if (!s) return console.log('nothing to cancel');
    const r = await api('PATCH', `/v1/reviewSubmissions/${s.id}`, { data: { type: 'reviewSubmissions', id: s.id, attributes: { canceled: true } } });
    console.log('cancel:', r && r.data.attributes.state);
  }
  if (mode === 'submit') {
    let s = subs.data.find(x => x.attributes.state === 'READY_FOR_REVIEW');
    if (!s) { const r = await api('POST', '/v1/reviewSubmissions', { data: { type: 'reviewSubmissions', attributes: { platform: 'IOS' }, relationships: { app: { data: { type: 'apps', id: APP } } } } }); s = r && r.data; }
    if (!s) return;
    const items = await api('GET', `/v1/reviewSubmissions/${s.id}/items`);
    if (!items.data.length) await api('POST', '/v1/reviewSubmissionItems', { data: { type: 'reviewSubmissionItems', relationships: { reviewSubmission: { data: { type: 'reviewSubmissions', id: s.id } }, appStoreVersion: { data: { type: 'appStoreVersions', id: V } } } } });
    const r = await api('PATCH', `/v1/reviewSubmissions/${s.id}`, { data: { type: 'reviewSubmissions', id: s.id, attributes: { submitted: true } } });
    console.log('submit:', r && r.data.attributes.state);
  }
  const v = await api('GET', `/v1/appStoreVersions/${V}?fields[appStoreVersions]=appStoreState`);
  console.log('version state', v.data.attributes.appStoreState);
})();
