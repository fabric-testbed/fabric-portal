import { createIdToken, refreshToken, revokeToken } from "../services/credentialManagerService.js";
import { toast } from "react-toastify";

const autoRevokeTokens = async () => {
  try {
    await revokeToken(localStorage.getItem("refreshToken"));
  } catch(err) {
    console.log(err);
    console.log("Failed to revoke token.");
    // TO DO: what if revoke token fails?
  }
}

export const autoCreateTokens = async () => {
  try {
    // call credential manager to generate tokens.
    // parameters: project and scope, "all" for both by default.
    const { data } = await createIdToken("all", "all");
    localStorage.setItem("idToken", data.id_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    return data;
  } catch(err) {
    console.log(err);
    toast.error("Failed to generate necessary tokens to view slice information. Please try again later.");
  }
}

export const autoRefreshTokens = async () => {
  const oldRefreshToken = localStorage.getItem("refreshToken");
  try {
    const { data } = await refreshToken("all", "all", oldRefreshToken);
    localStorage.setItem("idToken", data.id_token);
    localStorage.setItem("refreshToken", data.refresh_token);
  } catch (err) {
    console.log(err);
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