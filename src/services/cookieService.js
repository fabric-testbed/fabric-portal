import http from './httpService';
import { default as config } from "../config.json";

export function getCookie(){
  return http.get(`${config.fabricCoreApiUrl}/check-cookie`);
}