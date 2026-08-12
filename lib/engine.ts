import type { Context, Match, Rule, Plan, Action, EnergyState, Risk } from "./types";
import { ENERGY, SAFETY, MEMBERS, roomById } from "./data";

// ───────────────────────── 匹配与评分 ─────────────────────────
function inRange(v: number, r?: [number, number]) {
  return !r || (v >= r[0] && v <= r[1]);
}
function matchOne(m: Match, c: Context): boolean {
  const mb = c.member;
  if (m.roles && (!mb || !m.roles.includes(mb.role))) return false;
  if (m.mobility && (!mb || !m.mobility.includes(mb.mobility))) return false;
  if (m.ageMin != null && (!mb || mb.age < m.ageMin)) return false;
  if (m.ageMax != null && (!mb || mb.age > m.ageMax)) return false;
  if (m.behaviors && (!c.behavior || !m.behaviors.includes(c.behavior))) return false;
  if (m.spaces && (!c.space || !m.spaces.includes(c.space))) return false;
  if (m.floors && (!c.floor || !m.floors.includes(c.floor))) return false;
  if (m.isWeekend != null && c.time.isWeekend !== m.isWeekend) return false;
  if (m.hour && !inRange(c.time.hour, m.hour)) return false;
  if (m.tempC && !inRange(c.env.tempC, m.tempC)) return false;
  if (m.lux && !inRange(c.env.lux, m.lux)) return false;
  if (m.aqi && !inRange(c.env.aqi, m.aqi)) return false;
  if (m.socPct && !inRange(c.energy.socPct, m.socPct)) return false;
  if (m.solarKw && !inRange(c.energy.solarKw, m.solarKw)) return false;
  if (m.gridDown != null && (c.gridDown ?? false) !== m.gridDown) return false;
  if (m.evCharging != null && (c.evCharging ?? false) !== m.evCharging) return false;
  if (m.risk && !m.risk.includes(c.risk)) return false;
  return true;
}
function specificity(m: Match): number {
  return Object.keys(m).filter((k) => (m as any)[k] !== undefined).length;
}

export function evaluate(ctx: Context, rules: Rule[] = RULES): Plan[] {
  const scored = rules
    .filter((r) => matchOne(r.match, ctx))
    .map((r) => ({ r, spec: specificity(r.match) }))
    .sort((a, b) => b.spec * 10 + b.r.priority - (a.spec * 10 + a.r.priority));

  const plans: Plan[] = [];
  for (const { r } of scored) {
    plans.push({
      id: r.id,
      domain: r.domain,
      title: r.title,
      actions: r.actions,
      firedRules: [r.id],
      score: specificity(r.match) * 10 + r.priority,
    });
  }
  if (plans.length === 0) plans.push(defaultPlan(ctx));
  return plans;
}

function defaultPlan(ctx: Context): Plan {
  return {
    id: "default",
    domain: "behavior",
    title: "维持当前环境",
    actions: [{ key: "keep", type: "device", target: "全屋", op: "保持现状", reason: "未触发特定规则，维持当前舒适设定。" }],
    firedRules: ["default"],
    score: 0,
  };
}

