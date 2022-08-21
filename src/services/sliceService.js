import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = `${config.orchestratorApiUrl}/slices`;

export function getSlices() {
  return http.get(apiEndpoint + "?states=All&limit=200&offset=0", {
    headers: {'Authorization': `Bearer ${localStorage.getItem("idToken")}`}
  });
}

export function getSliceById(id) {
  return http.get(apiEndpoint + "/" + id + "?graph_format=JSON_NODELINK", {
    headers: {'Authorization': `Bearer ${localStorage.getItem("idToken")}`}
  });
}

export function createSlice(slice) {
  let query = "";

  // lease end time is optional.
  if (slice.leaseEndTime) {
    query = new URLSearchParams({
      name: slice.name,
      ssh_key: slice.sshKey,
      lease_end_time: slice.leaseEndTime,
    }).toString();
  } else {
    query = new URLSearchParams({
      name: slice.name,
      ssh_key: slice.sshKey,
    }).toString();
  }

  const url = apiEndpoint + "/create?" + query;
  return http.post(
    url,
    slice.json,
    {
      headers: {
      'Content-Type': 'text/plain',
      'Authorization': `Bearer ${localStorage.getItem("idToken")}`
    }
  });
}

export function deleteSlice(id) {
  return http.delete(`${apiEndpoint}/delete/${id}`, {
    headers: {'Authorization': `Bearer ${localStorage.getItem("idToken")}`}
  });
}