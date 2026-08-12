#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build an authoritative image manifest linking each of the 112 library
components to its screenshot source PNG (model + param) in the PPT material
package, falling back to None (needs text-to-image)."""
import json, re, os, csv, difflib

ROOT = r"D:\WorkBuddy\zhijuhuinao"
LIB = os.path.join(ROOT, "lib", "component-library.ts")
IMG_TS = os.path.join(ROOT, "lib", "component-images.ts")
SRC_DIR = r"D:\ASUS\Downloads\智居慧脑_PPT图片素材包\03_构件图片_全量"
CSV = os.path.join(SRC_DIR, "构件图片索引.csv")

# ---- 1. parse COMPONENT_LIBRARY: extract id/code/name/category per object ----
txt = open(LIB, encoding="utf-8").read()
i = txt.index("COMPONENT_LIBRARY")
arr_start = txt.index("[", i)
arr_end = txt.index("];", arr_start)  # array closes right before "];"
arr_txt = txt[arr_start:arr_end+1]
# each component object begins with {"id":..,"code":..,"name":..,"category":..}
pat = re.compile(
    r'\{\s*"id":\s*"([^"]*)",\s*"code":\s*"([^"]*)",\s*"name":\s*"([^"]*)",\s*"category":\s*"([^"]*)"'
)
comps = []
for m in pat.finditer(arr_txt):
    comps.append({"id": m.group(1), "code": m.group(2), "name": m.group(3), "category": m.group(4)})
print("library components:", len(comps))

# ---- 2. parse CSV (name -> filenames) and by number ----
csv_by_name = {}
csv_by_num = {}
with open(CSV, encoding="utf-8-sig", newline="") as f:
    for row in csv.DictReader(f):
        name = row["构件名称"].strip()
        m = row["模型图"].strip()
        p = row["参数图"].strip()
        csv_by_name[name] = (m, p)
        num = m.split("_", 1)[0]
        csv_by_num[num] = (name, m, p)
print("csv entries:", len(csv_by_name))

# ---- 3. reverse-map existing COMPONENT_IMAGE (name -> cNN) ----
img_txt = open(IMG_TS, encoding="utf-8").read()
def grab_linebased(block_name):
    lines = img_txt.splitlines()
    d = {}
    in_block = False
    for ln in lines:
        if re.search(r'export const ' + re.escape(block_name) + r'\b', ln):
            in_block = True
            continue
        if in_block:
            if re.match(r'\s*}', ln):  # block close
                break
            if re.match(r'\s*export const', ln):  # next block
                break
            m = re.match(r'\s*"([^"]+)":\s*"([^"]+)"', ln)
            if m:
                d[m.group(1)] = m.group(2)
    return d
COMP_IMG = grab_linebased("COMPONENT_IMAGE")
COMP_PARAM = grab_linebased("COMPONENT_PARAM_IMAGE")
PUB = os.path.join(ROOT, "public", "components")
name_to_num = {}
for nm, path in COMP_IMG.items():
    mnum = re.search(r"c(\d+)_m", path)
    if mnum: name_to_num[nm] = mnum.group(1)

def src_for_num(num, kind):
    # existing webp on disk IS the converted screenshot -> use as img2img source
    p = os.path.join(PUB, f"c{num}_{kind[0]}.webp")  # kind[0]: m or p
    return p if os.path.isfile(p) else None

manifest = []
matched = 0
for c in comps:
    nm = c["name"]
    cat = c["category"]
    code = c["code"]
    src_model = src_param = None
    method = None
    if nm in name_to_num:
        num = name_to_num[nm]
        src_model = src_for_num(num, "m")
        src_param = src_for_num(num, "p")
        method = f"cNN#{num}"
        matched += 1
    if src_model and not os.path.isfile(src_model): src_model = None
    if src_param and not os.path.isfile(src_param): src_param = None
    if src_model: method += " (model ok)"
    manifest.append({
        "name": nm, "category": cat, "code": code,
        "src_model": src_model, "src_param": src_param, "method": method,
    })

out = os.path.join(ROOT, "scripts", "image_manifest.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=1)

has_model = sum(1 for x in manifest if x["src_model"])
has_param = sum(1 for x in manifest if x["src_param"])
print("matched (has model source):", has_model, "/", len(manifest))
print("has param source:", has_param)
print("NEED TEXT-TO-IMAGE (no model source):", len(manifest)-has_model)
print("saved ->", out)
print("\n--- components WITHOUT screenshot (text-to-image needed) ---")
for x in manifest:
    if not x["src_model"]:
        print(f"  [{x['category']}] {x['name']}  ({x['code']})")
