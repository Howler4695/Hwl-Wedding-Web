import { auth } from "@/auth";
import { checkIsAdminPage } from "@/helpers/Auth";
import { GET_OPTIONS } from "@/helpers";
import type { PartyDTO } from "@/types/api";
import Link from "next/link";

export default async function Admin() {
  const session = await auth();
  checkIsAdminPage(session);

  const partiesJ = await fetch(
    `${process.env.BACKEND_URL}/admin/allpartyinfo`,
    GET_OPTIONS(session)
  );
  const allParties: PartyDTO[] = await partiesJ.json();

  let partiesAttending = 0;
  let partiesNotAttending = 0;
  let partiesNoResponse = 0;
  let popsAttending = 0;
  let totalPeople = 0;
  let peopleWithAllergies = 0;

  for (const party of allParties) {
    const popCount = party.party_people?.length ?? 0;
    totalPeople += popCount;
    if (party.attending === true) {
      partiesAttending++;
      popsAttending += popCount;
    } else if (party.attending === false) {
      partiesNotAttending++;
    } else {
      partiesNoResponse++;
    }
    for (const person of party.party_people ?? []) {
      if (person.allergies) peopleWithAllergies++;
    }
  }

  const stats = [
    { label: "Total Guests", value: popsAttending, color: "text-[#2E4E3F]" },
    { label: "Parties Attending", value: partiesAttending, color: "text-emerald-600" },
    { label: "Parties Declined", value: partiesNotAttending, color: "text-red-500" },
    { label: "No Response", value: partiesNoResponse, color: "text-amber-500" },
    { label: "Total People", value: totalPeople, color: "text-[#6B725E]" },
    { label: "With Allergies", value: peopleWithAllergies, color: "text-orange-500" },
  ];

  const navItems = [
    {
      href: "/admin/party",
      label: "Guest List",
      description: "View all parties, contact info, and RSVP status",
    },
    {
      href: "/admin/allergies",
      label: "Allergies",
      description: "View dietary restrictions and accessibility needs",
    },
    {
      href: "/admin/comms",
      label: "Comms Portal",
      description: "Send communications to guests",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4 sm:p-6">
      <section className="relative z-10 w-full max-w-4xl">
        <div className="mb-6 text-center">
          <h2 className="text-[#2E4E3F]">Admin Dashboard</h2>
          <div className="mx-auto mt-2 h-0.5 w-20 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />
        </div>

        <div className="card-no-blur p-4 sm:p-6 mb-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#6B725E]">
            RSVP Overview
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-[#E8DDC9] bg-white/60 px-4 py-3 text-center"
              >
                <div className={`text-2xl font-heading font-bold ${s.color}`}>
                  {s.value}
                </div>
                <div className="mt-0.5 text-xs text-[#6B725E]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card-no-blur flex flex-col gap-1 p-5 transition-transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="font-heading text-lg font-semibold text-[#2E4E3F]">
                {item.label}
              </span>
              <span className="text-sm text-[#6B725E]">
                {item.description}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
