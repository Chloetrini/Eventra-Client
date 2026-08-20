import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "@/context/auth.context";
import { authPath } from "@/lib/auth-path";
import { AuthGateModal } from "@/components/dialogs/auth-gate-modal";

// "buy-ticket" used to be a gated action too — reserving a free spot (or
// buying a paid ticket) would stop and show the sign-in / continue-as-guest
// modal. That's not wanted: buying a ticket should never be gated — only
// saving an event or viewing "my tickets" / "saved events" should ever
// prompt for an account.
type GateAction = "save-event" | "my-tickets" | "saved-events";

type AuthGateContextType = {
  requireAuth: (action: GateAction) => boolean;
};

const AuthGateContext = createContext<AuthGateContextType | undefined>(undefined);

export function AuthGateProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [modalOpen, setModalOpen] = useState(false);

  // `action` isn't branched on anymore now that "buy-ticket" is gone (every
  // remaining action does the same thing), but it stays in the signature
  // so call sites keep saying *why* they're gating — useful context at each
  // call site, and room to differentiate again later without another
  // call-site-wide refactor.
  function requireAuth(_action: GateAction): boolean {
    if (user) return true;
    setModalOpen(true);
    return false;
  }

  function handleSignIn() {
    setModalOpen(false);
    const isOrganizer = location.pathname.includes("/organizer");
    navigate(authPath("login", isOrganizer), {
      state: { from: location.pathname },
    });
  }

  function handleContinueAsGuest() {
    setModalOpen(false);
    navigate(-1);
  }

  const allowGuest = true;

  return (
    <AuthGateContext.Provider value={{ requireAuth }}>
      {children}
      <AuthGateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSignIn={handleSignIn}
        onContinueAsGuest={handleContinueAsGuest}
        allowGuest={allowGuest}
      />
    </AuthGateContext.Provider>
  );
}

export function useAuthGate() {
  const ctx = useContext(AuthGateContext);
  if (!ctx) throw new Error("useAuthGate must be used within AuthGateProvider");
  return ctx;
}
