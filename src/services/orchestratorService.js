import http from './httpService';
import { orchestratorApiUrl } from "../config.json";

const apiEndpoint = orchestratorApiUrl;

export function getSlices() {
  return http.get(apiEndpoint, {
    headers: {'Authorization': `Bearer ${localStorage.getItem("idToken")}`}
  }).slices;
}