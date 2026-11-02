// Meldingen (1.6): met een nep-LocalNotifications nagaan wat de app plant en annuleert.
// Van Dam als afzender, teksten die wisselen en de zaak van die dag noemen, de streakredder om 21:30 met knoppen
// (alleen bij een streak van 2+ en een open dagzaak, weg zodra de dagzaak is opgelost), "Over een uur" één keer,
// en na 7 dagen zonder openen precies één afscheid en daarna niets.
//   node tests/notifications.test.js
const fs = require('fs'), path = require('path');
function loadJsdom() { try { return require('jsdom'); } catch (e) {} return require('/Users/jaimycai/Documents/Claude/CrimsonLedger/app/node_modules/jsdom'); }
const { JSDOM, VirtualConsole } = loadJsdom();
const DIR = path.join(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };

// nep-Capacitor: LocalNotifications houdt bij wat er gepland, geannuleerd en opgeruimd wordt
const MOCK = `<script>
  window.__ln = { calls: [], pending: new Map(), types: null, listeners: {}, perm: 'granted', failRich: false };
  const L = window.__ln;
  window.Capacitor = { isNativePlatform: () => true, Plugins: {
    SplashScreen: { hide: async () => {} },
    LocalNotifications: {
      requestPermissions: async () => ({ display: L.perm }),
      checkPermissions: async () => ({ display: L.perm }),
      schedule: async ({ notifications }) => {
        L.calls.push(['schedule', notifications.map(n => n.id)]);
        if (L.failRich && notifications.some(n => n.attachments)) throw new Error('Unable to make notification');
        notifications.forEach(n => L.pending.set(n.id, n));
        return { notifications: notifications.map(n => ({ id: n.id })) };
      },
      cancel: async ({ notifications }) => { L.calls.push(['cancel', notifications.map(n => n.id)]); notifications.forEach(n => L.pending.delete(n.id)); },
      removeDeliveredNotifications: async ({ notifications }) => { L.calls.push(['removeDelivered', notifications.map(n => n.id)]); },
      registerActionTypes: async ({ types }) => { L.types = types; },
      addListener: async (ev, fn) => { L.listeners[ev] = fn; return { remove: async () => {} }; },
      getPending: async () => ({ notifications: [...L.pending.values()] })
    }
  } };
</script>`;

function boot(lang) {
  let html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => `<script>${fs.readFileSync(path.join(DIR, src), 'utf8')}</script>`);
  const pack = lang === 'nl' ? '' : `<script>localStorage.setItem("crimson-lang", "${lang}");</script><script>${fs.readFileSync(path.join(DIR, 'i18n', lang + '.js'), 'utf8')}</script>`;
  html = html.replace('<head>', () => `<head><script>Object.defineProperty(navigator, "language", { value: "nl-NL", configurable: true });</script>${pack}`)
    .replace(/<link[^>]+>/g, '').replace('<body>', () => '<body>' + MOCK)
    .replace('</body>', '<script>window.App = App; window.Board = Board; window.Progress = Progress; window.Themes = Themes;</script></body>');
  const errors = [];
  const vc = new VirtualConsole(); vc.on('jsdomError', e => errors.push(String(e.message || e)));
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost:8080/', virtualConsole: vc });
  return { window: dom.window, errors };
}

