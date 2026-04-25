export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.toString().trim() || "https://hnp-api.onrender.com/";

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
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    const bodyText = await safeText(res);
    throw new ApiError(`API ${res.status} for ${path}`, res.status, bodyText);
  }

  return (await res.json()) as T;
}

export async function apiText(
  path: string,
  init: RequestInit & { headers?: Record<string, string> } = {},
): Promise<string> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, { ...init, headers: init.headers ?? {} });
  if (!res.ok) {
    const bodyText = await safeText(res);
    throw new ApiError(`API ${res.status} for ${path}`, res.status, bodyText);
  }
  return await res.text();
}

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return undefined;
  }
}
