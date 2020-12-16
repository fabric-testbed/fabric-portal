import http from './httpService';
import { userInformationApiUrl } from "../config.json";

const apiEndpoint = userInformationApiUrl;

export function getPeopleByName(name) {
  return http.get(apiEndpoint + "?person_name=" + name);
}

export function getWhoAmI(){
  return http.get(apiEndpoint + "/whoami");
}
