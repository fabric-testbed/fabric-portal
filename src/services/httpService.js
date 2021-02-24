import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

axios.interceptors.response.use(null, (error) => {

    console.log("------");
    console.log("error" + error);
    console.log("error.reponse" + error.reponse);
    console.log("error.reponse.headers" + error.reponse.headers);
    console.log("error.reponse.headers['Content-Type']" + error.reponse.headers['Content-Type']);
    console.log("error.reponse.headers['X-Error']" + error.reponse.headers['X-Error']);
    console.log("------");

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
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