// ───────────────────────── 规则集（覆盖 8 演示案例 + 基础规则） ─────────────────────────
export const RULES: Rule[] = [
  // 案例一：老人 + 二层主卧 + 夜间离床
  {
    id: "r_elder_night", domain: "behavior", priority: 90, title: "老人夜间离床 · 低位暖光防跌路径",
    match: { roles: ["elder"], behaviors: ["nightleave"], spaces: ["r_master"], lux: [0, 40] },
    actions: [
      { key: "light.master", type: "device", target: "主卧床底灯", op: "开启至 20% 暖光", reason: "低位暖光减少强光刺激，标识床边路径。" },
      { key: "light.hall", type: "device", target: "走廊地脚灯", op: "开启至 25%", reason: "保证从卧室到卫生间的通行清晰。" },
      { key: "light.wc", type: "device", target: "卫生间照明", op: "开启至 30%", reason: "降低起夜跌倒风险。" },
      { key: "device.vacuum", type: "device", target: "清扫机器人", op: "暂停运行", reason: "避免移动设备干扰通行。" },
      { key: "quiet.others", type: "notify", target: "其他卧室", op: "保持静音", reason: "不惊扰其他家庭成员。" },
      { key: "check.fall", type: "check", target: "防跌监测", op: "提升灵敏度", reason: "老人夜间行动能力弱，需重点防护。" },
      { key: "notify.family", type: "notify", target: "家属", op: "推送离床提醒", reason: "便于必要时协助。" },
    ],
  },
  // 案例二：儿童 + 三层书房 + 学习
  {
    id: "r_child_study", domain: "behavior", priority: 85, title: "儿童学习 · 护眼专注环境",
    match: { roles: ["child"], behaviors: ["study"], spaces: ["r_study", "r_kids"] },
    actions: [
      { key: "light.study", type: "device", target: "书房护眼灯", op: "白光 85%", reason: "高照度护眼，减少视疲劳。" },
      { key: "air.study", type: "device", target: "书房新风", op: "净化优先", reason: "保持空气清新助专注。" },
      { key: "notify.parent", type: "notify", target: "家长", op: "学习进行中（可 glance）", reason: "避免过度打扰。" },
      { key: "quiet.notify", type: "notify", target: "全屋通知", op: "静音", reason: "防止消息打断学习。" },
    ],
  },
  // 案例三：成人 + 一层客厅 + 接待访客
  {
    id: "r_adult_host", domain: "behavior", priority: 80, title: "会客 · 温馨氛围与迎宾",
    match: { roles: ["adult"], behaviors: ["host"], spaces: ["r_living", "r_dining"] },
    actions: [
      { key: "light.living", type: "device", target: "客厅主灯", op: "温馨 70%", reason: "营造会客氛围。" },
      { key: "scene.door", type: "scene", target: "门锁", op: "访客通行授权", reason: "便于客人进入。" },
      { key: "media.music", type: "device", target: "背景音乐", op: "轻柔播放", reason: "提升待客体验。" },
      { key: "ac.comfort", type: "device", target: "客厅空调", op: "维持 24℃", reason: "舒适体感。" },
    ],
  },
  // 案例四：病患 + 一层多功能空间 + 安静休养
  {
    id: "r_patient_rest", domain: "behavior", priority: 82, title: "病患休养 · 安静净化环境",
    match: { roles: ["patient", "recovering"], behaviors: ["rest", "recover"], spaces: ["r_multi"] },
    actions: [
      { key: "light.soft", type: "device", target: "多功能区灯", op: "柔光 30%", reason: "低刺激利于休养。" },
      { key: "air.purify", type: "device", target: "空气净化", op: "净化优先", reason: "洁净空气助康复。" },
      { key: "quiet.mode", type: "notify", target: "全屋", op: "勿扰模式", reason: "限制不必要干扰。" },
      { key: "remind.care", type: "check", target: "照护提醒", op: "定时复检", reason: "关注休养状态，不提供诊断。" },
    ],
  },
  // 案例五：轮椅使用者 + 一层玄关 + 回家
  {
    id: "r_wheelchair_home", domain: "behavior", priority: 84, title: "轮椅归家 · 通畅无阻路径",
    match: { mobility: ["wheelchair"], behaviors: ["home"], spaces: ["r_entry"] },
    actions: [
      { key: "light.ramp", type: "device", target: "门廊坡道灯", op: "全亮", reason: "坡道清晰，便于轮椅通行。" },
      { key: "path.clear", type: "device", target: "玄关→起居路径", op: "无门槛照明", reason: "保证平坦通畅路径。" },
      { key: "door.open", type: "scene", target: "入户门", op: "自动开启", reason: "免去推拉负担。" },
      { key: "notify.care", type: "notify", target: "家属", op: "已安全到家", reason: "同步照护状态。" },
    ],
  },
  // 案例六：光伏充足 + 储能未满 + 高耗能待运行
  {
    id: "r_solar_store", domain: "energy", priority: 70, title: "绿电优先 · 储能吸纳 + 错峰高耗",
    match: { solarKw: [3, 20], socPct: [0, 90] },
    actions: [
      { key: "energy.store", type: "energy", target: "家庭储能柜", op: "优先充电", reason: "余电先入储能，提升自发自用率。" },
      { key: "energy.shift", type: "energy", target: "高耗能设备", op: "排至光伏强时运行", reason: "提高绿电消纳。" },
      { key: "energy.mode", type: "energy", target: "能源模式", op: "自发自用优先", reason: "减少市电取电。" },
    ],
  },
  // 案例七：停电 + 储能可用 + 家中有老人
  {
    id: "r_blackout", domain: "energy", priority: 95, title: "停电保障 · 重要负载保供",
    match: { gridDown: true, socPct: [15, 100] },
    actions: [
      { key: "energy.critical", type: "energy", target: "重要负载", op: "门锁/中枢/网络/冰箱/应急照明/照护设备", reason: "优先保障安全与基本生活。" },
      { key: "energy.ev", type: "energy", target: "充电桩", op: "功率限制至最低", reason: "释放储能给关键负载。" },
      { key: "scene.blackout", type: "scene", target: "全屋", op: "启动停电保障模式", reason: "统一应急策略。" },
      { key: "check.elder", type: "check", target: "老人房", op: "应急照明确认", reason: "老人行动弱，需确保通路照明。" },
    ],
  },
  // 案例八：EV 充电 + 高负载 + 储能不足
  {
    id: "r_ev_peak", domain: "energy", priority: 75, title: "错峰充电 · 保必要负载",
    match: { evCharging: true, socPct: [0, 30] },
    actions: [
      { key: "energy.ev", type: "energy", target: "充电桩", op: "降功率 / 错峰", reason: "储能不足时避免与高负载争电。" },
      { key: "energy.load", type: "energy", target: "非必要负载", op: "暂缓", reason: "保障必要用电。" },
      { key: "energy.mode", type: "energy", target: "能源模式", op: "储能优先", reason: "保住储能余量。" },
    ],
  },
  // 基础：夜间低照度有人 → 补光
  {
    id: "r_lowlight", domain: "behavior", priority: 40, title: "低照度补光",
    match: { lux: [0, 30], behaviors: ["walk", "stand"] },
    actions: [{ key: "light.amb", type: "device", target: "所在空间", op: "开启 40% 暖光", reason: "照度偏低，补充基础照明。" }],
  },
];

