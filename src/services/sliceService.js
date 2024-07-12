import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = `${config.orchestratorApiUrl}/slices`;
const poasEndpoint = `${config.orchestratorApiUrl}/poas`;

export function getSlices(type, as_self) {
  if (type === "projectSlices") {
    return http.get(`${apiEndpoint}?as_self=${as_self}&states=All&limit=200&offset=0`, {
      headers: {'Authorization': `Bearer ${localStorage.getItem("idToken")}`}
    });
  } else {
    return http.get(apiEndpoint + "?as_self=true&states=All&limit=200&offset=0", {
      headers: {'Authorization': `Bearer ${localStorage.getItem("idToken")}`}
    });
  }
}

export function getSliceById(id) {
  return http.get(apiEndpoint + "/" + id + "?graph_format=JSON_NODELINK", {
    headers: {'Authorization': `Bearer ${localStorage.getItem("idToken")}`}
  });
}

export function createSlice(slice) {
  const query = new URLSearchParams({
    name: slice.name,
    lease_end_time: slice.leaseEndTime,
    lease_start_time: slice.leaseStartTime
  }).toString();
 
  const requestBody = {
    "graph_model": slice.json,
    "ssh_keys": slice.sshKeys,
    "UserData": {
      "fabric_reserved": {
        "sliver_key_name": slice.sshKeyNames
      }
    }
  }

  const url = apiEndpoint + "/creates?" + query;
  return http.post(
    url,
    requestBody,
    {
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("idToken")}`
    }
  });
}

export function deleteSlice(id) {
  if (id) {
    return http.delete(`${apiEndpoint}/delete/${id}`, {
      headers: {'Authorization': `Bearer ${localStorage.getItem("idToken")}`}
    });
  } else {
    return http.delete(`${apiEndpoint}/delete`, {
      headers: {'Authorization': `Bearer ${localStorage.getItem("idToken")}`}
    });
  }
}

export function extendSlice(id, lease_end_time) {
  return http.post(`${apiEndpoint}/renew/${id}?lease_end_time=${lease_end_time}`, {}, {
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem("idToken")}`
  }
});
}

export function installEphemeralKey(sliverID, public_openssh) {
  return http.post(`${poasEndpoint}/create/${sliverID}`, 
  { 
    data: { 
      keys: [{
        "comment": `ephemeral-key-${sliverID}`,
        "key": public_openssh
      }],
    },
    "operation": "addkey"
  },
  {
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem("idToken")}`
    }
  })
}