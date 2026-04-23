import { proxyRequest, buildTargetUrl } from "@/lib/api/proxy";
import { CORE_API_URL } from "@/lib/api/config";

async function handler(request) {
  const targetUrl = buildTargetUrl(`${CORE_API_URL}/announcements`, request, "/api/announcements");
  return proxyRequest(request, targetUrl);
}

export const GET = handler;
