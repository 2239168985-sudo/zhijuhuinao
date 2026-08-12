# -*- coding: utf-8 -*-
"""定位当前构件：点击按钮后，直接在弹出窗口里展示实时扫描、计数与定位结果。

界面反馈：
- 进度条从 0% 走到 100%，实时显示百分比
- 状态文案随进度切换：扫描视图 → 匹配构件库 → 定位成功 / 演示模式
- 结果区用颜色高亮构件名，并标注“已定位”或“演示数据”
- 一键“查看构件详情”自动打开站点深链

若 BIMBase 中未选中任何构件或 pyp3d 不可用，则自动进入演示模式，
保证按钮始终“有反应”。
"""
import os
import json
import urllib.parse
import subprocess
import webbrowser

SITE = "https://2239168985-sudo.github.io/zhijuhuinao"
INDEX_PATH = os.path.join(os.path.dirname(__file__), "components-index.json")


def load_index():
    try:
        with open(INDEX_PATH, "r", encoding="utf-8") as f:
            return json.load(f).get("components", [])
    except Exception:
        return []


def best_match(candidate, index):
    if not candidate:
        return None
    cand = candidate.strip()
    for c in index:
        if c["name"] == cand:
            return c["name"]
    hits = []
    for c in index:
        n = c["name"]
        if n in cand or cand in n:
            hits.append((len(n), n))
    if hits:
        hits.sort(reverse=True)
        return hits[0][1]
    return None


def try_real_select(index):
    """尝试读取 BIMBase 当前选中构件；失败或没有则返回 None。"""
    try:
        from pyp3d import (
            get_element_from_boxselect,
            get_datakey_from_entity,
            get_noumKV_from_instancekey,
        )
        ents = get_element_from_boxselect()
        if not ents:
            return None
        datakey = get_datakey_from_entity(ents[0])
        noumenon = get_noumKV_from_instancekey(datakey)
        candidate = noumenon.get("构件名称", "")
        name = best_match(candidate, index)
        if name:
            return name
        for v in noumenon.values():
            if isinstance(v, str):
                name = best_match(v, index)
                if name:
                    return name
    except Exception:
        pass
    return None


def open_url(url):
    try:
        subprocess.Popen(["cmd", "/c", "start", "", url], shell=True)
        return True
    except Exception:
        pass
    try:
        webbrowser.open(url, new=2)
        return True
    except Exception:
        pass
    return False


def choose_demo_name(index):
    if index:
        for c in index:
            if "照明" in c["name"] or "开关" in c["name"]:
                return c["name"]
        return index[0]["name"]
    return "智能照明系统"


def run_ui(name, detail_url, demo=False):
    """弹出实时定位反馈窗口。"""
    try:
        import tkinter as tk
    except Exception:
        # 极端降级：直接打开浏览器
        open_url(detail_url)
        return

    root = tk.Tk()
    root.title("智居慧脑 · 定位当前构件")
    root.geometry("460x320")
    root.configure(bg="#0a0e17")
    root.resizable(False, False)

    # 居中
    root.update_idletasks()
    sw, sh = root.winfo_screenwidth(), root.winfo_screenheight()
    x = (sw - 460) // 2
    y = (sh - 320) // 2
    root.geometry(f"460x320+{x}+{y}")

    # 标题
    tk.Label(
        root,
        text="定位当前构件",
        font=("Microsoft YaHei", 18, "bold"),
        bg="#0a0e17",
        fg="#e2e8f0",
    ).pack(pady=(20, 4))

    # 状态与百分比
    status_var = tk.StringVar(value="准备扫描...")
    counter_var = tk.StringVar(value="0%")

    tk.Label(
        root,
        textvariable=status_var,
        font=("Microsoft YaHei", 12),
        bg="#0a0e17",
        fg="#94a3b8",
    ).pack()

    counter_label = tk.Label(
        root,
        textvariable=counter_var,
        font=("Microsoft YaHei", 28, "bold"),
        bg="#0a0e17",
        fg="#34d399",
    )
    counter_label.pack(pady=6)

    # 进度条（Canvas 自绘，避免 ttk 主题不一致）
    canvas = tk.Canvas(root, width=360, height=12, bg="#0a0e17", highlightthickness=0)
    canvas.pack(pady=4)
    canvas.create_rectangle(0, 0, 360, 12, outline="#1f2937", width=2, tags="bg")
    bar = canvas.create_rectangle(2, 2, 2, 10, fill="#34d399", outline="")

    # 结果区（初始隐藏）
    result_frame = tk.Frame(root, bg="#0a0e17")

    badge_color = "#d4a853" if demo else "#34d399"
    badge_text = "演示数据" if demo else "已定位"
    badge = tk.Label(
        result_frame,
        text=badge_text,
        font=("Microsoft YaHei", 10, "bold"),
        bg="#0a0e17",
        fg=badge_color,
    )
    badge.pack()

    name_label = tk.Label(
        result_frame,
        text=name,
        font=("Microsoft YaHei", 16, "bold"),
        bg="#101827",
        fg="#ffffff",
        padx=16,
        pady=10,
        relief="solid",
        borderwidth=1,
    )
    name_label.pack(pady=8)
    name_label.config(highlightbackground=badge_color, highlightcolor=badge_color, highlightthickness=1)

    # 按钮区（初始隐藏）
    actions_frame = tk.Frame(root, bg="#0a0e17")

    def on_detail():
        open_url(detail_url)

    detail_btn = tk.Button(
        actions_frame,
        text="查看构件详情 →",
        command=on_detail,
        font=("Microsoft YaHei", 11, "bold"),
        bg="#34d399",
        fg="#0a0e17",
        activebackground="#10b981",
        activeforeground="#0a0e17",
        padx=18,
        pady=6,
        cursor="hand2",
        relief="flat",
        borderwidth=0,
    )
    detail_btn.pack(side="left", padx=6)

    close_btn = tk.Button(
        actions_frame,
        text="关闭",
        command=root.destroy,
        font=("Microsoft YaHei", 11),
        bg="#1f2937",
        fg="#e2e8f0",
        activebackground="#374151",
        activeforeground="#ffffff",
        padx=18,
        pady=6,
        cursor="hand2",
        relief="flat",
        borderwidth=0,
    )
    close_btn.pack(side="left", padx=6)

    # 扫描动画
    def scan(step=0):
        if step > 100 or getattr(root, "_done", False):
            return
        pct = step
        width = max(2, int(360 * pct / 100))
        canvas.coords(bar, 2, 2, width, 10)
        counter_var.set(f"{pct}%")

        if pct < 30:
            status_var.set("正在扫描视图...")
        elif pct < 70:
            status_var.set("正在匹配构件库...")
        elif pct < 100:
            status_var.set("正在定位...")
        else:
            status_var.set("演示模式：未读取到选中构件" if demo else "定位成功")
            counter_var.set("完成")
            counter_label.config(fg=badge_color)
            result_frame.pack(pady=12)
            actions_frame.pack(pady=4)
            root._done = True
            return

        root.after(30, lambda: scan(step + 2))

    root.after(150, lambda: scan(0))
    root.mainloop()


def main():
    index = load_index()
    name = try_real_select(index)
    demo = False
    if not name:
        demo = True
        name = choose_demo_name(index)

    detail_url = SITE + "/components.html?q=" + urllib.parse.quote(name)
    run_ui(name, detail_url, demo=demo)


if __name__ == "__main__":
    main()
