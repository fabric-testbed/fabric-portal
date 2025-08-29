import http from './httpService';
import { default as config } from "../assets/config.json";

const orchestratorMetricsEndpoint = `${config.orchestratorApiUrl}/metrics/overview`;

const coreMetricsEndpoint = `${config.fabricCoreApiUrl}/core-api-metrics/overview`;

export function getCoreApiMetrics() {
  return http.get(coreMetricsEndpoint);
}

export function getOrchestratorMetrics() {
  return http.get(orchestratorMetricsEndpoint);
}