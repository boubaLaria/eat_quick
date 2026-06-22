import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/payment", "/account"];
const authRoutes = ["/sign-in", "/sign-up"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtected = protectedRoutes.some((r) => path.startsWith(r));
  const isAuthRoute = authRoutes.includes(path);

  const sessionCookie = getSessionCookie(req);

  if (isProtected && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/account", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
