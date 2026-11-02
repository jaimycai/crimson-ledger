"""Kleine RML-hulp voor de generatoren in deze map (gen_vandam.py, gen_vlam.py).

Schrijft keyframes met hun easing, telt ids op en codeert de driehoekslijst van een mesh.
RML-regels die hier vastliggen (zie `rive docs format` en `rive docs easing`):
- tijd in frames bij 60 fps, overgangen in milliseconden
- de easing van een segment staat op de keyframe aan het BEGIN van dat segment
- `cubic` zonder geneste CubicEaseInterpolator eased niets
- eerst gedeclareerde vorm tekent bovenop
"""
import base64

EASE = {
    'io': (0.45, 0.0, 0.55, 1.0),      # zacht heen en weer (ademen, drijven)
    'out': (0.0, 0.0, 0.3, 1.0),       # snel weg, zacht aankomen
    'in': (0.5, 0.0, 1.0, 1.0),        # aanzuigen
    'back': (0.34, 1.56, 0.64, 1.0),   # overshoot, zoals --ease-spring in de app
}


class Ids:
    def __init__(self, start=100):
        self.n = start

    def __call__(self):
        self.n += 1
        return f'0:{self.n}'


def fmt(v):
    if isinstance(v, float):
        s = f'{v:.4f}'.rstrip('0').rstrip('.')
        return s if s not in ('-0', '') else '0'
    return str(v)


def keyframes(keys, kind='Double'):
    """keys: lijst van (frame, waarde[, easing]). easing: naam uit EASE, 'linear', 'hold' of een 4-tupel."""
    out = []
    for k in keys:
        frame, value = k[0], k[1]
        ease = k[2] if len(k) > 2 else 'io'
        val = value if kind == 'Color' else fmt(value)
        if ease in ('linear', 'hold'):
            out.append(f'<KeyFrame{kind} value="{val}" frame="{frame}" interpolationType="{ease}"/>')
        else:
            x1, y1, x2, y2 = EASE[ease] if isinstance(ease, str) else ease
            out.append(f'<KeyFrame{kind} value="{val}" frame="{frame}" interpolationType="cubic">'
                       f'<CubicEaseInterpolator x1="{fmt(x1)}" y1="{fmt(y1)}" x2="{fmt(x2)}" y2="{fmt(y2)}"/>'
                       f'</KeyFrame{kind}>')
    return '\n'.join(out)


def keyed(object_id, props):
    """props: {propertynaam: keys} of {propertynaam: (keys, 'Color')}."""
    parts = [f'<KeyedObject objectId="{object_id}">']
    for name, spec in props.items():
        kind = 'Double'
        keys = spec
        if isinstance(spec, tuple) and len(spec) == 2 and isinstance(spec[1], str):
            keys, kind = spec
        parts.append(f'<KeyedProperty property="{name}">')
        parts.append(keyframes(keys, kind))
        parts.append('</KeyedProperty>')
    parts.append('</KeyedObject>')
    return '\n'.join(parts)


def varuint(n):
    out = bytearray()
    while True:
        b = n & 0x7F
        n >>= 7
        if n:
            out.append(b | 0x80)
        else:
            out.append(b)
            return bytes(out)


def triangle_bytes(tris):
    raw = b''.join(varuint(int(i)) for t in tris for i in t)
    return base64.b64encode(raw).decode('ascii')


def pack_weights(pairs):
    """pairs: lijst (tendonindex, gewicht 0..1), max 4. Geeft (values, indices) als gepakte bytes die samen 255 zijn.
    Tendonindex is 0-based; in de byte staat index+1 (0 is de identiteit)."""
    pairs = sorted([p for p in pairs if p[1] > 1e-4], key=lambda p: -p[1])[:4]
    tot = sum(w for _, w in pairs) or 1.0
    raw = [w / tot * 255 for _, w in pairs]
    q = [int(round(r)) for r in raw]
    q[0] += 255 - sum(q)   # rest naar de zwaarste, zodat het precies 255 is
    values = indices = 0
    slot = 0
    for (ti, _), v in zip(pairs, q):
        if v <= 0:
            continue
        values |= v << (8 * slot)
        indices |= (ti + 1) << (8 * slot)
        slot += 1
    return values, indices
