import http from './httpService';
import { default as configData } from "../config.json";

const apiEndpoint = `${configData.fabricCoreApiUrl}/projects`;

export function getMyProjects() {
  const userID = localStorage.getItem("userID");
  return http.get(`${apiEndpoint}?offset=0&limit=20&person_uuid=${userID}`);
}

export function getAllProjects() {
  return http.get(`${apiEndpoint}?offset=0&limit=20`);
}

export function getProjectById(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function getProjectTags() {
  return http.get(`${apiEndpoint}/tags`);
}

export function createProject(project) {
  return http.post(`${apiEndpoint}/projects`,
  {
    "name": project.name,
    "description": project.description,
    "facility": project.facility,
    // tags: project.tags.join(),
    // project_owners: project.project_owners.join(","),
    // project_members: project.project_members.join(","),
  }
);
}