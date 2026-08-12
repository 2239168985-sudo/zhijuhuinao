"use client";

import { useState } from "react";
import { SPACES, deviceByRoom, behaviorLabel } from "@/lib/data";
import type { Floor, Room } from "@/lib/types";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export default function SpacesPage() {
  const [floor, setFloor] = useState<Floor>("f1");
  const space = SPACES.find((s) => s.id === floor)!;
  const [sel, setSel] = useState<Room>(space.rooms[0]);

  const sceneByFloor: Record<Floor, string> = {
    yard: "scene-district.webp",
    f1: "scene-living.webp",
    f2: "scene-bedroom.webp",
    f3: "scene-study.webp",
  };

  const chooseFloor = (f: Floor) => {
    setFloor(f);
    const sp = SPACES.find((s) => s.id === f)!;
    setSel(sp.rooms[0]);
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader eyebrow="Space & Device" title="空间与设备" accent="设备" sub="按庭院 / 一层 / 二层 / 三层管理全屋空间，点击房间查看环境与已连接设备。" />

      <div className="flex gap-2">
        {SPACES.map((s) => (
          <button key={s.id} onClick={() => chooseFloor(s.id)} className="btn btn-sm"
            style={{ background: s.id === floor ? "var(--ai)" : "transparent", color: s.id === floor ? "#fff" : "var(--text-dim)", borderColor: s.id === floor ? "var(--ai)" : "var(--border)" }}>
            {s.name}
          </button>
        ))}
      </div>

      <Reveal>
        <section className="scene-banner">
          <img src={sceneByFloor[floor]} alt={`${space.name} 实景渲染`} key={floor} />
          <div className="scene-banner__cap">
            <span className="chip chip-ai">{space.name}</span>
            <span>真实空间渲染 · 点击房间查看环境与设备</span>
          </div>
        </section>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="card card-pad-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title" style={{ fontSize: 18 }}>{space.name} · 空间列表</h2>
            <span className="chip">{space.rooms.length} 个房间</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {space.rooms.map((r) => (
              <button key={r.id} onClick={() => setSel(r)} className="card card-pad text-left"
                style={{ borderColor: r.id === sel.id ? "var(--ai)" : "var(--border)" }}>
                <div className="flex items-center justify-between">
                  <span className="font-medium" style={{ color: "var(--text)" }}>{r.name}</span>
                  {r.occupantId && <span className="chip chip-ai">{behaviorLabel(r.behavior)}</span>}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>
                  {r.tempC}℃ · 湿度 {r.humidity}% · {r.light === "off" ? "灯关" : "灯亮"} · {r.aiIntervening ? "AI 干预中" : "常态"}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card card-pad-lg" style={{ alignSelf: "start" }}>
          <h2 className="section-title mb-1" style={{ fontSize: 18 }}>{sel.name}</h2>
          <p className="text-sm mb-3" style={{ color: "var(--text-dim)" }}>当前模式：{sel.aiIntervening ? "AI 托管" : "手动"}</p>
          <div className="grid grid-cols-2 gap-2 text-sm mb-4" style={{ color: "var(--text-dim)" }}>
            <span>温度 {sel.tempC}℃</span><span>湿度 {sel.humidity}%</span>
            <span>空气 {sel.aqi} AQI</span><span>窗帘 {sel.curtain === "open" ? "开" : "闭"}</span>
            <span>空调 {sel.ac === "on" ? "开" : "关"}</span><span>门窗 {sel.door === "open" ? "开" : "闭"}</span>
          </div>

          <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>已连接设备</h3>
          <div className="flex flex-col gap-2">
            {deviceByRoom(sel.id).length === 0 && <span className="text-sm" style={{ color: "var(--text-faint)" }}>暂无设备</span>}
            {deviceByRoom(sel.id).map((d) => (
              <div key={d.id} className="rounded-lg p-3" style={{ background: "var(--card-2)" }}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm" style={{ color: "var(--text)" }}>{d.name}</span>
                  <span className={`chip ${d.aiManaged ? "chip-ai" : ""}`}>{d.aiManaged ? "AI托管" : "手动"}</span>
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>模式：{d.mode} · 功率 {d.powerKw}kW</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {d.controls.map((c) => (
                    <button key={c.label} className="btn btn-ghost btn-sm">{c.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
