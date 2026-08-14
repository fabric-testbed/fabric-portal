import Cookies from "js-cookie";

// Expire app session cookies after 4 hours — matching the Vouch auth cookie
// lifetime — so stale state doesn't persist after the auth session ends.
const SESSION_HOURS = 4;

const COOKIE_OPTIONS = {
  path: "/",
  sameSite: "lax",
  expires: SESSION_HOURS / 24,
};

/**
 * Read a session value. Returns null when called during SSR (no window).
 */
export function getSessionItem(key) {
  if (typeof window === "undefined") return null;
  return Cookies.get(key) ?? null;
}

/**
 * Write a session value as a client-side cookie.
 */
export function setSessionItem(key, value) {
  if (typeof window === "undefined") return;
  Cookies.set(key, String(value), COOKIE_OPTIONS);
}

/**
 * Remove a single session cookie.
 */
export function removeSessionItem(key) {
  if (typeof window === "undefined") return;
  Cookies.remove(key, { path: "/" });
}

/**
 * Clear all auth/session cookies set by this app.
 */
export function clearSession() {
  [
    "userID",
    "userStatus",
    "userName",
    "userEmail",
    "bastionLogin",
    "sshKeyType",
  ].forEach((key) => removeSessionItem(key));
}
