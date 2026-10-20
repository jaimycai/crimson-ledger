// Portrait prompts for the suspects of every world (Higgsfield, gpt_image_2_5, high, 1k, 1:1), with Van Dam's
// portrait (assets/vandam.jpg) as the only style reference. Keyed by the Dutch label in themes.js.
//   node art/portretten/prompts.js <world>   prints the full prompts for one world as JSON
const STYLE = 'Use the reference image only as a style guide; do not copy its man. Draw a new character in exactly that style: ' +
  'vintage sepia pen-and-ink engraving with fine crosshatching, brown ink on cream parchment, head-and-shoulders portrait, ' +
  'facing the viewer, centred inside a round ornamental medallion frame. The frame ring has simple geometric ornament only, ' +
  'with NO lettering. Absolutely no text, letters, words, numbers or signature anywhere in the image. ' +
  'Plain parchment background outside the medallion.';

const ERA = {
  landhuis: 'an English country house in 1927',
  piraten: 'an eighteenth-century pirate ship',
  hotel: 'an Art Deco grand hotel on New Year\'s Eve, 1930s',
  ruimte: 'a space station in the year 2189, retro-futurist',
  museum: 'a museum at night, present day',
  trein: 'a night train to Vienna in 1934',
  circus: 'a travelling circus in the 1920s',
  skihut: 'a mountain hut in the Alps in winter',
  hacienda: 'a tequila hacienda in Jalisco, Mexico, in 1952',
  opera: 'a grand opera house in Paris on a premiere night in 1891'
};

