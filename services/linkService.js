import http from './httpService';

const apiEndpoint = "/api/links";

export function getLinks() {
  return http.get(apiEndpoint);
}
