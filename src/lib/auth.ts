import { redirect } from "@tanstack/react-router";
import { API_BASE_URL,
  apiJson,
  clearAccessToken,
  ensureAccessToken,
  errorMessage,
  setAccessToken,
} from "@/lib/api";
import { useSessionStore, type AuthRole, type AuthUser } from "@/hooks/useSessionStore";

type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  otpCode: string;
  phone?: string;
};

type OtpResponse = {
  ok: boolean;
  expiresAt: string;
  devOtp?: string;
};

let sessionPromise: Promise<AuthUser | null> | null = null;

export async function requestLoginOtp(email: string, password: string) {
  return authRequest<OtpResponse>("/auth/login/otp", { email, password });
}

export async function requestRegisterOtp(email: string) {
  return authRequest<OtpResponse>("/auth/register/otp", { email });
}

export async function login(email: string, password: string, otpCode: string) {
  const session = await authRequest<AuthResponse>("/auth/login", { email, password, otpCode });
  setAuthenticatedSession(session);
  return session.user;
}

export async function register(input: RegisterInput) {
  const session = await authRequest<AuthResponse>("/auth/register", input);
  setAuthenticatedSession(session);
  return session.user;
}

export async function logout() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    clearAccessToken();
    useSessionStore.getState().setSession(null);
  }
}

export async function loadProfile() {
  const hasAccessToken = await ensureAccessToken();
  if (!hasAccessToken) {
    useSessionStore.getState().setSession(null);
    return null;
  }
  const user = await apiJson<AuthUser>("/auth/profile");
  useSessionStore.getState().setSession(user);
  return user;
}

export async function ensureSession() {
  const state = useSessionStore.getState();
  if (state.user) return state.user;
  if (sessionPromise) return sessionPromise;

  useSessionStore.getState().setStatus("loading");
  sessionPromise = loadProfile()
    .catch(() => {
      useSessionStore.getState().setSession(null);
      return null;
    })
    .finally(() => {
      sessionPromise = null;
    });

  return sessionPromise;
}

export async function requireRoles(roles: AuthRole[], redirectTo: string) {
  const user = await ensureSession();

  if (!user) {
    throw redirect({
      to: "/signin",
      search: { redirect: redirectTo },
    });
  }

  if (!roles.includes(user.role)) {
    throw redirect({
      to: user.role === "EMPLOYEE" ? "/employee" : "/dashboard",
    });
  }

  return user;
}

function setAuthenticatedSession(session: AuthResponse) {
  setAccessToken(session.accessToken);
  useSessionStore.getState().setSession(session.user);
}

async function authRequest<T>(path: string, body: unknown) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const message = await safeText(res);
    throw new Error(errorMessage(message) || `Auth request failed (${res.status})`);
  }

  return (await res.json()) as T;
}

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return undefined;
  }
}
