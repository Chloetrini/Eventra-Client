import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setPasswordSchema } from "@/lib/schema";
import EventraLogo from "@/assets/Eventra-logo.png";
import { useAuth } from "@/context/auth.context";

// Lands here right after verify-otp for an account inviteAdmin created
// (admin.controller.ts) — that account's password is a random string
// nobody was ever shown, so this is the one place they actually pick
// their own. Session-gated, not OTP-gated — verifyEmail already logged
// them in, so there's no email/code to carry over here.
export default function SetPassword() {
  const navigate = useNavigate();
  const { setPassword, user } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: { newPassword: string }) => setPassword(values.newPassword),
    onSuccess: data => {
      toast.success(data?.message || "Password set successfully.");
      navigate("/admin/overview");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Something went wrong.");
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = setPasswordSchema.safeParse({ newPassword });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    mutate(result.data);
  };

  return (
    <div className="flex flex-col">
      <Link to="/" className="flex items-center gap-2 mb-[53px] w-fit">
        <img src={EventraLogo} className="h-6 w-auto" alt="Eventra" />
        <span className="text-[22.8px] font-extrabold text-foreground tracking-[-0.02em]">
          Eventra
        </span>
      </Link>

      <h1 className="text-[34px] font-bold leading-[40px] tracking-[-0.02em] text-foreground mb-3">
        Set your password
      </h1>

      <p className="text-[17px] leading-6 text-muted-foreground mb-10">
        {user?.fullname ? `Welcome, ${user.fullname}. ` : ""}
        Choose a password for your admin account. Make it at least 8
        characters.
      </p>

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[16px] font-medium text-foreground">
            New password
          </Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter a new password"
              className="h-[52px] w-full placeholder:text-muted-foreground pr-12"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-[16px] font-medium text-foreground">
            Confirm new password
          </Label>

          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              className="h-[52px] w-full placeholder:text-muted-foreground pr-12"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(prev => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-[52px] rounded-[8px] bg-[#0F6E56] text-[#FFFFFF] text-[18px] font-bold hover:bg-primary/90"
        >
          {isPending ? "Saving..." : "Set password"}
        </Button>
      </form>
    </div>
  );
}
