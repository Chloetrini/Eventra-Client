import { redirect } from "react-router-dom";

/**
 * Helper: Fetch user from session (localStorage, cookies, or API)
 */
async function getUserFromSession() {
  // Example 1: Read from localStorage (JWT)
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { role: payload.role, name: payload.name };
  } catch {
    return null;
  }

  // Example 2: If you use HTTP‑only cookies, call an API:
  // try {
  //   const res = await fetch("/api/me", { credentials: "include" });
  //   if (!res.ok) return null;
  //   return res.json();
  // } catch {
  //   return null;
  // }
}

/**
 * Loader: Protects organizer dashboard routes
 * Redirects to /login if user is not authenticated or not an organizer
 */
export async function organizerLoader() {
  const user = await getUserFromSession();

  if (!user || user.role !== "organizer") {
    return redirect("/login");
  }

  return null; // allow access
}