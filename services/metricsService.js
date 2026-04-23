import http from './httpService';

export function getCoreApiMetrics() {
  return http.get("/api/metrics/core-api-metrics/overview");
}

export function getOrchestratorMetrics() {
  return http.get("/api/metrics/metrics/overview");
}
