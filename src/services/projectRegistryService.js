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
  if (project._id) {
    const body = { ...project };
    delete body._id;
    axios.put(projectUrl(project._id), body);
  }

  return axios.post(apiEndpoint + "/create", project);
}

export function deleteProject(projectId) {
  return axios.delete(
    apiEndpoint + "/delete?uuid=d9e21cc6-8134-42f3-81ca-b627f5b1df66"
  );
}
