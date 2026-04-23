import { proxyRequest } from "@/lib/api/proxy";
import { RESOURCE_LINK_API_URL } from "@/lib/api/config";

export async function GET(request) {
  return proxyRequest(request, RESOURCE_LINK_API_URL);
}
