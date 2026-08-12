"use client";

import { useState, useEffect } from "react";
import { SPACES, MEMBERS, roomById } from "@/lib/data";
import type { Room, Floor } from "@/lib/types";

// 每层房间在平面图中的矩形布局（viewBox 0 0 300 170）
const LAYOUTS: Record<string, Record<string, { x: number; y: number; w: number; h: number }>> = {
  yard: { r_yard: { x: 60, y: 40, w: 180, h: 90 } },
  f1: {
    // 与项目一层设计保持一致：玄关|客厅|厨房 在上，多功能空间|公共卫生间|餐厅 在下
    r_entry: { x: 12, y: 12, w: 58, h: 54 },
    r_living: { x: 78, y: 12, w: 126, h: 56 },
    r_kitchen: { x: 212, y: 12, w: 74, h: 54 },
    r_multi: { x: 12, y: 74, w: 58, h: 84 },
    r_wc1: { x: 78, y: 106, w: 58, h: 52 },
    r_dining: { x: 144, y: 74, w: 142, h: 84 },
  },
  f2: {
    r_master: { x: 12, y: 12, w: 92, h: 70 },
    r_second: { x: 108, y: 12, w: 92, h: 38 },
    r_kids: { x: 108, y: 54, w: 92, h: 38 },
    r_living2: { x: 12, y: 86, w: 92, h: 62 },
    r_wc2: { x: 108, y: 96, w: 42, h: 52 },
    r_closet: { x: 154, y: 96, w: 46, h: 52 },
    r_balcony: { x: 204, y: 12, w: 84, h: 140 },
  },
  f3: {
    r_study: { x: 12, y: 12, w: 92, h: 70 },
    r_fun: { x: 108, y: 12, w: 92, h: 70 },
    r_gym: { x: 12, y: 86, w: 92, h: 62 },
    r_utility: { x: 108, y: 86, w: 46, h: 50 },
    r_equip: { x: 158, y: 86, w: 42, h: 50 },
    r_terrace: { x: 204, y: 12, w: 84, h: 140 },
  },
};

export default function VillaPlan({
  selected, onSelect,
}: {
  selected?: string;
  onSelect?: (room: Room) => void;
}) {
  const initialFloor = ((selected && roomById(selected)?.floor) || "f1") as Floor;
  const [floor, setFloor] = useState<Floor>(initialFloor);

  // 外部选中房间时，自动切到对应楼层
  useEffect(() => {
    if (selected) {
      const f = roomById(selected)?.floor;
      if (f) setFloor(f as Floor);
    }
  }, [selected]);

  const space = SPACES.find((s) => s.id === floor)!;
  const lay = LAYOUTS[floor] || {};
  const occCount = space.rooms.filter((r) => r.occupantId).length;

  return (
    <div className="flex flex-col gap-3">
      {/* 楼层切换 tab（对标 SmartThings Map View 的楼层切换） */}
      <div className="flex flex-wrap gap-2">
        {SPACES.map((s) => (
          <button key={s.id} onClick={() => setFloor(s.id as Floor)} className="btn btn-sm"
            style={{
              background: s.id === floor ? "var(--ai)" : "transparent",
              color: s.id === floor ? "#fff" : "var(--text-dim)",
              boxShadow: s.id === floor ? "none" : "0 0 0 1px var(--border)",
            }}>
            {s.name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{space.name} · 平面示意</span>
        <span className="chip">{occCount} 人活动 · {space.rooms.length} 间</span>
      </div>

      <svg viewBox="0 0 300 170" width="100%" style={{ display: "block", maxHeight: 360 }} role="img" aria-label={`${space.name}平面示意图`}>
        {/* 庭院：户外空间装饰 */}
        {floor === "yard" && (
          <>
            <rect x="12" y="12" width="276" height="146" rx="14" fill="none" stroke="var(--border)" strokeDasharray="4 6" />
            <text x="150" y="28" textAnchor="middle" fontSize="10" fill="var(--text-faint)">庭院 · 户外空间</text>
            <g transform="translate(228,118)">
              <rect x="0" y="0" width="40" height="26" rx="3" fill="var(--warn-soft)" stroke="var(--warn)" strokeWidth="1" />
              <line x1="0" y1="9" x2="40" y2="9" stroke="var(--warn)" strokeWidth="0.6" opacity="0.6" />
              <line x1="0" y1="18" x2="40" y2="18" stroke="var(--warn)" strokeWidth="0.6" opacity="0.6" />
            </g>
          </>
        )}

        {space.rooms.map((room) => {
          const r = lay[room.id];
          if (!r) return null;
          const occ = room.occupantId ? MEMBERS.find((m) => m.id === room.occupantId) : null;
          const isSel = selected === room.id;
          const aiOn = room.aiIntervening;
          const cx = r.x + r.w / 2;
          const cy = r.y + r.h / 2;
          const cls = `vroom ${occ ? "occ" : ""} ${isSel ? "sel" : ""}`;
          return (
            <g key={room.id} onClick={() => onSelect?.(room)}>
              <rect className={cls} x={r.x} y={r.y} width={r.w} height={r.h} rx={8}
                style={{ fill: occ ? "var(--ai-soft)" : "var(--card-2)" }} />
              <text className="vroom-label" x={cx} y={cy + 4} textAnchor="middle"
                style={{ fill: occ ? "var(--ai)" : "var(--text-dim)" }}>
                {room.name}
              </text>
              {aiOn && <circle className="pulse" cx={r.x + r.w - 9} cy={r.y + 9} r="3.2" fill="var(--ai)" />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
