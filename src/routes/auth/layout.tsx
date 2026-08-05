import { Link, Outlet } from "react-router-dom";
import { EventraLogo } from "@/components/icons/eventra-logo";

/**
 * Shared shell for every /auth/* route (register, login, forgot-password...).
 * Renders the logo + split-screen frame once; each route's own page
 * (register/index.tsx, login/index.tsx, etc.) fills in via <Outlet />.
 */
export default function AuthLayout() {
  return (
    <div className="h-screen grid lg:grid-cols-2 bg-background items-center">
      {/* ---------- Left: hero image ---------- */}
      <div className="hidden lg:block relative m-4 rounded-[40px] h-[90%] overflow-hidden">
        <img
          src="/images/auth-hero-concert.svg"
          alt="Crowd at a live concert with purple stage lighting"
          className="h-full w-full object-cover"
        />
      </div>

      {/* ---------- Right: logo + page content ---------- */}
          {/* register/index.tsx, login/index.tsx etc. render here */}
      <div className="flex flex-col justify-center px-6 sm:px-16 py-12">
        <div className="w-full max-w-[494px] mx-auto">
        
          <Outlet />
        </div>
      </div>
    </div>
  );
}
