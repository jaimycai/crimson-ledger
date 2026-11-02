"""Genereert art/rive/vandam/scene.rml: Inspecteur Van Dam als levend medaillon.

Het echte portret (assets/vandam.jpg, 512x512) krijgt een mesh met gewichten op botten:
  Frame (stil: ring en achtergrond), Body (ademen), HeadIdle > Head (drijven, knikken, kantelen),
  in Head: BrowL/BrowR (wenkbrauwen), LidL>LidLx en LidR>LidRx (knipperen en knijpen),
  Cheeks (glimlach onder de snor) en Jaw (praten).
Idle-botten en reactie-botten zijn gescheiden en genest, zodat lagen optellen in plaats van
elkaar te overschrijven.

Draaien:  python3 art/rive/tools/gen_vandam.py && rive art/rive/vandam --verify
Coordinaten: beeldruimte 512x512 = artboardruimte (afbeelding op 256,256, schaal 1).
"""
import math
import os
import sys

import numpy as np
from scipy.spatial import Delaunay

sys.path.insert(0, os.path.dirname(__file__))
from kit import Ids, keyed, triangle_bytes, pack_weights, fmt  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'vandam', 'scene.rml')

# ── Botten: naam -> (wereldpositie, ouder) ─────────────────────────────────────
BONES = {
    'Frame':    ((256.0, 256.0), None),
    'Body':     ((256.0, 440.0), None),
    'HeadIdle': ((256.0, 240.0), None),
    'Head':     ((256.0, 240.0), 'HeadIdle'),
    'BrowL':    ((221.0, 155.0), 'Head'),
    'BrowR':    ((285.0, 155.0), 'Head'),
    'LidL':     ((221.0, 171.5), 'Head'),
    'LidLx':    ((221.0, 171.5), 'LidL'),
    'LidR':     ((282.0, 171.5), 'Head'),
    'LidRx':    ((282.0, 171.5), 'LidR'),
    'Cheeks':   ((256.0, 205.0), 'Head'),
    'Jaw':      ((258.0, 239.0), 'Head'),
}
TENDONS = ['Frame', 'Body', 'Head', 'BrowL', 'BrowR', 'LidLx', 'LidRx', 'Cheeks', 'Jaw']
T = {n: i for i, n in enumerate(TENDONS)}


def local(name):
    (x, y), parent = BONES[name]
    if parent is None:
        return x, y
    px, py = BONES[parent][0]
    return x - px, y - py


# ── Maskers ────────────────────────────────────────────────────────────────────
def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def ell_sd(p, c, rx, ry):
    """Benaderde getekende afstand tot een ellips (negatief binnen)."""
    dx, dy = p[0] - c[0], p[1] - c[1]
    d = math.hypot(dx / rx, dy / ry)
    if d < 1e-6:
        return -min(rx, ry)
    ang = math.atan2(dy, dx)
    rl = 1.0 / math.hypot(math.cos(ang) / rx, math.sin(ang) / ry)
    return (d - 1.0) * rl


def ell_mask(p, c, rx, ry, fall):
    return float(smooth(fall, 0.0, ell_sd(p, c, rx, ry)))


HEAD_ELLS = [((256, 85), 68, 50), ((255, 140), 118, 21), ((257, 205), 76, 82), ((257, 262), 48, 26)]
DISC_C = (256.0, 254.0)


def head_mask(p):
    # boven de bol van de hoed ligt de buitenrand van de ring dichtbij: daar een kortere overgang
    return max(ell_mask(p, c, rx, ry, 8.0 if k == 0 else 18.0) for k, (c, rx, ry) in enumerate(HEAD_ELLS))


def crown_follow(p):
    """Hoeveel van de hoofdbeweging de bol van de hoed meeneemt: onderaan alles, bovenin iets meer dan de helft,
    zodat de ring erboven niet meetrekt."""
    return 0.45 + 0.55 * float(smooth(30.0, 80.0, p[1]))


def inner_mask(p):
    r = math.hypot(p[0] - DISC_C[0], p[1] - DISC_C[1])
    return float(smooth(181.0, 160.0, r))


def shoulder_y(x):
    dx = abs(x - 256.0)
    pts = [(0, 262), (60, 278), (170, 296), (260, 300)]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        if dx <= x1:
            return y0 + (y1 - y0) * (dx - x0) / (x1 - x0)
    return 300


