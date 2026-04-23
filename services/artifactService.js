import http from './httpService';

const apiEndpoint = "/api/artifacts";

export function getArtifacts(page, searchQuery) {
  if (page === undefined) {
    page = 1;
  }
  if (searchQuery === undefined) {
    searchQuery = "";
  }
  if (searchQuery === "") {
    return http.get(`${apiEndpoint}?page=${page}`);
  }
  if (searchQuery && searchQuery.trim() !== "") {
    searchQuery = encodeURIComponent(searchQuery.trim());
  }
  return http.get(`${apiEndpoint}?page=${page}&search=${searchQuery}`);
}

export function getArtifactsByUserID(userID, page) {
  if (page === undefined) {
    page = 1;
  }
  return http.get(`${apiEndpoint}/by-author/${userID}?page=${page}`);
}

export function getArtifactsByProject(projectID, page) {
  if (page === undefined) {
    page = 1;
  }
  return http.get(`${apiEndpoint}/by-project/${projectID}?page=${page}`);
}
