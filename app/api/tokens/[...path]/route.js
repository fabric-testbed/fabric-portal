import { proxyRequest, buildTargetUrl } from "@/lib/api/proxy";
import { CREDENTIAL_MANAGER_API_URL } from "@/lib/api/config";

async function handler(request) {
  const targetUrl = buildTargetUrl(CREDENTIAL_MANAGER_API_URL, request, "/api/tokens");
  return proxyRequest(request, targetUrl);
}

export const GET = handler;
export const POST = handler;
