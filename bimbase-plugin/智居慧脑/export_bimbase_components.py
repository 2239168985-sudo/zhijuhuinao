# -*- coding: utf-8 -*-
"""导出 BIMBase 构件清单：点击按钮后，直接在弹出窗口里展示清单与统计切换视图。

界面反馈：
- 顶部实时显示构件总数与演示/真实状态
- “清单列表”视图：表格展示序号、名称、编码、类别、空间
- “统计视图”：按类别、空间分组计数，并附带条形图占比
- 一键导出 HTML / JSON 到桌面

若 BIMBase 中未选中任何构件或 pyp3d 不可用，则自动进入演示模式，
保证按钮始终“有反应”。
"""
import os
import json
import urllib.parse
import subprocess
import webbrowser
import datetime
from collections import Counter

SITE = "https://2239168985-sudo.github.io/zhijuhuinao"


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


def try_real_export():
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
        rows = []
        for e in ents:
            datakey = get_datakey_from_entity(e)
            noumenon = get_noumKV_from_instancekey(datakey)
            rows.append({
                "name": noumenon.get("构件名称", ""),
                "code": noumenon.get("构件编号", noumenon.get("构件编码", "")),
                "category": noumenon.get("构件类别", noumenon.get("BIM_Category", "")),
                "space": noumenon.get("房间", noumenon.get("Room_ID", "")),
            })
        return rows
    except Exception:
        return None


