import http from './httpService';
import _ from "lodash";
import { default as config } from "../config.json";

const apiEndpoint = config.projectRegistryApiUrl;

export function getProjects() {
  return http.get(apiEndpoint);
}

export function getProject(id) {
  return http.get(apiEndpoint + "/" + id);
}

export function addUser(type, projectId, userId) {
  let url = "";
  // applies to an existing project
  if (type === "project_owner") {
    const query = new URLSearchParams({
      uuid: projectId,
      project_owners: userId,
    }).toString();
    url = apiEndpoint + "/add_owners?" + query;
  } else if (type === "project_member") {
    const query = new URLSearchParams({
      uuid: projectId,
      project_members: userId,
    }).toString();
    url = apiEndpoint + "/add_members?" + query;
  }
  http.put(url);
}

export function deleteUser(userType, projectId, userId) {
  let url = "";
  // userType: project_member, project_owner
  if (userType === "project_member") {
    const query = new URLSearchParams({
      uuid: projectId,
      project_members: userId,
    }).toString();
    url = apiEndpoint + "/remove_members?" + query;
  }

  if (userType === "project_owner") {
    const query = new URLSearchParams({
      uuid: projectId,
      project_owners: userId,
    }).toString();
    url = apiEndpoint + "/remove_owners?" + query;
  }

  return http.put(url);
}

export function getTags() {
  return http.get(apiEndpoint + "/tags");
}

export function updateTags(originalTags, project) {
  const newTags = project.tags;
  // compare original tags with new tags to decide
  // whether calling add_tags or remove_tags endpoint.
  const tagsToAdd = _.difference(newTags, originalTags);
  const tagsToRemove = _.difference(originalTags, newTags);

  if (tagsToAdd.length > 0) {
    const query = new URLSearchParams({
      uuid: project.uuid,
      tags: tagsToAdd.join(),
    }).toString();
    const url = apiEndpoint + "/add_tags?" + query;
    http.put(url);
  }

  if (tagsToRemove.length > 0) {
    const query = new URLSearchParams({
      uuid: project.uuid,
      tags: tagsToRemove.join(),
    }).toString();
    const url = apiEndpoint + "/remove_tags?" + query;
    http.put(url);
  }
}

export function saveProject(project) {
  if (project.uuid) {
    const query = new URLSearchParams({
      uuid: project.uuid,
      name: project.name,
      description: project.description,
      facility: project.facility,
    }).toString();
    const url = apiEndpoint + "/update?" + query;
    http.put(url);
  } else {
    // combine array of project owners into string, separated by comma
    // required fields: name, description, facility
    let query = {
      name: project.name,
      description: project.description,
      facility: project.facility,
      tags: project.tags.join(),
      project_owners: project.project_owners.join(","),
      project_members: project.project_members.join(","),
    };

    // remove empty useless params from query
    for (let param in query) {
      if (
        query[param] === undefined ||
        query[param] === null ||
        query[param] === ""
      )
        delete query[param];
    }
    // transform clean query object to query string
    query = new URLSearchParams(query).toString();
    const url = apiEndpoint + "/create?" + query;
    return http.post(url);
  }
}

export function deleteProject(projectId) {
  return http.delete(apiEndpoint + "/delete?uuid=" + projectId);
}
