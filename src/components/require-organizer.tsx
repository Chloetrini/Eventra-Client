import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router";
import { useAuth } from "@/context/auth.context";
import { authPath } from "@/services/auth-path";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

/**
 * Route guard for the organizer platform (dashboard/*, organizer/events/*).
 *
 * - Not logged in (guest)      → redirected to the organizer login, and sent
 *   back to where they were trying to go once they sign in.
 * - Logged in as an attendee   → redirected home. Attendees don't get an
 *   organizer dashboard.
 * - Logged in as an organizer  → renders the protected route via <Outlet />.
 *
 * The backend already rejects these requests for the wrong role/session
 * (verifySession + requireRole('organizer') on every dashboard/event-details
 * endpoint) — this guard is what turns that into a clean redirect instead of
 * a broken page full of failed-request error states.
 */
export function RequireOrganizer() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthorized = Boolean(user) && user?.role === "organizer";

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate(authPath("login", true), {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }

    if (user.role !== "organizer") {
      navigate("/", { replace: true });
    }
  }, [isLoading, user, navigate, location.pathname]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <Outlet />;
}
