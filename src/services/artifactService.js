import http from './httpService';
import { default as config } from "../config.json";

const artifactsEndpoint = `${config.artifactManagerApiUrl}`;

export function getArtifacts(page, searchQuery) {
  if (page === undefined) {
    page = 1;
  }
  if (searchQuery === undefined) { 
    searchQuery = "";
  }
  if (searchQuery === "") {
    return http.get(`${artifactsEndpoint}?page=${page}`);
  }
  if (searchQuery && searchQuery.trim() !== "") {
    searchQuery = encodeURIComponent(searchQuery.trim());
  }
  return http.get(`${artifactsEndpoint}?page=${page}&search=${searchQuery}`);
}

export function getArtifactsByUserID(userID) {
    return http.get(artifactsEndpoint + `/by-author/${userID}`);
  }
