#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Produce scripts/final_map.json: for each of the 112 library components,
decide a screenshot ROW (img2img source) or None (text-to-image), plus a
stable output filename gNNN.webp. Manual overrides encode the verified
component->screenshot mapping (avoiding the old wrong matches)."""
import re, json, os, csv, difflib

ROOT = r"D:\WorkBuddy\zhijuhuinao"
LIB = os.path.join(ROOT, "lib", "component-library.ts")
CSV = r"D:\ASUS\Downloads\智居慧脑_PPT图片素材包\03_构件图片_全量\构件图片索引.csv"

txt = open(LIB, encoding="utf-8").read()
i = txt.index("COMPONENT_LIBRARY"); arr_start = txt.index("[", i); arr_end = txt.index("];", arr_start)
arr_txt = txt[arr_start:arr_end+1]
pat = re.compile(r'\{\s*"id":\s*"([^"]*)",\s*"code":\s*"([^"]*)",\s*"name":\s*"([^"]*)",\s*"category":\s*"([^"]*)"')
comps = [{"name": m.group(3), "category": m.group(4), "code": m.group(2)} for m in pat.finditer(arr_txt)]

csvrows = []
with open(CSV, encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        csvrows.append((r["构件名称"].strip(), r["模型图"].strip(), r["参数图"].strip()))
csvnames = [c[0] for c in csvrows]
def norm(s): return re.sub(r'[\s_\-（）()]', '', s).lower()
ncsv = {norm(n): idx for idx, (n, m, p) in enumerate(csvrows, 1)}  # name -> row

# ---- manual overrides: component name -> ROW (int) or None (text-to-image) ----
# (covers components whose library name differs from the CSV name, or that
#  have no screenshot at all and must be generated from text)
MANUAL = {
    # text-to-image (no good screenshot in the 91):
    "C03-N2_智能香薰氛围灯": None,
    "小熊玩偶": None, "茶杯": None, "小绿植": None, "游戏机": None,
    "C03-N3_现代坐姿猫咪玩偶": None, "企鹅玩偶": None,
    "主卧智能中枢显示器": None, "家庭智能边缘中枢网关": None,
    "阳台1660右固定玻璃折叠移门": None, "阳台1300右固定玻璃折叠移门": None,
    "智能升降晾衣系统": None,          # 用户点名：绝不能配错图
    "智能扫地机器人": None,            # 绝不能再配成充电桩
    "智能暖风排风系统": None,
    "L15_智能草坪灯": None,
    "阳台标准分块夹层玻璃墙": None,
    "卫生间800防潮平开门": None,
    "玄关智能鞋柜换鞋凳一体柜": None,
    "餐厅一体式餐边柜": None,
    # manual ROW assignments (library name != csv name but object identical):
    "庭院丛生参数化竹子": 59, "庭院假山流水池塘": 66, "庭院参数化石拱桥": 56,
    "次卧小床纯家具版": 53, "庭院中式现代小凉亭": 40,
    "双机嵌入式洗烘储物柜": 48, "普通台式微波炉": 12,
    "电视旁展示储物柜": 44, "庭院户外休闲小吧台": 65,
    "户外藤编L形转角沙发": 85, "户外藤编小圆桌": 83,
    "新中式院落式高端社区大门": 39, "方块花坛（voxel 方块风格）": 68,
    "方块草坪灯（voxel 方块风格·智能）": 61, "L12_景观灌木球": 67, "L13_景观花坛": 68,
    "智能一体式工作站水槽": 18, "智能阳台休闲躺椅": 25,
    "智能光电感烟探测器": 75, "智能双灶燃气灶": 17,
    "厨房智能可燃气体泄漏探测器": 76, "客厅智能吊灯": 45, "主卧智能床整体式": 53,
    "智能语音交互音箱": 90, "玄关2400正方形地毯": 49, "电视柜（含电视机+音响）": 41,
    "别墅庭院自然伞形景观树": 79, "客厅窗边自然光传感器": 77,
    "别墅庭院自然景观树 V3（树叶显示修复）": 78, "草坪_简洁": 57,
    "客厅装饰落地灯A（现代简约直杆款）": 46, "别墅庭院规整观赏草丛 V2": 60,
    "通用边柜": 48, "卫生间头顶防潮吸顶灯": 54, "卧室900木质平开门": 33,
    "现代轻奢别墅区社区大门": 39, "书房头顶护眼吸顶灯": 54,
    "主卧头顶吸顶灯 V2": 54, "书房智能中枢显示器": 21, "厨房安全中枢显示器": 9,
    "客厅综合主中枢（集成阳台与餐厅）": 9, "公共卫生间智能中枢": 37,
    "环形厨房储物岛台": 11, "现代别墅庭院花坛 V2（灌木落地修复）": 68,
    "可调单双洞外墙": 32,
}

def auto_row(name):
    nn = norm(name)
    if nn in ncsv:
        return ncsv[nn]
    close = difflib.get_close_matches(name, csvnames, n=1, cutoff=0.6)
    if close:
        idx = csvnames.index(close[0]) + 1
        return idx
    return None

final = []
used_rows = {}
for idx, c in enumerate(comps, 1):
    name = c["name"]
    if name in MANUAL:
        row = MANUAL[name]
    else:
        row = auto_row(name)
    # detect duplicate row assignment (two components sharing one screenshot) -> allowed
    final.append({
        "name": name, "category": c["category"], "code": c["code"],
        "row": row, "out": f"g{idx:03d}",
    })

out = os.path.join(ROOT, "scripts", "final_map.json")
json.dump(final, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

n_img2img = sum(1 for x in final if x["row"])
n_text = sum(1 for x in final if not x["row"])
print("TOTAL:", len(final), "img2img:", n_img2img, "text-to-image:", n_text)
print("saved ->", out)
print("\n--- text-to-image components (must be generated from prompt) ---")
for x in final:
    if not x["row"]:
        print(f"  g{x['out'][1:]}  [{x['category']}] {x['name']}")
