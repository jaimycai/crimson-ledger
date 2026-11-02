"""Genereert art/rive/vlam/scene.rml: de streakvlam van Crimson Ledger.

Vier vlamlagen (karmijn buiten, oranje, amber, crème kern) met een inktrand. Elke laag is één pad met
kubische punten waarvan de vorm (niet de schaal) eindeloos flakkert: per laag een eigen lus met een eigen
lengte (100, 76, 58, 46 frames), zodat het geheel zich pas na lange tijd herhaalt.

View model "Vlam":
  lit     (boolean)  true = brandt en flakkert, false = grijs en stil
  ignite  (trigger)  zuigt in, ontbrandt met ring en vonken; zet lit zelf op true

Draaien:  python3 art/rive/tools/gen_vlam.py && rive art/rive/vlam --verify
"""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(__file__))
from kit import Ids, keyed, fmt  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'vlam', 'scene.rml')
AW, AH = 200, 250
BASE = (100.0, 222.0)        # voet van de vlam in het artboard

ids = Ids(100)

# ── Kleuren ────────────────────────────────────────────────────────────────────
LIT = {'outer': 'FF8B2E1C', 'mid': 'FFD9631E', 'inner': 'FFF2A33A', 'core': 'FFF9E3B4', 'ink': 'FF2C1810',
       'glow': '66F2A33A'}
COLD = {'outer': 'FF8E837A', 'mid': 'FFA89C92', 'inner': 'FFBDB3A9', 'core': 'FFD6CEC5', 'ink': 'FF5E524A',
        'glow': '00F2A33A'}


# ── Vorm ───────────────────────────────────────────────────────────────────────
def outline(W, H, sway=0.0, lick=0.0, belly=0.0, lean=0.0, tipcurl=0.0):
    """Punten op de omtrek, tegen de klok in vanaf de voet (y omlaag). Geeft [(x, y, sharp)]."""
    def w(t):
        return W * 1.9 * t ** 0.45 * (1 - t) ** 0.85

    def sx(t):  # zijwaartse buiging: de punt beweegt het meest
        return sway * t ** 2.2 + lean * t

    pts = [(0.0, 0.0, False)]
    for t in (0.14, 0.38, 0.62, 0.83):
        bulge = 1.0 + belly * math.sin(math.pi * t)
        pts.append((w(t) * bulge + sx(t), -H * t, False))
    pts.append((sx(1.0) + tipcurl, -H * 1.0, True))                       # hoofdpunt
    # linkerkant met een tweede tong (lick) rond t=0.7
    for t, f, sharp in ((0.80, 0.62 - 0.25 * lick, False), (0.70, 1.0 + 0.55 * lick, True),
                        (0.56, 0.78 - 0.18 * lick, False), (0.34, 1.0, False), (0.13, 1.0, False)):
        bulge = 1.0 + belly * math.sin(math.pi * t)
        yy = -H * t - (H * 0.07 * lick if sharp else 0.0)
        pts.append((-w(t) * f * bulge + sx(t), yy, sharp))
    return pts


def to_vertices(pts, tension=1.0):
    """Catmull-Rom naar kubische handvatten; scherpe punten krijgen korte handvatten richting de buren."""
    n = len(pts)
    out = []
    for i, (x, y, sharp) in enumerate(pts):
        px, py, _ = pts[i - 1]
        nx, ny, _ = pts[(i + 1) % n]
        if i == 0:   # voet: horizontaal
            tx, ty = (nx - px) / 6 * tension, 0.0
            out.append((x, y, (-tx, -ty), (tx, ty)))
            continue
        if sharp:
            ix, iy = (px - x) * 0.18, (py - y) * 0.18
            ox, oy = (nx - x) * 0.18, (ny - y) * 0.18
            out.append((x, y, (ix, iy), (ox, oy)))
            continue
        tx, ty = (nx - px) / 6 * tension, (ny - py) / 6 * tension
        out.append((x, y, (-tx, -ty), (tx, ty)))
    return out


def polar(v):
    return math.atan2(v[1], v[0]), math.hypot(v[0], v[1])


