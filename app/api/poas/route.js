import { proxyRequest, buildTargetUrl } from "@/lib/api/proxy";
import { ORCHESTRATOR_API_URL } from "@/lib/api/config";

async function handler(request) {
  const targetUrl = buildTargetUrl(`${ORCHESTRATOR_API_URL}/poas`, request, "/api/poas");
  return proxyRequest(request, targetUrl, { useToken: true });
}

export const GET = handler;
export const POST = handler;
