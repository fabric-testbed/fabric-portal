import http from './httpService';

export function getPublications(params = {}) {
  const query = new URLSearchParams(params).toString();
  return http.get(`/api/publications${query ? `?${query}` : ""}`);
}
