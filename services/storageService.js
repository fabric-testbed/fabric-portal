import http from './httpService';

const apiEndpoint = "/api/storage";

export function getStorage(project_uuid, offset, limit) {
  return http.get(`${apiEndpoint}?offset=${offset}&limit=${limit}&project_uuid=${project_uuid}`);
}

export function getStorageByID(storage_uuid) {
  return http.get(`${apiEndpoint}/${storage_uuid}`);
}

export function getSites() {
  return http.get(`${apiEndpoint}/sites`);
}

export function addStorage(storage) {
  return http.post(apiEndpoint, storage);
}

export function UpdateStorage(storage_uuid, storage) {
  return http.patch(`${apiEndpoint}/${storage_uuid}`, storage);
}

export function deleteStorage(storage_uuid) {
  return http.delete(`${apiEndpoint}/${storage_uuid}`);
}
