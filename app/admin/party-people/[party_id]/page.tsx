import { auth } from "@/auth";
import { checkIsAdminPage } from "@/helpers/Auth";
import { GET_OPTIONS } from "@/helpers";
import type { PartyDTO } from "@/types/api";
import Link from "next/link";

export default async function AdminPartyPeople(props: {
  params: Promise<{ party_id: string }>;
}) {
  const session = await auth();
  checkIsAdminPage(session);
  const partyId = Number((await props.params).party_id);

  const partiesJ = await fetch(
    `${process.env.BACKEND_URL}/admin/allpartyinfo`,
    GET_OPTIONS(session)
  );
  const allParties: PartyDTO[] = await partiesJ.json();
  const party = allParties.find((p) => p.party_id === partyId);

  const attending = party?.attending;

  return (
    <div className="relative min-h-screen overflow-hidden flex items-start justify-center p-4 sm:p-6 pt-8">
      <section className="relative z-10 w-full max-w-5xl card-no-blur p-5 sm:p-6">
        <Link
          href="/admin/party"
          className="mb-1 inline-flex items-center gap-1 text-sm text-[#6B725E] hover:text-[#2E4E3F] transition-colors"
        >
          ← Back to Guest List
        </Link>

        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-[#2E4E3F]">
            {party?.owning_user?.first_name} {party?.owning_user?.last_name}&apos;s Party
          </h2>
          {attending === true && (
            <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
              Attending
            </span>
          )}
          {attending === false && (
            <span className="inline-flex w-fit items-center rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700 ring-1 ring-red-600/20 ring-inset">
              Declined
            </span>
          )}
          {attending === undefined && (
            <span className="inline-flex w-fit items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-amber-600/20 ring-inset">
              No Response
            </span>
          )}
        </div>

        {/* Contact info */}
        <div className="rounded-xl border border-[#E8DDC9] bg-[#FDFAF5] p-4 sm:p-5 mb-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#6B725E]">
            Contact Info
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
            {party?.owning_user?.email && (
              <div>
                <span className="text-[#6B725E]">Email: </span>
                <span className="text-[#2E4E3F]">{party.owning_user.email}</span>
              </div>
            )}
            {party?.owning_user?.phone_number && (
              <div>
                <span className="text-[#6B725E]">Phone: </span>
                <span className="text-[#2E4E3F]">{party.owning_user.phone_number}</span>
              </div>
            )}
            {party?.owning_user?.address && (
              <div className="sm:col-span-2">
                <span className="text-[#6B725E]">Address: </span>
                <span className="text-[#2E4E3F]">{party.owning_user.address}</span>
              </div>
            )}
          </div>
          {party?.notes && (
            <div className="mt-3 rounded-lg border border-[#E8DDC9] bg-white/60 p-3 text-sm">
              <span className="text-[#6B725E]">Notes: </span>
              <span className="text-[#2E4E3F]">{party.notes}</span>
            </div>
          )}
        </div>

        {/* Party members */}
        <div className="rounded-xl border border-[#E8DDC9] overflow-hidden">
          <div className="border-b border-[#E8DDC9] bg-[#FDFAF5] px-5 py-3">
            <p className="text-xs font-medium uppercase tracking-widest text-[#6B725E]">
              Party Members ({party?.party_people?.length ?? 0})
            </p>
          </div>

          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-12 gap-3 border-b border-[#E8DDC9] px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-[#6B725E]">
            <div className="col-span-3">Name</div>
            <div className="col-span-1">Age</div>
            <div className="col-span-2">Phone</div>
            <div className="col-span-6">Allergies / Accessibility</div>
          </div>

          {party?.party_people?.map((person, i) => (
            <div
              key={person.id}
              className={`px-5 py-4 ${
                i < (party.party_people?.length ?? 0) - 1
                  ? "border-b border-[#E8DDC9]"
                  : ""
              }`}
            >
              {/* Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-3 items-center">
                <div className="col-span-3 font-medium text-[#2E4E3F]">
                  {person.first_name} {person.last_name}
                </div>
                <div className="col-span-1 text-sm text-[#6B725E]">
                  {person.age}
                </div>
                <div className="col-span-2 text-sm text-[#6B725E]">
                  {person.phone_number || "\u2014"}
                </div>
                <div className="col-span-6 text-sm text-[#6B725E]">
                  {person.allergies || "\u2014"}
                </div>
              </div>

              {/* Mobile */}
              <div className="md:hidden space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#2E4E3F]">
                    {person.first_name} {person.last_name}
                  </span>
                  <span className="text-sm text-[#6B725E]">Age {person.age}</span>
                </div>
                {person.phone_number && (
                  <div className="text-sm text-[#6B725E]">{person.phone_number}</div>
                )}
                {person.allergies && (
                  <div className="mt-1 rounded-lg border border-[#E8DDC9] bg-[#FDFAF5] p-2 text-sm text-[#6B725E]">
                    {person.allergies}
                  </div>
                )}
              </div>
            </div>
          ))}

          {(!party?.party_people || party.party_people.length === 0) && (
            <div className="px-5 py-8 text-center text-[#6B725E]">
              No members in this party.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
