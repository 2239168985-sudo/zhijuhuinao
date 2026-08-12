export default function TrendChart({
  data, unit = "", height = 120, color = "var(--ai)",
}: {
  data: number[]; unit?: string; height?: number; color?: string;
}) {
  const w = 320, h = height, pad = 8;
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const span = max - min || 1;
  const stepX = (w - pad * 2) / (data.length - 1 || 1);
  const pts = data.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (1 - (v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${h - pad} L${pts[0][0].toFixed(1)} ${h - pad} Z`;
  const id = "g" + Math.random().toString(36).slice(2, 7);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ height }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2.2" fill={color} />
      ))}
      <text x={pad} y={h - 1} fontSize="9" fill="var(--text-faint)">
        {data[0]}{unit} → {data[data.length - 1]}{unit}
      </text>
    </svg>
  );
}
