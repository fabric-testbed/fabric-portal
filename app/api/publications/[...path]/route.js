import { proxyRequest, buildTargetUrl } from "@/lib/api/proxy";
import { PUBLICATIONS_TRACKER_API_URL as PUBLICATIONS_API_URL } from "@/lib/api/config";

async function handler(request) {
  const targetUrl = buildTargetUrl(PUBLICATIONS_API_URL, request, "/api/publications");
  return proxyRequest(request, targetUrl);
}

export const GET = handler;
