import http from './httpService';
import { default as configData } from "../config.json";

const apiEndpoint = `${configData.fabricCoreApiUrl}/projects`;

export function getProjects(type, offset, limit, searchQuery) {
  const userID = localStorage.getItem("userID");
  if (type === "myProjects") {
    if (!searchQuery) {
      return http.get(`${apiEndpoint}?offset=${offset}&limit=${limit}&person_uuid=${userID}`);
    } else {
      return http.get(`${apiEndpoint}?search=${searchQuery}&offset=${offset}&limit=${limit}&person_uuid=${userID}`);
    }
  } else if (type === "allProjects") {
    if (!searchQuery) {
      return http.get(`${apiEndpoint}?offset=${offset}&limit=${limit}`);
    } else {
      return http.get(`${apiEndpoint}?search=${searchQuery}&offset=${offset}&limit=${limit}`);
    }
  }
}

export function getProjectById(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function getProjectTags() {
  return http.get(`${apiEndpoint}/tags`);
}

export function createProject(project, project_owners, project_members) {
  return http.post(`${apiEndpoint}`,
    {
      "name": project.name,
      "description": project.description,
      "is_public": true,
      "facility": project.facility,
      "tags": project.tags,
      "project_owners": project_owners,
      "project_members": project_members,
    }
  );
}

export function deleteProject(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}

export function updateProject(project) {
  return http.patch(`${apiEndpoint}/${project.id}`, {
    "description": project.description,
    "is_public": true,
    "facility": "FABRIC",
    "name": project.name,
    "preferences": {
    }
  });
}

export function updateTags(projectId, tags) {
  return http.patch(`${apiEndpoint}/${projectId}`, {
    "tags": tags
  });
}

export function updatePersonnel(projectId, owners, members) {
  return http.patch(`${apiEndpoint}/${projectId}`, {
    "project_members": members,
    "project_owners": owners
  })
}