import http from './httpService';
import { default as configData } from "../config.json";

const apiEndpoint = `${configData.fabricCoreApiUrl}/projects`;

export function getProjects(type, offset, limit, searchQuery) {
  const userID = localStorage.getItem("userID");
  if (type === "myProjects") {
    if (!searchQuery) {
      return http.get(`${apiEndpoint}?offset=${offset}&limit=${limit}&sort_by=created_time&order_by=desc&person_uuid=${userID}`);
    } else {
      return http.get(`${apiEndpoint}?search=${searchQuery}&offset=${offset}&limit=${limit}&sort_by=created_time&order_by=desc&person_uuid=${userID}`);
    }
  } else if (type === "allProjects") {
    if (!searchQuery) {
      return http.get(`${apiEndpoint}?offset=${offset}&limit=${limit}&sort_by=created_time&order_by=desc`);
    } else {
      return http.get(`${apiEndpoint}?search=${searchQuery}&offset=${offset}&limit=${limit}&sort_by=created_time&order_by=desc`);
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
      "is_public": project.is_public === "Yes",
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

export function updateProject(project, preferences) {
  return http.patch(`${apiEndpoint}/${project.uuid}`, {
    "description": project.description,
    "is_public": project.is_public === "Yes",
    "facility": "FABRIC",
    "name": project.name,
    "preferences": preferences
  });
}

export function updateTags(projectId, tags) {
  return http.patch(`${apiEndpoint}/${projectId}/tags`, {
    "tags": tags
  });
}

export function updateProjectPersonnel(projectId, ownerIDs, memberIDs) {
  return http.patch(`${apiEndpoint}/${projectId}/personnel`, {
    "project_owners": ownerIDs,
    "project_members": memberIDs
  })
}

export function updateProjectTokenHolders(projectId, operation, userIDs) {
  return http.patch(`${apiEndpoint}/${projectId}/token-holders?operation=${operation}`, {
    "token_holders": userIDs
  })
}

export function updateProjectExpirationTime(projectId, time) {
  return http.patch(`${apiEndpoint}/${projectId}/expires-on`, {
    "expires_on": time
  })
}