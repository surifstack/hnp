import { useMemo } from "react";
import type { PmsColor } from "@/lib/api.types";

const PAGE_WIDTH_IN = 6;
const USABLE_WIDTH_IN = 5.8;
const SAFE_MARGIN_IN = 0.1;
const TOP_SAFE_OFFSET_IN = 0.2;
const BOX_GAP_IN = 0.18;
const BOX1_MAX_CHARS = 59;
const BOX2_MAX_CHARS = 158;
const DUMMY_PHONE = "(999) 999-9999";

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

function clampText(lines: string[], fallback: string, maxLines: number, maxChars: number) {
  return linesOrFallback(lines, fallback, maxLines).join(" ").slice(0, maxChars).trim();
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
  const box1Text = clampText(titleLines, "YOUR TEXT HEADLINE HERE", 2, BOX1_MAX_CHARS);
  const box2Text = clampText(
    secondaryLines,
    "Your supporting text stays centered inside the print-safe area.",
    3,
    BOX2_MAX_CHARS,
  );
  const labelText = clampText(labelLines, "YOUR TEXT", 2, 32);
  const cells = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-full overflow-x-auto rounded-2xl border-2 border-black bg-neutral-100 p-4">
      <div
        className="mx-auto overflow-hidden rounded-xl border border-black bg-white"
        style={{
          width: `${PAGE_WIDTH_IN}in`,
          minHeight: "8in",
          paddingLeft: `${SAFE_MARGIN_IN}in`,
          paddingRight: `${SAFE_MARGIN_IN}in`,
          paddingTop: `${TOP_SAFE_OFFSET_IN}in`,
          paddingBottom: "0.35in",
          boxSizing: "border-box",
        }}
      >
        <div
          className="mx-auto flex flex-col"
          style={{
            width: `${USABLE_WIDTH_IN}in`,
            maxWidth: `${USABLE_WIDTH_IN}in`,
            gap: `${BOX_GAP_IN}in`,
          }}
        >
          <div
            className="text-center font-extrabold uppercase text-black"
            style={{
              fontSize: "28pt",
              lineHeight: 1.05,
              letterSpacing: "0.02em",
              overflowWrap: "break-word",
            }}
          >
            {box1Text}
          </div>

          <div
            className="text-center text-black"
            style={{
              fontSize: "16pt",
              lineHeight: 1.25,
              overflowWrap: "break-word",
            }}
          >
            {box2Text}
          </div>
        </div>

        <div className="mx-auto mt-8 grid grid-cols-4 gap-2" style={{ width: `${USABLE_WIDTH_IN}in` }}>
          {cells.map((i) => (
            <div
              key={i}
              className="flex min-h-[58px] flex-col items-center justify-center border border-black px-2 py-2 text-center text-black"
              style={{ backgroundColor: bg }}
            >
              <p className="text-[11px] font-semibold uppercase leading-tight">{labelText}</p>
              <p className="text-[10px] leading-tight">{DUMMY_PHONE}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
