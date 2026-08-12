const KEY = "explore-last-url";

/** Save the current explore URL (called by explore when it mounts or filters change). */
export function saveExploreUrl(url: string) {
  sessionStorage.setItem(KEY, url);
}

/** Get the last explore URL, or fall back to plain /explore. */
export function getExploreUrl(): string {
  return sessionStorage.getItem(KEY) || "/explore";
}