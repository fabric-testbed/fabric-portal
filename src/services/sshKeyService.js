import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = `${config.fabricCoreApiUrl}/sshkeys`;

export function getActiveKeys() {
  const userID = localStorage.getItem("userID");
  return http.get(`${apiEndpoint}?person_uuid=${userID}`);
}

export function uploadPublicKey(keytype, openssh, description) {
  return http.put(apiEndpoint,
    {
      "description": description,
      "keytype": keytype,
      "public_openssh": openssh
    }
  )
}

export function generateKeyPairs(type, comment, description) {
  return http.post(apiEndpoint,
    {
      "comment": comment,
      "description": description,
      "keytype": type === "Bastion" ? "bastion" : "sliver"
    }
  )
}

export function deleteKey(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}