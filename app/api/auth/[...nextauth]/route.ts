import { handlers } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const originalGet = handlers.GET;

async function GET(req: NextRequest) {
  try {
    return await originalGet(req);
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message.includes("pkceCodeVerifier") ||
        err.name === "InvalidCheck")
    ) {
      // PKCE cookie was lost or corrupted — restart the sign-in flow
      const url = new URL("/auth/signin", req.nextUrl.origin);
      return NextResponse.redirect(url);
    }
    throw err;
  }
}

export { GET };
export const { POST } = handlers;
