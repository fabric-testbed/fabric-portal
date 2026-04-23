import { proxyRequest } from "@/lib/api/proxy";
import { CORE_API_URL } from "@/lib/api/config";

export async function GET(request) {
  return proxyRequest(request, `${CORE_API_URL}/check-cookie`);
}
