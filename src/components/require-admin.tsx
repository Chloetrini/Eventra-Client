import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router";
import { useAuth } from "@/context/auth.context";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

/**
 * Route guard for the admin platform (/admin/*).
 *
 * - Not logged in (guest)   → redirected to the dedicated admin login, and
 *   sent back to where they were trying to go once they sign in.
 * - Logged in as anything other than "admin" (attendee or organizer) →
 *   redirected home. There is no self-service admin signup — only a
 *   seeded admin account has this role, so landing here as an
 *   attendee/organizer always means the wrong login form was used.
 * - Logged in as admin      → renders the protected route via <Outlet />.
 *
 * The backend already rejects these requests for the wrong role/session
 * (verifySession + requireAdmin on every /api/v1/admin/* endpoint) — this
 * guard is what turns that into a clean redirect instead of a broken page
 * full of failed-request error states.
 */
export function RequireAdmin() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthorized = Boolean(user) && user?.role === "admin";

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate("/auth/admin/login", {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }

    if (user.role !== "admin") {
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
