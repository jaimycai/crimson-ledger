// Every translatable text in the code has an entry in every language file (i18n/<lang>.js).
// Finds every XX_T`...` template and XX_T('...') call in the game files, builds the dictionary key the same way
// I18n.template does (static parts with {0}, {1} … for the gaps) and checks it against the ui dictionary of each
// language. Also checks the fixed text in index.html that I18n.translateDom replaces. Prints the missing keys.
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

// Every language file, loaded the way the browser does.
const packs = {};
for (const f of fs.readdirSync(path.join(DIR, 'i18n')).filter(f => f.endsWith('.js')).sort()) {
  const ctx = { console };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(DIR, 'i18n', f), 'utf8'), ctx);
  Object.assign(packs, ctx.LANG_PACKS);
}

const needed = new Map();   // key → file that uses it
for (const f of FILES) {
  for (const k of keysIn(fs.readFileSync(path.join(DIR, f), 'utf8'))) {
    if (!/[A-Za-zÀ-ÿ]/.test(k.replace(/\{\d+\}/g, ''))) continue;   // only numbers, symbols or gaps: nothing to translate
    if (!needed.has(k)) needed.set(k, f);
  }
}
// fixed text in index.html: text between tags and the attributes translateDom handles; the brand and the
// language names in the picker stay as they are
const SKIP = new Set(['Crimson Ledger', 'Crimson', 'Ledger', 'Nederlands', 'English']);
const html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '');
for (const m of html.matchAll(/>([^<>]+)</g)) {
  const t = m[1].replace(/\s+/g, ' ').trim().replace(/&amp;/g, '&');
  if (t && /[A-Za-zÀ-ÿ]{2}/.test(t) && !SKIP.has(t) && !needed.has(t)) needed.set(t, 'index.html');
}
for (const m of html.matchAll(/(?:aria-label|title|placeholder)="([^"]+)"/g)) if (!SKIP.has(m[1]) && !needed.has(m[1])) needed.set(m[1], 'index.html (attribuut)');

let total = 0;
for (const [lang, pack] of Object.entries(packs)) {
  const missing = [...needed].filter(([k]) => !(k in pack.ui));
  for (const [k, f] of missing) console.log('MIST', lang, f.padEnd(22), JSON.stringify(k));
  console.log(missing.length ? `${lang}: ${missing.length} teksten zonder vertaling` : `${lang}: alle ${needed.size} teksten vertaald`);
  total += missing.length;
}
console.log(total ? `${total} ONTBREKENDE VERTALINGEN` : `ALLE TEKSTEN VERTAALD IN ${Object.keys(packs).length} TALEN`);
process.exit(total ? 1 : 0);
