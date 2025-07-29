import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = `${config.resourceLinkApiUrl}`;

export function getLinks() {  
  return http.get(`${apiEndpoint}`);
}