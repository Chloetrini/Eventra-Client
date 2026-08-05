import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { EventraLogo } from "@/components/icons/eventra-logo";

export default function CheckEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  const [cooldown, setCooldown] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post("/forgot-password", { email }),

    onSuccess: (data) => {
      toast.success(data.message || "Password reset link resent.");
      setCooldown(true);
      setTimeout(() => setCooldown(false), 30000);
    },

    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  const handleResend = () => {
    if (!email) {
      navigate("/forgot-password");
      return;
    }

    mutate();
  };

  const handleOpenEmail = () => {
    navigate("/verify-otp", {
      state: { email },
    });
  };

  return (
    <div className="flex flex-col">
      <Link to="/" className="flex items-center gap-2 mb-[53px] w-fit">
        <EventraLogo className="h-6 w-auto" />
        <span className="text-[30.13px] font-extrabold tracking-[-0.02em] text-[#1A1523] leading-[35.45px]">
          Eventra
        </span>
      </Link>

      <div
        className="flex h-[79.56px] w-[79.56px] items-center justify-center rounded-full mb-3"
        style={{ backgroundColor: "#E7F4EC" }}
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: "#2E9E5B" }}
        >
          <Check className="h-5 w-5 text-white" strokeWidth={3} />
        </div>
      </div>

      <h1 className="text-[34px] font-extrabold leading-[40px] tracking-[-0.02em] text-[#000000] mb-3">
        Check your email
      </h1>

      <p className="text-[17px] leading-6 text-[#4A4451] mb-7.5 font-normal">
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

      <p className="mt-[15px] text-center text-[14px] font-medium text-[#4A4451] leading-[21px]">
        Didn't get it?
        <button
          type="button"
          onClick={handleResend}
          disabled={isPending || cooldown}
          className="text-[#0F6E56] text-[14px] leading-[21px] font-medium hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
        >
          {isPending ? "Sending..." : cooldown ? "Sent" : "Resend link"}
        </button>
      </p>
    </div>
  );
}