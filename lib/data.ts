import type {
  Member, Room, Space, Device, Scene, ComponentItem,
  EnergyState, SafetyState,
} from "./types";

// ───────────────────────── 行为库（22 种） ─────────────────────────
export const BEHAVIORS: { id: string; label: string }[] = [
  { id: "home", label: "回家" }, { id: "leave", label: "离家" },
  { id: "stand", label: "站立" }, { id: "walk", label: "行走" },
  { id: "study", label: "学习" }, { id: "work", label: "办公" },
  { id: "read", label: "阅读" }, { id: "chat", label: "聊天" },
  { id: "host", label: "接客" }, { id: "movie", label: "观影" },
  { id: "rest", label: "休息" }, { id: "sleep", label: "睡眠" },
  { id: "wake", label: "起床" }, { id: "nightleave", label: "夜间离床" },
  { id: "meal", label: "用餐" }, { id: "cook", label: "烹饪" },
  { id: "wash", label: "洗漱" }, { id: "bath", label: "洗浴" },
  { id: "play", label: "娱乐" }, { id: "fitness", label: "健身" },
  { id: "recover", label: "康复" }, { id: "clean", label: "清洁" },
  { id: "dry", label: "晾衣" },
];
export const behaviorLabel = (id?: string) =>
  BEHAVIORS.find((b) => b.id === id)?.label ?? id ?? "—";

// ───────────────────────── 家庭成员 ─────────────────────────
export const MEMBERS: Member[] = [
  {
    id: "m_zhang", name: "张爷爷", relation: "祖父", role: "elder", age: 72,
    height: 168, mobility: "assisted", routine: "早睡早起，午休 1 小时",
    floors: ["f1", "f2"], rooms: ["r_master", "r_living2"],
    behaviors: ["rest", "sleep", "nightleave", "read"],
    lightPref: "暖光偏低", tempPref: 24, airPref: "微通风", sleepHabit: "22:30 入睡",
    safetyNeed: "夜间防跌倒、异常离床提醒", careNeed: "用药提醒、起居协助",
    allowAuto: true, needConfirm: ["门锁控制"],
    current: { floor: "f2", room: "r_master", behavior: "rest", activity: "rest", needAttention: false, updatedAt: "刚刚" },
  },
  {
    id: "m_li", name: "李奶奶", relation: "祖母", role: "wheelchair", age: 70,
    height: 160, mobility: "wheelchair", routine: "白天多在起居区活动",
    floors: ["f1", "f2"], rooms: ["r_living2", "r_dining"],
    behaviors: ["walk", "rest", "meal", "chat"],
    lightPref: "均匀明亮", tempPref: 24, airPref: "洁净", sleepHabit: "21:30 入睡",
    safetyNeed: "通畅无门槛路径、坡道照明", careNeed: "陪同移动",
    allowAuto: true, needConfirm: [],
    current: { floor: "f2", room: "r_living2", behavior: "walk", activity: "active", needAttention: false, updatedAt: "2 分钟前" },
  },
  {
    id: "m_yu", name: "小宇", relation: "孙子", role: "child", age: 8,
    height: 128, mobility: "full", routine: "上学 + 课后学习",
    floors: ["f2", "f3"], rooms: ["r_kids", "r_study"],
    behaviors: ["study", "play", "meal", "sleep"],
    lightPref: "明亮护眼", tempPref: 23, airPref: "清新", sleepHabit: "21:00 入睡",
    safetyNeed: "危险区域禁入提醒", careNeed: "学习陪伴",
    allowAuto: true, needConfirm: ["门锁控制", "燃气"],
    current: { floor: "f3", room: "r_study", behavior: "study", activity: "active", needAttention: false, updatedAt: "刚刚" },
  },
  {
    id: "m_dad", name: "大成", relation: "父亲", role: "adult", age: 40,
    height: 176, mobility: "full", routine: "朝九晚六，常会客",
    floors: ["f1", "f2"], rooms: ["r_living", "r_kitchen"],
    behaviors: ["work", "host", "meal", "movie"],
    lightPref: "中性可调", tempPref: 23, airPref: "自动", sleepHabit: "23:30 入睡",
    safetyNeed: "无特殊", careNeed: "无",
    allowAuto: true, needConfirm: [],
    current: { floor: "f1", room: "r_living", behavior: "host", activity: "active", needAttention: false, updatedAt: "刚刚" },
  },
  {
    id: "m_mom", name: "小美", relation: "母亲", role: "patient", age: 36,
    height: 165, mobility: "assisted", routine: "居家休养，遵医嘱",
    floors: ["f1"], rooms: ["r_multi"],
    behaviors: ["rest", "recover", "read"],
    lightPref: "柔光静谧", tempPref: 25, airPref: "净化优先", sleepHabit: "分段睡眠",
    safetyNeed: "环境平稳、勿扰", careNeed: "安静休养、康复提醒",
    allowAuto: true, needConfirm: ["燃气"],
    current: { floor: "f1", room: "r_multi", behavior: "rest", activity: "rest", needAttention: false, updatedAt: "5 分钟前" },
  },
];

