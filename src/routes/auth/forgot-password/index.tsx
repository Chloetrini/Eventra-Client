import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema } from "@/lib/schema";
import EventraLogo from "@/assets/Eventra-logo.png";
import { authPath } from "@/lib/auth-path";
import { useAuth } from "@/context/auth.context";

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOrganizer = location.pathname.includes("/organizer");
  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ForgotPasswordValues) => forgotPassword(values.email),

    onSuccess: (data, variables) => {
      toast.success(data?.message || "Password reset OTP sent.");

      navigate(authPath("reset-password", isOrganizer), {
        state: {
          email: variables.email,
        },
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  const onSubmit = (values: ForgotPasswordValues) => {
    mutate(values);
  };

  return (
    <div className="flex flex-col">
      <Link to="/" className="flex items-center gap-2 mb-12 w-fit">
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
        Forgot password
      </h1>

      <p className="text-[17px] leading-6 text-muted-foreground mb-10">
        Enter the email on your account and we’ll send you a link to reset it
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-[16px] font-medium text-foreground"
          >
            Email
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="eg you@email.com"
            className="h-[52px] w-full placeholder:text-muted-foreground"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-[52px] rounded-[8px] bg-[#0F6E56] text-[#FFFFFF] text-[18px] font-bold hover:bg-primary/90"
        >
          {isPending ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <Link
        to={authPath("login", isOrganizer)}
        className="mt-6 text-center text-[16px] text-[#0F6E56] dark:text-[#4ADE80] font-semibold hover:underline leading-[26px]"
      >
        Back to Sign in
      </Link>
    </div>
  );
}