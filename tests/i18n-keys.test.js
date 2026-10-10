// Every translatable text in the code has an English entry.
// Finds every XX_T`...` template and XX_T('...') call in the game files, builds the dictionary key the same way
// I18n.template does (static parts with {0}, {1} … for the gaps) and checks it against I18n.EN. Also checks the
// fixed text in index.html that I18n.translateDom replaces. Prints the missing keys.
const fs = require('fs'), path = require('path'), vm = require('vm');
const DIR = path.join(__dirname, '..');
const FILES = ['app.js', 'board.js', 'floorplan.js', 'mentor.js', 'minigame.js', 'progress.js', 'store.js', 'campaign.js', 'story.js', 'themes.js', 'avatars.js', 'mapart.js'];

// Reads a template literal that starts at src[i] === '`'; returns its static parts and the index after it.
function readTemplate(src, i) {
  const parts = [''];
  i++;
  while (i < src.length) {
    const c = src[i];
    if (c === '\\') { parts[parts.length - 1] += src.slice(i, i + 2); i += 2; continue; }
    if (c === '`') return { parts, end: i + 1 };
    if (c === '$' && src[i + 1] === '{') { i = skipExpr(src, i + 2); parts.push(''); continue; }
    parts[parts.length - 1] += c; i++;
  }
  throw new Error('unterminated template');
}
// Skips a ${ … } expression (nested braces, strings and templates); returns the index after the closing brace.
function skipExpr(src, i) {
  let depth = 1;
  while (i < src.length) {
    const c = src[i];
    if (c === '`') { i = readTemplate(src, i).end; continue; }
    if (c === "'" || c === '"') { const q = c; i++; while (src[i] !== q) i += src[i] === '\\' ? 2 : 1; i++; continue; }
    if (c === '{') depth++;
    if (c === '}' && --depth === 0) return i + 1;
    i++;
  }
  throw new Error('unterminated expression');
}
const unescape = s => s.replace(/\\(.)/g, (_, c) => ({ n: '\n', t: '\t' }[c] || c));

function keysIn(src) {
  const keys = [];
  const re = /\b([A-Z][A-Z]_T|T)(`|\(\s*(['"]))/g;
  let m;
  while ((m = re.exec(src))) {
    if (m[2] === '`') {
      const t = readTemplate(src, m.index + m[1].length);
      keys.push(t.parts.map((p, i) => unescape(p) + (i < t.parts.length - 1 ? `{${i}}` : '')).join(''));
      re.lastIndex = t.end;
    } else {
      const q = m[3]; let i = re.lastIndex, s = '';
      while (src[i] !== q) { s += src[i] === '\\' ? src.slice(i, i + 2) : src[i]; i += src[i] === '\\' ? 2 : 1; }
      keys.push(unescape(s));
      re.lastIndex = i + 1;
    }
  }
  return keys;
}

// The English dictionary, loaded the way the browser does.
const ctx = { console, localStorage: { getItem: () => null, setItem() {} }, navigator: { language: 'en' } };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(DIR, 'i18n.js'), 'utf8') + '\n;globalThis.__I18n = I18n;', ctx);
const EN = ctx.__I18n.EN;

const missing = new Map();
for (const f of FILES) {
  for (const k of keysIn(fs.readFileSync(path.join(DIR, f), 'utf8'))) {
    if (!/[A-Za-zÀ-ÿ]/.test(k.replace(/\{\d+\}/g, ''))) continue;   // only numbers, symbols or gaps: nothing to translate
    if (!(k in EN)) missing.set(k, f);
  }
}
// fixed text in index.html: text between tags and the attributes translateDom handles; the brand and the
// language names in the picker stay as they are
const SKIP = new Set(['Crimson Ledger', 'Crimson', 'Ledger', 'Nederlands', 'English']);
const html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '');
for (const m of html.matchAll(/>([^<>]+)</g)) {
  const t = m[1].replace(/\s+/g, ' ').trim().replace(/&amp;/g, '&');
  if (t && /[A-Za-zÀ-ÿ]{2}/.test(t) && !(t in EN) && !SKIP.has(t)) missing.set(t, 'index.html');
}
for (const m of html.matchAll(/(?:aria-label|title|placeholder)="([^"]+)"/g)) if (!(m[1] in EN) && !SKIP.has(m[1])) missing.set(m[1], 'index.html (attribuut)');

for (const [k, f] of missing) console.log('MIST', f.padEnd(22), JSON.stringify(k));
console.log(missing.size ? `${missing.size} teksten zonder Engelse vertaling` : 'ALLE TEKSTEN HEBBEN EEN ENGELSE VERTALING');
process.exit(missing.size ? 1 : 0);
