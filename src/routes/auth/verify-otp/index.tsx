import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { verifyEmailSchema } from "@/lib/schema";
import EventraLogo from "@/assets/Eventra-logo.png";
import { authPath } from "@/lib/auth-path";
import { useAuth } from "@/context/auth.context";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;
  const isOrganizer = location.pathname.includes("/organizer");
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { verifyEmail, resendOtp } = useAuth();

  // --- Verify OTP Mutation ---
  const { mutate: handleVerify, isPending: isVerifying } = useMutation({
    mutationFn: (otp: string) => verifyEmail(email!, otp),
    onSuccess: (data) => {
      toast.success(data?.message || "Email verified successfully.");
      // An account inviteAdmin created (see admin.controller.ts) has a
      // password nobody was ever shown, and verifyEmail just logged them
      // in — send them to set a real one instead of a login screen they
      // have no working password for. Every other verify-otp flow
      // (attendee/organizer registration) has no such flag and goes to
      // login as before.
      const user = (data?.body as { mustSetPassword?: boolean } | undefined);
      if (user?.mustSetPassword) {
        navigate("/auth/set-password");
        return;
      }
      navigate(authPath("login", isOrganizer));
    },
    onError: (e: Error) => {
      setError(e.message || "Invalid or expired code.");
      toast.error(e.message || "Verification failed.");
    },
  });

  // --- Resend OTP Mutation ---
  const { mutate: handleResendOtp, isPending: isResending } = useMutation({
    mutationFn: () => resendOtp(email!),
    onSuccess: (data) => {
      toast.success(data?.message || "Verification code resent.");
      setSecondsLeft(RESEND_SECONDS);
    },
    onError: (e: Error) => {
      toast.error(e.message || "Failed to resend code.");
    },
  });

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    setError(null);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");

    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill("");

    for (let i = 0; i < Math.min(pasted.length, OTP_LENGTH); i++) {
      next[i] = pasted[i];
    }

    setDigits(next);

    inputRefs.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      toast.error("Missing email. Please restart the process.");
      navigate(authPath("login", isOrganizer));
      return;
    }

    const otp = digits.join("");

    const result = verifyEmailSchema.safeParse({
      email,
      otp,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid code");
      return;
    }

    // Trigger API Call
    handleVerify(otp);
  };

  const handleResend = () => {
    if (!email) {
      toast.error("Missing email address.");
      return;
    }
    handleResendOtp();
  };

  return (
    <div className="flex flex-col">
      <Link to="/" className="flex items-center gap-2 mb-8 w-fit">
        <img src={EventraLogo} className="h-6 w-auto" alt="Eventra" />
        <span className="text-[22.8px] font-extrabold tracking-[-0.02em] text-foreground">
          Eventra
        </span>
        {isOrganizer && (
          <span className="ml-1 rounded-[7px] bg-[#BBE0CF] py-[5px] text-[11px] font-[400] font-mono uppercase tracking-wide text-[#0F6E56] dark:bg-[#0F6E56]/20 dark:text-[#4ADE80] w-[118px] text-center text-[15px]">
            Organizer
          </span>
        )}
      </Link>

      <h1 className="text-[34px] font-bold leading-[40px] tracking-[-0.02em] text-foreground mb-3">
        Enter verification code
      </h1>

      <p className="text-[17px] leading-6 text-muted-foreground mb-10">
        Enter the 6-digit code we sent to{" "}
        <span className="font-semibold text-foreground">{email}</span>
      </p>

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <div className="flex justify-between gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="h-[56px] w-full max-w-[64px] rounded-[8px] border border-input bg-background text-foreground text-center text-[22px] font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          disabled={isVerifying}
          className="w-full h-[52px] rounded-[8px] bg-[#0F6E56] text-[#FFFFFF] text-[18px] font-bold hover:bg-primary/90"
        >
          {isVerifying ? "Verifying..." : "Verify Code"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[16px] text-muted-foreground leading-[26px]">
        {secondsLeft > 0 ? (
          <span>Resend code in {secondsLeft}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-[#5f0609] dark:text-[#f87171] font-semibold hover:underline disabled:opacity-50"
          >
            {isResending ? "Resending..." : "Resend code"}
          </button>
        )}
      </p>

      <Link
        to={authPath("login", isOrganizer)}
        className="mt-8 text-center text-[16px] text-[#0F6E56] dark:text-[#4ADE80] font-semibold hover:underline leading-[26px]"
      >
        Back to Sign in
      </Link>
    </div>
  );
}
