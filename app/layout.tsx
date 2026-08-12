import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import NavBar from "@/components/NavBar";
import PremiumBackground from "@/components/PremiumBackground";
import ScrollProgress from "@/components/ScrollProgress";

export const metadata: Metadata = {
  title: "智居慧脑 · 差异化居家智能体",
  description:
    "服务一栋三层现代别墅的 AI 居家智能体：识别家庭成员、理解行为与空间，主动生成并协调执行差异化居住方案。",
};

const themeScript = `(function(){try{var t=localStorage.getItem('zhj-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <PremiumBackground />
          <ScrollProgress />
          <NavBar />
          <main className="container-wide pt-6 pb-24 page-stagger">{children}</main>
          <footer className="border-t" style={{ borderColor: "var(--border)" }}>
            <div
              className="container-wide py-8 text-center text-xs"
              style={{ color: "var(--text-faint)" }}
            >
              智居慧脑 · 差异化居家智能体 · 演示平台
              <span style={{ margin: "0 8px", opacity: 0.4 }}>|</span>
              本地数据 · AI 规则引擎驱动
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
