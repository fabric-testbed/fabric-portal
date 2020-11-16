import axios from "axios";
import { projectRegistryApiUrl } from "../config.json";

const apiEndpoint = projectRegistryApiUrl;
const axiosConfig = {
  headers: {
    accept: "application/json",
  },
};

function projectUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getProjects() {
  return axios.get(apiEndpoint, axiosConfig);
}

export function getProject(id) {
  return axios.get(apiEndpoint + "/" + id, axiosConfig);
}

export function saveProject(project) {
  if (project.uuid) {
    const body = { ...project };
    delete body.uuid;
    axios.put(projectUrl(project.uuid), body);
  } else {
    return axios.post(
      apiEndpoint +
        "/create?name=" +
        project.name +
        "&description=" +
        project.description +
        "&facility=" +
        project.facility
    );
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
        "/remove_member?uuid=" +
        projectId +
        "&project_members=" +
        userId
    );
  }

  if (userType === "project_owner") {
    return axios.put(
      apiEndpoint +
        "/remove_owner?uuid=" +
        projectId +
        "&project_owners=" +
        userId
    );
  }
}
