"use client";

import { useState } from "react";
import { MEMBERS } from "@/lib/data";
import PageHeader from "@/components/PageHeader";

const ROLE_LABEL: Record<string, string> = {
  elder: "老人", teen: "青少年", child: "儿童", adult: "成人", pregnant: "孕妇",
  patient: "病患", recovering: "康复", limited: "行动不便", wheelchair: "轮椅", caregiver: "护理", staff: "家政", guest: "访客",
};

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [autoExec, setAutoExec] = useState(true);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader eyebrow="Settings" title="系统设置" accent="设置" sub="管理 AI 执行权限、家庭成员差异化权限、隐私与应急联系。顶部导航右上角可切换深浅色主题。" />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card card-pad-lg">
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>AI 与隐私</h3>
          <Toggle label="允许 AI 自动执行（成员各自可覆盖）" on={autoExec} setOn={setAutoExec} />
          <Toggle label="家庭隐私模式（本地处理，不上云）" on={true} setOn={() => {}} />
          <Toggle label="异常事件推送通知" on={true} setOn={() => {}} />
          <Toggle label="数据更新频率：实时" on={true} setOn={() => {}} />
        </div>

        <div className="card card-pad-lg">
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>界面主题</h3>
          <div className="flex gap-2">
            <button className="btn btn-sm" style={{ background: theme === "light" ? "var(--ai)" : "transparent", color: theme === "light" ? "#fff" : "var(--text-dim)", borderColor: theme === "light" ? "var(--ai)" : "var(--border)" }} onClick={() => setTheme("light")}>浅色（高端住宅）</button>
            <button className="btn btn-sm" style={{ background: theme === "dark" ? "var(--ai)" : "transparent", color: theme === "dark" ? "#fff" : "var(--text-dim)", borderColor: theme === "dark" ? "var(--ai)" : "var(--border)" }} onClick={() => setTheme("dark")}>深色</button>
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--text-faint)" }}>主题切换也可使用顶部导航右上角按钮，设置会记忆到本地。</p>
        </div>
      </div>

      <div className="card card-pad-lg">
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>家庭成员差异化权限</h3>
        <p className="text-xs mb-3" style={{ color: "var(--text-faint)" }}>不同成员拥有不同操作边界，保障安全与隐私。</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ color: "var(--text-dim)" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="text-left py-2">成员</th>
                <th className="text-left">门锁/燃气</th>
                <th className="text-left">空间权限</th>
                <th className="text-left">特殊能力</th>
              </tr>
            </thead>
            <tbody>
              {MEMBERS.map((m) => (
                <tr key={m.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="py-2" style={{ color: "var(--text)" }}>{m.name}（{ROLE_LABEL[m.role]}）</td>
                  <td>{m.needConfirm.includes("门锁控制") || m.needConfirm.includes("燃气") ? "需确认" : "允许"}</td>
                  <td>{ROLE_LABEL[m.role] === "访客" ? "指定房间" : "全屋"}</td>
                  <td>{m.role === "elder" ? "一键呼叫家人" : m.role === "caregiver" ? "仅看照护状态" : m.role === "child" ? "禁燃气门锁" : "常规"}</td>
                </tr>
              ))}
              <tr>
                <td className="py-2" style={{ color: "var(--text)" }}>访客</td>
                <td>需授权</td><td>指定房间</td><td>临时通行</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card card-pad-lg">
        <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>紧急联系人</h3>
        <ul className="text-sm flex flex-col gap-1" style={{ color: "var(--text-dim)" }}>
          <li>家属紧急呼叫：爸爸 / 妈妈（一键触达）</li>
          <li>社区医护：签约家庭医生</li>
          <li>物业与安保：24h 值班</li>
        </ul>
      </div>
    </div>
  );
}

function Toggle({ label, on, setOn }: { label: string; on: boolean; setOn: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border)" }}>
      <span className="text-sm" style={{ color: "var(--text)" }}>{label}</span>
      <button onClick={() => setOn(!on)} className="btn btn-sm"
        style={{ background: on ? "var(--energy)" : "transparent", color: on ? "#fff" : "var(--text-dim)", borderColor: on ? "var(--energy)" : "var(--border)" }}>
        {on ? "开" : "关"}
      </button>
    </div>
  );
}
