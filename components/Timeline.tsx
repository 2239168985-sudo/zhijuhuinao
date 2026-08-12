export interface TimelineItem {
  t: string;
  who: string;
  text: string;
  cat: "scene" | "care" | "user" | "energy" | "safety";
}
const CAT_COLOR: Record<TimelineItem["cat"], string> = {
  scene: "var(--ai)",
  care: "var(--energy)",
  user: "var(--text-dim)",
  energy: "var(--warn)",
  safety: "var(--danger)",
};

export default function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative pl-5" style={{ borderLeft: "2px solid var(--border)" }}>
      {items.map((it, i) => (
        <li key={i} className="relative pb-4 last:pb-0">
          <span
            className="absolute -left-[7px] top-1 w-3 h-3 rounded-full border-2"
            style={{ background: CAT_COLOR[it.cat], borderColor: "var(--card)" }}
          />
          <div className="flex items-baseline gap-2">
            <span className="mono text-xs" style={{ color: "var(--text-faint)" }}>{it.t}</span>
            <span className="text-xs font-semibold" style={{ color: CAT_COLOR[it.cat] }}>{it.who}</span>
          </div>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--text-dim)" }}>{it.text}</p>
        </li>
      ))}
    </ol>
  );
}
