"use client";

import { useEffect, useMemo, useState } from "react";
import { COMPONENT_LIBRARY, LIBRARY_CATEGORIES, type LibComponent } from "@/lib/component-library";
import { COMPONENT_IMAGE, COMPONENT_PARAM_IMAGE } from "@/lib/component-images";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

const CAT_VAR: Record<string, string> = {
  智能中枢: "chip-ai",
  传感探测: "chip-warn",
  照明灯具: "chip-energy",
  门窗幕墙: "chip",
  能源设备: "chip-energy",
  厨卫设备: "chip",
  环境控制: "chip-ai",
  家具软装: "chip",
  景观庭院: "chip-energy",
  娱乐休闲: "chip",
  装饰摆件: "chip",
  楼梯结构: "chip-warn",
  其他构件: "chip",
};

// 类别代表示意图（12 类各一张，统一极简 3D 产品渲染风）
const CAT_IMAGE: Record<string, string> = {
  智能中枢: "components/zhongshu.webp",
  传感探测: "components/sensor.webp",
  照明灯具: "components/lighting.webp",
  门窗幕墙: "components/doorwin.webp",
  能源设备: "components/energy.webp",
  厨卫设备: "components/kitchen.webp",
  环境控制: "components/env.webp",
  家具软装: "components/furniture.webp",
  景观庭院: "components/landscape.webp",
  娱乐休闲: "components/entertainment.webp",
  装饰摆件: "components/decor.webp",
  楼梯结构: "components/stair.webp",
};

export default function ComponentsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("全部");
  const [grouped, setGrouped] = useState(false);

  // 支持从 URL 深链（如 BIMBase 插件发起的 /components?q=智能升降晾衣系统）
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("q");
    if (param) setQ(param);
  }, []);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of COMPONENT_LIBRARY) m[c.category] = (m[c.category] || 0) + 1;
    return m;
  }, []);

  const list = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return COMPONENT_LIBRARY.filter((c) => {
      if (cat !== "全部" && c.category !== cat) return false;
      if (!kw) return true;
      return (
        c.name.toLowerCase().includes(kw) ||
        c.code.toLowerCase().includes(kw) ||
        c.space.toLowerCase().includes(kw) ||
        c.category.toLowerCase().includes(kw) ||
        c.summary.toLowerCase().includes(kw) ||
        c.description.toLowerCase().includes(kw)
      );
    });
  }, [q, cat]);

  const groupedList = useMemo(() => {
    const order = LIBRARY_CATEGORIES;
    const map: Record<string, LibComponent[]> = {};
    for (const c of list) (map[c.category] ||= []).push(c);
    return order.filter((k) => map[k]).map((k) => ({ cat: k, items: map[k] }));
  }, [list]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Component Library"
        title="参数化构件库"
        accent="构件"
        sub={`共 ${COMPONENT_LIBRARY.length} 个 BIMBase 参数化智能家居构件，均含可调参数与详细规格说明。可按名称 / 编号 / 空间检索，点击卡片查看完整参数。`}
      />

      {/* 统计概览 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCat("全部")}
          className={"chip " + (cat === "全部" ? "chip-ai" : "")}
          style={{ cursor: "pointer" }}
        >
          全部 · {COMPONENT_LIBRARY.length}
        </button>
        {LIBRARY_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={"chip " + (cat === c ? CAT_VAR[c] || "chip-ai" : "")}
            style={{ cursor: "pointer" }}
          >
            {c} · {counts[c] || 0}
          </button>
        ))}
      </div>

      {/* 搜索 + 视图切换 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索构件名称 / 编号 / 空间 / 功能…"
          className="flex-1"
        />
        <button
          onClick={() => setGrouped((g) => !g)}
          className="btn btn-ghost btn-sm sm:w-40"
        >
          {grouped ? "卡片视图" : "按类别分组"}
        </button>
      </div>

      {list.length === 0 && (
        <span className="text-sm" style={{ color: "var(--text-faint)" }}>无匹配构件。</span>
      )}

      {/* 分组视图 */}
      {grouped ? (
        <div className="flex flex-col gap-8">
          {groupedList.map((g) => (
            <section key={g.cat} className="flex flex-col gap-3">
              <h2 className="section-title" style={{ fontSize: 20 }}>
                {g.cat}
                <span className="text-sm font-normal" style={{ color: "var(--text-faint)" }}>
                  {" "}{g.items.length} 个
                </span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((c, i) => (
                  <Reveal key={c.id} delay={Math.min(i * 0.02, 0.2)}>
                    <LibCard c={c} />
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c, i) => (
            <Reveal key={c.id} delay={Math.min(i * 0.015, 0.25)}>
              <LibCard c={c} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

function LibCard({ c }: { c: LibComponent }) {
  const [open, setOpen] = useState(false);
  const [allParams, setAllParams] = useState(false);
  const shown = allParams ? c.params : c.params.slice(0, 14);

  return (
    <div className="card card-pad-lg flex flex-col gap-3 h-full">
      <div className="lib-thumb">
        <img src={COMPONENT_IMAGE[c.name]} alt={c.name} loading="lazy" />
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold leading-tight" style={{ color: "var(--text)" }}>{c.name}</h3>
          <div className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>编号 {c.code}</div>
        </div>
        <span className={"chip " + (CAT_VAR[c.category] || "chip-ai")}>{c.category}</span>
      </div>

      <div className="flex gap-1 flex-wrap">
        <span className="chip">{c.space}</span>
        <span className="chip chip-energy">{c.paramCount} 项参数</span>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
        {c.description}
      </p>

      {c.features.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {c.features.map((f) => (
            <span key={f} className="chip chip-ai" style={{ fontSize: 11 }}>{f}</span>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="btn btn-soft btn-sm mt-auto"
      >
        {open ? "收起参数" : `查看 ${c.paramCount} 项可调参数`}
      </button>

      {open && (
        <div className="flex flex-col gap-2 pt-1" style={{ borderTop: "1px solid var(--border)" }}>
          {COMPONENT_PARAM_IMAGE[c.name] && (
            <div className="lib-param-img">
              <span className="text-xs" style={{ color: "var(--text-faint)", display: "block", marginBottom: 6 }}>
                参数化结合 · 模型与参数示意
              </span>
              <img
                src={COMPONENT_PARAM_IMAGE[c.name]}
                alt={`${c.name} 参数示意`}
                loading="lazy"
              />
            </div>
          )}
          <div
            className="overflow-y-auto pr-1"
            style={{ maxHeight: 320 }}
          >
            <table className="lib-param w-full text-xs">
              <thead>
                <tr>
                  <th>参数</th>
                  <th>默认值</th>
                  <th>可选值 / 分组</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((p) => (
                  <tr key={p.name}>
                    <td style={{ color: "var(--text)", fontWeight: 600 }}>{p.name}</td>
                    <td style={{ color: "var(--text-dim)" }}>{p.default}</td>
                    <td style={{ color: "var(--text-faint)" }}>
                      {p.options.length > 0 ? (
                        <span className="flex flex-wrap gap-1">
                          {p.options.slice(0, 6).map((o) => (
                            <span key={o} className="lib-opt">{o}</span>
                          ))}
                          {p.options.length > 6 && <span>…</span>}
                        </span>
                      ) : (
                        <span>{p.group || "—"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {c.params.length > 14 && (
            <button
              onClick={() => setAllParams((a) => !a)}
              className="text-xs self-start"
              style={{ color: "var(--ai)" }}
            >
              {allParams ? "仅看前 14 项" : `展开全部 ${c.params.length} 项`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
