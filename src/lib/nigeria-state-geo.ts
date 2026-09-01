import { STATES, type State } from "@/types/event-types";

// Approximate state-capital coordinates. Used only to map a browser
// geolocation ping onto the same state list the Explore city filter uses
// — we do not reverse-geocode via a third-party API.
const STATE_CAPITALS: Record<State, { lat: number; lng: number }> = {
  Abia: { lat: 5.5263, lng: 7.4896 },
  Adamawa: { lat: 9.3265, lng: 12.3984 },
  "Akwa Ibom": { lat: 5.0377, lng: 7.9128 },
  Anambra: { lat: 6.2104, lng: 7.0723 },
  Bauchi: { lat: 10.3158, lng: 9.8442 },
  Bayelsa: { lat: 4.9267, lng: 6.2676 },
  Benue: { lat: 7.7322, lng: 8.5391 },
  Borno: { lat: 11.8333, lng: 13.15 },
  "Cross River": { lat: 4.9757, lng: 8.3417 },
  Delta: { lat: 6.2059, lng: 6.6959 },
  Ebonyi: { lat: 6.3231, lng: 8.112 },
  Edo: { lat: 6.335, lng: 5.6037 },
  Ekiti: { lat: 7.6233, lng: 5.2209 },
  Enugu: { lat: 6.4527, lng: 7.5103 },
  "FCT - Abuja": { lat: 9.0765, lng: 7.3986 },
  Gombe: { lat: 10.2897, lng: 11.171 },
  Imo: { lat: 5.485, lng: 7.035 },
  Jigawa: { lat: 12.0, lng: 9.5167 },
  Kaduna: { lat: 10.5222, lng: 7.4383 },
  Kano: { lat: 12.0022, lng: 8.592 },
  Katsina: { lat: 12.9908, lng: 7.6018 },
  Kebbi: { lat: 12.4539, lng: 4.1975 },
  Kogi: { lat: 7.8, lng: 6.7333 },
  Kwara: { lat: 8.4966, lng: 4.5421 },
  Lagos: { lat: 6.5244, lng: 3.3792 },
  Nasarawa: { lat: 8.8472, lng: 7.8774 },
  Niger: { lat: 9.6152, lng: 6.5476 },
  Ogun: { lat: 7.1557, lng: 3.3451 },
  Ondo: { lat: 7.2526, lng: 5.1931 },
  Osun: { lat: 7.7667, lng: 4.5667 },
  Oyo: { lat: 7.3775, lng: 3.947 },
  Plateau: { lat: 9.8965, lng: 8.8583 },
  Rivers: { lat: 4.8156, lng: 7.0498 },
  Sokoto: { lat: 13.0622, lng: 5.2339 },
  Taraba: { lat: 8.8909, lng: 11.377 },
  Yobe: { lat: 11.748, lng: 11.966 },
  Zamfara: { lat: 12.1704, lng: 6.6641 },
};

const NIGERIA = { minLat: 4.2, maxLat: 13.9, minLng: 2.7, maxLng: 14.7 };

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function isInsideNigeria(lat: number, lng: number) {
  return lat >= NIGERIA.minLat && lat <= NIGERIA.maxLat && lng >= NIGERIA.minLng && lng <= NIGERIA.maxLng;
}

export function nearestState(lat: number, lng: number): State | null {
  if (!isInsideNigeria(lat, lng)) return null;

  let best: State = STATES[0];
  let bestKm = Infinity;
  for (const state of STATES) {
    const km = haversineKm({ lat, lng }, STATE_CAPITALS[state]);
    if (km < bestKm) {
      bestKm = km;
      best = state;
    }
  }
  return best;
}

export function isKnownState(value: string | null | undefined): value is State {
  return Boolean(value && (STATES as readonly string[]).includes(value));
}
