import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

axios.interceptors.response.use(null, (error) => {
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
