import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = `${config.fabricCoreApiUrl}/announcements`;

export function getActiveFacilityUpdates() {
  return http.get(`${apiEndpoint}?announcement_type=facility&is_active=true&offset=0&limit=5`);
}

export function getActiveMaintenanceNotice() {
  return http.get(`${apiEndpoint}?announcement_type=maintenance&is_active=true&offset=0&limit=3`);
}

export function getActiveNews() {
  return http.get(`${apiEndpoint}?announcement_type=news&is_active=true&offset=0&limit=2`);
}

export function getActiveCarouselItems() {
  return http.get(`${apiEndpoint}?announcement_type=carousel&is_active=true&offset=0&limit=10`);
}


