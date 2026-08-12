import type { EnergyState } from "@/lib/types";

const NODES = {
  solar: { x: 70, y: 50, label: "屋顶光伏", color: "var(--warn)" },
  grid: { x: 330, y: 50, label: "市电系统", color: "var(--text-dim)" },
  load: { x: 200, y: 130, label: "家庭负载", color: "var(--ai)" },
  storage: { x: 70, y: 210, label: "家庭储能", color: "var(--energy)" },
  ev: { x: 330, y: 210, label: "电动汽车", color: "var(--energy)" },
};

function Flow({ from, to, active, label }: { from: keyof typeof NODES; to: keyof typeof NODES; active: boolean; label?: string }) {
  const a = NODES[from], b = NODES[to];
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const path = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  const color = "var(--ai)";
  return (
    <g>
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        stroke={active ? color : "var(--border)"} strokeWidth={active ? 2.5 : 1.5}
        className={active ? "flow-line" : ""} opacity={active ? 0.9 : 0.4} />
      {/* 沿线流动的光点粒子，表现能源在流动 */}
      {active && (
        <circle className="flow-particle" r="3.4" fill={color}>
          <animateMotion dur="1.5s" repeatCount="indefinite" path={path} />
        </circle>
      )}
      {label && <text x={mx} y={my - 4} fontSize="10" textAnchor="middle" fill="var(--text-dim)">{label}</text>}
    </g>
  );
}

export default function EnergyFlow({ e }: { e: EnergyState }) {
  const solarToLoad = e.solarKw > 0.1;
  const solarToStore = e.chargeKw > 0.1 && e.socPct < 100;
  const gridImport = e.gridKw > 0.1;
  const gridExport = e.gridKw < -0.1;
  const loadToEv = e.evKw > 0.1;
  const storeToLoad = e.socPct > 10 && e.solarKw < e.loadKw * 0.5;

  return (
    <svg viewBox="0 0 400 260" width="100%" style={{ maxHeight: 300, display: "block" }}>
      <Flow from="solar" to="load" active={solarToLoad} label={solarToLoad ? `${e.solarKw.toFixed(1)}kW` : ""} />
      <Flow from="solar" to="storage" active={solarToStore} label={solarToStore ? `充 ${e.chargeKw.toFixed(1)}` : ""} />
      <Flow from="grid" to="load" active={gridImport} label={gridImport ? `购 ${e.gridKw.toFixed(1)}` : gridExport ? `售 ${Math.abs(e.gridKw).toFixed(1)}` : ""} />
      <Flow from="load" to="ev" active={loadToEv} label={loadToEv ? `充 ${e.evKw.toFixed(1)}` : ""} />
      <Flow from="storage" to="load" active={storeToLoad} label={storeToLoad ? `放 ${e.chargeKw.toFixed(1)}` : ""} />

      {(Object.keys(NODES) as (keyof typeof NODES)[]).map((k) => {
        const n = NODES[k];
        return (
          <g key={k}>
            <rect x={n.x - 42} y={n.y - 22} width="84" height="44" rx="10"
              fill="var(--card)" stroke="var(--border)" />
            <circle cx={n.x - 28} cy={n.y} r="5" fill={n.color} className="pulse" />
            <text x={n.x - 18} y={n.y + 4} fontSize="11" fontWeight="600" fill="var(--text)">{n.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
