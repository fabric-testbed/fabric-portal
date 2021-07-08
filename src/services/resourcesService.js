import http from './httpService';
import { resourcesApiUrl } from "../config.json";

const apiEndpoint = resourcesApiUrl;

export function getResources() {
  return http.get(apiEndpoint);
}