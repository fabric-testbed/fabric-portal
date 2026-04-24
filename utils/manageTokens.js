import { createIdToken } from "../services/credentialManagerService.js";
import { toast } from "react-toastify";

export const autoCreateTokens = async (projectId) => {
  try {
    const { data: res } = await createIdToken(projectId, "all");
    const token = res["data"][0];
    if (token?.id_token) {
      sessionStorage.setItem("fabric_token", token.id_token);
    }
    return token;
  }
  catch (err) {
    toast.error("Unable to obtain authentication token, the likely reason is you are not a member of any projects.");
  }
}
