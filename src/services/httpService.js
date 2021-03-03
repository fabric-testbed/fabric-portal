import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

axios.interceptors.response.use(null, (error) => {
  console.log("------");
  console.log("error" + error);
  console.log("error.response" + error.response);
  console.log("error.response.status" + error.response.status);
  console.log("error.response.headers" + error.response.headers);
  console.log("error.response.headers['Content-Type']" + error.response.headers['Content-Type']);
  console.log("error.response.headers['X-Error']" + error.response.headers['X-Error']);
  console.log("------");

  if (error.response && error.response.status === 401) {
    // user is not active and need signup
    // do not toast error message.
    toast.error("test error");
    toast.error(error.response.headers['X-Error']);
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
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
