// ============================================================
// MAPART — platte vector-illustraties voor de wereldkaart, in de
// stijl van de portretten en meubels (donkere omlijning, pastel-
// vlakken, papier). Per wereld: een banner (393×200), decoratie-
// figuurtjes langs het pad en een vloerpatroon.
// ============================================================

const MapArt = (() => {
  const INK = '#1A1108';
  const clean = s => s.replace(/>\s+</g, '><').trim();
  const svg = (vb, body, cls = '') => clean(`<svg viewBox="${vb}" class="mapart ${cls}" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMax slice">${body}</svg>`);

  // ── Hulpjes ────────────────────────────────────────────────
  const stars = (pts, fill = '#F5E6B8') => pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');
  const win = (x, y, w, h, lit = true) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="${lit ? '#F0CE8E' : '#7B5E3B'}" stroke="${INK}" stroke-width="1"/>`;
  const tree = (x, y, s = 1, c = '#6B8E5A') => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-3" y="0" width="6" height="22" fill="#6B4423" stroke="${INK}" stroke-width="1.2"/><circle cx="0" cy="-8" r="16" fill="${c}" stroke="${INK}" stroke-width="1.5"/><circle cx="-9" cy="-2" r="10" fill="${c}" stroke="${INK}" stroke-width="1.5"/><circle cx="9" cy="-2" r="10" fill="${c}" stroke="${INK}" stroke-width="1.5"/><circle cx="0" cy="-8" r="16" fill="${c}"/><circle cx="-6" cy="-10" r="4" fill="rgba(255,255,255,0.25)"/></g>`;
  const cloud = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#FBF6EC" stroke="${INK}" stroke-width="1.2"><circle cx="0" cy="0" r="9"/><circle cx="11" cy="-3" r="11"/><circle cx="23" cy="1" r="8"/><rect x="-2" y="2" width="27" height="7" rx="3" stroke="none"/></g>`;

  // ── Banners ────────────────────────────────────────────────
  const BANNERS = {
    landhuis: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#E9D8C4"/>
      <circle cx="322" cy="46" r="20" fill="#F5E6B8" stroke="${INK}" stroke-width="1.5"/>
      <circle cx="314" cy="40" r="4" fill="#E9D8C4" opacity="0.7"/>
      ${stars([[40, 30, 1.6], [90, 58, 1.2], [140, 24, 1.4], [260, 22, 1.2], [370, 80, 1.4], [200, 40, 1]], '#FBF6EC')}
      ${cloud(30, 70, 0.9)}${cloud(240, 60, 0.7)}
      <rect x="0" y="146" width="393" height="54" fill="#BFD8B0"/>
      <rect x="0" y="144" width="393" height="4" fill="#8FAE7C"/>
      <path d="M0 146 h393" stroke="${INK}" stroke-width="1.5"/>
      <!-- hagen -->
      <g fill="#8FAE7C" stroke="${INK}" stroke-width="1.3">
        <rect x="18" y="128" width="70" height="20" rx="8"/><rect x="305" y="128" width="70" height="20" rx="8"/>
      </g>
      <!-- landhuis -->
      <g stroke="${INK}" stroke-width="1.5">
        <rect x="104" y="96" width="60" height="52" fill="#7B5E3B"/>
        <rect x="229" y="96" width="60" height="52" fill="#7B5E3B"/>
        <rect x="150" y="74" width="93" height="74" fill="#8B6A46"/>
        <path d="M100 98 L134 72 L168 98 Z" fill="#5A3E2B"/>
        <path d="M225 98 L259 72 L293 98 Z" fill="#5A3E2B"/>
        <rect x="146" y="70" width="101" height="6" fill="#5A3E2B"/>
        <rect x="181" y="34" width="31" height="42" fill="#8B6A46"/>
        <path d="M177 36 L196.5 12 L216 36 Z" fill="#8B2E1C"/>
        <rect x="194" y="6" width="5" height="8" fill="#B8955C" stroke="none"/>
      </g>
      ${win(112, 108, 10, 14)}${win(132, 108, 10, 14)}${win(112, 128, 10, 14, false)}${win(132, 128, 10, 14)}
      ${win(238, 108, 10, 14)}${win(258, 108, 10, 14, false)}${win(238, 128, 10, 14)}${win(258, 128, 10, 14)}
      ${win(160, 86, 11, 15)}${win(180, 86, 11, 15)}${win(202, 86, 11, 15, false)}${win(222, 86, 11, 15)}
      ${win(160, 110, 11, 15, false)}${win(222, 110, 11, 15)}${win(190, 46, 12, 12)}
      <rect x="187" y="118" width="20" height="30" rx="10" fill="#3E2A1D" stroke="${INK}" stroke-width="1.5"/>
      <rect x="187" y="134" width="20" height="14" fill="#3E2A1D"/>
      <circle cx="203" cy="136" r="1.5" fill="#B8955C"/>
      <!-- pad en fontein -->
      <path d="M197 148 C 197 165, 150 170, 150 200 L 244 200 C 244 170, 197 165, 197 148 Z" fill="#E8DDC8" stroke="${INK}" stroke-width="1.3"/>
      <g stroke="${INK}" stroke-width="1.3"><ellipse cx="72" cy="180" rx="24" ry="9" fill="#9FC8C8"/><rect x="66" y="160" width="12" height="20" fill="#D6C3A5"/><ellipse cx="72" cy="160" rx="14" ry="5" fill="#9FC8C8"/><path d="M72 150 v10" stroke-width="2"/></g>
      ${tree(340, 178, 1.05)}${tree(24, 182, 0.8, '#7FA06B')}${tree(300, 186, 0.7, '#7FA06B')}
    `, 'banner-landhuis'),

    piraten: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#F3E4C9"/>
      <circle cx="70" cy="48" r="22" fill="#F5D07A" stroke="${INK}" stroke-width="1.5"/>
      ${cloud(250, 40, 0.8)}${cloud(120, 62, 0.6)}
      <g fill="none" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"><path d="M300 70 q5 -6 10 0 q5 -6 10 0"/><path d="M335 88 q4 -5 8 0 q4 -5 8 0"/></g>
      <!-- zee -->
      <rect x="0" y="130" width="393" height="70" fill="#7FA8B8"/>
      <path d="M0 130 h393" stroke="${INK}" stroke-width="1.5"/>
      <g fill="none" stroke="#DCEBF0" stroke-width="2.2" stroke-linecap="round">
        <path d="M10 150 q10 -6 20 0 q10 -6 20 0"/><path d="M300 158 q10 -6 20 0 q10 -6 20 0"/><path d="M60 178 q10 -6 20 0 q10 -6 20 0"/><path d="M250 186 q10 -6 20 0 q10 -6 20 0"/><path d="M340 176 q10 -6 20 0"/>
      </g>
      <!-- schip -->
      <g stroke="${INK}" stroke-width="1.5">
        <path d="M118 140 L128 168 L270 168 L292 140 Z" fill="#5A3E2B"/>
        <path d="M118 140 h174" stroke-width="2"/>
        <path d="M128 154 h140" stroke="#3E2A1D" stroke-width="1"/>
        <rect x="170" y="52" width="4" height="90" fill="#3E2A1D"/>
        <rect x="236" y="70" width="4" height="72" fill="#3E2A1D"/>
        <path d="M172 58 L172 122 L124 122 Q160 100 172 58 Z" fill="#F3EDE3"/>
        <path d="M172 58 L172 122 L222 122 Q186 100 172 58 Z" fill="#F3EDE3"/>
        <path d="M238 76 L238 124 L206 124 Q228 106 238 76 Z" fill="#F3EDE3"/>
        <path d="M238 76 L238 124 L272 124 Q250 106 238 76 Z" fill="#F3EDE3"/>
        <path d="M172 44 L200 50 L172 58 Z" fill="#1A1108"/>
        <circle cx="181" cy="51" r="2.2" fill="#F3EDE3" stroke="none"/>
        <path d="M292 140 q14 -10 12 -26" fill="none" stroke-width="2.5"/>
      </g>
      <g fill="#F0CE8E" stroke="${INK}" stroke-width="1"><circle cx="150" cy="156" r="3"/><circle cx="180" cy="156" r="3"/><circle cx="210" cy="156" r="3"/><circle cx="240" cy="156" r="3"/></g>
    `, 'banner-piraten'),

    hotel: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#F4E6E2"/>
      ${stars([[40, 28, 1.6], [110, 18, 1.2], [300, 26, 1.6], [350, 54, 1.2], [200, 14, 1.2]], '#E3B7B0')}
      <!-- gevel -->
      <g stroke="${INK}" stroke-width="1.5">
        <rect x="60" y="40" width="273" height="160" fill="#F0E2D8"/>
        <rect x="60" y="34" width="273" height="8" fill="#C0797F"/>
        <rect x="150" y="14" width="93" height="26" fill="#F0E2D8"/>
        <rect x="150" y="10" width="93" height="6" fill="#C0797F"/>
        <g fill="#E3B7B0"><rect x="72" y="56" width="10" height="144"/><rect x="311" y="56" width="10" height="144"/><rect x="186" y="56" width="6" height="144"/><rect x="201" y="56" width="6" height="144"/></g>
        <rect x="150" y="160" width="93" height="40" fill="#8B2E1C"/>
        <rect x="150" y="150" width="93" height="12" fill="#B9707A"/>
      </g>
      <g stroke="${INK}" stroke-width="1"><path d="M150 150 h93" stroke-width="1.5"/><g fill="#FBF6EC"><rect x="150" y="150" width="11" height="12"/><rect x="172" y="150" width="11" height="12"/><rect x="194" y="150" width="11" height="12"/><rect x="216" y="150" width="11" height="12"/><rect x="238" y="150" width="5" height="12"/></g></g>
      <g stroke="${INK}" stroke-width="1"><rect x="170" y="166" width="22" height="34" fill="#F0CE8E"/><rect x="201" y="166" width="22" height="34" fill="#F0CE8E"/><path d="M196.5 166 v34" stroke-width="1.5"/></g>
      ${[0, 1, 2].map(r => [92, 118, 144, 218, 244, 270].map(x => win(x, 64 + r * 28, 14, 18, (x + r) % 3 !== 1)).join('')).join('')}
      ${win(160, 62, 14, 18)}${win(220, 62, 14, 18)}${win(190, 62, 14, 18, false)}
      ${win(160, 90, 14, 18, false)}${win(190, 90, 14, 18)}${win(220, 90, 14, 18)}
      ${win(160, 118, 14, 18)}${win(190, 118, 14, 18)}${win(220, 118, 14, 18, false)}
      <text x="196.5" y="32" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="13" font-weight="700" letter-spacing="3" fill="#8B2E1C">AURORA</text>
      <g stroke="${INK}" stroke-width="1.3"><rect x="34" y="150" width="4" height="50" fill="#3E2A1D"/><circle cx="36" cy="146" r="7" fill="#F0CE8E"/><rect x="355" y="150" width="4" height="50" fill="#3E2A1D"/><circle cx="357" cy="146" r="7" fill="#F0CE8E"/></g>
    `, 'banner-hotel'),

    ruimte: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#2E3A52"/>
      ${stars([[20, 30, 1.4], [60, 120, 1], [90, 40, 1.8], [130, 150, 1.2], [180, 20, 1.2], [240, 170, 1.6], [280, 30, 1.2], [330, 140, 1], [360, 40, 1.8], [380, 100, 1.2], [150, 90, 1], [300, 90, 1.4]], '#F3EDE3')}
      <g><circle cx="330" cy="58" r="26" fill="#C7BEE3" stroke="${INK}" stroke-width="1.5"/><ellipse cx="330" cy="60" rx="40" ry="8" fill="none" stroke="#E3C58E" stroke-width="3"/><circle cx="320" cy="50" r="5" fill="#B0A6D6"/></g>
      <path d="M40 150 L90 110" stroke="#F3EDE3" stroke-width="2" stroke-linecap="round" opacity="0.8"/><circle cx="92" cy="108" r="3.5" fill="#F3EDE3"/>
      <!-- station -->
      <g stroke="${INK}" stroke-width="1.5">
        <rect x="60" y="118" width="80" height="26" rx="3" fill="#4A6B8A"/><rect x="253" y="118" width="80" height="26" rx="3" fill="#4A6B8A"/>
        <g stroke="#9DB7D6" stroke-width="1"><path d="M80 118 v26 M100 118 v26 M120 118 v26 M273 118 v26 M293 118 v26 M313 118 v26 M60 131 h80 M253 131 h80"/></g>
        <rect x="140" y="128" width="113" height="6" fill="#8A97A3"/>
        <rect x="156" y="104" width="81" height="54" rx="14" fill="#DDE6EE"/>
        <rect x="170" y="116" width="16" height="12" rx="3" fill="#6FE3FF"/><rect x="190" y="116" width="16" height="12" rx="3" fill="#6FE3FF"/><rect x="210" y="116" width="16" height="12" rx="3" fill="#6FE3FF"/>
        <rect x="186" y="80" width="4" height="24" fill="#8A97A3"/><circle cx="188" cy="78" r="4" fill="#E74C3C"/>
        <path d="M156 131 h81" stroke="#8A97A3" stroke-width="2"/>
        <circle cx="196" cy="145" r="4" fill="#5FC9C9"/>
      </g>
      <rect x="0" y="188" width="393" height="12" fill="#1E2A3A"/>
    `, 'banner-ruimte'),

    museum: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#2B3A45"/>
      ${stars([[30, 24, 1.6], [80, 50, 1.2], [140, 18, 1.4], [250, 30, 1.2], [330, 22, 1.6], [370, 70, 1.2], [200, 44, 1]], '#F3EDE3')}
      <circle cx="60" cy="60" r="16" fill="#F5E6B8" stroke="${INK}" stroke-width="1.5"/>
      <!-- trappen -->
      <g stroke="${INK}" stroke-width="1.3"><rect x="60" y="176" width="273" height="8" fill="#D0C9BD"/><rect x="72" y="168" width="249" height="8" fill="#DAD3C7"/><rect x="84" y="160" width="225" height="8" fill="#E5E1DA"/></g>
      <rect x="0" y="184" width="393" height="16" fill="#1E2A33"/>
      <!-- gevel met zuilen en fronton -->
      <g stroke="${INK}" stroke-width="1.5">
        <rect x="96" y="70" width="201" height="90" fill="#E5E1DA"/>
        <path d="M86 70 L196.5 28 L307 70 Z" fill="#EFEBE3"/>
        <rect x="84" y="66" width="225" height="8" fill="#D0C9BD"/>
        <g fill="#F3EDE3">${[108, 140, 172, 221, 253, 285].map(x => `<rect x="${x - 6}" y="78" width="12" height="82"/><rect x="${x - 9}" y="74" width="18" height="5" rx="1"/><rect x="${x - 9}" y="156" width="18" height="5" rx="1"/>`).join('')}</g>
        <rect x="182" y="104" width="29" height="56" rx="2" fill="#2F6F6D"/>
        <rect x="186" y="108" width="21" height="24" fill="#F0CE8E"/>
        <path d="M196.5 104 v56" stroke-width="1"/>
      </g>
      <circle cx="196.5" cy="50" r="7" fill="#D4A64A" stroke="${INK}" stroke-width="1.3"/>
      <text x="196.5" y="93" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="11" font-weight="700" letter-spacing="4" fill="#2F6F6D">MUSEUM</text>
      <!-- spandoek dino -->
      <g stroke="${INK}" stroke-width="1.2"><rect x="318" y="84" width="60" height="76" rx="2" fill="#D4A64A"/><path d="M328 140 q8-22 22-20 q10 1 16-8 l3 2 q-4 10-14 12 q-8 4-16 10 l-1 6 h-4z" fill="#F3EDE3"/><circle cx="367" cy="110" r="4" fill="#F3EDE3"/></g>
      <g stroke="${INK}" stroke-width="1.3"><rect x="34" y="150" width="4" height="34" fill="#3E2A1D"/><circle cx="36" cy="146" r="6" fill="#F0CE8E"/></g>
    `, 'banner-museum'),

    trein: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#1F2E3A"/>
      ${stars([[20, 26, 1.4], [70, 14, 1.2], [120, 40, 1.6], [180, 18, 1], [260, 30, 1.4], [340, 16, 1.6], [372, 48, 1.2]], '#F3EDE3')}
      <circle cx="318" cy="48" r="20" fill="#F5E6B8" stroke="${INK}" stroke-width="1.5"/>
      <!-- bergen -->
      <path d="M0 150 L60 92 L110 130 L160 84 L220 138 L280 96 L330 132 L393 90 L393 156 L0 156 Z" fill="#33475A" stroke="${INK}" stroke-width="1.3"/>
      <path d="M60 92 l-10 14 h20 z M160 84 l-11 16 h22 z M280 96 l-10 14 h20 z" fill="#F3EDE3"/>
      <!-- tunnel -->
      <path d="M330 156 v-40 q30-30 63-8 v48 z" fill="#0F1A22" stroke="${INK}" stroke-width="1.5"/>
      <!-- rails -->
      <rect x="0" y="156" width="393" height="44" fill="#3E2A1D"/>
      <g stroke="#6B4423" stroke-width="3">${Array.from({ length: 20 }, (_, i) => `<path d="M${i * 20 + 6} 160 v36"/>`).join('')}</g>
      <path d="M0 166 h393 M0 190 h393" stroke="#BFC9D4" stroke-width="2.5"/>
      <!-- trein -->
      <g stroke="${INK}" stroke-width="1.5">
        <rect x="20" y="118" width="120" height="44" rx="4" fill="#1F4E3D"/>
        <rect x="150" y="118" width="120" height="44" rx="4" fill="#1F4E3D"/>
        <rect x="20" y="126" width="250" height="6" fill="#C9A227" stroke="none"/>
        <g fill="#F0CE8E">${[34, 56, 78, 100, 122, 164, 186, 208, 230, 252].map(x => `<rect x="${x}" y="134" width="14" height="14" rx="2"/>`).join('')}</g>
        <rect x="280" y="112" width="70" height="50" rx="4" fill="#2C3E50"/>
        <rect x="292" y="96" width="26" height="18" rx="3" fill="#2C3E50"/>
        <rect x="326" y="98" width="10" height="16" fill="#1A1108"/>
        <circle cx="343" cy="136" r="8" fill="#F5D67A"/>
        <g fill="#F3EDE3" opacity="0.9" stroke="none"><circle cx="331" cy="86" r="6"/><circle cx="322" cy="76" r="8"/><circle cx="308" cy="68" r="7"/><circle cx="292" cy="62" r="5"/></g>
        <g fill="#2C3E50">${[40, 70, 100, 130, 170, 200, 230, 260, 295, 335].map(x => `<circle cx="${x}" cy="164" r="7"/>`).join('')}</g>
        <g fill="#BFC9D4" stroke="none">${[40, 70, 100, 130, 170, 200, 230, 260, 295, 335].map(x => `<circle cx="${x}" cy="164" r="2.5"/>`).join('')}</g>
      </g>
    `, 'banner-trein'),

    circus: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#2E2A4A"/>
      ${stars([[30, 30, 1.6], [90, 18, 1.2], [150, 40, 1.4], [260, 22, 1.2], [340, 36, 1.6], [370, 90, 1.2]], '#F3EDE3')}
      <!-- lichtsnoer -->
      <path d="M0 40 q98 40 196 10 q98-30 197 30" fill="none" stroke="#1A1108" stroke-width="1.5"/>
      <g fill="#F5D67A" stroke="${INK}" stroke-width="1">${[20, 60, 100, 140, 180, 220, 260, 300, 340, 380].map((x, i) => `<circle cx="${x}" cy="${[46, 58, 62, 58, 48, 38, 36, 40, 50, 62][i]}" r="4"/>`).join('')}</g>
      <!-- grond -->
      <rect x="0" y="160" width="393" height="40" fill="#5C8B5E"/><path d="M0 160 h393" stroke="${INK}" stroke-width="1.5"/>
      <!-- tent -->
      <g stroke="${INK}" stroke-width="1.5">
        <path d="M70 160 L100 96 L292 96 L322 160 Z" fill="#B3261E"/>
        <g fill="#F3EDE3" stroke="none">${[0, 1, 2, 3].map(i => `<path d="M${100 + 24 + i * 48} 96 h24 l ${6} 64 h-36 z"/>`).join('')}</g>
        <path d="M100 96 L196 40 L292 96 Z" fill="#B3261E"/>
        <g fill="#F3EDE3" stroke="none"><path d="M124 96 L196 40 L172 96 Z"/><path d="M220 96 L196 40 L268 96 Z"/></g>
        <path d="M100 96 L196 40 L292 96" fill="none"/>
        <rect x="194" y="22" width="4" height="20" fill="#3E2A1D"/>
        <path d="M198 24 L222 30 L198 36 Z" fill="#F5D67A"/>
        <path d="M100 96 q48 14 96 0 q48 14 96 0" fill="none" stroke-width="1.5"/>
        <path d="M180 160 v-40 q16-14 32 0 v40 z" fill="#1A1108"/>
        <g fill="#F5D67A" stroke="none"><path d="M100 96 l-6 10 M292 96 l6 10"/></g>
      </g>
      <!-- vlaggetjes -->
      <path d="M60 80 q68 20 136 0 q68 20 137 0" fill="none" stroke="${INK}" stroke-width="1.2"/>
      <g stroke="${INK}" stroke-width="0.8">${[70, 100, 130, 160, 190, 220, 250, 280, 310].map((x, i) => `<path d="M${x} ${82 + (i % 2) * 6} l5 10 l5-10 z" fill="${i % 2 ? '#F5D67A' : '#DCEBF0'}"/>`).join('')}</g>
      <g stroke="${INK}" stroke-width="1.3"><rect x="20" y="130" width="28" height="30" rx="3" fill="#F0CE8E"/><rect x="26" y="126" width="16" height="6" rx="2" fill="#B3261E"/><rect x="28" y="138" width="12" height="10" fill="#DCEBF0"/></g>
      <g stroke="${INK}" stroke-width="1.3"><circle cx="352" cy="128" r="10" fill="#E8A5D2"/><path d="M352 138 v22" stroke-width="1.2"/><circle cx="338" cy="140" r="8" fill="#5FC9C9"/><path d="M338 148 v12" stroke-width="1.2"/></g>
    `, 'banner-circus'),

    skihut: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#27364A"/>
      ${stars([[20, 30, 1.4], [70, 14, 1.2], [130, 44, 1.6], [190, 20, 1], [250, 36, 1.4], [330, 18, 1.6], [372, 52, 1.2]], '#F3EDE3')}
      <circle cx="320" cy="46" r="20" fill="#F5E6B8" stroke="${INK}" stroke-width="1.5"/>
      <!-- bergen -->
      <path d="M0 140 L70 60 L120 110 L180 50 L250 120 L300 70 L393 150 L393 200 L0 200 Z" fill="#3E5A6E" stroke="${INK}" stroke-width="1.3"/>
      <path d="M70 60 l-14 18 h28 z M180 50 l-16 20 h32 z M300 70 l-12 16 h24 z" fill="#F3EDE3"/>
      <!-- sneeuwvlakte -->
      <path d="M0 150 q100-30 200 0 q100 30 193-10 v60 h-393 z" fill="#EEF3F7" stroke="${INK}" stroke-width="1.3"/>
      <!-- hut -->
      <g stroke="${INK}" stroke-width="1.5">
        <rect x="140" y="112" width="112" height="56" fill="#7A5236"/>
        <g stroke="#5C3D28" stroke-width="1"><path d="M140 124 h112 M140 136 h112 M140 148 h112 M140 160 h112"/></g>
        <path d="M128 114 L196 68 L264 114 Z" fill="#F3EDE3"/>
        <path d="M134 110 L196 70 L258 110" fill="none" stroke-width="2"/>
        <rect x="218" y="78" width="10" height="20" fill="#5C3D28"/>
        ${win(152, 124, 18, 16)}${win(222, 124, 18, 16)}${win(186, 136, 20, 32, false)}
        <rect x="186" y="136" width="20" height="32" fill="#3E2A1D"/><circle cx="202" cy="153" r="1.6" fill="#F0CE8E"/>
        <g fill="#F3EDE3" opacity="0.9" stroke="none"><circle cx="228" cy="70" r="5"/><circle cx="234" cy="62" r="6"/><circle cx="242" cy="55" r="5"/></g>
      </g>
      <!-- dennen en sneeuwpop -->
      <g stroke="${INK}" stroke-width="1.3">${[40, 70, 330, 360].map((x, i) => `<path d="M${x} ${150 - (i % 2) * 8} l-14 30 h28 z" fill="#2F6F4E"/><path d="M${x} ${132 - (i % 2) * 8} l-10 22 h20 z" fill="#3E8A65"/><rect x="${x - 3}" y="${178 - (i % 2) * 8}" width="6" height="8" fill="#5C3D28"/>`).join('')}</g>
      <g stroke="${INK}" stroke-width="1.3"><circle cx="100" cy="176" r="12" fill="#FBF6EC"/><circle cx="100" cy="158" r="8" fill="#FBF6EC"/><circle cx="98" cy="156" r="1" fill="${INK}"/><circle cx="103" cy="156" r="1" fill="${INK}"/><path d="M101 159 l5 1 l-5 1 z" fill="#F39C12"/><path d="M88 172 l-8-6 M112 172 l8-6" stroke-width="1.6"/></g>
    `, 'banner-skihut')
  };

  // ── Decoraties langs het pad (40×40, zelfde stijl als de meubels) ──
  const PROPS = {
    landhuis: [
      `<g>${tree(20, 26, 0.75)}</g>`,
      `<g stroke="${INK}" stroke-width="1.3"><ellipse cx="20" cy="30" rx="15" ry="6" fill="#9FC8C8"/><rect x="16" y="16" width="8" height="14" fill="#D6C3A5"/><ellipse cx="20" cy="16" rx="9" ry="3.5" fill="#9FC8C8"/><path d="M20 8 v8" stroke-width="2"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="18" y="14" width="4" height="22" fill="#3E2A1D"/><rect x="13" y="6" width="14" height="10" rx="2" fill="#F0CE8E"/><path d="M12 36 h16" stroke-width="2"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="6" y="18" width="28" height="12" rx="6" fill="#8FAE7C"/><rect x="10" y="12" width="20" height="10" rx="5" fill="#7FA06B"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="8" y="20" width="24" height="5" rx="1" fill="#D6C3A5"/><rect x="8" y="14" width="24" height="5" rx="1" fill="#D6C3A5"/><path d="M11 25 v8 M29 25 v8" stroke-width="2"/></g>`,
      `<g>${tree(20, 28, 0.6, '#7FA06B')}</g>`,
      `<g stroke="${INK}" stroke-width="1.3"><circle cx="20" cy="18" r="9" fill="#F5E6B8"/><circle cx="17" cy="15" r="2" fill="#E9D8C4" stroke="none"/></g>`
    ],
    piraten: [
      `<g stroke="${INK}" stroke-width="1.3"><path d="M20 8 v24 M10 22 q10 14 20 0" fill="none" stroke-width="2.5"/><circle cx="20" cy="8" r="3" fill="none" stroke-width="2"/><path d="M12 14 h16" stroke-width="2.5"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><ellipse cx="20" cy="24" rx="12" ry="8" fill="#C9B48E"/><ellipse cx="20" cy="24" rx="8" ry="5" fill="#A88B6B"/><ellipse cx="20" cy="24" rx="4" ry="2.5" fill="#C9B48E"/></g>`,
      `<g fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"><path d="M6 22 q5 -6 10 0 q5 -6 10 0 q5 -6 10 0"/><path d="M10 30 q5 -6 10 0 q5 -6 10 0"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="10" y="12" width="20" height="20" rx="3" fill="#B59A7A"/><path d="M10 18 h20 M10 26 h20" stroke="#7B5E3B"/><path d="M14 12 v20 M26 12 v20" stroke="#7B5E3B"/></g>`,
      `<g fill="none" stroke="${INK}" stroke-width="1.5" stroke-linecap="round"><path d="M8 18 q4 -5 8 0"/><path d="M22 12 q4 -5 8 0"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="17" y="6" width="3" height="28" fill="#3E2A1D"/><path d="M20 8 L34 12 L20 18 Z" fill="#1A1108"/><circle cx="25" cy="12.5" r="1.6" fill="#F3EDE3" stroke="none"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="8" y="16" width="24" height="16" rx="2" fill="#8B6A46"/><path d="M8 22 h24" /><rect x="17" y="20" width="6" height="5" rx="1" fill="#F0CE8E"/><path d="M8 16 q12 -10 24 0" fill="#7B5E3B"/></g>`
    ],
    hotel: [
      `<g stroke="${INK}" stroke-width="1.3"><rect x="14" y="8" width="12" height="26" fill="#E3B7B0"/><rect x="10" y="6" width="20" height="4" rx="1" fill="#C0797F"/><rect x="10" y="32" width="20" height="4" rx="1" fill="#C0797F"/></g>`,
      `<g stroke="${INK}" stroke-width="1.2"><path d="M20 6 v8" stroke-width="2"/><path d="M8 20 q12 -14 24 0" fill="#F0CE8E"/><g fill="#F5E6B8"><circle cx="10" cy="22" r="2.5"/><circle cx="20" cy="26" r="2.5"/><circle cx="30" cy="22" r="2.5"/></g></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="7" y="16" width="26" height="12" rx="3" fill="#C99AA6"/><rect x="10" y="10" width="20" height="8" rx="3" fill="#D8AEB6"/><rect x="9" y="28" width="4" height="5" fill="#7B5E3B"/><rect x="27" y="28" width="4" height="5" fill="#7B5E3B"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><path d="M10 26 q10 -18 20 0 z" fill="#F0CE8E"/><rect x="8" y="26" width="24" height="4" rx="2" fill="#B8955C"/><circle cx="20" cy="9" r="2" fill="#B8955C"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="9" y="12" width="22" height="20" rx="3" fill="#8B6A46"/><rect x="15" y="8" width="10" height="5" rx="2" fill="#5A3E2B"/><path d="M9 20 h22" /><rect x="18" y="18" width="4" height="4" fill="#B8955C"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="4" y="14" width="32" height="14" rx="2" fill="#C99AA6"/><rect x="8" y="17" width="24" height="8" rx="1" fill="none" stroke="#F0E2D8"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="15" y="20" width="10" height="12" rx="2" fill="#D6C3A5"/><g fill="#3F9D5C"><path d="M20 20 q-12 -6 -10 -14 q10 2 10 14z"/><path d="M20 20 q12 -6 10 -14 q-10 2 -10 14z"/><path d="M20 20 q-2 -12 0 -16 q2 4 0 16z"/></g></g>`
    ],
    ruimte: [
      `<g><circle cx="20" cy="20" r="10" fill="#E3C58E" stroke="${INK}" stroke-width="1.3"/><ellipse cx="20" cy="21" rx="16" ry="3.5" fill="none" stroke="#5FC9C9" stroke-width="2"/></g>`,
      `<g fill="#F3EDE3"><circle cx="8" cy="10" r="1.6"/><circle cx="22" cy="6" r="1.2"/><circle cx="32" cy="16" r="1.8"/><circle cx="14" cy="26" r="1.2"/><circle cx="28" cy="30" r="1.5"/><path d="M20 14 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><path d="M8 20 q12 -14 24 0 z" fill="#DDE6EE"/><path d="M20 20 v10" stroke-width="2"/><rect x="14" y="30" width="12" height="4" rx="1" fill="#8A97A3"/><circle cx="20" cy="9" r="2" fill="#E74C3C"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="6" y="14" width="28" height="12" rx="6" fill="#DDE6EE"/><rect x="10" y="17" width="6" height="6" rx="1" fill="#6FE3FF"/><rect x="19" y="17" width="6" height="6" rx="1" fill="#6FE3FF"/><rect x="28" y="17" width="3" height="6" rx="1" fill="#8A97A3"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="4" y="12" width="14" height="16" fill="#4A6B8A"/><rect x="22" y="12" width="14" height="16" fill="#4A6B8A"/><g stroke="#9DB7D6" stroke-width="1"><path d="M4 20 h14 M22 20 h14 M11 12 v16 M29 12 v16"/></g><rect x="18" y="18" width="4" height="4" fill="#8A97A3"/></g>`,
      `<g><path d="M6 32 L28 12" stroke="#F3EDE3" stroke-width="2" stroke-linecap="round"/><circle cx="29" cy="11" r="3.5" fill="#F3EDE3" stroke="${INK}" stroke-width="1"/></g>`,
      `<g><circle cx="20" cy="20" r="8" fill="#B8D9A1" stroke="${INK}" stroke-width="1.3"/><path d="M14 18 q4 4 12 0 M16 24 q4 2 8 0" fill="none" stroke="#7FA06B" stroke-width="1.5"/></g>`
    ],
    museum: [
      `<g stroke="${INK}" stroke-width="1.3"><rect x="15" y="10" width="10" height="24" fill="#F3EDE3"/><rect x="11" y="7" width="18" height="4" rx="1" fill="#E5E1DA"/><rect x="11" y="33" width="18" height="4" rx="1" fill="#E5E1DA"/></g>`,
      `<g fill="#F3EDE3" stroke="#7B5E3B" stroke-width="1.1"><path d="M8 26 q6-10 14-8 q6 1 9-3 l2 1 q-2 5-7 5 q-5 3-11 6 l-1 5 h-3 l1-5 q-3 0-4-1z"/><circle cx="30" cy="14" r="3"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><path d="M14 10 h12 l2 6 q-2 4-2 10 l-1 6 h-10 l-1-6 q0-6-2-10z" fill="#D4A64A"/><path d="M14 18 h12" stroke="#7A5A1C"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="7" y="10" width="26" height="20" rx="1.5" fill="#C9A227"/><rect x="10" y="13" width="20" height="14" fill="#9DB7D6"/><path d="M10 27 L17 19 L21 23 L25 18 L30 27 z" fill="#5C8B5E"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="8" y="20" width="24" height="5" rx="1" fill="#D0C9BD"/><rect x="8" y="14" width="24" height="5" rx="1" fill="#D0C9BD"/><path d="M11 25 v8 M29 25 v8" stroke-width="2"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="18" y="14" width="4" height="22" fill="#3E2A1D"/><rect x="13" y="6" width="14" height="10" rx="2" fill="#F0CE8E"/></g>`,
      `<g stroke="${INK}" stroke-width="1.2"><rect x="12" y="26" width="16" height="7" rx="1" fill="#D0C9BD"/><ellipse cx="20" cy="14" rx="4.5" ry="5" fill="#F3EDE3"/><path d="M13 26 q1-6 7-6 q6 0 7 6z" fill="#F3EDE3"/></g>`
    ],
    trein: [
      `<g stroke="${INK}" stroke-width="1.3"><rect x="18" y="8" width="4" height="26" fill="#3E2A1D"/><circle cx="20" cy="10" r="5" fill="#E74C3C"/><circle cx="20" cy="20" r="5" fill="#2ECC71"/><rect x="12" y="34" width="16" height="3" rx="1" fill="#3E2A1D"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="4" y="16" width="32" height="4" fill="#3E2A1D"/><rect x="4" y="24" width="32" height="4" fill="#3E2A1D"/><g stroke="#BFC9D4" stroke-width="2.5"><path d="M8 14 v16 M16 14 v16 M24 14 v16 M32 14 v16"/></g></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="8" y="14" width="24" height="18" rx="2.5" fill="#7A5236"/><rect x="15" y="10" width="10" height="5" rx="2" fill="none" stroke-width="2"/><rect x="18" y="20" width="4" height="5" rx="1" fill="#C9A227"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="14" y="12" width="12" height="16" rx="2" fill="#F5D67A"/><rect x="16" y="8" width="8" height="4" rx="1" fill="#4A4A4A"/><rect x="15" y="28" width="10" height="3" rx="1" fill="#4A4A4A"/><ellipse cx="20" cy="20" rx="2.4" ry="3.4" fill="#F39C12"/></g>`,
      `<g fill="#2C3E50" stroke="${INK}" stroke-width="1"><circle cx="14" cy="26" r="5"/><circle cx="22" cy="22" r="6"/><circle cx="28" cy="28" r="5"/><circle cx="20" cy="30" r="4"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="8" y="14" width="24" height="12" rx="2" fill="#F0CE8E"/><path d="M14 14 v12 M26 14 v12" stroke-dasharray="2 2"/><circle cx="20" cy="20" r="2" fill="#8B2E1C" stroke="none"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><path d="M20 6 L30 24 H10 Z" fill="#33475A"/><path d="M20 14 L27 30 H13 Z" fill="#3E5A6E"/><rect x="18" y="30" width="4" height="5" fill="#3E2A1D"/></g>`
    ],
    circus: [
      `<g stroke="${INK}" stroke-width="1.3"><ellipse cx="20" cy="16" rx="9" ry="11" fill="#B3261E"/><path d="M20 27 q-2 4 0 8" fill="none"/><ellipse cx="17" cy="12" rx="2.5" ry="4" fill="rgba(255,255,255,0.35)" stroke="none"/></g>`,
      `<g stroke="${INK}" stroke-width="1.2"><path d="M4 12 h32" stroke-width="1.6"/>${[6, 14, 22, 30].map((x, i) => `<path d="M${x} 12 l4 9 l4-9 z" fill="${i % 2 ? '#F5D67A' : '#B3261E'}"/>`).join('')}</g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="12" y="16" width="16" height="16" rx="2" fill="#B3261E"/><path d="M15 16 v16 M20 16 v16 M25 16 v16" stroke="#F3EDE3"/><g fill="#F5D67A"><circle cx="15" cy="12" r="2.2"/><circle cx="20" cy="10" r="2.2"/><circle cx="25" cy="12" r="2.2"/></g></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><path d="M20 6 l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#F5D67A"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="9" y="14" width="22" height="14" rx="3" fill="#B3261E"/><ellipse cx="20" cy="14" rx="11" ry="4" fill="#F3EDE3"/><ellipse cx="20" cy="28" rx="11" ry="4" fill="#8B1E17"/><path d="M12 12 l-4-6 M28 12 l4-6" stroke-width="1.6"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="8" y="12" width="24" height="14" rx="2" fill="#F0CE8E"/><path d="M14 12 v14 M26 12 v14" stroke-dasharray="2 2"/><circle cx="20" cy="19" r="2.2" fill="#B3261E" stroke="none"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><circle cx="20" cy="20" r="9" fill="#F39C12"/><circle cx="20" cy="20" r="4" fill="#F5D67A"/><path d="M20 11 v18 M11 20 h18" stroke="#B3261E" stroke-width="1.6"/></g>`
    ],
    skihut: [
      `<g stroke="${INK}" stroke-width="1.3"><path d="M20 6 l-12 26 h24 z" fill="#2F6F4E"/><path d="M20 4 l-8 16 h16 z" fill="#3E8A65"/><rect x="18" y="32" width="4" height="5" fill="#5C3D28"/><path d="M14 20 q6 3 12 0" stroke="#F3EDE3" stroke-width="2"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><circle cx="20" cy="27" r="8" fill="#FBF6EC"/><circle cx="20" cy="15" r="6" fill="#FBF6EC"/><circle cx="18" cy="14" r="0.8" fill="${INK}"/><circle cx="22" cy="14" r="0.8" fill="${INK}"/><path d="M21 16 l4 1 l-4 1z" fill="#F39C12"/><rect x="15" y="7" width="10" height="3" fill="#2C3E50"/><rect x="17" y="3" width="6" height="5" fill="#2C3E50"/></g>`,
      `<g stroke-width="2.6" stroke-linecap="round"><path d="M12 32 L16 6" stroke="#B3261E"/><path d="M24 32 L28 6" stroke="#2C3E50"/></g><g stroke="${INK}" stroke-width="1.2"><path d="M12 10 h4 M24 10 h4"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="8" y="16" width="24" height="8" rx="2" fill="#7A5236"/><path d="M6 30 q0-4 4-4 h20 q4 0 6-4" fill="none" stroke="#8A97A3" stroke-width="2.2" stroke-linecap="round"/></g>`,
      `<g fill="none" stroke="#DCEBF0" stroke-width="2" stroke-linecap="round"><path d="M20 6 v28 M8 13 l24 14 M8 27 l24-14"/><path d="M20 6 l-3 4 M20 6 l3 4 M20 34 l-3-4 M20 34 l3-4"/></g><g fill="none" stroke="${INK}" stroke-width="0.6" stroke-linecap="round"><path d="M20 6 v28 M8 13 l24 14 M8 27 l24-14"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="14" y="12" width="12" height="16" rx="2" fill="#F5D67A"/><rect x="16" y="8" width="8" height="4" rx="1" fill="#4A4A4A"/><rect x="15" y="28" width="10" height="3" rx="1" fill="#4A4A4A"/><ellipse cx="20" cy="20" rx="2.4" ry="3.4" fill="#F39C12"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><rect x="18" y="10" width="4" height="26" fill="#5C3D28"/><path d="M22 12 h12 l3 4 l-3 4 h-12 z" fill="#F0CE8E"/><path d="M18 22 h-12 l-3 4 l3 4 h12 z" fill="#DCEBF0"/></g>`
    ]
  };

  function banner(themeId) { return (BANNERS[themeId] || BANNERS.landhuis)(); }
  function prop(themeId, i) {
    const list = PROPS[themeId] || PROPS.landhuis;
    return clean(`<svg viewBox="0 0 40 40" class="mapprop" aria-hidden="true" focusable="false">${list[((i % list.length) + list.length) % list.length]}</svg>`);
  }
  function propCount(themeId) { return (PROPS[themeId] || PROPS.landhuis).length; }

  return { banner, prop, propCount };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = { MapArt };
