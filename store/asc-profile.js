// App ID and App Store provisioning profile for an extra target (1.6: the Live Activity widget), through the API.
//   node store/asc-profile.js <bundle id> "<App ID name>" "<profile name>"
// Makes the App ID if it is missing, then an IOS_APP_STORE profile signed with the same Apple Distribution certificate
// as "Crimson Ledger App Store", and installs it where xcodebuild -exportArchive looks for it. Running it again reuses
// what exists. Nothing secret is printed or written to the repo (profiles hold no private key).
const fs = require('fs'), path = require('path'), os = require('os');
const { api } = require('./asc-api');
const [ID, NAME, PROFILE] = process.argv.slice(2);
const MAIN_PROFILE = 'Crimson Ledger App Store';
if (!ID || !NAME || !PROFILE) { console.log('usage: node store/asc-profile.js <bundle id> "<App ID name>" "<profile name>"'); process.exit(1); }
const q = s => encodeURIComponent(s);

(async () => {
  // 1. App ID
  let bid = ((await api('GET', `/v1/bundleIds?filter[identifier]=${q(ID)}&limit=20`)) || {}).data || [];
  bid = bid.find(b => b.attributes.identifier === ID);
  if (!bid) {
    const made = await api('POST', '/v1/bundleIds', { data: { type: 'bundleIds', attributes: { identifier: ID, name: NAME, platform: 'IOS' } } });
    if (!made) process.exit(1);
    bid = made.data;
    console.log('App ID made:', ID);
  } else console.log('App ID exists:', ID);

  // 2. the distribution certificate of the main profile
  const main = await api('GET', `/v1/profiles?filter[name]=${q(MAIN_PROFILE)}&include=certificates&limit=5`);
  const cert = main && (main.included || []).find(i => i.type === 'certificates');
  if (!cert) { console.log(`no certificate found on "${MAIN_PROFILE}"`); process.exit(1); }
  console.log('certificate:', cert.attributes.name || cert.attributes.displayName, 'expires', cert.attributes.expirationDate);

  // 3. profile (reuse an active one with the same name)
  let prof = ((await api('GET', `/v1/profiles?filter[name]=${q(PROFILE)}&limit=5`)) || {}).data || [];
  prof = prof.find(p => p.attributes.profileState === 'ACTIVE');
  if (!prof) {
    const made = await api('POST', '/v1/profiles', { data: { type: 'profiles', attributes: { name: PROFILE, profileType: 'IOS_APP_STORE' },
      relationships: { bundleId: { data: { type: 'bundleIds', id: bid.id } }, certificates: { data: [{ type: 'certificates', id: cert.id }] } } } });
    if (!made) process.exit(1);
    prof = made.data;
    console.log('profile made:', PROFILE);
  } else console.log('profile exists:', PROFILE);

  // 4. install for Xcode (new and old location)
  const bytes = Buffer.from(prof.attributes.profileContent, 'base64');
  for (const dir of ['Library/Developer/Xcode/UserData/Provisioning Profiles', 'Library/MobileDevice/Provisioning Profiles']) {
    const d = path.join(os.homedir(), dir);
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, `${prof.attributes.uuid}.mobileprovision`), bytes);
  }
  console.log('installed:', prof.attributes.uuid, 'expires', prof.attributes.expirationDate);
})();
