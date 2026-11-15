// Kopieert de speelbare bestanden naar www/ voor Capacitor (geen build-stap, alleen kopiëren).
const fs = require('fs'), path = require('path');
const FILES = ['index.html', 'style.css', 'app.js', 'motion.js', 'rive-art.js', 'board.js', 'gamecenter.js', 'floorplan.js', 'logic-engine.js', 'story.js', 'themes.js',
  'campaign.js', 'progress.js', 'mentor.js', 'mapart.js', 'minigame.js', 'store.js', 'meting.js', 'i18n.js', 'grammar.js', 'icons.js', 'sound.js', 'avatars.js', 'manifest.json', 'sw.js', 'icon-192.png', 'icon-512.png', 'privacy.html', 'support.html'];
fs.rmSync('www', { recursive: true, force: true }); fs.mkdirSync('www');
for (const f of FILES) fs.copyFileSync(f, path.join('www', f));
fs.cpSync('assets', 'www/assets', { recursive: true });
// 1.6: de Rive-runtime (canvas-lite, MIT) voor de levende vlam en Van Dam; assets/rive/ gaat al mee met assets/
fs.cpSync('vendor', 'www/vendor', { recursive: true });
fs.mkdirSync('www/i18n');
for (const f of fs.readdirSync('i18n')) if (f.endsWith('.js')) fs.copyFileSync(path.join('i18n', f), path.join('www/i18n', f));
console.log(`www/: ${FILES.length} bestanden + assets/ + vendor/ + i18n/`);
// De widget "Zaak van vandaag" (iOS) kan het JavaScript niet draaien: build-widget.js rekent de dagzaken van de komende
// 400 dagen vooruit met dezelfde code, in alle talen, naar ios/App/CrimsonLiveActivity/DailyCases.json (niet in git).
const widget = require('./build-widget.js').build();
console.log(`widget: ${widget.data.days.length} dagen (${widget.data.first} t/m ${widget.last}), ${Object.keys(widget.data.langs).length} talen`);
