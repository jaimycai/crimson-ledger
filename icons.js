// ============================================================
// ICONS — één pakket in één stijl: Tabler Icons 3.49 (MIT, github.com/tabler/tabler-icons), opgehaald
// via iconify.design. Lijnen van 2 op 24 × 24 in de tekstkleur.
//   Icons.html('map')                    → <svg class="ico">…</svg>
//   <i class="ico" data-icon="map"></i>  → wordt bij het opstarten gevuld (Icons.fill)
// Knop- en labelteksten houden hun emoji in de code en in alle vertalingen ("🗺️ Naar de kaart"); Icons.watch
// zet een bekend emoji vooraan of achteraan zo'n tekst om in het icoon uit deze set. Zo ziet elke knop er op
// elk toestel hetzelfde uit, zonder dat een vertaling hoeft te veranderen. Inhoud (medailles, bewijsstukken,
// werelden, verhaaltjes) houdt zijn emoji.
// ============================================================

const ICONS = {
  'anchor': '<path d="M12 9v12m-8-8a8 8 0 0 0 16 0m1 0h-2M5 13H3m6-7a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/>',
  'arrow-back-up': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m9 14l-4-4l4-4"/><path d="M5 10h11a4 4 0 1 1 0 8h-1"/></g>',
  'arrow-left': '<path d="M5 12h14M5 12l6 6m-6-6l6-6"/>',
  'arrow-right': '<path d="M5 12h14m-6 6l6-6m-6-6l6 6"/>',
  'award': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M6 9a6 6 0 1 0 12 0A6 6 0 1 0 6 9"/><path d="m12 15l3.4 5.89l1.598-3.233l3.598.232l-3.4-5.889M6.802 12l-3.4 5.89L7 17.657l1.598 3.232l3.4-5.889"/></g>',
  'bell': '<path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6M9 17v1a3 3 0 0 0 6 0v-1"/>',
  'book': '<path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6v13m9-13v13m9-13v13"/>',
  'box': '<path d="m12 3l8 4.5v9L12 21l-8-4.5v-9zm0 9l8-4.5M12 12v9m0-9L4 7.5"/>',
  'building': '<path d="M3 21h18M9 8h1m-1 4h1m-1 4h1m4-8h1m-1 4h1m-1 4h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>',
  'building-bank': '<path d="M3 21h18M3 10h18M5 6l7-3l7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3"/>',
  'building-castle': '<path d="M15 19v-2a3 3 0 0 0-6 0v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5h4v3h3V5h4v3h3V5h4v14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1M3 11h18"/>',
  'bulb': '<path d="M3 12h1m8-9v1m8 8h1M5.6 5.6l.7.7m12.1-.7l-.7.7M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0-1 3a2 2 0 0 1-4 0a3.5 3.5 0 0 0-1-3m.7 1h4.6"/>',
  'calendar': '<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm12-4v4M8 3v4m-4 4h16m-9 4h1m0 0v3"/>',
  'chart-bar': '<path d="M3 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zm12-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM4 20h14"/>',
  'check': '<path d="m5 12l5 5L20 7"/>',
  'clipboard-list': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2m0 7h.01M13 12h2m-6 4h.01M13 16h2"/></g>',
  'clock': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/></g>',
  'coin': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/><path d="M14.8 9A2 2 0 0 0 13 8h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1-1.8-1M12 7v10"/></g>',
  'crown': '<path d="m12 6l4 6l5-4l-2 10H5L3 8l5 4z"/>',
  'device-floppy': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M6 4h10l4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"/><path d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0-4 0m4-10v4H8V4"/></g>',
  'dice-5': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path fill="currentColor" d="M8 8.5a.5.5 0 1 0 1 0a.5.5 0 1 0-1 0m7 0a.5.5 0 1 0 1 0a.5.5 0 1 0-1 0m0 7a.5.5 0 1 0 1 0a.5.5 0 1 0-1 0m-7 0a.5.5 0 1 0 1 0a.5.5 0 1 0-1 0m3.5-3.5a.5.5 0 1 0 1 0a.5.5 0 1 0-1 0"/></g>',
  'eraser': '<path d="M19 20H8.5l-4.21-4.3a1 1 0 0 1 0-1.41l10-10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41L11.5 20m6.5-6.7L11.7 7"/>',
  'external-link': '<path d="M12 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6m-7 1l9-9m-5 0h5v5"/>',
  'eye': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0"/><path d="M21 12q-3.6 6-9 6t-9-6q3.6-6 9-6t9 6"/></g>',
  'file-text': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2M9 9h1m-1 4h6m-6 4h6"/></g>',
  'flame': '<path d="M12 10.941c2.333-3.308.167-7.823-1-8.941c0 3.395-2.235 5.299-3.667 6.706C5.903 10.114 5 12 5 14.294C5 17.998 8.134 21 12 21s7-3.002 7-6.706c0-1.712-1.232-4.403-2.333-5.588c-2.084 3.353-3.257 3.353-4.667 2.235"/>',
  'folder': '<path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"/>',
  'gift': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 9a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zm9-1v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7m2.5-4a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5a2.5 2.5 0 0 1 0 5"/></g>',
  'key': '<path d="m16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1-4.069 0l-.301-.301l-6.558 6.558a2 2 0 0 1-1.239.578L5.172 21H4a1 1 0 0 1-.993-.883L3 20v-1.172a2 2 0 0 1 .467-1.284l.119-.13L4 17h2v-2h2v-2l2.144-2.144l-.301-.301a2.877 2.877 0 0 1 0-4.069l2.643-2.643a2.877 2.877 0 0 1 4.069 0M15 9h.01"/>',
  'lock': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0-2 0m-3-5V7a4 4 0 1 1 8 0v4"/></g>',
  'lock-open': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M11 16a1 1 0 1 0 2 0a1 1 0 1 0-2 0m-3-5V6a4 4 0 0 1 8 0"/></g>',
  'map': '<path d="m3 7l6-3l6 3l6-3v13l-6 3l-6-3l-6 3zm6-3v13m6-10v13"/>',
  'medal': '<path d="M12 4v3M8 4v6m8-6v6m-4 8.5L9 20l.5-3.5l-2-2l3-.5l1.5-3l1.5 3l3 .5l-2 2L15 20z"/>',
  'mountain': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 20h18L14.079 5.388a2.3 2.3 0 0 0-4.158 0z"/><path d="m7.5 11l2 2.5L12 11l2 3l2.5-2"/></g>',
  'palette': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 21a9 9 0 0 1 0-18c4.97 0 9 3.582 9 8c0 1.06-.474 2.078-1.318 2.828S17.693 15 16.5 15H14a2 2 0 0 0-1 3.75A1.3 1.3 0 0 1 12 21"/><path d="M7.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0-2 0m4-3a1 1 0 1 0 2 0a1 1 0 1 0-2 0m4 3a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/></g>',
  'pencil': '<path d="M4 20h4L18.5 9.5a2.828 2.828 0 1 0-4-4L4 16zm9.5-13.5l4 4"/>',
  'player-play': '<path d="M7 4v16l13-8z"/>',
  'refresh': '<path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4m-4 4a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/>',
  'repeat': '<path d="M4 12V9a3 3 0 0 1 3-3h13m-3-3l3 3l-3 3m3 3v3a3 3 0 0 1-3 3H4m3 3l-3-3l3-3"/>',
  'rocket': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3-5a9 9 0 0 0 6-8a3 3 0 0 0-3-3a9 9 0 0 0-8 6a6 6 0 0 0-5 3"/><path d="M7 14a6 6 0 0 0-3 6a6 6 0 0 0 6-3m4-8a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/></g>',
  'school': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M22 9L12 5L2 9l10 4zv6"/><path d="M6 10.6V16a6 3 0 0 0 12 0v-5.4"/></g>',
  'search': '<path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6"/>',
  'settings': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/></g>',
  'share': '<path d="M3 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0m12-6a3 3 0 1 0 6 0a3 3 0 1 0-6 0m0 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0m-6.3-7.3l6.6-3.4m-6.6 6l6.6 3.4"/>',
  'shopping-cart': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/><path d="M17 17H6V3H4"/><path d="m6 5l14 1l-1 7H6"/></g>',
  'snowflake': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m10 4l2 1l2-1"/><path d="M12 2v6.5l3 1.72m2.928-3.952l.134 2.232l1.866 1.232"/><path d="m20.66 7l-5.629 3.25l.01 3.458m4.887.56L18.062 15.5l-.134 2.232"/><path d="m20.66 17l-5.629-3.25l-2.99 1.738M14 20l-2-1l-2 1"/><path d="M12 22v-6.5l-3-1.72m-2.928 3.952L5.938 15.5l-1.866-1.232"/><path d="m3.34 17l5.629-3.25l-.01-3.458m-4.887-.56L5.938 8.5l.134-2.232"/><path d="m3.34 7l5.629 3.25l2.99-1.738"/></g>',
  'sparkles': '<path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2-2a2 2 0 0 1-2-2a2 2 0 0 1-2 2m0-12a2 2 0 0 1 2 2a2 2 0 0 1 2-2a2 2 0 0 1-2-2a2 2 0 0 1-2 2M9 18a6 6 0 0 1 6-6a6 6 0 0 1-6-6a6 6 0 0 1-6 6a6 6 0 0 1 6 6"/>',
  'star': '<path d="m12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/>',
  'target': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/><path d="M7 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/></g>',
  'tent': '<path d="m11 14l4 6h6L12 4L3 20h6l4-6"/>',
  'train': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M21 13c0-3.87-3.37-7-10-7H3m0 9h16a2 2 0 0 0 2-2"/><path d="M3 6v5h17.5M3 11v4m5-4V6m5 5V6.5M3 19h18"/></g>',
  'trophy': '<path d="M8 21h8m-4-4v4M7 4h10m0 0v8a5 5 0 0 1-10 0V4M3 9a2 2 0 1 0 4 0a2 2 0 1 0-4 0m14 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/>',
  'user': '<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>',
  'volume': '<path d="M15 8a5 5 0 0 1 0 8m2.7-11a9 9 0 0 1 0 14M6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l3.5-4.5A.8.8 0 0 1 11 5v14a.8.8 0 0 1-1.5.5z"/>',
  'volume-off': '<path d="M15 8a5 5 0 0 1 1.912 4.934m-1.377 2.602A5 5 0 0 1 15 16m2.7-11a9 9 0 0 1 2.362 11.086m-1.676 2.299A9 9 0 0 1 17.7 19M9.069 5.054L9.5 4.5A.8.8 0 0 1 11 5v2m0 4v8a.8.8 0 0 1-1.5.5L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l1.294-1.664M3 3l18 18"/>',
  'world': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0m.6-3h16.8M3.6 15h16.8"/><path d="M11.5 3a17 17 0 0 0 0 18m1-18a17 17 0 0 1 0 18"/></g>',
  'x': '<path d="M18 6L6 18M6 6l12 12"/>'
};

