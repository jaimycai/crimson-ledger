const crypto = require('crypto'); const fs = require('fs'); const path = require('path');
const { api } = require('./asc-api');
async function upload(kind, setId, file, extra = {}) {
  const buf = fs.readFileSync(file);
  const type = kind === 'appScreenshots' ? 'appScreenshots' : 'appPreviews';
  const rel = kind === 'appScreenshots' ? { appScreenshotSet: { data: { type: 'appScreenshotSets', id: setId } } } : { appPreviewSet: { data: { type: 'appPreviewSets', id: setId } } };
  const made = await api('POST', `/v1/${type}`, { data: { type, attributes: { fileName: path.basename(file), fileSize: buf.length, ...extra }, relationships: rel } });
  if (!made) return false;
  for (const op of made.data.attributes.uploadOperations) {
    const headers = {}; for (const h of op.requestHeaders) headers[h.name] = h.value;
    const r = await fetch(op.url, { method: op.method, headers, body: buf.subarray(op.offset, op.offset + op.length) });
    if (!r.ok) { console.log('part failed', r.status); return false; }
  }
  const md5 = crypto.createHash('md5').update(buf).digest('hex');
  const done = await api('PATCH', `/v1/${type}/${made.data.id}`, { data: { type, id: made.data.id, attributes: { uploaded: true, sourceFileChecksum: md5 } } });
  console.log(done ? 'ok  ' : 'FAIL', path.basename(file));
  return !!done;
}
(async () => {
  const [mode] = process.argv.slice(2);
  const LOC = { 'nl-NL': { id: '6ad5ef04-e58f-4a7f-b446-c3f750872993', cards: 'store/cards-65', video: 'store/previews/crimson-ledger-nl-886x1920.mp4' },
                'en-US': { id: '7c740d4e-b3c3-41b8-a612-5f76cfba8e93', cards: 'store/cards-65-en', video: 'store/previews/crimson-ledger-en-886x1920.mp4' } };
  for (const [loc, c] of Object.entries(LOC)) {
    const sets = await api('GET', `/v1/appStoreVersionLocalizations/${c.id}/appScreenshotSets?include=appScreenshots`);
    const set = sets.data.find(s => s.attributes.screenshotDisplayType === 'APP_IPHONE_65');
    const shots = (sets.included || []).filter(i => i.type === 'appScreenshots');
    console.log(loc, 'set', set && set.id, 'shots now:', shots.map(s => s.attributes.fileName).join(', '));
    if (mode !== 'apply') continue;
    for (const s of shots) await api('DELETE', `/v1/appScreenshots/${s.id}`);
    for (const f of fs.readdirSync(c.cards).filter(f => f.endsWith('.png')).sort()) await upload('appScreenshots', set.id, path.join(c.cards, f));
    let ps = await api('GET', `/v1/appStoreVersionLocalizations/${c.id}/appPreviewSets`);
    let pset = ps.data.find(s => s.attributes.previewType === 'IPHONE_65');
    if (!pset) { const r = await api('POST', '/v1/appPreviewSets', { data: { type: 'appPreviewSets', attributes: { previewType: 'IPHONE_65' }, relationships: { appStoreVersionLocalization: { data: { type: 'appStoreVersionLocalizations', id: c.id } } } } }); pset = r && r.data; }
    if (pset) await upload('appPreviews', pset.id, c.video, { mimeType: 'video/mp4', previewFrameTimeCode: '00:00:12:00' });
  }
})();
