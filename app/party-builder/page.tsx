import React from "react";

import { MagCorners, PartyBuilder } from "@/components";
import { auth } from "@/auth";

export default async function PartyBuilderPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const userJ = await fetch(`${process.env.BACKEND_URL}/user/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const contactsJ = await fetch(
    `${process.env.BACKEND_URL}/user/contact/${userId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const userInfo = await userJ.json();
  const contactInfo = await contactsJ.json();
  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center p-4 sm:p-6]">
      <MagCorners />

      <PartyBuilder
        userId={userId}
        firstName={userInfo.FirstName}
        lastName={userInfo.LastName}
        phoneNumber={contactInfo.PhoneNumber}
      />
    </main>
  );
}
