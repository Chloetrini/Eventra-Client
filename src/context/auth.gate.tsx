import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "@/context/auth.context";
import { authPath } from "@/services/auth-path";
import { AuthGateModal } from "@/components/dialogs/auth-gate-modal";

type GateAction = "save-event" | "my-tickets" | "saved-events" | "buy-ticket";

type AuthGateContextType = {
  requireAuth: (action: GateAction) => boolean;
  isGuest: boolean;
  clearGuest: () => void;
};

const AuthGateContext = createContext<AuthGateContextType | undefined>(undefined);

export function AuthGateProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<GateAction | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  function requireAuth(action: GateAction): boolean {
    if (user) return true;
    if (action === "buy-ticket" && isGuest) return true;
    setCurrentAction(action);
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
    if (currentAction === "buy-ticket") {
      setIsGuest(true);
    } else {
      navigate(-1);
    }
  }

  function clearGuest() {
    setIsGuest(false);
  }

  const allowGuest = true;

  return (
    <AuthGateContext.Provider value={{ requireAuth, isGuest, clearGuest }}>
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