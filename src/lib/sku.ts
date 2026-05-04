import type { PmsColor, Product } from "@/lib/api.types";

type SkuVariant = "G" | "P" | "Y";

function colorToSkuVariant(colorPms: PmsColor): SkuVariant {
  // PMS 802 = Neon Green (G), PMS 806 = Neon Pink (P), PMS 803 = Neon Yellow (Y)
  if (colorPms === "802") return "G";
  if (colorPms === "806") return "P";
  return "Y";
}

export function skuForSelection(product: Product | null, colorPms: PmsColor) {
  const skus = product?.skus;
  if (!skus) return "";
  const variant = colorToSkuVariant(colorPms);
  return skus[variant] ?? "";
}
