import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

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
  const state = location.state as { email?: string; otp?: string } | null;
  const isOrganizer = location.pathname.includes("/organizer");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { resetPassword } = useAuth();

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
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!state?.email || !state?.otp) {
      toast.error("Missing verification details.");
      navigate(authPath("forgot-password", isOrganizer));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = resetPasswordSchema.safeParse({
      email: state.email,
      otp: state.otp,
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
      <Link to="/" className="flex items-center gap-2 mb-[53px] w-fit">
        <img src={UI_ASSETS.Eventraa} className="h-6 w-auto" alt="Eventra" />
        <span className="text-[22.8px] font-extrabold text-[#1A1523] tracking-[-0.02em]">
          Eventra
        </span>
        {isOrganizer && (
          <span className="ml-1 rounded-[7px] bg-[#BBE0CF] py-[5px] text-[11px] font-[400] font-mono uppercase tracking-wide text-[#0F6E56] w-[118px] text-center text-[15px]">
            Organizer
          </span>
        )}
      </Link>

      <h1 className="text-[34px] font-bold leading-[40px] tracking-[-0.02em] text-[#000000] mb-3">
        Set a new password
      </h1>

      <p className="text-[17px] leading-6 text-[#4A4451] mb-10">
        Choose a strong password you haven't used before. Make it at
        least 8 characters.
      </p>

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-[16px] font-medium text-[#232323]"
          >
            New password
          </Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter a new password"
              className="h-[52px] w-full placeholder:text-[#98A2B3] pr-12"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black"
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
            className="text-[16px] font-medium text-[#232323]"
          >
            Confirm new password
          </Label>

          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              className="h-[52px] w-full placeholder:text-[#98A2B3] pr-12"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black"
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
      </form>

      <Link
        to={authPath("login", isOrganizer)}
        className="mt-6 text-center text-[16px] text-[#0F6E56] font-semibold hover:underline leading-[26px]"
      >
        Back to Sign in
      </Link>
    </div>
  );
}