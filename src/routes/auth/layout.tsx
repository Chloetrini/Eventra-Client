import { Outlet, useLocation } from "react-router";
import authBg from "@/assets/auth-hero.png";
import organizerBg from "@/assets/auth-organizer.png"
/**
 * Shared shell for every /auth/* route (register, login, forgot-password...).
 * Renders the logo + split-screen frame once; each route's own page
 * (register/index.tsx, login/index.tsx, etc.) fills in via <Outlet />.
 *
 * Organizer auth routes (/auth/organizer/*) flip the image to the other side,
 * swap the hero image, and show the organizer overlay text.
 */
export default function AuthLayout() {
  const location = useLocation();
  const isOrganizer = location.pathname.includes("/organizer");

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-background items-center">
      {/* ---------- Hero image ---------- */}
      <div
        className={`hidden lg:block relative m-4 rounded-[40px] h-[90%] overflow-hidden ${
          isOrganizer ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <img
          src={isOrganizer ? organizerBg : authBg}
          alt={
            isOrganizer
              ? "Event organizer managing a live event"
              : "Crowd at a live concert with purple stage lighting"
          }
          className="h-full w-full object-cover"
        />

        {/* Organizer overlay text */}
        {isOrganizer && (
          <>
            {/* dark gradient so text stays readable over the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 text-white">
              <p className="text-[#F5A524] text-sm font-semibold tracking-wide mb-3 uppercase">
                № ORG · SELL WITH EVENTRA
              </p>
              <h2 className="text-3xl font-bold mb-5 leading-tight font-grotesk">
                Your events,<br />properly run.
              </h2>
              <ul className="space-y-2.5 text-sm font-medium">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F5A524] text-xs">◆</span>
                  Sell tickets by card, transfer &amp; USSD
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F5A524] text-xs">◆</span>
                  Scan guests in at the gate, even offline
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F5A524] text-xs">◆</span>
                  Get paid a few days after your event
                </li>
              </ul>
            </div>
          </>
        )}
      </div>

      {/* ---------- Logo + page content ---------- */}
      <div
        className={`flex flex-col justify-center px-6 sm:px-16 py-12 ${
          isOrganizer ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <div className="w-full max-w-[494px] mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}