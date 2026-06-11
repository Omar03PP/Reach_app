import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (nextUrl.pathname.startsWith("/dashboard/client")) {
    if (token?.role !== "CLIENT") {
      return NextResponse.redirect(new URL("/dashboard/freelancer", nextUrl));
    }
  }

  if (nextUrl.pathname.startsWith("/dashboard/freelancer")) {
    if (token?.role !== "FREELANCER") {
      return NextResponse.redirect(new URL("/dashboard/client", nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
