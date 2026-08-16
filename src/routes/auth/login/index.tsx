import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/services/schema";
import EventraLogo from "@/assets/Eventra-logo.png";
import { authPath } from "@/services/auth-path";
import type { User } from "@/context/auth.context";

const attendeeLoginSchema = loginSchema;

type AttendeeLoginValues = z.infer<typeof attendeeLoginSchema>;

// An organizer who's never submitted the onboarding wizard (no profile yet,
// or one that's still sitting in "draft") shouldn't land on the dashboard —
// they'd just see an empty shell with a banner telling them to go finish
// onboarding anyway. Send them straight there instead. Once they've
// submitted (pending/approved/rejected), the dashboard is the right place —
// that's exactly where AccountReviewBanner surfaces the review status.
function getPostLoginPath(user: User): string {
  if (user.role !== "organizer") return "/";
  const approvalStatus = (user.organizerProfile as { approvalStatus?: string } | undefined)?.approvalStatus;
  if (!approvalStatus || approvalStatus === "draft") return "/onboarding/organisation";
  return "/dashboard/overview";
}

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

  const { login, logout, googleAuth } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: (values: AttendeeLoginValues) =>
      login(values.email, values.password),
    onSuccess: (user) => {
      if (isOrganizer && user.role !== "organizer") {
        toast.error("This is an attendee account. Please use the attendee login page.");
        logout();
        return;
      }
      if (!isOrganizer && user.role === "organizer") {
        toast.error("This is an organizer account. Please use the organizer login page.");
        logout();
        return;
      }
      toast.success("Logged in successfully.");
      navigate(getPostLoginPath(user));
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  const onSubmit = (values: AttendeeLoginValues) => {
    mutate(values);
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const user = await googleAuth(tokenResponse.access_token, isOrganizer ? "organizer" : "attendee");
        if (isOrganizer && user.role !== "organizer") {
          toast.error("This is an attendee account. Please use the attendee login page.");
          await logout();
          return;
        }
        if (!isOrganizer && user.role === "organizer") {
          toast.error("This is an organizer account. Please use the organizer login page.");
          await logout();
          return;
        }
        toast.success("Logged in successfully.");
        navigate(getPostLoginPath(user));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Google sign-in failed");
      }
    },
    onError: () => {
      toast.error("Google sign-in failed");
    },
  });

  return (
    <div className="min-h-[494px] flex flex-col justify-center ">
      <div className="mb-[12px] mt-[120px]">
        <Link to="/" className="flex items-center gap-2 mb-[53px] w-fit">
          <img src={EventraLogo} className="h-6 w-auto" alt="Eventra" />
          <span className="text-[22.8px] font-extrabold text-foreground tracking-[-0.02em]">
            Eventra
          </span>
          {isOrganizer && (
            <span className="ml-1 rounded-[7px] bg-[#BBE0CF] py-[5px] text-[11px] font-[400] font-mono uppercase tracking-wide text-[#0F6E56] dark:bg-[#0F6E56]/20 dark:text-[#4ADE80] w-[118px] text-center text-[15px]">
              Organizer
            </span>
          )}
        </Link>
      </div>
      <h1 className="text-[34px] font-extrabold mb-[12px] tracking-[-0.02em] leading-[40px] text-foreground">
        Welcome back
      </h1>

      <p className="text-muted-foreground text-[17px] leading-6 mb-[30px]">
        Sign in to keep your tickets and saved event in one place
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="font-medium text-[16px] text-foreground tracking-[-0.03em]"
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
            className="font-medium text-[16px] text-foreground tracking-[-0.03em]"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
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
          <label className="flex items-center gap-2 text-foreground cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-border accent-[#0F6E56]"
            />
            <span className="text-[14px] text-muted-foreground">Remember me</span>
          </label>

          <Link
            to={authPath("forgot-password", isOrganizer)}
            className="text-[#0A4F41] dark:text-[#4ADE80] font-medium text-[14px] hover:underline"
          >
            Forgot Password ?
          </Link>
        </div>
      </form>

      {/* or divider row */}

      <div className="flex items-center gap-4 my-5 mb-[20px]">
        <div className="h-px flex-1 bg-border" />
        <span className="text-sm text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Google button */}

      <Button
        type="button"
        variant="outline"
        onClick={() => handleGoogleLogin()}
        className="w-full h-12 border-border hover:border-border text-foreground font-bold text-[18px] leading-[29px] mb-[15px]"
      >
        <GoogleIcon className="h-4 w-4 mr-2" />
        Sign In with Google
      </Button>

      {/* Bottom text*/}

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don't have an account?
        <Link
          to={authPath("register", isOrganizer)}
          className="text-[#0F6E56] dark:text-[#4ADE80] font-medium hover:underline"
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