def body_mask(p):
    ys = shoulder_y(p[0])
    return float(smooth(ys - 24.0, ys - 2.0, p[1]))


# ── Punten ─────────────────────────────────────────────────────────────────────
EYES = {'L': dict(cx=221.0, hw=12.5, yt=164.6, yb=171.5, lid='LidLx', brow='BrowL'),
        'R': dict(cx=282.0, hw=12.0, yt=164.0, yb=171.5, lid='LidRx', brow='BrowR')}
BROW_C = {'L': 221.0, 'R': 285.0}

points = []      # (x, y, kind, fixed-gewichten of None, contour)


def add(x, y, kind, w=None, contour=False):
    points.append((float(x), float(y), kind, w, contour))


# 1. contour: rand van het vierkant, met de klok mee
step = 64
edge = []
for x in range(0, 512, step):
    edge.append((x, 0))
for y in range(0, 512, step):
    edge.append((512, y))
for x in range(512, 0, -step):
    edge.append((x, 512))
for y in range(512, 0, -step):
    edge.append((0, y))
for x, y in edge:
    add(x, y, 'contour', {T['Frame']: 1.0}, contour=True)

# 2. ring en rand: vaste steunpunten
for r, n in ((248, 24), (228, 36), (206, 40), (190, 64)):
    for k in range(n):
        a = 2 * math.pi * k / n
        add(DISC_C[0] + r * math.cos(a), DISC_C[1] + r * math.sin(a), 'ring')
for k in range(64):
    a = 2 * math.pi * (k + 0.5) / 64
    add(DISC_C[0] + 176 * math.cos(a), DISC_C[1] + 176 * math.sin(a), 'disc')

# 3. ogen, wenkbrauwen, mond: rijen met vaste gewichten (relatief binnen het hoofd)
eye_boxes = []
for side, e in EYES.items():
    cx, hw, yt, yb = e['cx'], e['hw'], e['yt'], e['yb']
    lid, brow = T[e['lid']], T[e['brow']]
    # Knipperen = de rijen boven het oog zakken naar de onderooglidlijn. Wat dan het oog bedekt is de lichte
    # huidplooi (uitgerekt) met de donkere wimperlijn smal eronder: plooi vast, wimperbovenkant 0.9, onderkant 1.0.
    for dx in (-11.5, -8.5, -4.0, 0.0, 4.0, 8.5, 11.5):
        add(cx + dx, yt + 3.0 * (dx / hw) ** 2, 'lid', {lid: 1.0})            # onderkant wimperlijn
        add(cx + dx, yt - 2.3 + 3.0 * (dx / hw) ** 2, 'lid', {lid: 0.9})      # bovenkant wimperlijn
        add(cx + dx, yb - 1.8 * (dx / hw) ** 2, 'lid', {lid: 1.0})            # onderooglid
    for dx in (-13.5, 13.5):
        add(cx + dx, (yt + yb) / 2 + 0.5, 'lid', {lid: 1.0})                 # ooghoeken
    for dx in (-15.0, -7.0, 0.0, 7.0, 15.0):
        add(cx + dx, yt - 4.6 + 2.0 * (dx / hw) ** 2, 'fold', {brow: 0.15})   # lichte huidplooi, blijft staan
        add(cx + dx, 178.0 + 1.0 * abs(dx) / 15, 'under', {T['Cheeks']: 0.35, lid: 0.12})
    bc = BROW_C[side]
    for dx in (-18.0, -9.0, 0.0, 9.0, 18.0):
        add(bc + dx, 151.5, 'brow', {brow: 1.0})
        add(bc + dx, 157.5, 'brow', {brow: 1.0})
        add(bc + dx, 143.0, 'forehead', {brow: 0.35})
    for dx in (-20.0, -10.0, 0.0, 10.0, 20.0):
        add(cx + dx, 188.0, 'cheek', None)
    eye_boxes.append((cx - 21, 139, cx + 21, 184))

for x in range(236, 285, 8):
    add(x, 233.5, 'mouth', {T['Jaw']: 0.15})
    add(x, 239.0, 'mouth', {T['Jaw']: 0.55})
    add(x, 244.0, 'mouth', {T['Jaw']: 1.0})
mouth_box = (231, 229, 289, 248)