def unwrap(a, ref):
    while a - ref > math.pi:
        a -= 2 * math.pi
    while a - ref < -math.pi:
        a += 2 * math.pi
    return a


LAYERS = {   # naam: (halve breedte, hoogte, y-verschuiving van de voet, lusduur, inktrand)
    'outer': (36.0, 150.0, 0.0, 100, True),
    'mid':   (26.0, 110.0, -6.0, 76, False),
    'inner': (17.0, 76.0, -10.0, 58, False),
    'core':  (9.5, 44.0, -12.0, 46, False),
}
POSES = 6
rng = random.Random(7)


def poses_for(name):
    W, H, _, _, _ = LAYERS[name]
    ps = [dict(sway=0.0, lick=0.25, belly=0.0, lean=0.0, tipcurl=0.0, h=1.0, w=1.0)]
    for k in range(1, POSES):
        ps.append(dict(sway=rng.uniform(-0.16, 0.16) * H, lick=rng.uniform(-0.15, 0.75),
                       belly=rng.uniform(-0.08, 0.1), lean=rng.uniform(-0.04, 0.04) * W,
                       tipcurl=rng.uniform(-0.12, 0.12) * W, h=rng.uniform(0.86, 1.1), w=rng.uniform(0.92, 1.07)))
    verts = []
    for p in ps:
        verts.append(to_vertices(outline(W * p['w'], H * p['h'], p['sway'], p['lick'], p['belly'], p['lean'],
                                         p['tipcurl'])))
    return verts


def cold_pose(name):
    W, H, _, _, _ = LAYERS[name]
    return to_vertices(outline(W * 0.94, H * 0.9, 0.0, 0.1, 0.0, 0.0, 0.0))


SHAPES = {}
VERT_IDS = {}
POSE_DATA = {}
for name in LAYERS:
    SHAPES[name] = ids()
    POSE_DATA[name] = poses_for(name)
    VERT_IDS[name] = [ids() for _ in POSE_DATA[name][0]]


def vertex_values(v, ref=None):
    x, y, hin, hout = v
    ir, idist = polar(hin)
    orr, odist = polar(hout)
    if ref is not None:
        ir, orr = unwrap(ir, ref[2]), unwrap(orr, ref[4])
    return [x, y, ir, idist, orr, odist]


PROPS = ['x', 'y', 'inRotation', 'inDistance', 'outRotation', 'outDistance']


def path_xml(name):
    base = [vertex_values(v) for v in POSE_DATA[name][0]]
    vs = []
    for vid, (x, y, ir, idist, orr, odist) in zip(VERT_IDS[name], base):
        vs.append(f'<CubicDetachedVertex x="{fmt(x)}" y="{fmt(y)}" inRotation="{fmt(ir)}" inDistance="{fmt(idist)}" '
                  f'outRotation="{fmt(orr)}" outDistance="{fmt(odist)}" id="{vid}"/>')
    return f'<PointsPath isClosed="true" isClockwise="false" name="Path">' + ''.join(vs) + '</PointsPath>'


def morph_anim(name, aid, frames, pose_list, loop=True, ease='io'):
    """Keyt alle vertexeigenschappen door de reeks poses op de gegeven frames."""
    ref = [vertex_values(v) for v in POSE_DATA[name][0]]
    parts = [f'<LinearAnimation {"loopValue=\"loop\" " if loop else ""}duration="{frames[-1]}" name="{name}-{"flicker" if loop else "still"}" id="{aid}">']
    for vi, vid in enumerate(VERT_IDS[name]):
        props = {}
        for pi, prop in enumerate(PROPS):
            keys = []
            for f, pose in zip(frames, pose_list):
                val = vertex_values(pose[vi], ref[vi])[pi]
                keys.append((f, val, ease) if loop else (f, val, 'hold'))
            props[prop] = keys
        parts.append(keyed(vid, props))
    parts.append('</LinearAnimation>')
    return '\n'.join(parts)


# ── Ids ────────────────────────────────────────────────────────────────────────
SM, VM, VMI = ids(), ids(), ids()
P_LIT, P_IGNITE = ids(), ids()
POP, RING, FLASH, GLOW, EMBERS = ids(), ids(), ids(), ids(), ids()
PAINT = {k: ids() for k in ('outer', 'mid', 'inner', 'core', 'ink', 'glow')}
SPARKS = [ids() for _ in range(12)]
EMBER_IDS = [ids() for _ in range(3)]