// ───────────────────────── 演示场景（8 案例 + 实时） ─────────────────────────
export interface Scenario {
  id: string;
  title: string;
  desc: string;
  ctx: Context;
}
const dad = MEMBERS.find((m) => m.id === "m_dad")!;
const yu = MEMBERS.find((m) => m.id === "m_yu")!;
const zhang = MEMBERS.find((m) => m.id === "m_zhang")!;
const mom = MEMBERS.find((m) => m.id === "m_mom")!;
const li = MEMBERS.find((m) => m.id === "m_li")!;

export const SCENARIOS: Scenario[] = [
  {
    id: "live", title: "实时家庭状态", desc: "基于当前各成员位置与行为的综合研判。",
    ctx: {
      member: dad, behavior: "host", space: "r_living", floor: "f1",
      time: { hour: 14, isWeekend: false },
      env: { tempC: 24, lux: 320, aqi: 40, humidity: 52 },
      devices: {}, energy: ENERGY, risk: SAFETY.risk, scenarioId: "live",
    },
  },
  {
    id: "c1", title: "案例一 · 老人夜间离床", desc: "张爷爷 · 二层主卧 · 夜间离床",
    ctx: {
      member: zhang, behavior: "nightleave", space: "r_master", floor: "f2",
      time: { hour: 3, isWeekend: false },
      env: { tempC: 23, lux: 8, aqi: 39, humidity: 53 },
      devices: {}, energy: ENERGY, risk: "attention", scenarioId: "c1",
    },
  },
  {
    id: "c2", title: "案例二 · 儿童学习", desc: "小宇 · 三层书房 · 学习",
    ctx: {
      member: yu, behavior: "study", space: "r_study", floor: "f3",
      time: { hour: 14, isWeekend: false },
      env: { tempC: 23, lux: 380, aqi: 37, humidity: 50 },
      devices: {}, energy: ENERGY, risk: "normal", scenarioId: "c2",
    },
  },
  {
    id: "c3", title: "案例三 · 成人待客", desc: "大成 · 一层客厅 · 接待访客",
    ctx: {
      member: dad, behavior: "host", space: "r_living", floor: "f1",
      time: { hour: 14, isWeekend: false },
      env: { tempC: 24, lux: 320, aqi: 40, humidity: 52 },
      devices: {}, energy: ENERGY, risk: "normal", scenarioId: "c3",
    },
  },
  {
    id: "c4", title: "案例四 · 病患休养", desc: "小美 · 一层多功能空间 · 安静休养",
    ctx: {
      member: mom, behavior: "rest", space: "r_multi", floor: "f1",
      time: { hour: 15, isWeekend: false },
      env: { tempC: 25, lux: 120, aqi: 35, humidity: 50 },
      devices: {}, energy: ENERGY, risk: "normal", scenarioId: "c4",
    },
  },
  {
    id: "c5", title: "案例五 · 轮椅回家", desc: "李奶奶 · 一层玄关 · 回家",
    ctx: {
      member: li, behavior: "home", space: "r_entry", floor: "f1",
      time: { hour: 18, isWeekend: false },
      env: { tempC: 22, lux: 200, aqi: 38, humidity: 55 },
      devices: {}, energy: ENERGY, risk: "normal", scenarioId: "c5",
    },
  },
  {
    id: "c6", title: "案例六 · 光伏充足储能未满", desc: "光伏发电充足 + 储能未满 + 高耗能待运行",
    ctx: {
      member: undefined, behavior: undefined, space: undefined, floor: undefined,
      time: { hour: 12, isWeekend: false },
      env: { tempC: 26, lux: 800, aqi: 30, humidity: 45 },
      devices: {}, energy: { ...ENERGY, solarKw: 6.5, socPct: 55, loadKw: 4.6, chargeKw: 3.0 },
      risk: "normal", scenarioId: "c6",
    },
  },
  {
    id: "c7", title: "案例七 · 停电+储能可用+有老人", desc: "停电 + 储能可用 + 家中存在老人",
    ctx: {
      member: zhang, behavior: "rest", space: "r_master", floor: "f2",
      time: { hour: 20, isWeekend: false },
      env: { tempC: 24, lux: 50, aqi: 39, humidity: 53 },
      devices: {}, energy: { ...ENERGY, solarKw: 0, gridKw: 0, socPct: 62, loadKw: 2.0, chargeKw: 0 },
      risk: "warning", gridDown: true, scenarioId: "c7",
    },
  },
  {
    id: "c8", title: "案例八 · EV充电+高负载+储能不足", desc: "电动车需充电 + 家庭负载较高 + 储能不足",
    ctx: {
      member: undefined, behavior: undefined, space: undefined, floor: undefined,
      time: { hour: 19, isWeekend: false },
      env: { tempC: 25, lux: 300, aqi: 35, humidity: 50 },
      devices: {}, energy: { ...ENERGY, solarKw: 0, socPct: 22, loadKw: 4.8, evKw: 6.0, chargeKw: 6.0 },
      risk: "attention", evCharging: true, scenarioId: "c8",
    },
  },
];

export const scenarioById = (id?: string) => SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
