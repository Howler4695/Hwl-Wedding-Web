import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (process.env?.MAINTENCE_MODE === "true") {
    const newUrl = new URL("maintence", req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }
  if (
    !req.auth &&
    req.nextUrl.pathname !== "/auth/signin" &&
    req.nextUrl.pathname !== "/"
  ) {
    const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
    signInUrl.searchParams.set("from", req.nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  const session = req.auth;

  if (session?.error === "RefreshTokenError") {
    const reauthUrl = new URL("/auth/reauth", req.nextUrl.origin);
    reauthUrl.searchParams.set("from", req.nextUrl.href);
    return NextResponse.redirect(reauthUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth/|auth/signin|auth/signout|maintence|auth/reauth|_next/static|_next/image|favicon.ico|__nextjs_font|img/|images/|magnolia_no_stem.svg|front_pic_0.jpg|front_pic_1.jpg|front_pic_2.jpg|front_pic_3.jpg).*)",
  ],
};
