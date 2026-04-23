import { proxyRequest, buildTargetUrl } from "@/lib/api/proxy";
import { ORCHESTRATOR_API_URL } from "@/lib/api/config";

async function handler(request) {
  const targetUrl = buildTargetUrl(`${ORCHESTRATOR_API_URL}/portalresources`, request, "/api/resources");
  return proxyRequest(request, targetUrl);
}

export const GET = handler;
