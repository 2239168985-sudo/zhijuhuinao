# 智居慧脑 · BIMBase 插件

把「智居慧脑」智能家居参数化构件库展示站（Next.js 静态站）与 BIMBase（插件 SDK V1.6）打通的官方 Python 插件。
基于 BIMBase Python 二次开发（pyp3d）实现，零编译、复制即用。

> 站点地址（已部署，静态导出）：
> https://2239168985-sudo.github.io/zhijuhuinao

---

## 一、目录结构（本压缩包解压后应有的样子）

```
pythonplugin\                        ← BIMBase 插件根目录（解压目标）
├── 智居慧脑.pyplugin                ← Ribbon 菜单清单（XML，**必须带 .pyplugin 扩展名、放在此顶层**）
└── 智居慧脑\                        ← 脚本与数据文件夹（与清单同名）
    ├── open_site.py                 # 按钮①：打开展示站首页
    ├── open_components.py           # 按钮②：打开构件库总览页
    ├── locate_component.py          # 按钮③：定位当前选中构件（?q= 深链）
    ├── export_bimbase_components.py # 按钮④：导出 BIMBase 构件清单（数据桥·导出）
    ├── components-index.json        # 与网站同源的 112 构件索引（离线匹配用）
    ├── Picture/                     # 按钮图标（4 个 .ico，Ribbon 图文显示）
    │   ├── open_site.ico
    │   ├── components.ico
    │   ├── locate.ico
    │   └── export.ico
    └── README.md
```

> ⚠️ **图标格式警告**：BIMBase 2025 R1.0 的 Ribbon ICO 加载器**只接受 BMP 编码的 ICO**。若用 Pillow、Photoshop 等导出为 PNG 编码的 `.ico`，启动/加载插件时会直接崩溃。本包图标已手工构造为 32-bit BMP 编码 ICO（16/24/32px 三帧）。如需替换，请确保同样是 BMP 编码。

