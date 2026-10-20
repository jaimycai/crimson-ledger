# snij.py <world> [<world> ...] — turns the raw 1024 px portraits in ruw/ into the 256 px WebP crops the app shows
# (assets/portretten/<world>-<n>.webp), using index.json for the order. The crop is the inside of the medallion,
# measured per image: the ring's outer edge on the centre row and column, then the same share of it as the first
# 64 portraits (fitted on skihut-7; colour means of all eight worlds match within 1). WebP quality 80 gives the
# same ~27 kB per file as before.
import json, os, sys
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', 'assets', 'portretten')
REL = (0.118, 0.111, 0.898, 0.889)   # crop box as a share of the medallion: left, top, right, bottom


def medallion(im):
    dark = np.asarray(im.convert('L')).astype(int) < 110
    row, col = np.where(dark[im.height // 2])[0], np.where(dark[:, im.width // 2])[0]
    return row[0], row[-1], col[0], col[-1]


def crop(im):
    left, right, top, bottom = medallion(im)
    w, h = right - left, bottom - top
    box = (left + REL[0] * w, top + REL[1] * h, left + REL[2] * w, top + REL[3] * h)
    return im.crop(tuple(int(round(v)) for v in box)).resize((256, 256), Image.LANCZOS)


if __name__ == '__main__':
    index = json.load(open(os.path.join(HERE, 'index.json')))
    for world in sys.argv[1:]:
        for n, entry in enumerate(e for e in index if e['world'] == world):
            raw = Image.open(os.path.join(HERE, 'ruw', f"{entry['i']}.png")).convert('RGB')
            path = os.path.join(OUT, f'{world}-{n}.webp')
            crop(raw).save(path, 'WEBP', quality=80, method=6)
            print(path, os.path.getsize(path))
