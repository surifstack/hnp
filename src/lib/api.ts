export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.toString().trim() || "https://hnp-api.onrender.com";

type RefreshResponse = {
  accessToken: string;
};

let refreshPromise: Promise<boolean> | null = null;

const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';

export function setAccessToken(token: string | null) {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

export async function ensureAccessToken() {
  if (getAccessToken()) return true;
  return refreshAccessToken();
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

export async function apiJson<T>(
  path: string,
  init: RequestInit & { headers?: Record<string, string> } = {},
): Promise<T> {
  const res = await apiFetch(path, init);

  return (await res.json()) as T;
}

export async function apiText(
  path: string,
  init: RequestInit & { headers?: Record<string, string> } = {},
): Promise<string> {
  const res = await apiFetch(path, init, false);
  return await res.text();
}

async function apiFetch(
  path: string,
  init: RequestInit & { headers?: Record<string, string> } = {},
  json = true,
  retry = true,
) {
  const currentAccessToken = getAccessToken();
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...(currentAccessToken ? { Authorization: `Bearer ${currentAccessToken}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (res.status === 401 && retry && (await refreshAccessToken())) {
    return apiFetch(path, init, json, false);
  }

  if (!res.ok) {
    const bodyText = await safeText(res);
    throw new ApiError(errorMessage(bodyText) || `API ${res.status} for ${path}`, res.status, bodyText);
  }

  return res;
}

async function refreshAccessToken() {
  refreshPromise ??= (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        clearAccessToken();
        return false;
      }

      const body = (await res.json()) as RefreshResponse;
      setAccessToken(body.accessToken);
      return true;
    } catch {
      clearAccessToken();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

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
    const body = JSON.parse(bodyText) as { message?: unknown; error?: unknown };
    if (Array.isArray(body.message)) return body.message.join(", ");
    if (typeof body.message === "string") return body.message;
    if (typeof body.error === "string") return body.error;
  } catch {
    return bodyText;
  }

  return bodyText;
}
