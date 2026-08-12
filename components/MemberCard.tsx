import PersonaAvatar from "./PersonaAvatar";
import type { Member, Role, Activity } from "@/lib/types";
import { roomName, behaviorLabel } from "@/lib/data";

const ROLE_LABEL: Record<Role, string> = {
  elder: "老人", teen: "青少年", child: "儿童", adult: "成人", pregnant: "孕妇",
  patient: "病患", recovering: "康复", limited: "行动不便", wheelchair: "轮椅",
  caregiver: "护理", staff: "家政", guest: "访客",
};
const ACT_LABEL: Record<Activity, string> = { home: "在家", out: "外出", sleep: "睡眠", active: "活动中", rest: "休息" };

export default function MemberCard({ m }: { m: Member }) {
  const s = m.current;
  return (
    <div className="card card-pad flex gap-3 items-center">
      <div className="shrink-0">
        <PersonaAvatar role={m.role} activity={s?.activity ?? "home"} size={56} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold" style={{ color: "var(--text)" }}>{m.name}</span>
          <span className="chip">{ROLE_LABEL[m.role]}</span>
          {s?.needAttention && <span className="chip chip-warn">需关注</span>}
        </div>
        <div className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>{m.relation} · {m.age}岁</div>
        {s && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            <span className="chip">{ACT_LABEL[s.activity]}</span>
            <span className="chip">{roomName(s.room)}</span>
            <span className="chip chip-ai">{behaviorLabel(s.behavior)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
