import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = `${config.orchestratorApiUrl}/portalresources?graph_format=JSON_NODELINK`;

export function getResources(level, start, end) {
  if (start && end) {
    return http.get(`${apiEndpoint}&level=${level}&start_date=${start}&end_date=${end}`)
  }

  return http.get(`${apiEndpoint}&level=${level}`);
}