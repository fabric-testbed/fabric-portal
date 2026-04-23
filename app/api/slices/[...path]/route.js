import { proxyRequest, buildTargetUrl } from "@/lib/api/proxy";
import { ORCHESTRATOR_API_URL } from "@/lib/api/config";

async function handler(request) {
  const targetUrl = buildTargetUrl(`${ORCHESTRATOR_API_URL}/slices`, request, "/api/slices");
  return proxyRequest(request, targetUrl, { useToken: true });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
