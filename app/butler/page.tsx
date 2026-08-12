"use client";

import { useState, useEffect, useRef } from "react";
import { SCENARIOS, scenarioById, evaluate } from "@/lib/engine";
import { behaviorLabel, roomName } from "@/lib/data";
import ScenarioSwitcher from "@/components/ScenarioSwitcher";
import PlanCard from "@/components/PlanCard";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import MagneticButton from "@/components/MagneticButton";

function matchInput(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("学习")) return "c2";
  if (t.includes("待客") || t.includes("客人")) return "c3";
  if (t.includes("休养") || t.includes("病患")) return "c4";
  if (t.includes("轮椅") || t.includes("回家")) return "c5";
  if (t.includes("光伏") || t.includes("发电")) return "c6";
  if (t.includes("停电")) return "c7";
  if (t.includes("充电") || t.includes("电动车")) return "c8";
  if (t.includes("老人") || t.includes("夜间") || t.includes("离床")) return "c1";
  return "live";
}

const QUICK_PROMPTS = [
  "孩子准备学习两小时",
  "有客人来家里做客",
  "老人今晚需要重点照护",
  "突然停电了，优先保障老人房和网络",
  "光伏发电好，多用绿电",
];

export default function ButlerPage() {
  const [active, setActive] = useState("live");
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleGenerate = (raw?: string) => {
    if (thinking) return;
    const text = (raw ?? input).trim();
    setThinking(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const id = matchInput(text || scen.title);
      setActive(id);
      if (text) setInput(text);
      setThinking(false);
    }, 900);
  };

  const scen = scenarioById(active);
  const ctx = scen.ctx;
  const plans = evaluate(ctx);

  const m = ctx.member;
  const judgment = m
    ? `识别到 ${m.name}（${m.age}岁），位于${ctx.floor ? floorName(ctx.floor) : ""}${roomName(ctx.space)}，行为为「${behaviorLabel(ctx.behavior)}」。当前环境照度${ctx.env.lux < 60 ? "偏低" : "适宜"}、${ctx.env.aqi} AQI，${m.mobility !== "full" ? "行动能力受限" : "行动能力正常"}。`
    : "聚焦能源调度：依据光伏发电、负载与储能状态进行绿电优先决策。";
  const riskText = m?.role === "elder" || m?.mobility !== "full"
    ? "行动能力弱，存在跌倒/通行风险，需低位引导照明与通畅路径。" : "常规风险，按舒适与便捷响应。";
  const reason = plans[0]?.actions.map((a) => a.reason).join("；") ?? "未触发特定规则。";

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        eyebrow="AI Butler"
        title="AI 居家管家"
        accent="居家管家"
        sub="不是聊天框，而是「上下文 + AI 分析 + 结构化方案」工作台。输入需求，AI 识别意图并生成可执行的差异化方案。"
      />

      <ScenarioSwitcher active={active} onSelect={(id) => { setInput(""); setActive(id); }} />

      {/* 上下文区 */}
      <div className="card card-pad-lg grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="eyebrow mb-2">当前上下文</h3>
          <ul className="text-sm flex flex-col gap-1.5" style={{ color: "var(--text-dim)" }}>
            <li>当前用户：<b style={{ color: "var(--text)" }}>{m?.name ?? "能源调度"}</b></li>
            <li>身份：{m ? roleName(m.role) : "—"}</li>
            <li>当前行为：{behaviorLabel(ctx.behavior)}</li>
            <li>所在位置：{ctx.floor ? floorName(ctx.floor) : ""}{roomName(ctx.space)}</li>
            <li>当前时间：{ctx.time.hour}:00 {ctx.time.isWeekend ? "周末" : "工作日"}</li>
            <li>室内环境：{ctx.env.tempC}℃ / {ctx.env.humidity}% / {ctx.env.aqi} AQI</li>
            <li>能源：光伏 {ctx.energy.solarKw}kW · 储能 {ctx.energy.socPct}% · {ctx.gridDown ? "已停电" : "市电正常"}</li>
          </ul>
        </div>
        <div>
          <h3 className="eyebrow mb-2">自然语言输入</h3>
          <textarea
            value={input}
            disabled={thinking}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例如：十分钟后我将回家 / 孩子准备学习两小时 / 老人今晚需要重点照护 / 停电后优先保障老人房和家庭网络"
            className="w-full h-24 resize-none"
          />
          {/* 快捷示例：一键填充并触发，降低使用门槛 */}
          <div className="ai-quick mt-2">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                type="button"
                className="btn btn-sm btn-ghost"
                disabled={thinking}
                onClick={() => handleGenerate(q)}
              >
                {q}
              </button>
            ))}
          </div>
          <MagneticButton className="btn btn-primary mt-3" onClick={() => handleGenerate()}>
            {thinking ? <><span className="ai-spinner" /> AI 分析中…</> : "生成方案"}
          </MagneticButton>
          {thinking && (
            <p className="ai-thinking mt-2"><span className="pulse">●</span> AI 正在理解需求并匹配场景…</p>
          )}
        </div>
      </div>

      {/* 结构化研判 */}
      <Reveal>
        <div className={`card card-pad-lg ${!thinking ? "ai-analyzed" : ""}`}>
          <h3 className="section-title mb-3" style={{ fontSize: 18, color: "var(--ai)" }}>AI 结构化研判</h3>
          {thinking ? (
            <div className="ai-thinking py-8 justify-center"><span className="ai-spinner" /> AI 正在生成结构化研判…</div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <Field k="场景判断" v={judgment} />
                <Field k="核心需求" v={m ? `${roleName(m.role)}的${behaviorLabel(ctx.behavior)}需求` : "绿电消纳与负载平衡"} />
                <Field k="潜在风险" v={riskText} />
                <Field k="空间调整" v={plans.flatMap((p) => p.actions.filter((a) => a.type === "scene")).map((a) => a.target + a.op).join("；") || "维持空间现状"} />
                <Field k="灯光与窗帘" v={plans.flatMap((p) => p.actions.filter((a) => a.type === "device" && a.target.includes("灯"))).map((a) => a.target + a.op).join("；") || "维持"} />
                <Field k="温度与空气" v={plans.flatMap((p) => p.actions.filter((a) => a.type === "device" && (a.target.includes("空调") || a.target.includes("空气") || a.target.includes("新风")))).map((a) => a.target + a.op).join("；") || "自动"} />
                <Field k="安全与照护" v={plans.flatMap((p) => p.actions.filter((a) => a.type === "check" || a.type === "notify")).map((a) => a.target + a.op).join("；") || "常规"} />
                <Field k="能源安排" v={plans.flatMap((p) => p.actions.filter((a) => a.type === "energy")).map((a) => a.target + a.op).join("；") || "常态"} />
              </div>
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                <span className="eyebrow">推荐理由</span>
                <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>{reason}</p>
              </div>
            </>
          )}
        </div>
      </Reveal>

      {/* 方案卡 */}
      <Reveal>
        <div className="flex flex-col gap-3">
          <h3 className="section-title" style={{ fontSize: 18 }}>建议方案（可立即执行 / 确认 / 改参数 / 暂存）</h3>
          {thinking ? (
            <div className="ai-thinking py-6 justify-center"><span className="pulse">●</span> AI 正在制定差异化方案…</div>
          ) : (
            plans.map((p) => <PlanCard key={p.id} plan={p} />)
          )}
        </div>
      </Reveal>
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: "var(--card-2)" }}>
      <div className="text-xs mb-1" style={{ color: "var(--ai)" }}>{k}</div>
      <div style={{ color: "var(--text)" }}>{v}</div>
    </div>
  );
}
function floorName(f: string) { return { yard: "庭院", f1: "一层", f2: "二层", f3: "三层" }[f] ?? ""; }
function roleName(r: string) {
  return { elder: "老人", teen: "青少年", child: "儿童", adult: "成人", pregnant: "孕妇", patient: "病患", recovering: "康复", limited: "行动不便", wheelchair: "轮椅", caregiver: "护理", staff: "家政", guest: "访客" }[r] ?? r;
}
