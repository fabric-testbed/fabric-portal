import http from './httpService';
import { default as config } from "../config.json";

const apiEndpoint = `${config.fabricCoreApiUrl}/people`;

export function getWhoAmI(){
  return http.get(`${config.fabricCoreApiUrl}/whoami`);
}

export function getPeople(query, exact_match) {
  return http.get(`${apiEndpoint}?search=${query}&exact_match=${exact_match}&offset=0&limit=20`);
}

export function getFullPeopleByName(offset, limit, query) {
  return http.get(`${apiEndpoint}?search=${query}&offset=${offset}&limit=${limit}`);
}

export function getPeopleById(uuid) {
  return http.get(`${apiEndpoint}/${uuid}?as_self=false`);
}

export function getCurrentUser() {
  const uuid = localStorage.getItem("userID");
  return http.get(`${apiEndpoint}/${uuid}?as_self=true`);
}

export function updatePeopleProfile(userId, data, preferences) {
  return http.patch(`${apiEndpoint}/${userId}/profile`, {
    "bio": data.bio,
    "job": data.job,
    "pronouns": data.pronouns,
    "website": data.website,
    "email": data.email,
    "preferences": preferences
  })
}

export function updatePeoplePreference(userId, data, preferences) {
  return http.patch(`${apiEndpoint}/${userId}`, {
    "name": data.name,
    "email": data.email,
    "preferences": preferences
  })
}

export function getUserPreferences() {
  return http.get(`${apiEndpoint}/preferences`);
}

export function getUserProfilePreferences() {
  return http.get(`${apiEndpoint}/profile/preferences`);
}