(async () => {
  const { window, errors } = boot('nl');
  const { document } = window;
  await sleep(150);
  const { App, Progress } = window, L = window.__ln;
  const D = (d, h, m = 0) => new window.Date(2026, 10, 16 + d, h, m, 0, 0);   // maandag 16 november 2026 + d dagen
  const at = n => n.schedule.at;
  const hm = n => `${at(n).getHours()}:${String(at(n).getMinutes()).padStart(2, '0')}`;
  const dayOf = n => Math.round((new window.Date(at(n)).setHours(0, 0, 0, 0) - D(0, 0)) / 864e5);
  const ids = plan => plan.map(n => n.id).sort((a, b) => a - b).join(',');
  const byId = (plan, id) => plan.find(n => n.id === id);
  const flush = () => App.notifyQueue || Promise.resolve();
  // speltoestand: streak, laatste speeldag (verschil in dagen met 16 nov), vrije dagen, dagzaak vandaag af, speeluren
  const state = ({ streak = 0, last = null, freezes = 0, done = false, hours = [] } = {}) => {
    App.streak = { count: streak, lastDate: last === null ? null : D(last, 12).toDateString() };
    App.storageSet('crimson-streak', JSON.stringify(App.streak));
    Progress.setFreezes(freezes);
    if (done) App.storageSet('crimson-board-daily-done', D(0, 12).toDateString()); else App.storageRemove('crimson-board-daily-done');
    App.storageSet('crimson-play-hours', JSON.stringify(hours));
    App.storageRemove('crimson-notif-later');
  };

  // ── uit: niets ──
  check(!App.reminderEnabled() && App.reminderPlan(D(0, 10)).length === 0, 'herinneringen uit: leeg plan');
  L.calls = [];
  await App.scheduleReminder(D(0, 10));
  check(L.calls.length === 0, 'herinneringen uit: niets gepland of geannuleerd');

  // ── knoppen en luisteraar staan klaar vanaf de start ──
  const redder = (L.types || []).find(t => t.id === 'crimson-redder'), later = (L.types || []).find(t => t.id === 'crimson-later');
  check(!!redder && redder.actions.map(a => `${a.id}:${a.title}`).join('|') === 'play:Speel nu|later:Over een uur' && redder.actions.every(a => a.foreground),
    'actietype streakredder: "Speel nu" en "Over een uur", beide openen de app');
  check(!!later && later.actions.map(a => a.id).join() === 'play' && redder.iosHiddenPreviewsBodyPlaceholder === 'Een bericht van Inspecteur Van Dam',
    '"Over een uur"-melding heeft alleen "Speel nu" (één keer uitstellen); tekst bij verborgen voorvertoning');
  check(typeof L.listeners.localNotificationActionPerformed === 'function', 'luisteraar voor knoppen en tikken');

  // ── aanzetten ──
  state();
  L.perm = 'denied';
  check(await App.setReminder(true) === false && !App.reminderEnabled(), 'geen toestemming: blijft uit');
  L.perm = 'granted'; L.calls = [];
  check(await App.setReminder(true) === true && App.reminderEnabled(), 'aanzetten met toestemming');
  await flush();
  const firstCancel = L.calls.findIndex(c => c[0] === 'cancel'), firstSchedule = L.calls.findIndex(c => c[0] === 'schedule');
  check(firstCancel >= 0 && firstCancel < firstSchedule && L.calls[firstCancel][1].join() === '1,2,3,4,5,6,7,8,9,10,11,12,13,14',
    'eerst alles annuleren (ook de oude reeks 1-5), dan plannen');

  // ── gewone dag, geen streak, 10:00 ──
  state();
  let plan = App.reminderPlan(D(0, 10));
  check(ids(plan) === '1,2,3,4,6,8', 'plan: vandaag, dag 1, 2, 3 (terug), 5 en het afscheid op dag 7: ' + ids(plan));
  check(plan.every(n => hm(n) === '18:30'), 'zonder bekend speeluur alles om 18:30');
  check(plan.map(dayOf).join() === '0,1,2,3,5,7', 'op de dagen 0, 1, 2, 3, 5 en 7: ' + plan.map(dayOf).join());
  check(plan.every(n => n.title === 'Inspecteur Van Dam') && !plan.some(n => /Crimson Ledger/.test(n.title + n.body)), 'Van Dam is de afzender, nergens "Crimson Ledger"');
  check(new Set(plan.map(n => n.body)).size === plan.length, 'geen twee meldingen met dezelfde tekst');
  check(plan.filter(n => n.extra.kind === 'dag' || n.extra.kind === 'terug').every(n => n.body.includes(Progress.dailyTitle(App.getDayNumber(at(n))))),
    'elke dag- en terug-melding noemt de zaak van die dag (' + byId(plan, 1).body + ')');
  check(byId(plan, 4).extra.kind === 'terug' && !/mis|moordenaar|killer/i.test(byId(plan, 4).body), 'dag 3: rustige terug-tekst: ' + byId(plan, 4).body);
  check(plan.every(n => n.threadIdentifier === 'crimson-dossier' && n.summaryArgument === 'Inspecteur Van Dam'), 'alle meldingen in één stapel van Van Dam');
  const bye = plan.filter(n => n.extra.kind === 'afscheid');
  check(bye.length === 1 && plan[plan.length - 1] === bye[0] && bye[0].id === 8, 'precies één afscheid, en het is de laatste melding');
  check(bye[0].body === 'De dossiers wachten op je. Ik stuur je geen herinneringen meer.' && dayOf(bye[0]) === 7 && bye[0].extra.open === 'home',
    'afscheid op dag 7 met de afgesproken zin');
  check(bye[0].attachments && bye[0].attachments[0].url === 'res:///assets/vandam.jpg' && fs.existsSync(path.join(DIR, 'assets/vandam.jpg')),
    'afscheid met Van Dam als afbeelding (assets/vandam.jpg zit in de bundel)');
  check(plan.every(n => dayOf(n) <= 7), 'niets na dag 7');
  check(!plan.some(n => n.id >= 11), 'geen streak: geen redder');
  // dag erna opnieuw geopend: de grens van 7 dagen schuift mee, nog steeds één afscheid
  const next = App.reminderPlan(D(1, 9));
  check(next.filter(n => n.extra.kind === 'afscheid').length === 1 && dayOf(byId(next, 8)) === 8, 'opnieuw geopend: afscheid schuift naar 7 dagen na die opening');

  // ── tijd voorbij: niets in het verleden ──
  plan = App.reminderPlan(D(0, 19));
  check(!byId(plan, 1) && plan.every(n => at(n) > D(0, 19)), 'om 19:00 geen melding meer voor 18:30 vandaag (iOS zou die meteen tonen)');

  // ── streakredder ──
  state({ streak: 5, last: -1 });
  plan = App.reminderPlan(D(0, 10));
  const r0 = byId(plan, 11);
  check(!!r0 && hm(r0) === '21:30' && dayOf(r0) === 0 && r0.actionTypeId === 'crimson-redder', 'streak 5, gisteren gespeeld: redder vandaag om 21:30 met knoppen');
  check(r0 && /5/.test(r0.body) && r0.attachments && r0.attachments[0].id === 'vandam' && r0.extra.open === 'daily', 'redder noemt de streak, met Van Dam als afbeelding: ' + (r0 && r0.body));
  check(!byId(plan, 12) && !byId(plan, 13), 'zonder vrije dag: geen redder morgen (de streak is dan al voorbij)');
  check(!!byId(plan, 1) && hm(byId(plan, 1)) === '18:30', 'gewone herinnering om 18:30 blijft (ruim voor 21:30)');
  state({ streak: 5, last: -1, freezes: 1 });
  check(ids(App.reminderPlan(D(0, 10)).filter(n => n.id >= 11)) === '11,12', 'met een vrije dag: redder vandaag én morgen');
  state({ streak: 1, last: -1 });
  check(!App.reminderPlan(D(0, 10)).some(n => n.id >= 11), 'streak van 1 dag: geen redder');
  state({ streak: 5, last: -3, freezes: 1 });
  check(!App.reminderPlan(D(0, 10)).some(n => n.id >= 11), 'streak al voorbij (drie dagen geleden): geen redder');
  state({ streak: 6, last: 0, done: true });
  plan = App.reminderPlan(D(0, 10));
  check(!byId(plan, 11) && !byId(plan, 1) && !!byId(plan, 12) && dayOf(byId(plan, 12)) === 1, 'dagzaak vandaag af: geen redder en geen herinnering vandaag, wel de redder van morgen');
  const rescueTexts = [0, 1, 2, 3, 4, 5].map(k => App.NOTIFY_TEXTS.redder[k](5, 'X'));
  check(new Set(rescueTexts).size === 6, 'zes verschillende reddersteksten');

  // ── redder vervalt zodra de dagzaak is opgelost ──
  state({ streak: 5, last: -1 });
  await App.scheduleReminder(D(0, 20));
  await flush();
  check(L.pending.has(11), 'om 20:00 staat de redder van 21:30 klaar');
  // zo doet board.js het na de dagzaak: updateStreak, dagzaak af, opnieuw plannen
  App.streak = { count: 6, lastDate: D(0, 12).toDateString() };
  App.storageSet('crimson-board-daily-done', D(0, 20).toDateString());
  L.calls = [];
  await App.scheduleReminder(D(0, 20, 5));
  await flush();
  const lastCancel = L.calls.filter(c => c[0] === 'cancel').pop();
  check(!L.pending.has(11) && lastCancel && lastCancel[1].includes(11), 'dagzaak opgelost: redder van vanavond geannuleerd');
  check(L.calls.some(c => c[0] === 'removeDelivered' && c[1].join() === '11,12,13,14'), 'een redder die al in het meldingencentrum stond, wordt opgeruimd');
  check(L.pending.has(12) && dayOf(L.pending.get(12)) === 1, 'de redder van morgen staat er wel');

  // ── speeluur 19 → herinnering 20:00; op een redderavond wijkt die voor de redder ──
  state({ streak: 4, last: -1, hours: [19, 19, 19, 12] });
  plan = App.reminderPlan(D(0, 10));
  check(!byId(plan, 1) && !!byId(plan, 11), 'herinnering om 20:00 vervalt op een redderavond (niet twee meldingen binnen anderhalf uur)');
  check(!!byId(plan, 2) && hm(byId(plan, 2)) === '20:00', 'morgen (geen redder) gewoon om 20:00');
  App.renderReminderLabel();
  check(document.getElementById('reminder-label').textContent === '🔔 Dagelijkse herinnering (20:00)', 'instelling toont het echte uur: ' + document.getElementById('reminder-label').textContent);
  App.storageSet('crimson-reminder', '0');
  const rb = document.getElementById('btn-remind'); rb.hidden = false; rb.click();
  await sleep(50); await flush();
  check(document.getElementById('toast-text').textContent === 'Ingesteld: elke dag om 20:00 een herinnering.', 'bevestiging noemt het echte uur: ' + document.getElementById('toast-text').textContent);
  check(!/18:30/.test(document.getElementById('settings-modal').textContent), 'nergens meer een vaste 18:30 in de instellingen');

  // ── "Over een uur" ──
  state({ streak: 5, last: -1 });
  const ev = (actionId, day = Progress.dayKey(D(0, 12))) => ({ actionId, notification: { id: 11, extra: { kind: 'redder', day, open: 'daily' } } });
  App.onNotificationAction(ev('later'), D(0, 21, 35));
  await flush();
  const l1 = L.pending.get(14);
  check(!!l1 && hm(l1) === '22:35' && l1.actionTypeId === 'crimson-later' && /“.+”|streak/.test(l1.body), '"Over een uur" om 21:35: nog één melding om 22:35: ' + (l1 && l1.body));
  check(document.getElementById('toast-text').textContent === 'Goed. Om 22:35 meld ik me nog één keer.', 'bevestiging met het tijdstip');
  check(!L.pending.has(11), 'de redder van vanavond is al geweest');
  App.onNotificationAction(ev('later'), D(0, 21, 50));
  await flush();
  check(hm(L.pending.get(14)) === '22:35', 'nog eens "Over een uur": geen tweede uitstel, blijft 22:35');
  App.storageSet('crimson-board-daily-done', D(0, 22).toDateString());
  await App.scheduleReminder(D(0, 22));
  await flush();
  check(!L.pending.has(14), 'dagzaak opgelost: ook het uitstel vervalt');
  state({ streak: 5, last: -1 });
  App.onNotificationAction(ev('later'), D(0, 23, 30));
  await flush();
  check(!L.pending.has(14) && /al morgen/.test(document.getElementById('toast-text').textContent), 'na 23:00: geen uitstel over middernacht heen');
  App.onNotificationAction(ev('later', Progress.dayKey(D(-1, 12))), D(0, 9));
  await flush();
  check(!L.pending.has(14) && !App.storageGet('crimson-notif-later'), '"Over een uur" op de redder van gisteren: geen uitstel vandaag');

  // ── bijlage lukt niet: dan zonder afbeelding ──
  state({ streak: 5, last: -1 });
  L.failRich = true; L.pending.clear();
  await App.scheduleReminder(D(0, 10));
  await flush();
  L.failRich = false;
  check(L.pending.has(11) && !L.pending.get(11).attachments && L.pending.has(1), 'bijlage geweigerd: redder alsnog gepland, zonder afbeelding');

  // ── terug uit de achtergrond: opnieuw plannen ──
  L.calls = [];
  document.dispatchEvent(new window.Event('visibilitychange'));
  await sleep(20); await flush();
  check(L.calls.some(c => c[0] === 'cancel') && L.calls.some(c => c[0] === 'schedule'), 'app weer in beeld: plan opnieuw gezet (de 7 dagen tellen vanaf nu)');

  // ── "Speel nu" opent de dagzaak ──
  const now = new window.Date();
  App.storageSet('crimson-board-tutorial-done', '1');
  App.storageRemove('crimson-board-daily-done');
  App.onNotificationAction({ actionId: 'tap', notification: { extra: { kind: 'dag', day: '2020-01-01', open: 'daily' } } }, now);
  await sleep(400);
  check(App.currentScreen !== 'board', 'tikken op een melding van een andere dag: geen zaak openen');
  App.onNotificationAction(ev('play', Progress.dayKey(now)), now);
  await sleep(900);
  check(App.currentScreen === 'board' && window.Board.isDaily, '"Speel nu": meteen de dagzaak');

  // ── teksten ──
  const X = App.NOTIFY_TEXTS, all = [...X.dag.map(f => f('Het lege glas', '🏚️ Het Landhuis')), ...X.terug.map(f => f('Het lege glas')),
    ...X.redder.map(f => f(4, 'Het lege glas')), ...X.later.map(f => f(4, 'Het lege glas')), X.afscheid[0]()];
  check([X.dag, X.terug, X.redder, X.later].every(v => v.length >= 5 && v.length <= 8), 'vijf tot acht varianten per soort');
  check(new Set(all).size === all.length, 'alle teksten verschillen');
  check(!all.some(t => /moord|killer|je mist|mis je|verlies|Crimson Ledger/i.test(t)), 'geen schuldgevoel, verlies of moordwoorden');
  check(errors.length === 0, 'geen JS-fouten: ' + errors.join(' | '));

  // ── andere talen: Engels en Russisch (meervoud) ──
  const en = boot('en'); await sleep(150);
  en.window.App.storageSet('crimson-reminder', '1');
  en.window.App.streak = { count: 5, lastDate: new en.window.Date(2026, 10, 15, 12).toDateString() };
  const ep = en.window.App.reminderPlan(new en.window.Date(2026, 10, 16, 10));
  check(ep.every(n => n.title === 'Inspector Van Dam'), 'Engels: afzender Inspector Van Dam');
  check(ep.find(n => n.id === 8).body === "The files will wait for you. I won't send you any more reminders.", 'Engels: afscheid');
  check(!ep.some(n => /\b(zaak|dagen|vandaag|dossier|streak van)\b/.test(n.body)), 'Engels: geen Nederlands in de meldingen: ' + ep.find(n => n.id === 11).body);
  check((en.window.__ln.types || []).find(t => t.id === 'crimson-redder').actions.map(a => a.title).join('|') === 'Play now|In an hour', 'Engels: knoppen');
  en.window.App.renderReminderLabel();
  check(en.window.document.getElementById('reminder-label').textContent === '🔔 Daily reminder (18:30)', 'Engels: instelling met tijd');
  check(en.errors.length === 0, 'Engels: geen JS-fouten ' + en.errors.join(' | '));
  const ru = boot('ru'); await sleep(150);
  const rx = ru.window.App.NOTIFY_TEXTS.redder[1];
  check(/^2 дня подряд/.test(rx(2, 'x')) && /^5 дней подряд/.test(rx(5, 'x')) && /^21 день подряд/.test(rx(21, 'x')), 'Russisch: 2 дня, 5 дней, 21 день');
  check(ru.errors.length === 0, 'Russisch: geen JS-fouten ' + ru.errors.join(' | '));

  console.log(failures === 0 ? 'ALLE MELDINGCHECKS GESLAAGD' : `${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.log('FAIL', e && e.stack || e); process.exit(1); });
