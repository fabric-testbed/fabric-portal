let configJson = {};
try {
  configJson = require("@/config.json");
} catch {
  // config.json is optional; env vars are the primary source
}

// Server-side API config: prefers env vars, falls back to config.json
export const CORE_API_URL = process.env.FABRIC_CORE_API_URL || configJson.fabricCoreApiUrl;
export const ORCHESTRATOR_API_URL = process.env.ORCHESTRATOR_API_URL || configJson.orchestratorApiUrl;
export const CREDENTIAL_MANAGER_API_URL = process.env.CREDENTIAL_MANAGER_API_URL || configJson.credentialManagerApiUrl;
export const CREDENTIAL_MANAGER_APP_URL = process.env.CREDENTIAL_MANAGER_APP_URL || configJson.credentialManagerAppUrl;
export const ARTIFACT_MANAGER_API_URL = process.env.ARTIFACT_MANAGER_API_URL || configJson.artifactManagerApiUrl;
export const ARTIFACT_MANAGER_APP_URL = process.env.ARTIFACT_MANAGER_APP_URL || configJson.artifactManagerAppUrl;
export const PUBLICATIONS_TRACKER_API_URL = process.env.PUBLICATIONS_TRACKER_API_URL || configJson.publicationsTrackerApiUrl;
export const RESOURCE_LINK_API_URL = process.env.RESOURCE_LINK_API_URL || configJson.resourceLinkApiUrl;
