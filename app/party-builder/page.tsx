import React from "react";

import { MagCorners, PartyBuilder } from "@/components";
import { auth } from "@/auth";
import { Member } from "@/components/PartyBuilder/PartyBuilder";
import Link from "next/link";

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
  const popJ = await fetch(`${process.env.BACKEND_URL}/party/pops/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const userInfo = await userJ.json();
  const contactInfo = await contactsJ.json();
  const partyPops = await popJ.json();

  const editMode = partyPops?.length > 0 ? true : false;
  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center p-4 sm:p-6]">
      <Link href="/register" className="hidden" />
      <MagCorners />
      <section className="relative z-10 w-full max-w-6xl pb-16">
        <div className="rounded-3xl border-2 border-white/10 bg-white/90 shadow-2xl p-4 sm:p-8">
          <header className="mb-4 sm:mb-6">
            <p className="mb-2 text-[12px] uppercase tracking-[0.35em] text-[#6B725E]">
              Wedding Registration
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl leading-tight text-[#2E4E3F]">
              {editMode ? "Update your party" : "Create your party"}
            </h1>
            <div className="mx-auto my-4 h-0.5 w-24 sm:w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />
            <p className="text-sm sm:text-base text-[#4F5E50]">
              Add family members or plus ones below. Phone numbers and allergies
              are optional
            </p>
          </header>

          <PartyBuilder
            userId={userId}
            firstName={userInfo.FirstName}
            lastName={userInfo.LastName}
            phoneNumber={contactInfo.PhoneNumber}
            partyPops={partyPops as Member[]}
            backendURL={process?.env?.CLIENT_BACKEND_URL}
          />

          <footer className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-xs text-[#8C7E68]">
            <span className="inline-block text-center h-px w-8 bg-[#E8DDC9]" />
            <span>email help@thehowles.love with any questions or issues</span>
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
          </footer>
        </div>
      </section>
    </main>
  );
}
