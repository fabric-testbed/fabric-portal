import { clearSession } from "./sessionCookies";

/**
 * @deprecated Use clearSession() from utils/sessionCookies instead.
 * Kept for any remaining call sites not yet migrated.
 */
export default function clearLocalStorage() {
  clearSession();
}
