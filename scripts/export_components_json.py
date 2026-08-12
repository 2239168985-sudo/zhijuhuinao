# -*- coding: utf-8 -*-
"""
从 lib/component-library.ts 抽取 COMPONENT_LIBRARY，生成一份对外可用的构件索引 JSON。
- public/components-export.json : 网站侧可直接 fetch 的公开索引（数据桥对外出口）。
- bimbase-plugin/components-index.json : 与网站同源，随 BIMBase 插件离线打包，
  供插件把 BIMBase 中选中的构件名映射到网站深链 /components?q=<名称>。
"""
import os, re, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TS_PATH = os.path.join(ROOT, "lib", "component-library.ts")
OUT_WEB = os.path.join(ROOT, "public", "components-export.json")
OUT_PLUGIN = os.path.join(ROOT, "bimbase-plugin", "components-index.json")

SITE = "https://2239168985-sudo.github.io/zhijuhuinao"


def extract_array(text, marker):
    i = text.find(marker)
    if i < 0:
        raise RuntimeError("找不到标记: " + marker)
    # marker 形如 "COMPONENT_LIBRARY: LibComponent[] = ["，其中 LibComponent[] 自带一对括号，
    # 真正的数组起点是 " = [" 里的那个 '['。
    m = text.find("] = [", i)
    if m < 0:
        raise RuntimeError("找不到数组起点")
    j = m + len("] = [") - 1  # 指向数组的 '['
    depth = 0
    k = j
    while k < len(text):
        if text[k] == "[":
            depth += 1
        elif text[k] == "]":
            depth -= 1
            if depth == 0:
                return text[j:k + 1]
        k += 1
    raise RuntimeError("数组未闭合")


def main():
    with open(TS_PATH, "r", encoding="utf-8") as f:
        text = f.read()

    raw = extract_array(text, "export const COMPONENT_LIBRARY: LibComponent[] = [")
    # 源码每个对象后带逗号（含最后一个），去掉数组闭合前的尾随逗号
    raw = re.sub(r",\s*\]", "]", raw)
    items = json.loads(raw)

    index = []
    for it in items:
        name = it["name"]
        url = "{}/components.html?q={}".format(SITE, __import__("urllib.parse", fromlist=["quote"]).quote(name))
        index.append({
            "id": it["id"],
            "code": it["code"],
            "name": name,
            "category": it["category"],
            "space": it["space"],
            "paramCount": it.get("paramCount", len(it.get("params", []))),
            "features": it.get("features", []),
            "url": url,
        })

    payload = {
        "generatedFrom": "lib/component-library.ts",
        "site": SITE,
        "count": len(index),
        "components": index,
    }

    os.makedirs(os.path.dirname(OUT_WEB), exist_ok=True)
    os.makedirs(os.path.dirname(OUT_PLUGIN), exist_ok=True)
    with open(OUT_WEB, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    with open(OUT_PLUGIN, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print("构件数:", len(index))
    print("已写出:", OUT_WEB)
    print("已写出:", OUT_PLUGIN)


if __name__ == "__main__":
    main()
