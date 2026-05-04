export function formatOrderId(raw?: string | null) {
  if (!raw) return "";
  const token = raw.includes("_") ? raw.split("_").pop() : raw;
  const short = (token ?? raw)
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 8)
    .toUpperCase();
  return `ORDER-${short}`;
}
