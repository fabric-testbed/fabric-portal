import http from './httpService';
import { default as config } from "../config.json";

const qaToolEndpoint = `${config.qaToolApiUrl}`;

export function getAnswer(question) {
  const data = {
    query: question
  };

  return http.post(
    qaToolEndpoint,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        'fabric-api-key': config.qaToolApiKey 
      }
    }
  );
}
