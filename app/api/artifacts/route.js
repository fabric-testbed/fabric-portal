import { proxyRequest, buildTargetUrl } from "@/lib/api/proxy";
import { ARTIFACT_MANAGER_API_URL } from "@/lib/api/config";

async function handler(request) {
  const targetUrl = buildTargetUrl(ARTIFACT_MANAGER_API_URL, request, "/api/artifacts");
  return proxyRequest(request, targetUrl);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
