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
