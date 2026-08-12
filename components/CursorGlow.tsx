"use client";

import { useEffect, useRef } from "react";

/* 鼠标跟随光晕：高端深色站的标志性交互。
   跟随光标渲染一圈径向渐变，离开视口时淡出。 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // 触屏跳过
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // 降级跳过

    let raf = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          el.style.background = `radial-gradient(500px circle at ${tx}px ${ty}px, rgba(212,168,83,0.07), rgba(52,211,153,0.04) 25%, transparent 45%)`;
          raf = 0;
        });
      }
    };
    const onLeave = () => {
      el.style.background = "transparent";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
