import http from './httpService';

const apiEndpoint = "/api/resources?graph_format=JSON_NODELINK";

export function getResources(level, start, end) {
  if (start && end) {
    return http.get(`${apiEndpoint}&level=${level}&start_date=${start}&end_date=${end}`)
  } else if (start) {
    return http.get(`${apiEndpoint}&level=${level}&start_date=${start}`)
  } else if (end) {
    return http.get(`${apiEndpoint}&level=${level}&end_date=${end}`)
  }

  return http.get(`${apiEndpoint}&level=${level}`);
}
