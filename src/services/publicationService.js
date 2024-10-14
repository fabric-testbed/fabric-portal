import http from './httpService';
import { default as config } from "../config.json";

const publicationsEndpoint = `${config.publicationsTrackerApiUrl}`;

export function getPublications() {
  return http.get(publicationsEndpoint);
}
