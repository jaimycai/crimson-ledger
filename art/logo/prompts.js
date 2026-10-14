// Opdrachten voor het nieuwe app-icoon (Higgsfield, gpt_image_2_5, high, 1k, 1:1).
// Onderbouwing: https://claude.ai/artifact/V2pRsevkWf9m7cqyd34d6y (Henderson & Cote, 1998; Romaniuk, 2018;
// Apple HIG "App icons"). Jaimy koos op 14 okt: Van Dam vereenvoudigd, het grootboek, en een andere stijl.
// Opdrachten met ref: 'vandam' krijgen assets/vandam.jpg mee als referentie voor zijn gezicht, hoed en snor.
//   node art/logo/prompts.js          alle opdrachten als JSON
//   node art/logo/prompts.js <id>     één opdracht
const BASE = 'Square artwork for a mobile game icon. The artwork fills the whole square canvas edge to edge: no rounded ' +
  'corners, no frame, no border, no device mockup, no drop shadow around the square. One single subject, centred, taking ' +
  'about 70 percent of the canvas, with a plain background. It must stay recognisable at 60 by 60 pixels, so use few, ' +
  'bold shapes and strong contrast. Absolutely no text, letters, numbers, initials or signature anywhere.';

// Huisstijl (DESIGN.md): wijnrood #8B2E1C, crème #FAF5EF, inkt #2C1810, goud #D4B074, kluiszwart #140B08.
const VANDAM = 'Inspector Van Dam: a stern detective in his fifties with a dark fedora hat with a band, deep-set eyes, ' +
  'a large curled handlebar moustache and a strong jaw. Use the reference image only for his face, hat and moustache.';
const LEDGER = 'A closed antique ledger book in deep crimson leather with gold-gilded page edges, a gold metal clasp ' +
  'with a small keyhole, and worn corners.';

