import http from './httpService';

const apiEndpoint = "/api/resources";

export function getResources(level, start, end, type) {
  const typeParam = type ? `&type=${type}` : "";
  if (start && end) {
    return http.get(`${apiEndpoint}?level=${level}&start_date=${start}&end_date=${end}${typeParam}`)
  } else if (start) {
    return http.get(`${apiEndpoint}?level=${level}&start_date=${start}${typeParam}`)
  } else if (end) {
    return http.get(`${apiEndpoint}?level=${level}&end_date=${end}${typeParam}`)
  }

  return http.get(`${apiEndpoint}?level=${level}${typeParam}`);
}
