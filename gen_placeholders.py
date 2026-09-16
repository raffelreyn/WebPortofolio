#!/usr/bin/env python3
"""Generate warm, editorial JPEG placeholder images for Raffel's personal site.
Run: python gen_placeholders.py
Replace these files later with real photos - the paths stay the same.
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(ROOT, "assets", "images")

DETAILS = ["HEADLIGHTS", "EMBLEM", "WHEEL", "DASHBOARD", "SPEEDOMETER", "ENGINE", "INTERIOR", "EXHAUST", "TANK"]

PLACEHOLDERS = [
    # (subfolder, filename, size(w,h), label, bg warm dark, accent)
    ("hero",   "hero.jpg",        (1600, 940),  "RAFFEL / W124 & THE ROAD AHEAD", (43, 33, 27), (107, 79, 58)),
    ("about",  "about.jpg",       (900, 1100), "RAFFEL / FULL FRAME", (233, 221, 203), (43, 33, 27)),
    ("automotive", "w124.jpg",    (1300, 850), "MERCEDES-BENZ W124 / 300E", (35, 28, 23), (140, 110, 80)),
    ("automotive", "rxz.jpg",     (1300, 850), "YAMAHA RX-Z / 2-STROKE", (35, 28, 23), (150, 118, 84)),
    ("music",  "frank-ocean.jpg", (600, 600), "FRANK OCEAN\nBLONDE", (24, 20, 16), (233, 222, 201)),
    ("music",  "daniel-caesar.jpg",(600,600), "DANIEL CAESAR\nFREUDIAN", (76, 58, 40), (233, 222, 201)),
    ("music",  "mac-miller.jpg",  (600, 600), "MAC MILLER\nSWIMMING", (190, 160, 90), (43, 33, 27)),
    ("music",  "tyler.jpg",       (600, 600), "TYLER, THE CREATOR\nIGOR", (120, 70, 120), (233, 222, 201)),
    ("music",  "brent-faiyaz.jpg",(600,600), "BRENT FAIYAZ\nWASTELAND", (30, 50, 45), (233, 222, 201)),
    ("music",  "oasis.jpg",       (600, 600), "OASIS\n(WHAT'S THE STORY)", (200, 200, 200), (43, 33, 27)),
    ("skate",  "skate.jpg",       (900, 1150), "SKATE / STILL LEARNING", (58, 50, 44), (237, 226, 212)),
    ("mountain","mountain.jpg",    (1200, 800), "MOUNTAINS / SLOW IS MOVING", (46, 42, 38), (200, 175, 135)),
    ("design", "design.jpg",      (820, 1040), "VISUAL / MOTION / LAYOUT", (75, 60, 45), (237, 226, 212)),
    ("projects","space-jump.jpg", (1400, 900), "SPACE JUMP\nGAME PROJECT", (20, 26, 34), (188, 178, 156)),
    ("projects","asetkita.jpg",   (1400, 860), "ASETKITA\nBANK INDONESIA COMPETITION", (22, 22, 20), (141, 116, 82)),
]

def find_font(size):
    for name in ["C:/Windows/Fonts/consola.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"]:
        try:
            return ImageFont.truetype(name, size)
        except Exception:
            continue
    return ImageFont.load_default()

def make_placeholder(path, size, label, bg, accent):
    w, h = size
    img = Image.new("RGB", (w, h), bg)
    glow = Image.new("L", (w, h), 0)
    gd = ImageDraw.Draw(glow)
    cx, cy = int(w*0.5), int(h*0.4)
    r = max(w, h)
    gd.ellipse([cx-r, cy-r, cx+r, cy+r], fill=95)
    glow = glow.filter(ImageFilter.GaussianBlur(max(w, h)//4))
    base = Image.new("RGB", (w, h), tuple(min(255, v+14) for v in accent))
    tint = Image.composite(base, img, glow.point(lambda p: int(p*0.55)))
    img = tint
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, w-1, h-1], outline=accent, width=2)
    d.rectangle([14, 14, w-15, h-15], outline=accent, width=1)
    # corner crop marks
    m = 30; q = 30
    for (x, y, sx, sy) in [(m,m,1,1),(w-m,m,-1,1),(m,h-m,1,-1),(w-m,h-m,-1,-1)]:
        d.line([x, y, x+sx*q, y], fill=(20,16,13), width=3)
        d.line([x, y, x, y+sy*q], fill=(20,16,13), width=3)
    font = find_font(26)
    lines = label.split("\n")
    start_y = h-40 - (len(lines)-1)*34
    for i, ll in enumerate(lines):
        bbox = d.textbbox((0, 0), ll, font=font)
        tw = bbox[2]-bbox[0]
        d.text((w//2 - tw//2, y + i*34), ll, font=font, fill=accent)
    # faint "replace me" watermark
    top_font = find_font(16)
    d.text((w-160, 18), "PLACEHOLDER FILM", font=top_font, fill=(250, 244, 230))
    d.text((w-150, 42), "assets/images", font=top_font, fill=(250, 244, 230))
    img.save(path, quality=82)
    print("wrote", os.path.relpath(path, ROOT))

def main():
    for sub, name, size, label, bg, ac in PLACEHOLDERS:
        d = os.path.join(IMG, sub)
        os.makedirs(d, exist_ok=True)
        path = os.path.join(d, name)
        make_placeholder(path, size, label, bg, ac)
    # automotive detail tiles
    dd = os.path.join(IMG, "automotive", "details")
    os.makedirs(dd, exist_ok=True)
    for dl in DETAILS:
            make_placeholder(os.path.join(dd, f"w124-{dl.lower()}.jpg"), (700, 500), dl, (35,28,23), (150,120,90))
            make_placeholder(os.path.join(dd, f"rxz-{dl.lower()}.jpg"), (700, 500), dl, (35,28,23), (160,115,92))
    update = os.path.join(IMG, "_meta.txt")
    with open(update, "w") as f:
        f.write("All images are generated placeholders — replace each file with a real photo keeping the same name/path.\n")
    print("done")

if __name__ == "__main__":
    main()