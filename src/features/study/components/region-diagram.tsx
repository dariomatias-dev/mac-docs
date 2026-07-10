export function RegionDiagram({
  xMax,
  yMax,
  xSplit,
  ySplit,
  highlight,
}: {
  xMax: string;
  yMax: string;
  xSplit: string;
  ySplit: string;
  highlight: "bottom-left" | "bottom-right" | "top-left" | "top-right";
}) {
  const w = Number(xMax);
  const h = Number(yMax);
  const xs = Number(xSplit);
  const ys = Number(ySplit);

  const scale = 36;
  const marginLeft = 28;
  const marginBottom = 24;
  const marginTop = 12;
  const marginRight = 12;

  const px = (x: number) => marginLeft + x * scale;
  const py = (y: number) => marginTop + (h - y) * scale;

  const width = marginLeft + w * scale + marginRight;
  const height = marginTop + h * scale + marginBottom;

  const regions = {
    "bottom-left": { x: 0, y: 0, w: xs, h: ys, label: "R₁" },
    "bottom-right": { x: xs, y: 0, w: w - xs, h: ys, label: "R₂" },
    "top-right": { x: xs, y: ys, w: w - xs, h: h - ys, label: "R₃" },
    "top-left": { x: 0, y: ys, w: xs, h: h - ys, label: "R₄" },
  } as const;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="text-foreground mx-auto"
    >
      <line x1={px(0)} y1={py(0)} x2={px(w)} y2={py(0)} stroke="currentColor" strokeWidth={1.5} />
      <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(h)} stroke="currentColor" strokeWidth={1.5} />

      <line
        x1={px(xs)}
        y1={py(0)}
        x2={px(xs)}
        y2={py(h)}
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.6}
      />
      <line
        x1={px(0)}
        y1={py(ys)}
        x2={px(w)}
        y2={py(ys)}
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.6}
      />

      {(
        Object.entries(regions) as [keyof typeof regions, (typeof regions)[keyof typeof regions]][]
      ).map(([key, r]) => (
        <g key={key}>
          {key === highlight && (
            <rect
              x={px(r.x)}
              y={py(r.y + r.h)}
              width={r.w * scale}
              height={r.h * scale}
              fill="currentColor"
              opacity={0.12}
            />
          )}
          <text
            x={px(r.x + r.w / 2)}
            y={py(r.y + r.h / 2)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={13}
            fill="currentColor"
          >
            {r.label}
          </text>
        </g>
      ))}

      {[1, 2, 3, 4, 5]
        .filter((x) => x <= w)
        .map((x) => (
          <text
            key={`x${x}`}
            x={px(x)}
            y={py(0) + 14}
            textAnchor="middle"
            fontSize={10}
            fill="currentColor"
          >
            {x}
          </text>
        ))}
      {[1, 2, 3, 4, 5, 6, 7]
        .filter((y) => y <= h)
        .map((y) => (
          <text
            key={`y${y}`}
            x={marginLeft - 8}
            y={py(y) + 3}
            textAnchor="end"
            fontSize={10}
            fill="currentColor"
          >
            {y}
          </text>
        ))}
    </svg>
  );
}
