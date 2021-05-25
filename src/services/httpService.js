import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;
// set timeout to be 20 seconds
axios.defaults.timeout = 20000;

axios.interceptors.response.use(null, (error) => {
    if (error.response && error.response.status === 401) {
      // the user has not logged in or the auth cookie is expired
      localStorage.setItem("userStatus", "unauthorized");
      window.location.reload();
      // do not toast error message.
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 403) {
      // the user has logged in but hasn't completed self-signup yet
      // do not toast error message.
      return Promise.reject(error); 
    }

    // Timeout error.
    if(error.code === 'ECONNABORTED') {
      toast.error("Request timeout. Please try again.");
      return Promise.reject(error); 
    }
  
    if (error.response && error.response.data) {
      // toast the error message of x-error.
      toast.error(error.response.data);
    }

    return Promise.reject(error); 
  }
);

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
