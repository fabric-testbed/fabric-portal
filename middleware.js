import { NextResponse } from "next/server";

// No server-side auth redirect — login state is determined by the
// whoAmI API call in AuthContext, which returns the real user status
// (active / inactive / unauthenticated). Cookie names vary per
// environment and Vouch version, making cookie-based checks fragile.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files
    "/((?!_next/static|_next/image|favicon.ico|imgs/).*)",
  ],
};
