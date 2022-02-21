import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = config.userInformationApiUrl;

export function getPeopleByName(name) {
  return http.get(apiEndpoint + "?person_name=" + name);
}

export function getWhoAmI(){
  return http.get(apiEndpoint + "/whoami");
}