> ⚠️ **关键结论（插件不出现的根因）**
> BIMBase 只在 `pythonplugin\` **顶层**扫描 `*.pyplugin` 文件，并用其中的 `<PluginModule>` 绝对路径定位脚本目录。
> 早一版把清单放在 `智居慧脑\` 子目录内、且文件名没有 `.pyplugin` 扩展名，所以一直没被加载。
> 本版已修正：清单 `智居慧脑.pyplugin` 在顶层、带扩展名、补全 `<Name>/<PluginModule>/<PluginSDKVersion>` 字段。

## 二、安装

### 步骤 1：找到 BIMBase 插件根目录
在 BIMBase 里点「插件扩展」→「**源码目录**」，会打开插件根目录。
典型路径（不同机器可能略有差异）：
```
C:\ProgramData\PKPM\BIMBase\Plugins\Pro\V1.6\pythonplugin
```

### 步骤 2：放入插件（两种方式任选）

**方式 A：从网站下载 zip（推荐）**
1. 打开展示站首页，点「BIMBase 插件」卡片下载 `bimbase-plugin.zip`。
2. 把 zip **解压到上面的 `pythonplugin` 目录内**（不要先解压成一个新文件夹再整体挪）。
3. 解压后该目录下应直接出现 `智居慧脑.pyplugin` 和 `智居慧脑\` 文件夹。

**方式 B：手动放置**
1. 把本包里的 `智居慧脑.pyplugin` 复制到 `pythonplugin\` 顶层。
2. 在 `pythonplugin\` 下新建文件夹 `智居慧脑`，把 `open_site.py` 等 4 个脚本与 `components-index.json` 复制进去。

### 步骤 3：重启生效
4. **完全关闭并重新启动 BIMBase**（必须重启；仅 `refreshRibbonAll` 不一定能扫到新插件）。
5. 顶部 Ribbon 出现 **「智居慧脑」** 页签 → **「快速访问」** 面板，含 4 个按钮。

## 三、按钮与用法

本版插件使用 **标准库 + 弹窗反馈** 实现：即使 `pyp3d` 无法读取真实 BIMBase 数据，点击按钮也会
**弹出提示 + 执行演示动作**，保证"有反应"。当 `pyp3d` 可用且已框选真实构件时，会自动使用真实数据。

| 按钮 | 图标 | 作用 | 点击效果 |
|------|------|------|----------|
| 打开展示站 | 浏览器窗口 | 浏览器打开站点首页 | 弹窗确认，并打开浏览器 |
| 构件库总览 | 网格 | 浏览器打开 `/components.html` 构件库 | 弹窗确认，并打开浏览器 |
| 定位当前构件 | 靶心 | 打开 `/components.html?q=<构件名>` 深链 | 优先用真实选中构件；未选中则进入**演示模式**，打开示例构件深链 |
| 导出BIMBase构件清单 | 下载箭头 | 导出 JSON 到桌面 | 优先用真实选中构件；未选中则导出 3 个**示例构件**到桌面 |

> 图标文件位于 `智居慧脑\Picture\*.ico`，由 `智居慧脑.pyplugin` 中的 `<iconPath>` 引用；
> 若 BIMBase 主题色导致图标看不清，可替换同尺寸（16/24/32px）ICO 文件并保持文件名一致。

「定位当前构件」会优先取实体的 `构件名称` 字段，并在 `components-index.json` 中做包含匹配，
把最贴近的构件名作为深链关键词，确保展示站能精确过滤到对应卡片。

## 四、集成层级（已交付 / 待扩展）

本插件落地了**对演示最有价值且无需改造网站架构**的两层：

- ✅ **① 启动器 + 深链（核心）**：Ribbon 一键打开网站；并把 BIMBase 当前选中构件
  通过 `?q=` URL 参数深链到网站构件库对应卡片（网站侧 `app/components/page.tsx` 已支持读取该参数）。
  本版按钮脚本使用标准库实现，即使 `pyp3d` 不可用时也会以"演示模式"给出弹窗反馈。
- ✅ **③ 数据桥（导出）**：`export_bimbase_components.py` 把 BIMBase 模型中的构件导出为 JSON；
  网站侧同步发布同源索引 `public/components-export.json`（112 个构件，含 `url` 深链字段），
  二者字段对齐即可对接外部系统（运维 / 算量 / 展示站）。

以下两层**本版未实现**，已在架构上预留，按需后续扩展：

- ⏸ **② 内嵌 WebView 面板**：在 BIMBase 内嵌浏览器面板直接渲染网站，做到「不切窗口」。
  需要 BIMBase 的 CEF / WebView 承载控件；当前 pyp3d 命令脚本无原生面板容器，建议改用
  C# 插件承载 WebBrowser 控件，或等待 BIMBase 开放 WebView API。
- ⏸ **④ 全栈双向同步**：BIMBase 与网站实时互写（例如网站调参反向驱动 BIMBase 建模）。
  当前网站是 `output:'export'` 纯静态站、无后端；双向同步需引入服务端（如 Node/API + 数据库），
  会放弃静态导出。建议作为独立后端服务单独评估，不阻塞本插件使用。

## 五、常见问题排查（插件没出现时按此顺序查）

1. **`pyplugin` 是否在 `pythonplugin\` 顶层、且带 `.pyplugin` 扩展名？**
   - 必须形如 `pythonplugin\智居慧脑.pyplugin`。放在子目录、或叫 `pyplugin`/`pyplugin.txt` 都不会被加载。
   - 打开「文件扩展名」显示，确认不是 `智居慧脑.pyplugin.txt`。

2. **是否放在了正确的插件根目录？**
   - 点「插件扩展」→「源码目录」打开的才是真正的插件根（通常在 `ProgramData\PKPM\BIMBase\...\pythonplugin`），
     不是 BIMBase 安装目录下的 `App\`，也不是项目模型目录。

3. **`<PluginModule>` 路径是否指向脚本所在文件夹？**
   - 默认是 `C:\ProgramData\PKPM\BIMBase\Plugins\Pro\V1.6\pythonplugin\智居慧脑\`。
     若你的 BIMBase 装在别的盘/路径，请同步修改该文件的 `<PluginModule>` 值。

4. **是否重启了 BIMBase？**
   - 放入插件后必须**完全关闭再重开** BIMBase。仅 `refreshRibbonAll` 不一定能重新扫描新增插件。

5. **点了按钮没反应？**
   - 本版脚本已改为**标准库 + Windows 弹窗**实现，正常情况下点击必有提示框。
   - 若仍没反应，大概率是 BIMBase 内部 Python 无法运行脚本。请双击 `智居慧脑\open_site.py` 看能否弹窗/打开浏览器；
     若双击也没反应，请检查本机默认 `.py` 文件是否关联了 Python 解释器。

6. **命令栏是否有报错？**
   - 重启后留意命令栏/左下角是否有 XML 解析错误，把报错内容发我即可定位。

## 六、验证说明

- 按钮脚本使用 Python 标准库实现（`subprocess` / `webbrowser` / `ctypes` / `json`），**不强制依赖 `pyp3d`**；
  即使 BIMBase 内部 Python 环境受限，也会以弹窗方式给出反馈。
- 读取真实选中构件的功能在 `try/except` 中按需调用 `pyp3d`，若 `pyp3d` 不可用则自动进入演示模式。
- **沙箱环境未安装 BIMBase**，故无法在此自动运行；脚本语法已通过 `python -m py_compile` 校验。
- 在本机 BIMBase 中按上述步骤安装后，点击任一按钮均应看到 Windows 提示框，随后浏览器/桌面文件响应。