// ───────────────────────── 空间与房间 ─────────────────────────
const ROOMS_F1: Room[] = [
  { id: "r_entry", name: "玄关", floor: "f1", tempC: 23, humidity: 55, aqi: 42, light: "on", ac: "off", curtain: "open", door: "closed", furniture: "idle" },
  { id: "r_living", name: "客厅", floor: "f1", occupantId: "m_dad", occupantRole: "adult", behavior: "host", tempC: 24, humidity: 52, aqi: 40, light: "on", ac: "on", curtain: "closed", door: "open", furniture: "active", aiIntervening: true },
  { id: "r_dining", name: "餐厅", floor: "f1", tempC: 23, humidity: 54, aqi: 41, light: "dim", ac: "off", curtain: "open", door: "open", furniture: "idle" },
  { id: "r_kitchen", name: "厨房", floor: "f1", tempC: 25, humidity: 60, aqi: 50, light: "on", ac: "off", curtain: "open", door: "open", furniture: "idle" },
  { id: "r_multi", name: "多功能空间", floor: "f1", occupantId: "m_mom", occupantRole: "patient", behavior: "rest", tempC: 25, humidity: 50, aqi: 35, light: "dim", ac: "on", curtain: "closed", door: "closed", furniture: "idle", aiIntervening: true },
  { id: "r_wc1", name: "公共卫生间", floor: "f1", tempC: 24, humidity: 65, aqi: 45, light: "off", ac: "off", curtain: "closed", door: "closed", furniture: "idle" },
  { id: "r_yard", name: "庭院", floor: "yard", tempC: 22, humidity: 58, aqi: 38, light: "on", ac: "off", curtain: "open", door: "open", furniture: "idle" },
];
const ROOMS_F2: Room[] = [
  { id: "r_master", name: "主卧", floor: "f2", occupantId: "m_zhang", occupantRole: "elder", behavior: "rest", tempC: 24, humidity: 53, aqi: 39, light: "dim", ac: "on", curtain: "closed", door: "closed", furniture: "idle", aiIntervening: false },
  { id: "r_second", name: "次卧", floor: "f2", tempC: 23, humidity: 53, aqi: 40, light: "off", ac: "off", curtain: "closed", door: "closed", furniture: "idle" },
  { id: "r_kids", name: "儿童房", floor: "f2", tempC: 23, humidity: 54, aqi: 41, light: "off", ac: "on", curtain: "closed", door: "closed", furniture: "idle" },
  { id: "r_living2", name: "家庭起居区", floor: "f2", occupantId: "m_li", occupantRole: "wheelchair", behavior: "walk", tempC: 24, humidity: 52, aqi: 38, light: "on", ac: "on", curtain: "open", door: "open", furniture: "active", aiIntervening: true },
  { id: "r_wc2", name: "卫生间", floor: "f2", tempC: 24, humidity: 66, aqi: 44, light: "off", ac: "off", curtain: "closed", door: "closed", furniture: "idle" },
  { id: "r_closet", name: "衣帽间", floor: "f2", tempC: 23, humidity: 50, aqi: 40, light: "off", ac: "off", curtain: "closed", door: "closed", furniture: "idle" },
  { id: "r_balcony", name: "阳台", floor: "f2", tempC: 22, humidity: 56, aqi: 36, light: "on", ac: "off", curtain: "open", door: "open", furniture: "idle" },
];
const ROOMS_F3: Room[] = [
  { id: "r_study", name: "书房", floor: "f3", occupantId: "m_yu", occupantRole: "child", behavior: "study", tempC: 23, humidity: 50, aqi: 37, light: "on", ac: "on", curtain: "closed", door: "closed", furniture: "active", aiIntervening: true },
  { id: "r_fun", name: "休闲娱乐房", floor: "f3", tempC: 23, humidity: 51, aqi: 39, light: "off", ac: "off", curtain: "closed", door: "closed", furniture: "idle" },
  { id: "r_gym", name: "健身康复区", floor: "f3", tempC: 24, humidity: 55, aqi: 42, light: "off", ac: "off", curtain: "open", door: "open", furniture: "idle" },
  { id: "r_utility", name: "家政区", floor: "f3", tempC: 23, humidity: 53, aqi: 43, light: "off", ac: "off", curtain: "closed", door: "closed", furniture: "idle" },
  { id: "r_equip", name: "设备间", floor: "f3", tempC: 26, humidity: 48, aqi: 46, light: "on", ac: "off", curtain: "closed", door: "closed", furniture: "idle" },
  { id: "r_terrace", name: "露台", floor: "f3", tempC: 21, humidity: 57, aqi: 35, light: "on", ac: "off", curtain: "open", door: "open", furniture: "idle" },
];

