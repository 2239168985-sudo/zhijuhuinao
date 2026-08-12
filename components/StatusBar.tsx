import type { EnergyState, SafetyState, Risk } from "@/lib/types";
import AnimatedCounter from "./AnimatedCounter";

const RISK_LABEL: Record<Risk, string> = { normal: "正常", attention: "关注", warning: "警告", emergency: "紧急" };
const RISK_CLS: Record<Risk, string> = { normal: "chip-energy", attention: "chip-ai", warning: "chip-warn", emergency: "chip-danger" };

export default function StatusBar({
  energy, safety, atHome, aiStatus = "运行中",
}: {
  energy: EnergyState; safety: SafetyState; atHome: number; aiStatus?: string;
}) {
  const tiles: { label: string; value: string; unit?: string; chip?: string; num?: number; decimals?: number }[] = [
    { label: "家庭模式", value: "居家", unit: "" },
    { label: "在家人数", value: String(atHome), unit: "人", num: atHome },
    { label: "AI中枢", value: aiStatus, unit: "" },
    { label: "全屋安全", value: RISK_LABEL[safety.risk], unit: "", chip: RISK_CLS[safety.risk] },
    { label: "综合舒适度", value: "优", unit: "" },
    { label: "总用电", value: "", unit: "kW", num: energy.loadKw, decimals: 1 },
    { label: "光伏发电", value: "", unit: "kW", num: energy.solarKw, decimals: 1 },
    { label: "家庭储能", value: "", unit: "%", num: energy.socPct },
    { label: "市电", value: energy.gridKw >= 0 ? `购 ${energy.gridKw.toFixed(1)}` : `售 ${Math.abs(energy.gridKw).toFixed(1)}`, unit: "kW" },
  ];
  return (
    <div className="card card-pad grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))" }}>
      {tiles.map((t, i) => (
        <div key={i} className="stat-tile">
          <span className="stat-label">{t.label}</span>
          <span className="flex items-center gap-1">
            {t.chip ? (
              <span className={`chip ${t.chip}`}>{t.value}</span>
            ) : t.num !== undefined ? (
              <span className="stat-value" style={{ color: "var(--text)" }}>
                <AnimatedCounter value={t.num} decimals={t.decimals ?? 0} />{t.unit}
              </span>
            ) : (
              <span className="stat-value" style={{ color: "var(--text)" }}>{t.value}</span>
            )}
            {t.unit && !t.chip && t.num === undefined && <span className="stat-unit">{t.unit}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}
