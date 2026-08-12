#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Flatten generated PNGs from public/gen/* and convert to WebP."""
import os, glob
from PIL import Image

ROOT = r"D:\WorkBuddy\zhijuhuinao\public"
GEN = os.path.join(ROOT, "gen")

mapping = {
    "scene-district": "scene-district.webp",
    "scene-a": "scene-living.webp",
    "scene-b": "scene-bedroom.webp",
    "scene-c": "scene-study.webp",
    "scene-energy": "scene-energy.webp",
}

def convert(src, dst):
    img = Image.open(src)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGBA")
    else:
        img = img.convert("RGB")
    img.save(dst, "WEBP", quality=90)
    print(f"{src} -> {dst}")

# flatten + convert
for sub, out_name in mapping.items():
    subdir = os.path.join(GEN, sub)
    files = glob.glob(os.path.join(subdir, "*.png"))
    if not files:
        print("WARN: no generated file in", subdir)
        continue
    convert(files[0], os.path.join(ROOT, out_name))

# also fix hero-cover.webp (renamed PNG -> real WebP)
hero_png = os.path.join(ROOT, "hero-cover.webp")  # currently PNG content
if os.path.isfile(hero_png):
    tmp = hero_png + ".tmp"
    convert(hero_png, tmp)
    os.replace(tmp, hero_png)
    print("hero-cover.webp converted to real WebP")

print("done")
