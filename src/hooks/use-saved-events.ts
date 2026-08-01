
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "saved-events";

export function useSavedEvents() {
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

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  return { savedIds, toggleSave, isSaved };
}