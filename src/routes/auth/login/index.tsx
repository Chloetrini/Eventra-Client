import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";
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
import { loginSchema } from "@/lib/schema";
import EventraLogo from "@/assets/Eventra-logo.png";   // or whatever the real name is
import { authPath } from "@/lib/auth-path";

const attendeeLoginSchema = loginSchema;

type AttendeeLoginValues = z.infer<typeof attendeeLoginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOrganizer = location.pathname.includes("/organizer");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AttendeeLoginValues>({
    resolver: zodResolver(attendeeLoginSchema),
    mode: "onBlur",
  });

 const { login } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: (values: AttendeeLoginValues) =>
      login(values.email, values.password),

    onSuccess: (user) => {
      toast.success("Logged in successfully.");
      if (user.role === "organizer") {
        navigate("/");   // organizer dashboard later
      } else {
        navigate("/");   // attendee home
      }
    },

    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  const onSubmit = (values: AttendeeLoginValues) => {
    mutate(values);
  };

  return (
    <div className="h-[494px] flex flex-col justify-center ">
      <div className="mb-[12px] mt-[120px]">
        <Link to="/" className="flex items-center gap-2 mb-[53px] w-fit">
          <img src={EventraLogo} className="h-6 w-auto" alt="Eventra" />
          <span className="text-[22.8px] font-extrabold text-[#1A1523] tracking-[-0.02em]">
            Eventra
          </span>
          {isOrganizer && (
          <span className="ml-1 rounded-[7px] bg-[#BBE0CF] py-[5px] text-[11px] font-[400] font-mono uppercase tracking-wide text-[#0F6E56] w-[118px] text-center text-[15px]">
            Organizer
          </span>
        )}
        </Link>
      </div>
      <h1 className="text-[34px] font-extrabold mb-[12px] tracking-[-0.02em] leading-[40px] text-[#000000]">
        Welcome back
      </h1>

      <p className="text-[#4A4451] text-[17px] leading-6 mb-[30px]">
        Sign in to keep your tickets and saved event in one place
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
            placeholder="eg you@email.com"
            className="h-12 w-full placeholder:text-[16px]"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
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
              placeholder="enter password"
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

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 font-bold text-[18px] tracking-[-0.025em] text-[#FFFFFF] bg-[#0F6E56] hover:bg-primary/90 mb-[6px]"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </Button>

        {/* Remember me row */}

        <div className="flex items-center justify-between text-sm mt-[6px] mb-[20px]">
          <label className="flex items-center gap-2 text-[#232323] cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-[#C3C9D3] accent-[#0F6E56]"
            />
            <span className="text-[14px] text-[#4A4451]">Remember me</span>
          </label>

          <Link
            to={authPath("forgot-password", isOrganizer)}
            className="text-[#0A4F41] font-medium text-[14px] hover:underline"
          >
            Forgot Password ?
          </Link>
        </div>
      </form>

      {/* or divider row */}

      <div className="flex items-center gap-4 my-5 mb-[20px]">
        <div className="h-px flex-1 bg-border" />
        <span className="text-sm text-[#4A4451]">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Google button */}

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 border-[#E8E6E0] hover:border-[#E8E6E0] text-[#1A1523] font-bold text-[18px] leading-[29px] mb-[15px]"
      >
        <GoogleIcon className="h-4 w-4 mr-2" />
        Sign In with Google
      </Button>

      {/* Bottom text*/}

      <p className="text-center text-sm text-[#4A4451] mt-6">
        Don't have an account?
        <Link
          to={authPath("register", isOrganizer)}
          className="text-[#0F6E56] font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
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
