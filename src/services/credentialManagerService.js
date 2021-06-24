import http from './httpService';
import { credentialManagerApiUrl } from "../config.json";

const apiEndpoint = credentialManagerApiUrl;

export function createIdToken() {
  return http.post(apiEndpoint + "/create?projectName=all&scope=all");
}

export function refreshToken(refresh_token) {
  const data = {
    "refresh_token": refresh_token
  }
  return http.post(apiEndpoint + "/refresh?projectName=all&scope=all", data);
}

export function revokeToken(refresh_token) {
  const data = {
    "refresh_token": refresh_token
  }
  return http.post(apiEndpoint + "/revoke", data);
}