export const SPACES: Space[] = [
  { id: "yard", name: "庭院", rooms: ROOMS_F1.filter((r) => r.floor === "yard") },
  { id: "f1", name: "一层", rooms: ROOMS_F1.filter((r) => r.floor === "f1") },
  { id: "f2", name: "二层", rooms: ROOMS_F2 },
  { id: "f3", name: "三层", rooms: ROOMS_F3 },
];
export const ALL_ROOMS: Room[] = [...ROOMS_F1, ...ROOMS_F2, ...ROOMS_F3];
export const roomById = (id?: string) => ALL_ROOMS.find((r) => r.id === id);
export const roomName = (id?: string) => roomById(id)?.name ?? id ?? "—";
export const FLOOR_NAME: Record<string, string> = { yard: "庭院", f1: "一层", f2: "二层", f3: "三层" };

// ───────────────────────── 设备 ─────────────────────────
export const DEVICES: Device[] = [
  { id: "d_living_light", name: "客厅主灯", roomId: "r_living", online: true, mode: "暖白 60%", params: { 亮度: "60%", 色温: "3000K" }, powerKw: 0.04, aiManaged: true, controls: [{ type: "brightness", label: "亮度" }, { type: "colortemp", label: "色温" }] },
  { id: "d_living_ac", name: "客厅空调", roomId: "r_living", online: true, mode: "制冷 24℃", params: { 温度: "24℃", 风速: "自动" }, powerKw: 0.9, aiManaged: true, controls: [{ type: "temperature", label: "温度" }, { type: "wind", label: "风速" }] },
  { id: "d_master_light", name: "主卧床底灯", roomId: "r_master", online: true, mode: "暖光 20%", params: { 亮度: "20%" }, powerKw: 0.01, aiManaged: true, controls: [{ type: "brightness", label: "亮度" }] },
  { id: "d_study_light", name: "书房护眼灯", roomId: "r_study", online: true, mode: "白光 85%", params: { 亮度: "85%", 色温: "4000K" }, powerKw: 0.02, aiManaged: true, controls: [{ type: "brightness", label: "亮度" }] },
  { id: "d_multi_ac", name: "多功能区空调", roomId: "r_multi", online: true, mode: "送风 25℃", params: { 温度: "25℃" }, powerKw: 0.3, aiManaged: true, controls: [{ type: "temperature", label: "温度" }] },
  { id: "d_vacuum", name: "清扫机器人", roomId: "r_living", online: true, mode: "待命", params: { 电量: "88%" }, powerKw: 0, aiManaged: true, controls: [{ type: "switch", label: "开关" }] },
  { id: "d_entry_lock", name: "智能门锁", roomId: "r_entry", online: true, mode: "已闭锁", params: { 状态: "闭锁" }, powerKw: 0, aiManaged: false, controls: [{ type: "switch", label: "开锁" }] },
  { id: "d_yard_light", name: "庭院灯带", roomId: "r_yard", online: true, mode: "柔光 50%", params: { 亮度: "50%" }, powerKw: 0.03, aiManaged: true, controls: [{ type: "brightness", label: "亮度" }] },
];
export const deviceByRoom = (roomId: string) => DEVICES.filter((d) => d.roomId === roomId);

