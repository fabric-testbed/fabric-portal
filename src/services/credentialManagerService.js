import http from './httpService';
import { credentialManagerApiUrl } from "../config.json";

const apiEndpoint = credentialManagerApiUrl;

export function createIdToken() {
  return http.post(apiEndpoint + "/create?projectName=all&scope=all");
}

export function refreshToken() {
  return http.post(apiEndpoint + "/refresh?projectName=all&scope=all");
}

export function revokeToken() {
  return http.post(apiEndpoint + "/revoke");
}
