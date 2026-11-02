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
    `, 'banner-vuurtoren'),

    oceaanstomer: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#1F4250"/>
      ${stars([[20, 70, 1.2], [60, 24, 1.4], [110, 60, 1], [150, 14, 1.2], [230, 50, 1], [350, 20, 1.6], [372, 74, 1.2], [270, 84, 1]], '#F3EDE3')}
      <!-- de komeet van Halley -->
      <path d="M318 34 L170 12 L172 22 Z" fill="#F5E6B8" opacity="0.35"/><path d="M318 34 L196 30 L196 36 Z" fill="#F5E6B8" opacity="0.25"/>
      <circle cx="318" cy="34" r="4.5" fill="#FAF5EF" stroke="${INK}" stroke-width="1"/>
      <!-- zee -->
      <rect x="0" y="150" width="393" height="50" fill="#0E5560"/><path d="M0 150 h393" stroke="${INK}" stroke-width="1.5"/>
      <!-- de oceaanstomer -->
      <g stroke="${INK}" stroke-width="1.5">
        <path d="M100 126 L310 128 M100 126 L100 54 M310 128 L310 58 M100 56 L310 60" fill="none" stroke-width="1"/>
        ${[148, 184, 220, 256].map(x => `<rect x="${x}" y="64" width="18" height="34" fill="#E0A848"/><rect x="${x}" y="64" width="18" height="8" fill="#1A1A1A"/>`).join('')}
        <rect x="128" y="96" width="160" height="14" fill="#FAF5EF"/>
        <rect x="108" y="110" width="206" height="18" fill="#FAF5EF"/>
        <path d="M54 126 L346 126 L326 160 L74 160 Z" fill="#1A1A1A"/>
        <path d="M68 152 L331 152 L326 160 L74 160 Z" fill="#B3261E" stroke-width="1"/>
        <path d="M54 126 h292" stroke="#C9A227" stroke-width="2"/>
      </g>
      <g stroke="${INK}" stroke-width="0.8">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(i => `<circle cx="${84 + i * 16}" cy="138" r="2.4" fill="${i % 5 === 2 ? '#7B5E3B' : '#F5D67A'}"/>`).join('')}</g>
      <g stroke="${INK}" stroke-width="0.8">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<rect x="${116 + i * 16}" y="115" width="8" height="6" fill="${i % 4 === 1 ? '#7B5E3B' : '#F0CE8E'}"/>`).join('')}${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${140 + i * 18}" y="100" width="8" height="6" fill="#F0CE8E"/>`).join('')}</g>
      <g fill="none" stroke="#8CC3DE" stroke-width="1.6" stroke-linecap="round" opacity="0.8">
        <path d="M10 176 q10 -6 20 0 q10 -6 20 0"/><path d="M340 172 q10 -6 20 0 q10 -6 20 0"/><path d="M150 186 q10 -6 20 0 q10 -6 20 0 q10 -6 20 0"/>
      </g>
      <g stroke="#F5D67A" stroke-width="1.4" opacity="0.5">${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${96 + i * 40} 168 h8"/>`).join('')}</g>
    `, 'banner-oceaanstomer'),

    ryokan: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#F6E3E8"/>
      <circle cx="318" cy="44" r="18" fill="#FAF5EF" stroke="${INK}" stroke-width="1.5"/>
      <path d="M0 122 q60 -54 130 -22 q60 -44 130 -4 q70 -34 133 8 V200 H0 Z" fill="#C9B3CF" stroke="${INK}" stroke-width="1.3"/>
      <rect x="0" y="166" width="393" height="34" fill="#E3D8C6"/><path d="M0 166 h393" stroke="${INK}" stroke-width="1.5"/>
      <!-- de ryokan -->
      <g stroke="${INK}" stroke-width="1.5">
        <rect x="134" y="118" width="152" height="48" fill="#F3EDE3"/>
        <rect x="152" y="80" width="116" height="32" fill="#F3EDE3"/>
        <path d="M128 86 Q138 76 150 72 L270 72 Q282 76 292 86 Z" fill="#3B3B4A"/>
        <path d="M150 72 Q210 62 270 72" fill="none" stroke-width="1.2"/>
        <path d="M108 122 Q120 112 134 108 L286 108 Q300 112 312 122 Z" fill="#3B3B4A"/>
        <rect x="160" y="86" width="28" height="20" fill="#F5E6B8" stroke-width="1"/><rect x="196" y="86" width="28" height="20" fill="#F5E6B8" stroke-width="1"/><rect x="232" y="86" width="28" height="20" fill="#F5E6B8" stroke-width="1"/>
        <rect x="142" y="126" width="40" height="26" fill="#F5E6B8" stroke-width="1"/><rect x="238" y="126" width="40" height="26" fill="#F5E6B8" stroke-width="1"/>
        <rect x="194" y="126" width="32" height="40" fill="#5A3A2E"/>
        <path d="M196 126 h28 v14 h-28z" fill="#5B2A4E" stroke-width="1"/>
      </g>
      <g stroke="#8A6A50" stroke-width="0.7">
        <path d="M174 86 v20 M160 96 h28 M210 86 v20 M196 96 h28 M246 86 v20 M232 96 h28"/>
        <path d="M155 126 v26 M168 126 v26 M142 139 h40 M251 126 v26 M264 126 v26 M238 139 h40"/>
      </g>
      <path d="M205.3 126 v14 M214.6 126 v14" stroke="#F3EDE3" stroke-width="0.9"/>
      <g stroke="${INK}" stroke-width="1"><circle cx="186" cy="132" r="5" fill="#C0392B"/><circle cx="234" cy="132" r="5" fill="#C0392B"/><path d="M186 127 v-4 M234 127 v-4" stroke-width="1.2"/></g>
      <!-- kersenboom en stenen lantaarn -->
      <path d="M62 166 q-2 -24 6 -44 M66 136 q-14 -6 -22 -18 M68 126 q12 -10 26 -10" fill="none" stroke="#5A3A2E" stroke-width="4" stroke-linecap="round"/>
      <g stroke="${INK}" stroke-width="1.2" fill="#F0B8C8">
        <circle cx="44" cy="112" r="13"/><circle cx="66" cy="104" r="16"/><circle cx="92" cy="112" r="13"/><circle cx="78" cy="96" r="11"/><circle cx="52" cy="98" r="10"/>
      </g>
      <g fill="#E28AA5">${[[46, 108], [62, 100], [72, 108], [88, 114], [80, 94], [54, 96], [96, 106]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2"/>`).join('')}</g>
      <g fill="#F0B8C8">${[[30, 150], [110, 160], [130, 146], [20, 176], [104, 182]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8"/>`).join('')}</g>
      <g stroke="${INK}" stroke-width="1.2" fill="#BFC0B5"><rect x="346" y="160" width="20" height="6"/><rect x="352" y="146" width="8" height="14"/><rect x="346" y="134" width="20" height="12"/><path d="M336 136 Q350 132 352 124 H360 Q362 132 376 136 Z"/></g>
      <rect x="351" y="137" width="10" height="7" fill="#F5D67A" stroke="${INK}" stroke-width="0.8"/>
      <g fill="none" stroke="#FAF5EF" stroke-width="2" stroke-linecap="round" opacity="0.9"><path d="M318 160 q-4 -8 0 -14 q4 -6 0 -12"/><path d="M328 158 q-4 -8 0 -14 q4 -6 0 -12"/></g>
    `, 'banner-ryokan'),

    fazenda: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#F7DDB8"/>
      <circle cx="70" cy="46" r="20" fill="#F5C26B" stroke="${INK}" stroke-width="1.5"/>
      ${cloud(250, 34, 0.7)}
      <path d="M0 118 q70 -42 150 -14 q80 -32 150 -6 q50 -12 93 4 V200 H0 Z" fill="#8FC79A" stroke="${INK}" stroke-width="1.3"/>
      <g fill="none" stroke="#3F7D4E" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="0.1 9">
        <path d="M6 120 q64 -36 140 -10"/><path d="M4 134 q70 -34 150 -8"/><path d="M250 110 q60 -16 140 2"/><path d="M240 124 q70 -16 150 4"/>
      </g>
      <!-- de casa-grande -->
      <g stroke="${INK}" stroke-width="1.5">
        <rect x="118" y="104" width="184" height="48" fill="#FAF5EF"/>
        <path d="M106 106 L138 82 L282 82 L314 106 Z" fill="#C8603E"/>
        <path d="M118 128 h184" stroke-width="1.2"/>
        ${[132, 166, 238, 272].map(x => `<rect x="${x}" y="108" width="14" height="16" fill="#F0CE8E" stroke-width="1"/><rect x="${x - 5}" y="108" width="5" height="16" fill="#2E6DA4" stroke-width="1"/><rect x="${x + 14}" y="108" width="5" height="16" fill="#2E6DA4" stroke-width="1"/>`).join('')}
        <rect x="200" y="108" width="20" height="16" fill="#F0CE8E" stroke-width="1"/>
        <path d="M200 152 V138 a10 10 0 0 1 20 0 V152 Z" fill="#7A4A26"/>
        ${[124, 152, 180, 240, 268, 296].map(x => `<path d="M${x} 128 V152" stroke-width="2"/>`).join('')}
      </g>
      <!-- de droogvloer met koffiebessen -->
      <rect x="0" y="152" width="393" height="48" fill="#E3C9A0"/><path d="M0 152 h393" stroke="${INK}" stroke-width="1.5"/>
      <g>${[...Array(26)].map((_, i) => `<circle cx="${8 + i * 15}" cy="${166 + (i % 3) * 9}" r="1.8" fill="${i % 2 ? '#B3261E' : '#7A4A26'}"/><circle cx="${15 + i * 15}" cy="${188 - (i % 3) * 5}" r="1.6" fill="${i % 3 ? '#7A4A26' : '#B3261E'}"/>`).join('')}</g>
      <g transform="translate(46 152) scale(1.1)" stroke="${INK}" stroke-width="1.2"><path d="M0 0 q-3 -22 2 -42" fill="none" stroke="#7A5236" stroke-width="3.5"/><path d="M2 -42 q-14 -10 -26 0 q14 -3 26 0z M2 -42 q14 -10 26 0 q-14 -3 -26 0z M2 -42 q-7 -14 -19 -15 q10 7 19 15z M2 -42 q7 -14 19 -15 q-10 7 -19 15z" fill="#2F6F4E"/></g>
      <g transform="translate(352 152) scale(0.95)" stroke="${INK}" stroke-width="1.2"><path d="M0 0 q-3 -22 2 -42" fill="none" stroke="#7A5236" stroke-width="3.5"/><path d="M2 -42 q-14 -10 -26 0 q14 -3 26 0z M2 -42 q14 -10 26 0 q-14 -3 -26 0z M2 -42 q-7 -14 -19 -15 q10 7 19 15z M2 -42 q7 -14 19 -15 q-10 7 -19 15z" fill="#2F6F4E"/></g>
    `, 'banner-fazenda'),

    zeppelin: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#C9D3E6"/>
      ${cloud(20, 150, 1)}${cloud(300, 132, 0.9)}${cloud(330, 26, 0.6)}${cloud(40, 30, 0.5)}
      <!-- oceaan en de Suikerbroodberg aan de horizon -->
      <path d="M330 172 q8 -38 24 -42 q14 4 18 42 Z" fill="#6E8C7A" stroke="${INK}" stroke-width="1.2"/>
      <rect x="0" y="172" width="393" height="28" fill="#7FA8B8"/><path d="M0 172 h393" stroke="${INK}" stroke-width="1.5"/>
      <g fill="none" stroke="#DCEBF0" stroke-width="1.6" stroke-linecap="round"><path d="M20 186 q10 -5 20 0 q10 -5 20 0"/><path d="M180 190 q10 -5 20 0 q10 -5 20 0"/></g>
      <!-- het luchtschip -->
      <g stroke="${INK}" stroke-width="1.5">
        <path d="M54 66 L30 44 L44 70 L30 96 L54 82 Z" fill="#A9B8C8"/>
        <ellipse cx="200" cy="74" rx="152" ry="34" fill="#D8DEE6"/>
        <g fill="none" stroke="#A9B8C8" stroke-width="1.2">${[90, 130, 170, 210, 250, 290].map(x => `<path d="M${x} ${42 + Math.abs(x - 200) / 9} q-8 32 0 ${64 - Math.abs(x - 200) / 4.5}"/>`).join('')}</g>
        <path d="M60 74 h280" fill="none" stroke="#A9B8C8" stroke-width="1"/>
        <path d="M78 58 q120 -24 250 6" fill="none" stroke="#FAF5EF" stroke-width="3" stroke-linecap="round"/>
        <path d="M170 106 h70 l-6 14 h-58 z" fill="#E9E4D6"/>
        ${[0, 1, 2, 3, 4].map(i => `<rect x="${182 + i * 10}" y="109" width="6" height="5" fill="#F0CE8E" stroke-width="0.8"/>`).join('')}
        <ellipse cx="120" cy="108" rx="10" ry="5" fill="#BFC9D4"/><ellipse cx="280" cy="106" rx="10" ry="5" fill="#BFC9D4"/>
        <path d="M108 102 v12 M268 100 v12" stroke-width="2"/>
      </g>
      <text x="200" y="80" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="13" font-weight="700" letter-spacing="4" fill="#665A80">CIRRUS</text>
    `, 'banner-zeppelin'),

    poolstation: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#1B2A57"/>
      ${stars([[20, 20, 1.2], [70, 110, 1], [120, 16, 1.4], [180, 100, 1], [250, 18, 1.2], [300, 96, 1], [360, 30, 1.6], [380, 110, 1]], '#F3EDE3')}
      <!-- poollicht -->
      <path d="M0 56 q60 -40 120 -10 t120 -10 t153 -4 V78 q-70 -22 -140 6 t-120 0 t-133 4 Z" fill="#8FE3B9" opacity="0.35"/>
      <path d="M0 80 q70 -30 140 -6 t130 -6 t123 0 V94 q-60 -14 -120 4 t-130 0 t-143 6 Z" fill="#B6F0D2" opacity="0.22"/>
      <!-- sneeuw -->
      <path d="M0 150 q90 -16 190 -4 q110 -14 203 2 V200 H0 Z" fill="#EEF3F8" stroke="${INK}" stroke-width="1.3"/>
      <!-- het station -->
      <g stroke="${INK}" stroke-width="1.5">
        <path d="M200 148 V64 M192 80 h16 M194 96 h12" fill="none" stroke-width="1.6"/>
        <path d="M200 64 L150 148 M200 64 L250 148" fill="none" stroke-width="0.8"/>
        <circle cx="200" cy="62" r="2.6" fill="#E74C3C"/>
        <rect x="104" y="116" width="84" height="34" fill="#D9533A"/>
        <rect x="100" y="110" width="92" height="8" rx="3" fill="#FAF5EF"/>
        <rect x="216" y="122" width="80" height="28" fill="#E0632A"/>
        <rect x="212" y="116" width="88" height="8" rx="3" fill="#FAF5EF"/>
        <path d="M316 150 a22 22 0 0 1 44 0 Z" fill="#DCE3EA"/><path d="M336 129 v12" stroke-width="2.4"/>
        <rect x="140" y="130" width="12" height="20" fill="#7A2A1C"/>
      </g>
      ${win(114, 124, 12, 10)}${win(160, 124, 12, 10)}${win(228, 130, 12, 10)}${win(252, 130, 12, 10, false)}${win(274, 130, 12, 10)}
      <!-- weerballon -->
      <path d="M86 92 q-3 10 2 20" fill="none" stroke="#DCE3EA" stroke-width="1"/>
      <circle cx="84" cy="80" r="11" fill="#FAF5EF" stroke="${INK}" stroke-width="1.3"/>
      <!-- slee met lading en een vlag -->
      <g stroke="${INK}" stroke-width="1.2">
        <path d="M28 164 h46 q6 0 8 -6" fill="none" stroke="#7A5236" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M34 164 v-4 M68 164 v-4" stroke="#7A5236" stroke-width="1.6"/>
        <rect x="32" y="148" width="40" height="12" rx="1.5" fill="#C9A27E"/><path d="M32 154 h40 M52 148 v12" stroke="#7A5236" stroke-width="1"/>
        <path d="M90 156 V112" stroke-width="1.6"/><path d="M90 112 h-18 l4 6 l-4 6 h18 z" fill="#E0632A"/>
      </g>
    `, 'banner-poolstation'),

    winterpaleis: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#2B2547"/>
      ${stars([[20, 70, 1.2], [110, 24, 1.4], [200, 14, 1], [280, 70, 1.2], [370, 80, 1.2]], '#F3EDE3')}
      <!-- vuurwerk voor de nieuwe eeuw -->
      <g stroke-width="1.6" stroke-linecap="round">${[[60, 40, '#F5D67A'], [330, 36, '#E28AA5'], [290, 16, '#E4ECF4']].map(([x, y, c]) => [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M${x + Math.cos(a * Math.PI / 180) * 5} ${y + Math.sin(a * Math.PI / 180) * 5} L${x + Math.cos(a * Math.PI / 180) * 13} ${y + Math.sin(a * Math.PI / 180) * 13}" stroke="${c}"/>`).join('')).join('')}</g>
      <!-- het paleis -->
      <g stroke="${INK}" stroke-width="1.5">
        <rect x="66" y="96" width="261" height="64" fill="#E7B0C4"/>
        <rect x="62" y="90" width="269" height="8" fill="#FAF5EF"/>
        <rect x="164" y="74" width="66" height="86" fill="#EDC0D0"/>
        <path d="M158 76 L197 52 L236 76 Z" fill="#FAF5EF"/>
        <path d="M197 32 v-12" stroke-width="1.6"/><circle cx="197" cy="19" r="2" fill="#C9A227" stroke-width="1"/>
        <path d="M185 56 q-4 -12 12 -24 q16 12 12 24 Z" fill="#C9A227"/>
        <circle cx="197" cy="64" r="5" fill="#F5D67A" stroke-width="1"/>
        <path d="M186 160 V140 a11 11 0 0 1 22 0 V160 Z" fill="#7A2A3C"/>
      </g>
      <g stroke="#FAF5EF" stroke-width="2.2">${[78, 100, 122, 144, 250, 272, 294, 316].map(x => `<path d="M${x} 100 V158"/>`).join('')}<path d="M170 80 V158 M224 80 V158"/></g>
      ${[[84, 104], [106, 104], [128, 104], [256, 104], [278, 104], [300, 104]].map(([x, y]) => win(x, y, 10, 16)).join('')}
      ${[[84, 132], [106, 132, false], [128, 132], [256, 132], [278, 132, false], [300, 132]].map(([x, y, l]) => win(x, y, 10, 16, l !== false)).join('')}
      ${win(180, 96, 12, 18)}${win(203, 96, 12, 18)}
      <!-- de bevroren Neva -->
      <rect x="0" y="160" width="393" height="40" fill="#DCEBF0"/><path d="M0 160 h393" stroke="${INK}" stroke-width="1.5"/>
      <g fill="none" stroke-linecap="round"><path d="M30 182 q40 -14 90 -2 q30 8 60 -4" stroke="#FFFFFF" stroke-width="2"/><path d="M220 176 q40 12 80 0 q30 -8 70 4" stroke="#A9C4D4" stroke-width="1.4"/><path d="M60 192 q50 6 110 -2" stroke="#A9C4D4" stroke-width="1.2"/></g>
      <g fill="#FAF5EF">${[[30, 120], [350, 110], [16, 150], [376, 146], [44, 96]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6"/>`).join('')}</g>
    `, 'banner-winterpaleis'),

    safarilodge: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#F6C27A"/>
      <circle cx="296" cy="100" r="40" fill="#F28A3A" stroke="${INK}" stroke-width="1.5"/>
      <g fill="none" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"><path d="M150 40 q4 -5 8 0 q4 -5 8 0"/><path d="M178 26 q3 -4 6 0 q3 -4 6 0"/><path d="M120 58 q3 -4 6 0 q3 -4 6 0"/></g>
      <path d="M0 142 q100 -10 200 0 t193 0 V200 H0 Z" fill="#D9B26A" stroke="${INK}" stroke-width="1.3"/>
      <!-- de grote trek aan de horizon -->
      <g fill="#5A3A1E">${[...Array(15)].map((_, i) => `<ellipse cx="${258 + i * 9 + (i % 3) * 2}" cy="${139 - (i % 2)}" rx="3.4" ry="2"/><path d="M${255 + i * 9 + (i % 3) * 2} 140 v3 M${261 + i * 9 + (i % 3) * 2} 140 v3" stroke="#5A3A1E" stroke-width="0.8"/>`).join('')}</g>
      <!-- de lodge en een tent -->
      <g stroke="${INK}" stroke-width="1.5">
        <rect x="132" y="112" width="118" height="36" fill="#C7A06A"/>
        <path d="M118 114 L191 74 L264 114 Z" fill="#D9B87A"/>
        <path d="M136 106 l11 -6 M158 94 l12 -6 M212 88 l12 6 M234 100 l11 6" stroke="#A8833E" stroke-width="1.2"/>
        ${[138, 164, 218, 244].map(x => `<path d="M${x} 114 V148" stroke-width="2.4" stroke="#5A3A1E"/>`).join('')}
        <rect x="180" y="120" width="22" height="28" fill="#F5D67A"/>
        <path d="M276 148 L306 108 L336 148 Z" fill="#E9DCC0"/><path d="M306 108 L306 148" stroke-width="1"/><path d="M298 148 L306 128 L314 148 Z" fill="#7A5236" stroke-width="1"/>
      </g>
      <!-- acacia's -->
      <g stroke="${INK}" stroke-width="1.3">
        <path d="M358 146 q2 -16 -4 -26" fill="none" stroke="#5A3A1E" stroke-width="2.6"/>
        <path d="M330 122 q4 -10 20 -10 q10 -6 22 -1 q12 0 14 11 q-28 6 -56 0z" fill="#7A9A4A"/>
        <path d="M30 148 q2 -22 -6 -40 M32 126 q8 -12 20 -18" fill="none" stroke="#5A3A1E" stroke-width="3"/>
        <path d="M-4 108 q6 -16 28 -16 q12 -8 30 -2 q14 0 18 15 q-36 8 -76 3z" fill="#7A9A4A"/>
      </g>
      <!-- giraf -->
      <g stroke="${INK}" stroke-width="1.2">
        <path d="M54 154 v-26 M61 154 v-26 M80 154 v-26 M87 154 v-26" stroke="#B2753F" stroke-width="3" stroke-linecap="round"/>
        <path d="M50 122 q-5 4 -4 12" fill="none" stroke="#5A3A1E"/>
        <path d="M50 130 q0 -14 14 -14 h26 q10 0 10 10 v4 z" fill="#C8874A"/>
        <path d="M88 118 L102 64 l7 2 l-9 54 z" fill="#C8874A" stroke-linejoin="round"/>
        <path d="M100 66 q4 -8 12 -6 l8 5 q1 3 -3 4 h-12 z" fill="#C8874A" stroke-linejoin="round"/>
        <path d="M106 60 v-5 M110 60 v-5" stroke-width="1.4" stroke-linecap="round"/>
      </g>
      <circle cx="112" cy="63" r="0.9" fill="${INK}"/>
      <g fill="#7A4A1C">${[[60, 122, 2.2], [72, 124, 2], [84, 121, 2], [66, 128, 1.6], [92, 110, 1.6], [96, 96, 1.4], [99, 82, 1.2], [102, 71, 1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
    `, 'banner-safarilodge'),

    hanok: () => svg('0 0 393 200', `
      <rect width="393" height="200" fill="#24394A"/>
      ${stars([[30, 30, 1.2], [90, 16, 1], [150, 40, 1.2], [210, 14, 1], [370, 90, 1.2], [250, 50, 1]], '#F3EDE3')}
      <circle cx="306" cy="50" r="28" fill="#F5E6B8" stroke="${INK}" stroke-width="1.5"/>
      <circle cx="296" cy="42" r="5" fill="#EAD9A6"/><circle cx="316" cy="60" r="3.6" fill="#EAD9A6"/>
      <path d="M0 132 L70 72 L130 116 L200 62 L270 112 L330 84 L393 122 V200 H0 Z" fill="#3E5A55" stroke="${INK}" stroke-width="1.3"/>
      <path d="M0 150 q80 -24 170 -8 q110 -22 223 4 V200 H0 Z" fill="#4F6E64" stroke="${INK}" stroke-width="1.3"/>
      <rect x="0" y="158" width="393" height="42" fill="#D9CFBC"/><path d="M0 158 h393" stroke="${INK}" stroke-width="1.5"/>
      <!-- de hanok -->
      <g stroke="${INK}" stroke-width="1.5">
        <rect x="116" y="148" width="168" height="10" fill="#BFC0B5"/>
        <rect x="128" y="114" width="144" height="34" fill="#FAF5EF"/>
        ${[128, 164, 200, 236, 272].map(x => `<path d="M${x} 114 V148" stroke="#7A4A26" stroke-width="3"/>`).join('')}
        ${[134, 170, 206, 242].map(x => `<rect x="${x + 2}" y="119" width="20" height="25" fill="#F5E6B8" stroke-width="1"/>`).join('')}
        <path d="M150 90 L250 90 L262 104 L138 104 Z" fill="#4A4A4A"/>
        <path d="M92 100 Q120 110 144 104 L256 104 Q280 110 308 100 L292 118 L108 118 Z" fill="#3B3B3B"/>
      </g>
      <g stroke="#B8955C" stroke-width="0.6">${[134, 170, 206, 242].map(x => `<path d="M${x + 12} 119 v25 M${x + 2} 127 h20 M${x + 2} 136 h20"/>`).join('')}</g>
      <!-- den, onggi-kruiken en een kakiboom -->
      <path d="M52 158 q-6 -30 6 -56 q6 -12 -2 -24" fill="none" stroke="#8B4A2B" stroke-width="4" stroke-linecap="round"/>
      <g stroke="${INK}" stroke-width="1.2" fill="#3F6B4A"><path d="M24 104 q24 -14 50 0 q-24 6 -50 0z"/><path d="M36 84 q20 -12 42 0 q-20 6 -42 0z"/><path d="M46 126 q20 -10 40 0 q-20 6 -40 0z"/></g>
      <g stroke="${INK}" stroke-width="1.2" fill="#7A4A26">${[[320, 170, 12, 10], [346, 172, 10, 8], [366, 170, 12, 10], [334, 186, 11, 9], [358, 188, 10, 8]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/><rect x="${x - rx / 2}" y="${y - ry - 2}" width="${rx}" height="3" rx="1" fill="#5A3A1E"/>`).join('')}</g>
      <g stroke="${INK}" stroke-width="1"><path d="M358 158 q-2 -20 4 -36 M360 140 q10 -8 20 -8 M360 130 q-10 -6 -18 -4" fill="none" stroke="#5A3A2E" stroke-width="2.4"/>${[[378, 130], [344, 124], [366, 120], [352, 136]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#E8742C"/>`).join('')}</g>
    `, 'banner-hanok')
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
    ],
    oceaanstomer: [
      `<g><g stroke-linecap="round"><path d="M20 2 V6.4 M20 33.6 V38 M2 20 H6.4 M33.6 20 H38 M7.3 7.3 L10.1 10.1 M32.7 32.7 L29.9 29.9 M32.7 7.3 L29.9 10.1 M7.3 32.7 L10.1 29.9" stroke="#3B2A1B" stroke-width="3.8"/><path d="M20 2 V6.4 M20 33.6 V38 M2 20 H6.4 M33.6 20 H38 M7.3 7.3 L10.1 10.1 M32.7 32.7 L29.9 29.9 M32.7 7.3 L29.9 10.1 M7.3 32.7 L10.1 29.9" stroke="#A86B3C" stroke-width="2.2"/></g><path d="M20 6 V34 M6 20 H34 M10.1 10.1 L29.9 29.9 M29.9 10.1 L10.1 29.9" stroke="#7A4A22" stroke-width="1.8"/><circle cx="20" cy="20" r="11.5" fill="none" stroke="#3B2A1B" stroke-width="4.6"/><circle cx="20" cy="20" r="11.5" fill="none" stroke="#A86B3C" stroke-width="2.8"/><circle cx="20" cy="20" r="3.8" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.2"/><circle cx="20" cy="20" r="1.2" fill="#7A5A1C"/></g>`,
      `<g><path d="M16.5 25 h7 l2 9 h-11z" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.2" stroke-linejoin="round"/><rect x="11" y="33.5" width="18" height="3" rx="1" fill="#7A5A1C"/><circle cx="20" cy="15" r="11" fill="#E0B95A" stroke="#7A5A1C" stroke-width="1.3"/><circle cx="20" cy="15" r="8" fill="#FAF5EF" stroke="#7A5A1C" stroke-width="0.9"/><path d="M13.07 19 A8 8 0 0 0 26.93 19 L20 15z" fill="#B3261E" opacity="0.85"/><path d="M20 15 V7.4 M20 15 L14.3 9.3 M20 15 L25.7 9.3 M20 15 H12.2 M20 15 H27.8" stroke="#8A7A60" stroke-width="0.7"/><path d="M20 15 L27 7.5" stroke="#3B2A1B" stroke-width="2" stroke-linecap="round"/><circle cx="27.6" cy="6.8" r="2.1" fill="#B3261E" stroke="#3B2A1B" stroke-width="0.8"/><circle cx="20" cy="15" r="1.7" fill="#3B2A1B"/></g>`,
      `<g><circle cx="20" cy="20" r="13" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.3"/><circle cx="20" cy="20" r="9" fill="#8CC3DE" stroke="#7A5A1C" stroke-width="1.2"/><path d="M14 16 q4 -4 9 -3" fill="none" stroke="#FAF5EF" stroke-width="1.6" stroke-linecap="round"/><g fill="#7A5A1C"><circle cx="20" cy="9" r="0.9"/><circle cx="31" cy="20" r="0.9"/><circle cx="20" cy="31" r="0.9"/><circle cx="9" cy="20" r="0.9"/><circle cx="27.8" cy="12.2" r="0.9"/><circle cx="27.8" cy="27.8" r="0.9"/><circle cx="12.2" cy="27.8" r="0.9"/><circle cx="12.2" cy="12.2" r="0.9"/></g></g>`,
      `<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12.5 24.5 V35 M32 24.5 V35 M22 24.5 V35" stroke="#7A5236" stroke-width="2.2"/><path d="M5.5 6.5 L11.5 24.5 H35" stroke="#7A5236" stroke-width="2.4"/><path d="M8.6 17 H17.5 V24" stroke="#7A5236" stroke-width="1.7"/><path d="M7.6 8.5 L12.6 21.6 H33.6" stroke="#5A1A12" stroke-width="5.6"/><path d="M7.6 8.5 L12.6 21.6 H33.6" stroke="#FAF5EF" stroke-width="4.2"/><path d="M7.6 8.5 L12.6 21.6 H33.6" stroke="#C0392B" stroke-width="2.6"/><path d="M7.6 8.5 L12.6 21.6 H33.6" stroke="#FAF5EF" stroke-width="0.9"/></g>`,
      `<g><path d="M9 6.5 h22" stroke="#5A3A1E" stroke-width="2.6" stroke-linecap="round"/><path d="M20 7 v4.5" stroke="#7A5A1C" stroke-width="2.4"/><path d="M12.5 28 q0 -17 7.5 -17 q7.5 0 7.5 17 l3 2.5 h-21z" fill="#E0B95A" stroke="#7A5A1C" stroke-width="1.3" stroke-linejoin="round"/><path d="M11 27 h18" stroke="#7A5A1C" stroke-width="1"/><path d="M15.6 25 q-0.6 -7 2.4 -10.5" fill="none" stroke="#FFF3C4" stroke-width="1.5" stroke-linecap="round"/><circle cx="20" cy="32.6" r="2.1" fill="#7A5A1C"/><path d="M20 34.6 q-2.6 2 -0.6 4.6" stroke="#C7A06A" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`,
      `<g stroke="${INK}" stroke-width="1.3"><circle cx="24" cy="7" r="3.4" fill="#DCE3EA"/><circle cx="29" cy="4.5" r="2.4" fill="#DCE3EA"/><rect x="13" y="11" width="14" height="23" fill="#E0A848"/><rect x="13" y="11" width="14" height="6" fill="#1A1A1A"/><path d="M9 34 h22" stroke-width="2"/></g>`,
      `<g><path d="M8 22 v10 a12 3.6 0 0 0 24 0 v-10" fill="#E7A9CF" stroke="#7A3A5C" stroke-width="1.2"/><path d="M12 24.7 v10.4 M16.5 25.4 v10.6 M23.5 25.4 v10.6 M28 24.7 v10.4" stroke="#FAF5EF" stroke-width="1.3"/><ellipse cx="20" cy="22" rx="12.6" ry="3.6" fill="#F3C6DF" stroke="#7A3A5C" stroke-width="1.2"/><ellipse cx="20" cy="17.6" rx="13.8" ry="3" fill="#3B4E6B" stroke="#1A1108" stroke-width="1.1"/><path d="M14 17.6 q0 -8 6 -8 q6 0 6 8z" fill="#4A6080" stroke="#1A1108" stroke-width="1.1"/><path d="M14.3 15 q5.7 1.8 11.4 0" fill="none" stroke="#B3261E" stroke-width="1.9"/><path d="M24 12.6 q7 -10 12.5 -7 q-5.5 0.4 -12.5 7z" fill="#FAF5EF" stroke="#8A7A60" stroke-width="0.8"/></g>`
    ],
    ryokan: [
      `<g stroke-linejoin="round"><rect x="12" y="33" width="16" height="3.2" rx="0.8" fill="#A9AA9F" stroke="#4E5550" stroke-width="1.1"/><rect x="17" y="25" width="6" height="8" fill="#BFC0B5" stroke="#4E5550" stroke-width="1.1"/><path d="M11.5 21.5 h17 l-2 3.5 h-13z" fill="#A9AA9F" stroke="#4E5550" stroke-width="1.1"/><rect x="14" y="13.5" width="12" height="8" fill="#BFC0B5" stroke="#4E5550" stroke-width="1.1"/><rect x="16.5" y="15.2" width="7" height="4.6" fill="#F5D67A" stroke="#7A5A1C" stroke-width="0.9"/><path d="M5.5 14.8 Q13 13.4 15 9 H25 Q27 13.4 34.5 14.8z" fill="#A9AA9F" stroke="#4E5550" stroke-width="1.1"/><path d="M18 9 q2 -5 4 0z" fill="#BFC0B5" stroke="#4E5550" stroke-width="1"/><circle cx="20" cy="4.6" r="1.6" fill="#BFC0B5" stroke="#4E5550" stroke-width="1"/><path d="M12.5 33 q2.2 -2.2 4.5 0 M24 33 q2 -1.6 4 0" stroke="#5C8B5E" stroke-width="1.5" fill="none" stroke-linecap="round"/></g>`,
      `<g><path d="M12 15 Q20 3 28 15" fill="none" stroke="#2C2C2C" stroke-width="2.2" stroke-linecap="round"/><path d="M29 25 q5 -1 7 -8" fill="none" stroke="#1A1108" stroke-width="4.2" stroke-linecap="round"/><path d="M29 25 q5 -1 7 -8" fill="none" stroke="#5A5A5A" stroke-width="2.2" stroke-linecap="round"/><path d="M7 25 q0 -10 13 -10 q13 0 13 10 q0 9 -13 9 q-13 0 -13 -9z" fill="#4A4A4A" stroke="#1A1108" stroke-width="1.3"/><g fill="#727272"><circle cx="12.0" cy="19.5" r="0.85"/><circle cx="15.2" cy="19.5" r="0.85"/><circle cx="18.4" cy="19.5" r="0.85"/><circle cx="21.6" cy="19.5" r="0.85"/><circle cx="24.8" cy="19.5" r="0.85"/><circle cx="28.0" cy="19.5" r="0.85"/><circle cx="9.5" cy="23" r="0.85"/><circle cx="13.0" cy="23" r="0.85"/><circle cx="16.5" cy="23" r="0.85"/><circle cx="20.0" cy="23" r="0.85"/><circle cx="23.5" cy="23" r="0.85"/><circle cx="27.0" cy="23" r="0.85"/><circle cx="30.5" cy="23" r="0.85"/><circle cx="9.5" cy="26.5" r="0.85"/><circle cx="13.0" cy="26.5" r="0.85"/><circle cx="16.5" cy="26.5" r="0.85"/><circle cx="20.0" cy="26.5" r="0.85"/><circle cx="23.5" cy="26.5" r="0.85"/><circle cx="27.0" cy="26.5" r="0.85"/><circle cx="30.5" cy="26.5" r="0.85"/><circle cx="11.5" cy="30" r="0.85"/><circle cx="14.9" cy="30" r="0.85"/><circle cx="18.3" cy="30" r="0.85"/><circle cx="21.7" cy="30" r="0.85"/><circle cx="25.1" cy="30" r="0.85"/><circle cx="28.5" cy="30" r="0.85"/></g><ellipse cx="20" cy="15.6" rx="5.5" ry="1.7" fill="#3A3A3A" stroke="#1A1108" stroke-width="1"/><circle cx="20" cy="13.4" r="1.5" fill="#C9A227" stroke="#7A5A1C" stroke-width="0.6"/></g>`,
      `<g stroke-linejoin="round"><path d="M3.5 11 L12 8 V31 L3.5 34z" fill="#E8C66A" stroke="#3B2A1B" stroke-width="1.2"/><path d="M12 8 L20.5 11 V34 L12 31z" fill="#D4AE4E" stroke="#3B2A1B" stroke-width="1.2"/><path d="M20.5 11 L29 8 V31 L20.5 34z" fill="#E8C66A" stroke="#3B2A1B" stroke-width="1.2"/><path d="M29 8 L37.5 11 V34 L29 31z" fill="#D4AE4E" stroke="#3B2A1B" stroke-width="1.2"/><path d="M4.5 27.5 Q11 21.5 16.5 23.5 Q24 26 34.5 15" fill="none" stroke="#5A3A1E" stroke-width="1.4" stroke-linecap="round"/><path d="M24 23.5 q2 -4 5 -5" fill="none" stroke="#5A3A1E" stroke-width="1" stroke-linecap="round"/><g fill="#F3B6C6" stroke="#B3476A" stroke-width="0.6"><circle cx="9" cy="23.6" r="1.7"/><circle cx="14.5" cy="22.2" r="1.7"/><circle cx="21" cy="24.6" r="1.7"/><circle cx="28.6" cy="18.6" r="1.7"/><circle cx="31.5" cy="17.6" r="1.5"/><circle cx="34.6" cy="13.6" r="1.6"/><circle cx="26.5" cy="21.8" r="1.4"/></g></g>`,
      `<g><path d="M5 33 q10 -6 14 -16 q4 -7 15 -9" fill="none" stroke="#5A3A2E" stroke-width="2" stroke-linecap="round"/><path d="M19 17 q-6 -4 -8 -10" fill="none" stroke="#5A3A2E" stroke-width="1.4" stroke-linecap="round"/><g fill="#F0B8C8" stroke="#B3476A" stroke-width="0.7"><circle cx="11" cy="7" r="3.6"/><circle cx="31" cy="9" r="3.8"/><circle cx="15" cy="25" r="3.4"/><circle cx="26" cy="15" r="3"/></g><g fill="#B3476A"><circle cx="11" cy="7" r="0.9"/><circle cx="31" cy="9" r="0.9"/><circle cx="15" cy="25" r="0.9"/><circle cx="26" cy="15" r="0.8"/></g></g>`,
      `<g><path d="M9 30 h22 l-2.5 5 h-17z" fill="#3B5E8C" stroke="#1F3550" stroke-width="1.2" stroke-linejoin="round"/><rect x="7.5" y="28.5" width="25" height="2.6" rx="1" fill="#4A72A3" stroke="#1F3550" stroke-width="1"/><path d="M20 28.5 q-4.5 -4 0 -8 q4 -4 -1 -9.5" fill="none" stroke="#6B4423" stroke-width="3" stroke-linecap="round"/><path d="M19.6 20.4 q4 -1 7 -4.2 M19.3 15 q-4 0 -7.2 2.2" fill="none" stroke="#6B4423" stroke-width="1.8" stroke-linecap="round"/><g fill="#3F7D4E" stroke="#24502F" stroke-width="1"><ellipse cx="11" cy="17.5" rx="6" ry="3.2"/><ellipse cx="28" cy="15" rx="6.5" ry="3.4"/><ellipse cx="18" cy="8.5" rx="6.5" ry="3.4"/></g><g fill="#6FA36A"><ellipse cx="10" cy="16.5" rx="3" ry="1.2"/><ellipse cx="27" cy="14" rx="3.2" ry="1.2"/><ellipse cx="17" cy="7.5" rx="3.2" ry="1.2"/></g></g>`,
      `<g><path d="M20 18 L25.5 37" stroke="#7A5236" stroke-width="1.9" stroke-linecap="round"/><path d="M3 21 Q20 -2 37 21 Q20 15 3 21z" fill="#C0392B" stroke="#6A1C14" stroke-width="1.2" stroke-linejoin="round"/><path d="M8.2 17.4 Q20 2.6 31.8 17.4" fill="none" stroke="#FAF5EF" stroke-width="1.5"/><path d="M20 9.6 L6.4 19.9 M20 9.6 L11.5 18.75 M20 9.6 V18 M20 9.6 L28.5 18.75 M20 9.6 L33.6 19.9" stroke="#6A1C14" stroke-width="0.7"/><circle cx="20" cy="8.4" r="1.5" fill="#3B2A1B"/></g>`,
      `<g><rect x="5" y="27" width="30" height="7.5" rx="3.2" fill="#2E4A7A" stroke="#1A2A45" stroke-width="1.2"/><g fill="#FAF5EF" opacity="0.85"><circle cx="10" cy="30.8" r="0.9"/><circle cx="15" cy="30.8" r="0.9"/><circle cx="20" cy="30.8" r="0.9"/><circle cx="25" cy="30.8" r="0.9"/><circle cx="30" cy="30.8" r="0.9"/></g><rect x="6.5" y="20.5" width="27" height="7" rx="3" fill="#FAF5EF" stroke="#8A7A60" stroke-width="1.1"/><path d="M10 24 h20" stroke="#C9B79C" stroke-width="0.9" stroke-dasharray="2 2"/><rect x="8" y="14" width="24" height="7" rx="3" fill="#D9737F" stroke="#7A2A3C" stroke-width="1.1"/><path d="M11.5 18 l2 -1.6 l2 1.6 l2 -1.6 l2 1.6 l2 -1.6 l2 1.6 l2 -1.6 l2 1.6 l2 -1.6 l2 1.6" fill="none" stroke="#FAF5EF" stroke-width="0.8"/><rect x="13" y="8.5" width="14" height="6" rx="2.8" fill="#E8D49A" stroke="#7A5A1C" stroke-width="1.1"/></g>`
    ],
    fazenda: [
      `<g stroke-linejoin="round"><path d="M10 13 q-3.5 10.5 -1 21 q11 3 22 0 q2.5 -10.5 -1 -21z" fill="#C7A06A" stroke="#7A5236" stroke-width="1.3"/><path d="M10.5 13.5 q1 -6.5 4.5 -4.5 q2 2.6 5 1.4 q3 -1.4 5 -1.4 q3.5 -1.5 4.5 4.5z" fill="#D9B989" stroke="#7A5236" stroke-width="1.2"/><path d="M10.6 14.6 q9.4 2.6 18.8 0" fill="none" stroke="#5A3A1E" stroke-width="1.8" stroke-linecap="round"/><path d="M9.6 20 q10.4 1.6 20.8 0 M9 29.6 q11 1.6 22 0" fill="none" stroke="#3F7D4E" stroke-width="1.5"/><ellipse cx="20" cy="24.8" rx="3.3" ry="4.3" fill="#5A3A1E" transform="rotate(25 20 24.8)"/><path d="M19 21.4 q2.6 3.2 0.6 6.8" fill="none" stroke="#C7A06A" stroke-width="0.9"/></g>`,
      `<g><rect x="9" y="20" width="22" height="15" rx="1.2" fill="#8B5A2B" stroke="#3B2A1B" stroke-width="1.2"/><rect x="12" y="26.5" width="16" height="5.5" rx="1" fill="#6B4423" stroke="#3B2A1B" stroke-width="0.9"/><circle cx="20" cy="29.2" r="1.1" fill="#C9A227"/><rect x="8" y="18.5" width="24" height="2.4" rx="0.8" fill="#6B4423" stroke="#3B2A1B" stroke-width="0.9"/><path d="M12 18.5 q8 -9 16 0z" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.2"/><path d="M20 12.5 v-4 h10 v-3" fill="none" stroke="#3B2A1B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="28.5" y="1.8" width="3" height="4.6" rx="1.4" fill="#6B4423" stroke="#3B2A1B" stroke-width="0.8"/><circle cx="20" cy="13" r="1.8" fill="#7A5A1C"/></g>`,
      `<g><path d="M15 12 q-2 -3 0 -6 M21 12 q-2 -3 0 -6" fill="none" stroke="#C9B79C" stroke-width="1.2" stroke-linecap="round"/><path d="M10 18 h18 v8 q0 8 -9 8 q-9 0 -9 -8z" fill="#FAF5EF" stroke="#7A5236" stroke-width="1.3"/><path d="M28 20 q6 0 6 4 q0 4 -6 4" fill="none" stroke="#7A5236" stroke-width="1.6"/><ellipse cx="19" cy="18" rx="9" ry="2" fill="#5A3A1E"/><path d="M6 35.5 h26" stroke="#7A5236" stroke-width="2" stroke-linecap="round"/></g>`,
      `<g><ellipse cx="20" cy="35" rx="11" ry="2.2" fill="#9C6B43"/><path d="M20 35 V10 M20 24 L11 16 M20 28 L30 20 M20 18 L28 11" stroke="#6B4423" stroke-width="1.6" stroke-linecap="round" fill="none"/><g fill="#2E7D4F" stroke="#1B4D30" stroke-width="0.8"><ellipse cx="12.5" cy="12.5" rx="4.4" ry="2" transform="rotate(-35 12.5 12.5)"/><ellipse cx="8.5" cy="18.5" rx="4.4" ry="2" transform="rotate(20 8.5 18.5)"/><ellipse cx="26.5" cy="7" rx="4.4" ry="2" transform="rotate(-30 26.5 7)"/><ellipse cx="31.5" cy="12.5" rx="4.4" ry="2" transform="rotate(20 31.5 12.5)"/><ellipse cx="32" cy="21" rx="4.4" ry="2" transform="rotate(-15 32 21)"/><ellipse cx="20" cy="7" rx="4.2" ry="1.9" transform="rotate(90 20 7)"/><ellipse cx="13.5" cy="25.5" rx="4.4" ry="2" transform="rotate(-25 13.5 25.5)"/><ellipse cx="27.5" cy="28" rx="4.4" ry="2" transform="rotate(25 27.5 28)"/></g><g fill="#C62828" stroke="#6A1C14" stroke-width="0.6"><circle cx="16" cy="20.5" r="1.7"/><circle cx="17.8" cy="22.6" r="1.7"/><circle cx="15" cy="23.2" r="1.6"/><circle cx="23.4" cy="23.6" r="1.7"/><circle cx="25.4" cy="25" r="1.6"/><circle cx="23" cy="26.2" r="1.6"/><circle cx="22.4" cy="14" r="1.6"/><circle cx="24.2" cy="15.6" r="1.6"/></g></g>`,
      `<g stroke-linejoin="round"><path d="M4 28.5 h24" stroke="#7A5236" stroke-width="2.4" stroke-linecap="round"/><path d="M21 25 L32 38 L27.5 38.5 L18.5 27z" fill="#2E6DA4" stroke="#1F3550" stroke-width="1"/><path d="M21.5 25.5 L30 36.5" stroke="#D32F2F" stroke-width="1.6"/><ellipse cx="18.5" cy="19.5" rx="6" ry="8.6" fill="#D32F2F" stroke="#6A1C14" stroke-width="1.2" transform="rotate(-18 18.5 19.5)"/><path d="M19.5 14 q8 4 6 14.5 q-6 -2.5 -7.5 -9z" fill="#F2C14E" stroke="#7A5A1C" stroke-width="1"/><path d="M21 19 q4.4 3.2 4.3 9.2 q-4 -2.2 -5.3 -6.4z" fill="#2E6DA4" stroke="#1F3550" stroke-width="0.9"/><circle cx="15" cy="10" r="5.2" fill="#D32F2F" stroke="#6A1C14" stroke-width="1.2"/><ellipse cx="13.4" cy="10.6" rx="2.6" ry="2.1" fill="#FAF5EF"/><circle cx="13.6" cy="10.2" r="0.95" fill="#1A1108"/><path d="M10.6 8.6 q-4.4 0.6 -3.6 5.4 q1.6 -2 3.8 -2.2z" fill="#EDE6D6" stroke="#3B2A1B" stroke-width="0.9"/><path d="M14 28.5 v-2 M18 28.5 v-2" stroke="#3B2A1B" stroke-width="1.4" stroke-linecap="round"/></g>`,
      `<g><ellipse cx="20" cy="26" rx="16" ry="5" fill="#E3C58E" stroke="#7A5236" stroke-width="1.2"/><path d="M12 25 q0 -12 8 -12 q8 0 8 12z" fill="#E3C58E" stroke="#7A5236" stroke-width="1.2"/><path d="M12.4 22 q7.6 2 15.2 0" stroke="#B3261E" stroke-width="2" fill="none"/></g>`,
      `<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M26.5 21 L30.8 6 L34 6.8 L30 22z" fill="#E3C58E" stroke="#7A5236" stroke-width="1"/><path d="M27.6 17 l4.6 0.8 M28.6 13 l4.6 0.8 M29.6 9.2 l4.4 0.8" stroke="#B8955C" stroke-width="0.7"/><path d="M4.5 32.5 Q19 39 35 31" stroke="#5A3A1E" stroke-width="2.6"/><path d="M10 35 L12 22.5 M28 35.4 L28.6 22.5" stroke="#7A5236" stroke-width="2"/><path d="M10 22.5 H30" stroke="#7A5236" stroke-width="2.6"/><path d="M29 22.5 L33.5 4.5" stroke="#7A5236" stroke-width="2.2"/><path d="M30.8 14.5 H14.5 Q11.5 14.5 11.6 18 L11.8 22.5" stroke="#7A5236" stroke-width="1.8"/><path d="M14.6 14.5 q-3 -3 -6 -1" stroke="#7A5236" stroke-width="1.4"/></g>`
    ],
    zeppelin: [
      `<g><path d="M6 29.5 A15.5 15.5 0 0 0 11 34.5 M34 10.5 A15.5 15.5 0 0 0 29 5.5" fill="none" stroke="#7A8794" stroke-width="1.4" stroke-dasharray="2.2 2" stroke-linecap="round"/><path d="M20 20 C16.5 15.5 12 9 7.5 5.5 C4.5 3.5 2.5 6.5 4.5 9.5 C8 14 14 17.5 20 20z" fill="#A86B3C" stroke="#5A3A1E" stroke-width="1.2" stroke-linejoin="round"/><path d="M20 20 C23.5 24.5 28 31 32.5 34.5 C35.5 36.5 37.5 33.5 35.5 30.5 C32 26 26 22.5 20 20z" fill="#A86B3C" stroke="#5A3A1E" stroke-width="1.2" stroke-linejoin="round"/><path d="M7.5 5.5 C4.5 3.5 2.5 6.5 4.5 9.5 C5.2 10.4 6 11.2 6.9 12 L10.4 8.2 C9.4 7.2 8.5 6.3 7.5 5.5z" fill="#C9A227" stroke="#5A3A1E" stroke-width="0.9" stroke-linejoin="round"/><path d="M32.5 34.5 C35.5 36.5 37.5 33.5 35.5 30.5 C34.8 29.6 34 28.8 33.1 28 L29.6 31.8 C30.6 32.8 31.5 33.7 32.5 34.5z" fill="#C9A227" stroke="#5A3A1E" stroke-width="0.9" stroke-linejoin="round"/><path d="M8.5 10 q5 5 11 9.5 M31.5 30 q-5 -5 -11 -9.5" fill="none" stroke="#D9A36F" stroke-width="1"/><circle cx="20" cy="20" r="4.6" fill="#BFC9D4" stroke="#5A6470" stroke-width="1.2"/><circle cx="20" cy="20" r="1.6" fill="#5A6470"/></g>`,
      `<g stroke-linecap="round" stroke-linejoin="round"><path d="M20 5 L8.5 29 M20 5 L31.5 29" stroke="#7A5A1C" stroke-width="3.4"/><path d="M20 5 L8.5 29 M20 5 L31.5 29" stroke="#E0B95A" stroke-width="1.8"/><path d="M7.5 29 Q20 36 32.5 29" fill="none" stroke="#7A5A1C" stroke-width="4.6"/><path d="M7.5 29 Q20 36 32.5 29" fill="none" stroke="#E0B95A" stroke-width="3"/><path d="M10 30.7 l0.6 -1.4 M13 31.9 l0.4 -1.5 M16.5 32.6 l0.2 -1.6 M20 32.8 v-1.6 M23.5 32.6 l-0.2 -1.6 M27 31.9 l-0.4 -1.5 M30 30.7 l-0.6 -1.4" stroke="#7A5A1C" stroke-width="0.7"/><path d="M20 5 L24.5 33.5" stroke="#3B2A1B" stroke-width="1.6"/><rect x="10.5" y="15" width="16" height="3.8" rx="1.4" fill="#4A4A4A" stroke="#1A1108" stroke-width="0.9"/><rect x="25.8" y="14.4" width="2.6" height="5" rx="0.8" fill="#2C2C2C"/><rect x="17.2" y="3" width="5.6" height="4.4" rx="0.6" fill="#DCEBF0" stroke="#5A6470" stroke-width="1"/><circle cx="20" cy="5.2" r="1.3" fill="#7A5A1C"/></g>`,
      `<g stroke="${INK}" stroke-width="1.2"><path d="M9 18 L3 12 L6 20 L3 28 L9 22 Z" fill="#A9B8C8"/><ellipse cx="21" cy="20" rx="15" ry="7" fill="#D8DEE6"/><path d="M12 17 q9 -4 20 0" fill="none" stroke="#FAF5EF" stroke-width="1.6"/><path d="M17 27 h8 l-1 3 h-6z" fill="#E9E4D6"/></g>`,
      `<g stroke-linejoin="round"><g transform="rotate(-12 20 10)"><rect x="12.5" y="4" width="15" height="10" fill="#FAF5EF" stroke="#3B2A1B" stroke-width="0.9"/><rect x="13.6" y="5.1" width="12.8" height="7.8" fill="none" stroke="#B3261E" stroke-width="1.4" stroke-dasharray="2 2"/><rect x="13.6" y="5.1" width="12.8" height="7.8" fill="none" stroke="#1F4E79" stroke-width="1.4" stroke-dasharray="2 2" stroke-dashoffset="2"/><rect x="22.4" y="6.6" width="2.6" height="3" fill="#D9A441"/></g><path d="M9.5 15 q-3.5 10 -0.5 20 q11 3 22 0 q3 -10 -0.5 -20z" fill="#8A97A3" stroke="#3B4450" stroke-width="1.3"/><path d="M10.4 16 q9.6 3 19.2 0" fill="none" stroke="#5A3A1E" stroke-width="1.8" stroke-linecap="round"/><path d="M13 22 h14 v8 h-14z" fill="#DCE3EA" stroke="#3B4450" stroke-width="0.9"/><path d="M15 25 h10 M15 27.4 h7" stroke="#5A6470" stroke-width="0.8"/></g>`,
      `<g><path d="M20 31 v4 M13 36 h14" stroke="#7A5236" stroke-width="2.2" stroke-linecap="round"/><path d="M9.6 8.4 A14 14 0 0 0 30.4 29.6" fill="none" stroke="#C9A227" stroke-width="2.2"/><circle cx="20" cy="19" r="11" fill="#8CC3DE" stroke="#1F4E79" stroke-width="1.2"/><g fill="#9FCBA8" stroke="#3F7D4E" stroke-width="0.8" stroke-linejoin="round"><path d="M11.5 13 q3 -4 7 -2.5 q1 3 -2 4.5 q-0.5 3 -2 6 q-2.5 -0.5 -3 -3.5 q-1.5 -2 0 -4.5z"/><path d="M16.5 22.5 q2.5 -0.5 3 2 q-0.5 4 -2 6 q-2 -2 -2 -5z"/><path d="M22.5 11 q4 -1 6.5 1.5 q-1 3 -3.5 3 q1.5 4 -0.5 7.5 q-2.5 -1 -3 -5 q-2 -2 0.5 -7z"/></g><ellipse cx="20" cy="19" rx="5" ry="11" fill="none" stroke="#1F4E79" stroke-width="0.6" opacity="0.6"/><path d="M9 19 h22" stroke="#1F4E79" stroke-width="0.6" opacity="0.6"/></g>`,
      `<g>${cloud(8, 22, 0.85)}</g>`,
      `<g stroke-linejoin="round"><rect x="12" y="3.5" width="16" height="11" fill="#FAF5EF" stroke="#8A7A60" stroke-width="1"/><path d="M14.5 7 h11 M14.5 9.6 h8" stroke="#8A97A3" stroke-width="0.8"/><rect x="6" y="12.5" width="28" height="4" rx="2" fill="#2C2C2C" stroke="#111" stroke-width="1"/><path d="M34 14.5 h2.6 v-4" stroke="#BFC9D4" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M8 17 h24 l3 15 h-30z" fill="#3A3A3A" stroke="#111" stroke-width="1.2"/><path d="M15 17 q5 5 10 0" fill="#555" stroke="#111" stroke-width="0.8"/><g fill="#FAF5EF" stroke="#111" stroke-width="0.5"><circle cx="11.5" cy="24" r="1.2"/><circle cx="15" cy="24" r="1.2"/><circle cx="18.5" cy="24" r="1.2"/><circle cx="22" cy="24" r="1.2"/><circle cx="25.5" cy="24" r="1.2"/><circle cx="29" cy="24" r="1.2"/><circle cx="10.5" cy="27.5" r="1.2"/><circle cx="14" cy="27.5" r="1.2"/><circle cx="17.5" cy="27.5" r="1.2"/><circle cx="21" cy="27.5" r="1.2"/><circle cx="24.5" cy="27.5" r="1.2"/><circle cx="28" cy="27.5" r="1.2"/><circle cx="31.5" cy="27.5" r="1.2"/></g><rect x="13" y="29.6" width="14" height="1.6" rx="0.8" fill="#FAF5EF" stroke="#111" stroke-width="0.5"/></g>`
    ],
    poolstation: [
      `<g><path d="M28 12 L33 3" stroke="#4A4A4A" stroke-width="1.3" stroke-linecap="round"/><circle cx="33" cy="3" r="1.3" fill="#B3261E"/><path d="M31 21 q5 1 4.5 7" fill="none" stroke="#1A1A1A" stroke-width="1"/><rect x="3" y="12" width="29" height="19" rx="2" fill="#6B7A5E" stroke="#2C3324" stroke-width="1.3"/><rect x="6" y="15" width="13" height="7" rx="1" fill="#F5E6B8" stroke="#2C3324" stroke-width="0.9"/><path d="M8 18.5 h9" stroke="#7A5A1C" stroke-width="0.7"/><path d="M8 17 v3 M10.5 17 v3 M13 17 v3 M15.5 17 v3" stroke="#7A5A1C" stroke-width="0.5"/><path d="M12 15.6 v5.8" stroke="#B3261E" stroke-width="1.1"/><circle cx="25.5" cy="18.5" r="3.4" fill="#2C2C2C" stroke="#111" stroke-width="0.9"/><path d="M25.5 15.8 v2.4" stroke="#BFC9D4" stroke-width="1.1" stroke-linecap="round"/><g fill="#2C3324"><circle cx="8" cy="26.5" r="1.1"/><circle cx="11.5" cy="26.5" r="1.1"/><circle cx="15" cy="26.5" r="1.1"/></g><circle cx="25.5" cy="26.5" r="1.8" fill="#F39C12" stroke="#7A5A1C" stroke-width="0.7"/><rect x="5" y="31" width="4" height="3" fill="#2C3324"/><rect x="26" y="31" width="4" height="3" fill="#2C3324"/><rect x="32.5" y="27.5" width="5" height="8" rx="2.2" fill="#2C2C2C" stroke="#111" stroke-width="0.8"/><path d="M33.5 30 h3 M33.5 32 h3" stroke="#6B6B6B" stroke-width="0.6"/></g>`,
      `<g><path d="M12 26 v8 M16 26 v8 M24 26 v8 M28 26 v8" stroke="#5A6470" stroke-width="2.4" stroke-linecap="round"/><path d="M9 19 q-7 -2 -4 -10 q5 -2 6 5" fill="#8A97A3" stroke="#3B4652" stroke-width="1.1" stroke-linejoin="round"/><path d="M7.5 20 q1 -6 9 -6 h9 q5 0 6 5 q0 8 -6 9 h-13 q-6 0 -5 -8z" fill="#8A97A3" stroke="#3B4652" stroke-width="1.2"/><path d="M11 26.3 q8 2.6 16 0" fill="none" stroke="#F3EDE3" stroke-width="2.4" stroke-linecap="round"/><path d="M21.5 14.4 v13.4" stroke="#B3261E" stroke-width="2.2"/><path d="M26 17 l0.5 -10 l3.6 4.6 l3.2 -4.6 l1.2 9.5 q4 2 4 5 q0 2.2 -2.3 2.2 h-6 q-4 0 -4.2 -3.3z" fill="#8A97A3" stroke="#3B4652" stroke-width="1.2" stroke-linejoin="round"/><path d="M30.5 18.4 q2.2 -2.6 4.4 0 q3 0.8 3.8 3.2 h-6 q-2.2 0 -2.2 -3.2z" fill="#F3EDE3"/><circle cx="38" cy="21.2" r="1" fill="#1A1108"/><circle cx="31.8" cy="15.6" r="0.9" fill="#1A1108"/></g>`,
      `<g stroke="${INK}" stroke-width="1.2"><ellipse cx="20" cy="24" rx="9" ry="12" fill="#2C2C2C"/><ellipse cx="20" cy="26" rx="6" ry="9" fill="#FAF5EF"/><circle cx="20" cy="12" r="6" fill="#2C2C2C"/><circle cx="18" cy="11" r="1" fill="#FAF5EF" stroke="none"/><path d="M21 13 l4 1.5 l-4 1z" fill="#F39C12" stroke-width="0.6"/><path d="M15 36.5 h4 M21 36.5 h4" stroke="#F39C12" stroke-width="2"/></g>`,
      `<g><path d="M20 25.5 q-3 4 0 8.5" fill="none" stroke="#5A6470" stroke-width="0.9"/><circle cx="20" cy="13.5" r="11" fill="#FAF5EF" stroke="#8A97A3" stroke-width="1.3"/><path d="M26 6.5 q5 6 0.5 14" fill="none" stroke="#DCE3EA" stroke-width="2.6" stroke-linecap="round"/><path d="M14 8 q2 -2.5 5 -3" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/><path d="M18.4 24 h3.2 l-1.6 2.6z" fill="#8A97A3"/><rect x="16" y="33.5" width="8" height="5" rx="1" fill="#F39C12" stroke="#7A5A1C" stroke-width="1"/><path d="M18 36 h4" stroke="#7A5A1C" stroke-width="0.8"/></g>`,
      `<g><path d="M8 21 v-5 q0 -2 2 -2 h5 l3.5 -6 h11 q2 0 2 2 v11z" fill="#E0632A" stroke="#7A2A1C" stroke-width="1.3" stroke-linejoin="round"/><path d="M19.3 9.6 h4 v4.8 h-6.8z" fill="#DCEBF0" stroke="#7A2A1C" stroke-width="0.8" stroke-linejoin="round"/><rect x="25" y="9.6" width="4.4" height="4.8" fill="#DCEBF0" stroke="#7A2A1C" stroke-width="0.8"/><rect x="4" y="20.5" width="32" height="4.5" rx="1.2" fill="#C24E1E" stroke="#7A2A1C" stroke-width="1"/><circle cx="34.3" cy="18.6" r="1.4" fill="#F5D67A" stroke="#7A5A1C" stroke-width="0.6"/><rect x="2.5" y="26" width="16" height="8.5" rx="4.2" fill="#3B3B3B" stroke="#111" stroke-width="1"/><rect x="21.5" y="26" width="16" height="8.5" rx="4.2" fill="#3B3B3B" stroke="#111" stroke-width="1"/><g fill="#8A97A3" stroke="#111" stroke-width="0.5"><circle cx="7" cy="30.2" r="2"/><circle cx="14" cy="30.2" r="2"/><circle cx="26" cy="30.2" r="2"/><circle cx="33" cy="30.2" r="2"/></g></g>`,
      `<g stroke="#8CC3DE" stroke-width="2" stroke-linecap="round"><path d="M20 6 v28 M7.9 13 l24.2 14 M7.9 27 l24.2 -14"/><path d="M17 9 l3 3 l3 -3 M17 31 l3 -3 l3 3" fill="none" stroke-width="1.4"/></g>`,
      `<g><path d="M8 35 h21 v-2.5 q0 -2 -2 -2 h-17 q-2 0 -2 2z" fill="#2C2C2C" stroke="#111" stroke-width="1"/><path d="M25 30.5 q7 -9 -1 -19" fill="none" stroke="#3B3B3B" stroke-width="3.6" stroke-linecap="round"/><rect x="9" y="23" width="16" height="2.8" rx="1" fill="#3B3B3B"/><rect x="11.5" y="21.8" width="9" height="1.3" fill="#8CC3DE"/><path d="M11.5 6 l5.6 -1.6 l5.2 15.2 l-4.4 1.4z" fill="#BFC9D4" stroke="#3B3B3B" stroke-width="1.1" stroke-linejoin="round"/><path d="M10.2 4.6 l7.4 -2.2 l0.9 2.8 l-7.4 2.2z" fill="#3B3B3B"/><path d="M17.6 20.8 l3.6 -1.1 l0.9 2.4 l-3.4 1z" fill="#C9A227" stroke="#7A5A1C" stroke-width="0.6"/><circle cx="27.6" cy="20.5" r="2.3" fill="#C9A227" stroke="#7A5A1C" stroke-width="0.8"/></g>`
    ],
    winterpaleis: [
      `<g><path d="M20 22 V4.5" stroke="#5A3A1E" stroke-width="2.6" stroke-linecap="round"/><path d="M17.8 1.5 h4.4 l-0.6 5 h-3.2z" fill="#3B2A1B"/><path d="M16.8 3 h-1.6 M16.8 5 h-1.6 M23.2 3 h1.6 M23.2 5 h1.6" stroke="#C9A227" stroke-width="1"/><path d="M20 13 Q27 22 34 35 Q20 38.5 6 35 Q13 22 20 13z" fill="#D99A4E" stroke="#7A4A1C" stroke-width="1.3" stroke-linejoin="round"/><path d="M13.5 30.5 Q20 18 26.5 30.5" fill="#C27A36" stroke="#7A4A1C" stroke-width="0.8"/><circle cx="20" cy="25" r="1.8" fill="#3B2A1B"/><path d="M16.5 33.5 h7" stroke="#3B2A1B" stroke-width="1.3"/><path d="M19.2 6 V33.5 M20 6 V33.5 M20.8 6 V33.5" stroke="#F3EDE3" stroke-width="0.45"/></g>`,
      `<g><path d="M31 21 q-4 0 -4 4 q-2 1.6 -2 5 q0 5 6 5 q6 0 6 -5 q0 -3.4 -2 -5 q0 -4 -4 -4z" fill="#2E6DA4" stroke="#1A3A5A" stroke-width="1"/><circle cx="31" cy="25.2" r="2.2" fill="#F2D3B3" stroke="#1A3A5A" stroke-width="0.6"/><path d="M29 30.5 q2 2.6 4 0" fill="none" stroke="#F5E6B8" stroke-width="1.1"/><path d="M15 5 q-7.5 0 -7.5 7.5 q-3.5 3 -3.5 10.5 q0 12.5 11 12.5 q11 0 11 -12.5 q0 -7.5 -3.5 -10.5 q0 -7.5 -7.5 -7.5z" fill="#B3261E" stroke="#5A1A12" stroke-width="1.2"/><circle cx="15" cy="12.5" r="4.6" fill="#F2D3B3" stroke="#5A1A12" stroke-width="0.8"/><path d="M10.6 11.6 q4.4 -4.2 8.8 0 q-1.6 -2.6 -4.4 -2.6 q-2.8 0 -4.4 2.6z" fill="#7A3E1C"/><circle cx="13.2" cy="14.2" r="0.9" fill="#E8798F"/><circle cx="16.8" cy="14.2" r="0.9" fill="#E8798F"/><circle cx="13.6" cy="12.4" r="0.5" fill="#1A1108"/><circle cx="16.4" cy="12.4" r="0.5" fill="#1A1108"/><ellipse cx="15" cy="26" rx="6" ry="7" fill="#F5E6B8" stroke="#5A1A12" stroke-width="0.8"/><circle cx="15" cy="24.5" r="2.4" fill="#B3261E"/><circle cx="15" cy="24.5" r="0.9" fill="#F2C14E"/><path d="M15 27 v3.5 M12.6 29.2 q2.4 -1.2 4.8 0" stroke="#3F7D4E" stroke-width="1" fill="none"/></g>`,
      `<g><path d="M13.5 37 h13 l-2.2 -4.6 h-8.6z" fill="#C9A227" stroke="#7A5A1C" stroke-width="1"/><path d="M20 3.5 q10.5 0 10.5 16 q0 13 -10.5 13 q-10.5 0 -10.5 -13 q0 -16 10.5 -16z" fill="#C2507E" stroke="#7A5A1C" stroke-width="1.3"/><path d="M10.4 15 q9.6 4 19.2 0 M9.6 23.5 q10.4 4 20.8 0" fill="none" stroke="#E0B95A" stroke-width="1.7"/><path d="M20 3.5 V32.5" stroke="#E0B95A" stroke-width="1.2"/><path d="M14 7.5 q-3 4 -3.6 10" fill="none" stroke="#E79AB8" stroke-width="1.4" stroke-linecap="round"/><g fill="#FAF5EF" stroke="#7A5A1C" stroke-width="0.6"><circle cx="20" cy="17" r="1.6"/><circle cx="20" cy="25.6" r="1.6"/><circle cx="14" cy="16.6" r="1.1"/><circle cx="26" cy="16.6" r="1.1"/><circle cx="14" cy="25" r="1.1"/><circle cx="26" cy="25" r="1.1"/></g><circle cx="20" cy="3" r="1.7" fill="#8CC3DE" stroke="#C9A227" stroke-width="0.9"/></g>`,
      `<g stroke="${INK}" stroke-width="1.2"><path d="M20 3 v5" stroke-width="1.6"/><path d="M20 8 q-10 8 -8 16 h16 q2 -8 -8 -16z" fill="#C9A227"/><rect x="12" y="24" width="16" height="12" fill="#E7B0C4"/><path d="M17 36 v-6 a3 3 0 0 1 6 0 v6" fill="#F5D67A"/></g>`,
      `<g><path d="M18 4 h8 l0.8 11 q7 1 9.5 3.4 q0.8 1.8 -1 2.6 h-17.3z" fill="#E3DCCB" stroke="#5A4A3A" stroke-width="1.1" stroke-linejoin="round"/><path d="M16.5 24 h21 q3 0 2.5 -2.5" fill="none" stroke="#8A97A3" stroke-width="1.6" stroke-linecap="round"/><path d="M20 21 v3 M33 20.5 v3.5" stroke="#5A6470" stroke-width="1.2"/><path d="M6 11 h9 l1 13 q8 1 11 4 q1 2 -1 3 h-20z" fill="#FAF5EF" stroke="#3B2A1B" stroke-width="1.2" stroke-linejoin="round"/><path d="M9 14 l4.5 1.5 M9 17 l4.5 1.5 M9 20 l4.5 1.5 M9.5 23 l4.5 1.5" stroke="#B3261E" stroke-width="0.9"/><rect x="6" y="31" width="5" height="2" fill="#3B2A1B"/><path d="M8 33 v3 M23 31 v5" stroke="#5A6470" stroke-width="1.4"/><path d="M3 36 h25 q4.5 0 4 -3.5" fill="none" stroke="#8A97A3" stroke-width="2" stroke-linecap="round"/></g>`,
      `<g><ellipse cx="20" cy="34" rx="15" ry="3.2" fill="#BFC9D4" stroke="#5A6470" stroke-width="1.1"/><path d="M7 26 q2 6.5 13 6.5 q11 0 14 -9 q-6 3.4 -11 1.4 q-4 -1.6 -5 -5.6 q-1 -5 1.6 -8.6 q2 -3 0 -5.4 q-3 -2.2 -5.8 0.6 q-1.6 1.8 0 3.6 q2.6 0.6 1.6 3.6 q-2 5.4 -0.2 9.6 q-5 -1.6 -8.2 3.3z" fill="#DCEBF0" stroke="#5A8AA8" stroke-width="1.2" stroke-linejoin="round"/><path d="M21 26.5 q6 0.4 10.5 -2.4 M20 29.4 q7 0.4 11.6 -3.2" fill="none" stroke="#8CC3DE" stroke-width="1"/><path d="M13 8.3 l-3.6 1.5 l3.6 0.9z" fill="#8CC3DE" stroke="#5A8AA8" stroke-width="0.5"/><path d="M16 10 q-1 3 1 4" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round"/><path d="M31 4.5 l1 3.2 l3.2 1 l-3.2 1 l-1 3.2 l-1 -3.2 l-3.2 -1 l3.2 -1z" fill="#8CC3DE"/></g>`,
      `<g><path d="M31 15.5 L37 7.5" stroke="#E8DCC8" stroke-width="1.5" stroke-linecap="round"/><path d="M4.5 19 h31 q-1 11 -15.5 11 q-14.5 0 -15.5 -11z" fill="#BFC9D4" stroke="#5A6470" stroke-width="1.2"/><path d="M7.5 24 q12.5 5 25 0" fill="none" stroke="#DCE3EA" stroke-width="1.2"/><path d="M17 30 h6 l1.2 4 h-8.4z" fill="#BFC9D4" stroke="#5A6470" stroke-width="1"/><rect x="11" y="34" width="18" height="2.6" rx="1.2" fill="#8A97A3" stroke="#5A6470" stroke-width="0.8"/><path d="M6.5 19 l2.6 -4 l2.6 2.8 l3 -5 l2.4 4 l3.2 -3.6 l2.4 3.6 l3 -4.6 l2.8 4.2 l2.4 -2.6 l2.2 5.2z" fill="#F3F8FA" stroke="#8CC3DE" stroke-width="0.8" stroke-linejoin="round"/><ellipse cx="20" cy="17.5" rx="7" ry="2.6" fill="#2C2C2C" stroke="#5A6470" stroke-width="0.9"/><g fill="#6B6B6B"><circle cx="16.5" cy="17.3" r="0.7"/><circle cx="19" cy="16.6" r="0.7"/><circle cx="21.6" cy="17.6" r="0.7"/><circle cx="24" cy="16.9" r="0.7"/><circle cx="18.6" cy="18.4" r="0.7"/></g><ellipse cx="30" cy="16.6" rx="2" ry="1.2" fill="#F3EDE3" stroke="#B8B0A0" stroke-width="0.5" transform="rotate(-50 30 16.6)"/></g>`
    ],
    safarilodge: [
      `<g><path d="M14 11.5 v-3 h17 v3" fill="none" stroke="#5A4A22" stroke-width="1.3" stroke-linejoin="round"/><path d="M3 27 v-6 q0 -1.5 1.5 -1.5 h7 l3 -8 h18 q2.5 0 2.5 2.5 v13z" fill="#F3EDE3" stroke="#3B2A1B" stroke-width="1.3" stroke-linejoin="round"/><path d="M16 11.5 l-1.5 6.5 M21 11.5 l-1 9 M27 11.5 l-1.4 8 M32 13 l-1.6 7" stroke="#2C2C2C" stroke-width="1.6" stroke-linecap="round"/><path d="M5 22.5 l3 -2.8 M7.6 26 l3.6 -4 M34 19 l-2 7.5" stroke="#2C2C2C" stroke-width="1.5" stroke-linecap="round"/><path d="M15.5 13 h4.5 v6 h-6.8z" fill="#9DB7D6" stroke="#3B2A1B" stroke-width="0.8" stroke-linejoin="round"/><rect x="22.5" y="13" width="7" height="6" fill="#9DB7D6" stroke="#3B2A1B" stroke-width="0.8"/><rect x="1.5" y="25.5" width="36" height="3" rx="1.2" fill="#7A5236" stroke="#3B2A1B" stroke-width="0.8"/><circle cx="10" cy="29.5" r="4.3" fill="#2C2C2C" stroke="#111" stroke-width="1"/><circle cx="10" cy="29.5" r="1.6" fill="#BFC9D4"/><circle cx="29" cy="29.5" r="4.3" fill="#2C2C2C" stroke="#111" stroke-width="1"/><circle cx="29" cy="29.5" r="1.6" fill="#BFC9D4"/><circle cx="3.6" cy="22.5" r="1.2" fill="#F5D67A" stroke="#7A5A1C" stroke-width="0.5"/></g>`,
      `<g><path d="M20 0.5 V3.5" stroke="#7A5236" stroke-width="1"/><path d="M20 3.5 Q9 14 6 27 H34 Q31 14 20 3.5z" fill="#FAF5EF" fill-opacity="0.9" stroke="#B8B0A0" stroke-width="1"/><path d="M20 4 Q15 15 13 27 M20 4 Q25 15 27 27 M20 4 V27" fill="none" stroke="#D9D2C2" stroke-width="0.8"/><ellipse cx="20" cy="4" rx="2.8" ry="1.1" fill="none" stroke="#7A5236" stroke-width="1"/><rect x="4" y="26" width="32" height="6" rx="1.5" fill="#D9534F" stroke="#7A2A1C" stroke-width="1"/><path d="M4.5 29 h31" stroke="#F2C14E" stroke-width="1.2" stroke-dasharray="3 2"/><path d="M6 32 v4 M34 32 v4" stroke="#5A3A1E" stroke-width="2" stroke-linecap="round"/></g>`,
      `<g><path d="M9 36.5 V4" stroke="#5A6470" stroke-width="2" stroke-linecap="round"/><path d="M4.5 36.5 h9" stroke="#3B2A1B" stroke-width="2" stroke-linecap="round"/><path d="M10 6 L35 10 L35 15 L10 19z" fill="#F07A1A" stroke="#7A3E1C" stroke-width="1.1" stroke-linejoin="round"/><path d="M15 6.8 L20.5 7.7 L20.5 17.3 L15 18.2z M26 8.6 L30.5 9.3 L30.5 15.7 L26 16.4z" fill="#FAF5EF"/><path d="M10 6 L35 10 L35 15 L10 19z" fill="none" stroke="#7A3E1C" stroke-width="1.1" stroke-linejoin="round"/><path d="M10 5.5 v14" stroke="#3B2A1B" stroke-width="1.4"/></g>`,
      `<g stroke="${INK}" stroke-width="1.2"><path d="M20 4 q12 0 12 12 q0 8 -8 14 h-8 q-8 -6 -8 -14 q0 -12 12 -12z" fill="#F2A65A"/><path d="M20 4 q-5 6 -4 26 M20 4 q5 6 4 26" fill="none" stroke="#B3261E"/><path d="M16 30 l1 3 M24 30 l-1 3" stroke-width="1"/><rect x="16" y="33" width="8" height="5" rx="1" fill="#7A5236"/></g>`,
      `<g><ellipse cx="20" cy="35.5" rx="12" ry="2" fill="#C9A86A"/><path d="M19.5 35.5 q1 -8 -4.5 -15 M20.5 35.5 q0 -9 6.5 -15 M20 27 q-1 -4 1.5 -7.5" fill="none" stroke="#5A3A1E" stroke-width="2.2" stroke-linecap="round"/><path d="M2.5 18 q2 -7.5 10.5 -7.5 q4 -4 9 -2 q5 -3 10 1 q6.5 1 6.5 8.5 q-8.5 3 -18 2 q-10 1 -18 -2z" fill="#7A9A4A" stroke="#3F5A22" stroke-width="1.2" stroke-linejoin="round"/><path d="M8 13.5 q6 -3 12 -2 M24 11 q4 -1 7 1" stroke="#A8C46A" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>`,
      `<g><rect x="9" y="35" width="18" height="3" rx="1" fill="#5A3A1E"/><path d="M12 35 v-10 M15.5 35 v-10 M21.5 35 v-10 M25 35 v-10" stroke="#B2753F" stroke-width="1.9" stroke-linecap="round"/><path d="M11 26.5 q0 -5.5 5 -5.5 h7 q4 0 4 4 q0 2.5 -2.5 2.5 h-11.5 q-2 0 -2 -1z" fill="#C8874A" stroke="#5A3A1E" stroke-width="1.1"/><path d="M22.5 22 L28 7 l3.2 1.2 l-3.4 15.3z" fill="#C8874A" stroke="#5A3A1E" stroke-width="1.1" stroke-linejoin="round"/><path d="M27 6.5 q2 -3.4 5.2 -2.2 l5 3 q1 1.6 -1.2 2.1 l-6 0.2 q-3 0 -3 -3.1z" fill="#C8874A" stroke="#5A3A1E" stroke-width="1.1" stroke-linejoin="round"/><path d="M29 4.5 v-3 M31.4 4.6 v-3" stroke="#5A3A1E" stroke-width="1.1" stroke-linecap="round"/><g fill="#7A4A1C"><circle cx="14.5" cy="23.5" r="1.3"/><circle cx="19" cy="24.6" r="1.2"/><circle cx="23.5" cy="23.4" r="1.2"/><circle cx="26.4" cy="15" r="1"/><circle cx="25.2" cy="19.5" r="1"/><circle cx="28" cy="11" r="0.9"/></g><circle cx="31.2" cy="6.2" r="0.6" fill="#1A1108"/><path d="M11 23.5 q-3 1 -3 5" stroke="#5A3A1E" stroke-width="0.9" fill="none"/></g>`,
      `<g><path d="M10.5 17 q9.5 -15 19 0" fill="none" stroke="#7A4A1C" stroke-width="2.4"/><path d="M7 17 h26 q0 17 -13 17 q-13 0 -13 -17z" fill="#E3C58E" stroke="#7A5236" stroke-width="1.2" stroke-linejoin="round"/><path d="M7.3 21 h25.4" stroke="#B3261E" stroke-width="2.2"/><path d="M8.4 25.5 h23.2" stroke="#2E6DA4" stroke-width="2"/><path d="M10.6 30 h18.8" stroke="#3F7D4E" stroke-width="1.8"/><path d="M11 18 l1.5 2 M15 18 l1.5 2 M19 18 l1.5 2 M23 18 l1.5 2 M27 18 l1.5 2" stroke="#B8955C" stroke-width="0.7"/><path d="M6.5 17 h27" stroke="#7A4A1C" stroke-width="1.8" stroke-linecap="round"/></g>`
    ],
    hanok: [
      `<g><path d="M6.5 31 q-3 2.5 -2 7 M9 33 q-1.8 2.6 -0.6 6 M11.5 34.4 q-0.8 2.4 0.6 5" fill="none" stroke="#E8DCC8" stroke-width="1.1" stroke-linecap="round"/><g transform="rotate(-38 20 20)"><rect x="0.5" y="15" width="39" height="10" rx="3" fill="#C8874A" stroke="#5A3A1E" stroke-width="1.2"/><rect x="2" y="16.5" width="36" height="7" rx="2" fill="#D99A5E"/><path d="M4 17.6 H36 M4 19.2 H36 M4 20.8 H36 M4 22.4 H36" stroke="#FAF5EF" stroke-width="0.55"/><g fill="#F3EDE3" stroke="#5A3A1E" stroke-width="0.5"><path d="M13 18.4 l1 -2 l1 2z"/><path d="M17 20 l1 -2 l1 2z"/><path d="M21 21.6 l1 -2 l1 2z"/><path d="M25 23.2 l1 -2 l1 2z"/></g><rect x="2" y="15" width="2.6" height="10" fill="#3B2A1B"/><rect x="34.6" y="15" width="2.6" height="10" fill="#3B2A1B"/></g></g>`,
      `<g><path d="M13 11 h14 q8 4 8 13 q0 11 -15 11 q-15 0 -15 -11 q0 -9 8 -13z" fill="#7A4A26" stroke="#3B2A1B" stroke-width="1.3"/><path d="M12 20.5 q2 -3.4 4 0 q2 3.4 4 0 q2 -3.4 4 0 q2 3.4 4 0" fill="none" stroke="#C9A06A" stroke-width="1.1"/><path d="M9.2 18 q-1.6 6 0.6 11" fill="none" stroke="#A8703E" stroke-width="1.8" stroke-linecap="round"/><rect x="11.5" y="9.5" width="17" height="2.6" rx="1.2" fill="#5A3A1E" stroke="#3B2A1B" stroke-width="0.8"/><path d="M11 10 q9 -7 18 0z" fill="#8B5A30" stroke="#3B2A1B" stroke-width="1.2" stroke-linejoin="round"/><circle cx="20" cy="5.6" r="1.5" fill="#3B2A1B"/></g>`,
      `<g><path d="M29 5.5 L37.5 1.5" stroke="#B8955C" stroke-width="1.6" stroke-linecap="round"/><path d="M8 9 q8 3.5 10.5 8.5 v5 q-2.5 5 -10.5 8.5z M32 9 q-8 3.5 -10.5 8.5 v5 q2.5 5 10.5 8.5z" fill="#B3261E" stroke="#5A1A12" stroke-width="1.1" stroke-linejoin="round"/><rect x="18" y="17" width="4" height="6" fill="#7A2A1C" stroke="#5A1A12" stroke-width="0.8"/><path d="M8.5 9.5 L31.5 30.5 M8.5 30.5 L31.5 9.5 M8.5 15 L31.5 25 M8.5 25 L31.5 15" stroke="#E0B95A" stroke-width="0.9"/><ellipse cx="8" cy="20" rx="4.2" ry="11.5" fill="#F3EDE3" stroke="#5A3A1E" stroke-width="1.2"/><ellipse cx="8" cy="20" rx="2.6" ry="8.8" fill="none" stroke="#2E6DA4" stroke-width="1.1"/><ellipse cx="32" cy="20" rx="4.2" ry="11.5" fill="#F3EDE3" stroke="#5A3A1E" stroke-width="1.2"/><ellipse cx="32" cy="20" rx="2.6" ry="8.8" fill="none" stroke="#2E6DA4" stroke-width="1.1"/></g>`,
      `<g><path d="M6 10 q12 4 16 14 q3 6 10 8" fill="none" stroke="#5A3A2E" stroke-width="2" stroke-linecap="round"/><g stroke="#7A3E1C" stroke-width="1"><circle cx="16" cy="22" r="5" fill="#E8742C"/><circle cx="28" cy="30" r="4.6" fill="#E8742C"/></g><path d="M14 17 l2 1 l2 -1 M26 25.5 l2 1 l2 -1" stroke="#3F6B4A" stroke-width="1.4" fill="none"/></g>`,
      `<g><ellipse cx="20" cy="36.5" rx="10" ry="1.6" fill="#C9B79C"/><path d="M14.5 7.5 h11 v1.5 q10.5 3 10.5 13.5 q0 14 -16 14 q-16 0 -16 -14 q0 -10.5 10.5 -13.5z" fill="#F7F2E6" stroke="#8A7A60" stroke-width="1.3"/><rect x="14" y="5" width="12" height="3.4" rx="1.2" fill="#EFE8D6" stroke="#8A7A60" stroke-width="1"/><path d="M4.6 22 q15.4 2.4 30.8 0" fill="none" stroke="#E3DCC8" stroke-width="1"/><path d="M9.5 16 q-2.6 6.5 0 12" stroke="#FFFFFF" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M30.5 15.5 q2.6 6.5 0.4 13" stroke="#E8E0CC" stroke-width="2" fill="none" stroke-linecap="round"/></g>`,
      `<g><rect x="3" y="17" width="23" height="17" rx="2.6" fill="#3B3B3B" stroke="#111" stroke-width="1.2"/><rect x="6" y="20" width="17" height="11" rx="2" fill="#262626"/><path d="M7 21.5 q7.5 -1.4 15 0 v2.6 h-15z" fill="#2E3A55"/><g transform="rotate(-14 15 26.5)"><rect x="8.5" y="24.5" width="13" height="4" rx="0.8" fill="#141414" stroke="#5A5A5A" stroke-width="0.6"/><rect x="12.5" y="25.3" width="4.5" height="2.4" fill="#C9A227"/></g><path d="M29 33.5 L36.5 5" stroke="#B8955C" stroke-width="2.4" stroke-linecap="round"/><path d="M30 13 l3 0.8 M31.7 19 l2 0.5" stroke="#7A5A1C" stroke-width="0.8"/><path d="M27.6 32.6 l2.6 0.7 l-2.4 5.6 q-1.4 -0.6 -1.2 -2z" fill="#1A1A1A"/></g>`,
      `<g><path d="M8.5 24 q-1 6 0 11.5 M31.5 24 q1 6 0 11.5 M20 26.5 v10" stroke="#5A3A1E" stroke-width="2.1" fill="none" stroke-linecap="round"/><path d="M4.5 20.5 v2.6 q15.5 6.4 31 0 v-2.6" fill="#7A4220" stroke="#3B2A1B" stroke-width="1.1"/><ellipse cx="20" cy="20.5" rx="15.5" ry="4.2" fill="#9C5A2E" stroke="#3B2A1B" stroke-width="1.2"/><path d="M14 19.4 q0 -6 5 -6 q5 0 5 6z" fill="#B6D5C9" stroke="#3F6B5A" stroke-width="0.9"/><path d="M24 15.5 q3 -0.5 3.6 -3" fill="none" stroke="#3F6B5A" stroke-width="1"/><circle cx="19" cy="12.6" r="1" fill="#3F6B5A"/><path d="M7.8 18.2 q0 2.4 2.6 2.4 q2.6 0 2.6 -2.4z M27 18.6 q0 2.4 2.6 2.4 q2.6 0 2.6 -2.4z" fill="#B6D5C9" stroke="#3F6B5A" stroke-width="0.8"/></g>`
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
