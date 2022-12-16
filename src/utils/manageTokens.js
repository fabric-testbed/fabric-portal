import { createIdToken, refreshToken, revokeToken } from "../services/credentialManagerService.js";
import { toast } from "react-toastify";

const autoRevokeTokens = async () => {
  try {
    await revokeToken(localStorage.getItem("refreshToken"));
  } catch (err) {
    console.log("Failed to revoke token.");
  }
}

export const autoCreateTokens = async (projectId) => {
  try {
    // call credential manager to generate tokens.
    // parameters: project and scope, "all" for both by default.
    const { data: res } = await createIdToken(projectId, "all");
    localStorage.setItem("idToken", res["data"][0].id_token);
    localStorage.setItem("refreshToken", res["data"][0].refresh_token);

    // autoRefreshToken after 55 minutes
    // clear last interval if there is any
    if(localStorage.getItem("refreshTokenIntervalId")) {
      clearInterval(localStorage.getItem("refreshTokenIntervalId"));
    }
    // TODO: set to 55min 
    const refreshTokenIntervalId = setInterval(() => 
      autoRefreshTokens(projectId)
    , 60000);
    localStorage.setItem("refreshTokenIntervalId", refreshTokenIntervalId);

    return res["data"][0];
  } catch (err) {
    toast.error("Unable to obtain authentication token, the likely reason is you are not a member of any projects.");
  }
}

export const autoRefreshTokens = async (projectId) => {
  const oldRefreshToken = localStorage.getItem("refreshToken");
  try {
    const { data: res } = await refreshToken(projectId, "all", oldRefreshToken);
    localStorage.setItem("idToken", res["data"][0].id_token);
    localStorage.setItem("refreshToken", res["data"][0].refresh_token);
  } catch (err) {
    toast.error("Failed to refresh necessary tokens to view slice information. Please try again later.");
    // if refresh_token isn't working either
    // start over by calling create_token when user reloads the page
    // 1. call cm revoke_token with old refresh token
    autoRevokeTokens();
    // 2. clear id_token and refresh_token in local storage
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");
  }
}