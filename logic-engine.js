// ============================================================
// LOGIC GRID PUZZLE ENGINE
// Generator, solver, en constraint propagation
// ============================================================

// ── Grid Status Constanten ───────────────────────────────────
const CELL_EMPTY      = 0;
const CELL_ELIMINATED = -1; // ✗
const CELL_CONFIRMED  = 1;  // ✓

// ══════════════════════════════════════════════════════════════
//  LogicGrid — Beheert de grid-status en constraint propagation
// ══════════════════════════════════════════════════════════════
class LogicGrid {
  /**
   * @param {number} numCategories — aantal categorieën (bijv. 3)
   * @param {number} numItems — items per categorie (bijv. 4)
   */
  constructor(numCategories, numItems) {
    this.numCat = numCategories;
    this.numItems = numItems;

    // Voor elk paar (i,j) met i < j: een numItems × numItems array
    this.cells = {};
    for (let i = 0; i < numCategories; i++) {
      for (let j = i + 1; j < numCategories; j++) {
        this.cells[`${i}-${j}`] = Array.from(
          { length: numItems },
          () => Array(numItems).fill(CELL_EMPTY)
        );
      }
    }
  }

  /** Maak een diepe kopie van dit grid */
  clone() {
    const copy = new LogicGrid(this.numCat, this.numItems);
    for (const key in this.cells) {
      copy.cells[key] = this.cells[key].map(row => [...row]);
    }
    return copy;
  }

  /** Haal een cel op, ongeacht de volgorde van categorieën */
  get(catI, catJ, itemI, itemJ) {
    if (catI === catJ) return undefined;
    if (catI < catJ) return this.cells[`${catI}-${catJ}`][itemI][itemJ];
    return this.cells[`${catJ}-${catI}`][itemJ][itemI];
  }

  /** Stel een cel in, ongeacht de volgorde van categorieën */
  set(catI, catJ, itemI, itemJ, value) {
    if (catI === catJ) return;
    if (catI < catJ) this.cells[`${catI}-${catJ}`][itemI][itemJ] = value;
    else this.cells[`${catJ}-${catI}`][itemJ][itemI] = value;
  }

  // ── Bevestig een cel (✓) ─────────────────────────────────
  confirm(catI, itemI, catJ, itemJ) {
    if (this.get(catI, catJ, itemI, itemJ) === CELL_CONFIRMED) return false;
    if (this.get(catI, catJ, itemI, itemJ) === CELL_ELIMINATED) return false; // contradictie

    this.set(catI, catJ, itemI, itemJ, CELL_CONFIRMED);

    // Elimineer alle andere cellen in dezelfde rij en kolom
    for (let k = 0; k < this.numItems; k++) {
      if (k !== itemJ) this.set(catI, catJ, itemI, k, CELL_ELIMINATED);
      if (k !== itemI) this.set(catI, catJ, k, itemJ, CELL_ELIMINATED);
    }
    return true;
  }

  // ── Elimineer een cel (✗) ────────────────────────────────
  eliminate(catI, itemI, catJ, itemJ) {
    if (this.get(catI, catJ, itemI, itemJ) !== CELL_EMPTY) return false;
    this.set(catI, catJ, itemI, itemJ, CELL_ELIMINATED);
    return true;
  }

  // ── Pas een aanwijzing toe ───────────────────────────────
  applyClue(clue) {
    switch (clue.type) {
      case 'positive':
        this.confirm(clue.cat1, clue.item1, clue.cat2, clue.item2);
        break;
      case 'negative':
        this.eliminate(clue.cat1, clue.item1, clue.cat2, clue.item2);
        break;
      case 'or':
        // item1 uit cat1 is gekoppeld aan één van items2 uit cat2
        for (let j = 0; j < this.numItems; j++) {
          if (!clue.items2.includes(j)) {
            this.eliminate(clue.cat1, clue.item1, clue.cat2, j);
          }
        }
        break;
      case 'neither':
        // item1 uit cat1 is NIET gekoppeld aan item2a of item2b
        for (const item of clue.items2) {
          this.eliminate(clue.cat1, clue.item1, clue.cat2, item);
        }
        break;
    }
  }

