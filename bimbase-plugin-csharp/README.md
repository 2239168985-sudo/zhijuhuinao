# 智居慧脑 · BIMBase 内嵌面板插件（C#）

把「智居慧脑」构件库网站**直接嵌进 BIMBase 主界面**（可停靠面板 + WebView2 浏览器内核），
而不是弹出外部浏览器。与已有的 Python 插件（`bimbase-plugin/`，负责"打开展示站/定位构件"等
外部浏览器动作）互为补充：Python 版解决"一键打开网页"，本 C# 版解决"在 BIMBase 里内嵌浏览"。

---

## 一、它是什么 / 能做什么

- 在 BIMBase 顶部 Ribbon 生成「智居慧脑 → 内嵌面板 → 打开网站面板」按钮。
- 点击后，在 BIMBase 右侧（或左/上/下）出现一个**可停靠面板**，里面直接用 Edge 内核加载：
  `https://2239168985-sudo.github.io/zhijuhuinao`
- 面板可拖动停靠、可再次点击按钮隐藏/显示。
- 站内链接都在同一面板内打开，不会弹窗。

> 实现核心：BIMBase 的 `BPNewDockManager`（位于 `BIMBaseNet.UI.dll`）可停靠对话框 API
> + WinForms `WebView2` 控件。

---

## 二、前置条件（缺一不可）

1. **BIMBase C# 二次开发 SDK**
   到 PKPM 官方渠道获取「BIMBase 建模软件 2025R1.0_SDK」，内含
   `BIMBaseNet.dll / BIMBaseNet.UI.dll / BIMBaseNet.Geometries.dll / BIMBaseCS.dll`
   等核心库与 API 文档。
2. **插件标识 PluginID**
   在 PKPM 官方平台申请生成 32 位 `PluginID`，填入 `智居慧脑.plugin` 的 `<PluginiD>`。
3. **WebView2 Runtime**
   Win10/11 大多已自带；若内嵌面板提示"无法加载内嵌浏览器"，去微软官网装
   [WebView2 Runtime](https://go.microsoft.com/fwlink/p/?LinkId=2124703)。
4. **Visual Studio 2022**（含 .NET 桌面开发 workload，x64 编译）。

---

## 三、编译步骤

1. 用 VS2022 打开本目录（或把文件加入新类库项目，目标框架 `.NET Framework 4.8`，平台 `x64`）。
2. 编辑 `ZhiJuHuiNao.csproj`，把 4 个 BIMBase DLL 的 `HintPath` 改成你 SDK 里的真实路径。
3. 还原 NuGet 包 `Microsoft.Web.WebView2`（已写在 csproj 里，VS 会自动还原）。
4. 生成（Build）→ 得到 `ZhiJuHuiNaoEmbed.dll`（以及 WebView2 相关依赖）。

---

## 四、部署步骤

1. 把你编译出的 `ZhiJuHuiNaoEmbed.dll` 放到 BIMBase 的 C# 插件目录，例如：
   `C:\ProgramData\PKPM\BIMBase\Plugins\Pro\V1.6\c#plugin\`
2. 把本目录的 `智居慧脑.plugin` 也放到同一 `c#plugin\` 目录，
   并把 `<EntryAssembly>` 改成该 dll 的完整路径，`<PluginiD>` 改成你的标识。
3. **完全关闭并重启 BIMBase**。
4. 顶部 Ribbon 出现「智居慧脑」页签 → 点「打开网站面板」，右侧即出现内嵌网站。

> 注意：这是 **C# 插件**，目录是 `c#plugin\`，与 Python 插件的 `pythonplugin\` 分开，
> 两个插件可以共存，互不影响。

---

## 五、常见问题

- **编译报"找不到类型 IExternalApplication / IBPFunctionCommand"**
  SDK 版本不同，命名空间可能略有差异（常见 `BIMBaseCS.*` 或 `BIMBase.Plugin.*`）。
  按你本机 SDK 的命名空间调整 `using` 即可。
- **面板里白屏 / 提示无法加载浏览器**
  没装 WebView2 Runtime，按"前置条件 3"安装后重启 BIMBase。
- **Ribbon 没出现但命令可用**
  直接忽略 Ribbon 注册代码，在 BIMBase 命令行输入 `ZhiJuHuiNaoPanel` 也能打开面板。
- **想换停靠方向**
  改 `OpenPanelCommand.cs` 里 `SetDockPosition(DockId, "right")` 为
  `"left" / "top" / "bottom" / "left-DockTab"`。

---

## 六、文件清单

| 文件 | 作用 |
|------|------|
| `ZhiJuHuiNao.csproj` | VS 项目文件（引用 BIMBase SDK + WebView2） |
| `App.cs` | `IExternalApplication`：注册 Ribbon 按钮 |
| `OpenPanelCommand.cs` | `IBPFunctionCommand`：打开/隐藏停靠面板 |
| `WebPanelControl.cs` | WinForms 控件：承载 WebView2 加载网站 |
| `智居慧脑.plugin` | C# 插件清单（部署用） |
| `README.md` | 本说明 |
