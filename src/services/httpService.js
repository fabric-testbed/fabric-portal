import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;
// axios.defaults.timeout = 20000;

axios.interceptors.response.use(null, (error) => {
    // Any status code that falls outside the range of 2xx cause this function.
    console.log("error.response.data: " + error.response.data);
    console.log("error.response.status" + error.response.status);
    console.log("error.response.headers keys: " + Object.keys(error.response.headers));
    console.log("error.response.headers['content-type']" + error.response.headers['content-type']);
    console.log("error.response.headers['x-error']" + error.response.headers['x-error']);

    if (error.response && error.response.status === 401) {
      // user is not active and need signup
      // do not toast error message.
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
