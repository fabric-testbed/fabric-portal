export default function clearLocalStorage() {
  // clear Local Storage when user logs out.
  // remove old user status stored in browser.
  localStorage.removeItem("idToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userID");
  localStorage.removeItem("bastionLogin");
  localStorage.removeItem("userStatus");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("sshKeyType");
  localStorage.removeItem("sliceDraft");
  localStorage.removeItem("countdownTimerIntervalId");
  localStorage.removeItem("sessionTimeoutIntervalId1");
  localStorage.removeItem("sessionTimeoutIntervalId2");
}
