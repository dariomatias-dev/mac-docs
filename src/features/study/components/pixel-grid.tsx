export function PixelGrid({ pattern, columns }: { pattern: string; columns: string }) {
  const cells = pattern.replace(/\s+/g, "").split("");
  const cols = Number(columns);

  return (
    <span
      className="border-border inline-grid gap-0 border align-middle"
      style={{ gridTemplateColumns: `repeat(${cols}, 1.25rem)` }}
    >
      {cells.map((cell, i) => (
        <span
          key={i}
          className="border-border aspect-square border"
          style={{ display: "block", background: cell === "1" ? "#fff" : "#111" }}
        />
      ))}
    </span>
  );
}
