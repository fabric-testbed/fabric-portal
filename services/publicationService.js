import http from './httpService';

export function getPublications(params = {}) {
  const query = new URLSearchParams(params).toString();
  return http.get(`/api/publications${query ? `?${query}` : ""}`);
}

export function getPublicationsByProject(projectUuid) {
  return http.get(`/api/publications/by-project-uuid?project_uuid=${projectUuid}`);
}

export function getPublicationsByAuthor(fabricUuid) {
  return http.get(`/api/publications/by-author-uuid?fabric_uuid=${fabricUuid}`);
}
