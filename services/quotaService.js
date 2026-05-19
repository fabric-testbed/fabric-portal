import http from './httpService';

const apiEndpoint = "/api/quotas";

export function getQuotas(projectUuid) {
  return http.get(`${apiEndpoint}?project_uuid=${projectUuid}`);
}

export function updateQuota(uuid, quota) {
  return http.put(`${apiEndpoint}/${uuid}`, quota);
}

