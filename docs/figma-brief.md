# Figma-prompt: Crimson Ledger, "de epische update"

Plak de tekst hieronder in Figma (Make of AI-first-draft) of geef hem aan een ontwerper.
Referentie-schermafbeeldingen van de huidige app staan in `store/screenshots/` (1290×2796);
sleep die in het Figma-bestand als "huidige staat".

---

You are designing new screens for **Crimson Ledger**, an existing iOS puzzle game in Dutch. Players place suspects on a floor plan using clues; only the murderer was in the victim's room. The game already works and has a distinct look. Your job is to design six additions that make it feel like an epic, rewarding game (think Candy Crush's level map and win celebrations, Plants vs Zombies' sense of "something new every level"), **without changing the existing visual language and without lives, timers, energy or paywalls**. The audience includes children from about 10 years old, so everything must be readable and obvious.

## Existing design language (keep it)

- Mood: a detective's paper ledger. Warm, calm, slightly vintage. No neon, no glossy 3D.
- Colours: paper background #FAF5EF, secondary background #F3EDE3, cards #FFFFFF, text #2C1810 (secondary #5A3E2B, light #6B5445), accent crimson #8B2E1C (light #A8432E), gold #B8955C (light #D4B074), success green #2E7D32, error red #C62828, borders #D4C4B0 / #E8DDD0.
- Type: headings in Playfair Display (bold, sometimes italic), body in Inter. Body text at least 15pt.
- Shapes: cards with 12px radius and a 1.5px light border, pills with full radius, soft shadows (0 4px 12px rgba(44,24,16,0.08)). Buttons: primary crimson with white text, secondary paper-coloured with a border.
- Existing components to reuse: round suspect portraits (flat vector faces on a coloured circle with a dark outline), the floor-plan board (checkerboard rooms in pastel colours, thick black walls, room names in white pill labels), clue cards (colour bar, number, portrait, sentence, round status check), difficulty cards with a mini floor plan, a rank line "🎖 Rechercheur ▬▬ nog 3 zaken tot Inspecteur".
- Four worlds, each with its own palette and icon: Het Landhuis 🏚️ (1927 country house, pastel rooms), Het Piratenschip 🏴‍☠️ (wooden planks, ochre and brown), Grand Hotel Aurora 🏨 (marble, cream and rose), Station Orion 🚀 (grey-blue grid floor).
- Device: iPhone 15 Pro, 393×852 pt, portrait only, safe areas 59pt top and 34pt bottom. Tap targets at least 44pt.
- All UI copy is Dutch. Use the Dutch strings given below exactly.

Do **not** redesign the floor-plan board or the in-game screen layout (board on top, suspect strip, scrolling clue cards, tool bar). Design around them.

## Screens to design

