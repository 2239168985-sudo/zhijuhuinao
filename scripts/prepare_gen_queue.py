#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Create scripts/gen_queue.json with all 112 component image generation specs."""
import json, os, glob, re

ROOT = r"D:\WorkBuddy\zhijuhuinao"
MAP = os.path.join(ROOT, "scripts", "final_map.json")
SRC_DIR = r"D:\ASUS\Downloads\智居慧脑_PPT图片素材包\03_构件图片_全量"
STYLE = (
    "Clean high-end product photography, soft studio lighting, "
    "seamless light grey gradient background, subtle floor reflection, "
    "photorealistic, 8k, minimal, no text, no watermark, centered product shot. "
)

TEXT_PROMPT = {
    "C03-N2_智能香薰氛围灯": "A smart aromatherapy ambient light lamp, cylindrical modern design, soft glowing warm light, frosted glass body, sitting on a surface.",
    "小熊玩偶": "A cute plush teddy bear soft toy figurine, sitting pose, beige brown fur, home decoration.",
    "茶杯": "A ceramic tea cup with saucer, minimalist modern, on a table.",
    "小绿植": "A small potted green houseplant in a modern ceramic pot, fresh green foliage.",
    "游戏机": "A modern home video game console with controller, sleek black design.",
    "C03-N3_现代坐姿猫咪玩偶": "A cute seated cat plush figurine, soft grey fur, modern home decor.",
    "企鹅玩偶": "A cute plush penguin figurine, black and white, home decoration.",
    "主卧智能中枢显示器": "A smart home hub display screen for master bedroom, wall-mounted rectangular monitor with modern UI, white frame.",
    "可调单双洞外墙": "A modular perforated exterior wall panel with circular openings, modern architectural facade, concrete/grey finish.",
    "阳台1660右固定玻璃折叠移门": "A right-side fixed glass folding balcony door, modern aluminum frame, transparent glass panels.",
    "阳台1300右固定玻璃折叠移门": "A narrower right-side fixed glass folding balcony door, modern aluminum frame, transparent glass panels.",
    "家庭智能边缘中枢网关": "A compact smart home edge gateway hub, small sleek white box with subtle LED indicator.",
    "智能升降晾衣系统": "An electric lifting clothes drying rack, ceiling-mounted metal rack with hangers, modern white finish.",
    "智能扫地机器人": "A round robotic vacuum cleaner, modern white and black body, lidar sensor on top, home appliance.",
    "智能暖风排风系统": "A wall-mounted bathroom ventilation fan with warm-air function, circular grille, modern white finish.",
    "L15_智能草坪灯": "A modern smart lawn bollard light, short cylindrical lamp in green lawn, minimalist design.",
    "阳台标准分块夹层玻璃墙": "A standard modular laminated glass wall panel for balcony, aluminum frame, safety glass.",
    "卫生间800防潮平开门": "An 800mm width moisture-proof flush door for bathroom, modern panel, light wood/white finish.",
    "玄关智能鞋柜换鞋凳一体柜": "An entrance hall smart shoe cabinet with integrated bench, modern wood and white finish.",
    "餐厅一体式餐边柜": "A modern dining room sideboard cabinet, buffet with storage, wood and white finish.",
}

m = json.load(open(MAP, encoding="utf-8"))
queue = []
for x in m:
    row = x["row"]
    name = x["name"]
    if row:
        srcs = glob.glob(os.path.join(SRC_DIR, f"{row}_*_模型图.png"))
        src = srcs[0] if srcs else None
        prompt = STYLE + (
            f"Refine this 3D product rendering of the object '{name}' into a clean studio product photograph; "
            f"preserve the exact object, shape and details shown."
        )
    else:
        src = None
        desc = TEXT_PROMPT.get(name, name)
        prompt = STYLE + desc
    queue.append({
        "out": x["out"],
        "name": name,
        "category": x["category"],
        "row": row,
        "src": src,
        "prompt": prompt,
    })

out = os.path.join(ROOT, "scripts", "gen_queue.json")
json.dump(queue, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("queue entries:", len(queue), "saved ->", out)