const Icons = {
  // emoji in knoppen en labels → icoon (variantkiezer U+FE0F mag erachter staan)
  EMOJI: {
    '🗺': 'map', '📤': 'share', '🪙': 'coin', '🏅': 'medal', '🔊': 'volume', '🔇': 'volume-off', '🎲': 'dice-5',
    '📋': 'clipboard-list', '💡': 'bulb', '↺': 'refresh', '🎯': 'target', '🔔': 'bell', '🌍': 'world', '📊': 'chart-bar',
    '🎨': 'palette', '🛒': 'shopping-cart', '🧊': 'snowflake', '🔥': 'flame', '🎓': 'school', '🔒': 'lock', '🎁': 'gift',
    '📅': 'calendar', '🗓': 'calendar', '📁': 'folder', '✨': 'sparkles', '🏆': 'trophy', '📖': 'book', '🔁': 'repeat',
    '👁': 'eye', '▶': 'player-play', '✓': 'check', '↗': 'external-link', '←': 'arrow-left', '→': 'arrow-right', '🎖': 'award',
    '⏱': 'clock', '🔍': 'search', '⚙': 'settings'
  },
  // waar emoji inhoud zijn en blijven
  KEEP: '.medal-icon, .medal-toast-icon, .theme-icon, .part-icon, .ev, .vitrine, .chest-items, .bclue-text, .dclue, .board-grid, .mini-grid, .story, .briefing-text, .results-solution, .map-art, select, option, textarea, input, svg, .classic, #screen-classic',
  html(name) {
    const body = ICONS[name];
    return body ? `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>` : '';
  },
  fill(root) {
    if (typeof document === 'undefined') return;
    (root || document).querySelectorAll('i.ico[data-icon]').forEach(el => { el.outerHTML = this.html(el.dataset.icon); });
  },
  // een tekstknoop die begint of eindigt met een bekend emoji: dat emoji wordt een icoon ernaast
  swapNode(node) {
    const p = node.parentElement;
    if (!p || p.closest(this.KEEP)) return;
    const t = node.nodeValue;
    if (!t || !t.trim()) return;
    const lead = t.match(/^(\s*)(\S)\uFE0F?(\s*)/u), trail = t.match(/(\s*)(\S)\uFE0F?(\s*)$/u);
    const at = lead && this.EMOJI[lead[2]] ? 'lead' : trail && this.EMOJI[trail[2]] ? 'trail' : null;
    if (!at) return;
    const m = at === 'lead' ? lead : trail;
    const tmp = document.createElement('span');
    tmp.innerHTML = this.html(this.EMOJI[m[2]]);
    const svg = tmp.firstChild;
    if (at === 'lead') {
      node.nodeValue = '\u00a0' + t.slice(m[0].length);
      p.insertBefore(svg, node);
      if (!node.nodeValue.trim()) node.nodeValue = '';
    } else {
      node.nodeValue = t.slice(0, t.length - m[0].length) + '\u00a0';
      p.insertBefore(svg, node.nextSibling);
    }
  },
  swap(root) {
    if (typeof document === 'undefined' || !root) return;
    if (root.nodeType === 3) { this.swapNode(root); return; }
    if (root.nodeType !== 1) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n => this.swapNode(n));
  },
  // eenmaal bij het opstarten: alles omzetten en voortaan elke nieuwe tekst ook
  watch() {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;
    this.swap(document.body);
    new MutationObserver(list => list.forEach(m => {
      if (m.type === 'characterData') this.swapNode(m.target);
      else m.addedNodes.forEach(n => this.swap(n));
    })).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = { Icons, ICONS };
