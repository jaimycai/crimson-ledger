// Meting: tellers gaan weg in de app, niet vanuit de iOS-simulator en niet als de speler ze uitzet.
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
const store = {};
global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
const sent = [];
global.fetch = (url, opts) => { sent.push(JSON.parse(opts.body)); return Promise.resolve({}); };
const ua = { value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 27_0 like Mac OS X) AppleWebKit/605.1.15' };
Object.defineProperty(global, 'navigator', { get: () => ({ userAgent: ua.value, language: 'nl-NL' }), configurable: true });
const { Meting } = require('../meting.js');

Meting.send('open', '', 0);
check(sent.length === 1 && sent[0].e === 'open' && sent[0].v === '1.1.2', 'op een toestel gaat de teller weg, met versie 1.1.2');

ua.value += ' CrimsonSimulator';
Meting.send('open', '', 0);
check(sent.length === 1, 'in de simulator gaat er niets weg');

ua.value = ua.value.replace(' CrimsonSimulator', '');
Meting.setOn(false);
Meting.send('open', '', 0);
check(sent.length === 1, 'uitgezet in Instellingen: er gaat niets weg');

console.log(failures ? `${failures} FAILURES` : 'ALLE METING CHECKS PASSED');
process.exit(failures ? 1 : 0);
