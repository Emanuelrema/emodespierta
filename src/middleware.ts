import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/admin/auth";

// This runs ONLY on /admin routes (not /api — those validate themselves)
export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow the login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // We can't call crypto in Edge without a polyfill issue,
  // so we do lightweight token format check here (presence + format).
  // Full HMAC verification happens inside Route Handlers via isAuthenticated().
  const parts = token.split(".");
  if (parts.length !== 2) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}
