import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = `${config.fabricCoreApiUrl}/people`;

export function getWhoAmI(){
  return http.get(`${config.fabricCoreApiUrl}/whoami`);
}

export function getPeopleByName(name) {
  return http.get(`${apiEndpoint}?search=${name}&offset=0&limit=20`);
}

export function getCurrentUser() {
  const uuid = localStorage.getItem("userID");
  return http.get(`${apiEndpoint}/${uuid}?as_self=true`);
}

export function updatePeopleProfile(userId, data) {
  return http.patch(`${apiEndpoint}/${userId}/profile`, {
    "bio": data.bio,
    "job": data.job,
    "pronouns": data.pronouns,
    "website": data.website
  })
}