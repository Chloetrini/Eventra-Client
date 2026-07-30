import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { verifyEmailSchema } from "@/lib/schema";
import { EventraLogo } from "@/components/icons/eventra-logo";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      toast.error("Missing email. Please restart the reset process.");
      navigate("/forgot-password");
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

    // Temporary frontend-only success
    toast.success("OTP verified successfully.");

    navigate("/reset-password", {
      state: {
        email,
        otp,
      },
    });
  };

  const handleResend = () => {
    toast.success("Verification code resent.");
    setSecondsLeft(RESEND_SECONDS);
  };

  return (
    <div className="flex flex-col">
      <Link to="/" className="flex items-center gap-2 mb-12 w-fit">
        <EventraLogo className="h-6 w-auto" />
        <span className="text-[22.8px] font-extrabold tracking-[-0.02em] text-[#1A1523]">
          Eventra
        </span>
      </Link>

      <h1 className="text-[34px] font-bold leading-[40px] tracking-[-0.02em] text-[#000000] mb-3">
        Enter verification code
      </h1>

      <p className="text-[17px] leading-6 text-[#4A4451] mb-10">
        Enter the 6-digit code we sent to{" "}
        <span className="font-semibold text-[#232323]">{email}</span>
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
              className="h-[56px] w-full max-w-[64px] rounded-[8px] border border-input text-center text-[22px] font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          className="w-full h-[52px] rounded-[8px] bg-[#0F6E56] text-[#FFFFFF] text-[18px] font-bold hover:bg-primary/90"
        >
          Verify Code
        </Button>
      </form>

      <p className="mt-6 text-center text-[16px] text-[#4A4451] leading-[26px]">
        {secondsLeft > 0 ? (
          <span>Resend code in {secondsLeft}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-[#5f0609] font-semibold hover:underline"
          >
            Resend code
          </button>
        )}
      </p>

      <Link
        to="/login"
        className="mt-8 text-center text-[16px] text-[#0F6E56] font-semibold hover:underline leading-[26px]"
      >
        Back to Sign in
      </Link>
    </div>
  );
}
