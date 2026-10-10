// Runs inside the app page (browser pane, javascript_tool): visits the main screens in the current language and
// lists every piece of text that does not fit — cut off, sticking out of its button or box, or off screen.
// Paste the whole file, then: await overflowScan()  →  { checked, items: [{ screen, kind, text, where }] }
async function overflowScan() {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const click = id => { const el = document.getElementById(id); if (el) el.click(); return !!el; };
  const out = []; let checked = 0;
  const label = e => (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).join('.') : '') || e.tagName.toLowerCase();
  const scan = screen => {
    const roots = [...document.querySelectorAll('.screen.active, .modal.active')];
    for (const root of roots) for (const e of root.querySelectorAll('*')) {
      if (!e.offsetParent || e.closest('svg') || e.closest('.board-grid')) continue;
      const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.nodeValue).join('').trim();
      if (!own) continue;
      checked++;
      const cs = getComputedStyle(e), r = e.getBoundingClientRect();
      const text = own.slice(0, 70);
      if (e.scrollWidth > e.clientWidth + 1 && (cs.overflowX !== 'visible' || cs.textOverflow === 'ellipsis')) out.push({ screen, kind: 'afgekapt', text, where: label(e) });
      else if (cs.whiteSpace === 'nowrap' && e.scrollWidth > e.clientWidth + 1) out.push({ screen, kind: 'loopt door', text, where: label(e) });
      // a row that scrolls sideways (worlds, suspects, tabs) may hold text outside the screen
      let scroller = false;
      for (let a = e.parentElement; a && !scroller; a = a.parentElement) { const o = getComputedStyle(a).overflowX; scroller = o === 'auto' || o === 'scroll'; }
      if (!scroller && (r.right > innerWidth + 1 || r.left < -1)) out.push({ screen, kind: 'buiten beeld', text, where: label(e) });
      // map nodes carry their label underneath on purpose
      const box = e.closest('.mnode, .mchest, .mmini, .msign') ? null : e.closest('.btn, .tool, .sus-chip, .deck-all, .world-tab, .lang-select');
      if (box && box !== e) { const b = box.getBoundingClientRect(); if (r.right > b.right + 2 || r.left < b.left - 2 || r.bottom > b.bottom + 2) out.push({ screen, kind: 'buiten de knop', text, where: label(box) }); }
    }
  };
  const start = [...document.querySelectorAll('#screen-splash button')].find(b => b.offsetParent);
  if (start) { start.click(); await sleep(500); }
  App.navigateTo('menu'); await sleep(400); scan('menu');
  click('btn-settings'); await sleep(400); scan('instellingen'); App.hideModal('settings-modal'); await sleep(200);
  if (App.openStore) { App.openStore(null); await sleep(400); scan('winkel'); App.hideModal('store-modal'); await sleep(200); }
  click('btn-free'); await sleep(400); scan('vrij spel');
  click('btn-board-start'); await sleep(900);
  const ok = [...document.querySelectorAll('.modal.active button')].pop(); if (ok) { scan('uitleg'); ok.click(); await sleep(300); }
  scan('bord');
  click('btn-board-hint'); await sleep(400); scan('hint'); document.querySelectorAll('.modal.active').forEach(m => App.hideModal(m.id)); await sleep(200);
  if (App.openMap) { App.openMap('landhuis'); await sleep(900); scan('kaart'); }
  App.navigateTo('menu'); await sleep(300);
  if (click('btn-awards')) { await sleep(500); scan('vitrine'); }
  App.navigateTo('menu');
  const seen = new Set();
  return { checked, items: out.filter(o => { const k = o.screen + o.kind + o.text; if (seen.has(k)) return false; seen.add(k); return true; }) };
}
