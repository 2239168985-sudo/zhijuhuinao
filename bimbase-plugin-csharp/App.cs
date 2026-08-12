using System;
using BIMBaseCS.ApplicationService;
using BIMBaseCS.UI;

namespace ZhiJuHuiNaoEmbed
{
    /// <summary>
    /// 外部应用入口：BIMBase 启动时注册一个 Ribbon 分类与按钮，
    /// 点击按钮执行 ZhiJuHuiNaoPanel 命令打开内嵌面板。
    /// </summary>
    public class App : IExternalApplication
    {
        public override void onStartup(BPUIApplication uiApp)
        {
            // 新增 Ribbon 分类「智居慧脑」
            BIMBaseCS.UI.tagsize size = new BIMBaseCS.UI.tagsize();
            size.cx = 32;
            size.cy = 32;
            BPUIApplication.singleton().uiManager.uiRibbonPanel
                .ribbonAddCategory("智居慧脑", 16, 16, size, size, -1);

            // 在分类下新增面板「内嵌面板」
            IntPtr panelIcon = IntPtr.Zero;
            BPUIApplication.singleton().uiManager.uiRibbonPanel
                .ribbonAddPanel("智居慧脑", "内嵌面板", panelIcon, 1, -1);

            // 面板里加按钮：点击执行命令 ZhiJuHuiNaoPanel
            BPUIApplication.singleton().uiManager.uiRibbonPanel
                .ribbonAddButton("智居慧脑", "内嵌面板", "打开网站面板", "ZhiJuHuiNaoPanel", panelIcon);

            base.onStartup(uiApp);
        }

        public override void onShutdown(BPUIApplication uiApp)
        {
            base.onShutdown(uiApp);
        }
    }
}
