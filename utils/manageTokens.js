import { createIdToken } from "../services/credentialManagerService.js";
import { toast } from "react-toastify";

export const autoCreateTokens = async (projectId) => {
  try {
    const { data: res } = await createIdToken(projectId, "all");
    const token = res["data"][0];
    if (token?.id_token) {
      sessionStorage.setItem("fabric_token", token.id_token);
    } else {
      console.error("autoCreateTokens: no id_token in CM response", { projectId, response: res });
      throw new Error("Authentication token missing from response");
    }
    return token;
  }
  catch (err) {
    console.error("autoCreateTokens: CM request failed", { projectId, status: err.response?.status, data: err.response?.data, message: err.message });
    toast.error("Unable to obtain authentication token, the likely reason is you are not a member of any projects.");
    throw err;
  }
}
