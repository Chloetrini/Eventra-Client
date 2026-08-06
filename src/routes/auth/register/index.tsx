import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { attendeeRegisterSchema, type AttendeeRegisterValues } from "@/lib/schema";
import EventraLogo from "@/assets/Eventra-logo.png";

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
    defaultValues: {
      role: "attendee",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: Omit<AttendeeRegisterValues, "confirmPassword">) =>
      api.post("/auth/register", values),

    onSuccess: (data, variables) => {
      toast.success(data.message || "Account created successfully.");

      navigate("/verify-email", {
        state: { email: variables.email },
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  const onSubmit = (values: AttendeeRegisterValues) => {
    const { confirmPassword, ...payload } = values;
    mutate(payload);
  };

  return (
    <>
      <Link to="/" className="flex items-center gap-2 mb-[53px] w-fit">
        <img src={EventraLogo} className="h-6 w-auto" alt="Eventra" />
        <span className="text-[22.8px] font-extrabold text-[#1A1523] tracking-[-0.02em]">
          Eventra
        </span>
      </Link>
      <h1 className="text-[34px] font-extrabold mb-2 tracking-[-0.02em] text-[#000000]">
        Create your account
      </h1>

      <p className="text-[#4A4451] text-[17px] leading-6 mb-8">
        Join thousands of people discovering and creating unforgettable events
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="fullName"
            className="font-medium text-[16px] text-[#232323] tracking-[-0.03em]"
          >
            Full Name
          </Label>

          <Input
            id="fullName"
            placeholder="eg. Ada Okafor"
            className="h-12 w-full placeholder:text-[16px]"
            {...register("fullName")}
          />

          {errors.fullName && (
            <p className="text-sm text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="font-medium text-[16px] text-[#232323] tracking-[-0.03em]"
          >
            Email
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="eg. ada@email.com"
            className="h-12 w-full placeholder:text-[16px]"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label
            htmlFor="phoneNumber"
            className="font-medium text-[16px] text-[#232323] tracking-[-0.03em]"
          >
            Phone Number
          </Label>

          <Input
            id="phoneNumber"
            type="tel"
            placeholder="08012345678"
            className="h-12 w-full placeholder:text-[16px]"
            {...register("phoneNumber")}
          />

          {errors.phoneNumber && (
            <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="font-medium text-[16px] text-[#232323] tracking-[-0.03em]"
          >
            Password
          </Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              className="h-12 w-full pr-10 placeholder:text-[16px]"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="font-medium text-[16px] text-[#232323] tracking-[-0.03em]"
          >
            Confirm Password
          </Label>

          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="h-12 w-full pr-10 placeholder:text-[16px]"
              {...register("confirmPassword")}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
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
          className="w-full h-12 font-bold text-[18px] tracking-[-0.025em] text-[#FFFFFF] bg-[#0F6E56] hover:bg-primary/90"
        >
          {isPending ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="h-px flex-1 bg-border" />
        <span className="text-sm text-[#4A4451]">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 border-[#E8E6E0] hover:border-[#E8E6E0] text-[#1A1523] font-bold text-[18px] leading-[29px]"
      >
        <GoogleIcon className="h-4 w-4 mr-2" />
        Sign up with Google
      </Button>

      <p className="text-center text-sm text-[#4A4451] mt-6">
        Already have an account?
        <Link
          to="/login"
          className="text-[#0F6E56] font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
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