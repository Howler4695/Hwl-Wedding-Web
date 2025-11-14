import NextAuth, { DefaultSession, JWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    idToken?: string;
    accessToken?: string;
    groups?: string[];
    user: {
      token?: accessToken;
    } & DefaultSession["user"];
  }
}
