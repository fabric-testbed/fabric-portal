import axios from "axios";
import { userInformationApiUrl } from "../config.json";

const apiEndpoint = userInformationApiUrl;
const config = { withCredentials: true };

export function getPeopleByName(name) {
  return axios.get(apiEndpoint + "?person_name=" + name, config);
}

export function getWhoAmI(){
  return axios.get(apiEndpoint + "/oidc_claim_sub?oidc_claim_sub=something", config);
}