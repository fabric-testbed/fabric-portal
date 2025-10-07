import http from './httpService';
import { default as configData } from "../config.json";

const apiEndpoint = `${configData.fabricCoreApiUrl}/projects`;

export function getProjects(type, offset, limit, searchQuery, searchSet) {
  const userID = localStorage.getItem("userID");
  if (type === "myProjects") {
    if (!searchQuery) {
      return http.get(`${apiEndpoint}?offset=${offset}&limit=${limit}&sort_by=created_time&order_by=desc&person_uuid=${userID}`);
    } else {
      return http.get(`${apiEndpoint}?search=${searchQuery}&offset=${offset}&limit=${limit}&sort_by=created_time&order_by=desc&person_uuid=${userID}&search_set=${searchSet}`);
    }
  } else if (type === "allProjects") {
    if (!searchQuery) {
      return http.get(`${apiEndpoint}?offset=${offset}&limit=${limit}&sort_by=created_time&order_by=desc`);
    } else {
      return http.get(`${apiEndpoint}?search=${searchQuery}&offset=${offset}&limit=${limit}&sort_by=created_time&order_by=desc&search_set=${searchSet}`);
    }
  }
}

export function getProjectById(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function getProjectTags() {
  return http.get(`${apiEndpoint}/tags`);
}

export function createProject(project) {
  return http.post(`${apiEndpoint}`,
    {
      "name": project.name,
      "description": project.description,
      "is_public": project.is_public === "Yes",
      "project_lead": project.project_lead,
      "project_type": project.project_type
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
    "preferences": preferences,
    "project_type": project.project_type
  });
}

export function updateTags(projectId, tags) {
  return http.patch(`${apiEndpoint}/${projectId}/tags`, {
    "tags": tags
  });
}

export function updateProjectPersonnel(projectId, userIDs, operation, personnelType) {
  if (personnelType === "Project Owners") {
    return http.patch(`${apiEndpoint}/${projectId}/project-owners?operation=${operation}`, {
      "project_owners": userIDs,
    })
  } else {
    return http.patch(`${apiEndpoint}/${projectId}/project-members?operation=${operation}`, {
      "project_members": userIDs,
    })
  }
}

export function updateProjectFunding(projectId, project_funding) {
  return http.patch(`${apiEndpoint}/${projectId}/project-funding`, {
    "project_funding": project_funding
  })
}

export function updateProjectCommunity(projectId, communities) {
  return http.patch(`${apiEndpoint}/${projectId}/communities`, {
    "communities": communities
  })
}

export function updateMatrix(projectId, matrix) {
  return http.patch(`${apiEndpoint}/${projectId}/profile`, {
    "references": [
      {
        "description": "fabric-matrix",
        "url": matrix
      }
    ]
  })
}

export function updateProjectTopics(projectId, topics) {
  return http.patch(`${apiEndpoint}/${projectId}/topics`, {
    "topics": topics
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

export function getFundingAgencies() {
  return http.get(`${apiEndpoint}/funding-agencies`);
}

export function getFundingDirectorates() {
  return http.get(`${apiEndpoint}/funding-directorates`);
}