const PEOPLE = {
  landhuis: {
    'Lady Clementine': 'an elegant aristocratic woman in her forties, finger-waved bob, pearl necklace, beaded evening gown, cool composed gaze',
    'Meneer Hargrove': 'a portly businessman in his fifties, slicked-back hair, thick moustache, dinner jacket with wing collar and bow tie, watch chain',
    'Dr. Quill': 'a sharp woman doctor in her forties, round wire spectacles, hair in a tight bun, high-collared blouse and tweed jacket',
    'Mortimer': 'a lanky, nervous man in his thirties, neatly parted hair, bow tie and waistcoat, thin face',
    'Juniper': 'a young woman in her twenties, flapper style, short curly bob with a beaded headband and one feather, long bead necklace',
    'Odette': 'a French woman in her thirties, dark wavy hair pinned up, lace collar, sly half-smile',
    'Majoor Pike': 'a retired army major in his sixties, bristling handlebar moustache, short grey hair, military tunic with medals',
    'Tante Agatha': 'an elderly aunt in her seventies, curly grey hair, round spectacles, cameo brooch, knitted shawl'
  },
  piraten: {
    'Barnaby': 'a weathered pirate in his forties, tricorn hat, thick dark beard, long coat with brass buttons',
    'Bootsman Grimsby': 'a burly boatswain in his fifties, bandana, eyepatch, scarred cheek, striped shirt, coil of rope over one shoulder',
    'Kok Saffron': 'a ship\'s cook, a woman in her thirties, bandana over braided hair, rolled sleeves, apron, wooden ladle',
    'Stuurman Ronan': 'a helmsman in his thirties, long hair tied back, moustache, open-collared shirt and leather waistcoat',
    'Juffrouw Coral': 'a young woman pirate in her twenties, tricorn hat over loose curls, hoop earrings, ruffled shirt',
    'Kanonnier Thorne': 'a gunner in his forties, bandana, bushy beard, soot on his face, sleeveless vest, powder horn on a strap',
    'Dokter Marlow': 'a ship\'s doctor, a woman in her fifties, spectacles, grey hair pulled back, dark coat, leather satchel strap',
    'Scheepsjongen Pip': 'a ship\'s boy of about thirteen, freckles, bandana, oversized shirt, cheeky grin'
  },
  hotel: {
    'Gravin Delacroix': 'a countess in her sixties, silver hair in elegant waves, pince-nez spectacles, fur stole, diamond necklace',
    'Portier Otis': 'a hotel doorman in his fifties, peaked cap with braid, moustache, double-breasted uniform with brass buttons',
    'Pianist Felix': 'a young pianist in his twenties, tousled hair, white dinner jacket, bow tie, dreamy look',
    'Mevrouw Sato': 'a Japanese businesswoman in her forties, sleek bob, elegant silk dress, composed expression',
    'Journalist Vance': 'a journalist in his thirties, top hat, pencil behind his ear, notebook in hand, quick eyes',
    'Chef Brigitte': 'a head chef, a woman in her forties, tall chef\'s toque, white double-breasted jacket, determined look',
    'Butler Winslow': 'a grey-haired butler in his sixties, neat moustache, tailcoat, white bow tie, impassive face',
    'Danseres Lulu': 'a young cabaret dancer in her twenties, short sleek bob, sequinned headband with a feather, sequinned dress'
  },
  ruimte: {
    'Dr. Nkemelu': 'a Nigerian station scientist in his fifties, close-cropped grey hair, sleek space suit with a collar ring, open helmet with the visor raised',
    'Piloot Reyes': 'a Latino pilot in his thirties, moustache, flight helmet with goggles pushed up, flight suit with patches',
    'Ingenieur Vega': 'an engineer, a woman in her thirties, rectangular glasses, practical ponytail, utility jumpsuit, headset',
    'Botanist Fern': 'a botanist, a woman in her twenties, wavy hair, a sprig of leaves tucked behind one ear, simple tunic',
    'Kadet Yuki': 'a young Japanese cadet of about nineteen, open helmet, crisp high-collared cadet uniform, earnest look',
    'Kok Dima': 'a Russian cook in his forties, full beard, short hair, galley apron over a jumpsuit',
    'Officier Paz': 'a security officer, a woman in her forties, glasses, open helmet, uniform with insignia, stern look',
    'Bioloog Wren': 'a biologist, a woman in her thirties, open helmet over curly hair, lab suit with sample vials on the chest'
  },
  museum: {
    'Gids Margot': 'a museum guide, a woman in her fifties, glasses on a chain, short curly hair, cardigan, lanyard',
    'Curator Ellery': 'a curator in his forties, neatly combed hair, bow tie, tweed blazer',
    'Restaurateur Iris': 'an art restorer, a woman in her thirties, hair tied up with a pencil, work smock, jeweller\'s loupe on her forehead',
    'Nachtwaker Gus': 'a night watchman in his sixties, peaked security cap, bushy moustache, uniform jacket, torch',
    'Professor Adebayo': 'a Nigerian professor in his sixties, glasses, grey beard, tweed jacket, scholarly look',
    'Kunsthandelaar Lucian': 'an art dealer in his forties, top hat, slick hair, silk cravat, sly smile',
    'Stagiair Noor': 'an intern, a young woman in her early twenties, headscarf, curious eyes, simple blouse, notebook',
    'Schoonmaker Hugo': 'a cleaner in his fifties, flat cap, overalls, mop handle over his shoulder'
  },
  trein: {
    'Barones Von Stahl': 'a baroness in her fifties, pince-nez, severe swept-back hair, high-collared coat with fur trim',
    'Goochelaar Orlando': 'a stage magician in his forties, top hat, waxed moustache, cape, a playing card between his fingers',
    'Schaakmeester Ivo': 'a chess master in his sixties, neat beard, waistcoat, thoughtful look, a chess knight in his hand',
    'Verpleegster Hedda': 'a nurse in her thirties, 1930s nurse\'s cap and cape, hair pinned back',
    'Reiziger Sami': 'a young traveller in his twenties, flat cap, travelling coat and scarf, Middle Eastern features',
    'Actrice Lola': 'an actress in her thirties, glamorous finger waves, pearl earrings, fur collar',
    'Stoker Jules': 'a train stoker in his thirties, soot-streaked face, bandana around his head, sleeveless undershirt, strong arms',
    'Weduwe Duval': 'a widow in her sixties, black hat with a mourning veil, spectacles, high black collar'
  },
  circus: {
    'Clown Pippo': 'a circus clown in his forties, white face paint with a painted smile but sad eyes, large ruffled collar',
    'Trapezeartiest Mira': 'a trapeze artist, a woman in her twenties, hair in a high bun, sequinned leotard',
    'Leeuwentemmer Gunther': 'a lion tamer in his forties, handlebar moustache, braided jacket with epaulettes, whip over his shoulder',
    'Waarzegster Zora': 'a fortune teller, a woman in her forties, headscarf hung with coins, large hoop earrings, dark-lined eyes',
    'Sterke Man Boris': 'a circus strongman, bald, big beard and moustache, striped singlet, huge shoulders',
    'Kaartverkoopster Dottie': 'a ticket seller, a woman in her fifties, round glasses, curly hair, a roll of tickets',
    'Jongleur Teo': 'a young juggler in his twenties, flat cap, harlequin-pattern vest, juggling balls',
    'Dierenarts Nadia': 'a veterinarian, a woman in her thirties, glasses, practical work coat, hair tied back'
  },
  skihut: {
    'Skilerares Astrid': 'a ski instructor, a Scandinavian woman in her thirties, patterned wool sweater, long braid, goggles on her head',
    'Bergredder Bjorn': 'a mountain rescuer in his forties, full beard, rescue jacket, coiled climbing rope over one shoulder',
    'Toeriste Hana': 'a Korean tourist, a woman in her twenties, short hair, puffy winter jacket, wool scarf',
    'Kok Luigi': 'an Italian cook in his fifties, moustache, chef\'s apron, rolled sleeves',
    'Fotograaf Emil': 'a photographer in his thirties, glasses, camera around his neck, turtleneck sweater',
    'Dokter Ingrid': 'a doctor, a woman in her fifties, glasses, grey bob, wool cardigan, stethoscope',
    'Jongen Kai': 'a boy of about twelve, knitted beanie, scarf, mittens, wide eyes',
    'Berggids Freya': 'a mountain guide, a woman in her forties, wool headband, weathered face, climbing rope over one shoulder'
  },
  hacienda: {
    'Doña Inés': 'a proud widow in her fifties, black hair in a low bun with a tortoiseshell comb, black lace mantilla over the shoulders, small gold cross',
    'Mariachi Rubén': 'a handsome mariachi singer in his thirties, thin moustache, charro jacket with silver buttons, wide bow tie, hat hanging on his back',
    'Kokkin Lupita': 'a warm cook in her forties, braids pinned around her head, embroidered blouse, apron, rebozo shawl over one shoulder',
    'Voorman Esteban': 'a weathered field foreman in his fifties, broad straw hat, grey stubble, work shirt with rolled sleeves, a coa harvesting tool over his shoulder',
    'Schilderes Paloma': 'a bohemian painter in her thirties, flowers braided into dark hair, bold earrings, paint-stained smock, direct gaze',
    'Neef Tomás': 'a slick young man in his twenties, oiled side-parted hair, sharp double-breasted suit, pencil moustache, cigarette case in hand',
    'Notaris Guzmán': 'a fussy notary in his sixties, round spectacles, bald with grey fringe, three-piece suit, leather document case',
    'Zuster Bárbara': 'a calm nun in her forties, simple dark habit and white wimple, wooden rosary, observant eyes'
  },
  opera: {
    'Diva Colette': 'a glamorous opera diva in her thirties, piled-up curls with a jewelled tiara, off-shoulder velvet gown, fur stole, haughty look',
    'Tenor Matteo': 'a dashing Italian tenor in his thirties, wavy hair, curled moustache, embroidered stage doublet with a ruff collar',
    'Dirigent Armand': 'a severe conductor in his sixties, wild white hair, white tie and tailcoat, baton in hand, intense frown',
    'Danseres Ninon': 'a young ballerina in her late teens, hair in a tight bun, tulle tutu bodice, ribbon at the neck, wide nervous eyes',
    'Kostumière Eloise': 'a sharp seamstress in her forties, measuring tape around the neck, pins in her collar, high-necked blouse, pince-nez',
    'Baron Viktor': 'a wealthy baron in his fifties, monocle, mutton-chop whiskers, opera cape over evening dress, silver-topped cane',
    'Toneelmeester Hugo': 'a burly stagehand chief in his forties, flat cap, rolled shirtsleeves, braces, coil of rope on his shoulder, short beard',
    'Recensente Simone': 'an elegant critic in her thirties, short dark hair under a small feathered hat, high-collared jacket, notebook and pencil, raised eyebrow'
  }
};

const prompt = (world, label) => `${STYLE} Setting: ${ERA[world]}. Character: ${PEOPLE[world][label]}.`;
module.exports = { STYLE, ERA, PEOPLE, prompt };
if (require.main === module) {
  const w = process.argv[2];
  console.log(JSON.stringify(Object.keys(PEOPLE[w]).map(l => ({ label: l, prompt: prompt(w, l) })), null, 1));
}
