"use client";

import { useState } from "react";
import type { Plan } from "@/lib/types";

const DOMAIN = {
  behavior: { label: "行为方案", cls: "chip-ai", line: "var(--ai)" },
  safety: { label: "安全方案", cls: "chip-danger", line: "var(--danger)" },
  energy: { label: "能源方案", cls: "chip-warn", line: "var(--energy)" },
} as const;

type Status = "pending" | "executed" | "confirm" | "modified" | "skipped" | "saved";

export default function PlanCard({ plan, variant = "card" }: { plan: Plan; variant?: "card" | "flat" }) {
  const [status, setStatus] = useState<Status>("pending");
  const flat = variant === "flat";

  return (
    <div
      className={flat ? "plan-card plan-card--flat" : "card card-pad"}
      style={{
        borderColor: status === "executed" ? "var(--energy)" : "var(--border)",
        opacity: status === "skipped" ? 0.6 : 1,
        ["--plan-line" as string]: DOMAIN[plan.domain].line,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`chip ${DOMAIN[plan.domain].cls}`}>{DOMAIN[plan.domain].label}</span>
          <span className="font-semibold text-[14px]" style={{ color: "var(--text)" }}>{plan.title}</span>
        </div>
        {status !== "pending" && (
          <span className="text-xs" style={{ color: "var(--text-faint)" }}>
            {status === "executed" && "✓ 已执行"}
            {status === "confirm" && "⏳ 待确认"}
            {status === "modified" && "✎ 已改参数"}
            {status === "skipped" && "⊘ 暂不执行"}
            {status === "saved" && "☆ 已存为习惯"}
          </span>
        )}
      </div>

      <ul className={`flex flex-col mb-2 ${flat ? "plan-card__list" : "gap-2"}`}>
        {plan.actions.map((a, i) => (
          <li key={i} className="flex gap-2 items-start py-1.5">
            <span className="dot dot-ai mt-1.5 shrink-0" />
            <div>
              <div className="text-[13px]" style={{ color: "var(--text)" }}>
                <b>{a.target}</b> · {a.op}
              </div>
              <div className="text-[12px]" style={{ color: "var(--text-faint)" }}>理由：{a.reason}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className={`flex flex-wrap gap-2 ${flat ? "plan-card__actions" : "pt-2"}`} style={flat ? undefined : { borderTop: "1px solid var(--border)" }}>
        <button className={flat ? "btn btn-text btn-sm" : "btn btn-primary btn-sm"} onClick={() => setStatus("executed")}>立即执行</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setStatus("confirm")}>需要确认</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setStatus("modified")}>修改参数</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setStatus("skipped")}>暂不执行</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setStatus("saved")}>保存为习惯</button>
      </div>
    </div>
  );
}
