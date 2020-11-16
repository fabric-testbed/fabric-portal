import axios from "axios";
import { projectRegistryApiUrl } from "../config.json";

const apiEndpoint = projectRegistryApiUrl;
const axiosConfig = {
  headers: {
    accept: "application/json",
  },
};

export function getProjects() {
  return axios.get(apiEndpoint, axiosConfig);
}

export function getProject(id) {
  return axios.get(apiEndpoint + "/" + id, axiosConfig);
}

export function saveProject(project) {
  if (project.uuid) {
    const params = new URLSearchParams({
      uuid: project.uuid,
      name: project.name,
      description: project.description,
      facility: project.facility,
    }).toString();
    const url = apiEndpoint + "/update?" + params;
    axios.put(url);
  } else {
    const params = new URLSearchParams({
      name: project.name,
      description: project.description,
      facility: project.facility,
    }).toString();
    const url = apiEndpoint + "/create?" + params;
    return axios.post(url);
    // return axios.post(apiEndpoint, project);
  }
}

export function deleteProject(projectId) {
  return axios.delete(apiEndpoint + "/delete?uuid=" + projectId);
}

export function deleteUser(userType, projectId, userId) {
  // userType: project_member, project_owner
  if (userType === "project_member") {
    return axios.put(
      apiEndpoint +
        "/remove_members?uuid=" +
        projectId +
        "&project_members=" +
        userId
    );
  }

  if (userType === "project_owner") {
    return axios.put(
      apiEndpoint +
        "/remove_owners?uuid=" +
        projectId +
        "&project_owners=" +
        userId
    );
  }
}

export function addUser(userType, projectId, userId) {
  // userType: project_member, project_owner
  if (userType === "project_member") {
    return axios.put(
      apiEndpoint +
        "/add_members?uuid=" +
        projectId +
        "&project_members=" +
        userId
    );
  }

  if (userType === "project_owner") {
    return axios.put(
      apiEndpoint +
        "/add_owners?uuid=" +
        projectId +
        "&project_owners=" +
        userId
    );
  }
}
