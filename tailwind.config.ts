import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0e17",
          secondary: "#111827",
          tertiary: "#1a2235",
          card: "rgba(255,255,255,0.04)",
        },
        fg: {
          primary: "#f0f0f0",
          secondary: "#9ca3af",
          tertiary: "#6b7280",
        },
        accent: {
          gold: "#d4a853",
          cyan: "#34d399",
          blue: "#60a5fa",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          light: "rgba(255,255,255,0.05)",
          gold: "rgba(212,168,83,0.25)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system", "BlinkMacSystemFont", "Segoe UI", "PingFang SC",
          "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue",
          "Helvetica", "Arial", "sans-serif",
        ],
      },
      fontSize: {
        "hero": ["clamp(36px, 7vw, 72px)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "800" }],
        "hero-sub": ["clamp(16px, 2vw, 20px)", { lineHeight: "1.8", fontWeight: "400" }],
        "section": ["clamp(24px, 4vw, 42px)", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.2)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.3)",
        "card-active": "0 16px 48px rgba(0,0,0,0.4)",
        glow: "0 0 20px rgba(212,168,83,0.15)",
        "glow-lg": "0 0 40px rgba(212,168,83,0.25)",
      },
      spacing: {
        section: "clamp(60px, 10vh, 120px)",
      },
      animation: {
        "fade-up": "fadeInUp 0.7s ease-out both",
        "scale-in": "scaleIn 0.6s ease-out both",
        "float": "floatSlow 5s ease-in-out infinite",
        "glow": "glowPulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
