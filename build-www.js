// Kopieert de speelbare bestanden naar www/ voor Capacitor (geen build-stap, alleen kopiëren).
const fs = require('fs'), path = require('path');
const FILES = ['index.html', 'style.css', 'app.js', 'board.js', 'floorplan.js', 'logic-engine.js', 'story.js', 'themes.js',
  'campaign.js', 'progress.js', 'mentor.js', 'mapart.js', 'minigame.js', 'store.js', 'meting.js', 'i18n.js', 'grammar.js', 'sound.js', 'avatars.js', 'manifest.json', 'sw.js', 'icon-192.png', 'icon-512.png', 'privacy.html', 'support.html'];
fs.rmSync('www', { recursive: true, force: true }); fs.mkdirSync('www');
for (const f of FILES) fs.copyFileSync(f, path.join('www', f));
fs.cpSync('assets', 'www/assets', { recursive: true });
fs.cpSync('i18n', 'www/i18n', { recursive: true });
console.log(`www/: ${FILES.length} bestanden + assets/ + i18n/`);
