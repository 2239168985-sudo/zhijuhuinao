"use client";

import { useState } from "react";
import { MEMBERS, BEHAVIORS } from "@/lib/data";
import PersonaAvatar from "@/components/PersonaAvatar";
import type { Activity } from "@/lib/types";
import PageHeader from "@/components/PageHeader";

const ROLE_LABEL: Record<string, string> = {
  elder: "老人", teen: "青少年", child: "儿童", adult: "成人", pregnant: "孕妇",
  patient: "病患", recovering: "康复", limited: "行动不便", wheelchair: "轮椅", caregiver: "护理", staff: "家政", guest: "访客",
};
const ACTIVITIES: { id: Activity; label: string }[] = [
  { id: "home", label: "在家" }, { id: "active", label: "活动中" },
  { id: "rest", label: "休息" }, { id: "sleep", label: "睡眠" }, { id: "out", label: "外出" },
];

export default function MembersPage() {
  const [sel, setSel] = useState(MEMBERS[0].id);
  const [behavior, setBehavior] = useState(MEMBERS[0].behaviors[0]);
  const [activity, setActivity] = useState<Activity>("home");
  const m = MEMBERS.find((x) => x.id === sel)!;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader eyebrow="Family Profile" title="家庭成员" accent="成员" sub="建立家庭数字画像，选择不同身份、行为与状态，右侧人物数字形象将同步变化。" />

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-3">
          {MEMBERS.map((mem) => (
            <button key={mem.id} onClick={() => { setSel(mem.id); setBehavior(mem.behaviors[0]); setActivity("home"); }}
              className="card card-pad text-left flex items-center gap-3"
              style={{ borderColor: mem.id === sel ? "var(--ai)" : "var(--border)" }}>
              <PersonaAvatar role={mem.role} activity="home" size={48} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold" style={{ color: "var(--text)" }}>{mem.name}</span>
                  <span className="chip">{ROLE_LABEL[mem.role]}</span>
                </div>
                <div className="text-xs" style={{ color: "var(--text-dim)" }}>{mem.relation} · {mem.age}岁 · 行动力 {mem.mobility}</div>
              </div>
            </button>
          ))}

          <div className="card card-pad">
            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>行为库（{BEHAVIORS.length} 种）</h3>
            <div className="flex flex-wrap gap-2">
              {BEHAVIORS.map((b) => (
                <button key={b.id} onClick={() => setBehavior(b.id)}
                  className="chip" style={{ borderColor: b.id === behavior ? "var(--ai)" : "var(--border)", color: b.id === behavior ? "var(--ai)" : "var(--text-dim)" }}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card card-pad-lg flex flex-col items-center gap-3" style={{ alignSelf: "start" }}>
          <span className="eyebrow">人物数字形象预览</span>
          <PersonaAvatar role={m.role} activity={activity} size={150} />
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: "var(--text)" }}>{m.name}</div>
            <div className="text-sm" style={{ color: "var(--text-dim)" }}>{ROLE_LABEL[m.role]} · {m.relation}</div>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {ACTIVITIES.map((a) => (
              <button key={a.id} onClick={() => setActivity(a.id)} className="btn btn-sm btn-ghost"
                style={{ borderColor: a.id === activity ? "var(--ai)" : "var(--border)", color: a.id === activity ? "var(--ai)" : "var(--text-dim)" }}>
                {a.label}
              </button>
            ))}
          </div>
          <div className="w-full mt-2 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <dl className="text-sm flex flex-col gap-1.5">
              <Row k="灯光偏好" v={m.lightPref} />
              <Row k="温度偏好" v={`${m.tempPref}℃`} />
              <Row k="空气偏好" v={m.airPref} />
              <Row k="睡眠习惯" v={m.sleepHabit} />
              <Row k="安全需求" v={m.safetyNeed} />
              <Row k="照护需求" v={m.careNeed} />
              <Row k="AI 自动执行" v={m.allowAuto ? "允许" : "需确认"} />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt style={{ color: "var(--text-faint)" }}>{k}</dt>
      <dd style={{ color: "var(--text)", textAlign: "right" }}>{v}</dd>
    </div>
  );
}
