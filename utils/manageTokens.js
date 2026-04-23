import { createIdToken } from "../services/credentialManagerService.js";
import { toast } from "react-toastify";

export const autoCreateTokens = async (projectId) => {
  try {
    // call credential manager to generate tokens.
    // parameters: project and scope, "all" for both by default.
    const { data: res } = await createIdToken(projectId, "all");
    // Tokens are now managed server-side via BFF cookies.
    // Return the token data for immediate use but don't store in localStorage.
    return res["data"][0];
  }
  catch (err) {
    toast.error("Unable to obtain authentication token, the likely reason is you are not a member of any projects.");
  }
}
