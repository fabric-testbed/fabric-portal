import http from './httpService';
import { sshKeyApiUrl } from "../config.json";

const apiEndpoint = sshKeyApiUrl;

export function getActiveKeys() {
  return http.get(`${apiEndpoint}s`);
}

export function uploadPublicKey(keytype, openssh, description) {
  return http.post(`${apiEndpoint}/${keytype}?public_openssh=${openssh}&description=${description}`);
}

export function generateKeyPairs(keytype, comment, description) {
  return http.put(`${apiEndpoint}/${keytype}?comment=${comment}&description=${description}`);
}