### 1. Wereldkaart (level map), one frame per world plus a world switcher
A winding vertical path with numbered nodes, like a saga map, scrolling upwards through the world. Each world has 24 cases in three parts of eight: "Deel I · Het diner", "Deel II · De erfgenamen", "Deel III · De nacht van de storm" (Landhuis). Show part headers as signposts or ribbons along the path. Node states: locked (grey, small lock), open (crimson, pulsing ring, this is the current case), done with 1, 2 or 3 gold stars. Put a player marker on the current node (a small detective figure or magnifying-glass pin). After the third part the path continues into "📁 Het archief · eindeloos" with nodes "Dossier 1, 2, 3…". Background: a soft illustrated backdrop of the world (mansion exterior with garden path, ship deck to crow's nest, hotel floors, space station modules) that sits behind the path at low contrast. Top bar: back arrow, world title, total stars "24/72 ★". Bottom sticky button: "▶ Speel zaak 6 · De tuinman zwijgt". World switcher: horizontal chips or tabs at the top with the four world icons; locked worlds show "nog 2 zaken". Also design the tap-on-node popover: case title, difficulty pill (🟢 Makkelijk / 🟡 Gemiddeld / 🔴 Moeilijk), one-line story, best stars, button "Speel".

### 2. Zaak Gesloten (case closed) celebration
A sequence of 4 keyframes for one screen: (a) a green "ZAAK GESLOTEN" stamp slams down at an angle with a soft paper-shake and a burst of confetti in gold and crimson; (b) three stars fly in one by one and land in a row with a small flash; (c) a score panel counts up: "Basis 500", "Tijdbonus +120", "Zonder hint +200", "In één keer +150", total "970 punten" in Playfair; (d) the rank bar fills and, when a rank is reached, a full-width badge appears: "🎖 Nieuwe rang: Inspecteur". Below: the existing "Waar iedereen stond" list, then buttons "▶ Volgende zaak: Het testament" (primary), "📤 Deel resultaat", "Naar de kaart". Keep it warm, not flashy; think of a case file being closed with satisfaction.

### 3. Verklaringen (clues as spoken statements)
Redesign the clue card as testimony: round portrait on the left, the suspect's name in bold, and a speech bubble with the statement in first person, for example "Ik stond direct naast een plant 🪴." Clues about two people show two portraits. Design five states as component variants: neutral, klopt (green border, green check, bubble slightly tinted), klopt niet (red border, red cross), gefocust (crimson outline, used while the room lights up on the board), afgevinkt (dimmed, struck through). Also design a "Nieuw!" intro card that appears once when a new clue type is introduced: gold ribbon "Nieuw in dit deel", a title like "Rijen en kolommen", one sentence of explanation and a tiny diagram, button "Begrepen". And design the accusation moment: the murder-question sheet with suspect buttons, plus the reaction bubble when you pick the wrong person ("Ik? Nooit!") and the right one ("… Hoe wist je dat?").

### 4. De Inspecteur (mentor) briefing card
A recurring mentor character, "Inspecteur Van Dam", in the same flat portrait style as the suspects. Design a briefing card shown before a campaign case (portrait, name, two lines of text, button "Aan de slag") and a short remark card after it (one line, small). Also a "Nieuw deel" splash when a part opens: world icon, "Deel II · De erfgenamen", the part's intro line, button "Begin".

### 5. Onderscheidingen en vitrine (achievements and collection)
A screen with two tabs. "Onderscheidingen": a grid of medals, locked ones greyed with a hint text, unlocked ones in gold with the date; examples: "Eerste zaak", "Zeven dagen op rij", "Tien keer zonder hint", "Deel I voltooid", "Meesterdetective". "Vitrine": evidence items collected per solved case, arranged on shelves per world (a wine glass, a key, a letter, a compass, a hotel key card, a sensor…), with empty silhouettes for cases not yet solved. Include the toast that appears in-game when a medal is earned.

### 6. Dagelijkse beloningskalender (daily streak calendar)
On the home screen, replace the plain "🔥 5 dagen streak" line with a seven-day strip: past days ticked, today highlighted, day 7 marked with a small reward (a medal). Below it a line "Speel vandaag om je streak te houden". Also design the "Zaak van de week" card next to the daily case: a special weekly case with a shareable result. Keep the home screen order: daily case, streak, campaign entry ("Verder met: Deel II · zaak 3"), then free play.

## Deliverables

- One Figma page per screen, frames at 393×852 with safe areas shown. Name frames in Dutch as above.
- Components with variants for: map node (locked / open / 1★ / 2★ / 3★), clue card (5 states), medal (locked / unlocked), calendar day (past / today / future / reward).
- Colour and type styles set up as variables using the values above, so nothing is hard-coded.
- Illustrations (world backdrops, evidence items, the mentor) as vector so they can be exported as SVG.
- For the celebration, a storyboard row of the four keyframes with timing notes (total under 2.5 seconds, skippable by tap).
- A short "why" note per screen: what the player should feel and what they should tap next.
