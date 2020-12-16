import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

// toast error messages.
axios.interceptors.response.use(null, (error) => {
  // check unexpected errors.
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  

  if (error.response && error.response.status >= 400 && error.response.status < 500) {
    toast.error("A client-side error occurred.");
  }

  if (error.response && error.response.status >= 500) {
    toast.error("A server-side error occurred.");
  }

  if (!expectedError) {
    // logger.log(error);
    toast.error("An unexpected error occurred.");
  }

  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