  // ── Constraint Propagation ───────────────────────────────
  propagate() {
    let changed = true;
    let iterations = 0;
    while (changed && iterations < 100) {
      changed = false;
      changed = this._lastRemaining() || changed;
      changed = this._crossInference() || changed;
      iterations++;
    }
  }

  /** Als een rij/kolom nog maar 1 lege cel heeft → bevestig die */
  _lastRemaining() {
    let changed = false;
    for (let i = 0; i < this.numCat; i++) {
      for (let j = i + 1; j < this.numCat; j++) {
        const g = this.cells[`${i}-${j}`];

        // Check rijen
        for (let r = 0; r < this.numItems; r++) {
          if (g[r].includes(CELL_CONFIRMED)) continue;
          const empties = [];
          for (let c = 0; c < this.numItems; c++) {
            if (g[r][c] === CELL_EMPTY) empties.push(c);
          }
          if (empties.length === 1) {
            this.confirm(i, r, j, empties[0]);
            changed = true;
          }
        }

        // Check kolommen
        for (let c = 0; c < this.numItems; c++) {
          let hasConfirmed = false;
          const empties = [];
          for (let r = 0; r < this.numItems; r++) {
            if (g[r][c] === CELL_CONFIRMED) hasConfirmed = true;
            if (g[r][c] === CELL_EMPTY) empties.push(r);
          }
          if (!hasConfirmed && empties.length === 1) {
            this.confirm(i, empties[0], j, c);
            changed = true;
          }
        }
      }
    }
    return changed;
  }

  /** Cross-grid inferentie: als A↔B en B↔C, dan A↔C */
  _crossInference() {
    let changed = false;
    for (let a = 0; a < this.numCat; a++) {
      for (let b = 0; b < this.numCat; b++) {
        if (b === a) continue;
        for (let c = 0; c < this.numCat; c++) {
          if (c === a || c === b) continue;
          for (let i = 0; i < this.numItems; i++) {
            for (let j = 0; j < this.numItems; j++) {
              if (this.get(a, b, i, j) !== CELL_CONFIRMED) continue;

              for (let k = 0; k < this.numItems; k++) {
                const bc = this.get(b, c, j, k);
                const ac = this.get(a, c, i, k);

                // A↔B=✓ en B↔C=✓ → A↔C=✓
                if (bc === CELL_CONFIRMED && ac !== CELL_CONFIRMED) {
                  this.confirm(a, i, c, k);
                  changed = true;
                }
                // A↔B=✓ en B↔C=✗ → A↔C=✗
                if (bc === CELL_ELIMINATED && ac === CELL_EMPTY) {
                  this.eliminate(a, i, c, k);
                  changed = true;
                }
                // A↔B=✓ en A↔C=✗ → B↔C=✗
                if (ac === CELL_ELIMINATED && this.get(b, c, j, k) === CELL_EMPTY) {
                  this.eliminate(b, j, c, k);
                  changed = true;
                }
                // A↔B=✓ en A↔C=✓ → B↔C=✓
                if (ac === CELL_CONFIRMED && this.get(b, c, j, k) !== CELL_CONFIRMED) {
                  this.confirm(b, j, c, k);
                  changed = true;
                }
              }
            }
          }
        }
      }
    }
    return changed;
  }

  // ── Controleer of het grid volledig is opgelost ──────────
  isSolved() {
    for (let i = 0; i < this.numCat; i++) {
      for (let j = i + 1; j < this.numCat; j++) {
        const g = this.cells[`${i}-${j}`];
        for (let r = 0; r < this.numItems; r++) {
          if (!g[r].includes(CELL_CONFIRMED)) return false;
        }
      }
    }
    return true;
  }

  /** Controleer op tegenspraak (een rij/kolom met alleen ✗) */
  hasContradiction() {
    for (let i = 0; i < this.numCat; i++) {
      for (let j = i + 1; j < this.numCat; j++) {
        const g = this.cells[`${i}-${j}`];
        for (let r = 0; r < this.numItems; r++) {
          if (g[r].every(v => v === CELL_ELIMINATED)) return true;
        }
        for (let c = 0; c < this.numItems; c++) {
          if (g.every(row => row[c] === CELL_ELIMINATED)) return true;
        }
      }
    }
    return false;
  }
}


// ══════════════════════════════════════════════════════════════
//  PuzzleGenerator — Genereert puzzels met unieke oplossing
// ══════════════════════════════════════════════════════════════

