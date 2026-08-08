// Builds a complete auth route that stays in the right flow (attendee vs organizer).
// Fixes missing /auth prefixes AND keeps organizer pages in the organizer flow.
export function authPath(page: string, isOrganizer: boolean): string {
  return isOrganizer ? `/auth/organizer/${page}` : `/auth/${page}`;
}