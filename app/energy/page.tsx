"use client";

import { useState } from "react";
import { SCENARIOS, scenarioById, evaluate } from "@/lib/engine";
import EnergyFlow from "@/components/EnergyFlow";
import PlanCard from "@/components/PlanCard";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

const MODES = ["自发自用优先", "节能运行", "储能优先", "电动车优先", "停电保障", "手动控制"];
const SCHED_LOGIC = [
  "光伏发电充足时优先满足家庭负载",
  "余电优先进入家庭储能",
  "储能充足后提高电动车充电功率",
  "夜间用电高峰优先使用储能",
  "高耗能设备尽量安排在光伏较强时运行",
  "停电时优先保障重要负载（门锁、中枢、网络、冰箱、应急照明及必要照护设备）",
  "根据家庭总负载动态限制充电桩功率",
];

export default function EnergyPage() {
  const [active, setActive] = useState("c6");
  const scen = scenarioById(active);
  const e = scen.ctx.energy;
  const plans = evaluate(scen.ctx).filter((p) => p.domain === "energy");

  return (
    <div className="flex flex-col gap-5">
      <PageHeader eyebrow="Energy" title="能源中心" accent="能源" sub="体现庭院与住宅的能源自洽能力：屋顶光伏、储能柜、充电桩与市电协同调度。" />

      <Reveal>
        <section className="scene-banner">
          <img src="scene-energy.webp" alt="庭院光伏车库与储能设备区" />
          <div className="scene-banner__cap">
            <span className="eyebrow">绿色能源</span>
            <span>屋顶光伏 · 储能柜 · 充电桩协同调度</span>
          </div>
        </section>
      </Reveal>

      <div className="flex flex-wrap gap-2">
        {SCENARIOS.filter((s) => ["c6", "c7", "c8", "live"].includes(s.id)).map((s) => (
          <button key={s.id} onClick={() => setActive(s.id)} className="btn btn-sm"
            style={{ background: s.id === active ? "var(--warn)" : "transparent", color: s.id === active ? "#fff" : "var(--text-dim)", borderColor: s.id === active ? "var(--warn)" : "var(--border)" }}>
            {s.title}
          </button>
        ))}
      </div>

      <div className="card card-pad-lg">
        <div className="flex items-center justify-between mb-2">
          <h2 className="section-title" style={{ fontSize: 18 }}>动态能源流向</h2>
          <span className="chip chip-warn">{e.mode}</span>
        </div>
        <EnergyFlow e={e} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-sm">
          <Tile label="当前光伏" v={`${e.solarKw.toFixed(1)} kW`} />
          <Tile label="家庭负载" v={`${e.loadKw.toFixed(1)} kW`} />
          <Tile label="储能电量" v={`${e.socPct} %`} />
          <Tile label="充电桩" v={`${e.evKw.toFixed(1)} kW`} />
          <Tile label="今日发电" v={`${e.todayGenKwh} kWh`} />
          <Tile label="今日用电" v={`${e.todayUseKwh} kWh`} />
          <Tile label="自发自用" v={`${e.selfUsePct} %`} />
          <Tile label="可续航" v={`${e.sustainH} h`} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card card-pad-lg">
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>能源模式</h3>
          <div className="flex flex-wrap gap-2">
            {MODES.map((m) => (
              <span key={m} className="chip" style={{ borderColor: m === e.mode ? "var(--warn)" : "var(--border)", color: m === e.mode ? "var(--warn)" : "var(--text-dim)" }}>{m}</span>
            ))}
          </div>
          <h3 className="text-sm font-semibold mt-4 mb-2" style={{ color: "var(--text)" }}>AI 能源调度逻辑</h3>
          <ol className="text-sm flex flex-col gap-1.5" style={{ color: "var(--text-dim)" }}>
            {SCHED_LOGIC.map((l, i) => <li key={i}>{i + 1}. {l}</li>)}
          </ol>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>调度方案</h3>
          {plans.length === 0 && <span className="text-sm" style={{ color: "var(--text-faint)" }}>当前场景无特殊调度。</span>}
          {plans.map((p) => <PlanCard key={p.id} plan={p} />)}
        </div>
      </div>
    </div>
  );
}

function Tile({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: "var(--card-2)" }}>
      <div className="text-xs" style={{ color: "var(--text-faint)" }}>{label}</div>
      <div className="stat-value text-lg mono" style={{ color: "var(--text)" }}>{v}</div>
    </div>
  );
}
