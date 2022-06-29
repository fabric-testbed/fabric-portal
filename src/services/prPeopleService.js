import axios from "axios";
import { default as configData } from "../config.json";

const apiEndpoint = configData.fabricCoreApiUrl;
const config = { withCredentials: true };

export function getCurrentUser() {
  const uuid = localStorage.getItem("userID");
  return axios.get(apiEndpoint + "/" + uuid, config);
}

// API TODO
export function refreshRoles() {
  return axios.get(apiEndpoint + "/role_attribute_sync", config);
}