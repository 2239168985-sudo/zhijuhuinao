# -*- coding: utf-8 -*-
"""为 BIMBase 插件生成 4 个 16/24/32px 多尺寸 ICO 图标。

BIMBase（至少 2025 R1.0 V1.6）的 Ribbon 图标加载器**只支持 BMP 编码的 ICO 帧**，
Pillow 默认会把 RGBA 图标存成 PNG 编码帧，这会导致 BIMBase 启动/加载插件时崩溃。
因此本脚本手工构造 32-bit BMP 编码 ICO（含完整 XOR 色表 + AND 掩码）。
"""
import os
import struct
from PIL import Image, ImageDraw

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "bimbase-plugin", "智居慧脑", "Picture")
COLOR = "#4FA8D8"  # 与示例插件接近的青色
SIZES = [16, 24, 32]


def _rgba_to_bgra_bottom_up(rgba_top_down: bytes, width: int, height: int) -> bytes:
    """把上到下 RGBA 字节流转为 ICO BMP 所需的下到上 BGRA。"""
    row = width * 4
    out = bytearray()
    for y in range(height - 1, -1, -1):
        out.extend(rgba_top_down[y * row:(y + 1) * row])
    # 交换 R/B → BGRA
    for i in range(0, len(out), 4):
        out[i], out[i + 2] = out[i + 2], out[i]
    return bytes(out)


def save_bmp_ico(filename: str, images: list[Image.Image]):
    """手工写入 BMP 编码的 32-bit 多帧 ICO。"""
    count = len(images)
    header = struct.pack("<HHH", 0, 1, count)  # reserved, type=icon, count
    dir_entries = b""
    data = b""
    offset = 6 + 16 * count

    for img in images:
        img = img.convert("RGBA")
        w, h = img.size
        rgba = img.tobytes()
        bgra = _rgba_to_bgra_bottom_up(rgba, w, h)

        # AND 掩码：1bit/像素，按行 4 字节对齐；32-bit 图标此处全 0
        and_row = ((w + 31) // 32) * 4
        and_mask = bytes(and_row * h)

        image_size = len(bgra) + len(and_mask)
        info = struct.pack(
            "<IiiHHIIiiII",
            40,          # biSize
            w,           # biWidth
            h * 2,       # biHeight (XOR + AND)
            1,           # biPlanes
            32,          # biBitCount
            0,           # biCompression (BI_RGB)
            image_size,  # biSizeImage
            0, 0,        # biXPelsPerMeter, biYPelsPerMeter
            0,           # biClrUsed
            0,           # biClrImportant
        )
        frame = info + bgra + and_mask

        dir_entries += struct.pack(
            "<BBBBHHII",
            w if w < 256 else 0,
            h if h < 256 else 0,
            0, 0,       # color count, reserved
            1, 32,      # planes, bit count
            len(frame),
            offset,
        )
        data += frame
        offset += len(frame)

    with open(filename, "wb") as f:
        f.write(header + dir_entries + data)


def _draw_base(name: str) -> Image.Image:
    """在 64x64 画布上绘制图标主体，返回 RGBA 图像。"""
    size = 64
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    c = COLOR
    sw = 5  # stroke width at 64x64

    if name == "open_site":
        # 浏览器窗口
        d.rounded_rectangle([10, 12, 54, 52], radius=5, outline=c, width=sw)
        d.line([10, 22, 54, 22], fill=c, width=sw)
        for cx in (18, 25, 32):
            d.ellipse([cx - 2, 16 - 2, cx + 2, 16 + 2], fill=c)
    elif name == "components":
        # 2x2 网格
        gap = 6
        cell = 20
        start = 8
        for row in range(2):
            for col in range(2):
                x1 = start + col * (cell + gap)
                y1 = start + row * (cell + gap)
                d.rounded_rectangle([x1, y1, x1 + cell, y1 + cell], radius=4, outline=c, width=sw)
    elif name == "locate":
        # 靶心
        cx, cy = size // 2, size // 2
        d.ellipse([cx - 24, cy - 24, cx + 24, cy + 24], outline=c, width=sw)
        d.ellipse([cx - 11, cy - 11, cx + 11, cy + 11], outline=c, width=sw)
        d.line([cx - 7, cy, cx + 7, cy], fill=c, width=sw)
        d.line([cx, cy - 7, cx, cy + 7], fill=c, width=sw)
    elif name == "export":
        # 下载箭头
        d.rounded_rectangle([16, 8, 48, 54], radius=5, outline=c, width=sw)
        d.line([32, 18, 32, 40], fill=c, width=sw + 1)
        d.line([24, 32, 32, 40, 40, 32], fill=c, width=sw + 1, joint="curve")
    else:
        raise ValueError(name)
    return img


def _make_icon(name: str) -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    base = _draw_base(name)
    frames = [base.resize((s, s), Image.LANCZOS) for s in SIZES]
    out_path = os.path.join(OUT_DIR, f"{name}.ico")
    save_bmp_ico(out_path, frames)
    print("generated", out_path)


def _verify_ico(path: str) -> None:
    with open(path, "rb") as f:
        d = f.read()
    reserved, typ, count = struct.unpack("<HHH", d[:6])
    print(f"  {os.path.basename(path)}: count={count}", end="")
    off = 6
    for _ in range(count):
        w, h, _, _, _, bpp, size, offs = struct.unpack("<BBBBHHII", d[off:off + 16])
        is_png = d[offs:offs + 4] == b"\x89PNG"
        print(f" [{w}x{h} bpp={bpp} png={is_png}]", end="")
        off += 16
    print()


if __name__ == "__main__":
    for n in ("open_site", "components", "locate", "export"):
        _make_icon(n)
        _verify_ico(os.path.join(OUT_DIR, f"{n}.ico"))
    print("done")