def in_box(x, y, b, pad=0.0):
    return b[0] - pad <= x <= b[2] + pad and b[1] - pad <= y <= b[3] + pad


# 4. fijn raster in het gezicht en de hoed, grof raster elders in de schijf
def free(x, y):
    if any(in_box(x, y, b) for b in eye_boxes):
        return False
    return not in_box(x, y, mouth_box)


for y in np.arange(112, 300, 9.0):
    off = 4.5 if int(round((y - 112) / 9)) % 2 else 0.0
    for x in np.arange(176 + off, 340, 9.0):
        if head_mask((x, y)) > 0.02 and free(x, y):
            add(x, y, 'face')
for y in np.arange(30, 116, 12.0):
    for x in np.arange(184, 330, 12.0):
        if head_mask((x, y)) > 0.02:
            add(x, y, 'hat')
for y in np.arange(110, 168, 12.0):     # rand van de hoed
    for x in np.arange(128, 386, 12.0):
        if head_mask((x, y)) > 0.02 and free(x, y):
            add(x, y, 'brim')
for y in np.arange(84, 440, 17.0):
    off = 8.5 if int(round((y - 84) / 17)) % 2 else 0.0
    for x in np.arange(80 + off, 440, 17.0):
        if math.hypot(x - DISC_C[0], y - DISC_C[1]) < 168 and head_mask((x, y)) < 0.05:
            add(x, y, 'disc')

# 5. ontdubbelen: rijen met vaste gewichten gaan voor
prio = {'contour': 0, 'lid': 1, 'brow': 1, 'mouth': 1, 'fold': 2, 'under': 2, 'forehead': 2, 'cheek': 3,
        'ring': 4, 'disc': 6, 'face': 5, 'hat': 5, 'brim': 5}
order = sorted(range(len(points)), key=lambda i: prio[points[i][2]])
kept = []
for i in order:
    x, y = points[i][0], points[i][1]
    k = points[i][2]
    lim = 1.5 if k == 'lid' else 2.6 if k in ('brow', 'mouth', 'fold', 'under', 'forehead') else 5.5
    if all((x - points[j][0]) ** 2 + (y - points[j][1]) ** 2 > lim * lim for j in kept):
        kept.append(i)
contour_idx = [i for i in kept if points[i][4]]
other_idx = [i for i in kept if not points[i][4]]
# contour in de oorspronkelijke volgorde (met de klok mee), daarna de rest
contour_idx.sort()
final = [points[i] for i in contour_idx + other_idx]
P = np.array([(p[0], p[1]) for p in final])
tri = Delaunay(P).simplices
# alle driehoeken met de klok mee (y omlaag) zodat geen enkele gespiegeld begint
fixed = []
for a, b, c in tri:
    (x0, y0), (x1, y1), (x2, y2) = P[a], P[b], P[c]
    if (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0) < 0:
        b, c = c, b
    fixed.append((a, b, c))
tri = fixed


# ── Gewichten ──────────────────────────────────────────────────────────────────
def feature_mask(p):
    f = {}
    for side, bc in BROW_C.items():
        f[T['Brow' + side]] = ell_mask(p, (bc, 155), 22, 7, 7)
    f[T['Cheeks']] = max(ell_mask(p, (213, 195), 16, 12, 12), ell_mask(p, (301, 195), 16, 12, 12),
                         ell_mask(p, (222, 231), 12, 8, 8), ell_mask(p, (295, 231), 12, 8, 8))
    f[T['Jaw']] = max(ell_mask(p, (257, 262), 34, 14, 12), 0.12 * ell_mask(p, (258, 224), 36, 8, 6))
    return f


def weights_for(pt):
    x, y, kind, fixedw, _ = pt
    p = (x, y)
    if kind == 'contour':
        return [(T['Frame'], 1.0)]
    hm = head_mask(p)
    if kind in ('lid', 'brow', 'mouth', 'fold', 'under', 'forehead'):
        hm = 1.0
    rest = 1.0 - hm
    wb = rest * body_mask(p) * inner_mask(p)
    out = {T['Frame']: rest - wb, T['Body']: wb}
    feats = fixedw if fixedw is not None else feature_mask(p)
    s = sum(feats.values())
    if s > 1.0:
        feats = {k: v / s for k, v in feats.items()}
        s = 1.0
    cf = crown_follow(p)
    out[T['Frame']] += hm * (1.0 - cf)
    hm *= cf
    out[T['Head']] = hm * (1.0 - s)
    for k, v in feats.items():
        out[k] = out.get(k, 0.0) + hm * v
    return list(out.items())


