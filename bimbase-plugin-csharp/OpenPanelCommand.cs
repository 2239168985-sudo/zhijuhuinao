using BIMBaseCS.ApplicationService;
using BIMBaseCS.Attributes;
using BIMBaseCS.Core;

namespace ZhiJuHuiNaoEmbed
{
    /// <summary>
    /// 外部命令：在 BIMBase 内打开/隐藏「智居慧脑」停靠面板。
    /// 命令名 ZhiJuHuiNaoPanel 既可在 Ribbon 按钮触发，也可在 BIMBase 命令行直接输入。
    /// </summary>
    [BPExternalCommandAttribute(name = "ZhiJuHuiNaoPanel")]
    public class OpenPanelCommand : IBPFunctionCommand
    {
        // BIMBase 内置停靠槽编号（0/1/2/3… 可换用）
        private const int DockId = 0;

        public override void onExcute(BPCommandContext context)
        {
            // 若该停靠槽尚未放入控件，则创建并嵌入 WebPanelControl
            var existing = BIMBaseNet.UI.BPNewDockManager.getDlg(DockId);
            if (existing == null)
            {
                var panel = new WebPanelControl();
                BIMBaseNet.UI.BPNewDockManager.setDlg(DockId, panel);
                BIMBaseNet.UI.BPNewDockManager.setWindowText(DockId, "智居慧脑 · 构件库");

                // 停靠位置：right(右) / left(左) / top(上) / bottom(下) / left-DockTab(左侧页签)
                BIMBaseNet.UI.BPNewDockManager.SetDockPosition(DockId, "right");
            }

            // 再次点击 = 隐藏；已隐藏 = 显示（toggle）
            bool visible = BIMBaseNet.UI.BPNewDockManager.getDlgVisible(DockId);
            BIMBaseNet.UI.BPNewDockManager.ShowDockContainer(DockId, !visible);

            base.onExcute(context);
        }
    }
}
