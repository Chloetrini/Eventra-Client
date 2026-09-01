import { useEffect, useState } from "react";
import { isKnownState, nearestState } from "@/lib/nigeria-state-geo";
import type { State } from "@/types/event-types";

const STORAGE_KEY = "eventra-viewer-city";
const GEO_TIMEOUT_MS = 4000;

function readStoredCity(): State | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isKnownState(stored) ? stored : null;
  } catch {
    return null;
  }
}

function persistCity(city: State | null) {
  try {
    if (city) localStorage.setItem(STORAGE_KEY, city);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore quota / private-mode failures
  }
}

/**
 * Resolves the viewer's Nigerian state for homepage copy and filters.
 * Uses a previously saved choice if present; otherwise one geolocation
 * ping mapped onto state capitals. Denied / timeout / outside Nigeria
 * all resolve to null (nationwide), never a hardcoded Lagos.
 */
export function useViewerCity() {
  const [city, setCity] = useState<State | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = readStoredCity();
    if (stored) {
      setCity(stored);
      setIsReady(true);
      return;
    }

    if (!("geolocation" in navigator)) {
      setIsReady(true);
      return;
    }

    let settled = false;
    const finish = (next: State | null) => {
      if (settled) return;
      settled = true;
      persistCity(next);
      setCity(next);
      setIsReady(true);
    };

    const timer = window.setTimeout(() => finish(null), GEO_TIMEOUT_MS);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        window.clearTimeout(timer);
        finish(nearestState(pos.coords.latitude, pos.coords.longitude));
      },
      () => {
        window.clearTimeout(timer);
        finish(null);
      },
      { enableHighAccuracy: false, timeout: GEO_TIMEOUT_MS, maximumAge: 1000 * 60 * 30 }
    );

    return () => {
      window.clearTimeout(timer);
      settled = true;
    };
  }, []);

  return { city, isReady };
}
