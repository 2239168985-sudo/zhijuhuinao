import { SAFETY } from "@/lib/data";
import type { Risk } from "@/lib/types";
import PageHeader from "@/components/PageHeader";

const RISK_LABEL: Record<Risk, string> = { normal: "正常", attention: "关注", warning: "警告", emergency: "紧急" };
const RISK_CLS: Record<Risk, string> = { normal: "chip-energy", attention: "chip-ai", warning: "chip-warn", emergency: "chip-danger" };

const MONITORS: { label: string; ok: boolean; note: string }[] = [
  { label: "门锁状态", ok: SAFETY.lock === "locked", note: SAFETY.lock === "locked" ? "已闭锁" : "未闭锁" },
  { label: "门窗状态", ok: SAFETY.doorWindow === "normal", note: SAFETY.doorWindow === "normal" ? "正常" : "异常" },
  { label: "燃气状态", ok: SAFETY.gas === "normal", note: SAFETY.gas === "normal" ? "正常" : "泄漏" },
  { label: "烟雾报警", ok: SAFETY.smoke === "normal", note: SAFETY.smoke === "normal" ? "正常" : "报警" },
  { label: "水浸报警", ok: SAFETY.water === "normal", note: SAFETY.water === "normal" ? "正常" : "漏水" },
  { label: "空气质量异常", ok: !SAFETY.airAnomaly, note: SAFETY.airAnomaly ? "异常" : "正常" },
  { label: "老人夜间活动", ok: !SAFETY.elderNight, note: SAFETY.elderNight ? "监测中" : "无" },
  { label: "儿童危险区域", ok: !SAFETY.childDanger, note: SAFETY.childDanger ? "告警" : "安全" },
  { label: "长时间无活动", ok: !SAFETY.noActivity, note: SAFETY.noActivity ? "告警" : "正常" },
  { label: "异常离床", ok: !SAFETY.abnormalBed, note: SAFETY.abnormalBed ? "告警" : "正常" },
  { label: "紧急呼叫", ok: !SAFETY.sos, note: SAFETY.sos ? "已触发" : "未触发" },
  { label: "储能应急", ok: SAFETY.storage === "ok", note: SAFETY.storage === "ok" ? "充足" : "偏低" },
];

const LEVELS: Risk[] = ["normal", "attention", "warning", "emergency"];

export default function SafetyPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader eyebrow="Safety & Health" title="安全健康" accent="健康" sub="集中呈现门锁、门窗、燃气、烟感、水浸与人员活动监测；风险分四级管理，病患与康复仅提供环境调节与提醒，不提供医疗诊断。" />

      <div className="card card-pad-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title" style={{ fontSize: 18 }}>全屋风险等级</h2>
          <span className={`chip ${RISK_CLS[SAFETY.risk]}`}>{RISK_LABEL[SAFETY.risk]}</span>
        </div>
        <div className="risk-bar mb-2">
          <div className={`risk-fill risk-${SAFETY.risk}`} style={{ width: `${(LEVELS.indexOf(SAFETY.risk) + 1) * 25}%` }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: "var(--text-faint)" }}>
          {LEVELS.map((l) => <span key={l}>{RISK_LABEL[l]}</span>)}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MONITORS.map((m) => (
          <div key={m.label} className="card card-pad flex items-center justify-between">
            <span className="text-sm" style={{ color: "var(--text)" }}>{m.label}</span>
            <span className={`chip ${m.ok ? "chip-energy" : "chip-danger"}`}>{m.note}</span>
          </div>
        ))}
      </div>

      <div className="card card-pad-lg" style={{ borderColor: "var(--border)" }}>
        <h3 className="font-semibold mb-1" style={{ color: "var(--text)" }}>病患与康复人员功能边界</h3>
        <p className="text-sm" style={{ color: "var(--text-dim)" }}>
          仅提供：环境调整、休息提醒、照护提醒、紧急联系。<b>不提供任何医疗诊断结论。</b>
        </p>
      </div>
    </div>
  );
}
