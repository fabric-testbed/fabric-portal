import http from './httpService';
import { default as config } from "../assets/config.json";

const apiEndpoint = `${config.resourceLinkApiUrl}`;

export function getLinks() {  
  return http.get(`${apiEndpoint}`);
}