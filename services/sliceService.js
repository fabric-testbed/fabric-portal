import http from './httpService';

const apiEndpoint = "/api/slices";
const poasEndpoint = "/api/poas";

export function getSlices(type, as_self) {
  const params = new URLSearchParams({
    as_self: type === "projectSlices" ? String(as_self) : "true",
    limit: "200",
    offset: "0",
    states: "All",
  });
  return http.get(`${apiEndpoint}?${params}`);
}

export function getSliceById(id) {
  return http.get(apiEndpoint + "/" + id + "?graph_format=JSON_NODELINK");
}

export function createSlice(slice, idToken) {
  const query = new URLSearchParams({
    ...(slice.leaseEndTime) && {lease_end_time: slice.leaseEndTime},
    ...(slice.leaseStartTime) && {lease_start_time: slice.leaseStartTime},
    name: slice.name
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
  return http.post(url, requestBody, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });
}

export function deleteSlice(id) {
  if (id) {
    return http.delete(`${apiEndpoint}/delete/${id}`);
  } else {
    return http.delete(`${apiEndpoint}/delete`);
  }
}

export function extendSlice(id, lease_end_time) {
  return http.post(`${apiEndpoint}/renew/${id}?lease_end_time=${lease_end_time}`, {});
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
  })
}
