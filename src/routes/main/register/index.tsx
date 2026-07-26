import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { registerSchema } from "@/lib/schema";

/**
 * Attendee sign-up form schema.
 *
 * - `companyName` is omitted here — that field belongs to the organizer
 *   register flow (phase 2), not attendee. The shared `registerSchema` in
 *   lib/schema.ts is left untouched so organizer signup can still use it
 *   in full later.
 * - `confirmPassword` is a form-only concern (the API never needs it), so
 *   it's added here rather than in the shared schema.
 */
const attendeeRegisterSchema = registerSchema
  .omit({ companyName: true })
  .extend({
    confirmPassword: z.string({ message: "Complete this field to continue" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type AttendeeRegisterValues = z.infer<typeof attendeeRegisterSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AttendeeRegisterValues>({
    resolver: zodResolver(attendeeRegisterSchema),
    mode: "onBlur",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: Omit<AttendeeRegisterValues, "confirmPassword">) =>
      api.post("/auth/register", values),
    onSuccess: (data, variables) => {
      toast.success(data.message || "Account created — check your email to verify.");
      navigate("/auth/verify-email", { state: { email: variables.email } });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const onSubmit = (values: AttendeeRegisterValues) => {
    const { confirmPassword: _confirmPassword, ...payload } = values;
    mutate(payload);
  };

  return (
    <>
      <h1 className="text-[34px] font-extrabold text-foreground text-3xl mb-2">
        Create your account
      </h1>
      <p className="text-subtext mb-8 leading-6 text-[17px] font-normal">
        Join thousands of people discovering and creating unforgettable events
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullname" className="font-medium text-[16px] text-[#232323]">
            Full Name
          </Label>
          <Input
            id="fullname"
            type="text"
            placeholder="eg. Ada Okafor"
            autoComplete="name"
            aria-invalid={!!errors.fullname}
            className="h-12 w-full placeholder:text-[16px]"
            {...register("fullname")}
          />
          {errors.fullname && (
            <p className="text-sm text-destructive">{errors.fullname.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5 ">
          <Label htmlFor="email" className="font-medium text-[16px] text-[#232323]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="eg you@email.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className="h-12 w-full placeholder:text-[16px]"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="font-medium text-[16px] text-[#232323]">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="create password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              className="h-12 w-full pr-10 placeholder:text-[16px]"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-black hover:opacity-70"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="font-medium text-[16px] text-[#232323]">
            Confirm password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="confirm password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              className="h-12 w-full pr-10 placeholder:text-[16px]"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-black hover:opacity-70"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12.75 font-bold text-[18px]"
        >
          {isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="h-px flex-1 bg-border" />
        <span className="text-sm text-[#4A4451] leading-[21px] font-medium">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Google sign in */}
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          window.location.href = "/api/v1/auth/google";
        }}
        className="w-full h-12 border-[#E8E6E0] hover:border-[#E8E6E0] font-medium"
      >
        <GoogleIcon className="h-4 w-4 mr-2" />
        Sign in with Google
      </Button>

      <p className="text-center text-sm text-subtext mt-6">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}

/**
 * Inline Google "G" mark — avoids pulling in a whole icon package
 * for a single brand icon.
 */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09C3.25 21.3 7.31 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.27 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.63H1.28A11.96 11.96 0 000 12c0 1.94.46 3.77 1.28 5.37l3.99-3.09z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.63l3.99 3.09C6.22 6.86 8.87 4.75 12 4.75z"
        fill="#EA4335"
      />
    </svg>
  );
}
