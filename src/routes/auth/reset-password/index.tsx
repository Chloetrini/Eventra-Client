import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordSchema } from "@/lib/schema";
import EventraLogo from "@/assets/Eventra-logo.png";
import { authPath } from "@/lib/auth-path";
import { useAuth } from "@/context/auth.context";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string } | null;
  const isOrganizer = location.pathname.includes("/organizer");

  // Two separate steps: the code first, checked for real against the
  // backend (POST /auth/verify-reset-otp) — only once that succeeds does
  // the new-password step show up.
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Separate cooldown from isPending — resend and "check the code" both
  // hit the network, but a resend firing shouldn't disable/relabel the
  // Continue button, and vice versa.
  const [resendCooldown, setResendCooldown] = useState(false);

  const { verifyResetOtp, resetPassword, forgotPassword } = useAuth();

  const { mutate: checkOtp, isPending: isCheckingOtp } = useMutation({
    mutationFn: (values: { email: string; otp: string }) =>
      verifyResetOtp(values.email, values.otp),

    onSuccess: () => {
      setStep("password");
    },

    onError: (err: Error) => {
      // The real "Invalid reset code" / "Reset code has expired..." error
      // from the backend, shown right here on the code screen — not
      // deferred to the final password submit.
      setOtpError(err.message || "Something went wrong.");
    },
  });

  const { mutate: resendOtp, isPending: isResending } = useMutation({
    mutationFn: (email: string) => forgotPassword(email),

    onSuccess: (data) => {
      toast.success(data?.message || "A new code has been sent to your email.");
      setOtpError(null);
      setOtp("");
      setResendCooldown(true);
      setTimeout(() => setResendCooldown(false), 30000);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Couldn't resend the code. Please try again.");
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: {
      email: string;
      otp: string;
      newPassword: string;
    }) => resetPassword(values.email, values.otp, values.newPassword),

    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successful.");
      navigate(authPath("login", isOrganizer));
    },

    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong.");
      // A code that was valid a moment ago can still expire before the
      // final submit — send them back to re-check it rather than leaving
      // them stuck on the password step with no way to fix what failed.
      setStep("otp");
    },
  });

  const onContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (!state?.email) {
      toast.error("Missing email. Please restart the password reset process.");
      navigate(authPath("forgot-password", isOrganizer));
      return;
    }

    if (!otp.trim()) {
      setOtpError("Enter the verification code from your email");
      return;
    }

    checkOtp({ email: state.email, otp });
  };

  const onResend = () => {
    if (!state?.email) {
      toast.error("Missing email. Please restart the password reset process.");
      navigate(authPath("forgot-password", isOrganizer));
      return;
    }

    resendOtp(state.email);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!state?.email) {
      toast.error("Missing email. Please restart the password reset process.");
      navigate(authPath("forgot-password", isOrganizer));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = resetPasswordSchema.safeParse({
      email: state.email,
      otp,
      newPassword,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    mutate(result.data);
  };

  return (
    <div className="flex flex-col">
      {/* Same page-level history-back as forgot-password/check-email —
          distinct from the "Need to re-enter the code? Go back" button
          further down, which only steps between this page's own otp/
          password sub-steps rather than leaving the page. */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="mb-6 flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      <Link to="/" className="flex items-center gap-2 mb-[53px] w-fit">
        <img src={EventraLogo} className="h-6 w-auto" alt="Eventra" />
        <span className="text-[22.8px] font-extrabold text-foreground tracking-[-0.02em]">
          Eventra
        </span>
        {isOrganizer && (
          <span className="ml-1 rounded-[7px] bg-[#BBE0CF] py-[5px] text-[11px] font-[400] font-mono uppercase tracking-wide text-[#0F6E56] dark:bg-[#0F6E56]/20 dark:text-[#4ADE80] w-[118px] text-center text-[15px]">
            Organizer
          </span>
        )}
      </Link>

      {step === "otp" ? (
        <>
          <h1 className="text-[34px] font-bold leading-[40px] tracking-[-0.02em] text-foreground mb-3">
            Enter verification code
          </h1>

          <p className="text-[17px] leading-6 text-muted-foreground mb-10">
            Enter the code we emailed to{" "}
            {state?.email && <span className="font-semibold text-foreground">{state.email}</span>}
          </p>

          <form onSubmit={onContinue} noValidate className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="otp"
                className="text-[16px] font-medium text-foreground"
              >
                Verification code
              </Label>

              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter the code from your email"
                className="h-[52px] w-full placeholder:text-muted-foreground"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setOtpError(null);
                }}
                autoFocus
              />

              {/* The backend's real error — "Invalid reset code" or "Reset
                  code has expired" — right under the field it's about. This
                  is the ONLY place this component ever shows an OTP error;
                  it lives in local state (otpError) scoped to this step and
                  is never rendered on the password step below. */}
              {otpError && <p className="text-sm text-destructive">{otpError}</p>}
            </div>

            <Button
              type="submit"
              disabled={isCheckingOtp}
              className="w-full h-[52px] rounded-[8px] bg-[#0F6E56] text-[#FFFFFF] text-[18px] font-bold hover:bg-primary/90"
            >
              {isCheckingOtp ? "Checking..." : "Continue"}
            </Button>

            {/* Lets someone whose code expired (or who never got one) ask
                for a fresh one without leaving this screen — previously the
                only way to resend was to go all the way back to the
                check-your-email screen. */}
            <p className="text-center text-[14px] text-muted-foreground">
              Didn't get a code, or has it expired?{" "}
              <button
                type="button"
                onClick={onResend}
                disabled={isResending || resendCooldown}
                className="text-[#0F6E56] dark:text-[#4ADE80] font-medium hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
              >
                {isResending ? "Sending..." : resendCooldown ? "Code sent" : "Resend code"}
              </button>
            </p>
          </form>
        </>
      ) : (
        <>
          <h1 className="text-[34px] font-bold leading-[40px] tracking-[-0.02em] text-foreground mb-3">
            Set a new password
          </h1>

          <p className="text-[17px] leading-6 text-muted-foreground mb-10">
            Choose a strong password you haven't used before. Make it at
            least 8 characters.
          </p>

          <form onSubmit={onSubmit} noValidate className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-[16px] font-medium text-foreground"
              >
                New password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a new password"
                  className="h-[52px] w-full placeholder:text-muted-foreground pr-12"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-[16px] font-medium text-foreground"
              >
                Confirm new password
              </Label>

              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter new password"
                  className="h-[52px] w-full placeholder:text-muted-foreground pr-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-[52px] rounded-[8px] bg-[#0F6E56] text-[#FFFFFF] text-[18px] font-bold hover:bg-primary/90"
            >
              {isPending ? "Resetting..." : "Reset password"}
            </Button>

            {/* Not an error — just a plain way back to the code screen if
                you typed the wrong one. Reworded from "Wrong code? Go
                back" since that read as if something had already gone
                wrong on this page, when it's really just an optional
                link that's always here. */}
            <button
              type="button"
              onClick={() => setStep("otp")}
              className="w-full text-center text-[14px] text-muted-foreground hover:underline"
            >
              Need to re-enter the code? Go back
            </button>
          </form>
        </>
      )}

      <Link
        to={authPath("login", isOrganizer)}
        className="mt-6 text-center text-[16px] text-[#0F6E56] dark:text-[#4ADE80] font-semibold hover:underline leading-[26px]"
      >
        Back to Sign in
      </Link>
    </div>
  );
}
