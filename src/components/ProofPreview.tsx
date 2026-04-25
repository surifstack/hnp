import { useMemo } from "react";
import type { PmsColor } from "@/lib/api.types";

function pmsToCss(pms: PmsColor | undefined) {
  if (pms === "806") return "var(--neon-pink)";
  if (pms === "803") return "var(--neon-yellow)";
  return "var(--neon-green)";
}

function linesOrFallback(lines: string[], fallback: string, max: number) {
  const cleaned = (lines ?? [])
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, max);
  if (cleaned.length > 0) return cleaned;
  return [fallback];
}

export function ProofPreview({
  titleLines,
  secondaryLines,
  labelLines,
  colorPms,
}: {
  titleLines: string[];
  secondaryLines: string[];
  labelLines: string[];
  colorPms?: PmsColor;
}) {
  const bg = useMemo(() => pmsToCss(colorPms), [colorPms]);
  const title = linesOrFallback(titleLines, "YOUR TITLE", 2);
  const secondary = linesOrFallback(secondaryLines, "Secondary title", 3);
  const label = linesOrFallback(labelLines, "Label text", 2);

  const labelText = `${label.join(" ")} • (999)999-9999`;
  const cells = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="rounded-2xl border-2 border-black bg-white overflow-hidden">
      <div className="p-4 border-b-2 border-black bg-white">
        <div className="text-center space-y-2">
          <p className="text-xl font-extrabold uppercase tracking-wide leading-tight text-black">
            {title.map((l, idx) => (
              <span key={idx} className="block">
                {l}
              </span>
            ))}
          </p>
          <p className="text-xs uppercase tracking-widest font-semibold text-black">
            {secondary.map((l, idx) => (
              <span key={idx} className="block">
                {l}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="p-4" style={{ backgroundColor: "white" }}>
        <div className="grid grid-cols-4 gap-2">
          {cells.map((i) => (
            <div
              key={i}
              className="rounded-sm border-2 border-black h-14 p-1 flex items-center justify-center text-[9px] leading-tight text-black text-center"
              style={{ backgroundColor: bg }}
            >
              <div className="max-h-full overflow-hidden">{labelText}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