// ───────────────────────── 智能场景（12 预置） ─────────────────────────
export const SCENES: Scene[] = [
  { id: "s_home", name: "回家模式", members: ["成人", "老人"], trigger: "门锁识别归家", spaces: ["玄关", "客厅", "走廊"], furniture: "鞋柜灯开启", light: "入口→客厅渐亮", air: "新风预启", safety: "撤防", energy: "恢复常态", autoAllowed: true },
  { id: "s_leave", name: "离家模式", members: ["全部"], trigger: "最后一人出门", spaces: ["全屋"], furniture: "收起", light: "全灭", air: "换气一次后关停", safety: "布防", energy: "进入节能", autoAllowed: true },
  { id: "s_host", name: "会客模式", members: ["成人"], trigger: "手动/语音", spaces: ["客厅", "餐厅"], furniture: "沙发展开", light: "温馨 70%", air: "清新", safety: "正常", energy: "适度", autoAllowed: true },
  { id: "s_study", name: "儿童学习模式", members: ["儿童"], trigger: "识别学习行为", spaces: ["书房", "儿童房"], furniture: "书桌就绪", light: "护眼 85%", air: "净化优先", safety: "禁打扰", energy: "正常", autoAllowed: true },
  { id: "s_movie", name: "观影模式", members: ["成人"], trigger: "手动/识别观影", spaces: ["客厅", "休闲娱乐房"], furniture: "幕布降下", light: "暗场 10%", air: "自动", safety: "正常", energy: "正常", autoAllowed: true },
  { id: "s_sleep", name: "睡眠模式", members: ["全部"], trigger: "夜间就寝", spaces: ["卧室"], furniture: "收起", light: "地脚微光", air: "静音换气", safety: "卧室门留缝", energy: "低谷", autoAllowed: true },
  { id: "s_elder", name: "老人夜间照护模式", members: ["老人"], trigger: "夜间离床", spaces: ["主卧", "走廊", "卫生间"], furniture: "—", light: "低位暖光路径", air: "静音", safety: "防跌监测", energy: "微耗", autoAllowed: true },
  { id: "s_patient", name: "病患休养模式", members: ["病患"], trigger: "识别休养", spaces: ["多功能空间"], furniture: "卧床舒适", light: "柔光", air: "净化", safety: "勿扰", energy: "正常", autoAllowed: true },
  { id: "s_work", name: "居家办公模式", members: ["成人"], trigger: "识别办公", spaces: ["书房", "客厅"], furniture: "工位就绪", light: "中性 80%", air: "清新", safety: "正常", energy: "正常", autoAllowed: true },
  { id: "s_clean", name: "清洁模式", members: ["全部"], trigger: "定时/手动", spaces: ["公共区"], furniture: "—", light: "全亮", air: "排尘", safety: "避让人员", energy: "错峰", autoAllowed: true },
  { id: "s_eco", name: "节能模式", members: ["全部"], trigger: "高电价/指令", spaces: ["全屋"], furniture: "—", light: "感应", air: "节能", safety: "正常", energy: "储能优先", autoAllowed: true },
  { id: "s_blackout", name: "停电保障模式", members: ["全部"], trigger: "检测到停电", spaces: ["全屋"], furniture: "—", light: "应急照明", air: "必要送风", safety: "应急通道", energy: "储能保供", autoAllowed: true },
];

