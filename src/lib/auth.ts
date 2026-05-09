
import { redirect } from "@tanstack/react-router";
import { API_BASE_URL,apiFetch, apiJson, errorMessage } from "@/lib/api";
import { useSessionStore, type AuthRole, type AuthUser } from "@/hooks/useSessionStore";
type AuthResponse = {
  user: AuthUser;
};

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  otpCode: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
};

type OtpResponse = {
  ok: boolean;
  expiresAt: string;
  devOtp?: string;
};

let sessionPromise: Promise<AuthUser | null> | null = null;

// ---------------- OTP ----------------

export async function requestLoginOtp(email: string, password: string) {
  return authRequest<OtpResponse>("/auth/login/otp", { email, password });
}

export async function requestRegisterOtp(email: string) {
  return authRequest<OtpResponse>("/auth/register/otp", { email });
}

// ---------------- AUTH ----------------

export async function login(email: string, password: string, otpCode: string) {
  const session = await authRequest<AuthResponse>("/auth/login", {
    email,
    password,
    otpCode,
  });

  setSession(session.user);
  return session.user;
}

export async function register(input: RegisterInput) {
  const session = await authRequest<AuthResponse>("/auth/register", input);

  setSession(session.user);
  return session.user;
}

// ---------------- LOGOUT ----------------

export async function logout() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } finally {
    useSessionStore.getState().setSession(null);
  }
}

// ---------------- PROFILE ----------------

export async function loadProfile() {
  const user = await apiJson<AuthUser>("/auth/profile");

  useSessionStore.getState().setSession(user);
  return user;
}

// ---------------- SESSION ----------------

export async function ensureSession() {
  const state = useSessionStore.getState();

  // If we have a user in Zustand, we are likely recovering from a page refresh.
  // Verify the session using cookie auth.
  if (state.user && !sessionPromise) {
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

// ---------------- ROLE GUARD ----------------

export async function requireRoles(roles: AuthRole[], redirectTo: string) {
  // TanStack Start can run `beforeLoad` during SSR. The server does not have
  // access to the browser cookie jar, so any API call to `/auth/profile` would
  // look unauthenticated and cause an incorrect redirect.
  // Do auth checks on the client after hydration.
  if (typeof window === "undefined") {
    return null as unknown as AuthUser;
  }

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

// ---------------- HELPERS ----------------

function setSession(user: AuthUser) {
  useSessionStore.getState().setSession(user);
}

// ---------------- AUTH REQUEST ----------------

async function authRequest<T>(path: string, body: unknown) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include", // IMPORTANT for cookies
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

// ---------------- SAFE TEXT ----------------

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return undefined;
  }
}
