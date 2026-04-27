import type { PmsColor } from "@/lib/api.types";

export const COLORS: Array<{ pms: PmsColor; label: string; swatch: string }> = [
  { pms: "802", label: "PMS 802", swatch: "var(--neon-green)" },
  { pms: "803", label: "PMS 803", swatch: "var(--neon-yellow)" },
  { pms: "806", label: "PMS 806", swatch: "var(--neon-pink)" },
];

export function getSwatchByPms(pms?: PmsColor) {
  const found = COLORS.find((c) => c.pms === pms);
  return found ?? COLORS[0];
}