"use client";

import { useState } from "react";
import { SCENARIOS, scenarioById, evaluate } from "@/lib/engine";
import { MEMBERS, ENERGY, SAFETY, RECENT_LOG, ALL_ROOMS, behaviorLabel, roomName } from "@/lib/data";
import StatusBar from "@/components/StatusBar";
import MemberCard from "@/components/MemberCard";
import VillaPlan from "@/components/VillaPlan";
import PlanCard from "@/components/PlanCard";
import Timeline from "@/components/Timeline";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import PageHeader from "@/components/PageHeader";
import AiDecisionPanel from "@/components/AiDecisionPanel";
import type { Room } from "@/lib/types";

const ROLE_LABEL: Record<string, string> = {
  elder: "老人", teen: "青少年", child: "儿童", adult: "成人", pregnant: "孕妇",
  patient: "病患", recovering: "康复", limited: "行动不便", wheelchair: "轮椅", caregiver: "护理", staff: "家政", guest: "访客",
};

export default function OverviewPage() {
  const [active, setActive] = useState("live");
  const [selRoom, setSelRoom] = useState<Room | undefined>();

  const scen = scenarioById(active);
  const ctx = scen.ctx;
  const plans = evaluate(ctx);
  const atHome = MEMBERS.filter((m) => m.current && m.current.activity !== "out").length;

  const m = ctx.member;
  const room = ctx.space ? ALL_ROOMS.find((r) => r.id === ctx.space) : undefined;
  const idText = m
    ? `${m.age}岁${ROLE_LABEL[m.role]}${m.name}，位于${ctx.floor ? floorName(ctx.floor) : ""}${roomName(ctx.space)}，正在${behaviorLabel(ctx.behavior)}`
    : "当前聚焦能源调度场景";
  const judgment = m
    ? `环境照度${ctx.env.lux < 60 ? "偏低" : "适宜"}，用户行动能力${m.mobility === "wheelchair" ? "依赖轮椅" : m.mobility === "assisted" ? "较弱" : "正常"}，需${m.role === "elder" || m.mobility !== "full" ? "低位引导照明与安静通行环境" : "舒适与便捷响应"}。`
    : "光伏发电与负载、储能匹配，按绿电优先策略调度。";

  return (
    <div className="flex flex-col gap-6">
      {/* 主视觉封面 */}
      <section className="hero-cover">
        <img src="hero-cover.webp" alt="智居慧脑 · 现代三层别墅实景" />
        <div className="hero-cover__overlay" />
        <div className="hero-cover__content">
          <span className="eyebrow" style={{ color: "rgba(255,255,255,0.88)" }}>智居慧脑 · 家庭中枢</span>
          <h1 className="display-title" style={{ color: "#fff" }}>三层别墅的 <span className="gradient-text">AI 居家智能体</span></h1>
          <p className="lead" style={{ color: "rgba(255,255,255,0.92)" }}>服务一栋现代三层别墅，实时识别家庭成员、理解行为与空间，主动协调全屋响应。</p>
          <div><MagneticButton href="butler.html" className="btn btn-primary">打开 AI 居家管家 →</MagneticButton></div>
        </div>
      </section>

      {/* 别墅区整体总览 */}
      <Reveal>
        <section className="scene-banner">
          <img src="scene-district.webp" alt="别墅区整体总览" />
          <div className="scene-banner__cap">
            <span className="eyebrow">总览</span>
            <span>现代三层别墅 · 庭院光伏与储能一体化社区</span>
          </div>
        </section>
      </Reveal>

      {/* BIMBase 插件：整卡可点击，一键下载接入 */}
      <Reveal>
        <a href="bimbase-plugin.zip" download className="bimbase-cta card card-pad-lg">
          <div className="bimbase-cta__main">
            <span className="chip chip-ai">BIMBase · 集成插件</span>
            <h2 className="bimbase-cta__title">一键安装 BIMBase 插件</h2>
            <p className="bimbase-cta__desc">
              把「智居慧脑」构件库接入 BIMBase 2025：Ribbon 一键打开网站、框选构件自动深链到对应卡片。零编译，复制即用。
            </p>
            <ul className="bimbase-cta__list">
              <li>4 个 Ribbon 按钮：打开站点 / 构件库 / 定位构件 / 导出清单</li>
              <li>与网站 112 构件库同源索引，深链精确匹配</li>
            </ul>
          </div>
          <div className="bimbase-cta__action">
            <span className="bimbase-cta__btn">↓ 下载插件包 (.zip)</span>
            <span className="bimbase-cta__hint">含安装说明 · 约 13KB</span>
          </div>
        </a>
      </Reveal>

      {/* AI 智能中枢：场景 → 识别 → 判断 → 执行，核心叙事 */}
      <Reveal>
        <AiDecisionPanel
          active={active}
          onSelect={setActive}
          idText={idText}
          judgment={judgment}
          plans={plans}
        />
      </Reveal>

      {/* 系统状态：AI 决策后的全局指标反馈 */}
      <Reveal>
        <section className="home-section">
          <PageHeader eyebrow="System" title="系统状态" accent="状态" sub="当前能源、安全、舒适度与在家人数等全局指标一览。" />
          <StatusBar energy={ctx.energy} safety={ctx.risk ? { ...SAFETY, risk: ctx.risk } : SAFETY} atHome={atHome} />
        </section>
      </Reveal>

      {/* 家庭中枢总览：成员 / 空间状态 / 环境能源安全记录 三区并陈 */}
      <Reveal>
        <section className="home-section">
          <PageHeader eyebrow="Overview" title="家庭中枢总览" accent="总览" sub="家庭成员、别墅空间状态、环境能源安全与近期记录一屏掌握。" />
          <div className="overview-grid">
            {/* 左：成员状态 */}
            <section className="card card-pad flex flex-col gap-3">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text)" }}>家庭成员状态</h2>
              {MEMBERS.map((mem) => <MemberCard key={mem.id} m={mem} />)}
            </section>

            {/* 中：别墅空间状态 */}
            <section className="overview-center flex flex-col gap-4">
              <div className="card card-pad-lg">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="section-title" style={{ fontSize: 18 }}>三层别墅空间状态</h2>
                  {selRoom && (
                    <span className="chip chip-ai">已选：{selRoom.name}</span>
                  )}
                </div>
                <VillaPlan selected={selRoom?.id} onSelect={setSelRoom} />
                {selRoom && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
                    <span>温度 {selRoom.tempC}℃</span><span>湿度 {selRoom.humidity}%</span>
                    <span>空气 {selRoom.aqi} AQI</span><span>灯光 {selRoom.light === "off" ? "关" : selRoom.light === "dim" ? "微亮" : "开"}</span>
                  </div>
                )}
              </div>
            </section>

            {/* 右：环境·能源·安全（合并为一卡，记录单列） */}
            <section className="flex flex-col gap-3">
              <div className="card card-pad">
                <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>环境 · 能源 · 安全</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs" style={{ color: "var(--text-faint)" }}>环境</span>
                    <div className="flex flex-col gap-0.5 text-xs" style={{ color: "var(--text-dim)" }}>
                      <span>平均温度 24℃</span><span>平均湿度 54%</span>
                      <span>CO₂ 620ppm</span><span>PM2.5 18</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs" style={{ color: "var(--text-faint)" }}>能源</span>
                    <div className="flex flex-col gap-0.5 text-xs" style={{ color: "var(--text-dim)" }}>
                      <span>光伏 {ctx.energy.solarKw.toFixed(1)}kW</span><span>负载 {ctx.energy.loadKw.toFixed(1)}kW</span>
                      <span>储能 {ctx.energy.socPct}%</span><span>自发自用 {ctx.energy.selfUsePct}%</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs" style={{ color: "var(--text-faint)" }}>安全</span>
                    <div className="mt-1">
                      <span className={`chip ${ctx.risk === "normal" ? "chip-energy" : ctx.risk === "emergency" ? "chip-danger" : "chip-warn"}`}>
                        风险 {riskLabel(ctx.risk)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card card-pad">
                <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>近期记录</h3>
                <Timeline items={RECENT_LOG} />
              </div>
            </section>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

function floorName(f: string) {
  return { yard: "庭院", f1: "一层", f2: "二层", f3: "三层" }[f] ?? "";
}
function riskLabel(r: string) {
  return { normal: "正常", attention: "关注", warning: "警告", emergency: "紧急" }[r] ?? r;
}
