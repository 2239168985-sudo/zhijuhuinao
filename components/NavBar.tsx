"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

const NAV = [
  { href: "/", label: "家庭总览" },
  { href: "/members.html", label: "家庭成员" },
  { href: "/butler.html", label: "AI居家管家" },
  { href: "/spaces.html", label: "空间与设备" },
  { href: "/scenes.html", label: "智能场景" },
  { href: "/safety.html", label: "安全健康" },
  { href: "/energy.html", label: "能源中心" },
  { href: "/components.html", label: "构件库" },
  { href: "/settings.html", label: "系统设置" },
];

export default function NavBar() {
  const path = usePathname();
  const { theme, toggle } = useTheme();
  // GitHub Pages 子路径部署：usePathname 会带 /zhijuhuinao 前缀，
  // 做高亮匹配时需要先剥掉 basePath。
  const routePath = (path || "").replace(/^\/zhijuhuinao/, "") || "/";

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "none",
        boxShadow: "0 0 0 1px var(--border), 0 8px 28px rgba(20,24,33,0.06)",
      }}
    >
      <div className="container-wide flex items-center gap-4 h-14">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className="grid place-items-center w-8 h-8 rounded-lg text-white font-bold"
            style={{
              background: "linear-gradient(135deg, var(--ai), var(--energy))",
              boxShadow: "0 0 16px var(--ai-soft)",
            }}
          >
            智
          </span>
          <span className="font-bold tracking-tight" style={{ color: "var(--text)" }}>
            智居慧脑
          </span>
        </Link>

        <nav className="flex-1 overflow-x-auto hidden md:flex items-center gap-1">
          {NAV.map((n) => {
            const active = n.href === "/" ? routePath === "/" : routePath.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
                style={{
                  color: active ? "var(--ai)" : "var(--text-dim)",
                  background: active ? "var(--ai-soft)" : "transparent",
                }}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={toggle}
          className="btn btn-ghost btn-sm shrink-0"
          aria-label="切换深浅色"
          title="切换深浅色"
        >
          {theme === "light" ? "🌙 深色" : "☀️ 浅色"}
        </button>
      </div>

      {/* 移动端横向导航 */}
      <nav className="md:hidden flex gap-1 overflow-x-auto px-4 pb-2">
        {NAV.map((n) => {
          const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap"
              style={{
                color: active ? "var(--ai)" : "var(--text-dim)",
                background: active ? "var(--ai-soft)" : "transparent",
              }}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