# ── Vonken en sintels ──────────────────────────────────────────────────────────
SPARK_COLS = ['FFF7C66A', 'FFEE7A27', 'FFFFE7A3', 'FFF2A33A']
spark_specs = []
for i, sid in enumerate(SPARKS):
    a = -math.pi / 2 + (i - (len(SPARKS) - 1) / 2) * (2.7 / len(SPARKS)) + rng.uniform(-0.12, 0.12)
    dist = rng.uniform(48, 76)
    spark_specs.append(dict(id=sid, a=a, dist=dist, size=rng.uniform(5, 9), col=SPARK_COLS[i % 4],
                            delay=rng.randint(0, 4), spin=rng.uniform(-2.5, 2.5)))
SPARK_ORIGIN = (0.0, -64.0)   # binnen Pop: ongeveer het hart van de vlam


def spark_shapes():
    out = []
    for s in spark_specs:
        out.append(f'<Shape x="{fmt(SPARK_ORIGIN[0])}" y="{fmt(SPARK_ORIGIN[1])}" opacity="0" name="Spark" id="{s["id"]}">'
                   f'<Star width="{fmt(s["size"])}" height="{fmt(s["size"] * 1.5)}" points="4" innerRadius="0.28" name="P"/>'
                   f'<Fill name="F"><SolidColor colorValue="{s["col"]}" name="C"/></Fill></Shape>')
    return ''.join(out)


def ember_shapes():
    out = []
    for i, eid in enumerate(EMBER_IDS):
        out.append(f'<Shape x="0" y="-40" opacity="0" name="Ember" id="{eid}">'
                   f'<Ellipse width="3.2" height="3.2" name="P"/>'
                   f'<Fill name="F"><SolidColor colorValue="FFF7C66A" name="C"/></Fill></Shape>')
    return ''.join(out)


def flame_shape(name):
    _, _, dy, _, ink = LAYERS[name]
    stroke = (f'<Stroke thickness="3" join="round" cap="round" name="Ink"><SolidColor colorValue="{LIT["ink"]}" '
              f'name="C" id="{PAINT["ink"]}"/></Stroke>') if ink else ''
    return (f'<Shape x="0" y="{fmt(dy)}" name="{name.title()}" id="{SHAPES[name]}">{path_xml(name)}'
            f'<Fill name="F"><SolidColor colorValue="{LIT[name]}" name="C" id="{PAINT[name]}"/></Fill>{stroke}</Shape>')


# ── Animaties ──────────────────────────────────────────────────────────────────
A = {k: ids() for k in ('lit_col', 'cold_col', 'rest', 'suck', 'burst', 'embers', 'embers_off')}
FLICK = {n: ids() for n in LAYERS}
STILL = {n: ids() for n in LAYERS}
anims = []
for name, (_, _, _, dur, _) in LAYERS.items():
    frames = [round(dur * k / POSES) for k in range(POSES)] + [dur]
    # onregelmatige verdeling: schuif de tussenframes een beetje
    frames = [frames[0]] + [max(frames[i - 1] + 4, f + rng.randint(-3, 3)) for i, f in enumerate(frames[1:-1], 1)] + [dur]
    seq = POSE_DATA[name] + [POSE_DATA[name][0]]
    anims.append(morph_anim(name, FLICK[name], frames, seq, loop=True))
    cold = cold_pose(name)
    anims.append(morph_anim(name, STILL[name], [1], [cold], loop=False))


def colour_anim(aid, nm, pal, glow_op):
    props = []
    for k in ('outer', 'mid', 'inner', 'core', 'ink', 'glow'):
        props.append(keyed(PAINT[k], {'colorValue': ([(0, pal[k], 'hold')], 'Color')}))
    props.append(keyed(GLOW, {'opacity': [(0, glow_op, 'hold')]}))
    return f'<LinearAnimation duration="1" name="{nm}" id="{aid}">' + ''.join(props) + '</LinearAnimation>'


