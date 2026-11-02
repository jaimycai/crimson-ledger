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
  opera: 'a grand opera house in Paris on a premiere night in 1891',
  opgraving: 'an archaeological dig in the Valley of the Kings, Egypt, in 1922',
  casino: 'a luxurious casino in Monte Carlo on Grand Prix weekend in 1960',
  filmstudio: 'a Hollywood film studio in 1931',
  karavaan: 'a caravanserai at a desert oasis on the old spice route, around 1900',
  abdij: 'a medieval abbey in the mountains in the winter of 1327',
  vuurtoren: 'a lighthouse island off a stormy coast in 1900',
  oceaanstomer: 'a luxury ocean liner crossing the Atlantic from Southampton to New York in May 1910, the month of Halley\'s comet',
  ryokan: 'a traditional Japanese ryokan inn with its own hot spring in the wooded hills outside Kyoto, during the cherry blossom season of 1925',
  fazenda: 'a coffee plantation estate in the green hills of São Paulo state, Brazil, at harvest time in 1926',
  zeppelin: 'a luxury passenger airship drifting above the Atlantic Ocean on its way to Rio de Janeiro in the summer of 1929',
  poolstation: 'an international research station in Antarctica during the polar night of 1958',
  winterpaleis: 'a nobleman\'s palace on the frozen Neva in Saint Petersburg on New Year\'s Eve 1899',
  safarilodge: 'a Kenyan-owned safari lodge in the Maasai Mara during the great migration of 1974',
  hanok: 'a scholar\'s hanok in the mountains of Joseon Korea at the Chuseok harvest moon festival of 1795'
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
  },
  opgraving: {
    'Professor Hartley': 'a stern archaeologist in his fifties, pith helmet, round spectacles, grey moustache, khaki field jacket with many pockets',
    'Lady Rosamund': 'an English aristocrat in her twenties, cloche hat with a sun veil, pearl necklace, linen travelling dress, parasol over her shoulder',
    'Tekenares Maud': 'an expedition artist in her thirties, short practical bob, sleeves rolled up, pencil behind her ear, sketchbook in hand',
    'Opzichter Ahmed': 'an Egyptian dig foreman in his forties, white turban, neat beard, striped galabiya, calm authoritative look',
    'Correspondente Ivy': 'an American newspaper correspondent in her thirties, short wavy hair under a beret, trench coat, notebook and camera strap',
    'Kameeldrijver Omar': 'a young camel driver in his twenties, keffiyeh head scarf, bright smile, rope and a leather water bag over his shoulder',
    'Egyptologe Edith': 'a rival Egyptologist in her forties, tightly pinned hair, wire spectacles, high-collared blouse, magnifying glass on a chain',
    'Verzamelaar Von Hagen': 'a German antiquities collector in his sixties, white linen suit, panama hat, monocle, silver-headed walking stick'
  },
  casino: {
    'Croupier Marcel': 'a precise croupier in his forties, slicked-back hair, thin moustache, white dinner jacket with black bow tie, rake in hand',
    'Zangeres Gigi': 'a glamorous nightclub singer in her twenties, platinum bouffant hair, sparkling evening gown, long gloves, vintage microphone',
    'Erfgename Delphine': 'a wealthy heiress in her thirties, elegant updo, diamond earrings, silk evening gown, long cigarette holder',
    'Coureur Rocco': 'a dashing Italian racing driver in his thirties, tousled hair, leather racing jacket, driving goggles pushed up on his forehead',
    'Bankier Sterling': 'a cool English banker in his fifties, silver hair, tuxedo, pocket square, cufflinks, a faint smirk',
    'Fotomodel Tess': 'a fashion model in her twenties, sleek bob, bold eyeliner, polka-dot dress, big sunglasses pushed up into her hair',
    'Gokker Jack': 'a professional American gambler in his forties, fedora, loosened tie, cigar, a stack of chips in his hand',
    'Huisdetective Nora': 'the casino\'s house detective, a woman in her forties, sharp tailored suit, short hair, observant eyes, small notebook'
  },
  filmstudio: {
    'Filmster Vivian': 'a glamorous film star in her thirties, platinum finger waves, pencilled eyebrows, satin gown with a fur collar',
    'Regisseur Baxter': 'a film director in his fifties, flat cap, round glasses, tweed jacket, megaphone in hand',
    'Schrijfster Peggy': 'a sharp screenwriter in her thirties, short bob, cardigan, pencil behind her ear, typed script pages',
    'Stuntman Hank': 'a rugged stuntman in his thirties, broken nose, cowboy hat, bandana, leather vest',
    'Cameraman Lenny': 'a cameraman in his forties, cap worn backwards, rolled sleeves, a light meter on a cord around his neck',
    'Grimeuse Rita': 'a make-up artist in her forties, hair tied in a scarf, powder brush in hand, smock with many pockets',
    'Agent Sid': 'a fast-talking talent agent in his forties, pinstripe suit, slicked hair, cigar, carnation in his buttonhole',
    'Starlet Joy': 'a hopeful young starlet of about twenty, curly hair with a bow, polka-dot dress, wide eager smile'
  },
  karavaan: {
    'Koopvrouw Layla': 'a shrewd spice merchant in her forties, patterned headscarf, gold bangles, embroidered robe, a small brass scale',
    'Gids Tariq': 'a desert guide in his thirties, indigo turban wrapped down to the chin, keen eyes, camel stick',
    'Tapijthandelaar Yusuf': 'a jovial carpet merchant in his fifties, round cap, grey beard, striped kaftan, rolled carpet under his arm',
    'Reizigster Beatrix': 'a European woman traveller in her thirties, pith helmet with a scarf, linen jacket, travel journal',
    'Theeschenker Hamid': 'a young tea server in his twenties, small cap, embroidered vest, ornate brass teapot held high',
    'Sterrenkijker Zahra': 'an astronomer and navigator in her forties, head scarf with tiny stars, brass astrolabe in her hands',
    'Bewaker Karim': 'a stern caravanserai guard in his forties, thick moustache, sash, sheathed curved dagger, ring of keys',
    'Dichteres Samira': 'a young poet in her twenties, flowing scarf, kohl-lined eyes, reed pen and a small book of verses'
  },
  abdij: {
    'Broeder Anselm': 'an elderly librarian monk in his sixties, tonsure, grey beard, black Benedictine habit, large key ring',
    'Broeder Cuthbert': 'a stout herbalist monk in his forties, tonsure, rosy cheeks, habit with rolled sleeves, a bundle of dried herbs',
    'Novice Elias': 'a young novice of about eighteen, short hair, plain grey habit, nervous eyes, wax tablet',
    'Pelgrim Gisela': 'a pilgrim woman in her thirties, wide-brimmed hat with a scallop shell, travelling cloak, wooden staff',
    'Kruidenvrouw Hilde': 'a village herb woman in her fifties, linen head cloth, weathered face, basket of herbs',
    'Gravin Mathilde': 'a noble countess in her forties, fur-trimmed mantle, jewelled circlet over a veil, proud gaze',
    'Verluchtster Odile': 'a young illuminator of manuscripts in her twenties, ink-stained fingers, plain wimple, fine brush in hand',
    'Kelderbroeder Waldo': 'a burly cellarer monk in his fifties, tonsure, heavy jaw, leather apron over the habit, keys at his belt'
  },
  vuurtoren: {
    'Assistent Jonas': 'a young assistant lighthouse keeper in his twenties, knitted sweater, peaked cap, oil can in hand',
    'Huishoudster Martha': 'a sturdy housekeeper in her fifties, bonnet, shawl, apron, firm mouth',
    'Visser Bartel': 'a weathered fisherman in his sixties, oilskin sou\'wester hat, white beard, pipe',
    'Loodsman Kees': 'a harbour pilot in his forties, navy pea coat with brass buttons, captain\'s cap, spyglass',
    'Vogelkundige Dorien': 'an ornithologist in her thirties, tweed jacket, field glasses, a feather in her hat band, notebook',
    'Schipbreukeling Lev': 'a shipwreck survivor in his thirties, wet tousled hair, torn shirt, a blanket around his shoulders',
    'Onderwijzeres Wilma': 'the island schoolteacher in her forties, hair in a tight bun, high-collared blouse, spectacles on a chain',
    'Telegrafiste Fien': 'a young telegraph operator in her twenties, short curls, waistcoat, sleeve garters, a telegraph key in front of her'
  },
  oceaanstomer: {
    'Kapitein Grant': 'a dignified ocean liner captain in his sixties, neat white beard, navy double-breasted uniform with gold braid on the sleeves, white-topped peaked cap',
    'Stewardess Molly': 'a brisk ship stewardess in her twenties, hair in a neat bun under a small white cap, starched white apron over a dark uniform dress, a ring of cabin keys',
    'Vliegenierster Solange': 'a daring French aviatrix in her thirties, short dark curls, leather flying cap with goggles pushed up, fitted leather coat, long silk scarf',
    'Professor Lund': 'a Swedish astronomer in his fifties, unruly grey hair, round spectacles, rumpled tweed suit, a brass telescope under his arm',
    'Suffragette Harriet': 'an English suffragette and writer in her forties, large hat, purple white and green sash across her chest, high-collared blouse, a bundle of pamphlets',
    'Marconist Arthur': 'a young wireless operator in his twenties, neatly parted hair, headphones over his ears, waistcoat, pencil behind his ear, a message form in his hand',
    'Hoofdmachinist Doyle': 'a broad-shouldered chief engineer in his fifties, thick sideburns, soot on one cheek, officer jacket over a boiler suit, an oil can in his hand',
    'Hoedenmaakster Edna': 'a stylish milliner in her thirties, enormous Edwardian hat with ostrich feathers, lace blouse, hat pins in her lapel, a striped hatbox'
  },
  ryokan: {
    'Gastvrouw Fumiko': 'a gracious ryokan hostess in her fifties, hair in a neat traditional chignon with a lacquered comb, plum-coloured kimono with a dark obi, hands folded, attentive eyes',
    'Kok Takeshi': 'a meticulous kaiseki chef in his forties, cropped hair, white cotton headband, white chef coat, holding a lacquered tray with small dishes',
    'Theemeesteres Chiyo': 'a serene tea ceremony master in her sixties, grey hair in a low bun, subdued grey kimono, a bamboo tea whisk in her hands',
    'Ingenieur Isamu': 'an ambitious railway engineer, a Japanese man in his thirties, western three-piece suit, round wire glasses, slicked-back hair, rolled blueprints under his arm',
    'Fotografe Sachiko': 'a modern photographer, a young Japanese woman in her twenties, short bobbed hair, cloche hat, drop-waist western dress, folding camera on a strap',
    'Tuinman Goro': 'an elderly gardener in his sixties, cropped grey hair, indigo work jacket, straw sandals, a bamboo rake and pruning shears',
    'Plantkundige Evelyn': 'an English botanist in her forties, sensible tweed jacket, wide-brimmed sun hat, magnifying glass, a sprig of cherry blossom pressed in a notebook',
    'Prentmaker Hiroshi': 'a woodblock print artist in his forties, short cropped hair, dark work kimono with tied-back sleeves, carving tool in hand, a print of cherry blossoms'
  },
  fazenda: {
    'Dona Celeste': 'a sharp-eyed Brazilian woman in her thirties, wavy bobbed hair, cream drop-waist dress, pearl earrings, a leather ledger under her arm',
    'Rentmeester Joaquim': 'a weathered estate manager in his fifties, wide-brimmed felt hat, grey moustache, riding boots, a pocket watch on a chain',
    'Lerares Giulia': 'a warm schoolteacher in her twenties, dark hair in a loose knot, white blouse with a cameo brooch, a stack of slates under her arm',
    'Koffieproever Bento': 'a distinguished Afro-Brazilian coffee taster in his fifties, short grey hair, neat moustache, white linen suit, a silver tasting spoon and a small cup',
    'Pianiste Zélia': 'a lively Brazilian pianist in her thirties, sleek finger-waved hair, beaded evening dress, long necklace, sheet music in her hand',
    'Agronoom Hideo': 'a thoughtful Japanese-Brazilian agronomist in his thirties, short neat hair, rolled shirtsleeves, khaki trousers with braces, a coffee seedling in a small pot',
    'Inkoper Mulder': 'a Dutch coffee buyer in his forties, light linen suit, straw boater hat, trimmed blond beard, a notebook full of prices',
    'Dokter Lúcia': 'a country doctor in her forties, practical riding skirt and jacket, hair pinned under a small hat, leather medical bag, stethoscope around her neck'
  },
  zeppelin: {
    'Commandant Brandt': 'an airship commander in his fifties, trimmed grey beard, dark uniform jacket, white peaked cap, binoculars around his neck',
    'Verslaggeefster Daisy': 'an adventurous newspaper reporter in her thirties, sleek dark bob, tailored tweed suit, aviator scarf, a fountain pen and notebook',
    'Navigator Mateus': 'a young Brazilian navigator in his twenties, dark curly hair, open-collared uniform shirt, a rolled chart under his arm, pencil behind his ear',
    'Weerkundige Liv': 'a Norwegian meteorologist in her thirties, fair hair pinned in a low knot, thick knitted cardigan, round spectacles, a brass barometer in her hands',
    'Monteur Rudi': 'a cheerful engine mechanic in his thirties, woollen cap, grease on one cheek, overalls with rolled sleeves, a spanner in his hand',
    'Tennisster Josette': 'a famous tennis champion in her twenties, bandeau headband over bobbed hair, white pleated tennis dress, cardigan over her shoulders, a wooden racket',
    'Diplomaat Vidal': 'a polished French diplomat in his fifties, silver hair, waxed silver moustache, dark morning coat, a rosette in his lapel, leather document case',
    'Postmeesteres Elsbeth': 'a meticulous postmistress in her forties, hair in a tight bun, uniform jacket with brass buttons, an ink stamp in her hand, a sack of airmail beside her'
  },
  poolstation: {
    'Marconist Ole': 'a Norwegian radio operator in his thirties, short blond beard, Fair Isle knitted sweater, headphones around his neck, pencil behind his ear',
    'Glaciologe Marina': 'a Soviet glaciologist in her forties, short practical hair, plain fur ushanka hat with the flaps tied up, quilted padded jacket, a long cylinder of ice core in gloved hands. No political symbols anywhere: no star or badge on the hat, no flags, no hammer and sickle',
    'Dokter Kenji': 'a Japanese expedition doctor in his thirties, round wire glasses, neat side-parted hair, white coat over a thick wool turtleneck, stethoscope',
    'Meteorologe Ruth': 'an American meteorologist in her thirties, short curls, horn-rimmed glasses, red parka with a fur-trimmed hood down, clipboard with weather charts',
    'Hondenmenner Rewi': 'a Maori dog handler from New Zealand in his twenties, broad warm smile, woollen beanie, windproof anorak, sealskin mittens, a dog harness over his shoulder',
    'Monteur Lieve': 'a Belgian mechanic in her thirties, hair tied back under a knitted cap, oil-stained overalls over a wool sweater, a large spanner in hand',
    'Kok Mateo': 'an Argentine cook in his forties, thick dark moustache, white apron over a checked flannel shirt, rolled sleeves, a ladle in hand',
    'Natuurkundige Hélène': 'a French physicist in her thirties, dark bob, polo-neck sweater under a duffle coat, a notebook full of aurora sketches and a small brass instrument'
  },
  winterpaleis: {
    'Gravin Jelena': 'an elegant Russian countess in her forties, dark hair in a high chignon with a diamond aigrette, pale blue silk ball gown, long white gloves, pearl necklace',
    'Componist Sergej': 'a young Russian composer in his twenties, unruly dark hair, pince-nez, velvet jacket with a loose cravat, sheet music under his arm',
    'Schaatsster Vera': 'a figure skater in her twenties, braid pinned under a fur toque, fitted velvet skating jacket with braided frogging, white skates slung over her shoulder',
    'Goudsmid Pavel': 'a meticulous goldsmith in his fifties, grey goatee, jeweller\'s loupe pushed up on his forehead, dark frock coat, a small velvet box in his hands',
    'Gouvernante Mabel': 'an English governess in her thirties, hair in a neat bun, high-necked grey dress with a cameo brooch, a small book in hand, alert eyes',
    'Luitenant Dmitri': 'a dashing guards officer in his thirties, waxed moustache, white dress uniform with gold epaulettes and a sash, plumed helmet under his arm',
    'Hofmeester Fjodor': 'a dignified major-domo in his sixties, white side whiskers, dark livery with silver buttons, white gloves, a heavy ring of keys',
    'Fotografe Sofia': 'a modern woman photographer in her thirties, short wavy hair, tailored jacket with a high collar, a wooden plate camera with a flash pan'
  },
  safarilodge: {
    'Eigenares Wambui': 'a Kenyan lodge owner in her fifties, colourful kitenge headwrap, tailored khaki safari dress, reading glasses on a beaded chain, a warm but shrewd gaze',
    'Gids Otieno': 'a Kenyan safari guide in his thirties, khaki shirt with a lodge badge, wide-brimmed bush hat, binoculars around his neck, easy smile',
    'Dierenarts Njeri': 'a Kenyan wildlife vet in her thirties, short natural hair, khaki field shirt with rolled sleeves, stethoscope, a leather vet bag',
    'Piloot Kiprono': 'a Kenyan bush pilot in his thirties, aviator sunglasses pushed up on his forehead, short-sleeved pilot shirt with epaulettes, headset around his neck',
    'Chef Hamisi': 'a Kenyan chef from the Swahili coast in his forties, embroidered kofia cap, white chef\'s jacket, neatly trimmed beard, a wooden spoon in hand',
    'Journaliste Amina': 'a Kenyan newspaper journalist in her twenties, big rounded afro, round sunglasses, patterned 1970s blouse, notebook and a portable cassette recorder',
    'Geluidsman Felix': 'a German sound recordist in his thirties, long hair and sideburns, headphones, khaki vest with many pockets, a reel-to-reel tape recorder on a strap',
    'Biologe Hanne': 'a Danish lion researcher in her thirties, sun-bleached ponytail, freckles, faded field shirt, a notebook and a radio-tracking antenna'
  },
  hanok: {
    'Vrouwe Kang': 'a dignified Joseon noblewoman in her fifties, hair in a low chignon with a long silver binyeo hairpin, jade-green jeogori jacket and deep blue chima skirt, a ring of household keys',
    'Student Sang-u': 'a young Joseon scholar of about twenty, black horsehair gat hat, white dopo robe, a bound book of classics, earnest face',
    'Geneesvrouw So-yeon': 'a Joseon woman physician in her thirties, hair in a neat chignon under a black garima headpiece, plain indigo hanbok, a cloth roll of needles and a herb pouch',
    'Schilder Dae-ho': 'a genre painter in his forties, wispy beard, soft black cap, grey robe spattered with ink, brushes in a bamboo holder',
    'Borduurster Yeon-i': 'a young woman of about nineteen, long single braid with a red daenggi ribbon, rose-pink jeogori and white chima, an embroidery hoop with a crane design',
    'Tolk Hak-su': 'a court interpreter in his forties, black gat hat, blue official robe, round spectacles from Beijing, a small wooden box of books',
    'Kokkin Sun-i': 'a sturdy head cook in her fifties, hair wrapped in a white cloth, sleeves tied back, apron over a plain hanbok, a large wooden ladle',
    'Marskramer Deok-su': 'a cheerful travelling peddler in his thirties, round bamboo hat with white cotton tufts, short jacket and wide trousers, a wooden A-frame pack on his back'
  }
};

const prompt = (world, label) => `${STYLE} Setting: ${ERA[world]}. Character: ${PEOPLE[world][label]}.`;
module.exports = { STYLE, ERA, PEOPLE, prompt };
if (require.main === module) {
  const w = process.argv[2];
  console.log(JSON.stringify(Object.keys(PEOPLE[w]).map(l => ({ label: l, prompt: prompt(w, l) })), null, 1));
}
