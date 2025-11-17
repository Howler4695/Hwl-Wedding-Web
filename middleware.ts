import { auth } from "@/auth";
import { NextResponse } from "next/server";

const ADMIN_PROTECTED = ["/"];

// This is bad
export default auth((req) => {
  if (
    !req.auth &&
    req.nextUrl.pathname !== "/auth/signin" &&
    req.nextUrl.pathname !== "/"
  ) {
    const newUrl = new URL("/auth/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  const session = req.auth;

  if ((session as any)?.error === "RefreshTokenError") {
    const reauthUrl = new URL("/auth/reauth", req.nextUrl.origin);
    reauthUrl.searchParams.set("from", req.nextUrl.href);
    return NextResponse.redirect(reauthUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth/|auth/signin|auth/signout|auth/reauth|_next/static|_next/image|favicon.ico|__nextjs_font|images/|magnolia_no_stem.svg).*)",
  ],
};
