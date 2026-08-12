const SUBMITTED_KEY = "eventra-onboarding-submitted";

/** Called by the success page after the user completes onboarding. */
export function markOnboardingSubmitted(): void {
  localStorage.setItem(SUBMITTED_KEY, "true");
}

/** Called on logout or when backend confirms status — resets local flag. */
export function clearOnboardingSubmitted(): void {
  localStorage.removeItem(SUBMITTED_KEY);
}

/**
 * Frontend-derived organizer account status.
 * Used by the dashboard mock until the backend returns the real status.
 * - "pending" if the user has submitted onboarding (success page reached)
 * - "unverified" otherwise (fresh account OR started onboarding but didn't finish)
 */
export function getDerivedAccountStatus(): "unverified" | "pending" {
  const submitted = localStorage.getItem(SUBMITTED_KEY);
  return submitted === "true" ? "pending" : "unverified";
}