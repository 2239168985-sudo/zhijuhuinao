// 智居慧脑 · 核心类型定义

export type Role =
  | "elder" | "teen" | "child" | "adult" | "pregnant" | "patient"
  | "recovering" | "limited" | "wheelchair" | "caregiver" | "staff" | "guest";

export type Mobility = "full" | "assisted" | "wheelchair" | "bedridden";
export type Risk = "normal" | "attention" | "warning" | "emergency";
export type Floor = "yard" | "f1" | "f2" | "f3";
export type Activity = "home" | "out" | "sleep" | "active" | "rest";

export interface MemberState {
  floor: Floor;
  room: string;       // room id
  behavior: string;   // behavior id
  activity: Activity;
  needAttention: boolean;
  updatedAt: string;
}

export interface Member {
  id: string;
  name: string;
  relation: string;
  role: Role;
  age: number;
  height: number;
  mobility: Mobility;
  routine: string;
  floors: Floor[];
  rooms: string[];
  behaviors: string[];
  lightPref: string;
  tempPref: number;
  airPref: string;
  sleepHabit: string;
  safetyNeed: string;
  careNeed: string;
  allowAuto: boolean;
  needConfirm: string[];
  current?: MemberState;
}

export interface Room {
  id: string;
  name: string;
  floor: Floor;
  occupantId?: string;
  occupantRole?: Role;
  behavior?: string;
  tempC: number;
  humidity: number;
  aqi: number;
  light: "on" | "off" | "dim";
  ac: "on" | "off";
  curtain: "open" | "closed";
  door: "open" | "closed";
  furniture: "idle" | "active";
  alert?: string;
  aiIntervening?: boolean;
}

export interface Space {
  id: Floor;
  name: string;
  rooms: Room[];
}

export interface DeviceControl {
  type: "switch" | "mode" | "brightness" | "colortemp" | "temperature" | "wind" | "ratio" | "furniture" | "charge" | "storage";
  label: string;
}
export interface Device {
  id: string;
  name: string;
  roomId: string;
  online: boolean;
  mode: string;
  params: Record<string, string | number>;
  powerKw: number;
  aiManaged: boolean;
  controls: DeviceControl[];
}

export interface Scene {
  id: string;
  name: string;
  members: string[];
  trigger: string;
  spaces: string[];
  furniture: string;
  light: string;
  air: string;
  safety: string;
  energy: string;
  autoAllowed: boolean;
}

export interface ComponentItem {
  id: string;
  name: string;
  category: string;
  space: string;
  functions: string;
  params: string[];
  states: string[];
  sensors: string;
  ai: string;
  energy: string;
  version: string;
  status: string;
}

export interface EnergyState {
  solarKw: number;
  loadKw: number;
  socPct: number;
  chargeKw: number;
  gridKw: number;
  evKw: number;
  todayGenKwh: number;
  todayUseKwh: number;
  selfUsePct: number;
  sustainH: number;
  mode: string;
}

export interface SafetyState {
  lock: "locked" | "unlocked";
  doorWindow: "normal" | "abnormal";
  gas: "normal" | "leak";
  smoke: "normal" | "alert";
  water: "normal" | "leak";
  airAnomaly: boolean;
  elderNight: boolean;
  childDanger: boolean;
  noActivity: boolean;
  abnormalBed: boolean;
  sos: boolean;
  storage: "ok" | "low";
  risk: Risk;
}

// ── 规则引擎 ──
export interface Action {
  key: string;
  type: "device" | "scene" | "notify" | "check" | "energy";
  target: string;
  op: string;
  params?: Record<string, unknown>;
  sticky?: boolean;
  reason: string;
}
export interface Match {
  roles?: Role[];
  behaviors?: string[];
  spaces?: string[];
  floors?: Floor[];
  mobility?: Mobility[];
  ageMin?: number;
  ageMax?: number;
  hour?: [number, number];
  isWeekend?: boolean;
  tempC?: [number, number];
  lux?: [number, number];
  aqi?: [number, number];
  socPct?: [number, number];
  solarKw?: [number, number];
  gridDown?: boolean;
  evCharging?: boolean;
  risk?: Risk[];
}
export interface Rule {
  id: string;
  domain: "behavior" | "safety" | "energy";
  title: string;
  match: Match;
  actions: Action[];
  priority: number;
}
export interface Plan {
  id: string;
  domain: "behavior" | "safety" | "energy";
  title: string;
  actions: Action[];
  firedRules: string[];
  score: number;
}
export interface Context {
  member?: Member;
  behavior?: string;
  space?: string;
  floor?: Floor;
  time: { hour: number; isWeekend: boolean };
  env: { tempC: number; lux: number; aqi: number; humidity: number };
  devices: Record<string, string>;
  energy: EnergyState;
  risk: Risk;
  gridDown?: boolean;
  evCharging?: boolean;
  scenarioId?: string;
}
