import type { Role, Activity } from "@/lib/types";

const STATE_COLOR: Record<Activity, string> = {
  home: "var(--ai)",
  sleep: "#6aa9ff",
  active: "var(--energy)",
  rest: "var(--text-faint)",
  out: "var(--text-faint)",
};

const ROLE_LABEL: Record<Role, string> = {
  elder: "老人", teen: "青少年", child: "儿童", adult: "成人", pregnant: "孕妇",
  patient: "病患", recovering: "康复", limited: "行动不便", wheelchair: "轮椅",
  caregiver: "护理", staff: "家政", guest: "访客",
};

export default function PersonaAvatar({ role, activity = "home", size = 96 }: { role: Role; activity?: Activity; size?: number; }) {
  const ring = STATE_COLOR[activity];
  const isChild = role === "child" || role === "teen";
  const isWheel = role === "wheelchair";
  const isElder = role === "elder";
  const isPatient = role === "patient" || role === "recovering" || role === "limited";

  const headR = isChild ? 17 : 13;
  const cx = 50;
  const headCy = isChild ? 34 : 30;
  const bodyTop = headCy + headR;

  return (
    <svg viewBox="0 0 100 110" width={size} height={size * 1.1} role="img" aria-label={`${ROLE_LABEL[role]} ${activity}`}>
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--card)" />
          <stop offset="1" stopColor="var(--bg-sunken)" />
        </linearGradient>
      </defs>

      <circle cx={cx} cy={headCy + 28} r="44" fill="none" stroke={ring} strokeWidth="2.5" opacity="0.55" />

      {isWheel && (
        <g stroke="var(--text-dim)" strokeWidth="2.4" fill="none">
          <circle cx="34" cy="88" r="11" />
          <circle cx="70" cy="88" r="11" />
          <path d="M34 88 L50 70 L66 70 M50 70 L50 58" />
        </g>
      )}

      <g fill="var(--text)" opacity="0.9">
        <circle cx={cx} cy={headCy} r={headR} />
        {isWheel ? (
          <path d={`M${cx - 16} 70 q16 -10 32 0 l-4 16 h-24 z`} />
        ) : isPatient ? (
          <path d={`M${cx - 14} ${bodyTop + 6} q14 -8 28 0 l-3 22 h-22 z`} transform="rotate(8 50 60)" />
        ) : isElder ? (
          <path d={`M${cx - 15} ${bodyTop} q15 -12 30 0 l-3 26 h-24 z`} transform="rotate(-4 50 55)" />
        ) : (
          <path d={`M${cx - 16} ${bodyTop} q16 -10 32 0 l-4 30 h-24 z`} />
        )}
      </g>

      {isElder && !isWheel && (
        <path d={`M${cx + 18} ${bodyTop + 2} L${cx + 22} 96`} stroke="var(--text-dim)" strokeWidth="2.2" fill="none" />
      )}
      {isPatient && <circle cx={cx - 22} cy={bodyTop + 4} r="6" fill="var(--bg-sunken)" stroke="var(--border)" />}

      {activity === "sleep" && <g fill={ring}><text x="74" y="30" fontSize="14" fontWeight="700">z</text></g>}
      {activity === "active" && <><circle cx="76" cy="26" r="7" fill={ring} /><text x="76" y="30" fontSize="10" fontWeight="800" fill="#fff" textAnchor="middle">!</text></>}
      {activity === "rest" && <><circle cx="76" cy="26" r="7" fill="var(--text-faint)" /><text x="76" y="30" fontSize="9" fill="var(--card)" textAnchor="middle">r</text></>}
    </svg>
  );
}