/**
 * Gewichten per aanwijzingstype per moeilijkheid.
 * Een hoger gewicht = de generator probeert dit type eerder.
 * Makkelijk leunt op directe aanwijzingen, moeilijk op of/niet-aanwijzingen.
 */
const CLUE_WEIGHTS = {
  makkelijk: { positive: 6, negative: 1.5, or: 0.5, neither: 0.5 },
  gemiddeld: { positive: 1.2, negative: 2, or: 2, neither: 1 },
  moeilijk:  { positive: 0.25, negative: 2, or: 3, neither: 2 }
};

/** Maximaal aantal directe (positieve) aanwijzingen per moeilijkheid */
const MAX_POSITIVE = { makkelijk: 99, gemiddeld: 3, moeilijk: 1 };

class PuzzleGenerator {
  /**
   * @param {number} numCategories
   * @param {number} numItems
   * @param {string} difficulty — 'makkelijk' | 'gemiddeld' | 'moeilijk'
   */
  constructor(numCategories, numItems, difficulty = 'gemiddeld') {
    this.numCat = numCategories;
    this.numItems = numItems;
    this.difficulty = CLUE_WEIGHTS[difficulty] ? difficulty : 'gemiddeld';
  }

  /**
   * Genereer een complete puzzel.
   * @param {number} [seed] — optionele seed voor dagelijkse puzzels
   * @returns {{ solution: number[][], clues: object[] }}
   */
  generate(seed) {
    const rng = seed !== undefined ? this._seededRng(seed) : Math.random;

    // Probeer een paar keer en houd de beste poging: niet te veel directe
    // aanwijzingen, en zo min mogelijk aanwijzingen in totaal.
    const N = this.numItems;
    const target = { makkelijk: N + 2, gemiddeld: 2 * N, moeilijk: 2 * N + 2 }[this.difficulty];
    let best = null;
    for (let attempt = 0; attempt < 8; attempt++) {
      const solution = this._generateSolution(rng);
      const candidates = this._generateCandidateClues(solution, rng);
      const clues = this._selectClues(candidates, rng);
      const positives = clues.filter(c => c.type === 'positive').length;
      const ok = positives <= MAX_POSITIVE[this.difficulty];
      const better = !best || (ok && !best.ok) || (ok === best.ok && clues.length < best.clues.length);
      if (better) best = { solution, clues, ok };
      if (ok && clues.length <= target) break;
    }
    return { solution: best.solution, clues: best.clues };
  }

  /** Genereer een willekeurige oplossing (permutaties per categorie) */
  _generateSolution(rng) {
    // Elke groep[i] bevat de item-indices per categorie
    // Categorie 0 = identiteit [0, 1, ..., N-1]
    // Categorie 1+ = willekeurige permutatie
    const groups = [];
    const perms = [];

    perms.push(Array.from({ length: this.numItems }, (_, i) => i));
    for (let c = 1; c < this.numCat; c++) {
      perms.push(this._shuffle([...perms[0]], rng));
    }

    for (let i = 0; i < this.numItems; i++) {
      const group = [];
      for (let c = 0; c < this.numCat; c++) {
        group.push(perms[c][i]);
      }
      groups.push(group);
    }

    return groups;
  }

  /** Genereer alle mogelijke (ware) aanwijzingen uit de oplossing */
  _generateCandidateClues(solution, rng) {
    const clues = [];
    const N = this.numItems;

    for (let ci = 0; ci < this.numCat; ci++) {
      for (let cj = ci + 1; cj < this.numCat; cj++) {
        // Welk item van cj hoort bij item i van ci?
        const map = {};
        for (const group of solution) map[group[ci]] = group[cj];

        for (let i = 0; i < N; i++) {
          const correct = map[i];

          // Positief: "A hoort bij B"
          clues.push({ type: 'positive', cat1: ci, item1: i, cat2: cj, item2: correct });

          // Negatief: "A hoort niet bij C"
          for (let j = 0; j < N; j++) {
            if (j !== correct) {
              clues.push({ type: 'negative', cat1: ci, item1: i, cat2: cj, item2: j });
            }
          }

          // Of: "A hoort bij B of C" (B is de juiste)
          for (let other = 0; other < N; other++) {
            if (other !== correct) {
              clues.push({
                type: 'or', cat1: ci, item1: i, cat2: cj,
                items2: [correct, other].sort((a, b) => a - b)
              });
            }
          }

          // Noch: "A hoort niet bij C en ook niet bij D" (alleen zinvol bij N >= 4)
          if (N >= 4) {
            for (let a = 0; a < N; a++) {
              for (let b = a + 1; b < N; b++) {
                if (a !== correct && b !== correct) {
                  clues.push({ type: 'neither', cat1: ci, item1: i, cat2: cj, items2: [a, b] });
                }
              }
            }
          }
        }
      }
    }

    return clues;
  }

