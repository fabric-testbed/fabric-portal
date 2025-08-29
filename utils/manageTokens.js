import { createIdToken } from "../services/credentialManagerService.js";
import { toast } from "react-toastify";

export const autoCreateTokens = async (projectId) => {
  try {
    // call credential manager to generate tokens.
    // parameters: project and scope, "all" for both by default.
    const { data: res } = await createIdToken(projectId, "all");
    localStorage.setItem("idToken", res["data"][0].id_token);
    localStorage.setItem("refreshToken", res["data"][0].refresh_token);

    return res["data"][0];
  }
  catch (err) {
    toast.error("Unable to obtain authentication token, the likely reason is you are not a member of any projects.");
  }
}