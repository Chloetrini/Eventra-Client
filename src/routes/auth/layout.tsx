import { Link, Outlet } from "react-router";
import { EventraLogo } from "@/components/icons/eventra-logo";

/**
 * Shared shell for every /auth/* route (register, login, forgot-password...).
 * Renders the logo + split-screen frame once; each route's own page
 * (register/index.tsx, login/index.tsx, etc.) fills in via <Outlet />.
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* ---------- Left: logo + page content ---------- */}
      <div className="flex flex-col justify-center px-6 sm:px-16 py-12">
        <div className="w-full max-w-md mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-10 w-fit">
            <EventraLogo className="h-6 w-auto" />
            <span className="text-[22.8px] font-extrabold text-logotext">
              Eventra
            </span>
          </Link>

          {/* register/index.tsx, login/index.tsx etc. render here */}
          <Outlet />
        </div>
      </div>

      {/* ---------- Right: hero image ---------- */}
      <div className="hidden lg:block relative m-4 rounded-2xl overflow-hidden">
        <img
          src="/images/auth-hero-concert.svg"
          alt="Crowd at a live concert with purple stage lighting"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
