import http from './httpService';
import { credentialManagerApiUrl } from "../config.json";

const apiEndpoint = credentialManagerApiUrl;

export function createIdToken(scope) {
  return http.post(apiEndpoint + "/create?projectName=all&scope=" + scope);
}

export function refreshToken(scope, refresh_token) {
  const data = {
    "refresh_token": refresh_token
  }
  return http.post(apiEndpoint + "/refresh?projectName=all&scope=" + scope, data);
}

export function revokeToken(refresh_token) {
  const data = {
    "refresh_token": refresh_token
  }
  return http.post(apiEndpoint + "/revoke", data);
}