anims.append(colour_anim(A['lit_col'], 'colours-lit', LIT, 1.0))
anims.append(colour_anim(A['cold_col'], 'colours-cold', COLD, 0.0))

# sintels: drie stipjes die opstijgen en doven, alleen als hij brandt
ember_keys = []
EMB_DUR = 132
for i, eid in enumerate(EMBER_IDS):
    t0 = i * 44
    x0 = rng.uniform(-6, 6)
    drift = rng.uniform(-14, 14)
    seg = [(0, -40.0, 0.0), (t0, -40.0, 0.0), (t0 + 2, -96.0, 1.0), (t0 + 50, -160.0, 0.0)]
    ys, ops, xs = [], [], []
    for f, y, op in seg:
        f = min(f, EMB_DUR)
        ys.append((f, y, 'linear'))
        ops.append((f, op, 'linear'))
    xs = [(0, x0, 'hold'), (t0 + 2, x0, 'io'), (min(t0 + 50, EMB_DUR), x0 + drift, 'hold')]
    ys.append((EMB_DUR, -40.0, 'hold'))
    ops.append((EMB_DUR, 0.0, 'hold'))
    xs.append((EMB_DUR, x0, 'hold'))
    ember_keys.append(keyed(eid, {'x': xs, 'y': sorted(ys), 'opacity': sorted(ops)}))
anims.append(f'<LinearAnimation loopValue="loop" duration="{EMB_DUR}" name="embers" id="{A["embers"]}">' + ''.join(ember_keys)
             + keyed(EMBERS, {'opacity': [(0, 1.0, 'hold')]}) + '</LinearAnimation>')
anims.append(f'<LinearAnimation duration="1" name="embers-off" id="{A["embers_off"]}">'
             + keyed(EMBERS, {'opacity': [(0, 0.0, 'hold')]}) + '</LinearAnimation>')


def ignite_props(pop_sx, pop_sy, ring_s, ring_op, flash_op, sparks):
    parts = [keyed(POP, {'scaleX': pop_sx, 'scaleY': pop_sy}),
             keyed(RING, {'scaleX': ring_s, 'scaleY': ring_s, 'opacity': ring_op}),
             keyed(FLASH, {'opacity': flash_op})]
    parts += sparks
    return ''.join(parts)


def rest_sparks():
    return [keyed(s['id'], {'opacity': [(0, 0.0, 'hold')], 'x': [(0, SPARK_ORIGIN[0], 'hold')],
                            'y': [(0, SPARK_ORIGIN[1], 'hold')]}) for s in spark_specs]


anims.append(f'<LinearAnimation duration="1" name="ignite-rest" id="{A["rest"]}">'
             + ignite_props([(0, 1, 'hold')], [(0, 1, 'hold')], [(0, 0.3, 'hold')], [(0, 0, 'hold')], [(0, 0, 'hold')],
                            rest_sparks()) + '</LinearAnimation>')
# 1. inzuigen (0.27 s)
anims.append(f'<LinearAnimation duration="16" name="ignite-suck" id="{A["suck"]}">'
             + ignite_props([(0, 1, 'in'), (16, 0.84, 'hold')], [(0, 1, 'in'), (16, 0.7, 'hold')],
                            [(0, 0.3, 'hold')], [(0, 0, 'hold')], [(0, 0, 'linear'), (16, 0.15, 'hold')],
                            rest_sparks()) + '</LinearAnimation>')
# 2. ontbranden (1 s): uitschieten, ring, vonken, uitveren
burst_sparks = []
for s in spark_specs:
    d0 = s['delay']
    ex = SPARK_ORIGIN[0] + math.cos(s['a']) * s['dist']
    ey = SPARK_ORIGIN[1] + math.sin(s['a']) * s['dist']
    burst_sparks.append(keyed(s['id'], {
        'x': [(0, SPARK_ORIGIN[0], 'hold'), (d0, SPARK_ORIGIN[0], 'out'), (d0 + 34, ex, 'hold')],
        'y': [(0, SPARK_ORIGIN[1], 'hold'), (d0, SPARK_ORIGIN[1], 'out'), (d0 + 22, ey - 6, 'in'), (d0 + 40, ey + 10, 'hold')],
        'opacity': [(0, 0.0, 'hold'), (d0, 1.0, 'hold'), (d0 + 16, 1.0, 'linear'), (d0 + 40, 0.0, 'hold')],
        'rotation': [(0, 0.0, 'hold'), (d0, 0.0, 'linear'), (d0 + 40, s['spin'], 'hold')],
        'scaleX': [(0, 1.0, 'hold'), (d0, 1.2, 'linear'), (d0 + 40, 0.5, 'hold')],
        'scaleY': [(0, 1.0, 'hold'), (d0, 1.2, 'linear'), (d0 + 40, 0.5, 'hold')],
    }))
