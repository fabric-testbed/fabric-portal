import http from './httpService';
import { orchestratorApiUrl } from "../config.json";

const apiEndpoint = orchestratorApiUrl;

export function getSlices() {
  return http.get(apiEndpoint + "?states=['Nascent', 'Configuring', 'StableOK', 'StableError', 'Closing', 'Dead']", {
    headers: {'Authorization': `Bearer ${localStorage.getItem("idToken")}`}
  });
}

export function getSliceById(id) {
  return http.get(apiEndpoint + "/" + id + "?graphFormat=JSON_NODELINK", {
    headers: {'Authorization': `Bearer ${localStorage.getItem("idToken")}`}
  });
}