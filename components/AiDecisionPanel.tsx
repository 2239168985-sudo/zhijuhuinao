"use client";

import { useEffect, useState } from "react";
import ScenarioSwitcher from "@/components/ScenarioSwitcher";
import PlanCard from "@/components/PlanCard";
import PageHeader from "@/components/PageHeader";
import type { Plan } from "@/lib/types";

export default function AiDecisionPanel({
  active,
  onSelect,
  idText,
  judgment,
  plans,
}: {
  active: string;
  onSelect: (id: string) => void;
  idText: string;
  judgment: string;
  plans: Plan[];
}) {
  const [loading, setLoading] = useState(false);

  // 场景切换时，短暂呈现“AI 分析中”，再展示研判结果
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <section className="home-section">
      <PageHeader
        eyebrow="AI Core"
        title="AI 智能中枢"
        accent="智能"
        sub="选择家庭场景，查看 AI 对当前情境的识别、判断与自动执行方案。"
      />

      {/* 场景选择器：作为 AI 的上下文输入 */}
      <div className="card card-pad flex flex-col gap-3">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>当前场景</h3>
        <ScenarioSwitcher active={active} onSelect={onSelect} />
      </div>

      {/* AI 判断与执行：核心输出，视觉上加左侧渐变 accent */}
      <div className={`card card-pad-lg ai-core-card ${!loading ? "ai-analyzed" : ""}`}>
        <div className="page-head mb-3">
          <span className="eyebrow" style={{ color: "var(--ai)" }}>Decision &amp; Action</span>
          <h2 className="section-title">AI 判断与执行</h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 mb-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold" style={{ color: "var(--text-faint)" }}>当前识别</span>
            <p className="text-sm">
              <span className="chip chip-ai">当前识别</span>
              <span style={{ color: "var(--text)", marginLeft: 8 }}>{idText}</span>
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold" style={{ color: "var(--text-faint)" }}>AI 判断</span>
            <p className="text-sm">
              <span className="chip">AI 判断</span>
              <span style={{ color: "var(--text-dim)", marginLeft: 8 }}>{judgment}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="ai-thinking py-6 justify-center"><span className="ai-spinner" /> AI 正在分析当前场景…</div>
          ) : (
            <>
              {plans.map((p) => (
                <PlanCard key={p.id} plan={p} />
              ))}
              {plans.length === 0 && (
                <span className="text-sm" style={{ color: "var(--text-faint)" }}>
                  当前场景无执行方案。
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
