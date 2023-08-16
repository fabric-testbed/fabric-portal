import axios from "axios";
import { toast } from "react-toastify";
import clearLocalStorage from "../utils/clearLocalStorage";

axios.defaults.withCredentials = true;
// set timeout to be 20 seconds
// axios.defaults.timeout = 20000;

axios.interceptors.response.use(null, (error) => {
    if (error.response && error.response.status === 401) {
      // 1. the user has not logged in (errors.details: "Login required: ...")
      // 2. the user login but haven't enrolled yet (errors.details: "Enrollment required: ...")
      // 3. or the auth cookie is expired
      const isCookieExpired = localStorage.getItem("userStatus", "active");

      const errors = error.response.data.errors;

      if (errors && errors[0].details.includes("Login required")) {
        localStorage.setItem("userStatus", "unauthorized");
        localStorage.removeItem("userID");
      }

      if (errors && errors[0].details.includes("Enrollment required")) {
        localStorage.setItem("userStatus", "inactive");
      } 

      // if cookie expired, log the user out; 
      // otherwise the user is not logged in and no need to auto logout.
      if (isCookieExpired) {
        // removed local storage items.
        clearLocalStorage();
        // log the user out.
        window.location.href = "/logout";
      }
 
      // do not toast error message.
      return Promise.reject(error);
    }

    // Timeout error.
    if(error.code === 'ECONNABORTED') {
      toast.error("Request timeout. Please try again.");
      return Promise.reject(error); 
    }
  
    if (error.response && error.response.data 
    && error.response.data.errors && error.response.data.errors.length > 0) {
      for (const err of error.response.data.errors) {
        // console log and toast the human-readable error details.
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