const PROMPTS = [
  // Richting 2: Van Dam, vereenvoudigd
  { id: 'vandam-vlak', richting: 'Van Dam, vereenvoudigd', stijl: 'vlak, twee kleuren', ref: 'vandam',
    prompt: `${VANDAM} Flat vector emblem of only his head: the fedora and the handlebar moustache are the dominant shapes, ` +
      'the eyes are two small dark shapes in the shadow of the hat brim. Cream (#FAF5EF) figure on a solid wine-red ' +
      '(#8B2E1C) background. Two colours only, no gradients, no outlines, no texture.' },
  { id: 'vandam-linosnede', richting: 'Van Dam, vereenvoudigd', stijl: 'linosnede', ref: 'vandam',
    prompt: `${VANDAM} Bold linocut print of his head and shoulders, thick carved lines, high contrast, slightly rough ` +
      'edges like ink pressed from a block. Cream ink on a wine-red (#8B2E1C) background.' },
  { id: 'vandam-profiel', richting: 'Van Dam, vereenvoudigd', stijl: 'silhouet, zijaanzicht', ref: 'vandam',
    prompt: `${VANDAM} Solid silhouette of his head in side profile facing right: fedora, nose and the curled ` +
      'moustache read clearly in the outline. Cream silhouette on a solid wine-red (#8B2E1C) background, with one small ' +
      'crimson-red (#C43E26) drop on the hat band as the only accent.' },

  // Richting 3: het grootboek
  { id: 'grootboek-vlak', richting: 'Het grootboek', stijl: 'vlak, illustratie', ref: null,
    prompt: `${LEDGER} Flat illustration in three-quarter view, simple shapes, subtle shading in two tones of crimson, ` +
      'gold details. Solid cream (#FAF5EF) background.' },
  { id: 'grootboek-gravure', richting: 'Het grootboek', stijl: 'gravure, zoals de portretten', ref: 'vandam',
    prompt: `${LEDGER} Use the reference image only as a style guide, not for its content: vintage pen-and-ink ` +
      'engraving with fine crosshatching, but with thicker lines than the reference so it stays clear at small size. ' +
      'The book in three-quarter view on a plain solid wine-red (#8B2E1C) background, the book itself in cream and gold tones.' },
  { id: 'grootboek-plattegrond', richting: 'Het grootboek', stijl: 'goudopdruk', ref: null,
    prompt: `${LEDGER} Seen straight from the front. A small floor plan of a house with three by three rooms is ` +
      'embossed in gold on the cover, and one room of the plan is filled with crimson red. Rich, realistic leather and ' +
      'metal, soft studio light. Solid dark background (#140B08).' },

  // Andere stijl: art deco, de gouden eeuw van de detectiveroman (1920-1935)
  { id: 'deco-vandam', richting: 'Andere stijl', stijl: 'art deco', ref: 'vandam',
    prompt: `${VANDAM} Art Deco poster style of the 1920s and 1930s, like a golden-age detective novel cover: his ` +
      'head built from bold geometric shapes and symmetrical lines, gold (#D4B074) and cream on a near-black (#140B08) ' +
      'background, with a few thin gold sunburst rays behind the hat. Flat colours, no texture.' },
  { id: 'deco-sleutelgat', richting: 'Andere stijl', stijl: 'art deco', ref: null,
    prompt: 'Art Deco emblem of the 1920s and 1930s, like a golden-age detective novel cover: a large ornate keyhole in ' +
      'gold (#D4B074), with stepped geometric rays fanning out from it, on a near-black (#140B08) background. Inside the ' +
      'keyhole one small crimson-red (#C43E26) drop. Symmetrical, flat colours, no texture.' },

  // Andere stijl: 3D-personage, zoals veel grote mobiele games
  { id: '3d-vandam', richting: 'Andere stijl', stijl: '3D-personage', ref: 'vandam',
    prompt: `${VANDAM} Stylised 3D character bust like a premium mobile game icon: soft clay-like materials, big ` +
      'expressive eyes under the hat brim, one eyebrow raised in suspicion, warm rim light. The hat and coat in deep ' +
      'wine red and brown, the moustache dark brown. Solid wine-red (#8B2E1C) background with a soft glow behind the head.' },
  { id: '3d-grootboek', richting: 'Andere stijl', stijl: '3D-voorwerp', ref: null,
    prompt: `${LEDGER} Stylised 3D object like a premium mobile game icon: chunky proportions, soft glossy materials, ` +
      'warm light, the book slightly tilted and half open with a golden glow coming from the pages. Solid deep ' +
      'wine-red (#8B2E1C) background.' },

  // ── Ronde 2 (14 okt): Jaimy vond ronde 1 niet mooi en wees Detective Files: Mystery Cases (SayGames) aan als
  // voorbeeld: een cartoonpersonage van dichtbij, dikke donkere lijnen, warme vlakke kleuren met zachte schaduw en een
  // sfeervol decor. Eigen uitwerking met Van Dam, wijnrood en ons spel; het icoon van SayGames gaat niet mee als beeld.
  { id: 'r2-loep', ronde: 2, richting: 'Cartoon, Van Dam', stijl: 'loep voor het oog, studeerkamer', ref: 'vandam',
    prompt: 'He holds a magnifying glass in front of one eye, so that eye looks big and round. Behind him a dim study ' +
      'with a warm hanging lamp and a cork board with a red string and two pinned photos (simple shapes only).' },
  { id: 'r2-grootboek', ronde: 2, richting: 'Cartoon, Van Dam', stijl: 'kijkt over het grootboek', ref: 'vandam',
    prompt: 'He holds an open crimson leather ledger book up near his face and peeks over it with one eyebrow raised. ' +
      'Warm lamp light from above, a dark wine-red wall behind him.' },
  { id: 'r2-plattegrond', ronde: 2, richting: 'Cartoon, Van Dam', stijl: 'over de plattegrond', ref: 'vandam',
    prompt: 'He leans over a table with a colourful floor plan of a house (rooms in soft pastel colours, a few small ' +
      'round tokens), a magnifying glass in his hand, seen from slightly above. Warm lamp light.' },
  { id: 'r2-rode-draad', ronde: 2, richting: 'Cartoon, Van Dam', stijl: 'achterdochtig, rode draad', ref: 'vandam',
    prompt: 'He looks sideways with suspicion, one eyebrow raised, one finger stroking his moustache. Behind him an ' +
      'evidence board with a red string connecting pinned cards (simple shapes only), warm light.' },
  { id: 'r2-nacht', ronde: 2, richting: 'Cartoon, Van Dam', stijl: 'loep, nachtstraat', ref: 'vandam',
    prompt: 'He holds a magnifying glass in front of one eye, so that eye looks big and round. Behind him a night street ' +
      'with one lit lamppost and a deep blue-purple sky, so his warm colours stand out.' },
  { id: 'r2-wijnrood', ronde: 2, richting: 'Cartoon, Van Dam', stijl: 'loep, effen wijnrood', ref: 'vandam',
    prompt: 'He holds a magnifying glass in front of one eye, so that eye looks big and round. A plain deep wine-red ' +
      '(#8B2E1C) background with a soft spotlight glow behind his head, nothing else.' },
  { id: 'r2-sleutel', ronde: 2, richting: 'Cartoon, Van Dam', stijl: 'bestudeert een sleutel', ref: 'vandam',
    prompt: 'He holds up an old brass key between two fingers and studies it with a squint. Behind him the dim hallway ' +
      'of an old mansion with a warm wall lamp.' },
  { id: 'r2-glimlach', ronde: 2, richting: 'Cartoon, Van Dam', stijl: 'kijkt je aan, loep in de hand', ref: 'vandam',
    prompt: 'He looks straight at the viewer with a small knowing smile, holding a magnifying glass at chest height. ' +
      'Behind him a warm brick wall with a framed painting of a mansion and a hanging lamp.' }
];

// Ronde 2 heeft een eigen basis: een volle scène van dichtbij in plaats van één voorwerp op een effen vlak.
const BASE2 = 'Square artwork for a mobile game app icon. The artwork fills the whole square canvas edge to edge: no rounded ' +
  'corners, no frame, no border, no device mockup. Absolutely no text, letters, numbers, initials or signature anywhere. ' +
  'Cartoon illustration in a modern mobile-game style: bold dark-brown outlines of even thickness, flat warm colours with ' +
  'soft cel shading, clean simple shapes, readable at 60 by 60 pixels. The character is cropped close: head and shoulders ' +
  'fill most of the square and touch the bottom edge. The character is Inspector Van Dam, a detective in his fifties: a ' +
  'dark fedora with a wine-red band, a big curled handlebar moustache, bushy eyebrows, a long nose, a beige trench coat ' +
  'over a white shirt and a wine-red tie. Friendly but serious, with a sharp, clever look. Use the reference image only ' +
  'for his face, hat and moustache.';

const full = p => `${p.ronde === 2 ? BASE2 : BASE} ${p.prompt}`;
module.exports = { BASE, PROMPTS, full };

if (require.main === module) {
  const id = process.argv[2];
  const list = id === 'ronde2' ? PROMPTS.filter(p => p.ronde === 2) : id ? PROMPTS.filter(p => p.id === id) : PROMPTS;
  if (!list.length) { console.error(`onbekend: ${id}`); process.exit(2); }
  console.log(JSON.stringify(list.map(p => ({ id: p.id, richting: p.richting, stijl: p.stijl,
    referentie: p.ref ? 'assets/vandam.jpg' : null, prompt: full(p) })), null, 1));
}
