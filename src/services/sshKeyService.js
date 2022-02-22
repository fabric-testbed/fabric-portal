import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = config.sshKeyApiUrl;

export function getActiveKeys() {
  return http.get(`${apiEndpoint}s`);
}

export function uploadPublicKey(keytype, openssh, description) {
  return http.post(`${apiEndpoint}/${keytype}?public_openssh=${encodeURIComponent(openssh)}&description=${description}`);
}

export function generateKeyPairs(keytype, comment, description) {
  return http.put(`${apiEndpoint}/${keytype}?comment=${comment}&description=${description}`);
}

export function deleteKey(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}