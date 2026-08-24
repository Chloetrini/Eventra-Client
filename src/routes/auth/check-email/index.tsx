import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import EventraLogo from "@/assets/Eventra-logo.png";
import { authPath } from "@/lib/auth-path";
import { useAuth } from "@/context/auth.context";

export default function CheckEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;
  const isOrganizer = location.pathname.includes("/organizer");
  const [cooldown, setCooldown] = useState(false);
  const { forgotPassword } = useAuth();

  const { mutate, isPending } = useMutation({
    // Was posting to "/forgot-password" (missing the "/auth" prefix every
    // other call here uses), so Resend link was 404ing.
    mutationFn: () => forgotPassword(email!),

    onSuccess: (data) => {
      toast.success(data?.message || "Password reset link resent.");
      setCooldown(true);
      setTimeout(() => setCooldown(false), 30000);
    },

    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  const handleResend = () => {
    if (!email) {
      navigate(authPath("forgot-password", isOrganizer));
      return;
    }

    mutate();
  };

  const handleOpenEmail = () => {
    // verify-otp is the registration email-verification screen, not this
    // flow. Send them to reset-password, which now checks the code for
    // real (POST /auth/verify-reset-otp) before showing the password step.
    navigate(authPath("reset-password", isOrganizer), {
      state: { email },
    });
  };

  return (
    <div className="flex flex-col">
      <Link to="/" className="flex items-center gap-2 mb-[53px] w-fit">
        <img src={EventraLogo} className="h-6 w-auto" alt="Eventra" />
        <span className="text-[30.13px] font-extrabold tracking-[-0.02em] text-foreground leading-[35.45px]">
          Eventra
        </span>
        {isOrganizer && (
          <span className="ml-1 rounded-[7px] bg-[#BBE0CF] py-[5px] text-[11px] font-[400] font-mono uppercase tracking-wide text-[#0F6E56] dark:bg-[#0F6E56]/20 dark:text-[#4ADE80] w-[118px] text-center text-[15px]">
            Organizer
          </span>
        )}
      </Link>

      <div className="flex h-[79.56px] w-[79.56px] items-center justify-center rounded-full mb-3 bg-[#E7F4EC] dark:bg-[#0F6E56]/20">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E9E5B]">
          <Check className="h-5 w-5 text-white" strokeWidth={3} />
        </div>
      </div>

      <h1 className="text-[34px] font-extrabold leading-[40px] tracking-[-0.02em] text-foreground mb-3">
        Check your email
      </h1>

      <p className="text-[17px] leading-6 text-muted-foreground mb-7.5 font-normal">
        We've sent a password reset link to
        <span className="font-bold">{email}</span>. The link expires in 30
        minutes.
      </p>

      <Button
        type="button"
        onClick={handleOpenEmail}
        className="w-full h-[52px] rounded-[7px] bg-[#0F6E56] text-[#FFFFFF] text-[18px] font-bold hover:bg-primary/90 tracking-[-0.025rem]"
      >
        Open Email
      </Button>

      <p className="mt-[15px] text-center text-[14px] font-medium text-muted-foreground leading-[21px]">
        Didn't get it?
        <button
          type="button"
          onClick={handleResend}
          disabled={isPending || cooldown}
          className="text-[#0F6E56] dark:text-[#4ADE80] text-[14px] leading-[21px] font-medium hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
        >
          {isPending ? "Sending..." : cooldown ? "Sent" : "Resend link"}
        </button>
      </p>
    </div>
  );
}