# ── RML ────────────────────────────────────────────────────────────────────────
ids = Ids(100)
bone_id = {n: ids() for n in BONES}
L = []
A = L.append

verts = []
for i, pt in enumerate(final):
    x, y = pt[0], pt[1]
    vals, inds = pack_weights(weights_for(pt))
    tag = 'ContourMeshVertex' if pt[4] else 'MeshVertex'
    verts.append(f'<{tag} x="{fmt(x - 256)}" y="{fmt(y - 256)}" u="{fmt(x / 512)}" v="{fmt(y / 512)}">'
                 f'<Weight values="{vals}" indices="{inds}"/></{tag}>')

tendons = []
for n in TENDONS:
    (x, y), _ = BONES[n]
    tendons.append(f'<Tendon boneId="{bone_id[n]}" tx="{fmt(x)}" ty="{fmt(y)}" name="{n}"/>')


LID_INK = ids()


def lid_ink():
    """Gravure-arcering op het gesloten ooglid: drie korte boogjes per oog in donker sepia, alleen zichtbaar
    in de twee, drie frames dat het oog dicht is (het uitgerekte vel is anders glad als plastic)."""
    hx, hy = BONES['Head'][0]
    shapes = []
    for side, e in EYES.items():
        cx = e['cx']
        for k, (yy, half, sag, alpha) in enumerate(((163.2, 9.5, 1.6, 'AA'), (165.9, 10.5, 2.0, '99'), (168.4, 11.0, 1.8, '80'))):
            shapes.append(
                f'<Shape x="{fmt(cx - hx)}" y="{fmt(yy - hy)}" name="Ink{side}{k}">'
                f'<PointsPath isClosed="false" name="P">'
                f'<StraightVertex x="{fmt(-half)}" y="0"/>'
                f'<CubicMirroredVertex x="0" y="{fmt(sag)}" rotation="0" distance="{fmt(half * 0.55)}"/>'
                f'<StraightVertex x="{fmt(half)}" y="0"/>'
                f'</PointsPath>'
                f'<Stroke thickness="0.75" cap="round" name="S"><SolidColor colorValue="{alpha}2C1810" name="C"/></Stroke>'
                f'</Shape>')
    return f'<Node opacity="0" name="LidInk" id="{LID_INK}">' + ''.join(shapes) + '</Node>'


def bone_xml(name, depth=0):
    lx, ly = local(name)
    kids = [k for k, (_, par) in BONES.items() if par == name]
    open_ = f'<RootBone x="{fmt(lx)}" y="{fmt(ly)}" length="12" name="{name}" id="{bone_id[name]}"'
    inner = [bone_xml(k, depth + 1) for k in kids]
    if name == 'Head':
        inner.insert(0, lid_ink())
    if not inner:
        return open_ + '/>'
    return open_ + '>\n' + '\n'.join(inner) + '\n</RootBone>'


SM, VM, VMI = ids(), ids(), ids()
P_HAPPY, P_HMM, P_TALK = ids(), ids(), ids()
WARM = ids()
ANIM = {n: ids() for n in ('idle', 'rest', 'happy', 'hmm', 'quiet', 'talk')}
ST = {n: ids() for n in ('idle', 'rest', 'happy', 'hmm', 'quiet', 'talk')}

# rustwaarden van alles wat de reactielaag animeert (lokaal!)
def rv(bone, prop):
    lx, ly = local(bone)
    return {'x': lx, 'y': ly, 'rotation': 0.0, 'scaleX': 1.0, 'scaleY': 1.0}[prop]


REACT = [('Head', 'x'), ('Head', 'y'), ('Head', 'rotation'), ('Head', 'scaleY'), ('BrowL', 'y'), ('BrowR', 'y'),
         ('LidLx', 'scaleY'), ('LidRx', 'scaleY'), ('Cheeks', 'y'), ('Cheeks', 'scaleX')]
TALK = [('Jaw', 'y'), ('Jaw', 'scaleY')]


