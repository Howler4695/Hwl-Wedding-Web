import { Session } from "next-auth";

export const GET_OPTIONS = (session: Session | null) => ({
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.accessToken}`,
  },
});
