import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = `${config.fabricCoreApiUrl}/sshkeys`;

export function getActiveKeys() {
  const userID = localStorage.getItem("userID");
  return http.get(`${apiEndpoint}?person_uuid=${userID}`);
}

export function uploadPublicKey(keytype, openssh, description) {
  // return http.post(`${apiEndpoint}/${keytype}?public_openssh=${encodeURIComponent(openssh)}&description=${description}`);
  return http.put(apiEndpoint,
    {
      "description": description,
      "keytype": keytype,
      "public_openssh": encodeURIComponent(openssh)
    }
  )
}

export function generateKeyPairs(keytype, comment, description) {
  // return http.put(`${apiEndpoint}/${keytype}?comment=${comment}&description=${description}`);
  return http.post(apiEndpoint,
    {
      "comment": comment,
      "description": description,
      "keytype": keytype
    }
  )
}

export function deleteKey(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}