import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = `${config.orchestratorApiUrl}/slices`;
const headersConfig = {
  headers: {'Authorization': `Bearer ${localStorage.getItem("idToken")}`}
};

export function getSlices() {
  return http.get(apiEndpoint + "?states=All&limit=200&offset=0", headersConfig);
}

export function getSliceById(id) {
  return http.get(apiEndpoint + "/" + id + "?graph_format=JSON_NODELINK", headersConfig);
}

export function createSlice(slice) {
  let query = "";

  // lease end time is optional.
  if (slice.leaseEndTime) {
    query = new URLSearchParams({
      name: slice.name,
      lease_end_time: slice.leaseEndTime
    }).toString();
  } else {
    query = new URLSearchParams({
      name: slice.name
    }).toString();
  }

  const requestBody = {
    "graph_model": slice.json,
    "ssh_keys": [slice.sshKey]
  }

  const url = apiEndpoint + "/create?" + query;
  return http.post(
    url,
    requestBody,
    {
      headers: {
      'Content-Type': 'text/plain',
      'Authorization': `Bearer ${localStorage.getItem("idToken")}`
    }
  });
}

export function deleteSlice(id) {
  if (id) {
    return http.delete(`${apiEndpoint}/delete/${id}`, headersConfig);
  } else {
    return http.delete(`${apiEndpoint}/delete`, headersConfig);
  }
}

export function extendSlice(id, lease_end_time) {
  return http.post(`${apiEndpoint}/renew/${id}?lease_end_time=${lease_end_time}`, headersConfig);
}