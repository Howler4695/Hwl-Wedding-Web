import React from "react";

import { PartyBuilder } from "@/components";
import { auth } from "@/auth";
import { Member } from "@/components/PartyBuilder/PartyBuilder";
import Link from "next/link";
import { GET_OPTIONS } from "@/helpers";

export default async function PartyBuilderPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const userJ = await fetch(
    `${process.env.BACKEND_URL}/user/${userId}`,
    GET_OPTIONS(session)
  );
  const popJ = await fetch(
    `${process.env.BACKEND_URL}/party/pops/${userId}`,
    GET_OPTIONS(session)
  );
  const userInfo = await userJ.json();
  const partyPops = await popJ.json();

  const editMode = partyPops?.length > 0 ? true : false;

  const registrationInstructions = `Add family members or plus ones below. Phone numbers and allergies are optional. A Phone Number must be provided for your party leader ${userInfo?.FirstName} ${userInfo?.LastName}.`;
  return (
    <div className="relative center-page overflow-hidden flex items-center justify-center p-4 sm:p-6]">
      <Link href="/register" className="hidden" prefetch />
      <section className="relative z-10 w-full max-w-6xl pb-16">
        <div className="card-no-blur border-2 border-white/10 p-4 sm:p-8">
          <header className="mb-4 sm:mb-6">
            <p className="mb-2 text-[12px] uppercase tracking-[0.1em] text-[#6B725E]">
              Wedding Registration
            </p>
            <h1 className="leading-tight text-[#2E4E3F]">
              {editMode ? "Update your party" : "Create your party"}
            </h1>
            <div className="mx-auto my-4 h-0.5 w-24 sm:w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />
            <p className="text-sm sm:text-base text-[#4F5E50]">
              {registrationInstructions}
            </p>
          </header>

          <PartyBuilder
            userId={userId}
            firstName={userInfo?.FirstName}
            lastName={userInfo?.LastName}
            partyPops={partyPops as Member[]}
            backendURL={process?.env?.CLIENT_BACKEND_URL}
            accessToken={session?.accessToken}
          />

          <footer className="mt-4 sm:mt-6 flex text-center items-center justify-center gap-2 text-xs text-[#8C7E68]">
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
            <span>email help@thehowles.love with any questions or issues</span>
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
          </footer>
        </div>
      </section>
    </div>
  );
}
