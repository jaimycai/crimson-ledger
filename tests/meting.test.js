// Meting: tellers gaan weg in de app, niet vanuit de iOS-simulator en niet als de speler ze uitzet.
// Een feedbackbericht (1.3.1) gaat ook als de tellers uit staan: de speler stuurt het zelf.
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
const store = {};
global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
const sent = [], urls = [];
global.fetch = (url, opts) => { urls.push(url); sent.push(JSON.parse(opts.body)); return Promise.resolve({ ok: true }); };
global.document = { getElementById: id => (id === 'app-version' ? { textContent: ' 1.3.0 ' } : null) };
const ua = { value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 27_0 like Mac OS X) AppleWebKit/605.1.15' };
Object.defineProperty(global, 'navigator', { get: () => ({ userAgent: ua.value, language: 'nl-NL' }), configurable: true });
const { Meting } = require('../meting.js');

Meting.send('open', '', 0);
check(sent.length === 1 && sent[0].e === 'open' && sent[0].v === '1.3.0', 'op een toestel gaat de teller weg, met de versie uit het scherm (1.3.0)');

ua.value += ' CrimsonSimulator';
Meting.send('open', '', 0);
check(sent.length === 1, 'in de simulator gaat er niets weg');

ua.value = ua.value.replace(' CrimsonSimulator', '');
Meting.setOn(false);
Meting.send('open', '', 0);
check(sent.length === 1, 'uitgezet in Instellingen: er gaat niets weg');

// 1.6: the worker refuses unknown events (400); the app sends buy_tap, buy_cancel and share_done
{
  const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'meting', 'src', 'index.js'), 'utf8');
  const events = (src.match(/const EVENTS = new Set\((\[[^\]]*\])\)/) || [, '[]'])[1].match(/'([a-z_]+)'/g).map(x => x.slice(1, -1));
  check(['buy_tap', 'buy_cancel', 'share_done', 'store_open', 'purchase', 'share'].every(e => events.includes(e)) && events.every(e => e.length <= 20), 'tellerdienst kent buy_tap, buy_cancel en share_done (naam hooguit 20 tekens)');
  const app = require('fs').readFileSync(require('path').join(__dirname, '..', 'app.js'), 'utf8');
  const used = [...new Set([...app.matchAll(/Meting\.send\('([a-z_]+)'/g), ...app.matchAll(/count\('([a-z_]+)'/g)].map(m => m[1]))];
  check(used.every(e => events.includes(e)), 'elke teller die app.js stuurt, kent de tellerdienst: ' + used.filter(e => !events.includes(e)).join(' '));
}

(async () => {
  const ok = await Meting.feedback('  Zaak 12 is te moeilijk  ');
  check(ok && sent.length === 2 && urls[1].endsWith('/f') && sent[1].t === '  Zaak 12 is te moeilijk  ' && sent[1].v === '1.3.0' && !('e' in sent[1]),
    'feedback gaat naar /f met tekst en versie, ook als de tellers uit staan');
  ua.value += ' CrimsonSimulator';
  const sim = await Meting.feedback('test');
  check(sim === true && sent.length === 2, 'feedback uit de simulator: niets verstuurd, wel "gelukt" voor de testrun');
  ua.value = ua.value.replace(' CrimsonSimulator', '');
  global.fetch = () => Promise.reject(new Error('offline'));
  check(await Meting.feedback('test') === false, 'zonder netwerk: false, zodat de app een melding toont');
  console.log(failures ? `${failures} FAILURES` : 'ALLE METING CHECKS PASSED');
  process.exit(failures ? 1 : 0);
})();

