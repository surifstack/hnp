export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.toString().trim() ||
  "https://hnp-api.onrender.com/api";

// ❌ REMOVED: localStorage completely

// -------------------- API CORE --------------------

export async function ensureAccessToken() {
  // Cookie-based auth: access token is in an httpOnly cookie.
  // Session is maintained by the server via an httpOnly cookie.
  return true;
}

export class ApiError extends Error {
  status: number;
  bodyText?: string;

  constructor(message: string, status: number, bodyText?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.bodyText = bodyText;
  }
}

// -------------------- API REQUEST --------------------

export async function apiJson<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await apiFetch(path, init);
  return res.json();
}

export async function apiText(
  path: string,
  init: RequestInit = {},
): Promise<string> {
  const res = await apiFetch(path, init);
  return res.text();
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> ?? {}),
  };

  // If body is FormData, the browser must set boundary Content-Type
  if (init.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const res = await fetch(url, {
    ...init,
    credentials: "include", // IMPORTANT for cookies
    headers,
  });

  if (!res.ok) {
    const text = await safeText(res);
    throw new ApiError(
      errorMessage(text) || `API Error ${res.status}`,
      res.status,
      text,
    );
  }

  return res;
}

// -------------------- HELPERS --------------------

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return undefined;
  }
}

export function errorMessage(bodyText?: string) {
  if (!bodyText) return "";

  try {
    const body = JSON.parse(bodyText);

    if (Array.isArray(body.message)) {
      return body.message.join(", ");
    }

    return body.message || body.error || bodyText;
  } catch {
    return bodyText;
  }
}
