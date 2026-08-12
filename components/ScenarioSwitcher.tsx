"use client";

import { SCENARIOS } from "@/lib/engine";

export default function ScenarioSwitcher({
  active, onSelect,
}: {
  active: string; onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {SCENARIOS.map((s) => {
        const on = s.id === active;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className="btn btn-sm"
            style={{
              background: on ? "var(--ai)" : "transparent",
              color: on ? "#fff" : "var(--text-dim)",
              borderColor: on ? "var(--ai)" : "var(--border)",
            }}
            title={s.desc}
          >
            {s.title}
          </button>
        );
      })}
    </div>
  );
}
