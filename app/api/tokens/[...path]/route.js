import { NextResponse } from "next/server";
import { proxyRequest, buildTargetUrl } from "@/lib/api/proxy";
import { CREDENTIAL_MANAGER_API_URL } from "@/lib/api/config";

async function handler(request) {
  const targetUrl = buildTargetUrl(CREDENTIAL_MANAGER_API_URL, request, "/api/tokens");
  const response = await proxyRequest(request, targetUrl);

  // After a successful token create/refresh, store the token in a server-side cookie
  // so the slices/orchestrator proxy can read it for the Authorization header.
  const url = new URL(request.url);
  const isCreateOrRefresh =
    request.method === "POST" &&
    (url.pathname.includes("/create") || url.pathname.includes("/refresh"));

  if (isCreateOrRefresh && response.status === 200) {
    try {
      const responseBody = await response.text();
      const body = JSON.parse(responseBody);
      const token = body?.data?.[0];

      // Build the response first, then set cookies on it directly.
      // Using response.cookies.set() is required for Route Handlers — calling
      // cookies().set() from next/headers does NOT propagate Set-Cookie to a
      // manually constructed NextResponse and the cookie would never reach the browser.
      const nextResponse = new NextResponse(responseBody, {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });

      if (token?.id_token) {
        // Store the raw JWT string — base64url chars are cookie-safe.
        // Wrapping in JSON would embed double-quotes which RFC 6265 forbids in
        // cookie values, causing browsers to silently misparse the Set-Cookie
        // header and the proxy's subsequent JSON.parse to fail silently.
        nextResponse.cookies.set("fabric_token", token.id_token, {
          path: "/",
          sameSite: "lax",
          httpOnly: true,
        });
      }

      return nextResponse;
    } catch {
      // If parsing fails, return the original response as-is
    }
  }

  return response;
}

export const GET = handler;
export const POST = handler;
