import axios from "axios";
import { default as configData } from "../config.json";

const apiEndpoint = configData.fabricCoreApiUrl;

export function getCurrentUser() {
  const uuid = localStorage.getItem("userID");
  return axios.get(`${apiEndpoint}/people/${uuid}?as_self=true`);
}

// API TODO
export function refreshRoles() {
  return axios.get(apiEndpoint + "/role_attribute_sync");
}