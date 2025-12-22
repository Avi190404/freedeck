import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Check if the session cookie exists
  const session = request.cookies.get("session");
  const { pathname } = request.nextUrl;

  // 2. Define Public Routes (Pages anyone can see)
  const isPublicRoute = pathname === "/login" || pathname === "/register";

  // 3. LOGIC:
  
  // A. If user is logged in but tries to go to Login/Register -> Redirect to Dashboard
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // B. If user is NOT logged in and tries to go to a Protected Route -> Redirect to Login
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // C. Otherwise, let them pass
  return NextResponse.next();
}

// 4. Config: Apply this to all routes EXCEPT static files (images, fonts, etc.)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};