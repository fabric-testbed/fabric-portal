import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = `${config.fabricCoreApiUrl}`;

export function getPeopleByName(name) {
  return http.get(`${apiEndpoint}/people?search=${name}&offset=0&limit=20`);
}

export function getWhoAmI(){
  return http.get(`${apiEndpoint}/whoami`);
}
