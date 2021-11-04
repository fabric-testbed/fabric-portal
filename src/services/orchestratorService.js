import http from './httpService';
import { orchestratorApiUrl } from "../config.json";

const apiEndpoint = orchestratorApiUrl;

export function getSlices() {
  return http.get(apiEndpoint + "?states=Nascent&states=Configuring&states=StableOK&states=StableError&states=Closing&states=Dead", {
    headers: {'Authorization': `Bearer ${localStorage.getItem("idToken")}`}
  });
}

export function getSliceById(id) {
  return http.get(apiEndpoint + "/" + id + "?graphFormat=JSON_NODELINK", {
    headers: {'Authorization': `Bearer ${localStorage.getItem("idToken")}`}
  });
}