  /**
   * Gewogen willekeurige volgorde: elke aanwijzing krijgt een sleutel
   * rng()^(1/gewicht); hoog gewicht = vaker vooraan (Efraimidis-Spirakis).
   */
  _weightedOrder(candidates, rng) {
    const w = CLUE_WEIGHTS[this.difficulty];
    return candidates
      .map(c => ({ c, key: Math.pow(rng(), 1 / (w[c.type] || 1)) }))
      .sort((a, b) => b.key - a.key)
      .map(x => x.c);
  }

  /** Selecteer een minimale aanwijzingenset die het grid met pure logica oplost */
  _selectClues(candidates, rng) {
    const ordered = this._weightedOrder(candidates, rng);
    const selected = [];

    for (const clue of ordered) {
      selected.push(clue);
      if (this._solves(selected)) {
        const minimal = this._minimizeClues(selected);
        return this._shuffle(minimal, rng); // volgorde verraadt de oplosroute niet
      }
    }
    return selected; // zou niet moeten gebeuren: alle positieve clues samen lossen altijd op
  }

  /** Lost deze set aanwijzingen het grid volledig op met alleen propagatie? */
  _solves(clues) {
    const solver = new LogicGrid(this.numCat, this.numItems);
    for (const c of clues) solver.applyClue(c);
    solver.propagate();
    return solver.isSolved() && !solver.hasContradiction();
  }

  /** Verwijder overbodige aanwijzingen (probeer de sterkste het eerst weg te halen) */
  _minimizeClues(clues) {
    const strength = { positive: 3, or: 2, neither: 2, negative: 1 };
    // Sorteer zodat positieve clues het eerst getest (en dus het liefst verwijderd) worden
    const order = clues
      .map((c, idx) => ({ c, idx }))
      .sort((a, b) => strength[b.c.type] - strength[a.c.type]);

    const keep = new Set(clues.map((_, idx) => idx));
    for (const { idx } of order) {
      keep.delete(idx);
      const test = clues.filter((_, i) => keep.has(i));
      if (!this._solves(test)) keep.add(idx);
    }
    return clues.filter((_, i) => keep.has(i));
  }

