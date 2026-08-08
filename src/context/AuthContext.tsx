import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "@/lib/api";

type User = {
  id: string;
  fullname: string;
  email: string;
  role: "attendee" | "organizer" | "admin";
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ask the server who we are. The auth cookie rides along automatically.
  async function refreshUser() {
    try {
      const res = await api.get("/auth/me");
      setUser(res.body as User);
    } catch {
      setUser(null); // not logged in / cookie expired
    } finally {
      setIsLoading(false);
    }
  }

  // Restore the session on app load
  useEffect(() => {
    refreshUser();
  }, []);

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

  // --- Login: server sets the cookie, then we fetch the profile ---
  async function login(email: string, password: string): Promise<User> {
    await api.post("/auth/login", { email, password });
    const meRes = await api.get("/auth/me");
    const loggedInUser = meRes.body as User;
    setUser(loggedInUser);
    return loggedInUser;
  }

  // --- Forgot password: sends a reset code to the email ---
  async function forgotPassword(email: string) {
    return api.post("/auth/forgot-password", { email });
  }

  // --- Reset password with the emailed OTP ---
  async function resetPassword(email: string, otp: string, newPassword: string) {
    return api.post("/auth/reset-password", { email, otp, newPassword });
  }

  // --- Logout: server clears the cookie ---
  async function logout() {
    try {
      await api.post("/auth/logout", {});
    } catch {
      // clear locally regardless
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        register,
        verifyEmail,
        resendOtp,
        login,
        forgotPassword,
        resetPassword,
        logout,
        refreshUser,
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