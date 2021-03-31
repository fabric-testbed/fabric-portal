import axios from "axios";
import { prPeopleApiUrl } from "../config.json";

const apiEndpoint = prPeopleApiUrl;
const config = { withCredentials: true };

export function getCurrentUser() {
  const uuid = localStorage.getItem("userID");
  return axios.get(apiEndpoint + "/" + uuid, config);
}

export function refreshRoles() {
  return axios.get(apiEndpoint + "/role_attribute_sync", config);
}