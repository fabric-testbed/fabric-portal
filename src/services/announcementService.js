import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = `${config.fabricCoreApiUrl}/announcements`;

export function getActiveFacilityUpdates() {
  return http.get(`${apiEndpoint}?announcement_type=facility&is_active=true&offset=0&limit=5`);
}
