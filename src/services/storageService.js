import http from './httpService';
import { default as configData } from "../config.json";

const apiEndpoint = `${configData.fabricCoreApiUrl}/storage`;

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
  /* 
  Request body schema:
  {
    "expires_on": "string",
    "project_uuid": "string",
    "requested_by_uuid": "string",
    "site_list": [
      "string"
    ],
    "volume_name": "string",
    "volume_size_gb": 0
  }
  */
  return http.post(`${apiEndpoint}`, storage);
}

export function UpdateStorage(storage_uuid, storage) {
  /*
    Request body schema:
    {
      "active": true,
      "expires_on": "string",
      "site_list": [
        "string"
      ],
      "volume_name": "string",
      "volume_size_gb": 0
    }
  */
    return http.patch(`${apiEndpoint}/${storage_uuid}`, storage);
}

export function deleteStorage(storage_uuid) {
  return http.delete(`${apiEndpoint}/${storage_uuid}`);
}