def anim(name, duration, tracks, keys_for, loop=False, warm=None, ink=None):
    """tracks: lijst (bot, prop); keys_for: {(bot,prop): [(frame, offset[, ease])]}; ontbrekende sporen
    krijgen één sleutel op de rustwaarde, zodat elke toestand alles terugzet."""
    parts = [f'<LinearAnimation {"loopValue=\"loop\" " if loop else ""}duration="{duration}" name="{name}" id="{ANIM[name]}">']
    by_bone = {}
    for bone, prop in tracks:
        base = rv(bone, prop)
        ks = keys_for.get((bone, prop), [(0, 0.0 if prop not in ('scaleX', 'scaleY') else 1.0, 'hold')])
        if prop in ('scaleX', 'scaleY'):
            ks2 = [(k[0], k[1]) + tuple(k[2:]) for k in ks]
        else:
            ks2 = [(k[0], base + k[1]) + tuple(k[2:]) for k in ks]
        by_bone.setdefault(bone, {})[prop] = ks2
    for bone, props in by_bone.items():
        parts.append(keyed(bone_id[bone], props))
    if warm is not None:
        parts.append(keyed(WARM, {'opacity': warm}))
    if ink is not None:
        parts.append(keyed(LID_INK, {'opacity': ink}))
    parts.append('</LinearAnimation>')
    return '\n'.join(parts)


# idle: 8 s, twee ademhalingen, het hoofd drijft, twee keer knipperen
idle_keys = {
    ('Body', 'scaleY'): [(0, 1), (120, 1.012), (240, 1), (360, 1.012), (480, 1)],
    ('Body', 'scaleX'): [(0, 1), (120, 1.004), (240, 1), (360, 1.004), (480, 1)],
    ('HeadIdle', 'y'): [(0, 0), (120, -1.6), (240, 0), (360, -1.6), (480, 0)],
    ('HeadIdle', 'x'): [(0, 0), (190, 1.8), (350, -1.4), (480, 0)],
    ('HeadIdle', 'rotation'): [(0, 0), (170, 0.014), (340, -0.011), (480, 0)],
}
blink = [(0, 1, 'hold'), (146, 1, 'in'), (151, 0.05, 'hold'), (153, 0.05, 'out'), (161, 1, 'hold'),
         (396, 1, 'in'), (401, 0.05, 'hold'), (403, 0.05, 'out'), (411, 1, 'hold'), (480, 1, 'hold')]
idle_keys[('LidL', 'scaleY')] = blink
idle_keys[('LidR', 'scaleY')] = blink
IDLE = [('Body', 'scaleY'), ('Body', 'scaleX'), ('HeadIdle', 'y'), ('HeadIdle', 'x'), ('HeadIdle', 'rotation'),
        ('LidL', 'scaleY'), ('LidR', 'scaleY')]

happy_keys = {
    ('Head', 'y'): [(0, 0), (10, 4.2), (22, -0.8), (34, 2.8), (48, 0), (96, 0)],
    ('Head', 'scaleY'): [(0, 1), (10, 0.992), (22, 1.002), (34, 0.995), (48, 1), (96, 1)],
    ('Head', 'rotation'): [(0, 0), (10, -0.012), (34, 0.008), (60, 0), (96, 0)],
    ('Cheeks', 'y'): [(0, 0), (14, -4), (64, -4), (92, 0)],
    ('Cheeks', 'scaleX'): [(0, 1), (14, 1.04), (64, 1.04), (92, 1)],
    ('LidLx', 'scaleY'): [(0, 1), (14, 0.66), (64, 0.66), (92, 1)],
    ('LidRx', 'scaleY'): [(0, 1), (14, 0.66), (64, 0.66), (92, 1)],
    ('BrowL', 'y'): [(0, 0), (14, -2), (64, -2), (92, 0)],
    ('BrowR', 'y'): [(0, 0), (14, -2), (64, -2), (92, 0)],
}
hmm_keys = {
    ('Head', 'rotation'): [(0, 0), (22, 0.042), (104, 0.042), (130, 0)],
    ('Head', 'x'): [(0, 0), (22, -2.5), (104, -2.5), (130, 0)],
    ('Head', 'y'): [(0, 0), (22, 1), (104, 1), (130, 0)],
    ('BrowR', 'y'): [(0, 0), (14, -7, 'back'), (34, -6), (104, -6), (126, 0)],
    ('BrowL', 'y'): [(0, 0), (18, 2), (104, 2), (126, 0)],
    ('LidLx', 'scaleY'): [(0, 1), (18, 0.6), (104, 0.6), (126, 1)],
    ('LidRx', 'scaleY'): [(0, 1), (14, 1.1), (104, 1.1), (126, 1)],
}
talk_keys = {
    ('Jaw', 'y'): [(0, 0), (6, 4.2), (11, 1), (18, 3.2), (24, 0.2), (33, 5), (40, 1.2), (47, 3.4), (54, 0),
                   (63, 4.4), (71, 0.8), (78, 2.4), (84, 0)],
    ('Jaw', 'scaleY'): [(0, 1), (33, 1.04), (47, 1), (63, 1.03), (84, 1)],
}

