# -*- coding: utf-8 -*-
"""打开「智居慧脑」展示站首页。

BIMBase 插件命令脚本：点击 Ribbon 按钮即执行本文件顶层代码。
本版本使用标准库，不依赖 pyp3d，确保在 BIMBase 内/外双击都能演示。
"""
import os
import subprocess
import webbrowser
import ctypes

SITE = "https://2239168985-sudo.github.io/zhijuhuinao"


def msgbox(text, title="智居慧脑"):
    """Windows 弹窗提示；失败则忽略。"""
    try:
        ctypes.windll.user32.MessageBoxW(0, text, title, 0x40)
    except Exception:
        pass


def open_url(url):
    """优先用系统的 start 命令打开 URL，失败再回退 webbrowser。"""
    try:
        subprocess.Popen(["cmd", "/c", "start", "", url], shell=True)
        return
    except Exception:
        pass
    try:
        webbrowser.open(url, new=2)
        return
    except Exception:
        pass
    msgbox("无法自动打开浏览器，请手动访问：\n" + url, "打开失败")


open_url(SITE + "/")
msgbox("已请求在默认浏览器中打开智居慧脑展示站。", "打开展示站")
