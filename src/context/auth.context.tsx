import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { clearOnboardingSubmitted } from "@/lib/onboarding-store";

export type User = {
  id: string;
  fullname: string;
  email: string;
  role: "attendee" | "organizer" | "admin";
  adminRole?: "owner" | "admin" | "support";
  avatarUrl?: string;
  notificationPreferences?: {
    eventReminders: boolean;
    weeklyPicks: boolean;
    organizerUpdates: boolean;
  };
  adminNotificationPreferences?: {
    approvals: boolean;
    refunds: boolean;
    reports: boolean;
    enquiries: boolean;
  };
  // This account's own display currency — available to every role, see
  // its comment on updateProfile (lib/user-api.ts). Undefined means "use
  // the platform's sitewide default".
  currencyPreference?: "Naira" | "Dollar" | "Cedis" | "Pound";
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
  verifyResetOtp: (email: string, otp: string) => Promise<ApiResult>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<ApiResult>;
  /** For an account created via inviteAdmin (mustSetPassword: true on the
   * user object) — session-gated, no email/otp needed since verifyEmail
   * already logged them in. */
  setPassword: (newPassword: string) => Promise<ApiResult>;
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

  // --- Login ---
  // Used to POST /auth/login (which only sets the session cookie, no user
  // in the response) and then immediately GET /auth/me to fetch the user —
  // two round-trips where the second one depends on the cookie the FIRST
  // response just set already being attached. That's exactly the request
  // this broke on: a brand-new mobile session, first login attempt ever,
  // with nothing cached yet — a cross-site cookie (frontend and backend on
  // different domains) that a mobile browser hasn't fully committed to
  // storage yet before the very next fetch fires is a known rough edge
  // (mobile Safari / in-app browsers especially), and when it doesn't make
  // it in time, that immediate second request goes out with no session at
  // all and 401s. The backend's login controller already hands back the
  // full user object in the SAME response that sets the cookie
  // (auth.controller.ts's login returns `body: sanitizeUser(user...)`) —
  // so there's no reason to make a second, cookie-dependent request just
  // to re-fetch data already sitting in the first response. Every other
  // authenticated call after this still relies on the cookie as normal;
  // this only removes the one redundant round-trip that was racing it.
  async function login(email: string, password: string): Promise<User> {
    const res = await api.post("/auth/login", { email, password });
    const loggedInUser = res.body as User;
    queryClient.setQueryData(ME_QUERY_KEY, loggedInUser);
    return loggedInUser;
  }

  // --- Forgot password ---
  async function forgotPassword(email: string) {
    return api.post("/auth/forgot-password", { email });
  }

  // --- Verify a password-reset OTP on its own, before showing the
  // new-password screen. Doesn't consume the code — the same one still
  // has to be sent again with resetPassword below.
  async function verifyResetOtp(email: string, otp: string) {
    return api.post("/auth/verify-reset-otp", { email, otp });
  }

  // --- Reset password ---
  async function resetPassword(email: string, otp: string, newPassword: string) {
    return api.post("/auth/reset-password", { email, otp, newPassword });
  }

  // --- Set password (invited-admin first-login flow) ---
  async function setPassword(newPassword: string) {
    const res = await api.post("/auth/set-password", { newPassword });
    // The endpoint hands back the fresh user (mustSetPassword now false) —
    // write it straight into the cache so nothing re-routes them back to
    // this screen on the very next render.
    if (res.body) {
      queryClient.setQueryData(ME_QUERY_KEY, res.body as User);
    }
    return res;
  }

  // --- Google OAuth login/register ---
  // Same fix as login() above — /auth/google already returns the user in
  // its own response body, so this no longer makes a second, cookie-
  // dependent /auth/me call right on its heels.
  async function googleAuth(accessToken: string, role?: "attendee" | "organizer") {
    const res = await api.post("/auth/google", { accessToken, role });
    const loggedInUser = res.body as User;
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
        verifyResetOtp,
        resetPassword,
        setPassword,
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
