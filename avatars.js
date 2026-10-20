// ============================================================
// AVATARS — platte SVG-illustraties voor verdachten, locaties
// en wapens. Geen externe assets, geen tekstknopen (belangrijk:
// cellen moeten textContent '✓' / '✗' / '' houden voor de tests).
// ============================================================

const Avatars = (() => {

  // ── Kleurhulp ───────────────────────────────────────────────
  function shade(hex, amount) {
    const n = parseInt(hex.slice(1), 16);
    const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
    const r = clamp(((n >> 16) & 255) + amount);
    const g = clamp(((n >> 8) & 255) + amount);
    const b = clamp((n & 255) + amount);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // Witruimte tussen tags weghalen: anders ontstaan er tekstknopen in de
  // SVG en is cell.textContent niet langer exact '✓' / '✗'.
  const clean = svg => svg.replace(/>\s+</g, '><').trim();

  const SKIN = ['#F2C9A0', '#E3A876', '#C68642', '#8D5524', '#F7D9BE'];
  const HAIR = ['#2B2018', '#6B4423', '#4A4A4A', '#8B4513', '#D9C7A0', '#7B3F00'];
  const OUTLINE = '#1A1108';

  // ── Verdachte: portret in de stijl van de covers ────────────
  // Gekleurde achtergrond, schouders, hoofd, kapsel + accent.
  function suspect(item, index) {
    // eigen portret als de verdachte er een heeft; het SVG-gezicht hieronder is de terugval
    if (item.portrait) return `<img class="av av-photo" src="${item.portrait}" alt="" draggable="false" decoding="async">`;
    const st    = item.style || {};
    const bg    = item.color || '#B85C5C';
    const skin  = st.skin  || SKIN[index % SKIN.length];
    const hair  = st.hairColor || HAIR[index % HAIR.length];
    const cloth = shade(bg, -55);
    const style = st.hair !== undefined ? st.hair : index % 5;

    let hairShape = '';
    if (style === 0) {
      hairShape = `<path d="M12 17 Q12 8 20 8 Q28 8 28 17 L28 15 Q28 12 20 12 Q12 12 12 15 Z" fill="${hair}"/>`;
    } else if (style === 1) {
      hairShape = `<path d="M11 17 Q11 7 20 7 Q29 7 29 17 L29 30 L26 30 L26 15 Q26 11 20 11 Q14 11 14 15 L14 30 L11 30 Z" fill="${hair}"/>`;
    } else if (style === 2) {
      hairShape = `<circle cx="20" cy="7.5" r="3.4" fill="${hair}"/><path d="M12 17 Q12 9 20 9 Q28 9 28 17 L28 15 Q28 12 20 12 Q12 12 12 15 Z" fill="${hair}"/>`;
    } else if (style === 3) {
      hairShape = `<path d="M12 16 Q13 10 20 10 Q27 10 28 16 L28 14 Q26 13 20 13 Q14 13 12 14 Z" fill="${hair}"/>`;
    } else {
      hairShape = `<g fill="${hair}"><circle cx="14" cy="13" r="3.6"/><circle cx="20" cy="10.6" r="4"/><circle cx="26" cy="13" r="3.6"/><circle cx="12.8" cy="17.5" r="2.8"/><circle cx="27.2" cy="17.5" r="2.8"/></g>`;
    }

    let extra = '';
    if (st.glasses || (st.hair === undefined && style === 3)) {
      extra += `<g fill="none" stroke="${OUTLINE}" stroke-width="1.1" opacity="0.75"><circle cx="16.6" cy="19.4" r="2.5"/><circle cx="23.4" cy="19.4" r="2.5"/><path d="M19.1 19.4 h1.8"/></g>`;
    }
    if (st.moustache || (st.hair === undefined && style === 0)) {
      extra += `<rect x="16" y="22" width="8" height="1.8" rx="0.9" fill="${shade(hair, -10)}"/>`;
    }
    if (st.beard) extra += `<path d="M13 21 Q14 30 20 31 Q26 30 27 21 Q24 27 20 27 Q16 27 13 21 Z" fill="${shade(hair, -6)}"/>`;
    if (st.eyepatch) extra += `<circle cx="23.4" cy="19.2" r="2.7" fill="${OUTLINE}"/><path d="M12.6 15.6 L27.8 17.4" stroke="${OUTLINE}" stroke-width="1.1"/>`;
    if (st.bowtie) extra += `<path d="M17 30.5 l3 1.5 l3-1.5 v3 l-3-1.5 l-3 1.5 z" fill="${shade(bg, -70)}"/>`;

    if (st.hat === 'tricorn') {
      extra += `<path d="M7 13 Q12 5 20 6 Q28 5 33 13 Q26 10 20 11 Q14 10 7 13 Z" fill="#1F1A17"/><path d="M12.5 11.5 Q20 9 27.5 11.5" stroke="#C9A227" stroke-width="1.2" fill="none"/>`;
    } else if (st.hat === 'bandana') {
      extra += `<path d="M11.5 15 Q12 8.5 20 8.5 Q28 8.5 28.5 15 Q20 12.5 11.5 15 Z" fill="#B3261E"/><path d="M27 12 L33 10 L31 15 Z" fill="#B3261E"/>`;
    } else if (st.hat === 'tophat') {
      extra += `<rect x="13" y="1" width="14" height="10" fill="#1F1A17"/><rect x="9.5" y="10" width="21" height="2.2" rx="1" fill="#1F1A17"/><rect x="13" y="8" width="14" height="1.6" fill="#8B2E1C"/>`;
    } else if (st.hat === 'cap') {
      extra += `<path d="M11.5 13 Q12 7 20 7 Q28 7 28.5 13 Z" fill="#2C3E50"/><rect x="11" y="12.4" width="20" height="2" rx="1" fill="#1F2A36"/>`;
    } else if (st.hat === 'helmet') {
      extra += `<ellipse cx="20" cy="18.5" rx="11" ry="12" fill="rgba(210,235,255,0.28)" stroke="#EAF4FF" stroke-width="1.6"/><rect x="9.5" y="28" width="21" height="4" rx="2" fill="#BFC9D4"/>`;
    }

    return clean(`<svg viewBox="0 0 40 40" class="av av-suspect" aria-hidden="true" focusable="false">
      <rect width="40" height="40" fill="${bg}"/>
      <path d="M8 40 Q8 30 20 30 Q32 30 32 40 Z" fill="${cloth}"/>
      <rect x="17.6" y="25" width="4.8" height="6" fill="${shade(skin, -22)}"/>
      <ellipse cx="20" cy="19.5" rx="7.6" ry="8.6" fill="${skin}"/>
      ${hairShape}
      ${extra}
    </svg>`);
  }

  // ── Locatie: kamertegel met vloer + meubelglyph ──────────────
  function location(item, index) {
    const bg   = item.color || '#8B4513';
    const wall = shade(bg, 46);
    const dark = shade(bg, -50);
    const ink  = shade(bg, -78);
    const kind = (item.label || '').toLowerCase();

    let glyph;
    if (kind.includes('tuin')) {
      glyph = `<rect x="18.6" y="24" width="2.8" height="9" fill="${ink}"/>
               <circle cx="20" cy="19" r="7.4" fill="${dark}"/>
               <circle cx="15.6" cy="22.4" r="4.4" fill="${dark}"/>
               <circle cx="24.4" cy="22.4" r="4.4" fill="${dark}"/>`;
    } else if (kind.includes('keuken')) {
      glyph = `<rect x="10" y="20" width="20" height="11" rx="2" fill="${dark}"/>
               <rect x="13" y="23" width="14" height="5" rx="1" fill="${wall}"/>
               <path d="M12 20 v-4 h4 v4" stroke="${ink}" stroke-width="1.8" fill="none"/>`;
    } else if (kind.includes('kelder')) {
      glyph = `<path d="M8 32 h6 v-5 h6 v-5 h6 v-5 h6" stroke="${ink}" stroke-width="2.6" fill="none"/>
               <rect x="8" y="32" width="24" height="2.4" fill="${dark}"/>`;
    } else if (kind.includes('biblio')) {
      glyph = `<rect x="11" y="14" width="4.4" height="18" rx="1" fill="${dark}"/>
               <rect x="16.6" y="17" width="4.4" height="15" rx="1" fill="${ink}"/>
               <rect x="22.2" y="13" width="4.4" height="19" rx="1" fill="${dark}"/>
               <rect x="27.8" y="18" width="3.4" height="14" rx="1" fill="${ink}"/>`;
    } else {
      // studeerkamer / standaard: bureau met lamp
      glyph = `<rect x="9" y="24" width="22" height="3" rx="1" fill="${ink}"/>
               <rect x="11" y="27" width="2.4" height="6" fill="${dark}"/>
               <rect x="26.6" y="27" width="2.4" height="6" fill="${dark}"/>
               <path d="M22 24 v-6 l5-3" stroke="${ink}" stroke-width="1.6" fill="none"/>
               <circle cx="27.6" cy="14.4" r="3.2" fill="${dark}"/>`;
    }

    return clean(`<svg viewBox="0 0 40 40" class="av av-location" aria-hidden="true" focusable="false">
      <rect width="40" height="40" fill="${wall}"/>
      <rect y="26" width="40" height="14" fill="${bg}" opacity="0.55"/>
      ${glyph}
    </svg>`);
  }

  // ── Wapen: icoon op gekleurde tegel ─────────────────────────
  function weapon(item, index) {
    const bg   = item.color || '#7F8C8D';
    const ink  = shade(bg, -80);
    const lite = shade(bg, 60);
    const kind = (item.label || '').toLowerCase();

    let glyph;
    if (kind.includes('gif')) {
      glyph = `<path d="M17 9 h6 v5 l4 8 v9 a2 2 0 0 1-2 2 h-10 a2 2 0 0 1-2-2 v-9 l4-8 z" fill="${lite}" stroke="${ink}" stroke-width="1.4"/>
               <circle cx="20" cy="25" r="3.4" fill="${ink}"/>`;
    } else if (kind.includes('mes')) {
      glyph = `<path d="M14 30 L24 12 L27 14 L18 32 z" fill="${lite}" stroke="${ink}" stroke-width="1.3"/>
               <rect x="11.6" y="28.6" width="5.6" height="3.4" rx="1.2" transform="rotate(-28 14 30)" fill="${ink}"/>`;
    } else if (kind.includes('touw')) {
      glyph = `<g fill="none" stroke="${ink}" stroke-width="2.4">
                 <circle cx="20" cy="22" r="8"/><circle cx="20" cy="22" r="4"/>
                 <path d="M20 14 v-5"/></g>`;
    } else if (kind.includes('kandelaar')) {
      glyph = `<rect x="18.4" y="16" width="3.2" height="14" fill="${lite}" stroke="${ink}" stroke-width="1.2"/>
               <ellipse cx="20" cy="31" rx="6" ry="2.4" fill="${ink}"/>
               <path d="M20 15 q3 -3 0 -6 q-3 3 0 6z" fill="${lite}" stroke="${ink}" stroke-width="1"/>`;
    } else {
      // revolver
      glyph = `<path d="M10 18 h16 v5 h-4 l-3 8 h-5 l1-8 h-5 z" fill="${lite}" stroke="${ink}" stroke-width="1.3"/>
               <circle cx="17" cy="20.4" r="2.6" fill="${ink}"/>`;
    }

    return clean(`<svg viewBox="0 0 40 40" class="av av-weapon" aria-hidden="true" focusable="false">
      <rect width="40" height="40" fill="${bg}"/>
      ${glyph}
    </svg>`);
  }

  // ── Meubels op de plattegrond ───────────────────────────────
  const FURN = {
    plant: `<g><path d="M20 30 L17 22 h6 z" fill="#C87941"/><rect x="15.5" y="29" width="9" height="7" rx="1.6" fill="#D98E4A"/><path d="M20 22 q-7-2-6-9 q6 0 6 7 q0-8 6-9 q2 7-6 11z" fill="#3F9D5C"/></g>`,
    tv:    `<g><rect x="9" y="14" width="22" height="16" rx="2" fill="#7A5236"/><rect x="11.5" y="16.5" width="13" height="11" rx="1" fill="#B9C6CC"/><rect x="26" y="17" width="3.5" height="3" rx="0.6" fill="#3B2A1B"/><rect x="26" y="22" width="3.5" height="3" rx="0.6" fill="#3B2A1B"/><path d="M14 14 L10 7 M22 14 L27 7" stroke="#3B2A1B" stroke-width="1.4" fill="none"/><rect x="12" y="30" width="16" height="2.4" rx="1" fill="#5C3D28"/></g>`,
    kast:  `<g><rect x="8" y="12" width="24" height="20" rx="1.6" fill="#8A5A34"/><rect x="10" y="14" width="20" height="7" fill="#E8D9C0"/><rect x="10" y="23" width="20" height="7" fill="#E8D9C0"/><g fill="#C0392B"><rect x="11" y="15" width="2.4" height="5"/><rect x="17" y="15" width="2.4" height="5"/></g><g fill="#2980B9"><rect x="14" y="15" width="2.4" height="5"/><rect x="21" y="24" width="2.4" height="5"/></g><g fill="#27AE60"><rect x="11" y="24" width="2.4" height="5"/><rect x="17" y="24" width="2.4" height="5"/></g></g>`,
    stoel: `<g><rect x="10" y="17" width="20" height="12" rx="3" fill="#D98BC0"/><rect x="7.5" y="19" width="5" height="10" rx="2.2" fill="#C46FAC"/><rect x="27.5" y="19" width="5" height="10" rx="2.2" fill="#C46FAC"/><rect x="11" y="14" width="18" height="6" rx="2.4" fill="#E8A5D2"/><rect x="11" y="29" width="2.6" height="4.5" fill="#8A6A55"/><rect x="26.4" y="29" width="2.6" height="4.5" fill="#8A6A55"/></g>`,
    doos:  `<g><path d="M8 18 h24 l-2.5 13 h-19 z" fill="#C99A63"/><path d="M8 18 h24 l-3 -4 h-18 z" fill="#E0B67E"/><rect x="18.6" y="22" width="2.8" height="4" rx="1" fill="#8A5A34"/></g>`,
    // — piratenschip —
    kanon:     `<g><rect x="6" y="19" width="22" height="7" rx="3.5" fill="#2F2F2F"/><circle cx="27" cy="22.5" r="4" fill="#3A3A3A"/><circle cx="14" cy="29" r="4" fill="#7A5236" stroke="#3B2A1B" stroke-width="1.2"/><circle cx="14" cy="29" r="1.4" fill="#3B2A1B"/></g>`,
    ton:       `<g><path d="M12 11 Q9 20 12 30 h16 Q31 20 28 11 Z" fill="#A5673F"/><rect x="10.5" y="15" width="19" height="2" fill="#4A2F1B"/><rect x="10.5" y="24" width="19" height="2" fill="#4A2F1B"/><ellipse cx="20" cy="11" rx="8" ry="2.2" fill="#C48A5A"/></g>`,
    schatkist: `<g><rect x="8" y="19" width="24" height="12" rx="1.5" fill="#8A5A34"/><path d="M8 19 q0-7 12-7 q12 0 12 7 z" fill="#A5673F"/><rect x="8" y="18" width="24" height="2.4" fill="#C9A227"/><rect x="18" y="19" width="4" height="5" rx="1" fill="#C9A227"/></g>`,
    touw:      `<g fill="none" stroke="#B8905A" stroke-width="3.2" stroke-linecap="round"><circle cx="20" cy="22" r="8"/><circle cx="20" cy="22" r="3.5"/></g><path d="M26 15 l6 -5" stroke="#B8905A" stroke-width="3" stroke-linecap="round"/>`,
    lantaarn:  `<g><rect x="14" y="13" width="12" height="15" rx="2" fill="#F5D67A" stroke="#4A4A4A" stroke-width="1.6"/><rect x="16" y="9" width="8" height="4" rx="1" fill="#4A4A4A"/><path d="M20 9 v-3" stroke="#4A4A4A" stroke-width="2"/><rect x="15" y="28" width="10" height="3" rx="1" fill="#4A4A4A"/><ellipse cx="20" cy="21" rx="2.4" ry="3.4" fill="#F39C12"/></g>`,
    // — grand hotel —
    piano:     `<g><path d="M9 14 h18 q5 0 5 5 v12 h-23 z" fill="#1F1A17"/><rect x="11" y="27" width="19" height="3" fill="#F5F0E6"/><g fill="#1F1A17"><rect x="13" y="27" width="1.6" height="1.8"/><rect x="16" y="27" width="1.6" height="1.8"/><rect x="21" y="27" width="1.6" height="1.8"/><rect x="24" y="27" width="1.6" height="1.8"/></g><rect x="10" y="30" width="2" height="4" fill="#1F1A17"/><rect x="28" y="30" width="2" height="4" fill="#1F1A17"/></g>`,
    koffer:    `<g><rect x="9" y="15" width="22" height="16" rx="2.5" fill="#8A5A34"/><rect x="9" y="21" width="22" height="2.4" fill="#5C3D28"/><rect x="16" y="11" width="8" height="4" rx="1.6" fill="none" stroke="#5C3D28" stroke-width="2"/><rect x="18.4" y="20" width="3.2" height="4.4" rx="0.8" fill="#C9A227"/></g>`,
    palm:      `<g><rect x="18.8" y="20" width="2.4" height="12" fill="#8A5A34"/><g fill="#3F9D5C"><path d="M20 20 q-9-6-12-1 q7-1 12 3z"/><path d="M20 20 q9-6 12-1 q-7-1-12 3z"/><path d="M20 20 q-5-9 1-12 q2 7-1 12z"/><path d="M20 20 q6-8 10-4 q-6 2-10 6z"/></g><path d="M15 33 h10" stroke="#C87941" stroke-width="3" stroke-linecap="round"/></g>`,
    sofa:      `<g><rect x="7" y="17" width="26" height="12" rx="3" fill="#B3547A"/><rect x="5" y="19" width="5" height="10" rx="2.2" fill="#8E3F60"/><rect x="30" y="19" width="5" height="10" rx="2.2" fill="#8E3F60"/><rect x="10" y="14" width="20" height="6" rx="2.4" fill="#C8698F"/><rect x="9" y="29" width="2.4" height="4" fill="#5C3D28"/><rect x="28.6" y="29" width="2.4" height="4" fill="#5C3D28"/></g>`,
    trolley:   `<g><rect x="10" y="14" width="20" height="3" rx="1" fill="#BFC9D4"/><rect x="10" y="25" width="20" height="3" rx="1" fill="#BFC9D4"/><rect x="11.5" y="17" width="2" height="8" fill="#8A97A3"/><rect x="26.5" y="17" width="2" height="8" fill="#8A97A3"/><path d="M15 14 q5-7 10 0 z" fill="#E8E8E8"/><circle cx="13" cy="30" r="2" fill="#4A4A4A"/><circle cx="27" cy="30" r="2" fill="#4A4A4A"/></g>`,
    // — station orion —
    console:   `<g><path d="M8 28 L12 14 h16 l4 14 z" fill="#2C3E50"/><rect x="14" y="16" width="12" height="7" rx="1" fill="#6FE3FF"/><g fill="#E74C3C"><circle cx="15" cy="26" r="1"/></g><g fill="#2ECC71"><circle cx="19" cy="26" r="1"/><circle cx="23" cy="26" r="1"/></g><rect x="6" y="28" width="28" height="3" rx="1.5" fill="#1B2631"/></g>`,
    capsule:   `<g><rect x="8" y="13" width="24" height="16" rx="8" fill="#DDE6EE" stroke="#8A97A3" stroke-width="1.5"/><rect x="11" y="16" width="12" height="10" rx="5" fill="#6FE3FF" opacity="0.7"/><rect x="25" y="18" width="4" height="6" rx="1" fill="#8A97A3"/></g>`,
    robot:     `<g><rect x="12" y="15" width="16" height="13" rx="3" fill="#BFC9D4" stroke="#4A5A6A" stroke-width="1.3"/><rect x="15" y="18" width="4" height="4" rx="1" fill="#6FE3FF"/><rect x="21" y="18" width="4" height="4" rx="1" fill="#6FE3FF"/><path d="M20 15 v-4" stroke="#4A5A6A" stroke-width="1.6"/><circle cx="20" cy="10" r="1.6" fill="#E74C3C"/><rect x="14" y="28" width="12" height="3" rx="1" fill="#4A5A6A"/><circle cx="15" cy="32" r="1.8" fill="#4A5A6A"/><circle cx="25" cy="32" r="1.8" fill="#4A5A6A"/></g>`,
    krat:      `<g><rect x="9" y="13" width="22" height="18" rx="1.5" fill="#D9A441"/><path d="M9 13 L31 31 M31 13 L9 31" stroke="#8A6A20" stroke-width="1.6"/><rect x="9" y="13" width="22" height="18" rx="1.5" fill="none" stroke="#8A6A20" stroke-width="1.6"/></g>`,
    // — het museum —
    sarcofaag: `<g><path d="M14 6 h12 q4 0 4 4 v20 q0 4-4 4 h-12 q-4 0-4-4 v-20 q0-4 4-4 z" fill="#D4A64A" stroke="#7A5A1C" stroke-width="1.4"/><path d="M13 12 h14 M13 28 h14" stroke="#7A5A1C" stroke-width="1.2"/><ellipse cx="20" cy="17" rx="4.5" ry="5" fill="#E8C98A" stroke="#7A5A1C" stroke-width="1"/><path d="M17.5 16 h2 M20.5 16 h2" stroke="#3B2A1B" stroke-width="1.2"/><rect x="16" y="24" width="8" height="2" fill="#2F6F6D"/></g>`,
    schilderij:`<g><rect x="7" y="10" width="26" height="20" rx="1.5" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.6"/><rect x="10" y="13" width="20" height="14" fill="#9DB7D6"/><path d="M10 27 L17 19 L21 23 L25 18 L30 27 z" fill="#5C8B5E"/><circle cx="25" cy="16" r="2" fill="#F5D67A"/></g>`,
    skelet:    `<g fill="#F3EDE3" stroke="#7B5E3B" stroke-width="1.1"><path d="M8 24 q6-10 14-8 q6 1 9-3 l2 1 q-2 5-7 5 q-5 3-11 6 l-1 5 h-3 l1-5 q-3 0-4-1z"/><circle cx="30" cy="12" r="3.2"/><path d="M12 20 v-3 M16 18 v-4 M20 17 v-4" stroke-width="1.6"/><circle cx="31" cy="11.5" r="0.8" fill="#7B5E3B" stroke="none"/></g>`,
    vitrine:   `<g><rect x="10" y="9" width="20" height="16" rx="1.5" fill="rgba(200,230,255,0.55)" stroke="#8A97A3" stroke-width="1.6"/><path d="M10 17 h20" stroke="#8A97A3" stroke-width="1"/><path d="M20 12 l3.5 3-3.5 3-3.5-3z" fill="#5FC9C9" stroke="#2F6F6D" stroke-width="0.9"/><rect x="8" y="25" width="24" height="8" rx="1.5" fill="#7A5236"/></g>`,
    beeld:     `<g><rect x="12" y="25" width="16" height="8" rx="1" fill="#D0C9BD" stroke="#8A97A3" stroke-width="1.2"/><rect x="14" y="21" width="12" height="4" fill="#E5E1DA" stroke="#8A97A3" stroke-width="1"/><ellipse cx="20" cy="12" rx="4.5" ry="5.2" fill="#F3EDE3" stroke="#8A97A3" stroke-width="1.2"/><path d="M13 21 q1-5 7-5 q6 0 7 5z" fill="#F3EDE3" stroke="#8A97A3" stroke-width="1.2"/></g>`,
    // — de nachttrein —
    hutkoffer: `<g><rect x="7" y="12" width="26" height="20" rx="3" fill="#7A5236" stroke="#3B2A1B" stroke-width="1.4"/><path d="M7 20 h26" stroke="#3B2A1B" stroke-width="1.2"/><rect x="12" y="12" width="3" height="20" fill="#C9A227"/><rect x="25" y="12" width="3" height="20" fill="#C9A227"/><rect x="18" y="18" width="4" height="5" rx="1" fill="#C9A227" stroke="#3B2A1B" stroke-width="0.8"/><rect x="9" y="12" width="22" height="3" fill="#5C3D28"/></g>`,
    samovar:   `<g><path d="M13 12 h14 l-2 14 h-10 z" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.3"/><rect x="11" y="9" width="18" height="3" rx="1.5" fill="#E0B95A" stroke="#7A5A1C" stroke-width="1"/><rect x="18" y="5" width="4" height="4" fill="#7A5A1C"/><rect x="14" y="26" width="12" height="3" rx="1" fill="#7A5A1C"/><rect x="12" y="29" width="16" height="3" rx="1.5" fill="#C9A227" stroke="#7A5A1C" stroke-width="1"/><path d="M27 18 h4 v3" stroke="#7A5A1C" stroke-width="1.6" fill="none"/><path d="M8 14 q-3 4 0 8" stroke="#7A5A1C" stroke-width="1.6" fill="none"/></g>`,
    grammofoon:`<g><rect x="9" y="24" width="22" height="9" rx="1.5" fill="#7A5236" stroke="#3B2A1B" stroke-width="1.3"/><circle cx="14" cy="28.5" r="2" fill="#3B2A1B"/><path d="M19 24 q-2-9 4-13 q6-4 10 2 q-6 0-9 5 q-2 3-2 6z" fill="#D4A64A" stroke="#7A5A1C" stroke-width="1.2"/><path d="M20 23 l-2-6" stroke="#3B2A1B" stroke-width="1.6"/></g>`,
    bank:      `<g><rect x="7" y="17" width="26" height="11" rx="2.5" fill="#2F6F4E"/><rect x="9" y="11" width="22" height="7" rx="2.4" fill="#3E8A65"/><rect x="5" y="19" width="4" height="9" rx="1.6" fill="#7A5236"/><rect x="31" y="19" width="4" height="9" rx="1.6" fill="#7A5236"/><path d="M13 11 v6 M20 11 v6 M27 11 v6" stroke="#2F6F4E" stroke-width="1.2"/><rect x="10" y="28" width="2.4" height="4" fill="#5C3D28"/><rect x="27.6" y="28" width="2.4" height="4" fill="#5C3D28"/></g>`,
    kroonluchter:`<g><path d="M20 5 v5" stroke="#7A5A1C" stroke-width="1.6"/><path d="M8 18 q12-10 24 0" fill="none" stroke="#C9A227" stroke-width="2.2"/><path d="M11 20 q9-6 18 0" fill="none" stroke="#C9A227" stroke-width="1.6"/><g fill="#F5D67A" stroke="#7A5A1C" stroke-width="0.8"><circle cx="8" cy="19" r="2.2"/><circle cx="14" cy="16" r="2.2"/><circle cx="20" cy="15" r="2.2"/><circle cx="26" cy="16" r="2.2"/><circle cx="32" cy="19" r="2.2"/></g><g fill="#DCEBF0" stroke="#8A97A3" stroke-width="0.6"><path d="M11 22 l1.5 4 -1.5 4 -1.5-4z"/><path d="M20 22 l1.5 4 -1.5 4 -1.5-4z"/><path d="M29 22 l1.5 4 -1.5 4 -1.5-4z"/></g></g>`,
    // — het circus —
    circuskanon: `<g><rect x="5" y="17" width="24" height="8" rx="4" fill="#B3261E" stroke="#3B2A1B" stroke-width="1.3"/><circle cx="28" cy="21" r="4.5" fill="#8B1E17" stroke="#3B2A1B" stroke-width="1.2"/><path d="M10 17 v8 M17 17 v8" stroke="#F5D67A" stroke-width="2"/><circle cx="13" cy="29" r="4" fill="#F5D67A" stroke="#3B2A1B" stroke-width="1.2"/><circle cx="13" cy="29" r="1.4" fill="#3B2A1B"/><path d="M33 16 l3-3 M34 21 h4 M33 26 l3 3" stroke="#F39C12" stroke-width="1.6" stroke-linecap="round"/></g>`,
    trapeze:   `<g><path d="M12 6 v14 M28 6 v14" stroke="#7A5236" stroke-width="1.8"/><rect x="9" y="19" width="22" height="3.5" rx="1.5" fill="#C9A227" stroke="#7A5A1C" stroke-width="1"/><path d="M8 6 h24" stroke="#3B2A1B" stroke-width="2"/><circle cx="20" cy="29" r="3.5" fill="#E8A5D2" stroke="#3B2A1B" stroke-width="1"/><path d="M20 32 v4 M17 34 h6" stroke="#3B2A1B" stroke-width="1.4"/></g>`,
    spiegelkast:`<g><rect x="9" y="7" width="22" height="26" rx="2" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.4"/><rect x="12" y="10" width="16" height="20" rx="1.5" fill="#DCEBF0"/><path d="M14 27 L26 12" stroke="#FFFFFF" stroke-width="2.5" opacity="0.9"/><path d="M14 20 L22 11" stroke="#FFFFFF" stroke-width="1.2" opacity="0.7"/><g fill="#B3261E"><circle cx="10" cy="9" r="1.3"/><circle cx="30" cy="9" r="1.3"/><circle cx="10" cy="31" r="1.3"/><circle cx="30" cy="31" r="1.3"/></g></g>`,
    popcornkar:`<g><rect x="9" y="17" width="22" height="13" rx="2" fill="#B3261E" stroke="#3B2A1B" stroke-width="1.3"/><rect x="11" y="9" width="18" height="9" rx="1.5" fill="#DCEBF0" stroke="#3B2A1B" stroke-width="1.2"/><path d="M9 9 h22" stroke="#B3261E" stroke-width="3"/><g fill="#F5D67A"><circle cx="15" cy="14" r="1.8"/><circle cx="20" cy="12.5" r="1.8"/><circle cx="25" cy="14" r="1.8"/><circle cx="18" cy="15.5" r="1.4"/><circle cx="22" cy="15.5" r="1.4"/></g><path d="M12 17 v13 M28 17 v13" stroke="#F5D67A" stroke-width="1.6"/><circle cx="14" cy="32" r="2.4" fill="#3B2A1B"/><circle cx="26" cy="32" r="2.4" fill="#3B2A1B"/></g>`,
    kooi:      `<g><rect x="7" y="10" width="26" height="22" rx="3" fill="#F3EDE3" stroke="#3B2A1B" stroke-width="1.4"/><g stroke="#3B2A1B" stroke-width="1.6"><path d="M12 10 v22 M17 10 v22 M23 10 v22 M28 10 v22"/></g><ellipse cx="20" cy="22" rx="6" ry="5" fill="#D9A441" stroke="#7A5A1C" stroke-width="1"/><circle cx="20" cy="21" r="3.2" fill="#F0CE8E"/><circle cx="19" cy="20.5" r="0.6" fill="#3B2A1B"/><circle cx="21" cy="20.5" r="0.6" fill="#3B2A1B"/><rect x="5" y="32" width="30" height="3" rx="1.5" fill="#7A5236"/></g>`,
    // — de skihut —
    kachel:    `<g><rect x="10" y="12" width="20" height="18" rx="2.5" fill="#2C2C2C" stroke="#111" stroke-width="1.3"/><rect x="13" y="16" width="14" height="9" rx="1.5" fill="#F39C12"/><path d="M16 25 q2-6 4-4 q1-4 4-4 q1 3 0 8z" fill="#F5D67A"/><rect x="18" y="5" width="4" height="7" fill="#2C2C2C"/><rect x="11" y="30" width="3" height="4" fill="#111"/><rect x="26" y="30" width="3" height="4" fill="#111"/><path d="M13 27 h14" stroke="#555" stroke-width="1"/></g>`,
    slee:      `<g><rect x="8" y="14" width="24" height="10" rx="2" fill="#7A5236" stroke="#3B2A1B" stroke-width="1.3"/><path d="M8 18 h24 M8 21 h24" stroke="#3B2A1B" stroke-width="0.8"/><path d="M6 30 q0-4 4-4 h20 q4 0 6-4" fill="none" stroke="#8A97A3" stroke-width="2.4" stroke-linecap="round"/><path d="M12 24 v3 M28 24 v3" stroke="#3B2A1B" stroke-width="1.6"/><path d="M8 14 l-3-3" stroke="#3B2A1B" stroke-width="1.6" stroke-linecap="round"/></g>`,
    skirek:    `<g><rect x="6" y="28" width="28" height="4" rx="1" fill="#7A5236" stroke="#3B2A1B" stroke-width="1.1"/><g stroke-width="2.4" stroke-linecap="round"><path d="M11 28 L13 8" stroke="#B3261E"/><path d="M16 28 L18 8" stroke="#2C3E50"/><path d="M23 28 L25 8" stroke="#3F9D5C"/><path d="M28 28 L30 8" stroke="#F39C12"/></g><path d="M12 12 h3 M17 12 h3 M24 12 h3 M29 12 h3" stroke="#3B2A1B" stroke-width="1.4"/></g>`,
    gewei:     `<g><path d="M14 30 h12 l-2-5 h-8z" fill="#7A5236" stroke="#3B2A1B" stroke-width="1.2"/><path d="M16 25 q-6-4-6-12 q1 4 4 5 q-3-6-1-10 q2 4 4 6 q0-5 3-8 q0 6 1 11" fill="none" stroke="#C9B48E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 25 q6-4 6-12 q-1 4-4 5 q3-6 1-10 q-2 4-4 6 q0-5-3-8 q0 6-1 11" fill="none" stroke="#C9B48E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>`,
    fondue:    `<g><path d="M10 14 h20 l-2 10 h-16z" fill="#F39C12" stroke="#7A5A1C" stroke-width="1.3"/><path d="M12 14 h16" stroke="#F5D67A" stroke-width="3"/><rect x="16" y="24" width="8" height="4" fill="#4A4A4A"/><rect x="12" y="28" width="16" height="3" rx="1.5" fill="#2C2C2C"/><path d="M14 10 l6-5 M22 8 l5-4 M26 12 l4 -3" stroke="#8A97A3" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="18" cy="31" rx="3" ry="1.2" fill="#F39C12"/></g>`,
    // — hacienda san isidro —
    agave:     `<g><ellipse cx="20" cy="33" rx="11" ry="2.6" fill="#9C6B43"/><g fill="#6E9E8A" stroke="#2F5546" stroke-width="1.1" stroke-linejoin="round"><path d="M17 32 L3 22 L19 30z"/><path d="M23 32 L37 22 L21 30z"/><path d="M17 32 L7 10 L20 29z"/><path d="M23 32 L33 10 L20 29z"/><path d="M18 32 L20 4 L22 32z"/></g></g>`,
    ketel:     `<g><path d="M22 13 q9 -5 12 5 v12" fill="none" stroke="#9C5326" stroke-width="2.2" stroke-linecap="round"/><circle cx="17" cy="23" r="9" fill="#C8743A" stroke="#7A3E1C" stroke-width="1.4"/><path d="M11 17 q6 -9 12 0" fill="#D98B4E" stroke="#7A3E1C" stroke-width="1.3"/><rect x="15.5" y="9" width="3" height="4" fill="#7A3E1C"/><ellipse cx="13.5" cy="21" rx="2" ry="3.4" fill="#F0B98A" opacity="0.7"/><rect x="9" y="31" width="16" height="3" rx="1" fill="#3B2A1B"/><rect x="31" y="30" width="5" height="4" rx="1" fill="#7A5236" stroke="#3B2A1B" stroke-width="1"/></g>`,
    gitaar:    `<g><path d="M22 19 L33 7" stroke="#5A3A1E" stroke-width="3" stroke-linecap="round"/><path d="M31 4 l4 -1 l1 4 l-3 2z" fill="#3B2A1B"/><g stroke="#7A4A1C" stroke-width="1.4"><ellipse cx="15" cy="27" rx="8" ry="7" fill="#D99A4E"/><ellipse cx="21" cy="20" rx="5.5" ry="5" fill="#D99A4E"/></g><ellipse cx="15" cy="27" rx="7.3" ry="6.3" fill="#D99A4E"/><ellipse cx="21" cy="20" rx="4.8" ry="4.3" fill="#D99A4E"/><circle cx="17" cy="24" r="2.4" fill="#3B2A1B"/><path d="M11 30 l4 -4" stroke="#5A3A1E" stroke-width="1.6"/></g>`,
    hangmat:   `<g><path d="M6 7 v26 M34 7 v26" stroke="#7A5236" stroke-width="2.4" stroke-linecap="round"/><path d="M6 12 Q20 32 34 12 Q20 24 6 12z" fill="#D9534F" stroke="#7A2A1C" stroke-width="1.2" stroke-linejoin="round"/><path d="M9 15 Q20 28 31 15" fill="none" stroke="#F2C14E" stroke-width="1.6"/><path d="M12 19 Q20 26 28 19" fill="none" stroke="#2E9CCA" stroke-width="1.3"/></g>`,
    pinata:    `<g><path d="M20 0 v6" stroke="#3B2A1B" stroke-width="1.1"/><path d="M17.2 15.7 L20.0 6.0 L22.8 15.7z" fill="#E84393" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><path d="M23.2 15.9 L33.0 13.5 L26.0 20.8z" fill="#2E9CCA" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><path d="M26.0 21.2 L33.0 28.5 L23.2 26.1z" fill="#F39C12" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><path d="M22.8 26.3 L20.0 36.0 L17.2 26.3z" fill="#3FAE6A" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><path d="M16.8 26.1 L7.0 28.5 L14.0 21.2z" fill="#E84393" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><path d="M14.0 20.8 L7.0 13.5 L16.8 15.9z" fill="#2E9CCA" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><circle cx="20" cy="21" r="6.4" fill="#F2C14E" stroke="#7A5A1C" stroke-width="1.2"/></g>`,
    // — opéra lumière —
    paspop:    `<g><path d="M20 27 v6 M14 36 L20 32 L26 36" stroke="#3B2A1B" stroke-width="1.8" fill="none" stroke-linecap="round"/><rect x="18" y="4" width="4" height="4" rx="1" fill="#7A5236"/><path d="M13 9 q7 -4 14 0 q2 6 -1.5 10 q2.5 4 2.5 9 h-16 q0 -5 2.5 -9 q-3.5 -4 -1.5 -10z" fill="#E8DCC8" stroke="#7A5A1C" stroke-width="1.3" stroke-linejoin="round"/><path d="M13.5 18 h13" stroke="#C62828" stroke-width="1.2"/><path d="M15 18 v1.6 M18 18 v1.6 M21 18 v1.6 M24 18 v1.6" stroke="#C62828" stroke-width="0.7"/></g>`,
    harp:      `<g><path d="M15 7.2 V33.2 M18.5 6.9 V29.5 M22 7.5 V25.8 M25.5 9.1 V22.1 M29 11.7 V18.4" stroke="#E8DCC8" stroke-width="0.9"/><path d="M11 8 Q22 2 33 15" fill="none" stroke="#C9A227" stroke-width="2.6" stroke-linecap="round"/><path d="M11 7 V34" stroke="#C9A227" stroke-width="3" stroke-linecap="round"/><path d="M33 15 L15 34" stroke="#7A5236" stroke-width="3.4" stroke-linecap="round"/><rect x="8" y="33" width="12" height="3" rx="1" fill="#7A5A1C"/><circle cx="11" cy="6" r="2" fill="#E0B95A" stroke="#7A5A1C" stroke-width="0.8"/></g>`,
    masker:    `<g><path d="M29 24 L34 37" stroke="#7A5236" stroke-width="1.8" stroke-linecap="round"/><path d="M29 12 q7 -9 4 -11 q-2 6 -6 9z" fill="#B3261E"/><path d="M6 16 Q20 8 34 16 Q33 26 25 25 Q20 22 15 25 Q7 26 6 16z" fill="#F2F0EA" stroke="#3B2A1B" stroke-width="1.3" stroke-linejoin="round"/><path d="M8 14.5 Q20 7.5 32 14.5" fill="none" stroke="#C9A227" stroke-width="1.5"/><ellipse cx="14" cy="18" rx="3.2" ry="2" fill="#3B2A1B"/><ellipse cx="26" cy="18" rx="3.2" ry="2" fill="#3B2A1B"/></g>`,
    boeket:    `<g><ellipse cx="10" cy="20" rx="3.2" ry="1.8" fill="#3F7D4E" transform="rotate(-30 10 20)"/><ellipse cx="30" cy="20" rx="3.2" ry="1.8" fill="#3F7D4E" transform="rotate(30 30 20)"/><path d="M13 21 L20 36 L27 21z" fill="#EDE6D6" stroke="#8A7A60" stroke-width="1.2" stroke-linejoin="round"/><path d="M16 28 h8" stroke="#B3261E" stroke-width="2.2"/><g stroke="#7A0F35" stroke-width="1"><circle cx="14" cy="17" r="4.5" fill="#C2185B"/><circle cx="26" cy="17" r="4.5" fill="#C2185B"/><circle cx="20" cy="12" r="5" fill="#D81B60"/></g><g fill="none" stroke="#7A0F35" stroke-width="0.9"><path d="M20 10 a2 2 0 1 1 -2 2"/><path d="M14 15.5 a1.6 1.6 0 1 1 -1.6 1.6"/><path d="M26 15.5 a1.6 1.6 0 1 1 -1.6 1.6"/></g></g>`,
    toneelkijker: `<g><path d="M31 30 L36 38" stroke="#C9A227" stroke-width="2.2" stroke-linecap="round"/><rect x="6" y="11" width="12" height="15" rx="3.5" fill="#F1E7D6" stroke="#7A5A1C" stroke-width="1.2"/><rect x="22" y="11" width="12" height="15" rx="3.5" fill="#F1E7D6" stroke="#7A5A1C" stroke-width="1.2"/><rect x="17.5" y="14" width="5" height="6" rx="1" fill="#C9A227" stroke="#7A5A1C" stroke-width="0.8"/><path d="M6.5 16 h11 M22.5 16 h11" stroke="#C9A227" stroke-width="1.6"/><circle cx="12" cy="28" r="5" fill="#3B4E6B" stroke="#C9A227" stroke-width="1.8"/><circle cx="28" cy="28" r="5" fill="#3B4E6B" stroke="#C9A227" stroke-width="1.8"/><path d="M9.8 26.6 a2.6 2.6 0 0 1 2.6 -2 M25.8 26.6 a2.6 2.6 0 0 1 2.6 -2" fill="none" stroke="#DCEBF0" stroke-width="1"/></g>`,
    // — het graf van nefer-ankh —
    canope:    `<g><path d="M12 16 h16 v12 q0 6 -8 6 q-8 0 -8 -6z" fill="#E3D3B0" stroke="#7A5A1C" stroke-width="1.3"/><path d="M12.4 21 h15.2 M12.4 25 h15.2" stroke="#1F4E79" stroke-width="1.2"/><rect x="11" y="14" width="18" height="3" rx="1" fill="#C9A227" stroke="#7A5A1C" stroke-width="1"/><path d="M15.5 9 L17 2.5 L19 8z M24.5 9 L23 2.5 L21 8z" fill="#2C2C2C"/><path d="M15 14 q0 -6 5 -6 q5 0 5 6z" fill="#2C2C2C" stroke="#111" stroke-width="1"/><path d="M20 10.5 l7 1.8 l-6 1.2z" fill="#2C2C2C"/><circle cx="21" cy="10.4" r="0.8" fill="#E0B95A"/></g>`,
    olielamp:  `<g><path d="M9 24 q-5 -4 0 -7" fill="none" stroke="#7A3E1C" stroke-width="2"/><path d="M8 26 q12 -12 22 -2 l6 -2 q-2 6 -8 6 h-16 q-4 0 -4 -2z" fill="#C8743A" stroke="#7A3E1C" stroke-width="1.3" stroke-linejoin="round"/><ellipse cx="19" cy="21.5" rx="3" ry="1.2" fill="#3B2A1B"/><path d="M35 21 q-3 -5 1 -10 q3 5 -1 10z" fill="#F39C12" stroke="#B3261E" stroke-width="0.8"/><path d="M12 27 h16" stroke="#F0B98A" stroke-width="1" opacity="0.7"/></g>`,
    kameel:    `<g><path d="M11 24 v10 M15 24 v10 M24 24 v10 M28 24 v10" stroke="#7A4A1C" stroke-width="2" stroke-linecap="round"/><path d="M7 22 q0 -5 5 -6 q3 -6 7 -1 q3 -7 8 -1 q4 1 4 6 q0 3 -3 3 h-18 q-3 0 -3 -1z" fill="#D9A36F" stroke="#7A4A1C" stroke-width="1.2" stroke-linejoin="round"/><path d="M30 20 q3 -2 3 -8 q0 -3 3 -3 q3 0 3 2 l-1 1 h-2 q-1 4 -1 8 q0 3 -3 3z" fill="#D9A36F" stroke="#7A4A1C" stroke-width="1.2" stroke-linejoin="round"/><path d="M14 17.5 h11 v3.5 h-11z" fill="#B3261E" opacity="0.85"/><path d="M14 21 h11" stroke="#F2C14E" stroke-width="1"/><circle cx="36.5" cy="10.5" r="0.7" fill="#3B2A1B"/></g>`,
    papyrus:   `<g><rect x="9" y="12" width="22" height="16" fill="#EDE0B8" stroke="#8A7A60" stroke-width="1.2"/><rect x="5" y="10" width="5" height="20" rx="2.5" fill="#D9C38A" stroke="#7A5A1C" stroke-width="1.2"/><rect x="30" y="10" width="5" height="20" rx="2.5" fill="#D9C38A" stroke="#7A5A1C" stroke-width="1.2"/><g stroke="#1F4E79" stroke-width="1" fill="none"><circle cx="14.5" cy="17" r="1.6"/><path d="M19 14.5 v5 M21 14.5 q2 2.5 0 5 M25 15.5 l2 2.5 l-2 2.5 M13 23.5 h4 M20 22 l1 3 l1 -3 M24.5 23.5 h3"/></g></g>`,
    zeef:      `<g><path d="M6 33 q14 -7 28 0z" fill="#E3C58E" stroke="#B8955C" stroke-width="1"/><path d="M10 21 v11 M29 25 v7" stroke="#7A5236" stroke-width="1.8" stroke-linecap="round"/><path d="M7 14 l26 6 l-2 8 l-26 -6z" fill="#F3EDE3" stroke="#7A5236" stroke-width="2" stroke-linejoin="round"/><path d="M9.5 17.5 l20.5 4.7 M8.5 20.5 l20.5 4.7 M13 15.4 l-2 7.6 M18 16.5 l-2 7.6 M23 17.7 l-2 7.6 M28 18.8 l-2 7.6" stroke="#8A7A60" stroke-width="0.6"/></g>`,
    // — casino azur —
    roulette:  `<g><circle cx="20" cy="20" r="15" fill="#5A3A1E" stroke="#3B2A1B" stroke-width="1.3"/><circle cx="20" cy="20" r="10.5" fill="none" stroke="#B3261E" stroke-width="4"/><circle cx="20" cy="20" r="10.5" fill="none" stroke="#1A1108" stroke-width="4" stroke-dasharray="3.3 3.3"/><circle cx="20" cy="20" r="7.5" fill="#2E7D32" stroke="#3B2A1B" stroke-width="0.8"/><path d="M20 13 v14 M13 20 h14" stroke="#C9A227" stroke-width="1.6"/><circle cx="20" cy="20" r="2.2" fill="#E0B95A" stroke="#7A5A1C" stroke-width="0.8"/><circle cx="28.5" cy="13.5" r="1.4" fill="#FFFFFF" stroke="#8A97A3" stroke-width="0.5"/></g>`,
    fiches:    `<g><path d="M6 16 v15 a7 2.5 0 0 0 14 0 v-15" fill="#B3261E" stroke="#3B2A1B" stroke-width="1.2"/><path d="M6 20.5 h14 M6 25 h14 M6 29.5 h14" stroke="#FAF5EF" stroke-width="1" stroke-dasharray="2 2"/><ellipse cx="13" cy="16" rx="7" ry="2.5" fill="#D9534F" stroke="#3B2A1B" stroke-width="1.2"/><path d="M20 24 v8 a7 2.5 0 0 0 14 0 v-8" fill="#1F4E79" stroke="#3B2A1B" stroke-width="1.2"/><path d="M20 28 h14" stroke="#FAF5EF" stroke-width="1" stroke-dasharray="2 2"/><ellipse cx="27" cy="24" rx="7" ry="2.5" fill="#2E6DA4" stroke="#3B2A1B" stroke-width="1.2"/><ellipse cx="27" cy="24" rx="3" ry="1" fill="none" stroke="#FAF5EF" stroke-width="0.8"/><ellipse cx="13" cy="16" rx="3" ry="1" fill="none" stroke="#FAF5EF" stroke-width="0.8"/></g>`,
    fruitautomaat: `<g><path d="M28 21 h4 v-11" fill="none" stroke="#8A97A3" stroke-width="1.8"/><circle cx="32" cy="9" r="2.4" fill="#B3261E" stroke="#7A2A1C" stroke-width="0.8"/><rect x="8" y="9" width="20" height="25" rx="3" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.3"/><path d="M8 13 q10 -8 20 0" fill="#B3261E" stroke="#7A5A1C" stroke-width="1.2"/><rect x="11" y="15" width="14" height="8" rx="1" fill="#FAF5EF" stroke="#3B2A1B" stroke-width="1"/><path d="M15.7 15 v8 M20.3 15 v8" stroke="#3B2A1B" stroke-width="0.8"/><circle cx="13.4" cy="19" r="1.5" fill="#B3261E"/><circle cx="18" cy="19" r="1.5" fill="#B3261E"/><path d="M21.4 17.4 l1.6 3.2 l1.6 -3.2z" fill="#2E7D32"/><rect x="11" y="27" width="14" height="4" rx="1" fill="#3B2A1B"/></g>`,
    champagnetoren: `<g><rect x="3" y="34.5" width="34" height="2.5" rx="1" fill="#C9A227" stroke="#7A5A1C" stroke-width="0.9"/><path d="M5.5 29 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M10 31.2 v3.3 M7.8 34.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><path d="M15.5 29 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M20 31.2 v3.3 M17.8 34.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><path d="M25.5 29 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M30 31.2 v3.3 M27.8 34.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><path d="M10.5 21 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M15 23.2 v3.3 M12.8 26.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><path d="M20.5 21 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M25 23.2 v3.3 M22.8 26.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><path d="M15.5 13 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M20 15.2 v3.3 M17.8 18.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><g fill="#FAF5EF" stroke="#C9A227" stroke-width="0.5"><circle cx="20" cy="8" r="1.1"/><circle cx="23" cy="5" r="0.8"/><circle cx="17.5" cy="4.5" r="0.7"/></g></g>`,
    shaker:    `<g><path d="M14 14 h12 l-2 20 h-8z" fill="#BFC9D4" stroke="#5A6470" stroke-width="1.3" stroke-linejoin="round"/><path d="M15 14 q5 -4 10 0" fill="#BFC9D4" stroke="#5A6470" stroke-width="1.2"/><rect x="18.5" y="7" width="3" height="4" rx="1" fill="#BFC9D4" stroke="#5A6470" stroke-width="1"/><path d="M14.6 19 h10.8" stroke="#5A6470" stroke-width="1"/><path d="M17 21 v10" stroke="#FFFFFF" stroke-width="1.4" opacity="0.8"/><path d="M27 22 h10 l-5 5z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M32 27 v6 M29.5 33 h5" stroke="#7A5A1C" stroke-width="1"/><circle cx="33" cy="23.6" r="1" fill="#2E7D32"/></g>`,
    // — paradise pictures —
    filmcamera: `<g><path d="M14 30 L10 38 M20 30 v8 M26 30 L30 38" stroke="#3B2A1B" stroke-width="1.6" stroke-linecap="round"/><rect x="9" y="18" width="20" height="12" rx="2" fill="#2C2C2C" stroke="#111" stroke-width="1.2"/><path d="M29 21 l6 -2 v10 l-6 -2z" fill="#4A4A4A" stroke="#111" stroke-width="1"/><circle cx="14" cy="12" r="5.5" fill="#4A4A4A" stroke="#111" stroke-width="1.2"/><circle cx="25" cy="12" r="5.5" fill="#4A4A4A" stroke="#111" stroke-width="1.2"/><circle cx="14" cy="12" r="1.6" fill="#BFC9D4"/><circle cx="25" cy="12" r="1.6" fill="#BFC9D4"/><circle cx="35.5" cy="24" r="2" fill="#BFC9D4" stroke="#111" stroke-width="0.8"/></g>`,
    schijnwerper: `<g><path d="M17 24 v9 M11 37 L17 33 L23 37" stroke="#3B2A1B" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M28 13 L38 7 V27 L28 21z" fill="#F5E6B8" opacity="0.75"/><rect x="7" y="10" width="19" height="14" rx="3" fill="#8A97A3" stroke="#3B2A1B" stroke-width="1.2"/><path d="M10 13 v8 M13 13 v8" stroke="#5A6470" stroke-width="1"/><circle cx="25" cy="17" r="4.2" fill="#F5D67A" stroke="#7A5A1C" stroke-width="1"/></g>`,
    regiestoel: `<g><path d="M10 36 L28 22 M28 36 L10 22" stroke="#7A5236" stroke-width="2.2" stroke-linecap="round"/><path d="M10 6 v16 M28 6 v16" stroke="#7A5236" stroke-width="2"/><rect x="10" y="8" width="18" height="7" fill="#B3261E" stroke="#7A2A1C" stroke-width="1"/><rect x="9" y="20" width="20" height="3.5" fill="#B3261E" stroke="#7A2A1C" stroke-width="1"/><path d="M13 11.5 h12" stroke="#F2C14E" stroke-width="1"/></g>`,
    klapbord:  `<g><rect x="7" y="16" width="26" height="18" rx="1.5" fill="#2C2C2C" stroke="#111" stroke-width="1.2"/><path d="M10 22 h20 M10 27 h20" stroke="#FAF5EF" stroke-width="0.8"/><path d="M7 15 L32 8 L33.5 13 L8.5 20z" fill="#FAF5EF" stroke="#111" stroke-width="1.1" stroke-linejoin="round"/><path d="M12 13.6 l2.5 4.5 M17.5 12.2 l2.5 4.5 M23 10.7 l2.5 4.5 M28.5 9.2 l2.5 4.5" stroke="#111" stroke-width="2"/></g>`,
    filmspoel: `<g><path d="M26 25 q6 4 11 2 v6 q-6 2 -12 -2z" fill="#2C2C2C"/><path d="M28 28.5 h1.5 M31.5 29.7 h1.5 M35 30 h1.5" stroke="#FAF5EF" stroke-width="1"/><circle cx="17" cy="18" r="12" fill="#8A97A3" stroke="#3B2A1B" stroke-width="1.3"/><g fill="#FAF5EF" stroke="#3B2A1B" stroke-width="0.8"><circle cx="17" cy="10.5" r="3"/><circle cx="24" cy="15.5" r="3"/><circle cx="21.5" cy="24" r="3"/><circle cx="12.5" cy="24" r="3"/><circle cx="10" cy="15.5" r="3"/></g><circle cx="17" cy="18" r="2.5" fill="#3B2A1B"/></g>`,
    // — karavanserai al-nour —
    tapijt:    `<g><rect x="5" y="13" width="30" height="15" rx="2" fill="#B3261E" stroke="#5A1A12" stroke-width="1.2"/><path d="M9 13 v15 M31 13 v15" stroke="#F2C14E" stroke-width="1.6"/><path d="M14 20.5 l3 -4 l3 4 l-3 4z M20 20.5 l3 -4 l3 4 l-3 4z" fill="#1F4E79"/><path d="M5 28 v3 M8 28 v3 M32 28 v3 M35 28 v3 M5 10 v3 M8 10 v3 M32 10 v3 M35 10 v3" stroke="#F2C14E" stroke-width="1"/></g>`,
    specerijen: `<g><path d="M6 24 h28 l-3 10 h-22z" fill="#C7A06A" stroke="#7A5236" stroke-width="1.2"/><path d="M8 28 h24" stroke="#7A5236" stroke-width="0.8"/><path d="M9 24 q4 -10 8 0z" fill="#E8A33C" stroke="#9C6B1E" stroke-width="0.9"/><path d="M16 24 q4 -12 8 0z" fill="#B3261E" stroke="#6A1C14" stroke-width="0.9"/><path d="M23 24 q4 -9 8 0z" fill="#E3C14A" stroke="#9C7A1E" stroke-width="0.9"/></g>`,
    kruik:     `<g><path d="M15 8 h10 l-1 4 q7 4 7 13 q0 9 -11 9 q-11 0 -11 -9 q0 -9 7 -13z" fill="#C8743A" stroke="#7A3E1C" stroke-width="1.3" stroke-linejoin="round"/><path d="M11 22 h18" stroke="#F2C14E" stroke-width="1.4"/><path d="M12.5 26 h15" stroke="#1F4E79" stroke-width="1"/><ellipse cx="20" cy="8" rx="5" ry="1.4" fill="#7A3E1C"/></g>`,
    zadel:     `<g><path d="M6 26 q14 -10 28 0 v4 h-28z" fill="#7A5236" stroke="#3B2A1B" stroke-width="1.2"/><path d="M10 26 v-10 M30 26 v-10" stroke="#C9A227" stroke-width="2.2" stroke-linecap="round"/><circle cx="10" cy="15" r="2" fill="#C9A227"/><circle cx="30" cy="15" r="2" fill="#C9A227"/><path d="M6 30 h28 v3 h-28z" fill="#B3261E" stroke="#5A1A12" stroke-width="1"/><path d="M9 33 v3 M14 33 v3 M19 33 v3 M24 33 v3 M29 33 v3" stroke="#F2C14E" stroke-width="1"/></g>`,
    weegschaal: `<g><path d="M20 8 v24 M12 34 h16" stroke="#9C7A1E" stroke-width="2" stroke-linecap="round"/><path d="M8 12 h24" stroke="#C9A227" stroke-width="2"/><circle cx="20" cy="8" r="2" fill="#C9A227"/><path d="M8 12 l-4 10 M8 12 l4 10 M32 12 l-4 10 M32 12 l4 10" stroke="#9C7A1E" stroke-width="0.8"/><path d="M3 22 q5 4 10 0z M27 22 q5 4 10 0z" fill="#E0B95A" stroke="#9C7A1E" stroke-width="1"/></g>`,
    // — de abdij van sint-aldric —
    lessenaar: `<g><path d="M10 36 l3 -16 M30 36 l-3 -16" stroke="#7A5236" stroke-width="2.2" stroke-linecap="round"/><path d="M6 20 L34 14 L35 18 L7 24z" fill="#8B6A46" stroke="#3B2A1B" stroke-width="1.2" stroke-linejoin="round"/><path d="M10 18.5 L20 16.4 L21 10 L11 12z" fill="#FAF5EF" stroke="#8A7A60" stroke-width="0.9"/><path d="M20 16.4 L30 14.3 L29 8 L21 10z" fill="#F3EDE3" stroke="#8A7A60" stroke-width="0.9"/><path d="M28 9 q4 -6 6 -7" stroke="#3B2A1B" stroke-width="1" fill="none"/></g>`,
    kandelaar: `<g><path d="M14 36 h12 M20 36 v-20" stroke="#4A4A4A" stroke-width="2.2" stroke-linecap="round"/><path d="M15 36 q5 -6 10 0" fill="none" stroke="#4A4A4A" stroke-width="1.6"/><rect x="16" y="14" width="8" height="3" rx="1" fill="#4A4A4A"/><rect x="17.5" y="6" width="5" height="8" fill="#F3EDE3" stroke="#8A7A60" stroke-width="0.9"/><path d="M20 6 q-2 -3 0 -5 q2 2 0 5z" fill="#F39C12"/></g>`,
    bijenkorf: `<g><path d="M8 32 q0 -24 12 -24 q12 0 12 24z" fill="#D9B45A" stroke="#7A5A1C" stroke-width="1.3"/><path d="M9 26 h22 M10.5 20 h19 M13.5 14 h13" stroke="#9C7A1E" stroke-width="1.2"/><path d="M17 32 q3 -5 6 0z" fill="#3B2A1B"/><rect x="5" y="32" width="30" height="3" rx="1" fill="#7A5236"/><g fill="#F2C14E" stroke="#3B2A1B" stroke-width="0.6"><ellipse cx="33" cy="12" rx="2" ry="1.4"/><ellipse cx="6" cy="16" rx="2" ry="1.4"/></g></g>`,
    vijzel:    `<g><path d="M24 6 L16 22" stroke="#7A5236" stroke-width="3" stroke-linecap="round"/><path d="M8 20 h24 q-1 12 -12 12 q-11 0 -12 -12z" fill="#BFC9D4" stroke="#5A6470" stroke-width="1.3"/><path d="M14 32 h12 v3 h-12z" fill="#8A97A3" stroke="#5A6470" stroke-width="1"/><g fill="#5C8B5E"><path d="M11 20 q1 -4 4 -4 q0 3 -4 4z"/><path d="M29 20 q-1 -4 -4 -4 q0 3 4 4z"/></g></g>`,
    zandloper: `<g><path d="M13 8 h14 q0 6 -7 11 q-7 -5 -7 -11z M13 32 h14 q0 -6 -7 -11 q-7 5 -7 11z" fill="#DCEBF0" opacity="0.85"/><path d="M14.5 12 h11 q-1 4 -5.5 7 q-4.5 -3 -5.5 -7z M14 32 q6 -8 12 0z" fill="#E3C58E"/><path d="M12 8 q0 7 7 12 q-7 5 -7 12 M28 8 q0 7 -7 12 q7 5 7 12" fill="none" stroke="#7A5236" stroke-width="1.4"/><rect x="10" y="5" width="20" height="3" rx="1" fill="#7A5236" stroke="#3B2A1B" stroke-width="1"/><rect x="10" y="32" width="20" height="3" rx="1" fill="#7A5236" stroke="#3B2A1B" stroke-width="1"/></g>`,
    // — vuurtoren grauwkaap —
    boei:      `<g><circle cx="20" cy="20" r="14.5" fill="none" stroke="#C9A227" stroke-width="0.9" stroke-dasharray="2 2"/><path d="M20 7 a13 13 0 1 0 0.01 0z M20 13.5 a6.5 6.5 0 1 1 -0.01 0z" fill-rule="evenodd" fill="#FAF5EF"/><circle cx="20" cy="20" r="9.75" fill="none" stroke="#B3261E" stroke-width="6.5" stroke-dasharray="7.66 7.66"/><circle cx="20" cy="20" r="13" fill="none" stroke="#3B2A1B" stroke-width="1.3"/><circle cx="20" cy="20" r="6.5" fill="none" stroke="#3B2A1B" stroke-width="1.3"/></g>`,
    fuik:      `<g><path d="M5 30 V20 q15 -14 30 0 V30z" fill="#C7A06A" stroke="#7A5236" stroke-width="1.3"/><path d="M10 30 V16 M15 30 V12.5 M20 30 V11 M25 30 V12.5 M30 30 V16 M5 25 h30" stroke="#7A5236" stroke-width="1"/><rect x="4" y="30" width="32" height="3" rx="1" fill="#7A5236"/><path d="M30 22 q4 -4 7 -2 M31 25 q4 -2 6 0" stroke="#B3261E" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`,
    misthoorn: `<g><path d="M14 22 v12 M10 36 h12" stroke="#3B2A1B" stroke-width="1.8" stroke-linecap="round"/><path d="M8 18 L30 10 V30 L8 22z" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.3" stroke-linejoin="round"/><ellipse cx="30" cy="20" rx="3.5" ry="10" fill="#E0B95A" stroke="#7A5A1C" stroke-width="1.2"/><rect x="4" y="17" width="5" height="6" rx="1" fill="#7A5236" stroke="#3B2A1B" stroke-width="1"/></g>`,
    stormlamp: `<g><path d="M15 9 q5 -5 10 0" fill="none" stroke="#3B2A1B" stroke-width="1.6"/><rect x="13" y="9" width="14" height="4" rx="1" fill="#B3261E" stroke="#5A1A12" stroke-width="1"/><path d="M14 13 q-3 9 0 16 h12 q3 -7 0 -16z" fill="#F5E6B8" stroke="#3B2A1B" stroke-width="1.2"/><path d="M20 18 q-3 4 0 8 q3 -4 0 -8z" fill="#F39C12"/><path d="M14 13 v16 M26 13 v16" stroke="#B3261E" stroke-width="1.6"/><rect x="12" y="29" width="16" height="5" rx="1.5" fill="#B3261E" stroke="#5A1A12" stroke-width="1"/></g>`,
    verrekijker: `<g><path d="M8 36 L18 24 M28 36 L18 24 M18 24 v12" stroke="#7A5236" stroke-width="1.6" stroke-linecap="round"/><path d="M6 20 L32 10 L34 15 L8 25z" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.2" stroke-linejoin="round"/><path d="M14 17.2 L15.6 21.8 M24 13.4 L25.6 18" stroke="#7A5A1C" stroke-width="1.4"/><circle cx="33" cy="12.5" r="2.4" fill="#DCEBF0" stroke="#7A5A1C" stroke-width="1"/></g>`,
    kweekbak:  `<g><rect x="8" y="22" width="24" height="9" rx="1.5" fill="#8A97A3"/><rect x="10" y="20" width="20" height="3" fill="#6B4423"/><g fill="#3F9D5C"><path d="M13 20 q-2-7 3-8 q1 5-3 8z"/><path d="M19 20 q-1-8 3-9 q2 6-3 9z"/><path d="M25 20 q0-7 4-7 q0 5-4 7z"/></g><rect x="8" y="28" width="24" height="1.5" fill="#6FE3FF" opacity="0.8"/></g>`
  };

  // Slachtoffer: krijtomtrek op de vloer
  function victim() {
    return clean(`<svg viewBox="0 0 40 40" class="av av-victim" aria-hidden="true" focusable="false">
      <g fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="13" cy="12" r="4.2"/>
        <path d="M17 15 L27 22 L24 27 L29 33"/>
        <path d="M17 15 L12 24 L8 33"/>
        <path d="M17 15 L23 11 M12 24 L5 20"/>
      </g>
      <g fill="none" stroke="#1A1108" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round" opacity="0.7">
        <circle cx="13" cy="12" r="4.2"/>
        <path d="M17 15 L27 22 L24 27 L29 33"/>
        <path d="M17 15 L12 24 L8 33"/>
        <path d="M17 15 L23 11 M12 24 L5 20"/>
      </g>
      <ellipse cx="30" cy="12" rx="3.4" ry="2.4" fill="#B3261E" opacity="0.85"/>
    </svg>`);
  }

  function furniture(type) {
    const g = FURN[type] || FURN.doos;
    return clean(`<svg viewBox="0 0 40 40" class="av av-furn" aria-hidden="true" focusable="false">${g}</svg>`);
  }

  // ── Dispatcher ──────────────────────────────────────────────
  function tile(catType, item, index) {
    if (catType === 'suspect')  return suspect(item, index);
    if (catType === 'location') return location(item, index);
    return weapon(item, index);
  }

  return { tile, suspect, location, weapon, furniture, victim, shade };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = { Avatars };
