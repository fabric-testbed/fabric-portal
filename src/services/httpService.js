import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx cause this function.
    console.log("res" + response);
    console.log("res.headers" + response.headers);
    console.log("response.status" + response.status);
    console.log("res.headers" + response.headers['content-type']);
    return response;
  }, 
  (error) => {
    // Any status code that falls outside the range of 2xx cause this function.
    console.log("error" + error);
    console.log("error.response.status" + error.response.status);
    console.log("error.response.headers" + error.response.headers);
    console.log("error.response.headers['content-type']" + error.response.headers['content-type']);
    console.log("error.response.headers['x-error']" + error.response.headers['x-error']);

    toast.error("test error");
    toast.error(error.response.headers['content-type']);
    toast.error(error.response.headers['x-error']);

    if (error.response && error.response.status === 401) {
      // user is not active and need signup
      // do not toast error message.
      return Promise.reject(error); 
    }

    const clientError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    
    const serverError = error.response && error.response.status >= 500 ;

    if (clientError) {
      toast.error("A client-side error occurred.");
    } else if (serverError){
      toast.error("A server-side error occurred.");
    } else {
      toast.error("An unexpected error occurred.");
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
