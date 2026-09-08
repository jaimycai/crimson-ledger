// ============================================================
// FLOORPLAN ENGINE v2 — ruimtelijke moordmysterie-puzzel
//
// Genereert een huis (rechthoekig gesplitst, deels samengevoegd tot
// L-vormen), meubels, een slachtoffer en verdachten. Leidt uit de
// oplossing een pool van ware uitspraken af en kiest daaruit een
// minimale set die precies één oplossing toelaat. Regel van het
// spel: alleen de moordenaar bevond zich in de kamer van het
// slachtoffer. Bevat ook een hint-engine die uitlegt in plaats
// van verklapt.
// ============================================================

const FloorPlan = (() => {

  // ── RNG en hulpjes ──────────────────────────────────────────
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  function shuffle(r, arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  // gewogen volgorde: hogere weight = grotere kans om vooraan te staan
  function weightedOrder(r, arr, weightOf) {
    return arr
      .map(item => ({ item, k: Math.pow(r(), 1 / Math.max(0.01, weightOf(item))) }))
      .sort((a, b) => b.k - a.k)
      .map(o => o.item);
  }

  // ── Inhoud ──────────────────────────────────────────────────
  const ROOM_NAMES = [
    'Woonkamer', 'Keuken', 'Eetkamer', 'Bibliotheek', 'Slaapkamer',
    'Badkamer', 'Garage', 'Hal', 'Wasruimte', 'Studeerkamer', 'Serre', 'Kelder'
  ];
  const ROOM_COLORS = [
    '#E8A798', '#9FC8C8', '#E3B7D6', '#F0CE8E', '#A8BEE0',
    '#C7D9A0', '#D9B8A0', '#B9AEDC', '#8FC5D8', '#E5B0A8', '#BFD8B0', '#D6C3A5'
  ];
  const FURNITURE = ['plant', 'tv', 'kast', 'stoel', 'doos'];
  const FURNITURE_NL = {
    plant: 'een plant', tv: 'een televisie', kast: 'een boekenkast',
    stoel: 'een fauteuil', doos: 'een kist'
  };
  function defaultTheme(pool) {
    return {
      id: 'standaard', title: 'Het Landhuis', roomWord: 'kamer', roomWordPlural: 'kamers', floor: 'checker',
      victimName: 'Het slachtoffer',
      rooms: ROOM_NAMES.map((name, i) => ({ name, article: 'de', color: ROOM_COLORS[i % ROOM_COLORS.length] })),
      furniture: FURNITURE.map(id => ({ id, nl: FURNITURE_NL[id] })),
      suspects: pool
    };
  }
  const POS_NL = rw => ({
    hoek:   { los: `in een hoek van een ${rw}`,               kamer: 'in een hoek' },
    muur:   { los: 'tegen een muur, niet in een hoek',        kamer: 'tegen een muur, niet in een hoek' },
    midden: { los: `midden in een ${rw}, niet tegen een muur`, kamer: 'in het midden, niet tegen een muur' }
  });

  const DIFF = {
    makkelijk: { cols: 6, rows: 6, rooms: 4, merges: 0, suspects: 3, minClues: 3, maxClues: 5, maxCand: 12 },
    gemiddeld: { cols: 7, rows: 7, rooms: 5, merges: 1, suspects: 4, minClues: 4, maxClues: 7, maxCand: 14 },
    moeilijk:  { cols: 8, rows: 8, rooms: 6, merges: 2, suspects: 5, minClues: 5, maxClues: 9, maxCand: 14 }
  };

  // Voorkeur per moeilijkheid: makkelijk = directe kamers, moeilijk = indirect
  const WEIGHTS = {
    makkelijk: { room: 6, 'room-pos': 5, 'room-next': 4, 'room-with': 2, 'next-to': 2, pos: 1, 'not-room': 1,
                 'same-room': 2, 'diff-room': 1, adjacent: 2, 'not-adjacent': 1, 'same-row': 1, 'same-col': 1,
                 'left-of': 1, above: 1, 'empty-room': 2, alone: 1 },
    gemiddeld: { room: 3, 'room-pos': 3, 'room-next': 3, 'room-with': 3, 'next-to': 3, pos: 2, 'not-room': 2,
                 'same-room': 2, 'diff-room': 2, adjacent: 2, 'not-adjacent': 1, 'same-row': 2, 'same-col': 2,
                 'left-of': 2, above: 2, 'empty-room': 2, alone: 2 },
    moeilijk:  { room: 1, 'room-pos': 2, 'room-next': 2, 'room-with': 4, 'next-to': 4, pos: 3, 'not-room': 3,
                 'same-room': 3, 'diff-room': 2, adjacent: 3, 'not-adjacent': 2, 'same-row': 3, 'same-col': 3,
                 'left-of': 3, above: 3, 'empty-room': 2, alone: 3 }
  };

  const UNARY = new Set(['room', 'not-room', 'room-pos', 'pos', 'room-with', 'next-to', 'room-next']);
  const BINARY = new Set(['same-room', 'diff-room', 'adjacent', 'not-adjacent', 'same-row', 'same-col', 'left-of', 'above']);

  // ── Geometrie (vorm-onafhankelijk: kamers zijn celverzamelingen) ──
  const key = (x, y) => `${x},${y}`;
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function roomOf(rooms, x, y) {
    const k = key(x, y);
    for (const r of rooms) if (r.cells.has(k)) return r;
    return null;
  }
  const cellsOf = room => room.list.slice();
  const inRoomNeighbors = (room, c) => DIRS.filter(([dx, dy]) => room.cells.has(key(c.x + dx, c.y + dy)));
  const isEdge = (room, c) => inRoomNeighbors(room, c).length < 4;
  function isCorner(room, c) {
    const n = inRoomNeighbors(room, c);
    if (n.length <= 1) return true;
    if (n.length === 2) return !(n[0][0] === -n[1][0] && n[0][1] === -n[1][1]); // niet in één lijn
    return false;
  }
  const posOf = (room, c) => isCorner(room, c) ? 'hoek' : isEdge(room, c) ? 'muur' : 'midden';
  const adjacent = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
  const nextToFurniture = (base, c, f) =>
    DIRS.some(([dx, dy]) => base.furniture.get(key(c.x + dx, c.y + dy)) === f);
  const roomHas = (base, room, f) => room.list.some(c => base.furniture.get(key(c.x, c.y)) === f);

  // ── Kamers: splitsen, dan een paar samenvoegen tot L-vormen ─
  function rectCells(q) {
    const out = [];
    for (let y = q.y; y < q.y + q.h; y++) for (let x = q.x; x < q.x + q.w; x++) out.push({ x, y });
    return out;
  }
  function touching(a, b) {
    return a.list.some(c => DIRS.some(([dx, dy]) => b.cells.has(key(c.x + dx, c.y + dy))));
  }
  function makeRooms(r, cfg, theme) {
    let rects = [{ x: 0, y: 0, w: cfg.cols, h: cfg.rows }];
    const target = cfg.rooms + cfg.merges;
    let guard = 0;
    while (rects.length < target && guard++ < 200) {
      rects.sort((a, b) => b.w * b.h - a.w * a.h);
      const idx = rects.findIndex(q => q.w >= 4 || q.h >= 4);
      if (idx === -1) break;
      const q = rects.splice(idx, 1)[0];
      if (q.h >= q.w && q.h >= 4) {
        const cut = 2 + Math.floor(r() * (q.h - 3));
        rects.push({ x: q.x, y: q.y, w: q.w, h: cut }, { x: q.x, y: q.y + cut, w: q.w, h: q.h - cut });
      } else if (q.w >= 4) {
        const cut = 2 + Math.floor(r() * (q.w - 3));
        rects.push({ x: q.x, y: q.y, w: cut, h: q.h }, { x: q.x + cut, y: q.y, w: q.w - cut, h: q.h });
      } else { rects.push(q); break; }
    }
    let shapes = rects.map(q => { const list = rectCells(q); return { list, cells: new Set(list.map(c => key(c.x, c.y))) }; });
    const maxSize = Math.floor(cfg.cols * cfg.rows / 2.4);
    for (let m = 0; m < cfg.merges; m++) {
      const pairs = [];
      for (let i = 0; i < shapes.length; i++) for (let j = i + 1; j < shapes.length; j++) {
        if (shapes[i].list.length + shapes[j].list.length <= maxSize && touching(shapes[i], shapes[j])) pairs.push([i, j]);
      }
      if (!pairs.length) break;
      const [i, j] = pick(r, pairs);
      const list = shapes[i].list.concat(shapes[j].list);
      shapes[i] = { list, cells: new Set(list.map(c => key(c.x, c.y))) };
      shapes.splice(j, 1);
    }
    const defs = shuffle(r, theme.rooms);
    return shapes.map((s, i) => ({ id: i, name: defs[i].name, article: defs[i].article || 'de', color: defs[i].color, list: s.list, cells: s.cells }));
  }

  function placeFurniture(r, rooms, types) {
    const furn = new Map();
    rooms.forEach(room => {
      const cells = shuffle(r, room.list);
      const n = Math.min(Math.max(0, cells.length - 3), 1 + Math.floor(r() * 2.4));
      for (let i = 0; i < n; i++) furn.set(key(cells[i].x, cells[i].y), pick(r, types));
    });
    return furn;
  }

  const buildRoomMap = rooms => {
    const m = new Map();
    rooms.forEach(rm => rm.list.forEach(c => m.set(key(c.x, c.y), rm)));
    return m;
  };
  const roomAt = (base, c) => base.roomMap.get(key(c.x, c.y));

  // ── Waarheidsevaluatie ─────────────────────────────────────
  // Unair: hangt alleen af van de cel van één verdachte.
  function unaryOk(clue, c, base) {
    const R = roomAt(base, c);
    switch (clue.kind) {
      case 'room':      return R.id === clue.room;
      case 'not-room':  return R.id !== clue.room;
      case 'room-pos':  return R.id === clue.room && posOf(R, c) === clue.pos;
      case 'pos':       return posOf(R, c) === clue.pos;
      case 'room-with': return roomHas(base, R, clue.furniture);
      case 'next-to':   return nextToFurniture(base, c, clue.furniture);
      case 'room-next': return R.id === clue.room && nextToFurniture(base, c, clue.furniture);
      default: return true;
    }
  }
  // Binair: twee cellen.
  function binaryOk(clue, a, b, base) {
    switch (clue.kind) {
      case 'same-room':    return roomAt(base, a).id === roomAt(base, b).id;
      case 'diff-room':    return roomAt(base, a).id !== roomAt(base, b).id;
      case 'adjacent':     return adjacent(a, b);
      case 'not-adjacent': return !adjacent(a, b);
      case 'same-row':     return a.y === b.y;
      case 'same-col':     return a.x === b.x;
      case 'left-of':      return a.x < b.x;
      case 'above':        return a.y < b.y;
      default: return true;
    }
  }
  // Volledige of gedeeltelijke toewijzing: true / false / null (nog onbekend)
  function holds(clue, A, base) {
    const S = i => A[i] || null;
    if (UNARY.has(clue.kind)) { const c = S(clue.s); return c ? unaryOk(clue, c, base) : null; }
    if (BINARY.has(clue.kind)) {
      const a = S(clue.a), b = S(clue.b);
      return a && b ? binaryOk(clue, a, b, base) : null;
    }
    if (clue.kind === 'empty-room') {
      const any = A.some(c => c && roomAt(base, c).id === clue.room);
      if (any) return false;
      return A.every(Boolean) ? true : null;
    }
    if (clue.kind === 'alone') {
      const me = S(clue.s); if (!me) return null;
      const R = roomAt(base, me).id;
      const other = A.some((c, i) => i !== clue.s && c && roomAt(base, c).id === R);
      if (other) return false;
      return A.every(Boolean) ? true : null;
    }
    return true;
  }
  // Spelregel: precies één verdachte in de kamer van het slachtoffer.
  function victimRule(A, base) {
    const n = A.filter(c => c && roomAt(base, c).id === base.victim.roomId).length;
    if (n > 1) return false;
    return A.every(Boolean) ? n === 1 : null;
  }
  function check(puzzle, A) {
    return victimRule(A, puzzle) === true && puzzle.clues.every(c => holds(c, A, puzzle) === true);
  }

  // ── Kandidaten + propagatie ─────────────────────────────────
  function freeCells(base) {
    const out = [];
    base.rooms.forEach(rm => rm.list.forEach(c => {
      if (!base.furniture.has(key(c.x, c.y)) && !(c.x === base.victim.x && c.y === base.victim.y)) out.push(c);
    }));
    return out;
  }
  function candidates(puzzle, fixed) {
    const n = puzzle.suspects.length;
    const free = freeCells(puzzle);
    const empties = new Set(puzzle.clues.filter(c => c.kind === 'empty-room').map(c => c.room));
    const cands = [];
    for (let i = 0; i < n; i++) {
      if (fixed && fixed[i]) { cands.push([fixed[i]]); continue; }
      const mine = puzzle.clues.filter(c => UNARY.has(c.kind) && c.s === i);
      cands.push(free.filter(c => !empties.has(roomAt(puzzle, c).id) && mine.every(cl => unaryOk(cl, c, puzzle))));
    }
    // vaste cellen zijn voor anderen bezet
    if (fixed) {
      const taken = new Set(fixed.filter(Boolean).map(c => key(c.x, c.y)));
      for (let i = 0; i < n; i++) if (!fixed[i]) cands[i] = cands[i].filter(c => !taken.has(key(c.x, c.y)));
    }
    // boogconsistentie over binaire aanwijzingen
    const bins = puzzle.clues.filter(c => BINARY.has(c.kind));
    let changed = true, rounds = 0;
    while (changed && rounds++ < 6) {
      changed = false;
      for (const cl of bins) {
        const A = cands[cl.a], B = cands[cl.b];
        const A2 = A.filter(a => B.some(b => binaryOk(cl, a, b, puzzle)));
        const B2 = B.filter(b => A.some(a => binaryOk(cl, a, b, puzzle)));
        if (A2.length !== A.length) { cands[cl.a] = A2; changed = true; }
        if (B2.length !== B.length) { cands[cl.b] = B2; changed = true; }
      }
    }
    return cands;
  }

  // ── Oplosser ────────────────────────────────────────────────
  function solve(puzzle, limit = 2) {
    const n = puzzle.suspects.length;
    const cands = candidates(puzzle);
    const order = puzzle.suspects.map((_, i) => i).sort((a, b) => cands[a].length - cands[b].length);
    const bins = puzzle.clues.filter(c => BINARY.has(c.kind));
    const alones = puzzle.clues.filter(c => c.kind === 'alone');
    const A = new Array(n).fill(null);
    const used = new Set();
    const out = [];

    function okSoFar(i) {
      for (const cl of bins) {
        if (cl.a === i && A[cl.b] && !binaryOk(cl, A[i], A[cl.b], puzzle)) return false;
        if (cl.b === i && A[cl.a] && !binaryOk(cl, A[cl.a], A[i], puzzle)) return false;
      }
      for (const cl of alones) if (holds(cl, A, puzzle) === false) return false;
      return victimRule(A, puzzle) !== false;
    }
    (function dfs(k) {
      if (out.length >= limit) return;
      if (k === n) { if (check(puzzle, A)) out.push(A.slice()); return; }
      const i = order[k];
      for (const c of cands[i]) {
        const ck = key(c.x, c.y);
        if (used.has(ck)) continue;
        A[i] = c;
        if (okSoFar(i)) { used.add(ck); dfs(k + 1); used.delete(ck); }
        A[i] = null;
        if (out.length >= limit) return;
      }
    })(0);
    return out;
  }

  // ── Pool van ware uitspraken ────────────────────────────────
  function cluePool(base) {
    const { rooms, suspects, solution } = base;
    const pool = [];
    const n = suspects.length;
    const roomsWithSuspect = new Set(solution.map(c => roomAt(base, c).id));

    solution.forEach((c, i) => {
      const R = roomAt(base, c);
      pool.push({ kind: 'room', s: i, room: R.id });
      rooms.forEach(o => { if (o.id !== R.id) pool.push({ kind: 'not-room', s: i, room: o.id }); });
      const p = posOf(R, c);
      pool.push({ kind: 'room-pos', s: i, room: R.id, pos: p });
      pool.push({ kind: 'pos', s: i, pos: p });
      base.furnitureTypes.forEach(f => {
        const inRoom = roomHas(base, R, f);
        const everywhere = rooms.every(o => roomHas(base, o, f));
        if (inRoom && !everywhere) pool.push({ kind: 'room-with', s: i, furniture: f });
        if (nextToFurniture(base, c, f)) {
          pool.push({ kind: 'next-to', s: i, furniture: f });
          pool.push({ kind: 'room-next', s: i, room: R.id, furniture: f });
        }
      });
      if (!solution.some((o, j) => j !== i && roomAt(base, o).id === R.id)) pool.push({ kind: 'alone', s: i });
    });

    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const a = solution[i], b = solution[j];
      const same = roomAt(base, a).id === roomAt(base, b).id;
      pool.push({ kind: same ? 'same-room' : 'diff-room', a: i, b: j });
      pool.push({ kind: adjacent(a, b) ? 'adjacent' : 'not-adjacent', a: i, b: j });
      if (a.y === b.y) pool.push({ kind: 'same-row', a: i, b: j });
      if (a.x === b.x) pool.push({ kind: 'same-col', a: i, b: j });
      if (a.x < b.x) pool.push({ kind: 'left-of', a: i, b: j });
      if (b.x < a.x) pool.push({ kind: 'left-of', a: j, b: i });
      if (a.y < b.y) pool.push({ kind: 'above', a: i, b: j });
      if (b.y < a.y) pool.push({ kind: 'above', a: j, b: i });
    }
    rooms.forEach(rm => {
      if (!roomsWithSuspect.has(rm.id) && rm.id !== base.victim.roomId) pool.push({ kind: 'empty-room', room: rm.id });
    });
    return pool;
  }

  // ── Selectie: ankers → aanvullen tot uniek → minimaliseren ──
  function selectClues(base, pool, cfg, diffId, r) {
    const W = WEIGHTS[diffId] || WEIGHTS.gemiddeld;
    const order = weightedOrder(r, pool, c => W[c.kind] || 1);
    const n = base.suspects.length;
    const countFor = (clues, i) => candidates({ ...base, clues })[i].length;

    let selected = [];
    for (let i = 0; i < n; i++) {
      const mine = order.filter(c => UNARY.has(c.kind) && c.s === i && c.kind !== 'not-room');
      const chosen = [];
      for (const u of mine) {
        chosen.push(u);
        if (countFor(selected.concat(chosen), i) <= cfg.maxCand) break;
      }
      if (countFor(selected.concat(chosen), i) > cfg.maxCand) return null;
      selected = selected.concat(chosen);
    }

    let sols = solve({ ...base, clues: selected });
    for (const c of order) {
      if (sols.length === 1) break;
      if (selected.includes(c)) continue;
      selected.push(c);
      sols = solve({ ...base, clues: selected });
    }
    if (sols.length !== 1) return null;

    for (const c of shuffle(r, selected.slice())) {
      const trial = selected.filter(x => x !== c);
      let boundOk = true;
      for (let i = 0; i < n && boundOk; i++) if (countFor(trial, i) > cfg.maxCand) boundOk = false;
      if (!boundOk) continue;
      if (solve({ ...base, clues: trial }).length === 1) selected = trial;
    }
    if (selected.length < cfg.minClues || selected.length > cfg.maxClues) return null;

    // leesvolgorde: eerst per verdachte, dan relaties, dan algemene feiten
    const rank = c => UNARY.has(c.kind) || c.kind === 'alone' ? c.s : BINARY.has(c.kind) ? 100 + c.a : 200;
    return selected.slice().sort((a, b) => rank(a) - rank(b));
  }

  // ── Nederlandse tekst ───────────────────────────────────────
  function formatClue(clue, base) {
    const th = base.theme;
    const rw = th.roomWord || 'kamer';
    const POS = POS_NL(rw);
    const N = i => base.suspects[i].label;
    const R = id => { const q = base.rooms.find(x => x.id === id); return `${q.article || 'de'} ${q.name}`; };
    const F = f => base.furnitureNl[f] || f;
    switch (clue.kind) {
      case 'room':         return `${N(clue.s)} was in ${R(clue.room)}.`;
      case 'not-room':     return `${N(clue.s)} was niet in ${R(clue.room)}.`;
      case 'room-pos':     return `${N(clue.s)} was in ${R(clue.room)}, ${POS[clue.pos].kamer}.`;
      case 'pos':          return `${N(clue.s)} stond ${POS[clue.pos].los}.`;
      case 'room-with':    return `${N(clue.s)} was in een ${rw} met ${F(clue.furniture)}.`;
      case 'next-to':      return `${N(clue.s)} stond direct naast ${F(clue.furniture)}.`;
      case 'room-next':    return `${N(clue.s)} was in ${R(clue.room)}, direct naast ${F(clue.furniture)}.`;
      case 'same-room':    return `${N(clue.a)} en ${N(clue.b)} waren in dezelfde ${rw}.`;
      case 'diff-room':    return `${N(clue.a)} en ${N(clue.b)} waren niet in dezelfde ${rw}.`;
      case 'adjacent':     return `${N(clue.a)} stond direct naast ${N(clue.b)}.`;
      case 'not-adjacent': return `${N(clue.a)} stond niet direct naast ${N(clue.b)}.`;
      case 'same-row':     return `${N(clue.a)} en ${N(clue.b)} stonden op dezelfde rij.`;
      case 'same-col':     return `${N(clue.a)} en ${N(clue.b)} stonden in dezelfde kolom.`;
      case 'left-of':      return `${N(clue.a)} stond links van ${N(clue.b)} op de plattegrond.`;
      case 'above':        return `${N(clue.a)} stond hoger op de plattegrond dan ${N(clue.b)}.`;
      case 'empty-room':   return `Er was niemand in ${R(clue.room)}.`;
      case 'alone':        return `${N(clue.s)} was alleen in de ${rw}.`;
      default: return '';
    }
  }
  const caseText = base => {
    const q = base.rooms.find(x => x.id === base.victim.roomId);
    return `${base.theme.victimName || 'Het slachtoffer'} werd gevonden in ${q.article || 'de'} ${q.name}. ` +
           `De moordenaar was de enige die zich in die ${base.theme.roomWord || 'kamer'} bevond.`;
  };

  // ── Generatie ───────────────────────────────────────────────
  function generate(seed, difficultyId, themeOrPool) {
    const cfg = DIFF[difficultyId] || DIFF.gemiddeld;
    const r = rng(seed);
    const theme = Array.isArray(themeOrPool) ? defaultTheme(themeOrPool) : themeOrPool;
    const furnitureTypes = theme.furniture.map(f => f.id);
    const furnitureNl = Object.fromEntries(theme.furniture.map(f => [f.id, f.nl]));
    const suspectPool = theme.suspects;

    for (let attempt = 0; attempt < 80; attempt++) {
      const rooms = makeRooms(r, cfg, theme);
      if (rooms.length < 3) continue;
      const furniture = placeFurniture(r, rooms, furnitureTypes);
      const freeBy = rooms.map(rm => rm.list.filter(c => !furniture.has(key(c.x, c.y))));

      const vrooms = rooms.filter(rm => freeBy[rm.id].length >= 2);
      if (!vrooms.length) continue;
      const vroom = pick(r, vrooms);
      const vfree = shuffle(r, freeBy[vroom.id]);
      const victim = { x: vfree[0].x, y: vfree[0].y, roomId: vroom.id };

      const suspects = shuffle(r, suspectPool).slice(0, cfg.suspects);
      const murderer = Math.floor(r() * suspects.length);
      const solution = new Array(suspects.length);
      solution[murderer] = { x: vfree[1].x, y: vfree[1].y };
      const others = shuffle(r, rooms.flatMap(rm => rm.id === vroom.id ? [] : freeBy[rm.id]));
      if (others.length < suspects.length - 1) continue;
      let k = 0;
      for (let i = 0; i < suspects.length; i++) if (i !== murderer) solution[i] = others[k++];

      const base = { cols: cfg.cols, rows: cfg.rows, rooms, furniture, victim, suspects, solution, murderer,
                     roomMap: buildRoomMap(rooms), difficulty: difficultyId, theme, furnitureTypes, furnitureNl };
      const clues = selectClues(base, cluePool(base), cfg, difficultyId, r);
      if (!clues) continue;

      return { ...base, clues, clueTexts: clues.map(c => formatClue(c, base)), caseText: caseText(base) };
    }
    return null;
  }

  // ── Handgemaakte puzzel (oefenzaak, campagnelevels) ─────────
  // def: { cols, rows, layout: [[kamerIndex,...],...], rooms:[{name,article,color}],
  //        furniture: {"x,y": type}, victim:{x,y}, suspects, solution, murderer, clues, theme }
  function fromLayout(def) {
    const rooms = def.rooms.map((rm, id) => ({ id, name: rm.name, article: rm.article || 'de', color: rm.color, list: [], cells: new Set() }));
    for (let y = 0; y < def.rows; y++) for (let x = 0; x < def.cols; x++) {
      const rm = rooms[def.layout[y][x]];
      rm.list.push({ x, y }); rm.cells.add(key(x, y));
    }
    const theme = def.theme || defaultTheme(def.suspects);
    const furniture = new Map(Object.entries(def.furniture || {}));
    const vroom = roomOf(rooms, def.victim.x, def.victim.y);
    const base = {
      cols: def.cols, rows: def.rows, rooms, furniture,
      victim: { x: def.victim.x, y: def.victim.y, roomId: vroom.id },
      suspects: def.suspects, solution: def.solution, murderer: def.murderer,
      roomMap: buildRoomMap(rooms), difficulty: def.difficulty || 'tutorial', theme,
      furnitureTypes: theme.furniture.map(f => f.id),
      furnitureNl: Object.fromEntries(theme.furniture.map(f => [f.id, f.nl]))
    };
    return { ...base, clues: def.clues, clueTexts: def.clues.map(c => formatClue(c, base)), caseText: caseText(base) };
  }

  // ── Hint-engine: uitleggen, niet verklappen ─────────────────
  // placements: array per verdachte met {x,y} of null
  function hint(puzzle, placements) {
    const N = i => puzzle.suspects[i].label;
    const n = puzzle.suspects.length;
    const P = placements.map(c => c || null);
    const mentions = (c, i) => (UNARY.has(c.kind) || c.kind === 'alone') ? c.s === i : BINARY.has(c.kind) ? (c.a === i || c.b === i) : false;

    // 1. Fouten eerst: een geplaatste verdachte die een aanwijzing schendt
    for (let i = 0; i < n; i++) {
      if (!P[i]) continue;
      const t = puzzle.solution[i];
      if (P[i].x === t.x && P[i].y === t.y) continue;
      const single = [P[i]]; const A1 = new Array(n).fill(null); A1[i] = P[i];
      const bad = puzzle.clues.findIndex(c => holds(c, A1, puzzle) === false || holds(c, P, puzzle) === false);
      if (bad !== -1) {
        return { type: 'mistake', suspect: i, clues: [bad], cells: single,
                 text: `${N(i)} staat verkeerd. Aanwijzing ${bad + 1} zegt: "${puzzle.clueTexts[bad]}"`,
                 detail: 'Haal de verdachte weg en kijk welke vakjes die aanwijzing wél toelaat.' };
      }
      if (victimRule(P, puzzle) === false) {
        return { type: 'mistake', suspect: i, clues: [], cells: single,
                 text: `Er staan twee verdachten in de ${puzzle.theme.roomWord || 'kamer'} van het slachtoffer. Alleen de moordenaar was daar.`,
                 detail: 'Precies één persoon bevond zich in die kamer.' };
      }
      const rel = puzzle.clues.findIndex(c => mentions(c, i));
      return { type: 'mistake', suspect: i, clues: rel === -1 ? [] : [rel], cells: single,
               text: `${N(i)} staat niet op de juiste plek.`,
               detail: rel === -1 ? 'Kijk nog eens naar de aanwijzingen over de anderen.' : `Lees aanwijzing ${rel + 1} nog eens.` };
    }

    // 2. Redeneerstap: kandidaten met de juiste plaatsingen als vast gegeven
    const fixed = P.map((c, i) => c && c.x === puzzle.solution[i].x && c.y === puzzle.solution[i].y ? c : null);
    const cands = candidates(puzzle, fixed);
    let best = -1;
    for (let i = 0; i < n; i++) {
      if (fixed[i]) continue;
      if (best === -1 || cands[i].length < cands[best].length) best = i;
    }
    if (best === -1) return { type: 'done', clues: [], cells: [], text: 'Iedereen staat goed. Wie was alleen met het slachtoffer?', detail: '' };

    const related = puzzle.clues.map((c, idx) => mentions(c, best) ? idx : -1).filter(i => i !== -1);
    const nrs = related.map(i => i + 1).join(', ');
    if (cands[best].length === 1) {
      return { type: 'deduce', suspect: best, clues: related, cells: cands[best],
               text: `${N(best)} kan maar op één plek staan.`,
               detail: related.length ? `Combineer aanwijzing ${nrs} met de spelregel over het slachtoffer.` : 'De spelregel over het slachtoffer dwingt dit af.' };
    }
    const roomIds = new Set(cands[best].map(c => roomAt(puzzle, c).id));
    const one = roomIds.size === 1 ? puzzle.rooms.find(q => q.id === [...roomIds][0]) : null;
    const roomTxt = one ? `in ${one.article || 'de'} ${one.name}` : `verdeeld over ${roomIds.size} ${puzzle.theme.roomWordPlural || 'kamers'}`;
    return { type: 'narrow', suspect: best, clues: related, cells: cands[best],
             text: `Begin met ${N(best)}: er zijn nog maar ${cands[best].length} mogelijke vakjes, ${roomTxt}.`,
             detail: related.length ? `Aanwijzing ${nrs} beperkt de opties. Streep vakjes weg die er niet aan voldoen.` : 'Gebruik de plaatsen van de anderen om verder te snoeien.' };
  }

  return { generate, fromLayout, solve, candidates, check, holds, hint, formatClue, rng,
           DIFF, FURNITURE, FURNITURE_NL, roomOf, cellsOf, isCorner, isEdge, posOf, key };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = { FloorPlan };
