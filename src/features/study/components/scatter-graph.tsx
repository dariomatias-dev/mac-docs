export function ScatterGraph({
  label,
  xMax,
  yMax,
  points,
}: {
  label: string;
  xMax: string;
  yMax: string;
  points: string;
}) {
  const w = Number(xMax);
  const h = Number(yMax);
  const coords = points
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x, y] = pair.split(",").map(Number);
      return { x, y };
    });

  const scale = 22;
  const marginLeft = 22;
  const marginBottom = 20;
  const marginTop = 22;
  const marginRight = 10;

  const px = (x: number) => marginLeft + x * scale;
  const py = (y: number) => marginTop + (h - y) * scale;

  const width = marginLeft + w * scale + marginRight;
  const height = marginTop + h * scale + marginBottom;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="text-foreground mx-auto"
    >
      <text x={marginLeft} y={12} fontSize={12} fontWeight={600} fill="currentColor">
        {label}
      </text>

      <line x1={px(0)} y1={py(0)} x2={px(w)} y2={py(0)} stroke="currentColor" strokeWidth={1.5} />
      <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(h)} stroke="currentColor" strokeWidth={1.5} />

      {coords.map(({ x, y }) => (
        <g key={`${x},${y}`}>
          <line
            x1={px(0)}
            y1={py(y)}
            x2={px(x)}
            y2={py(y)}
            stroke="currentColor"
            strokeWidth={1}
            strokeDasharray="3 2"
            opacity={0.6}
          />
          <line
            x1={px(x)}
            y1={py(0)}
            x2={px(x)}
            y2={py(y)}
            stroke="currentColor"
            strokeWidth={1}
            strokeDasharray="3 2"
            opacity={0.6}
          />
          <circle cx={px(x)} cy={py(y)} r={3} fill="currentColor" />
        </g>
      ))}

      {Array.from({ length: w }, (_, i) => i + 1).map((x) => (
        <text
          key={`x${x}`}
          x={px(x)}
          y={py(0) + 13}
          textAnchor="middle"
          fontSize={9}
          fill="currentColor"
        >
          {x}
        </text>
      ))}
      {Array.from({ length: h }, (_, i) => i + 1).map((y) => (
        <text
          key={`y${y}`}
          x={marginLeft - 6}
          y={py(y) + 3}
          textAnchor="end"
          fontSize={9}
          fill="currentColor"
        >
          {y}
        </text>
      ))}
    </svg>
  );
}
