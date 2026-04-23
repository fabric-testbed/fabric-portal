import { proxyRequest, buildTargetUrl } from "@/lib/api/proxy";
import { ORCHESTRATOR_API_URL, CORE_API_URL } from "@/lib/api/config";

async function handler(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/metrics", "");

  // Route to correct backend based on path
  if (path.startsWith("/core-api-metrics")) {
    const targetUrl = `${CORE_API_URL}${path}${url.search}`;
    return proxyRequest(request, targetUrl);
  }

  const targetUrl = `${ORCHESTRATOR_API_URL}${path}${url.search}`;
  return proxyRequest(request, targetUrl);
}

export const GET = handler;
