// App Store Connect API: signed requests for the store/ scripts.
// Key ID and issuer ID come from ~/.appstoreconnect/config.txt (KEY_ID=..., ISSUER_ID=...), the private key from
// ~/.appstoreconnect/private_keys/AuthKey_<KEY_ID>.p8. Neither belongs in this repo: it is public on GitHub.
const crypto = require('crypto'); const fs = require('fs');
const DIR = process.env.HOME + '/.appstoreconnect';
const CONFIG = Object.fromEntries(fs.readFileSync(DIR + '/config.txt', 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim())));
const KEY_ID = CONFIG.KEY_ID, ISSUER = CONFIG.ISSUER_ID;
const KEY_PATH = `${DIR}/private_keys/AuthKey_${KEY_ID}.p8`;
const APP = '6812534368';
const b64 = b => Buffer.from(b).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
function token() { const now = Math.floor(Date.now() / 1000);
  const input = `${b64(JSON.stringify({ alg: 'ES256', kid: KEY_ID, typ: 'JWT' }))}.${b64(JSON.stringify({ iss: ISSUER, iat: now, exp: now + 900, aud: 'appstoreconnect-v1' }))}`;
  return `${input}.${b64(crypto.sign('sha256', Buffer.from(input), { key: crypto.createPrivateKey(fs.readFileSync(KEY_PATH)), dsaEncoding: 'ieee-p1363' }))}`; }
// Returns the parsed body, or null after printing Apple's error. Takes a path or a full URL.
async function api(method, p, body) {
  const res = await fetch(p.startsWith('http') ? p : 'https://api.appstoreconnect.apple.com' + p, { method, headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text(); let j = null; try { j = JSON.parse(text); } catch (e) {}
  if (!res.ok) { console.log('FAIL', method, p.slice(0, 90), res.status, text.replace(/\s+/g, ' ').slice(0, 500)); return null; }
  return j || {};
}
const wait = ms => new Promise(r => setTimeout(r, ms));
module.exports = { api, wait, APP };
