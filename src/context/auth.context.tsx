import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { clearOnboardingSubmitted } from "@/services/onboarding-store";

export type User = {
  id: string;
  fullname: string;
  email: string;
  role: "attendee" | "organizer" | "admin";
  avatarUrl?: string;
  [key: string]: unknown;
};

type ApiResult = { success: boolean; message: string; body?: unknown };

type RegisterPayload = {
  fullname: string;
  email: string;
  password: string;
  phone: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  register: (payload: RegisterPayload) => Promise<ApiResult>;
  verifyEmail: (email: string, otp: string) => Promise<ApiResult>;
  resendOtp: (email: string) => Promise<ApiResult>;
  login: (email: string, password: string) => Promise<User>;
  forgotPassword: (email: string) => Promise<ApiResult>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<ApiResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  /** Write a fresh user object (e.g. an update endpoint's response) straight
   * into the shared cache, so every consumer (navbar, sidebar, profile page)
   * updates immediately without waiting on a refetch round-trip. */
  setUser: (user: User) => void;
  googleAuth: (accessToken: string, role?: "attendee" | "organizer") => Promise<User>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The query key for the current user — used everywhere we need to invalidate/set it
const ME_QUERY_KEY = ["auth", "me"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // The current user query. Runs on mount, refetches on focus, cached.
  const {
    data: user,
    isLoading,
  } = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: async (): Promise<User | null> => {
      try {
        const res = await api.get("/auth/me");
        return (res.body as User) ?? null;
      } catch {
        // 401 / not logged in — treat as null user, not an error
        return null;
      }
    },
    // 5-minute stale time — good for auth (don't hammer /me on every render)
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // Manually re-fetch the user (e.g. after login).
  async function refreshUser() {
    await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
  }

  // Write a known-fresh user object straight into the cache — used after
  // profile/avatar updates, where the update endpoint already hands back
  // the new user, so there's no reason to wait on a second round-trip.
  function setUser(updatedUser: User) {
    queryClient.setQueryData(ME_QUERY_KEY, updatedUser);
  }

  // --- Register ---
  async function register(payload: RegisterPayload) {
    return api.post("/auth/register", payload);
  }

  // --- Verify email with OTP ---
  async function verifyEmail(email: string, otp: string) {
    return api.post("/auth/verify-email", { email, otp });
  }

  // --- Resend the OTP ---
  async function resendOtp(email: string) {
    return api.post("/auth/resend-otp", { email });
  }

  // --- Login: server sets the cookie, then we refetch /me ---
  async function login(email: string, password: string): Promise<User> {
    await api.post("/auth/login", { email, password });
    // Refetch the user via the query so any subscriber updates
    const meRes = await api.get("/auth/me");
    const loggedInUser = meRes.body as User;
    queryClient.setQueryData(ME_QUERY_KEY, loggedInUser);
    return loggedInUser;
  }

  // --- Forgot password ---
  async function forgotPassword(email: string) {
    return api.post("/auth/forgot-password", { email });
  }

  // --- Reset password ---
  async function resetPassword(email: string, otp: string, newPassword: string) {
    return api.post("/auth/reset-password", { email, otp, newPassword });
  }

// --- Google OAuth login/register ---
async function googleAuth(accessToken: string, role?: "attendee" | "organizer") {
  await api.post("/auth/google", { accessToken, role });
  const meRes = await api.get("/auth/me");
  const loggedInUser = meRes.body as User;
  queryClient.setQueryData(ME_QUERY_KEY, loggedInUser);
  return loggedInUser;
}
  // --- Logout: server clears the cookie, we clear the cache ---
  async function logout() {
  try {
    await api.post("/auth/logout", {});
  } catch {
    // clear locally regardless
  }
  localStorage.removeItem("saved-events");
  clearOnboardingSubmitted();
  // These wizards mirror their in-progress form values to localStorage on
  // every keystroke so a refresh or "Save & exit" doesn't lose progress —
  // but that means they're keyed by browser, not by account. Without this,
  // logging out and having a different organizer log in on the same
  // device (or the same phone) would silently pre-fill their forms with
  // whoever used it last, business name/bank details and all. Raw string
  // literals here on purpose — importing the constants would pull in the
  // route modules themselves (see ONBOARDING_STORAGE_KEY in
  // routes/onboarding/layout.tsx, CREATE_EVENT_STORAGE_KEY in
  // routes/dashboard/create-event/layout.tsx, and CREATED_EVENT_ID_KEY in
  // lib/create-event-api.ts — keep these in sync if any of those rename).
  localStorage.removeItem("eventra-onboarding");
  localStorage.removeItem("eventra-create-event");
  localStorage.removeItem("eventra-create-event-id");
  queryClient.setQueryData(ME_QUERY_KEY, null);
}

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        register,
        verifyEmail,
        resendOtp,
        login,
        forgotPassword,
        resetPassword,
        logout,
        refreshUser,
        setUser,
        googleAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}