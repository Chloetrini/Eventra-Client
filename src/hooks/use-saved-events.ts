import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth.context";

const STORAGE_KEY = "saved-events";

export function useSavedEvents() {
  const { user } = useAuth();

  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    // load once from localStorage on first render
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set<string>(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  // persist to localStorage whenever the saved set changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...savedIds]));
  }, [savedIds]);

  // add if missing, remove if present
  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (id: string) => (user ? savedIds.has(id) : false),
    [savedIds, user]
  );

  // Guests see an empty set — every heart shows unliked.
  // The real localStorage state is preserved so it's still there
  // if they log back in.
  const visibleSavedIds = user ? savedIds : new Set<string>();

  return { savedIds: visibleSavedIds, toggleSave, isSaved };
}