AN = [
    anim('idle', 480, IDLE, idle_keys, loop=True,
         ink=[(0, 0, 'hold'), (149, 0, 'linear'), (151, 1, 'hold'), (153, 1, 'linear'), (155, 0, 'hold'),
              (399, 0, 'linear'), (401, 1, 'hold'), (403, 1, 'linear'), (405, 0, 'hold'), (480, 0, 'hold')]),
    anim('rest', 1, REACT, {}, warm=[(0, 0.0, 'hold')]),
    anim('happy', 96, REACT, happy_keys, warm=[(0, 0.0), (18, 0.55), (64, 0.4), (96, 0.0)]),
    anim('hmm', 132, REACT, hmm_keys, warm=[(0, 0.0, 'hold')]),
    anim('quiet', 1, TALK, {}),
    anim('talk', 84, TALK, talk_keys, loop=True),
]


def trig_cond(prop):
    return (f'<TransitionViewModelCondition><TransitionPropertyViewModelComparator><BindablePropertyTrigger>'
            f'<DataBindContext sourcePathIds="{VM}-{prop}" propertyKey="686"/></BindablePropertyTrigger>'
            f'</TransitionPropertyViewModelComparator><TransitionValueTriggerComparator/></TransitionViewModelCondition>')


def bool_cond(prop, value):
    return (f'<TransitionViewModelCondition><TransitionPropertyViewModelComparator><BindablePropertyBoolean>'
            f'<DataBindContext sourcePathIds="{VM}-{prop}" propertyKey="634"/></BindablePropertyBoolean>'
            f'</TransitionPropertyViewModelComparator><TransitionValueBooleanComparator value="{value}"/>'
            f'</TransitionViewModelCondition>')


EXIT = 'enableExitTime="true" exitTimeIsPercetange="true" exitTime="100"'
sm = f'''<StateMachine name="Van Dam" id="{SM}">
<StateMachineLayer name="Idle" id="{ids()}">
  <AnyState x="400" y="-100"/><ExitState x="560" y="-100"/>
  <EntryState x="0" y="0"><StateTransition stateToId="{ST['idle']}"/></EntryState>
  <AnimationState x="200" y="0" animationId="{ANIM['idle']}" id="{ST['idle']}"/>
</StateMachineLayer>
<StateMachineLayer name="React" id="{ids()}">
  <AnyState x="200" y="-160">
    <StateTransition stateToId="{ST['happy']}" duration="120">{trig_cond(P_HAPPY)}</StateTransition>
    <StateTransition stateToId="{ST['hmm']}" duration="160">{trig_cond(P_HMM)}</StateTransition>
  </AnyState>
  <ExitState x="560" y="-160"/>
  <EntryState x="0" y="0"><StateTransition stateToId="{ST['rest']}"/></EntryState>
  <AnimationState x="200" y="0" animationId="{ANIM['rest']}" id="{ST['rest']}"/>
  <AnimationState x="420" y="-60" animationId="{ANIM['happy']}" reset="true" id="{ST['happy']}">
    <StateTransition stateToId="{ST['rest']}" duration="200" {EXIT}/>
  </AnimationState>
  <AnimationState x="420" y="80" animationId="{ANIM['hmm']}" reset="true" id="{ST['hmm']}">
    <StateTransition stateToId="{ST['rest']}" duration="250" {EXIT}/>
  </AnimationState>
</StateMachineLayer>
<StateMachineLayer name="Talk" id="{ids()}">
  <AnyState x="400" y="-100"/><ExitState x="560" y="-100"/>
  <EntryState x="0" y="0"><StateTransition stateToId="{ST['quiet']}"/></EntryState>
  <AnimationState x="200" y="0" animationId="{ANIM['quiet']}" id="{ST['quiet']}">
    <StateTransition stateToId="{ST['talk']}" duration="150">{bool_cond(P_TALK, 'true')}</StateTransition>
  </AnimationState>
  <AnimationState x="200" y="140" animationId="{ANIM['talk']}" id="{ST['talk']}">
    <StateTransition stateToId="{ST['quiet']}" duration="250">{bool_cond(P_TALK, 'false')}</StateTransition>
  </AnimationState>
</StateMachineLayer>
</StateMachine>'''

