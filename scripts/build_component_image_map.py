#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rewrite lib/component-images.ts so every component gets its own generated gNNN.png model image,
while preserving the existing COMPONENT_PARAM_IMAGE block until params are regenerated."""
import json, os, re

ROOT = r"D:\WorkBuddy\zhijuhuinao"
MAP = os.path.join(ROOT, "scripts", "final_map.json")
OUT = os.path.join(ROOT, "lib", "component-images.ts")

def grab_const_map(text, const_name):
    """Line-based extractor for `export const CONST: Record<...> = { ... };` blocks."""
    lines = text.splitlines()
    in_block = False
    d = {}
    for ln in lines:
        if re.search(r'export const ' + re.escape(const_name) + r'\b', ln):
            in_block = True
            continue
        if in_block:
            if re.match(r'\s*}', ln):  # block close
                break
            m = re.match(r'\s*"([^"]+)":\s*"([^"]+)"', ln)
            if m:
                d[m.group(1)] = m.group(2)
    return d

m = json.load(open(MAP, encoding="utf-8"))
old_text = open(OUT, encoding="utf-8").read()
param_map = grab_const_map(old_text, "COMPONENT_PARAM_IMAGE")

model_lines = [f'  "{x["name"]}": "/components/{x["out"]}.png",' for x in m]
param_lines = [f'  "{k}": "{v}",' for k, v in param_map.items()]

new = (
    "// 自动生成：每个构件独占一张统一风格的网图（2026-08-06 重制）\n"
    "// 112 个构件均对应 gNNN.png；优先从 PPT 截图 img2img，无截图的从文本生成。\n"
    "export const COMPONENT_IMAGE: Record<string, string> = {\n"
    + "\n".join(model_lines)
    + "\n};\n\n"
    "export const COMPONENT_PARAM_IMAGE: Record<string, string> = {\n"
    + "\n".join(param_lines)
    + "\n};\n"
)
open(OUT, "w", encoding="utf-8").write(new)
print("wrote", OUT, "model entries:", len(m), "param entries:", len(param_map))
