"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";

export default function MagneticButton({
  children, className = "", strength = 0.28, href, onClick, type = "button",
}: {
  children: ReactNode; className?: string; strength?: number;
  href?: string; onClick?: () => void; type?: "button" | "submit";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  const inner = href ? (
    href.startsWith("/") ? <Link href={href} className={className} onClick={onClick}>{children}</Link>
      : <a href={href} className={className} onClick={onClick}>{children}</a>
  ) : (
    <button type={type} className={className} onClick={onClick}>{children}</button>
  );
  return (
    <div ref={ref} className="magnetic" onMouseMove={onMove} onMouseLeave={onLeave} style={{ display: "inline-flex" }}>
      {inner}
    </div>
  );
}