roots = [bone_xml(n) for n, (_, par) in BONES.items() if par is None]

doc = f'''<Rive version="1" kind="fragment">
<!-- GEGENEREERD door art/rive/tools/gen_vandam.py; niet met de hand bewerken. -->
<Artboard defaultStateMachineId="{SM}" viewModelId="{VM}" viewModelInstanceId="{VMI}" styleId="0:5" width="512" height="512" name="VanDam" id="0:2">
<LayoutComponentStyle name="Artboard Style" id="0:5"/>
<Shape x="256" y="236" opacity="0" blendModeValue="softLight" name="Warmth" id="{WARM}">
  <Ellipse width="356" height="356" originX="0.5" originY="0.5" name="Disc"/>
  <Fill name="Glow"><RadialGradient startX="0" startY="-30" endX="190" endY="-30" name="G">
    <GradientStop colorValue="FFF2C27A" position="0"/><GradientStop colorValue="CCD08A48" position="0.55"/><GradientStop colorValue="00B8955C" position="1"/>
  </RadialGradient></Fill>
</Shape>
{chr(10).join(roots)}
<Image x="256" y="256" assetId="0:60" name="Portrait" id="{ids()}">
<Mesh triangleIndexBytes="{triangle_bytes(tri)}" name="Mesh" id="{ids()}">
{chr(10).join(verts)}
<Skin tx="256" ty="256" name="Skin">
{chr(10).join(tendons)}
</Skin>
</Mesh>
</Image>
{sm}
{chr(10).join(AN)}
</Artboard>
<ImageAsset file="../../../assets/vandam.jpg" width="512" height="512" name="vandam" id="0:60"/>
<ViewModel defaultInstanceId="{VMI}" name="VanDam" id="{VM}">
  <ViewModelPropertyTrigger name="happy" id="{P_HAPPY}"/>
  <ViewModelPropertyTrigger name="hmm" id="{P_HMM}"/>
  <ViewModelPropertyBoolean name="talk" id="{P_TALK}"/>
  <ViewModelInstance exports="true" name="Default" id="{VMI}">
    <ViewModelInstanceTrigger viewModelPropertyId="{P_HAPPY}"/>
    <ViewModelInstanceTrigger viewModelPropertyId="{P_HMM}"/>
    <ViewModelInstanceBoolean propertyValue="false" viewModelPropertyId="{P_TALK}"/>
  </ViewModelInstance>
</ViewModel>
</Rive>
'''
with open(OUT, 'w') as f:
    f.write(doc)
print(f'vandam: {len(final)} vertices ({len(contour_idx)} contour), {len(tri)} triangles -> {os.path.relpath(OUT)}')

# debug: mesh-overlay over het portret
if '--debug' in sys.argv:
    from PIL import Image as PImage, ImageDraw
    im = PImage.open(os.path.join(HERE, '..', '..', '..', 'assets', 'vandam.jpg')).convert('RGB').resize((1024, 1024))
    d = ImageDraw.Draw(im)
    for a, b, c in tri:
        pts = [tuple(P[i] * 2) for i in (a, b, c, a)]
        d.line(pts, fill=(0, 140, 255), width=1)
    cols = [(160, 160, 160), (0, 200, 0), (255, 0, 0), (255, 0, 255), (255, 0, 255), (0, 255, 255), (0, 255, 255),
            (255, 200, 0), (255, 120, 0)]
    for pt in final:
        ws = weights_for(pt)
        k = max(ws, key=lambda w: w[1])[0]
        x, y = pt[0] * 2, pt[1] * 2
        d.ellipse((x - 2.5, y - 2.5, x + 2.5, y + 2.5), fill=cols[k])
    im.save(sys.argv[sys.argv.index('--debug') + 1])
