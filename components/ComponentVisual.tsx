"use client";

/* ── 程序化构件可视化（深色科技风 · 按设备类型分形） ── */

type DeviceType = "appliance" | "sensor" | "panel" | "furniture" | "structure" | "server" | "green";

export default function ComponentVisual({
  item,
  size = 280,
}: {
  item: { name: string; smart?: boolean; device?: DeviceType };
  size?: number;
}) {
  const isSmart = !!item.smart;
  const device = (item.device || "sensor") as DeviceType;

  // 深色风统一配色
  const gold = "#d4a853";
  const cyan = "#34d399";
  const blue = "#3b82f6";
  const sub = "rgba(255,255,255,0.12)";
  const mid = "rgba(255,255,255,0.35)";
  const glowGold = "rgba(212,168,83,0.18)";
  const glowCyan = "rgba(52,211,153,0.15)";

  /* ── 家电（洗衣机/空调/冰箱等）── 圆筒机身 + 控制区 ── */
  if (device === "appliance") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label={item.name + " 示意图"}>
        <rect width={size} height={size} rx="20" fill="rgba(255,255,255,0.03)" stroke={sub} strokeWidth="1" />
        {isSmart && <circle cx={size-20} cy={20} r="6" fill={cyan}><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/></circle>}

        {/* 机身外框 - 圆角矩形 */}
        <rect x={size*0.22} y={size*0.14} width={size*0.56} height={size*0.68} rx={size*0.08} fill="rgba(255,255,255,0.04)" stroke={mid} strokeWidth="1.2"/>

        {/* 门/视窗 - 大圆 */}
        <circle cx={size*0.5} cy={size*0.4} r={size*0.2} fill="rgba(255,255,255,0.03)" stroke={sub} strokeWidth="1"/>
        <circle cx={size*0.5} cy={size*0.4} r={size*0.14} fill="rgba(212,168,83,0.06)" stroke={glowGold} strokeWidth="0.8">
          <animate attributeName="r" values={`${size*0.14};${size*0.145};${size*0.14}`} dur="3s" repeatCount="indefinite"/>
        </circle>

        {/* 控制面板区 */}
        <rect x={size*0.3} y={size*0.62} width={size*0.4} height={size*0.14} rx="6" fill="rgba(255,255,255,0.03)" stroke={sub} strokeWidth="0.8"/>
        {/* LED 显示屏 */}
        <rect x={size*0.34} y={size*0.645} width={size*0.18} height={size*0.04} rx="3" fill="rgba(52,211,153,0.1)" stroke={glowCyan} strokeWidth="0.5"/>
        {/* 旋钮 */}
        <circle cx={size*0.62} cy={size*0.67} r={size*0.035} fill="none" stroke={mid} strokeWidth="1.2"/>
        <circle cx={size*0.62} cy={size*0.67} r={size*0.015} fill={gold}>
          <animateTransform attributeName="transform" type="rotate" from={`0 ${size*0.62} ${size*0.67}`} to={`360 ${size*0.62} ${size*0.67}`} dur="8s" repeatCount="indefinite"/>
        </circle>
        {/* 指示灯行 */}
        {[0.72, 0.76, 0.80].map((cy, i) => (
          <circle key={i} cx={size*0.36+i*size*0.06} cy={size*cy} r={size*0.009}
            fill={i===1?cyan:i===0?gold:"rgba(255,255,255,0.25)"}
            opacity={i===1?0.9:0.5}>
            {i===1 && <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite"/>}
          </circle>
        ))}

        {/* 底座线条 */}
        <rect x={size*0.28} y={size*0.84} width={size*0.44} height={size*0.025} rx="3" fill={sub}/>
        <text x={size/2} y={size-16} textAnchor="middle" fontSize="11" fontWeight="600" fill={mid} letterSpacing="0.02em">
          {item.name.length > 12 ? item.name.slice(0,11)+"…" : item.name}
        </text>
      </svg>
    );
  }

  /* ── 传感器 ── 小模块 + 探头/天线 ── */
  if (device === "sensor") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label={item.name + " 示意图"}>
        <rect width={size} height={size} rx="20" fill="rgba(255,255,255,0.03)" stroke={sub} strokeWidth="1" />
        {isSmart && <circle cx={size-20} cy={20} r="6" fill={cyan}><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/></circle>}

        {/* 主体 - 小圆角方块 */}
        <rect x={size*0.32} y={size*0.35} width={size*0.36} height={size*0.28} rx="8" fill="rgba(255,255,255,0.05)" stroke={mid} strokeWidth="1.2"/>

        {/* 探头/感应区 */}
        <circle cx={size*0.5} cy={size*0.27} r={size*0.07} fill="none" stroke={glowCyan} strokeWidth="1">
          <animate attributeName="r" values={`${size*0.07};${size*0.08};${size*0.07}`} dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        {/* 扫描弧线 */}
        <path d={`M ${size*0.42} ${size*0.22} A ${size*0.08} ${size*0.08} 0 0 1 ${size*0.58} ${size*0.22}`} fill="none" stroke={glowCyan} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5">
          <animate attributeName="stroke-dashoffset" from="0" to="12" dur="2s" repeatCount="indefinite"/>
        </path>

        {/* 核心 LED */}
        <circle cx={size*0.5} cy={size*0.49} r={size*0.035} fill="rgba(212,168,83,0.15)" stroke={gold} strokeWidth="0.8"/>
        <circle cx={size*0.5} cy={size*0.49} r={size*0.018} fill={gold} opacity="0.8">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
        </circle>

        {/* 指示灯 */}
        {[0.56, 0.59].map((cyRatio, i) => (
          <circle key={i} cx={size*0.44+i*size*0.05} cy={size*cyRatio} r={size*0.01}
            fill={i===0?cyan:gold} opacity={i===0?0.8:0.5}>
            {i===0 && <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>}
          </circle>
        ))}

        {/* 安装底座 */}
        <rect x={size*0.38} y={size*0.65} width={size*0.24} height={size*0.04} rx="3" fill={sub}/>
        <rect x={size*0.42} y={size*0.70} width={size*0.16} height={size*0.03} rx="2" fill={mid} opacity="0.3"/>

        <text x={size/2} y={size-16} textAnchor="middle" fontSize="11" fontWeight="600" fill={mid} letterSpacing="0.02em">
          {item.name.length > 12 ? item.name.slice(0,11)+"…" : item.name}
        </text>
      </svg>
    );
  }

  /* ── 面板/中控 ── 屏幕矩形 + 触控按钮 ── */
  if (device === "panel") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label={item.name + " 示意图"}>
        <rect width={size} height={size} rx="20" fill="rgba(255,255,255,0.03)" stroke={sub} strokeWidth="1" />
        {isSmart && <circle cx={size-20} cy={20} r="6" fill={cyan}><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/></circle>}

        {/* 外框 - 横屏比例 */}
        <rect x={size*0.15} y={size*0.26} width={size*0.7} height={size*0.46} rx="10" fill="rgba(255,255,255,0.04)" stroke={mid} strokeWidth="1.2"/>

        {/* 屏幕 */}
        <rect x={size*0.19} y={size*0.30} width={size*0.48} height={size*0.30} rx="6" fill="rgba(59,130,246,0.06)" stroke={`rgba(59,130,246,0.2)`} strokeWidth="0.8"/>
        {/* 屏幕内容 - 波形/数据线 */}
        <polyline points={`${size*0.23},${size*0.48} ${size*0.30},${size*0.38} ${size*0.37},${size*0.50} ${size*0.44},${size*0.35} ${size*0.51},${size*0.45} ${size*0.58},${size*0.36} ${size*0.63},${size*0.48}`}
          fill="none" stroke={blue} strokeWidth="1.2" opacity="0.6" strokeLinejoin="round">
          <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/>
        </polyline>

        {/* 右侧按钮组 */}
        <rect x={size*0.70} y={size*0.33} width={size*0.12} height={size*0.06} rx="4" fill="rgba(255,255,255,0.06)" stroke={sub} strokeWidth="0.6"/>
        <rect x={size*0.70} y={size*0.42} width={size*0.12} height={size*0.06} rx="4" fill="rgba(255,255,255,0.06)" stroke={sub} strokeWidth="0.6"/>
        <rect x={size*0.70} y={size*0.51} width={size*0.12} height={size*0.06} rx="4" fill="rgba(212,168,83,0.1)" stroke={gold} strokeWidth="0.6"/>

        {/* 底部状态灯 */}
        <circle cx={size*0.26} cy={size*0.64} r={size*0.01} fill={cyan} opacity="0.8">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
        </circle>

        <text x={size/2} y={size-16} textAnchor="middle" fontSize="11" fontWeight="600" fill={mid} letterSpacing="0.02em">
          {item.name.length > 12 ? item.name.slice(0,11)+"…" : item.name}
        </text>
      </svg>
    );
  }

  /* ── 家具 ── 轮廓外形 ── */
  if (device === "furniture") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label={item.name + " 示意图"}>
        <rect width={size} height={size} rx="20" fill="rgba(255,255,255,0.03)" stroke={sub} strokeWidth="1" />
        {isSmart && <circle cx={size-20} cy={20} r="6" fill={cyan}><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/></circle>}

        {/* 桌面/台面 */}
        <rect x={size*0.16} y={size*0.40} width={size*0.68} height={size*0.05} rx="4" fill="rgba(255,255,255,0.07)" stroke={mid} strokeWidth="1"/>
        {/* 左腿 */}
        <rect x={size*0.20} y={size*0.46} width={size*0.045} height={size*0.30} rx="3" fill="rgba(255,255,255,0.04)" stroke={sub} strokeWidth="0.8"/>
        {/* 右腿 */}
        <rect x={size*0.755} y={size*0.46} width={size*0.045} height={size*0.30} rx="3" fill="rgba(255,255,255,0.04)" stroke={sub} strokeWidth="0.8"/>

        {/* 桌面上的智能模块 */}
        <rect x={size*0.36} y={size*0.30} width={size*0.28} height={size*0.08} rx="5" fill="rgba(212,168,83,0.06)" stroke={gold} strokeWidth="0.8"/>
        <circle cx={size*0.42} cy={size*0.34} r={size*0.012} fill={gold} opacity="0.7">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
        </circle>

        {/* 嵌入式触控条 */}
        <rect x={size*0.22} y={size*0.41} width={size*0.3} height={size*0.025} rx="3" fill="rgba(52,211,153,0.08)" stroke={glowCyan} strokeWidth="0.5"/>

        <text x={size/2} y={size-16} textAnchor="middle" fontSize="11" fontWeight="600" fill={mid} letterSpacing="0.02em">
          {item.name.length > 12 ? item.name.slice(0,11)+"…" : item.name}
        </text>
      </svg>
    );
  }

  /* ── 结构/墙体 ── 截面图 ── */
  if (device === "structure") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label={item.name + " 示意图"}>
        <rect width={size} height={size} rx="20" fill="rgba(255,255,255,0.03)" stroke={sub} strokeWidth="1" />
        {isSmart && <circle cx={size-20} cy={20} r="6" fill={cyan}><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/></circle>}

        {/* 墙体截面 - 多层 */}
        <rect x={size*0.18} y={size*0.18} width={size*0.64} height={size*0.64} rx="6" fill="rgba(255,255,255,0.03)" stroke={mid} strokeWidth="1.2"/>
        {/* 内层 */}
        <rect x={size*0.24} y={size*0.24} width={size*0.52} height={size*0.52} rx="4" fill="rgba(255,255,255,0.02)" stroke={sub} strokeWidth="0.8"/>
        {/* 布线层 */}
        <line x1={size*0.24} y1={size*0.42} x2={size*0.76} y2={size*0.42} stroke={glowGold} strokeWidth="0.8" strokeDasharray="4 4" opacity="0.5">
          <animate attributeName="stroke-dashoffset" from="0" to="16" dur="2s" repeatCount="indefinite"/>
        </line>
        <line x1={size*0.50} y1={size*0.24} x2={size*0.50} y2={size*0.76} stroke={glowCyan} strokeWidth="0.6" strokeDasharray="3 3" opacity="0.4"/>

        {/* 预留接口 */}
        <circle cx={size*0.36} cy={size*0.50} r={size*0.028} fill="none" stroke={gold} strokeWidth="1"/>
        <circle cx={size*0.64} cy={size*0.50} r={size*0.028} fill="none" stroke={blue} strokeWidth="1"/>
        <circle cx={size*0.50} cy={size*0.34} r={size*0.022} fill="none" stroke={cyan} strokeWidth="0.8"/>

        {/* 标注文字 */}
        <text x={size*0.36} y={size*0.55} textAnchor="middle" fontSize="8" fill={mid}>强电</text>
        <text x={size*0.64} y={size*0.55} textAnchor="middle" fontSize="8" fill={mid}>弱电</text>
        <text x={size*0.50} y={size*0.29} textAnchor="middle" fontSize="8" fill={mid}>管井</text>

        <text x={size/2} y={size-16} textAnchor="middle" fontSize="11" fontWeight="600" fill={mid} letterSpacing="0.02em">
          {item.name.length > 12 ? item.name.slice(0,11)+"…" : item.name}
        </text>
      </svg>
    );
  }

  /* ── 中枢服务器 ── 机架式 ── */
  if (device === "server") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label={item.name + " 示意图"}>
        <rect width={size} height={size} rx="20" fill="rgba(255,255,255,0.03)" stroke={sub} strokeWidth="1" />
        {isSmart && <circle cx={size-20} cy={20} r="6" fill={cyan}><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/></circle>}

        {/* 机架外框 */}
        <rect x={size*0.28} y={size*0.16} width={size*0.44} height={size*0.66} rx="8" fill="rgba(255,255,255,0.04)" stroke={mid} strokeWidth="1.2"/>

        {/* 机架单元（多层） */}
        {[0.21, 0.34, 0.47, 0.60].map((yRatio, i) => (
          <g key={i}>
            <rect x={size*0.32} y={size*yRatio} width={size*0.36} height={size*0.09} rx="4"
              fill={i===1?"rgba(52,211,153,0.05)":i===2?"rgba(212,168,83,0.06)":"rgba(255,255,255,0.03)"}
              stroke={sub} strokeWidth="0.8"/>
            {/* 指示灯 */}
            <circle cx={size*0.36} cy={size*(yRatio+0.045)} r={size*0.008}
              fill={i<3?cyan:gold} opacity="0.8">
              {(i===0||i===2) && <animate attributeName="opacity" values="0.3;1;0.3" dur={(1.2+i*0.5)+"s"} repeatCount="indefinite"/>}
            </circle>
            {/* 散热孔 */}
            {[0.54, 0.60, 0.66, 0.72].map((xr, j) => (
              <line key={j} x1={size*xr} y1={size*(yRatio+0.03)} x2={size*xr} y2={size*(yRatio+0.06)}
                stroke={mid} strokeWidth="0.6" opacity="0.3"/>
            ))}
          </g>
        ))}

        {/* 核心发光环 */}
        <circle cx={size*0.5} cy={size*0.405} r={size*0.06} fill="none" stroke={glowGold} strokeWidth="1">
          <animate attributeName="r" values={`${size*0.06};${size*0.07};${size*0.06}`} dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite"/>
        </circle>

        <text x={size/2} y={size-16} textAnchor="middle" fontSize="11" fontWeight="600" fill={mid} letterSpacing="0.02em">
          {item.name.length > 12 ? item.name.slice(0,11)+"…" : item.name}
        </text>
      </svg>
    );
  }

  /* ── 能源（光伏/储能） ── */
  if (device === "green") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label={item.name + " 示意图"}>
        <rect width={size} height={size} rx="20" fill="rgba(255,255,255,0.03)" stroke={sub} strokeWidth="1" />
        {isSmart && <circle cx={size-20} cy={20} r="6" fill={cyan}><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/></circle>}

        {/* 光伏板倾斜面 */}
        <polygon points={`${size*0.22},${size*0.62} ${size*0.78},${size*0.62} ${size*0.68},${size*0.22} ${size*0.32},${size*0.22}`}
          fill="rgba(52,211,153,0.05)" stroke={glowCyan} strokeWidth="1.2"/>

        {/* 格栅线 */}
        {[0.30, 0.38, 0.46, 0.54].map((xRatio, i) => (
          <line key={i} x1={size*xRatio} y1={size*0.22+((size*xRatio-size*0.32)*0.77)} x2={size*xRatio} y2={size*0.62}
            stroke={sub} strokeWidth="0.6" opacity="0.4"/>
        ))}
        {[0.32, 0.42, 0.52].map((yRatio, i) => (
          <line key={i} x1={size*0.22+(size*0.1)*(yRatio-0.22)/0.4} y1={size*yRatio}
            x2={size*0.78-(size*0.1)*(yRatio-0.22)/0.4} y2={size*yRatio}
            stroke={sub} strokeWidth="0.6" opacity="0.4"/>
        ))}

        {/* 能量流动光线 */}
        <line x1={size*0.5} y1={size*0.12} x2={size*0.5} y2={size*0.20} stroke={gold} strokeWidth="1.5" opacity="0.6">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite"/>
        </line>

        {/* 储能单元 */}
        <rect x={size*0.34} y={size*0.68} width={size*0.32} height={size*0.12} rx="6" fill="rgba(212,168,83,0.06)" stroke={gold} strokeWidth="0.8"/>
        {/* 电量指示 */}
        <rect x={size*0.37} y={size*0.73} width={size*0.20} height={size*0.04} rx="2" fill="rgba(255,255,255,0.05)"/>
        <rect x={size*0.37} y={size*0.73} width={size*0.14} height={size*0.04} rx="2" fill={cyan} opacity="0.7">
          <animate attributeName="width" values={`${size*0.12};${size*0.18};${size*0.12}`} dur="4s" repeatCount="indefinite"/>
        </rect>

        <text x={size/2} y={size-16} textAnchor="middle" fontSize="11" fontWeight="600" fill={mid} letterSpacing="0.02em">
          {item.name.length > 12 ? item.name.slice(0,11)+"…" : item.name}
        </text>
      </svg>
    );
  }

  /* ── 默认 fallback（通用圆形） ── */
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label={item.name + " 示意图"}>
      <rect width={size} height={size} rx="20" fill="rgba(255,255,255,0.03)" stroke={sub} strokeWidth="1" />
      {isSmart && <circle cx={size-20} cy={20} r="6" fill={cyan}><animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/></circle>}
      <circle cx={size/2} cy={size*0.4} r={size*0.26} fill="none" stroke="rgba(212,168,83,0.15)" strokeWidth="1.5">
        <animate attributeName="r" values={`${size*0.26};${size*0.28};${size*0.26}`} dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx={size/2} cy={size*0.4} r={size*0.2} fill="rgba(255,255,255,0.05)" stroke={sub} strokeWidth="1.5"/>
      <circle cx={size/2} cy={size*0.4} r={size*0.11} fill="rgba(212,168,83,0.08)"/>
      <circle cx={size/2} cy={size*0.4} r={size*0.055} fill={gold} opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      {[0.28, 0.36, 0.44, 0.52, 0.60].map((cyRatio, i) => (
        <circle key={i} cx={size*0.5} cy={size*cyRatio} r={size*0.012}
          fill={i === 2 ? "#34d399" : mid} opacity={i === 2 ? 0.9 : 0.5}>
          {i === 2 && <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite"/>}
        </circle>
      ))}
      <rect x={size*0.35} y={size*0.66} width={size*0.3} height={size*0.055} rx="3" fill={sub}/>
      <rect x={size*0.4} y={size*0.73} width={size*0.2} height={size*0.035} rx="2" fill={mid} opacity="0.4"/>
      <text x={size/2} y={size-18} textAnchor="middle" fontSize="11" fontWeight="600" fill={mid} letterSpacing="0.02em">
        {item.name.length > 12 ? item.name.slice(0,11)+"…" : item.name}
      </text>
    </svg>
  );
}
