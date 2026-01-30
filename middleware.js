import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Auth cookie from CILogon
  const hasAuthCookie =
    request.cookies.get("fabric-service") ||
    request.cookies.get("fabric-service-alpha") ||
    request.cookies.get("fabric-service-beta");

  const protectedPaths = [
    "/experiments",
    "/slices",
    "/new-slice",
    "/projects",
    "/users",
    "/user",
    "/search-results",
  ];

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected && !hasAuthCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
