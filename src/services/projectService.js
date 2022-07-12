import http from './httpService';
import { default as configData } from "../config.json";

const apiEndpoint = `${configData.fabricCoreApiUrl}/projects`;

export function getMyProjects() {
  const userID = localStorage.getItem("userID");
  return http.get(`${apiEndpoint}?offset=0&limit=20&person_uuid=${userID}`);
}