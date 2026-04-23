import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Proxy a request to an external API, forwarding cookies for authentication.
 * For orchestrator/slice APIs, reads the fabric_tokens cookie and sets Authorization header.
 *
 * @param {Request} request - The incoming Next.js request
 * @param {string} targetUrl - The full target URL to proxy to
 * @param {Object} options - Additional options
 * @param {boolean} options.useToken - If true, read fabric_tokens cookie and set Authorization header
 * @param {Object} options.overrideHeaders - Additional headers to set
 * @returns {Promise<NextResponse>}
 */
export async function proxyRequest(request, targetUrl, options = {}) {
  const { useToken = false, overrideHeaders = {} } = options;

  try {
    const cookieStore = await cookies();

    // Build headers
    const headers = new Headers();

    // Only set Content-Type for requests that have a body
    if (request.method !== "GET" && request.method !== "HEAD") {
      headers.set("Content-Type", request.headers.get("Content-Type") || "application/json");
    }

    if (useToken) {
      // Prefer the Authorization header forwarded directly from the browser request
      // (set explicitly by the client after token creation), then fall back to the
      // HttpOnly fabric_token cookie for other orchestrator calls (e.g. GET slices).
      const incomingAuth = request.headers.get("Authorization");
      if (incomingAuth) {
        headers.set("Authorization", incomingAuth);
      } else {
        const tokenCookie = cookieStore.get("fabric_token");
        if (tokenCookie?.value) {
          headers.set("Authorization", `Bearer ${tokenCookie.value}`);
        }
      }
    } else {
      // Core API uses Vouch cookie auth — forward all cookies
      const allCookies = cookieStore.getAll();
      const cookieStr = allCookies
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
      if (cookieStr) {
        try {
          headers.set("Cookie", cookieStr);
        } catch {
          // Skip forwarding cookies if they contain invalid characters
        }
      }
    }

    // Apply any override headers
    for (const [key, value] of Object.entries(overrideHeaders)) {
      headers.set(key, value);
    }

    // Build fetch options
    const fetchOptions = {
      method: request.method,
      headers,
    };

    // Forward body for non-GET requests
    if (request.method !== "GET" && request.method !== "HEAD") {
      try {
        const body = await request.text();
        if (body) {
          fetchOptions.body = body;
        }
      } catch {
        // No body to forward
      }
    }

    const response = await fetch(targetUrl, fetchOptions);

    const responseBody = await response.text();
    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { errors: [{ details: `Proxy error: ${error.message}` }] },
      { status: 502 }
    );
  }
}

/**
 * Build the target URL from a base URL and the incoming request's path suffix.
 * E.g., if the API route is /api/projects/123/tags and the base is https://core/projects,
 * the result would be https://core/projects/123/tags
 */
export function buildTargetUrl(baseUrl, request, stripPrefix) {
  const url = new URL(request.url);
  const path = url.pathname.replace(stripPrefix, "");
  const search = url.search;
  return `${baseUrl}${path}${search}`;
}