def build_html_report(rows, demo=False):
    """生成一份带表格的深色科技风 HTML 清单。"""
    title = "智居慧脑 · BIMBase 构件清单"
    rows_html = []
    for i, r in enumerate(rows, start=1):
        q = urllib.parse.quote(r.get("name", ""))
        detail_url = f"{SITE}/components.html?q={q}"
        rows_html.append(
            f"""<tr>
                <td>{i}</td>
                <td>{r.get('name', '')}</td>
                <td>{r.get('code', '')}</td>
                <td>{r.get('category', '')}</td>
                <td>{r.get('space', '')}</td>
                <td><a href="{detail_url}" target="_blank">查看详情 →</a></td>
            </tr>"""
        )

    demo_badge = "<span class=\"badge\">演示数据</span>" if demo else ""
    table_body = "\n".join(rows_html) if rows_html else "<tr><td colspan=\"6\">未找到构件</td></tr>"

    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        :root {{ --bg:#0a0e17; --card:#101827; --text:#e2e8f0; --muted:#94a3b8;
                --border:rgba(148,163,184,0.15); --accent:#34d399; --accent-2:#3b82f6; --gold:#d4a853; }}
        * {{ box-sizing:border-box; }}
        body {{ margin:0; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;
                background:var(--bg); color:var(--text); line-height:1.6; }}
        .container {{ max-width:1100px; margin:0 auto; padding:36px 24px; }}
        header {{ text-align:center; margin-bottom:28px; }}
        h1 {{ margin:0 0 10px; font-size:26px; font-weight:700;
              background:linear-gradient(90deg,var(--accent),var(--accent-2));
              -webkit-background-clip:text; -webkit-text-fill-color:transparent; }}
        .subtitle {{ color:var(--muted); font-size:13px; margin-bottom:14px; }}
        .meta {{ display:flex; justify-content:center; align-items:center; gap:12px; flex-wrap:wrap; }}
        .badge {{ background:rgba(212,168,83,0.12); color:var(--gold); border:1px solid rgba(212,168,83,0.3);
                  padding:4px 12px; border-radius:999px; font-size:12px; }}
        .count {{ background:rgba(52,211,153,0.1); color:var(--accent); border:1px solid rgba(52,211,153,0.25);
                  padding:4px 12px; border-radius:999px; font-size:12px; }}
        .card {{ background:var(--card); border:1px solid var(--border); border-radius:16px;
                 overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.3); }}
        table {{ width:100%; border-collapse:collapse; font-size:14px; }}
        thead {{ background:rgba(52,211,153,0.08); }}
        th,td {{ padding:13px 15px; text-align:left; border-bottom:1px solid var(--border); }}
        th {{ color:var(--accent); font-weight:600; white-space:nowrap; }}
        tr:hover {{ background:rgba(255,255,255,0.03); }}
        a {{ color:var(--accent-2); text-decoration:none; font-weight:500; }}
        a:hover {{ text-decoration:underline; }}
        footer {{ margin-top:22px; text-align:center; color:var(--muted); font-size:12px; }}
        @media (max-width:768px) {{ th,td{{padding:10px 12px;font-size:13px;}} table{{display:block;overflow-x:auto;white-space:nowrap;}} }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>智居慧脑 · BIMBase 构件清单</h1>
            <p class="subtitle">导出时间：{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            <div class="meta">
                <span class="count">共 {len(rows)} 个构件</span>
                {demo_badge}
            </div>
        </header>
        <div class="card">
            <table>
                <thead>
                    <tr><th>序号</th><th>构件名称</th><th>构件编码</th><th>所属类别</th><th>所在空间</th><th>操作</th></tr>
                </thead>
                <tbody>{table_body}</tbody>
            </table>
        </div>
        <footer>由 智居慧脑 BIMBase 插件 自动生成 · 站点：{SITE}</footer>
    </div>
</body>
</html>"""


def save_exports(rows, demo=False):
    """保存 HTML + JSON 到桌面，并返回路径。"""
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    os.makedirs(desktop, exist_ok=True)
    json_path = os.path.join(desktop, "bimbase-components-export.json")
    html_path = os.path.join(desktop, "bimbase-components-export.html")

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({"count": len(rows), "components": rows}, f, ensure_ascii=False, indent=2)

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(build_html_report(rows, demo=demo))

    return html_path, json_path


def run_ui(rows, demo=False):
    """弹出清单/统计切换窗口。"""
    try:
        import tkinter as tk
        from tkinter import ttk
    except Exception:
        # 降级：直接导出并打开 HTML
        html_path, _ = save_exports(rows, demo=demo)
        open_url(html_path)
        return

    root = tk.Tk()
    root.title("智居慧脑 · 构件清单")
    root.geometry("680x520")
    root.configure(bg="#0a0e17")
    root.minsize(560, 400)

    # 居中
    root.update_idletasks()
    sw, sh = root.winfo_screenwidth(), root.winfo_screenheight()
    x = (sw - 680) // 2
    y = (sh - 520) // 2
    root.geometry(f"680x520+{x}+{y}")

    # 样式常量
    BG = "#0a0e17"
    CARD = "#101827"
    TEXT = "#e2e8f0"
    MUTED = "#94a3b8"
    ACCENT = "#34d399"
    GOLD = "#d4a853"

    # 顶部标题与统计
    header = tk.Frame(root, bg=BG)
    header.pack(fill="x", padx=20, pady=(18, 10))

    tk.Label(
        header,
        text="BIMBase 构件清单",
        font=("Microsoft YaHei", 18, "bold"),
        bg=BG,
        fg=TEXT,
    ).pack(side="left")

    badge_color = GOLD if demo else ACCENT
    badge_text = "演示数据" if demo else "真实数据"
    tk.Label(
        header,
        text=badge_text,
        font=("Microsoft YaHei", 9, "bold"),
        bg=BG,
        fg=badge_color,
    ).pack(side="left", padx=(10, 0))

    tk.Label(
        header,
        text=f"共 {len(rows)} 个构件",
        font=("Microsoft YaHei", 11, "bold"),
        bg=BG,
        fg=ACCENT,
    ).pack(side="right")

    # 切换按钮
    tabs = tk.Frame(root, bg=BG)
    tabs.pack(fill="x", padx=20, pady=6)

    content = tk.Frame(root, bg=CARD, relief="solid", borderwidth=1)
    content.pack(fill="both", expand=True, padx=20, pady=(0, 12))
    content.config(highlightbackground="#1f2937", highlightcolor="#1f2937", highlightthickness=1)

    # 视图一：清单列表
    list_frame = tk.Frame(content, bg=CARD)
    cols = ("序号", "构件名称", "构件编码", "所属类别", "所在空间")
    tree = ttk.Treeview(list_frame, columns=cols, show="headings", height=16)
    for c in cols:
        tree.heading(c, text=c)
        tree.column(c, anchor="w")
    tree.column("序号", width=50, anchor="center")
    tree.column("构件名称", width=180)
    tree.column("构件编码", width=110)
    tree.column("所属类别", width=100)
    tree.column("所在空间", width=120)

    for i, r in enumerate(rows, start=1):
        tree.insert(
            "",
            "end",
            values=(i, r.get("name", ""), r.get("code", ""), r.get("category", ""), r.get("space", "")),
        )

    scrollbar = ttk.Scrollbar(list_frame, orient="vertical", command=tree.yview)
    tree.configure(yscrollcommand=scrollbar.set)
    tree.pack(side="left", fill="both", expand=True, padx=10, pady=10)
    scrollbar.pack(side="right", fill="y", pady=10)

    # 视图二：统计
    stats_frame = tk.Frame(content, bg=CARD)

    def make_bars(parent, title, counts):
        tk.Label(
            parent,
            text=title,
            font=("Microsoft YaHei", 13, "bold"),
            bg=CARD,
            fg=TEXT,
        ).pack(anchor="w", padx=16, pady=(14, 8))
        if not counts:
            tk.Label(parent, text="无数据", bg=CARD, fg=MUTED).pack(anchor="w", padx=16)
            return
        maxv = max(counts.values())
        for name, val in counts.most_common():
            row = tk.Frame(parent, bg=CARD)
            row.pack(fill="x", padx=16, pady=4)
            pct = val / maxv
            tk.Label(row, text=name, font=("Microsoft YaHei", 11), bg=CARD, fg=TEXT, width=14, anchor="w").pack(side="left")
            bar_canvas = tk.Canvas(row, width=240, height=14, bg=CARD, highlightthickness=0)
            bar_canvas.pack(side="left", padx=(8, 0))
            bar_canvas.create_rectangle(0, 0, 240, 14, outline="#1f2937", width=1)
            bar_canvas.create_rectangle(1, 1, int(238 * pct) + 1, 13, fill=ACCENT, outline="")
            tk.Label(row, text=f"{val}", font=("Microsoft YaHei", 11, "bold"), bg=CARD, fg=ACCENT).pack(side="left", padx=(10, 0))

    make_bars(stats_frame, "按类别统计", Counter(r.get("category", "未分类") for r in rows))
    make_bars(stats_frame, "按空间统计", Counter(r.get("space", "未指定") for r in rows))

    # 视图切换
    active_btn = {"ref": None}

    def show_list():
        stats_frame.pack_forget()
        list_frame.pack(fill="both", expand=True)
        list_btn.config(bg=ACCENT, fg="#0a0e17")
        stats_btn.config(bg="#1f2937", fg=TEXT)
        active_btn["ref"] = list_btn

    def show_stats():
        list_frame.pack_forget()
        stats_frame.pack(fill="both", expand=True)
        stats_btn.config(bg=ACCENT, fg="#0a0e17")
        list_btn.config(bg="#1f2937", fg=TEXT)
        active_btn["ref"] = stats_btn

    list_btn = tk.Button(
        tabs,
        text="清单列表",
        command=show_list,
        font=("Microsoft YaHei", 11, "bold"),
        bg=ACCENT,
        fg="#0a0e17",
        activebackground="#10b981",
        activeforeground="#0a0e17",
        padx=18,
        pady=5,
        cursor="hand2",
        relief="flat",
        borderwidth=0,
    )
    list_btn.pack(side="left", padx=(0, 8))

    stats_btn = tk.Button(
        tabs,
        text="统计视图",
        command=show_stats,
        font=("Microsoft YaHei", 11, "bold"),
        bg="#1f2937",
        fg=TEXT,
        activebackground="#374151",
        activeforeground="#ffffff",
        padx=18,
        pady=5,
        cursor="hand2",
        relief="flat",
        borderwidth=0,
    )
    stats_btn.pack(side="left")

    # 底部操作
    footer = tk.Frame(root, bg=BG)
    footer.pack(fill="x", padx=20, pady=(0, 16))

    status_var = tk.StringVar(value="就绪")
    status_label = tk.Label(
        footer,
        textvariable=status_var,
        font=("Microsoft YaHei", 10),
        bg=BG,
        fg=MUTED,
    )
    status_label.pack(side="left")

    def do_export_html():
        html_path, _ = save_exports(rows, demo=demo)
        status_var.set(f"HTML 已导出：{html_path}")
        open_url(html_path)

    def do_export_json():
        _, json_path = save_exports(rows, demo=demo)
        status_var.set(f"JSON 已导出：{json_path}")

    tk.Button(
        footer,
        text="导出 HTML",
        command=do_export_html,
        font=("Microsoft YaHei", 11, "bold"),
        bg="#3b82f6",
        fg="#ffffff",
        activebackground="#2563eb",
        padx=14,
        pady=5,
        cursor="hand2",
        relief="flat",
        borderwidth=0,
    ).pack(side="right", padx=(8, 0))

    tk.Button(
        footer,
        text="导出 JSON",
        command=do_export_json,
        font=("Microsoft YaHei", 11),
        bg="#1f2937",
        fg=TEXT,
        activebackground="#374151",
        activeforeground="#ffffff",
        padx=14,
        pady=5,
        cursor="hand2",
        relief="flat",
        borderwidth=0,
    ).pack(side="right")

    # 默认显示列表
    show_list()
    root.mainloop()


def main():
    rows = try_real_export()
    demo = False
    if not rows:
        demo = True
        rows = [
            {"name": "智能升降晾衣系统", "code": "YY-001", "category": "阳台", "space": "主卧阳台"},
            {"name": "智能香薰氛围灯", "code": "KT-012", "category": "客厅", "space": "客厅"},
            {"name": "人体感应夜灯", "code": "XF-008", "category": "玄关", "space": "玄关"},
            {"name": "智能温控面板", "code": "WS-005", "category": "卧室", "space": "主卧"},
            {"name": "电动窗帘轨道", "code": "CL-009", "category": "客厅", "space": "客厅"},
        ]

    run_ui(rows, demo=demo)


if __name__ == "__main__":
    main()