  /** Fisher-Yates shuffle met optionele RNG */
  _shuffle(array, rng = Math.random) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /** Simpele seeded PRNG (Mulberry32) */
  _seededRng(seed) {
    let s = seed | 0;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
}


// ══════════════════════════════════════════════════════════════
//  ClueFormatter — Maakt leesbare Nederlandse tekst van clues
// ══════════════════════════════════════════════════════════════
const ClueFormatter = {
  /**
   * Formatteer een aanwijzing als Nederlandse tekst.
   * Categorieparen zijn altijd (suspect, location), (suspect, weapon) of (location, weapon).
   * @param {object} clue
   * @param {object[]} categories — array van categorie-objecten met items[]
   * @returns {string}
   */
  format(clue, categories) {
    const cat1 = categories[clue.cat1];
    const cat2 = categories[clue.cat2];
    const key = `${cat1.type}-${cat2.type}`;
    const a = this.name(cat1, clue.item1);

    switch (clue.type) {
      case 'positive': return this._positive(key, a, this.name(cat2, clue.item2));
      case 'negative': return this._negative(key, a, this.name(cat2, clue.item2));
      case 'or':       return this._or(key, a, clue.items2.map(i => this.name(cat2, i)));
      case 'neither':  return this._neither(key, a, clue.items2.map(i => this.name(cat2, i)));
      default:         return '';
    }
  },

  /** Naam met lidwoord: "de Keuken", "het Mes", "de Kandelaar", "Clara" */
  name(cat, itemIdx) {
    const item = cat.items[itemIdx];
    if (cat.type === 'suspect') return item.label;
    return `${item.article || 'de'} ${item.label}`;
  },

  /** Alleen de naam, zonder lidwoord (voor UI-labels) */
  bare(cat, itemIdx) {
    return cat.items[itemIdx].label;
  },

  _positive(key, a, b) {
    switch (key) {
      case 'suspect-location': return `${a} was in ${b}.`;
      case 'suspect-weapon':   return `${a} gebruikte ${b}.`;
      case 'location-weapon':  return `In ${a} werd ${b} gevonden.`;
      default:                 return `${a} hoort bij ${b}.`;
    }
  },

  _negative(key, a, b) {
    switch (key) {
      case 'suspect-location': return `${a} was niet in ${b}.`;
      case 'suspect-weapon':   return `${a} gebruikte ${b} niet.`;
      case 'location-weapon':  return `In ${a} werd ${b} niet gevonden.`;
      default:                 return `${a} hoort niet bij ${b}.`;
    }
  },

  _or(key, a, [b, c]) {
    switch (key) {
      case 'suspect-location': return `${a} was in ${b} of in ${c}.`;
      case 'suspect-weapon':   return `${a} gebruikte ${b} of ${c}.`;
      case 'location-weapon':  return `In ${a} werd ${b} of ${c} gevonden.`;
      default:                 return `${a} hoort bij ${b} of bij ${c}.`;
    }
  },

  _neither(key, a, [b, c]) {
    switch (key) {
      case 'suspect-location': return `${a} was niet in ${b} en ook niet in ${c}.`;
      case 'suspect-weapon':   return `${a} gebruikte ${b} niet, en ${c} ook niet.`;
      case 'location-weapon':  return `In ${a} werd ${b} niet gevonden, en ${c} ook niet.`;
      default:                 return `${a} hoort niet bij ${b} en ook niet bij ${c}.`;
    }
  }
};


// ══════════════════════════════════════════════════════════════
//  HintEngine — Vindt de volgende logische stap en legt die uit
//
//  De hint legt uit WAAROM, niet alleen WAT. Volgorde van zoeken,
//  van eenvoudig naar geavanceerd:
//    0. Een fout in het raster van de speler
//    1. Een aanwijzing die direct iets oplevert
//    2. Rij/kolom wegstrepen na een ✓
//    3. Laatste overgebleven cel in een rij of kolom
//    4. Een of-aanwijzing waarvan één optie al is weggestreept
//    5. Kruisverwijzing tussen twee deelrasters (A↔B en B↔C ⇒ A↔C)
//
//  Retourneert { level, clueIndex?, text, detail, cells: [{catI,itemI,catJ,itemJ,value}] }
// ══════════════════════════════════════════════════════════════
const HintEngine = {
  getHint(playerGrid, clues, categories) {
    const truth = this._solve(playerGrid.numCat, playerGrid.numItems, clues);
    return this._mistake(playerGrid, truth, clues, categories)
        || this._fromClue(playerGrid, clues, categories)
        || this._rowColumnElimination(playerGrid, categories)
        || this._lastRemaining(playerGrid, categories)
        || this._orResolve(playerGrid, clues, categories)
        || this._transitivity(playerGrid, categories)
        || null;
  },

  /** Volledig opgelost raster op basis van de aanwijzingen (de waarheid) */
  _solve(numCat, numItems, clues) {
    const g = new LogicGrid(numCat, numItems);
    clues.forEach(c => g.applyClue(c));
    g.propagate();
    return g;
  },

  _cell(catI, itemI, catJ, itemJ, value) {
    return { catI, itemI, catJ, itemJ, value };
  },

  _pair(categories, catI, itemI, catJ, itemJ) {
    return `${ClueFormatter.bare(categories[catI], itemI)} × ${ClueFormatter.bare(categories[catJ], itemJ)}`;
  },

  // ── 0. Fout in het raster ─────────────────────────────────
  _mistake(grid, truth, clues, categories) {
    for (let i = 0; i < grid.numCat; i++) {
      for (let j = i + 1; j < grid.numCat; j++) {
        const g = grid.cells[`${i}-${j}`];
        const t = truth.cells[`${i}-${j}`];
        for (let r = 0; r < grid.numItems; r++) {
          for (let c = 0; c < grid.numItems; c++) {
            if (g[r][c] !== CELL_EMPTY && t[r][c] !== CELL_EMPTY && g[r][c] !== t[r][c]) {
              const mark = g[r][c] === CELL_CONFIRMED ? '✓' : '✗';
              const pair = this._pair(categories, i, r, j, c);
              // Zoek een aanwijzing die over deze cel gaat
              const ci = clues.findIndex(cl =>
                cl.cat1 === i && cl.cat2 === j && cl.item1 === r &&
                (cl.item2 === c || (cl.items2 && cl.items2.includes(c))));
              const ref = ci >= 0 ? ` Lees aanwijzing ${ci + 1} nog eens: "${ClueFormatter.format(clues[ci], categories)}"` : '';
              return {
                level: 0,
                clueIndex: ci >= 0 ? ci : undefined,
                text: `Er zit een fout in je raster. Kijk nog eens naar ${pair}.`,
                detail: `Je hebt ${pair} als ${mark} gemarkeerd, maar dat volgt niet uit de aanwijzingen. Haal die markering weg.${ref}`,
                cells: [this._cell(i, r, j, c, CELL_EMPTY)]
              };
            }
          }
        }
      }
    }
    return null;
  },

  // ── 1. Direct uit een aanwijzing ──────────────────────────
  _fromClue(grid, clues, categories) {
    for (let ci = 0; ci < clues.length; ci++) {
      const clue = clues[ci];
      const { cat1, item1, cat2 } = clue;
      const N = grid.numItems;
      const quote = `Aanwijzing ${ci + 1} zegt: "${ClueFormatter.format(clue, categories)}"`;
      const who = ClueFormatter.bare(categories[cat1], item1);

      if (clue.type === 'positive') {
        const cells = [];
        if (grid.get(cat1, cat2, item1, clue.item2) !== CELL_CONFIRMED) {
          cells.push(this._cell(cat1, item1, cat2, clue.item2, CELL_CONFIRMED));
        }
        for (let k = 0; k < N; k++) {
          if (k !== clue.item2 && grid.get(cat1, cat2, item1, k) === CELL_EMPTY) {
            cells.push(this._cell(cat1, item1, cat2, k, CELL_ELIMINATED));
          }
          if (k !== item1 && grid.get(cat1, cat2, k, clue.item2) === CELL_EMPTY) {
            cells.push(this._cell(cat1, k, cat2, clue.item2, CELL_ELIMINATED));
          }
        }
        if (cells.length) {
          const pair = this._pair(categories, cat1, item1, cat2, clue.item2);
          return {
            level: 1, clueIndex: ci,
            text: `Aanwijzing ${ci + 1} vertelt je direct iets over ${who}.`,
            detail: `${quote} — Zet een ✓ bij ${pair}. Elke rij en kolom heeft precies één ✓, dus streep de rest van die rij en kolom weg met ✗.`,
            cells
          };
        }
      }

      if (clue.type === 'negative') {
        if (grid.get(cat1, cat2, item1, clue.item2) === CELL_EMPTY) {
          const pair = this._pair(categories, cat1, item1, cat2, clue.item2);
          return {
            level: 1, clueIndex: ci,
            text: `Bekijk aanwijzing ${ci + 1} opnieuw. Wat sluit die uit voor ${who}?`,
            detail: `${quote} — Die twee horen dus niet bij elkaar. Zet een ✗ bij ${pair}.`,
            cells: [this._cell(cat1, item1, cat2, clue.item2, CELL_ELIMINATED)]
          };
        }
      }

      if (clue.type === 'or') {
        const cells = [];
        for (let k = 0; k < N; k++) {
          if (!clue.items2.includes(k) && grid.get(cat1, cat2, item1, k) === CELL_EMPTY) {
            cells.push(this._cell(cat1, item1, cat2, k, CELL_ELIMINATED));
          }
        }
        if (cells.length) {
          const options = clue.items2.map(k => ClueFormatter.bare(categories[cat2], k)).join(' of ');
          return {
            level: 1, clueIndex: ci,
            text: `Aanwijzing ${ci + 1} beperkt de mogelijkheden voor ${who} tot twee opties.`,
            detail: `${quote} — Het is ${options}. Alle andere ${categories[cat2].name.toLowerCase()}s vallen af: zet daar een ✗ in de rij van ${who}.`,
            cells
          };
        }
      }

      if (clue.type === 'neither') {
        const cells = clue.items2
          .filter(k => grid.get(cat1, cat2, item1, k) === CELL_EMPTY)
          .map(k => this._cell(cat1, item1, cat2, k, CELL_ELIMINATED));
        if (cells.length) {
          return {
            level: 1, clueIndex: ci,
            text: `Aanwijzing ${ci + 1} sluit twee opties uit voor ${who}.`,
            detail: `${quote} — Zet een ✗ bij beide genoemde opties in de rij van ${who}.`,
            cells
          };
        }
      }
    }
    return null;
  },

  // ── 2. Rij/kolom wegstrepen na een ✓ ──────────────────────
  _rowColumnElimination(grid, categories) {
    const N = grid.numItems;
    for (let i = 0; i < grid.numCat; i++) {
      for (let j = i + 1; j < grid.numCat; j++) {
        const g = grid.cells[`${i}-${j}`];
        for (let r = 0; r < N; r++) {
          for (let c = 0; c < N; c++) {
            if (g[r][c] !== CELL_CONFIRMED) continue;
            const cells = [];
            for (let k = 0; k < N; k++) {
              if (k !== c && g[r][k] === CELL_EMPTY) cells.push(this._cell(i, r, j, k, CELL_ELIMINATED));
              if (k !== r && g[k][c] === CELL_EMPTY) cells.push(this._cell(i, k, j, c, CELL_ELIMINATED));
            }
            if (cells.length) {
              const pair = this._pair(categories, i, r, j, c);
              return {
                level: 2,
                text: `Je hebt ${pair} bevestigd. Wat betekent dat voor de rest van die rij en kolom?`,
                detail: `Elke ${categories[i].name.toLowerCase()} hoort bij precies één ${categories[j].name.toLowerCase()} en andersom. Omdat ${pair} een ✓ is, kunnen de andere cellen in die rij en kolom niet meer: zet daar een ✗.`,
                cells
              };
            }
          }
        }
      }
    }
    return null;
  },

  // ── 3. Laatste overgebleven cel in rij of kolom ───────────
  _lastRemaining(grid, categories) {
    const N = grid.numItems;
    for (let i = 0; i < grid.numCat; i++) {
      for (let j = i + 1; j < grid.numCat; j++) {
        const g = grid.cells[`${i}-${j}`];
        const block = `${categories[i].name} × ${categories[j].name}`;

        for (let r = 0; r < N; r++) {
          if (g[r].includes(CELL_CONFIRMED)) continue;
          const empties = [];
          for (let c = 0; c < N; c++) if (g[r][c] === CELL_EMPTY) empties.push(c);
          if (empties.length === 1) {
            const who = ClueFormatter.bare(categories[i], r);
            const what = ClueFormatter.bare(categories[j], empties[0]);
            return {
              level: 2,
              text: `Kijk naar de rij van ${who} in het blok ${block}. Er is nog maar één mogelijkheid over.`,
              detail: `Alle andere opties voor ${who} zijn weggestreept. De enige die overblijft is ${what}, dus dat moet een ✓ zijn.`,
              cells: [this._cell(i, r, j, empties[0], CELL_CONFIRMED)]
            };
          }
        }

        for (let c = 0; c < N; c++) {
          let confirmed = false;
          const empties = [];
          for (let r = 0; r < N; r++) {
            if (g[r][c] === CELL_CONFIRMED) confirmed = true;
            if (g[r][c] === CELL_EMPTY) empties.push(r);
          }
          if (!confirmed && empties.length === 1) {
            const what = ClueFormatter.bare(categories[j], c);
            const who = ClueFormatter.bare(categories[i], empties[0]);
            return {
              level: 2,
              text: `Kijk naar de kolom van ${what} in het blok ${block}. Er is nog maar één mogelijkheid over.`,
              detail: `Alle andere opties voor ${what} zijn weggestreept. De enige die overblijft is ${who}, dus dat moet een ✓ zijn.`,
              cells: [this._cell(i, empties[0], j, c, CELL_CONFIRMED)]
            };
          }
        }
      }
    }
    return null;
  },

  // ── 4. Of-aanwijzing met één weggestreepte optie ──────────
  _orResolve(grid, clues, categories) {
    for (let ci = 0; ci < clues.length; ci++) {
      const clue = clues[ci];
      if (clue.type !== 'or') continue;
      const [a, b] = clue.items2;
      const sa = grid.get(clue.cat1, clue.cat2, clue.item1, a);
      const sb = grid.get(clue.cat1, clue.cat2, clue.item1, b);
      let winner = null;
      if (sa === CELL_ELIMINATED && sb === CELL_EMPTY) winner = b;
      if (sb === CELL_ELIMINATED && sa === CELL_EMPTY) winner = a;
      if (winner === null) continue;
      const who = ClueFormatter.bare(categories[clue.cat1], clue.item1);
      const loser = ClueFormatter.bare(categories[clue.cat2], winner === a ? b : a);
      const win = ClueFormatter.bare(categories[clue.cat2], winner);
      return {
        level: 2, clueIndex: ci,
        text: `Combineer aanwijzing ${ci + 1} met wat je al hebt weggestreept voor ${who}.`,
        detail: `Aanwijzing ${ci + 1} zegt: "${ClueFormatter.format(clue, categories)}" — ${loser} heb je al uitgesloten, dus blijft alleen ${win} over. Zet daar een ✓.`,
        cells: [this._cell(clue.cat1, clue.item1, clue.cat2, winner, CELL_CONFIRMED)]
      };
    }
    return null;
  },

  // ── 5. Kruisverwijzing tussen deelrasters ─────────────────
  _transitivity(grid, categories) {
    const N = grid.numItems;
    const nc = grid.numCat;
    for (let a = 0; a < nc; a++) {
      for (let b = 0; b < nc; b++) {
        if (b === a) continue;
        for (let c = 0; c < nc; c++) {
          if (c === a || c === b) continue;
          for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
              if (grid.get(a, b, i, j) !== CELL_CONFIRMED) continue;
              const ab = this._pair(categories, a, i, b, j);
              for (let k = 0; k < N; k++) {
                const bc = grid.get(b, c, j, k);
                const ac = grid.get(a, c, i, k);
                const nameA = ClueFormatter.bare(categories[a], i);
                const nameB = ClueFormatter.bare(categories[b], j);
                const nameC = ClueFormatter.bare(categories[c], k);

                if (bc === CELL_CONFIRMED && ac !== CELL_CONFIRMED) {
                  return {
                    level: 3,
                    text: `Combineer twee blokken: je weet al iets over ${nameA} en over ${nameB}.`,
                    detail: `${nameA} hoort bij ${nameB} (✓), en ${nameB} hoort bij ${nameC} (✓). Dan hoort ${nameA} ook bij ${nameC}: zet een ✓ bij ${nameA} × ${nameC}.`,
                    cells: [this._cell(a, i, c, k, CELL_CONFIRMED)]
                  };
                }
                if (bc === CELL_ELIMINATED && ac === CELL_EMPTY) {
                  return {
                    level: 3,
                    text: `Combineer twee blokken: ${ab} is een ✓. Wat weet je over ${nameB}?`,
                    detail: `${nameA} hoort bij ${nameB} (✓), maar ${nameB} hoort niet bij ${nameC} (✗). Dan kan ${nameA} ook niet bij ${nameC} horen: zet een ✗ bij ${nameA} × ${nameC}.`,
                    cells: [this._cell(a, i, c, k, CELL_ELIMINATED)]
                  };
                }
                if (ac === CELL_ELIMINATED && bc === CELL_EMPTY) {
                  return {
                    level: 3,
                    text: `Combineer twee blokken: ${ab} is een ✓. Wat weet je over ${nameA}?`,
                    detail: `${nameA} hoort bij ${nameB} (✓), maar ${nameA} hoort niet bij ${nameC} (✗). Dan kan ${nameB} ook niet bij ${nameC} horen: zet een ✗ bij ${nameB} × ${nameC}.`,
                    cells: [this._cell(b, j, c, k, CELL_ELIMINATED)]
                  };
                }
              }
            }
          }
        }
      }
    }
    return null;
  }
};
