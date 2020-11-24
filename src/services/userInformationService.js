import axios from "axios";
import { userInformationApiUrl } from "../config.json";

const apiEndpoint = userInformationApiUrl;

export function getPeopleByName(name) {
  return axios.get(apiEndpoint + "?person_name=" + name);
}
