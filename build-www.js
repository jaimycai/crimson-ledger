// Kopieert de speelbare bestanden naar www/ voor Capacitor (geen build-stap, alleen kopiëren).
const fs = require('fs'), path = require('path');
const FILES = ['index.html', 'style.css', 'app.js', 'board.js', 'floorplan.js', 'logic-engine.js', 'story.js', 'themes.js',
  'campaign.js', 'sound.js', 'avatars.js', 'manifest.json', 'sw.js', 'icon-192.png', 'icon-512.png', 'privacy.html', 'support.html'];
fs.rmSync('www', { recursive: true, force: true }); fs.mkdirSync('www');
for (const f of FILES) fs.copyFileSync(f, path.join('www', f));
console.log(`www/: ${FILES.length} bestanden`);
