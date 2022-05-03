import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = config.credentialManagerApiUrl;

export function createIdToken(projectId, scope) {
  return http.post(apiEndpoint + "/create?projectId=" + encodeURI(projectId) + "&scope=" + scope);
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
