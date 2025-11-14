import { Session } from "next-auth";
import { redirect } from "next/navigation";

export const checkIsAdminPage = (session: Session | null) => {
  if (!session?.groups?.includes("Admin")) {
    redirect("/");
  }
};

export const checkIsAdmin = (session: Session | null) => {
  if (!session?.groups?.includes("Admin")) {
    return false;
  }
  return true;
};