anims.append(f'<LinearAnimation duration="60" name="ignite-burst" id="{A["burst"]}">'
             + ignite_props(
                 [(0, 0.84, 'out'), (7, 1.16, 'io'), (20, 0.95, 'io'), (32, 1.03, 'io'), (46, 1.0, 'hold')],
                 [(0, 0.7, 'out'), (7, 1.3, 'io'), (20, 0.93, 'io'), (32, 1.04, 'io'), (46, 1.0, 'hold')],
                 [(0, 0.3, 'out'), (30, 1.75, 'hold')],
                 [(0, 0.95, 'linear'), (30, 0.0, 'hold')],
                 [(0, 0.85, 'out'), (24, 0.0, 'hold')],
                 burst_sparks) + '</LinearAnimation>')


def cond_bool(prop, v):
    return (f'<TransitionViewModelCondition><TransitionPropertyViewModelComparator><BindablePropertyBoolean>'
            f'<DataBindContext sourcePathIds="{VM}-{prop}" propertyKey="634"/></BindablePropertyBoolean>'
            f'</TransitionPropertyViewModelComparator><TransitionValueBooleanComparator value="{v}"/>'
            f'</TransitionViewModelCondition>')


def cond_trig(prop):
    return (f'<TransitionViewModelCondition><TransitionPropertyViewModelComparator><BindablePropertyTrigger>'
            f'<DataBindContext sourcePathIds="{VM}-{prop}" propertyKey="686"/></BindablePropertyTrigger>'
            f'</TransitionPropertyViewModelComparator><TransitionValueTriggerComparator/></TransitionViewModelCondition>')


def lit_layer(lname, a_lit, a_cold, ms_in=350, ms_out=600):
    s_lit, s_cold = ids(), ids()
    return f'''<StateMachineLayer name="{lname}" id="{ids()}">
  <AnyState x="420" y="-120"/><ExitState x="600" y="-120"/>
  <EntryState x="0" y="0">
    <StateTransition stateToId="{s_lit}" duration="0">{cond_bool(P_LIT, 'true')}</StateTransition>
    <StateTransition stateToId="{s_cold}" duration="0">{cond_bool(P_LIT, 'false')}</StateTransition>
  </EntryState>
  <AnimationState x="200" y="0" animationId="{a_cold}" id="{s_cold}">
    <StateTransition stateToId="{s_lit}" duration="{ms_in}">{cond_bool(P_LIT, 'true')}</StateTransition>
  </AnimationState>
  <AnimationState x="200" y="160" animationId="{a_lit}" id="{s_lit}">
    <StateTransition stateToId="{s_cold}" duration="{ms_out}">{cond_bool(P_LIT, 'false')}</StateTransition>
  </AnimationState>
</StateMachineLayer>'''


S_REST, S_SUCK, S_BURST = ids(), ids(), ids()
layers = [lit_layer('Colours', A['lit_col'], A['cold_col'], 260, 700),
          lit_layer('Embers', A['embers'], A['embers_off'], 200, 300)]
for name in LAYERS:
    layers.append(lit_layer(f'Flicker {name}', FLICK[name], STILL[name], 300, 700))
