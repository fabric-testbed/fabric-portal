import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = `${config.orchestratorApiUrl}/portalresources?graph_format=JSON_NODELINK`;

export function getResources() {
  return http.get(apiEndpoint);
}