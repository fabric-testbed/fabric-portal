import http from './httpService';
import { default as config } from "../assets/config.json";

export function getCookie(){
  return http.get(`${config.fabricCoreApiUrl}/check-cookie`);
}