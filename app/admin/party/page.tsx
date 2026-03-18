import { auth } from "@/auth";
import { checkIsAdminPage } from "@/helpers/Auth";
import { GET_OPTIONS } from "@/helpers";
import type { PartyDTO } from "@/types/api";
import Link from "next/link";

export default async function AdminParties() {
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
    if (party.attending === true) {
      partiesAttending++;
      popsAttending += party.party_people?.length ?? 0;
    } else if (party.attending === false) {
      partiesNotAttending++;
    }
  }

  function attendingBadge(attending?: boolean) {
    if (attending === true)
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
          Attending
        </span>
      );
    if (attending === false)
      return (
        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-red-600/20 ring-inset">
          Declined
        </span>
      );
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20 ring-inset">
        No Response
      </span>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-start justify-center p-4 sm:p-6 pt-8">
      <section className="relative z-10 w-full max-w-6xl card-no-blur overflow-hidden">
        {/* Header area */}
        <div className="p-5 sm:p-6 pb-0">
          <Link
            href="/admin"
            className="mb-1 inline-flex items-center gap-1 text-sm text-[#6B725E] hover:text-[#2E4E3F] transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h2 className="text-[#2E4E3F] mb-4">Guest List</h2>

          <div className="flex flex-wrap gap-6 text-sm mb-5">
            <div>
              <span className="text-[#6B725E]">Guests Attending: </span>
              <span className="font-semibold text-emerald-600">{popsAttending}</span>
            </div>
            <div>
              <span className="text-[#6B725E]">Parties Attending: </span>
              <span className="font-semibold text-emerald-600">{partiesAttending}</span>
            </div>
            <div>
              <span className="text-[#6B725E]">Parties Declined: </span>
              <span className="font-semibold text-red-500">{partiesNotAttending}</span>
            </div>
            <div>
              <span className="text-[#6B725E]">Total Parties: </span>
              <span className="font-semibold text-[#2E4E3F]">{allParties.length}</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border-t border-[#E8DDC9]">
          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-12 gap-3 border-b border-[#E8DDC9] bg-[#FDFAF5] px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#6B725E]">
            <div className="col-span-2">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Phone</div>
            <div className="col-span-3">Address</div>
            <div className="col-span-1">Party</div>
            <div className="col-span-1">Status</div>
          </div>

          {allParties.map((party, i) => (
            <Link
              key={party.party_id}
              href={`/admin/party-people/${party.party_id}`}
              className={`block px-5 py-4 transition-colors hover:bg-[#FFF8EC]/60 ${
                i < allParties.length - 1 ? "border-b border-[#E8DDC9]" : ""
              }`}
            >
              {/* Desktop layout */}
              <div className="hidden md:grid grid-cols-12 gap-3 items-center">
                <div className="col-span-2 font-medium text-[#2E4E3F]">
                  {party.owning_user?.first_name} {party.owning_user?.last_name}
                </div>
                <div className="col-span-3 text-sm text-[#6B725E] truncate">
                  {party.owning_user?.email}
                </div>
                <div className="col-span-2 text-sm text-[#6B725E]">
                  {party.owning_user?.phone_number || "\u2014"}
                </div>
                <div className="col-span-3 text-sm text-[#6B725E] truncate">
                  {party.owning_user?.address || "\u2014"}
                </div>
                <div className="col-span-1 text-sm text-[#6B725E]">
                  {party.party_people?.length ?? 0}
                </div>
                <div className="col-span-1">
                  {attendingBadge(party.attending)}
                </div>
              </div>

              {/* Mobile layout */}
              <div className="md:hidden space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#2E4E3F]">
                    {party.owning_user?.first_name} {party.owning_user?.last_name}
                  </span>
                  {attendingBadge(party.attending)}
                </div>
                {party.owning_user?.email && (
                  <div className="text-sm text-[#6B725E]">{party.owning_user.email}</div>
                )}
                <div className="flex gap-4 text-sm text-[#6B725E]">
                  {party.owning_user?.phone_number && (
                    <span>{party.owning_user.phone_number}</span>
                  )}
                  <span>Party of {party.party_people?.length ?? 0}</span>
                </div>
                {party.notes && (
                  <div className="text-xs text-[#6B725E]/70 italic">
                    Note: {party.notes}
                  </div>
                )}
              </div>
            </Link>
          ))}

          {allParties.length === 0 && (
            <div className="px-5 py-12 text-center text-[#6B725E]">
              No parties have been created yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
