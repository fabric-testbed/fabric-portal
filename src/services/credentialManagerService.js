import http from './httpService';
import { credentialManagerApiUrl } from "../config.json";

const apiEndpoint = credentialManagerApiUrl;

export function createIdToken(project, scope) {
  return http.post(apiEndpoint + "/create?projectName=" + encodeURI(project) + "&scope=" + scope);
}

export function refreshToken(project, scope, refresh_token) {
  const data = {
    "refresh_token": refresh_token
  }
  return http.post(apiEndpoint + "/refresh?projectName=" + encodeURI(project) + "&scope=" + scope, data);
}

export function revokeToken(refresh_token) {
  const data = {
    "refresh_token": refresh_token
  }
  return http.post(apiEndpoint + "/revoke", data);
}
