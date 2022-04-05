import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = config.orchestratorApiUrl;

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

export function createSlice(slice) {
  const query = new URLSearchParams({
    sliceName: slice.name,
    sshKey: slice.sshKey,
    leaseEndTime: slice.leaseEndTime,
  }).toString();
  const url = apiEndpoint + "/create?" + query;
  http.post(
    url,
    {data: slice.graphml},
    {
      headers: {
      'Content-Type': 'text/plain',
      'Authorization': `Bearer ${localStorage.getItem("idToken")}`
    }
  });
}

export function deleteSlice(id) {
  http.delete(`${apiEndpoint}/delete/${id}`);
}