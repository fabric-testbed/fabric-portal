import http from './httpService';

const apiEndpoint = "/api/tokens";

export function createIdToken(projectId, scope) {
  return http.post(`${apiEndpoint}/create?project_id=${projectId}&scope=${scope}`);
}

export function refreshToken(projectId, scope, refresh_token) {
  return http.post(`${apiEndpoint}/refresh?project_id=${projectId}&scope=${scope}`, {
    "refresh_token": refresh_token
  });
}

export function revokeToken(refresh_token) {
  return http.post(`${apiEndpoint}/revoke`, {
    "refresh_token": refresh_token
  });
}
