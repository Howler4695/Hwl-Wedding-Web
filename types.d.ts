import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    idToken?: string;
    accessToken?: string;
    groups?: string[];
    error?: string;
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}
