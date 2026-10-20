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
    `, 'banner-skihut'),

    hacienda: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#F2C98A"/>
      <circle cx="318" cy="70" r="26" fill="#F7E2A6" stroke="${INK}" stroke-width="1.5"/>
      <path d="M0 124 q60 -30 120 -8 q70 -34 150 -6 q60 -22 123 4 V200 H0 z" fill="#C98B5A" stroke="${INK}" stroke-width="1.3"/>
      <!-- papel picado -->
      <path d="M0 14 q98 22 196 0 q98 22 197 0" fill="none" stroke="${INK}" stroke-width="1.2"/>
      <g stroke="${INK}" stroke-width="0.9">${[...Array(16)].map((_, i) => { const x = 10 + i * 24.4, t = (x % 196) / 196, y = 14 + 44 * t * (1 - t); return `<path d="M${(x - 6).toFixed(1)} ${y.toFixed(1)} h12 v12 l-3 -2 l-3 2 l-3 -2 l-3 2 z" fill="${['#E84393', '#2E9CCA', '#F39C12', '#3FAE6A'][i % 4]}"/>`; }).join('')}</g>
      <!-- hacienda met klokkentoren -->
      <g stroke="${INK}" stroke-width="1.5">
        <rect x="112" y="112" width="190" height="56" fill="#F3EDE3"/>
        <path d="M104 114 L122 98 H292 L310 114 Z" fill="#B5552E"/>
        <g stroke="#8A3A1E" stroke-width="1"><path d="M126 106 h162 M118 110 h178"/></g>
        ${[0, 1, 2, 3, 4].map(i => `<path d="M${128 + i * 34} 168 v-24 a12 12 0 0 1 24 0 v24 z" fill="#7A4A2E"/>`).join('')}
        <rect x="70" y="88" width="42" height="80" fill="#F3EDE3"/>
        <path d="M70 90 q21 -38 42 0 z" fill="#F3EDE3"/>
        <path d="M82 116 v-12 a9 9 0 0 1 18 0 v12 z" fill="#3E2A1D"/>
        <path d="M86 114 q0 -9 5 -9 q5 0 5 9 z" fill="#C9A227"/>
        <path d="M91 46 v14 M86 51 h10" stroke-width="2"/>
        <rect x="80" y="136" width="22" height="32" fill="#7A4A2E"/>
      </g>
      <rect x="0" y="168" width="393" height="32" fill="#D9A36F"/>
      <path d="M0 168 h393" stroke="${INK}" stroke-width="1.5"/>
      <!-- agaveveld -->
      ${[4, 34, 316, 348].map(x => `<g transform="translate(${x} 150)"><g><ellipse cx="20" cy="33" rx="11" ry="2.6" fill="#9C6B43"/><g fill="#6E9E8A" stroke="#2F5546" stroke-width="1.1" stroke-linejoin="round"><path d="M17 32 L3 22 L19 30z"/><path d="M23 32 L37 22 L21 30z"/><path d="M17 32 L7 10 L20 29z"/><path d="M23 32 L33 10 L20 29z"/><path d="M18 32 L20 4 L22 32z"/></g></g></g>`).join('')}
    `, 'banner-hacienda'),

    opera: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#3A1426"/>
      ${stars([[20, 26, 1.4], [62, 12, 1.2], [118, 34, 1.4], [272, 20, 1.2], [330, 40, 1.6], [372, 16, 1.2]], '#F3EDE3')}
      <circle cx="44" cy="54" r="14" fill="#F5E6B8" stroke="${INK}" stroke-width="1.3"/>
      <!-- gevel van de opera -->
      <g stroke="${INK}" stroke-width="1.5">
        <path d="M150 72 q46 -40 92 0 z" fill="#C9A227"/>
        <path d="M196 52 v-6" stroke-width="2"/><circle cx="196" cy="43" r="4" fill="#E0B95A"/>
        <rect x="102" y="72" width="188" height="18" fill="#E9D8B8"/>
        <path d="M102 72 h188" stroke="#C9A227" stroke-width="2.4"/>
        <rect x="92" y="90" width="208" height="40" fill="#E9D8B8"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<rect x="${100 + i * 23.5}" y="93" width="6" height="34" fill="#F3EDE3" stroke-width="1"/>`).join('')}
        ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${108 + i * 23.5} 122 v-14 a5.5 5.5 0 0 1 11 0 v14 z" fill="#F0CE8E" stroke-width="1"/>`).join('')}
        <rect x="86" y="130" width="220" height="38" fill="#D9C7A6"/>
        ${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${96 + i * 30} 168 v-22 a10 10 0 0 1 20 0 v22 z" fill="#F5D67A"/>`).join('')}
      </g>
      <rect x="0" y="168" width="393" height="32" fill="#5A2A3A"/>
      <path d="M0 168 h393" stroke="${INK}" stroke-width="1.5"/>
      <g stroke="${INK}" stroke-width="1.3"><path d="M150 168 h92 l14 32 h-120 z" fill="#B3261E"/><path d="M146 178 h100 M142 189 h108" stroke="#8B1E17"/></g>
      <!-- lantaarns -->
      ${[52, 340].map(x => `<g stroke="${INK}" stroke-width="1.3"><rect x="${x - 2}" y="128" width="4" height="40" fill="#2C2C2C"/><rect x="${x - 7}" y="114" width="14" height="16" rx="2" fill="#F5D67A"/><path d="M${x - 9} 114 h18 l-3 -5 h-12 z" fill="#2C2C2C"/></g>`).join('')}
    `, 'banner-opera'),

    opgraving: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#F0C07A"/>
      <circle cx="300" cy="78" r="30" fill="#F7E2A6" stroke="${INK}" stroke-width="1.5"/>
      <!-- rotsen van de vallei -->
      <path d="M0 120 L40 70 L90 88 L140 52 L200 78 L250 58 L300 96 L350 66 L393 90 V200 H0 Z" fill="#D9A36F" stroke="${INK}" stroke-width="1.3"/>
      <path d="M0 140 L60 108 L120 124 L180 100 L240 118 L310 104 L393 130 V200 H0 Z" fill="#C98B5A" stroke="${INK}" stroke-width="1.3"/>
      <!-- de ingang van het graf -->
      <g stroke="${INK}" stroke-width="1.5">
        <path d="M168 168 L176 118 H218 L226 168 Z" fill="#E3C58E"/>
        <path d="M182 168 L186 128 H208 L212 168 Z" fill="#3B2A1B"/>
        <path d="M184 152 h26 M183 160 h28" stroke="#7A5236" stroke-width="1.2"/>
        <rect x="172" y="112" width="50" height="7" fill="#1F4E79"/>
        <g fill="#E3C27A" stroke="none"><circle cx="182" cy="115.5" r="1.6"/><circle cx="197" cy="115.5" r="1.6"/><circle cx="212" cy="115.5" r="1.6"/></g>
      </g>
      <!-- tenten -->
      <g stroke="${INK}" stroke-width="1.4">
        <path d="M30 168 L56 128 L82 168 Z" fill="#F3EDE3"/><path d="M56 128 L56 168" stroke-width="1"/>
        <path d="M86 168 L104 140 L122 168 Z" fill="#E9D8C4"/>
      </g>
      <rect x="0" y="166" width="393" height="34" fill="#E3C58E"/>
      <path d="M0 166 h393" stroke="${INK}" stroke-width="1.5"/>
      <!-- palm en kameel -->
      <g stroke="${INK}" stroke-width="1.3"><path d="M352 168 q-4 -24 2 -48" fill="none" stroke="#7A5236" stroke-width="4"/>
        <path d="M354 120 q-16 -12 -30 0 q16 -4 30 0z M354 120 q16 -12 30 0 q-16 -4 -30 0z M354 120 q-8 -16 -22 -18 q12 8 22 18z M354 120 q8 -16 22 -18 q-12 8 -22 18z" fill="#5C8B5E"/></g>
      <g transform="translate(250 136)"><g><path d="M11 24 v10 M15 24 v10 M24 24 v10 M28 24 v10" stroke="#7A4A1C" stroke-width="2" stroke-linecap="round"/><path d="M7 22 q0 -5 5 -6 q3 -6 7 -1 q3 -7 8 -1 q4 1 4 6 q0 3 -3 3 h-18 q-3 0 -3 -1z" fill="#D9A36F" stroke="#7A4A1C" stroke-width="1.2" stroke-linejoin="round"/><path d="M30 20 q3 -2 3 -8 q0 -3 3 -3 q3 0 3 2 l-1 1 h-2 q-1 4 -1 8 q0 3 -3 3z" fill="#D9A36F" stroke="#7A4A1C" stroke-width="1.2" stroke-linejoin="round"/><path d="M14 17.5 h11 v3.5 h-11z" fill="#B3261E" opacity="0.85"/><path d="M14 21 h11" stroke="#F2C14E" stroke-width="1"/><circle cx="36.5" cy="10.5" r="0.7" fill="#3B2A1B"/></g></g>
    `, 'banner-opgraving'),

    casino: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#13233A"/>
      ${stars([[24, 22, 1.4], [70, 40, 1.2], [128, 16, 1.4], [270, 28, 1.2], [330, 14, 1.6], [370, 44, 1.2]], '#F3EDE3')}
      <circle cx="56" cy="62" r="13" fill="#F5E6B8" stroke="${INK}" stroke-width="1.3"/>
      <!-- de zee met een jacht -->
      <rect x="0" y="150" width="393" height="22" fill="#1F4E79"/>
      <g stroke="${INK}" stroke-width="1.2"><path d="M300 158 h52 l-8 8 h-38 z" fill="#FAF5EF"/><path d="M314 158 v-14 h18 v14" fill="#E9D8C4"/></g>
      <!-- het casino -->
      <g stroke="${INK}" stroke-width="1.5">
        <rect x="104" y="92" width="186" height="66" fill="#EBDDBE"/>
        <path d="M104 92 h186" stroke="#C9A227" stroke-width="2.6"/>
        <path d="M168 92 q29 -38 58 0 z" fill="#5E9C8A"/>
        <rect x="96" y="62" width="26" height="96" fill="#EBDDBE"/><path d="M96 62 q13 -20 26 0 z" fill="#5E9C8A"/>
        <rect x="272" y="62" width="26" height="96" fill="#EBDDBE"/><path d="M272 62 q13 -20 26 0 z" fill="#5E9C8A"/>
        ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${122 + i * 27} 150 v-30 a9 9 0 0 1 18 0 v30 z" fill="#F5D67A" stroke-width="1"/>`).join('')}
        <rect x="102" y="76" width="14" height="22" rx="7" fill="#F5D67A" stroke-width="1"/><rect x="278" y="76" width="14" height="22" rx="7" fill="#F5D67A" stroke-width="1"/>
      </g>
      <rect x="0" y="168" width="393" height="32" fill="#2A3340"/>
      <path d="M0 168 h393" stroke="${INK}" stroke-width="1.5"/>
      <path d="M0 184 h393" stroke="#F3EDE3" stroke-width="1.5" stroke-dasharray="10 8"/>
      <!-- palmen en een raceauto -->
      ${[40, 352].map(x => `<g stroke="${INK}" stroke-width="1.2"><path d="M${x} 168 q-3 -22 2 -42" fill="none" stroke="#7A5236" stroke-width="3.5"/><path d="M${x + 2} 126 q-14 -10 -26 0 q14 -3 26 0z M${x + 2} 126 q14 -10 26 0 q-14 -3 -26 0z M${x + 2} 126 q-7 -14 -19 -15 q10 7 19 15z M${x + 2} 126 q7 -14 19 -15 q-10 7 -19 15z" fill="#2F6F4E"/></g>`).join('')}
      <g transform="translate(180 154) scale(1.2)" stroke="${INK}" stroke-width="1.1"><path d="M4 26 q2 -6 8 -6 l6 -4 h6 l4 4 h6 q4 0 4 6z" fill="#B3261E"/><circle cx="11" cy="27" r="4" fill="#2C2C2C"/><circle cx="30" cy="27" r="4" fill="#2C2C2C"/><circle cx="21" cy="22" r="2.6" fill="#FAF5EF"/></g>
    `, 'banner-casino'),

    filmstudio: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#241E30"/>
      ${stars([[30, 20, 1.2], [90, 46, 1.4], [200, 18, 1.2], [300, 36, 1.4], [360, 16, 1.2]], '#F3EDE3')}
      <path d="M120 168 L60 0 H110 Z M270 168 L320 0 H270 Z" fill="#F5E6B8" opacity="0.18"/>
      <!-- studiohallen -->
      <g stroke="${INK}" stroke-width="1.5">
        <path d="M60 168 V104 q55 -36 110 0 V168 Z" fill="#D9C7A6"/><path d="M80 168 V128 h30 V168" fill="#7A5236"/>
        <path d="M220 168 V100 q60 -40 120 0 V168 Z" fill="#E3D3B0"/><path d="M262 168 V126 h36 V168" fill="#7A5236"/>
        <rect x="176" y="110" width="40" height="58" fill="#EBDDBE"/>
        <path d="M172 112 q24 -26 48 0" fill="none" stroke="#C9A227" stroke-width="3"/>
        <rect x="170" y="108" width="6" height="60" fill="#C9A227"/><rect x="216" y="108" width="6" height="60" fill="#C9A227"/>
        ${[0, 1, 2, 3].map(i => `<circle cx="${180 + i * 11}" cy="104" r="2.2" fill="#F5D67A" stroke-width="0.8"/>`).join('')}
      </g>
      <!-- watertoren -->
      <g stroke="${INK}" stroke-width="1.3"><path d="M352 168 L358 110 M378 168 L372 110 M354 140 h22" fill="none" stroke-width="2"/><rect x="350" y="86" width="30" height="26" rx="4" fill="#8A97A3"/><path d="M348 86 L365 74 L382 86 Z" fill="#5A6470"/></g>
      <rect x="0" y="168" width="393" height="32" fill="#3B3448"/><path d="M0 168 h393" stroke="${INK}" stroke-width="1.5"/>
      <g transform="translate(30 168) scale(1)" stroke="${INK}" stroke-width="1.2"><path d="M0 0 q-3 -22 2 -42" fill="none" stroke="#7A5236" stroke-width="3.5"/><path d="M2 -42 q-14 -10 -26 0 q14 -3 26 0z M2 -42 q14 -10 26 0 q-14 -3 -26 0z M2 -42 q-7 -14 -19 -15 q10 7 19 15z M2 -42 q7 -14 19 -15 q-10 7 -19 15z" fill="#2F6F4E"/></g>
    `, 'banner-filmstudio'),

    karavaan: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#F3B57A"/>
      <circle cx="96" cy="78" r="28" fill="#F7E2A6" stroke="${INK}" stroke-width="1.5"/>
      <path d="M0 140 q60 -30 130 -6 q70 -26 140 -2 q60 -18 123 6 V200 H0 Z" fill="#E3B26F" stroke="${INK}" stroke-width="1.3"/>
      <!-- de karavanserai -->
      <g stroke="${INK}" stroke-width="1.5">
        <rect x="150" y="104" width="190" height="64" fill="#E9D3A8"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<rect x="${152 + i * 19}" y="96" width="10" height="9" fill="#E9D3A8" stroke-width="1"/>`).join('')}
        <path d="M226 168 V134 a19 19 0 0 1 38 0 V168 Z" fill="#7A4A2E"/>
        <path d="M226 134 a19 19 0 0 1 38 0" fill="none" stroke="#0E6E73" stroke-width="3"/>
        ${[0, 1, 3, 4].map(i => `<path d="M${168 + i * 34} 124 v-8 a5 5 0 0 1 10 0 v8 z" fill="#3B2A1B" stroke-width="1"/>`).join('')}
        <rect x="138" y="84" width="20" height="84" fill="#E9D3A8"/><rect x="332" y="84" width="20" height="84" fill="#E9D3A8"/>
        <path d="M136 84 h24 M330 84 h24" stroke-width="2"/>
      </g>
      <rect x="0" y="168" width="393" height="32" fill="#D9A36F"/><path d="M0 168 h393" stroke="${INK}" stroke-width="1.5"/>
      <g transform="translate(110 168) scale(1)" stroke="${INK}" stroke-width="1.2"><path d="M0 0 q-3 -22 2 -42" fill="none" stroke="#7A5236" stroke-width="3.5"/><path d="M2 -42 q-14 -10 -26 0 q14 -3 26 0z M2 -42 q14 -10 26 0 q-14 -3 -26 0z M2 -42 q-7 -14 -19 -15 q10 7 19 15z M2 -42 q7 -14 19 -15 q-10 7 -19 15z" fill="#2F6F4E"/></g><g transform="translate(372 168) scale(0.85)" stroke="${INK}" stroke-width="1.2"><path d="M0 0 q-3 -22 2 -42" fill="none" stroke="#7A5236" stroke-width="3.5"/><path d="M2 -42 q-14 -10 -26 0 q14 -3 26 0z M2 -42 q14 -10 26 0 q-14 -3 -26 0z M2 -42 q-7 -14 -19 -15 q10 7 19 15z M2 -42 q7 -14 19 -15 q-10 7 -19 15z" fill="#2F6F4E"/></g>
    `, 'banner-karavaan'),

    abdij: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#C9D3D8"/>
      <path d="M0 120 L60 50 L110 96 L170 30 L240 100 L300 44 L393 110 V200 H0 Z" fill="#8A97A3" stroke="${INK}" stroke-width="1.3"/>
      <path d="M60 50 l-14 16 h28 z M170 30 l-17 20 h34 z M300 44 l-14 17 h28 z" fill="#F3EDE3"/>
      <!-- de abdij -->
      <g stroke="${INK}" stroke-width="1.5">
        <rect x="120" y="112" width="150" height="56" fill="#D0C9BD"/>
        <path d="M112 114 L195 82 L278 114 Z" fill="#5A4A3A"/>
        <rect x="236" y="62" width="30" height="106" fill="#D0C9BD"/><path d="M232 64 L251 34 L270 64 Z" fill="#5A4A3A"/>
        <path d="M244 88 v-10 a7 7 0 0 1 14 0 v10 z" fill="#3B2A1B"/><path d="M247 86 q0 -6 4 -6 q4 0 4 6 z" fill="#C9A227"/>
        ${[0, 1, 2, 3].map(i => `<path d="M${136 + i * 24} 150 v-18 a6 6 0 0 1 12 0 v18 z" fill="#F5D67A" stroke-width="1"/>`).join('')}
        <circle cx="195" cy="100" r="7" fill="#F5D67A" stroke-width="1"/>
        <path d="M188 168 V146 a7 7 0 0 1 14 0 V168 Z" fill="#7A5236"/>
      </g>
      <rect x="0" y="168" width="393" height="32" fill="#F3EDE3"/><path d="M0 168 h393" stroke="${INK}" stroke-width="1.5"/>
      <g stroke="${INK}" stroke-width="1.3">${[34, 70, 320, 356].map((x, i) => `<path d="M${x} ${150 - (i % 2) * 8} l-14 30 h28 z" fill="#3D4A2E"/><path d="M${x} ${132 - (i % 2) * 8} l-10 22 h20 z" fill="#4E5E3A"/>`).join('')}</g>
    `, 'banner-abdij'),

    vuurtoren: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#1E3247"/>
      <g stroke="#9DB7D6" stroke-width="1" opacity="0.45">${[20, 60, 100, 140, 300, 340, 380].map(x => `<path d="M${x} 10 l-10 40 M${x + 18} 60 l-10 40"/>`).join('')}</g>
      <path d="M214 50 L393 20 V82 Z" fill="#F5E6B8" opacity="0.28"/><path d="M186 50 L0 26 V80 Z" fill="#F5E6B8" opacity="0.18"/>
      <!-- rotsen en vuurtoren -->
      <path d="M120 168 q20 -40 60 -38 q50 -6 70 38 Z" fill="#5A6470" stroke="${INK}" stroke-width="1.3"/>
      <g stroke="${INK}" stroke-width="1.5">
        <path d="M188 136 L192 60 H208 L212 136 Z" fill="#FAF5EF"/>
        <path d="M190.3 112 L209.7 112 L210.6 124 L189.4 124 Z M191.4 86 L208.6 86 L209.3 98 L190.7 98 Z" fill="#B3261E" stroke-width="1"/>
        <rect x="186" y="46" width="28" height="14" rx="2" fill="#F5D67A"/>
        <path d="M184 46 L200 32 L216 46 Z" fill="#2C2C2C"/>
        <path d="M182 60 h36" stroke-width="2"/>
        <rect x="222" y="118" width="34" height="22" fill="#E9D8C4"/><path d="M218 120 L239 104 L260 120 Z" fill="#7A2A1C"/>
        <rect x="235" y="126" width="8" height="8" fill="#F5D67A" stroke-width="1"/>
      </g>
      <!-- golven -->
      <path d="M0 168 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V200 H0 Z" fill="#2A4D69" stroke="${INK}" stroke-width="1.3"/>
      <path d="M0 184 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#DCEBF0" stroke-width="1.5" opacity="0.7"/>
    `, 'banner-vuurtoren')
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
    ],
    hacienda: [
      `<g><ellipse cx="20" cy="33" rx="11" ry="2.6" fill="#9C6B43"/><g fill="#6E9E8A" stroke="#2F5546" stroke-width="1.1" stroke-linejoin="round"><path d="M17 32 L3 22 L19 30z"/><path d="M23 32 L37 22 L21 30z"/><path d="M17 32 L7 10 L20 29z"/><path d="M23 32 L33 10 L20 29z"/><path d="M18 32 L20 4 L22 32z"/></g></g>`,
      `<g><path d="M22 13 q9 -5 12 5 v12" fill="none" stroke="#9C5326" stroke-width="2.2" stroke-linecap="round"/><circle cx="17" cy="23" r="9" fill="#C8743A" stroke="#7A3E1C" stroke-width="1.4"/><path d="M11 17 q6 -9 12 0" fill="#D98B4E" stroke="#7A3E1C" stroke-width="1.3"/><rect x="15.5" y="9" width="3" height="4" fill="#7A3E1C"/><ellipse cx="13.5" cy="21" rx="2" ry="3.4" fill="#F0B98A" opacity="0.7"/><rect x="9" y="31" width="16" height="3" rx="1" fill="#3B2A1B"/><rect x="31" y="30" width="5" height="4" rx="1" fill="#7A5236" stroke="#3B2A1B" stroke-width="1"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><ellipse cx="20" cy="26" rx="16" ry="5" fill="#E3C58E"/><path d="M13 25 q1 -14 7 -14 q6 0 7 14 z" fill="#E3C58E"/><path d="M13.5 22 h13" stroke="#B3261E" stroke-width="2"/></g>`,
      `<g><path d="M22 19 L33 7" stroke="#5A3A1E" stroke-width="3" stroke-linecap="round"/><path d="M31 4 l4 -1 l1 4 l-3 2z" fill="#3B2A1B"/><g stroke="#7A4A1C" stroke-width="1.4"><ellipse cx="15" cy="27" rx="8" ry="7" fill="#D99A4E"/><ellipse cx="21" cy="20" rx="5.5" ry="5" fill="#D99A4E"/></g><ellipse cx="15" cy="27" rx="7.3" ry="6.3" fill="#D99A4E"/><ellipse cx="21" cy="20" rx="4.8" ry="4.3" fill="#D99A4E"/><circle cx="17" cy="24" r="2.4" fill="#3B2A1B"/><path d="M11 30 l4 -4" stroke="#5A3A1E" stroke-width="1.6"/></g>`,
      `<g stroke="${INK}" stroke-width="1"><path d="M2 10 q18 6 36 0" fill="none" stroke-width="1.4"/>${[[5, '#E84393'], [14, '#2E9CCA'], [23, '#F39C12'], [31, '#3FAE6A']].map(([x, c]) => `<path d="M${x} 12 h7 v11 l-1.75 -1.6 l-1.75 1.6 l-1.75 -1.6 l-1.75 1.6 z" fill="${c}"/>`).join('')}</g>`,
      `<g><path d="M20 0 v6" stroke="#3B2A1B" stroke-width="1.1"/><path d="M17.2 15.7 L20.0 6.0 L22.8 15.7z" fill="#E84393" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><path d="M23.2 15.9 L33.0 13.5 L26.0 20.8z" fill="#2E9CCA" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><path d="M26.0 21.2 L33.0 28.5 L23.2 26.1z" fill="#F39C12" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><path d="M22.8 26.3 L20.0 36.0 L17.2 26.3z" fill="#3FAE6A" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><path d="M16.8 26.1 L7.0 28.5 L14.0 21.2z" fill="#E84393" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><path d="M14.0 20.8 L7.0 13.5 L16.8 15.9z" fill="#2E9CCA" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><circle cx="20" cy="21" r="6.4" fill="#F2C14E" stroke="#7A5A1C" stroke-width="1.2"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><path d="M20 5 v5" stroke-width="2"/><path d="M12 28 q0 -18 8 -18 q8 0 8 18 z" fill="#C9A227"/><rect x="10" y="28" width="20" height="3" rx="1.5" fill="#B8955C"/><circle cx="20" cy="33" r="2.4" fill="#7A5A1C"/></g>`
    ],
    opera: [
      `<g><path d="M29 24 L34 37" stroke="#7A5236" stroke-width="1.8" stroke-linecap="round"/><path d="M29 12 q7 -9 4 -11 q-2 6 -6 9z" fill="#B3261E"/><path d="M6 16 Q20 8 34 16 Q33 26 25 25 Q20 22 15 25 Q7 26 6 16z" fill="#F2F0EA" stroke="#3B2A1B" stroke-width="1.3" stroke-linejoin="round"/><path d="M8 14.5 Q20 7.5 32 14.5" fill="none" stroke="#C9A227" stroke-width="1.5"/><ellipse cx="14" cy="18" rx="3.2" ry="2" fill="#3B2A1B"/><ellipse cx="26" cy="18" rx="3.2" ry="2" fill="#3B2A1B"/></g>`,
      `<g stroke="${INK}" stroke-width="1.2"><path d="M20 3 v8" stroke-width="1.6"/><path d="M8 17 q12 -10 24 0" fill="none" stroke="#C9A227" stroke-width="2.2"/><path d="M11 19 q9 8 18 0" fill="none" stroke="#C9A227" stroke-width="1.8"/>${[10, 16, 24, 30].map(x => `<path d="M${x} 17 v-4" stroke-width="1.4"/><circle cx="${x}" cy="11.5" r="1.6" fill="#F5D67A" stroke="none"/>`).join('')}<g fill="#DCEBF0" stroke-width="0.8"><path d="M14 24 l1.5 5 h-3 z"/><path d="M20 26 l1.5 6 h-3 z"/><path d="M26 24 l1.5 5 h-3 z"/></g></g>`,
      `<g><path d="M15 7.2 V33.2 M18.5 6.9 V29.5 M22 7.5 V25.8 M25.5 9.1 V22.1 M29 11.7 V18.4" stroke="#E8DCC8" stroke-width="0.9"/><path d="M11 8 Q22 2 33 15" fill="none" stroke="#C9A227" stroke-width="2.6" stroke-linecap="round"/><path d="M11 7 V34" stroke="#C9A227" stroke-width="3" stroke-linecap="round"/><path d="M33 15 L15 34" stroke="#7A5236" stroke-width="3.4" stroke-linecap="round"/><rect x="8" y="33" width="12" height="3" rx="1" fill="#7A5A1C"/><circle cx="11" cy="6" r="2" fill="#E0B95A" stroke="#7A5A1C" stroke-width="0.8"/></g>`,
      `<g><ellipse cx="10" cy="20" rx="3.2" ry="1.8" fill="#3F7D4E" transform="rotate(-30 10 20)"/><ellipse cx="30" cy="20" rx="3.2" ry="1.8" fill="#3F7D4E" transform="rotate(30 30 20)"/><path d="M13 21 L20 36 L27 21z" fill="#EDE6D6" stroke="#8A7A60" stroke-width="1.2" stroke-linejoin="round"/><path d="M16 28 h8" stroke="#B3261E" stroke-width="2.2"/><g stroke="#7A0F35" stroke-width="1"><circle cx="14" cy="17" r="4.5" fill="#C2185B"/><circle cx="26" cy="17" r="4.5" fill="#C2185B"/><circle cx="20" cy="12" r="5" fill="#D81B60"/></g><g fill="none" stroke="#7A0F35" stroke-width="0.9"><path d="M20 10 a2 2 0 1 1 -2 2"/><path d="M14 15.5 a1.6 1.6 0 1 1 -1.6 1.6"/><path d="M26 15.5 a1.6 1.6 0 1 1 -1.6 1.6"/></g></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><path d="M6 13 h28 v5 a2.5 2.5 0 0 0 0 5 v5 h-28 v-5 a2.5 2.5 0 0 0 0 -5 z" fill="#F0CE8E"/><path d="M14 13 v15" stroke-dasharray="2 2"/><path d="M23 17 l1.4 2.8 3 .4 -2.2 2.1 .5 3 -2.7 -1.4 -2.7 1.4 .5 -3 -2.2 -2.1 3 -.4 z" fill="#B3261E" stroke-width="0.8"/></g>`,
      `<g><path d="M31 30 L36 38" stroke="#C9A227" stroke-width="2.2" stroke-linecap="round"/><rect x="6" y="11" width="12" height="15" rx="3.5" fill="#F1E7D6" stroke="#7A5A1C" stroke-width="1.2"/><rect x="22" y="11" width="12" height="15" rx="3.5" fill="#F1E7D6" stroke="#7A5A1C" stroke-width="1.2"/><rect x="17.5" y="14" width="5" height="6" rx="1" fill="#C9A227" stroke="#7A5A1C" stroke-width="0.8"/><path d="M6.5 16 h11 M22.5 16 h11" stroke="#C9A227" stroke-width="1.6"/><circle cx="12" cy="28" r="5" fill="#3B4E6B" stroke="#C9A227" stroke-width="1.8"/><circle cx="28" cy="28" r="5" fill="#3B4E6B" stroke="#C9A227" stroke-width="1.8"/><path d="M9.8 26.6 a2.6 2.6 0 0 1 2.6 -2 M25.8 26.6 a2.6 2.6 0 0 1 2.6 -2" fill="none" stroke="#DCEBF0" stroke-width="1"/></g>`,
      `<g><path d="M20 27 v6 M14 36 L20 32 L26 36" stroke="#3B2A1B" stroke-width="1.8" fill="none" stroke-linecap="round"/><rect x="18" y="4" width="4" height="4" rx="1" fill="#7A5236"/><path d="M13 9 q7 -4 14 0 q2 6 -1.5 10 q2.5 4 2.5 9 h-16 q0 -5 2.5 -9 q-3.5 -4 -1.5 -10z" fill="#E8DCC8" stroke="#7A5A1C" stroke-width="1.3" stroke-linejoin="round"/><path d="M13.5 18 h13" stroke="#C62828" stroke-width="1.2"/><path d="M15 18 v1.6 M18 18 v1.6 M21 18 v1.6 M24 18 v1.6" stroke="#C62828" stroke-width="0.7"/></g>`
    ],
    opgraving: [
      `<g><path d="M12 16 h16 v12 q0 6 -8 6 q-8 0 -8 -6z" fill="#E3D3B0" stroke="#7A5A1C" stroke-width="1.3"/><path d="M12.4 21 h15.2 M12.4 25 h15.2" stroke="#1F4E79" stroke-width="1.2"/><rect x="11" y="14" width="18" height="3" rx="1" fill="#C9A227" stroke="#7A5A1C" stroke-width="1"/><path d="M15.5 9 L17 2.5 L19 8z M24.5 9 L23 2.5 L21 8z" fill="#2C2C2C"/><path d="M15 14 q0 -6 5 -6 q5 0 5 6z" fill="#2C2C2C" stroke="#111" stroke-width="1"/><path d="M20 10.5 l7 1.8 l-6 1.2z" fill="#2C2C2C"/><circle cx="21" cy="10.4" r="0.8" fill="#E0B95A"/></g>`,
      `<g><path d="M11 24 v10 M15 24 v10 M24 24 v10 M28 24 v10" stroke="#7A4A1C" stroke-width="2" stroke-linecap="round"/><path d="M7 22 q0 -5 5 -6 q3 -6 7 -1 q3 -7 8 -1 q4 1 4 6 q0 3 -3 3 h-18 q-3 0 -3 -1z" fill="#D9A36F" stroke="#7A4A1C" stroke-width="1.2" stroke-linejoin="round"/><path d="M30 20 q3 -2 3 -8 q0 -3 3 -3 q3 0 3 2 l-1 1 h-2 q-1 4 -1 8 q0 3 -3 3z" fill="#D9A36F" stroke="#7A4A1C" stroke-width="1.2" stroke-linejoin="round"/><path d="M14 17.5 h11 v3.5 h-11z" fill="#B3261E" opacity="0.85"/><path d="M14 21 h11" stroke="#F2C14E" stroke-width="1"/><circle cx="36.5" cy="10.5" r="0.7" fill="#3B2A1B"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><path d="M20 8 L36 32 H4 z" fill="#E3C58E"/><path d="M20 8 L26 32" stroke="#B8955C"/><path d="M8 26 h24 M12 20 h16 M15.5 14 h9" stroke="#B8955C" stroke-width="0.8"/></g>`,
      `<g><rect x="9" y="12" width="22" height="16" fill="#EDE0B8" stroke="#8A7A60" stroke-width="1.2"/><rect x="5" y="10" width="5" height="20" rx="2.5" fill="#D9C38A" stroke="#7A5A1C" stroke-width="1.2"/><rect x="30" y="10" width="5" height="20" rx="2.5" fill="#D9C38A" stroke="#7A5A1C" stroke-width="1.2"/><g stroke="#1F4E79" stroke-width="1" fill="none"><circle cx="14.5" cy="17" r="1.6"/><path d="M19 14.5 v5 M21 14.5 q2 2.5 0 5 M25 15.5 l2 2.5 l-2 2.5 M13 23.5 h4 M20 22 l1 3 l1 -3 M24.5 23.5 h3"/></g></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><path d="M20 36 q-2 -12 1 -24" fill="none" stroke="#7A5236" stroke-width="2.6"/><path d="M21 12 q-8 -6 -15 0 q8 -2 15 0z M21 12 q8 -6 15 0 q-8 -2 -15 0z M21 12 q-4 -8 -11 -9 q6 4 11 9z M21 12 q4 -8 11 -9 q-6 4 -11 9z" fill="#5C8B5E"/></g>`,
      `<g><path d="M9 24 q-5 -4 0 -7" fill="none" stroke="#7A3E1C" stroke-width="2"/><path d="M8 26 q12 -12 22 -2 l6 -2 q-2 6 -8 6 h-16 q-4 0 -4 -2z" fill="#C8743A" stroke="#7A3E1C" stroke-width="1.3" stroke-linejoin="round"/><ellipse cx="19" cy="21.5" rx="3" ry="1.2" fill="#3B2A1B"/><path d="M35 21 q-3 -5 1 -10 q3 5 -1 10z" fill="#F39C12" stroke="#B3261E" stroke-width="0.8"/><path d="M12 27 h16" stroke="#F0B98A" stroke-width="1" opacity="0.7"/></g>`,
      `<g><path d="M6 33 q14 -7 28 0z" fill="#E3C58E" stroke="#B8955C" stroke-width="1"/><path d="M10 21 v11 M29 25 v7" stroke="#7A5236" stroke-width="1.8" stroke-linecap="round"/><path d="M7 14 l26 6 l-2 8 l-26 -6z" fill="#F3EDE3" stroke="#7A5236" stroke-width="2" stroke-linejoin="round"/><path d="M9.5 17.5 l20.5 4.7 M8.5 20.5 l20.5 4.7 M13 15.4 l-2 7.6 M18 16.5 l-2 7.6 M23 17.7 l-2 7.6 M28 18.8 l-2 7.6" stroke="#8A7A60" stroke-width="0.6"/></g>`
    ],
    casino: [
      `<g><circle cx="20" cy="20" r="15" fill="#5A3A1E" stroke="#3B2A1B" stroke-width="1.3"/><circle cx="20" cy="20" r="10.5" fill="none" stroke="#B3261E" stroke-width="4"/><circle cx="20" cy="20" r="10.5" fill="none" stroke="#1A1108" stroke-width="4" stroke-dasharray="3.3 3.3"/><circle cx="20" cy="20" r="7.5" fill="#2E7D32" stroke="#3B2A1B" stroke-width="0.8"/><path d="M20 13 v14 M13 20 h14" stroke="#C9A227" stroke-width="1.6"/><circle cx="20" cy="20" r="2.2" fill="#E0B95A" stroke="#7A5A1C" stroke-width="0.8"/><circle cx="28.5" cy="13.5" r="1.4" fill="#FFFFFF" stroke="#8A97A3" stroke-width="0.5"/></g>`,
      `<g><path d="M6 16 v15 a7 2.5 0 0 0 14 0 v-15" fill="#B3261E" stroke="#3B2A1B" stroke-width="1.2"/><path d="M6 20.5 h14 M6 25 h14 M6 29.5 h14" stroke="#FAF5EF" stroke-width="1" stroke-dasharray="2 2"/><ellipse cx="13" cy="16" rx="7" ry="2.5" fill="#D9534F" stroke="#3B2A1B" stroke-width="1.2"/><path d="M20 24 v8 a7 2.5 0 0 0 14 0 v-8" fill="#1F4E79" stroke="#3B2A1B" stroke-width="1.2"/><path d="M20 28 h14" stroke="#FAF5EF" stroke-width="1" stroke-dasharray="2 2"/><ellipse cx="27" cy="24" rx="7" ry="2.5" fill="#2E6DA4" stroke="#3B2A1B" stroke-width="1.2"/><ellipse cx="27" cy="24" rx="3" ry="1" fill="none" stroke="#FAF5EF" stroke-width="0.8"/><ellipse cx="13" cy="16" rx="3" ry="1" fill="none" stroke="#FAF5EF" stroke-width="0.8"/></g>`,
      `<g stroke="${INK}" stroke-width="1.2"><path d="M4 26 q2 -6 8 -6 l6 -4 h6 l4 4 h6 q4 0 4 6z" fill="#B3261E"/><circle cx="11" cy="27" r="4" fill="#2C2C2C"/><circle cx="30" cy="27" r="4" fill="#2C2C2C"/><circle cx="11" cy="27" r="1.5" fill="#BFC9D4"/><circle cx="30" cy="27" r="1.5" fill="#BFC9D4"/><circle cx="21" cy="22" r="2.6" fill="#FAF5EF"/></g>`,
      `<g><rect x="3" y="34.5" width="34" height="2.5" rx="1" fill="#C9A227" stroke="#7A5A1C" stroke-width="0.9"/><path d="M5.5 29 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M10 31.2 v3.3 M7.8 34.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><path d="M15.5 29 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M20 31.2 v3.3 M17.8 34.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><path d="M25.5 29 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M30 31.2 v3.3 M27.8 34.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><path d="M10.5 21 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M15 23.2 v3.3 M12.8 26.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><path d="M20.5 21 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M25 23.2 v3.3 M22.8 26.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><path d="M15.5 13 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M20 15.2 v3.3 M17.8 18.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><g fill="#FAF5EF" stroke="#C9A227" stroke-width="0.5"><circle cx="20" cy="8" r="1.1"/><circle cx="23" cy="5" r="0.8"/><circle cx="17.5" cy="4.5" r="0.7"/></g></g>`,
      `<g stroke="${INK}" stroke-width="1.2"><rect x="11" y="6" width="18" height="26" rx="2.5" fill="#FAF5EF"/><path d="M20 12 q-6 6 -5 9 q1 3 5 1 q-1 3 -2 4 h4 q-1 -1 -2 -4 q4 2 5 -1 q1 -3 -5 -9z" fill="#1A1108" stroke="none"/></g>`,
      `<g><path d="M28 21 h4 v-11" fill="none" stroke="#8A97A3" stroke-width="1.8"/><circle cx="32" cy="9" r="2.4" fill="#B3261E" stroke="#7A2A1C" stroke-width="0.8"/><rect x="8" y="9" width="20" height="25" rx="3" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.3"/><path d="M8 13 q10 -8 20 0" fill="#B3261E" stroke="#7A5A1C" stroke-width="1.2"/><rect x="11" y="15" width="14" height="8" rx="1" fill="#FAF5EF" stroke="#3B2A1B" stroke-width="1"/><path d="M15.7 15 v8 M20.3 15 v8" stroke="#3B2A1B" stroke-width="0.8"/><circle cx="13.4" cy="19" r="1.5" fill="#B3261E"/><circle cx="18" cy="19" r="1.5" fill="#B3261E"/><path d="M21.4 17.4 l1.6 3.2 l1.6 -3.2z" fill="#2E7D32"/><rect x="11" y="27" width="14" height="4" rx="1" fill="#3B2A1B"/></g>`,
      `<g><path d="M14 14 h12 l-2 20 h-8z" fill="#BFC9D4" stroke="#5A6470" stroke-width="1.3" stroke-linejoin="round"/><path d="M15 14 q5 -4 10 0" fill="#BFC9D4" stroke="#5A6470" stroke-width="1.2"/><rect x="18.5" y="7" width="3" height="4" rx="1" fill="#BFC9D4" stroke="#5A6470" stroke-width="1"/><path d="M14.6 19 h10.8" stroke="#5A6470" stroke-width="1"/><path d="M17 21 v10" stroke="#FFFFFF" stroke-width="1.4" opacity="0.8"/><path d="M27 22 h10 l-5 5z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M32 27 v6 M29.5 33 h5" stroke="#7A5A1C" stroke-width="1"/><circle cx="33" cy="23.6" r="1" fill="#2E7D32"/></g>`
    ],
    filmstudio: [
      `<g><path d="M14 30 L10 38 M20 30 v8 M26 30 L30 38" stroke="#3B2A1B" stroke-width="1.6" stroke-linecap="round"/><rect x="9" y="18" width="20" height="12" rx="2" fill="#2C2C2C" stroke="#111" stroke-width="1.2"/><path d="M29 21 l6 -2 v10 l-6 -2z" fill="#4A4A4A" stroke="#111" stroke-width="1"/><circle cx="14" cy="12" r="5.5" fill="#4A4A4A" stroke="#111" stroke-width="1.2"/><circle cx="25" cy="12" r="5.5" fill="#4A4A4A" stroke="#111" stroke-width="1.2"/><circle cx="14" cy="12" r="1.6" fill="#BFC9D4"/><circle cx="25" cy="12" r="1.6" fill="#BFC9D4"/><circle cx="35.5" cy="24" r="2" fill="#BFC9D4" stroke="#111" stroke-width="0.8"/></g>`,
      `<g><rect x="7" y="16" width="26" height="18" rx="1.5" fill="#2C2C2C" stroke="#111" stroke-width="1.2"/><path d="M10 22 h20 M10 27 h20" stroke="#FAF5EF" stroke-width="0.8"/><path d="M7 15 L32 8 L33.5 13 L8.5 20z" fill="#FAF5EF" stroke="#111" stroke-width="1.1" stroke-linejoin="round"/><path d="M12 13.6 l2.5 4.5 M17.5 12.2 l2.5 4.5 M23 10.7 l2.5 4.5 M28.5 9.2 l2.5 4.5" stroke="#111" stroke-width="2"/></g>`,
      `<g stroke="${INK}" stroke-width="1.2"><rect x="4" y="4" width="32" height="32" rx="2" fill="#D9737F"/><path d="M20 9 l3.2 7 7.6 0.6 -5.8 5 1.8 7.4 -6.8 -4 -6.8 4 1.8 -7.4 -5.8 -5 7.6 -0.6z" fill="#F2C46D"/></g>`,
      `<g><path d="M17 24 v9 M11 37 L17 33 L23 37" stroke="#3B2A1B" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M28 13 L38 7 V27 L28 21z" fill="#F5E6B8" opacity="0.75"/><rect x="7" y="10" width="19" height="14" rx="3" fill="#8A97A3" stroke="#3B2A1B" stroke-width="1.2"/><path d="M10 13 v8 M13 13 v8" stroke="#5A6470" stroke-width="1"/><circle cx="25" cy="17" r="4.2" fill="#F5D67A" stroke="#7A5A1C" stroke-width="1"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><path d="M8 17 L28 9 V31 L8 23 z" fill="#C9A227"/><rect x="4" y="16" width="5" height="8" rx="1" fill="#7A5236"/><path d="M12 24 l2 8 h4 l-1 -6" fill="#7A5236"/></g>`,
      `<g><path d="M26 25 q6 4 11 2 v6 q-6 2 -12 -2z" fill="#2C2C2C"/><path d="M28 28.5 h1.5 M31.5 29.7 h1.5 M35 30 h1.5" stroke="#FAF5EF" stroke-width="1"/><circle cx="17" cy="18" r="12" fill="#8A97A3" stroke="#3B2A1B" stroke-width="1.3"/><g fill="#FAF5EF" stroke="#3B2A1B" stroke-width="0.8"><circle cx="17" cy="10.5" r="3"/><circle cx="24" cy="15.5" r="3"/><circle cx="21.5" cy="24" r="3"/><circle cx="12.5" cy="24" r="3"/><circle cx="10" cy="15.5" r="3"/></g><circle cx="17" cy="18" r="2.5" fill="#3B2A1B"/></g>`,
      `<g><path d="M10 36 L28 22 M28 36 L10 22" stroke="#7A5236" stroke-width="2.2" stroke-linecap="round"/><path d="M10 6 v16 M28 6 v16" stroke="#7A5236" stroke-width="2"/><rect x="10" y="8" width="18" height="7" fill="#B3261E" stroke="#7A2A1C" stroke-width="1"/><rect x="9" y="20" width="20" height="3.5" fill="#B3261E" stroke="#7A2A1C" stroke-width="1"/><path d="M13 11.5 h12" stroke="#F2C14E" stroke-width="1"/></g>`
    ],
    karavaan: [
      `<g><path d="M15 8 h10 l-1 4 q7 4 7 13 q0 9 -11 9 q-11 0 -11 -9 q0 -9 7 -13z" fill="#C8743A" stroke="#7A3E1C" stroke-width="1.3" stroke-linejoin="round"/><path d="M11 22 h18" stroke="#F2C14E" stroke-width="1.4"/><path d="M12.5 26 h15" stroke="#1F4E79" stroke-width="1"/><ellipse cx="20" cy="8" rx="5" ry="1.4" fill="#7A3E1C"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><path d="M20 36 q-2 -12 1 -24" fill="none" stroke="#7A5236" stroke-width="2.6"/><path d="M21 12 q-8 -6 -15 0 q8 -2 15 0z M21 12 q8 -6 15 0 q-8 -2 -15 0z M21 12 q-4 -8 -11 -9 q6 4 11 9z M21 12 q4 -8 11 -9 q-6 4 -11 9z" fill="#5C8B5E"/></g>`,
      `<g><rect x="5" y="13" width="30" height="15" rx="2" fill="#B3261E" stroke="#5A1A12" stroke-width="1.2"/><path d="M9 13 v15 M31 13 v15" stroke="#F2C14E" stroke-width="1.6"/><path d="M14 20.5 l3 -4 l3 4 l-3 4z M20 20.5 l3 -4 l3 4 l-3 4z" fill="#1F4E79"/><path d="M5 28 v3 M8 28 v3 M32 28 v3 M35 28 v3 M5 10 v3 M8 10 v3 M32 10 v3 M35 10 v3" stroke="#F2C14E" stroke-width="1"/></g>`,
      `<g><path d="M6 24 h28 l-3 10 h-22z" fill="#C7A06A" stroke="#7A5236" stroke-width="1.2"/><path d="M8 28 h24" stroke="#7A5236" stroke-width="0.8"/><path d="M9 24 q4 -10 8 0z" fill="#E8A33C" stroke="#9C6B1E" stroke-width="0.9"/><path d="M16 24 q4 -12 8 0z" fill="#B3261E" stroke="#6A1C14" stroke-width="0.9"/><path d="M23 24 q4 -9 8 0z" fill="#E3C14A" stroke="#9C7A1E" stroke-width="0.9"/></g>`,
      `<g stroke="${INK}" stroke-width="1.2"><path d="M2 32 q10 -14 20 -4 q8 -10 16 4 z" fill="#E3B26F"/><path d="M4 32 q8 -8 16 -2" fill="none" stroke="#C98B5A"/></g>`,
      `<g><path d="M6 26 q14 -10 28 0 v4 h-28z" fill="#7A5236" stroke="#3B2A1B" stroke-width="1.2"/><path d="M10 26 v-10 M30 26 v-10" stroke="#C9A227" stroke-width="2.2" stroke-linecap="round"/><circle cx="10" cy="15" r="2" fill="#C9A227"/><circle cx="30" cy="15" r="2" fill="#C9A227"/><path d="M6 30 h28 v3 h-28z" fill="#B3261E" stroke="#5A1A12" stroke-width="1"/><path d="M9 33 v3 M14 33 v3 M19 33 v3 M24 33 v3 M29 33 v3" stroke="#F2C14E" stroke-width="1"/></g>`,
      `<g><path d="M20 8 v24 M12 34 h16" stroke="#9C7A1E" stroke-width="2" stroke-linecap="round"/><path d="M8 12 h24" stroke="#C9A227" stroke-width="2"/><circle cx="20" cy="8" r="2" fill="#C9A227"/><path d="M8 12 l-4 10 M8 12 l4 10 M32 12 l-4 10 M32 12 l4 10" stroke="#9C7A1E" stroke-width="0.8"/><path d="M3 22 q5 4 10 0z M27 22 q5 4 10 0z" fill="#E0B95A" stroke="#9C7A1E" stroke-width="1"/></g>`
    ],
    abdij: [
      `<g><path d="M14 36 h12 M20 36 v-20" stroke="#4A4A4A" stroke-width="2.2" stroke-linecap="round"/><path d="M15 36 q5 -6 10 0" fill="none" stroke="#4A4A4A" stroke-width="1.6"/><rect x="16" y="14" width="8" height="3" rx="1" fill="#4A4A4A"/><rect x="17.5" y="6" width="5" height="8" fill="#F3EDE3" stroke="#8A7A60" stroke-width="0.9"/><path d="M20 6 q-2 -3 0 -5 q2 2 0 5z" fill="#F39C12"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><path d="M20 6 l-12 26 h24 z" fill="#3D4A2E"/><path d="M20 4 l-8 16 h16 z" fill="#4E5E3A"/><rect x="18" y="32" width="4" height="5" fill="#5C3D28"/></g>`,
      `<g><path d="M8 32 q0 -24 12 -24 q12 0 12 24z" fill="#D9B45A" stroke="#7A5A1C" stroke-width="1.3"/><path d="M9 26 h22 M10.5 20 h19 M13.5 14 h13" stroke="#9C7A1E" stroke-width="1.2"/><path d="M17 32 q3 -5 6 0z" fill="#3B2A1B"/><rect x="5" y="32" width="30" height="3" rx="1" fill="#7A5236"/><g fill="#F2C14E" stroke="#3B2A1B" stroke-width="0.6"><ellipse cx="33" cy="12" rx="2" ry="1.4"/><ellipse cx="6" cy="16" rx="2" ry="1.4"/></g></g>`,
      `<g><path d="M10 36 l3 -16 M30 36 l-3 -16" stroke="#7A5236" stroke-width="2.2" stroke-linecap="round"/><path d="M6 20 L34 14 L35 18 L7 24z" fill="#8B6A46" stroke="#3B2A1B" stroke-width="1.2" stroke-linejoin="round"/><path d="M10 18.5 L20 16.4 L21 10 L11 12z" fill="#FAF5EF" stroke="#8A7A60" stroke-width="0.9"/><path d="M20 16.4 L30 14.3 L29 8 L21 10z" fill="#F3EDE3" stroke="#8A7A60" stroke-width="0.9"/><path d="M28 9 q4 -6 6 -7" stroke="#3B2A1B" stroke-width="1" fill="none"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><path d="M20 5 v4" stroke-width="2"/><path d="M12 28 q0 -18 8 -18 q8 0 8 18 z" fill="#B8955C"/><rect x="10" y="28" width="20" height="3" rx="1.5" fill="#7A5A1C"/><circle cx="20" cy="33" r="2.4" fill="#5A4A3A"/></g>`,
      `<g><path d="M24 6 L16 22" stroke="#7A5236" stroke-width="3" stroke-linecap="round"/><path d="M8 20 h24 q-1 12 -12 12 q-11 0 -12 -12z" fill="#BFC9D4" stroke="#5A6470" stroke-width="1.3"/><path d="M14 32 h12 v3 h-12z" fill="#8A97A3" stroke="#5A6470" stroke-width="1"/><g fill="#5C8B5E"><path d="M11 20 q1 -4 4 -4 q0 3 -4 4z"/><path d="M29 20 q-1 -4 -4 -4 q0 3 4 4z"/></g></g>`,
      `<g><path d="M13 8 h14 q0 6 -7 11 q-7 -5 -7 -11z M13 32 h14 q0 -6 -7 -11 q-7 5 -7 11z" fill="#DCEBF0" opacity="0.85"/><path d="M14.5 12 h11 q-1 4 -5.5 7 q-4.5 -3 -5.5 -7z M14 32 q6 -8 12 0z" fill="#E3C58E"/><path d="M12 8 q0 7 7 12 q-7 5 -7 12 M28 8 q0 7 -7 12 q7 5 7 12" fill="none" stroke="#7A5236" stroke-width="1.4"/><rect x="10" y="5" width="20" height="3" rx="1" fill="#7A5236" stroke="#3B2A1B" stroke-width="1"/><rect x="10" y="32" width="20" height="3" rx="1" fill="#7A5236" stroke="#3B2A1B" stroke-width="1"/></g>`
    ],
    vuurtoren: [
      `<g><circle cx="20" cy="20" r="14.5" fill="none" stroke="#C9A227" stroke-width="0.9" stroke-dasharray="2 2"/><path d="M20 7 a13 13 0 1 0 0.01 0z M20 13.5 a6.5 6.5 0 1 1 -0.01 0z" fill-rule="evenodd" fill="#FAF5EF"/><circle cx="20" cy="20" r="9.75" fill="none" stroke="#B3261E" stroke-width="6.5" stroke-dasharray="7.66 7.66"/><circle cx="20" cy="20" r="13" fill="none" stroke="#3B2A1B" stroke-width="1.3"/><circle cx="20" cy="20" r="6.5" fill="none" stroke="#3B2A1B" stroke-width="1.3"/></g>`,
      `<g stroke="${INK}" stroke-width="1.2"><path d="M6 20 q7 -8 14 0 q7 -8 14 0" fill="none" stroke-width="2"/><circle cx="20" cy="20" r="2.4" fill="#FAF5EF"/></g>`,
      `<g><path d="M14 22 v12 M10 36 h12" stroke="#3B2A1B" stroke-width="1.8" stroke-linecap="round"/><path d="M8 18 L30 10 V30 L8 22z" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.3" stroke-linejoin="round"/><ellipse cx="30" cy="20" rx="3.5" ry="10" fill="#E0B95A" stroke="#7A5A1C" stroke-width="1.2"/><rect x="4" y="17" width="5" height="6" rx="1" fill="#7A5236" stroke="#3B2A1B" stroke-width="1"/></g>`,
      `<g><path d="M5 30 V20 q15 -14 30 0 V30z" fill="#C7A06A" stroke="#7A5236" stroke-width="1.3"/><path d="M10 30 V16 M15 30 V12.5 M20 30 V11 M25 30 V12.5 M30 30 V16 M5 25 h30" stroke="#7A5236" stroke-width="1"/><rect x="4" y="30" width="32" height="3" rx="1" fill="#7A5236"/><path d="M30 22 q4 -4 7 -2 M31 25 q4 -2 6 0" stroke="#B3261E" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`,
      `<g stroke="${INK}" stroke-width="1.4"><path d="M20 6 v26 M12 12 h16" stroke-width="2.4"/><path d="M8 26 q12 12 24 0" fill="none" stroke-width="2.4"/><circle cx="20" cy="6" r="2.6" fill="none"/></g>`,
      `<g><path d="M15 9 q5 -5 10 0" fill="none" stroke="#3B2A1B" stroke-width="1.6"/><rect x="13" y="9" width="14" height="4" rx="1" fill="#B3261E" stroke="#5A1A12" stroke-width="1"/><path d="M14 13 q-3 9 0 16 h12 q3 -7 0 -16z" fill="#F5E6B8" stroke="#3B2A1B" stroke-width="1.2"/><path d="M20 18 q-3 4 0 8 q3 -4 0 -8z" fill="#F39C12"/><path d="M14 13 v16 M26 13 v16" stroke="#B3261E" stroke-width="1.6"/><rect x="12" y="29" width="16" height="5" rx="1.5" fill="#B3261E" stroke="#5A1A12" stroke-width="1"/></g>`,
      `<g><path d="M8 36 L18 24 M28 36 L18 24 M18 24 v12" stroke="#7A5236" stroke-width="1.6" stroke-linecap="round"/><path d="M6 20 L32 10 L34 15 L8 25z" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.2" stroke-linejoin="round"/><path d="M14 17.2 L15.6 21.8 M24 13.4 L25.6 18" stroke="#7A5A1C" stroke-width="1.4"/><circle cx="33" cy="12.5" r="2.4" fill="#DCEBF0" stroke="#7A5A1C" stroke-width="1"/></g>`
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
