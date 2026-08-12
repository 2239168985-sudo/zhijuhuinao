"use client";

/* 环境光层：三个缓慢浮动的渐变光球 + 细微噪点，
   为整站深色背景注入纵深与"呼吸感"，避免死黑单调。 */
export default function AmbientBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />
      <div className="noise-overlay" />
    </div>
  );
}
