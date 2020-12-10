import axios from "axios";
import { prPeopleApiUrl } from "../config.json";

const apiEndpoint = prPeopleApiUrl;
const config = { withCredentials: true };

export function getCurrentUser() {
  const uuid = localStorage.getItem("userID");
  return axios.get(apiEndpoint + "/" + uuid, config);
}