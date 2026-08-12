using System;
using System.Diagnostics;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace ZhiJuHuiNaoEmbed
{
    /// <summary>
    /// 承载 WebView2 的 WinForms 用户控件。
    /// 通过 BPNewDockManager 嵌入 BIMBase 可停靠面板后，它会在 BIMBase 内部显示网站，
    /// 而不是弹出外部浏览器。
    /// </summary>
    public class WebPanelControl : UserControl
    {
        // 要内嵌打开的网站地址（与线上部署一致）
        private const string SiteUrl = "https://2239168985-sudo.github.io/zhijuhuinao";

        private WebView2 _webView;
        private Label _fallback;

        public WebPanelControl()
        {
            InitializeComponent();
            this.Load += WebPanelControl_Load;
        }

        private void InitializeComponent()
        {
            _webView = new WebView2
            {
                Dock = DockStyle.Fill,
                // 首次创建控件时 CoreWebView2 尚未就绪，需异步初始化
            };

            _fallback = new Label
            {
                Dock = DockStyle.Fill,
                Text = "正在加载「智居慧脑」…\n若长时间无内容，请确认已安装 WebView2 Runtime。",
                TextAlign = System.Drawing.ContentAlignment.MiddleCenter
            };

            this.Controls.Add(_webView);
        }

        private async void WebPanelControl_Load(object sender, EventArgs e)
        {
            try
            {
                // 初始化 WebView2（会查找本机已安装的 WebView2 Runtime）
                await _webView.EnsureCoreWebView2Async(null);

                // 站内链接在同一面板内打开，避免弹出新窗口
                _webView.CoreWebView2.NewWindowRequested += (s, ev) =>
                {
                    ev.Handled = true;
                    _webView.CoreWebView2.Navigate(ev.Uri);
                };

                _webView.CoreWebView2.Navigate(SiteUrl);
            }
            catch (Exception ex)
            {
                // 常见原因：未安装 WebView2 Runtime
                _webView.Visible = false;
                _fallback.Text = "无法加载内嵌浏览器：\n" + ex.Message +
                                 "\n\n请安装 WebView2 Runtime，或使用下方按钮在外部浏览器打开。";
                this.Controls.Add(_fallback);

                var btn = new Button
                {
                    Text = "在浏览器打开网站",
                    Dock = DockStyle.Bottom,
                    Height = 36
                };
                btn.Click += (s, ev) => Process.Start(new ProcessStartInfo(SiteUrl) { UseShellExecute = true });
                this.Controls.Add(btn);
            }
        }
    }
}
