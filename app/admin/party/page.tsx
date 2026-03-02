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
  let popsAttending = 0;

  for (const party of allParties) {
    if (party.attending) {
      partiesAttending++;
      popsAttending += party.party_people?.length ?? 0;
    } else {
      partiesNotAttending++;
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-6">
      <section className="relative z-10 w-full max-w-6xl pb-16">
        <div className="rounded-3xl border-2 border-white/10 bg-white/90 shadow-2xl p-4 sm:p-8">
          <div className="mb-4 md:grid grid-cols-9 gap-3 border-[#E8DDC9] px-4 py-3 text-xl font-medium uppercase tracking-wider text-[#6B725E]">
            <div className="col-span-3">{`People Attending: ${popsAttending}`}</div>
            <div className="col-span-3 text-green-500">{`Parties Attending: ${partiesAttending}`}</div>
            <div className="col-span-3 text-red-500">{`Parties Absent: ${partiesNotAttending}`}</div>
          </div>
          <div className="rounded-2xl border border-[#E7D9BF] bg-white/60">
            <div className="hidden md:grid grid-cols-12 gap-3 border-b-0 border-[#E8DDC9] px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#6B725E]">
              <div className="col-span-2">Name</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Phone Number</div>
              <div className="col-span-4">Address</div>
            </div>
          </div>
          {allParties.map((party) => (
            <Link
              key={party.party_id}
              href={`/admin/party-people/${party.party_id}`}
              className="grid grid-cols-2 md:grid-rows-2 md:grid-cols-12  items-center gap-3 px-4 py-3 border-b-8 md:border-b-2 last:border-b-0 border-[#E8DDC9]"
            >
              <div className="col-span-1 text-black">
                {party.owning_user?.first_name}
              </div>
              <div className="col-span-1 text-black">
                {party.owning_user?.last_name}
              </div>
              <div className="col-span-2 md:col-span-3 text-black">
                {party.owning_user?.email}
              </div>
              <div className="col-span-2 text-black">
                {party.owning_user?.phone_number}
              </div>
              <div className="col-span-2 md:col-span-5 text-black">
                {party.owning_user?.address}
              </div>
              <div className="col-span-2 text-black">
                attending: {party.attending?.toString()}
              </div>
              <div className="col-span-2 md:col-span-10 text-black">
                notes: {party.notes}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
