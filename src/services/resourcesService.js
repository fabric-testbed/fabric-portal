import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = config.resourcesApiUrl;

export function getResources() {
  return http.get(apiEndpoint);
}