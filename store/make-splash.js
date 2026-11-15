// Native loading screen (ios/App/App/Assets.xcassets/Splash.imageset): a render of the real start screen in www/ with
// JavaScript off, so the loading bar is empty, and without the tagline and subtitle, so the one image carries no words
// in any language (1.7). Run npm run build first, then: node store/make-splash.js <out.png>; sips -z 2732 2732 to size.
// Uses the newest Chrome in ~/.cache/puppeteer if the pinned one is missing.

const puppeteer = require('puppeteer');
const fs = require('fs'); const os = require('os'); const path = require('path');
// puppeteer's own Chrome, else the newest one already in ~/.cache/puppeteer
function chrome() {
  try { const own = puppeteer.executablePath(); if (typeof own === 'string' && fs.existsSync(own)) return own; } catch (e) { /* not installed */ }
  const dir = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome');
  const v = fs.readdirSync(dir).filter(d => d.startsWith('mac_arm-')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop();
  return path.join(dir, v, 'chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing');
}
(async () => {
  const out = process.argv[2];
  const b = await puppeteer.launch({ headless: 'new', executablePath: chrome() });
  const p = await b.newPage();
  await p.setJavaScriptEnabled(false);
  await p.setViewport({ width: 911, height: 911, deviceScaleFactor: 3 });
  await p.goto('file://' + path.join(__dirname, '..', 'www', 'index.html'), { waitUntil: 'load' });
  await p.addStyleTag({ content: '.splash-tagline,.splash-subtitle{visibility:hidden}' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 400));
  await p.screenshot({ path: out });
  await b.close();
})();