layers.append(f'''<StateMachineLayer name="Ignite" id="{ids()}">
  <AnyState x="420" y="-120"/><ExitState x="600" y="-120"/>
  <EntryState x="0" y="0"><StateTransition stateToId="{S_REST}"/></EntryState>
  <AnimationState x="200" y="0" animationId="{A['rest']}" id="{S_REST}">
    <StateTransition stateToId="{S_SUCK}" duration="0">{cond_trig(P_IGNITE)}</StateTransition>
  </AnimationState>
  <AnimationState x="200" y="160" animationId="{A['suck']}" reset="true" id="{S_SUCK}">
    <StateTransition stateToId="{S_BURST}" duration="0" enableExitTime="true" exitTimeIsPercetange="true" exitTime="100"/>
  </AnimationState>
  <AnimationState x="400" y="160" animationId="{A['burst']}" reset="true" id="{S_BURST}">
    <ListenerViewModelChange>
      <BindablePropertyBoolean propertyValue="true">
        <DataBindContext sourcePathIds="{VM}-{P_LIT}" propertyKey="634" direction="true"/>
      </BindablePropertyBoolean>
    </ListenerViewModelChange>
    <StateTransition stateToId="{S_REST}" duration="120" enableExitTime="true" exitTimeIsPercetange="true" exitTime="100"/>
  </AnimationState>
</StateMachineLayer>''')

sm = f'<StateMachine name="Vlam" id="{SM}">\n' + '\n'.join(layers) + '\n</StateMachine>'

flame_layers = ''.join(flame_shape(n) for n in ('core', 'inner', 'mid', 'outer'))
doc = f'''<Rive version="1" kind="fragment">
<!-- GEGENEREERD door art/rive/tools/gen_vlam.py; niet met de hand bewerken. -->
<Artboard defaultStateMachineId="{SM}" viewModelId="{VM}" viewModelInstanceId="{VMI}" styleId="0:5" width="{AW}" height="{AH}" name="Vlam" id="0:2">
<LayoutComponentStyle name="Artboard Style" id="0:5"/>
<Node x="{fmt(BASE[0])}" y="{fmt(BASE[1])}" name="Pop" id="{POP}">
  {spark_shapes()}
  <Shape x="0" y="-64" opacity="0" name="Ring" id="{RING}">
    <Ellipse width="96" height="96" name="P"/>
    <Stroke thickness="2.2" name="S"><SolidColor colorValue="FFD4B074" name="C"/></Stroke>
  </Shape>
  <Node name="Embers" opacity="0" id="{EMBERS}">{ember_shapes()}</Node>
  <Shape x="0" y="-58" opacity="0" name="Flash" id="{FLASH}">
    <Ellipse width="120" height="150" name="P"/>
    <Fill name="F"><RadialGradient startX="0" startY="0" endX="70" endY="0" name="G">
      <GradientStop colorValue="FFFFF2C8" position="0"/><GradientStop colorValue="99F7C66A" position="0.45"/><GradientStop colorValue="00F2A33A" position="1"/>
    </RadialGradient></Fill>
  </Shape>
  {flame_layers}
  <Shape x="0" y="-52" name="Glow" id="{GLOW}">
    <Ellipse width="150" height="170" name="P"/>
    <Fill name="F"><RadialGradient startX="0" startY="8" endX="78" endY="8" name="G">
      <GradientStop colorValue="{LIT['glow']}" position="0" id="{PAINT['glow']}"/>
      <GradientStop colorValue="00F2A33A" position="1"/>
    </RadialGradient></Fill>
  </Shape>
</Node>
{sm}
{chr(10).join(anims)}
</Artboard>
<ViewModel defaultInstanceId="{VMI}" name="Vlam" id="{VM}">
  <ViewModelPropertyBoolean name="lit" id="{P_LIT}"/>
  <ViewModelPropertyTrigger name="ignite" id="{P_IGNITE}"/>
  <ViewModelInstance exports="true" name="Default" id="{VMI}">
    <ViewModelInstanceBoolean propertyValue="true" viewModelPropertyId="{P_LIT}"/>
    <ViewModelInstanceTrigger viewModelPropertyId="{P_IGNITE}"/>
  </ViewModelInstance>
</ViewModel>
</Rive>
'''
with open(OUT, 'w') as f:
    f.write(doc)
print('vlam ->', os.path.relpath(OUT), sum(len(v) for v in VERT_IDS.values()), 'vertices')