// ───────────────────────── 构件库（节选） ─────────────────────────
export const COMPONENTS: ComponentItem[] = [
  { id: "c_core", name: "智居中枢主机", category: "智能中枢", space: "设备间", functions: "本地规则引擎、设备编排、隐私计算", params: ["算力", "并发"], states: ["运行", "待机"], sensors: "—", ai: "差异化方案生成", energy: "待机 5W", version: "V2.3", status: "已发布" },
  { id: "c_presence", name: "毫米波存在传感器", category: "传感器", space: "全屋", functions: "人体存在/姿态/跌倒识别", params: ["探测角", "灵敏度"], states: ["有人", "无人", "跌倒"], sensors: "毫米波+红外", ai: "行为识别", energy: "0.5W", version: "V1.8", status: "已发布" },
  { id: "c_lock", name: "AI 智能门锁", category: "安防设备", space: "玄关", functions: "人脸/指纹/远程授权", params: ["识别方式"], states: ["闭锁", "开锁"], sensors: "摄像头+指纹", ai: "身份识别", energy: "1W", version: "V3.1", status: "已发布" },
  { id: "c_pv", name: "屋顶光伏逆变器", category: "能源设备", space: "庭院/屋顶", functions: "直流转交流、MPPT 优化", params: ["功率", "效率"], states: ["发电", "待机"], sensors: "辐照/温度", ai: "发电预测", energy: "自身 2W", version: "V2.0", status: "已发布" },
  { id: "c_storage", name: "家庭储能柜", category: "能源设备", space: "设备间", functions: "峰谷充放、应急保供", params: ["容量", "SOC"], states: ["充电", "放电", "待机"], sensors: "BMS", ai: "调度优化", energy: "±10kW", version: "V1.5", status: "已发布" },
  { id: "c_curtain", name: "智能窗帘电机", category: "建筑与基础空间", space: "全屋", functions: "开合比例、光照联动", params: ["开合比"], states: ["开", "关", "比例"], sensors: "光照", ai: "光照联动", energy: "4W", version: "V2.2", status: "已发布" },
];
export const COMPONENT_CATEGORIES = ["建筑与基础空间", "玄关", "客厅", "厨房", "卧室", "书房", "休闲娱乐房", "健身康复区", "卫生间", "家政与阳台", "庭院景观", "智能中枢", "传感器", "安防设备", "能源设备"];

// ───────────────────────── 能源（实时示例） ─────────────────────────
export const ENERGY: EnergyState = {
  solarKw: 4.2, loadKw: 3.1, socPct: 68, chargeKw: 2.4, gridKw: -0.5,
  evKw: 0, todayGenKwh: 18.6, todayUseKwh: 22.4, selfUsePct: 78, sustainH: 9.5,
  mode: "自发自用优先",
};

// ───────────────────────── 安全（实时示例） ─────────────────────────
export const SAFETY: SafetyState = {
  lock: "locked", doorWindow: "normal", gas: "normal", smoke: "normal", water: "normal",
  airAnomaly: false, elderNight: false, childDanger: false, noActivity: false,
  abnormalBed: false, sos: false, storage: "ok", risk: "normal",
};

// ───────────────────────── 近期记录（时间线示例） ─────────────────────────
export const RECENT_LOG = [
  { t: "14:32", who: "AI中枢", text: "识别小宇进入书房并启动儿童学习模式", cat: "scene" as const },
  { t: "14:20", who: "AI中枢", text: "李奶奶于家庭起居区活动，已开启通畅照明", cat: "care" as const },
  { t: "14:05", who: "爸爸", text: "启动会客模式，客厅调至温馨 70%", cat: "user" as const },
  { t: "13:50", who: "AI中枢", text: "多功能空间切换为病患休养模式", cat: "scene" as const },
  { t: "13:30", who: "系统", text: "储能达 68%，光伏发电充足", cat: "energy" as const },
];
