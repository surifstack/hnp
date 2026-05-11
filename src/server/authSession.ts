import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

import { API_BASE_URL, errorMessage } from "@/lib/api";
import type { AuthUser } from "@/hooks/useSessionStore";

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return undefined;
  }
}

export const getSessionUserServerFn = createServerFn({ method: "GET" }).handler(async () => {
  const cookie = getRequestHeader("cookie") ?? "";

  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "GET",
    headers: cookie ? { cookie } : undefined,
    // NOTE: On the server, credentials doesn't automatically forward browser cookies.
    // We forward the incoming request cookie header above (when present).
  });

  if (!res.ok) {
    const text = await safeText(res);
    const msg = errorMessage(text) || `Auth profile failed (${res.status})`;
    throw new Error(msg);
  }

  return (await res.json()) as AuthUser;
});
