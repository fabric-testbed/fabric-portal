import axios from "axios";
import { projectRegistryApiUrl } from "../config.json";

const apiEndpoint = projectRegistryApiUrl;

export function getProjects() {
  return axios.get(apiEndpoint);
}

export function getProject(id) {
  return axios.get(apiEndpoint + "/" + id);
}

export function addUser(type, project_id, user_id) {
  let params = "";
  let url = "";
  // applies to an existing project
  if (type === "project_owner") {
    params = new URLSearchParams({
      uuid: project_id,
      project_owners: user_id,
    }).toString();
    url = apiEndpoint + "/add_owners?" + params;
  } else if (type === "project_member") {
    params = new URLSearchParams({
      uuid: project_id,
      project_members: user_id,
    }).toString();
    url = apiEndpoint + "/add_members?" + params;
  }
  axios.put(url);
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
    // combine array of project owners into string, separated by comma
    if (
      project.project_owners.length > 1 &&
      project.project_members.length > 1
    ) {
      const params = new URLSearchParams({
        name: project.name,
        description: project.description,
        facility: project.facility,
        project_owners: project.project_owners.join(","),
        project_members: project.project_members.join(","),
      }).toString();
      const url = apiEndpoint + "/create?" + params;
      return axios.post(url);
    }

    if (project.project_owners.length > 1) {
      const params = new URLSearchParams({
        name: project.name,
        description: project.description,
        facility: project.facility,
        project_owners: project.project_owners.join(","),
      }).toString();
      const url = apiEndpoint + "/create?" + params;
      return axios.post(url);
    }
    if (project.project_members.length > 1) {
      const params = new URLSearchParams({
        name: project.name,
        description: project.description,
        facility: project.facility,
        project_members: project.project_members.join(","),
      }).toString();
      const url = apiEndpoint + "/create?" + params;
      return axios.post(url);
    }
    const params = new URLSearchParams({
      name: project.name,
      description: project.description,
      facility: project.facility,
    }).toString();
    const url = apiEndpoint + "/create?" + params;
    return axios.post(url);
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
