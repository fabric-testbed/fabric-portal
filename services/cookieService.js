import http from './httpService';

export function getCookie(){
  return http.get("/api/check-cookie");
}
