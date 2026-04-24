import axios from "axios";
import { toast } from "react-toastify";
import { clearSession } from "@/utils/sessionCookies";

// Attach the fabric token (stored in sessionStorage by autoCreateTokens) as a
// Bearer Authorization header for orchestrator and POAS proxy routes. The proxy
// already prefers this header over the (now-removed) fabric_token cookie, which
// was causing "400 Request Header Or Cookie Too Large" errors on nginx.
axios.interceptors.request.use((config) => {
  const orchestratorRoutes = ["/api/slices", "/api/poas"];
  if (orchestratorRoutes.some((route) => config.url?.startsWith(route))) {
    const token = typeof window !== "undefined" && sessionStorage.getItem("fabric_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

axios.interceptors.response.use(null, (error) => {
    if (error.response && error.response.status === 401) {
      const errors = error.response.data?.errors;
      const details = errors?.[0]?.details || "";

      if (details.includes("Login required")) {
        // Session expired — clear cached state then redirect to login
        clearSession();
        window.location.href = "/login?url=" + encodeURIComponent(window.location.origin + "/");
      }

      // All other 401s (enrollment required, credential manager, etc.) are
      // handled by their respective callers.
      return Promise.reject(error);
    }

    // Timeout error
    if(error.code === 'ECONNABORTED') {
      toast.error("Request timeout. Please try again.");
      return Promise.reject(error);
    }

    if (error.response && error.response.data
    && error.response.data.errors && error.response.data.errors.length > 0) {
      for (const err of error.response.data.errors) {
        console.log(`ERROR: ${err.details}`);
        toast.error(err.details);
      }
    }

    return Promise.reject(error);
  }
);

const httpServices = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch
}

export default httpServices;
