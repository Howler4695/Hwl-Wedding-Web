import { auth } from "@/auth";
import { checkIsAdminPage } from "@/helpers/Auth";
import { GET_OPTIONS } from "@/helpers";
import type { PartyDTO, PartyPeople } from "@/types/api";
import Link from "next/link";
import { hasRealAllergy } from "@/helpers/allergies";

interface AllergyEntry {
  person: PartyPeople;
  partyOwner: string;
  partyId: number;
}

export default async function AdminAllergies() {
  const session = await auth();
  checkIsAdminPage(session);

  const partiesJ = await fetch(
    `${process.env.BACKEND_URL}/admin/allpartyinfo`,
    GET_OPTIONS(session)
  );
  const allParties: PartyDTO[] = await partiesJ.json();

  const entries: AllergyEntry[] = [];
  for (const party of allParties) {
    const ownerName = [party.owning_user?.first_name, party.owning_user?.last_name]
      .filter(Boolean)
      .join(" ");
    for (const person of party.party_people ?? []) {
      if (hasRealAllergy(person.allergies)) {
        entries.push({
          person,
          partyOwner: ownerName,
          partyId: party.party_id,
        });
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-start justify-center p-4 sm:p-6 pt-8">
      <section className="relative z-10 w-full max-w-4xl card-no-blur overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-0">
          <Link
            href="/admin"
            className="mb-1 inline-flex items-center gap-1 text-sm text-[#6B725E] hover:text-[#2E4E3F] transition-colors"
          >
            ← Back to Dashboard
          </Link>

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[#2E4E3F]">Allergies &amp; Accessibility</h2>
            <span className="rounded-full border border-[#E8DDC9] bg-[#FDFAF5] px-3 py-1 text-sm text-[#6B725E]">
              {entries.length} {entries.length === 1 ? "person" : "people"}
            </span>
          </div>
        </div>

        {entries.length > 0 ? (
          <div className="border-t border-[#E8DDC9]">
            {/* Desktop header */}
            <div className="hidden md:grid grid-cols-12 gap-3 border-b border-[#E8DDC9] bg-[#FDFAF5] px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#6B725E]">
              <div className="col-span-3">Guest</div>
              <div className="col-span-3">Party</div>
              <div className="col-span-6">Allergies / Accessibility</div>
            </div>

            {entries.map((entry, i) => (
              <div
                key={entry.person.id}
                className={`px-5 py-4 ${
                  i < entries.length - 1 ? "border-b border-[#E8DDC9]" : ""
                }`}
              >
                {/* Desktop */}
                <div className="hidden md:grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-3 font-medium text-[#2E4E3F]">
                    {entry.person.first_name} {entry.person.last_name}
                  </div>
                  <div className="col-span-3">
                    <Link
                      href={`/admin/party-people/${entry.partyId}`}
                      className="text-sm text-[#6B725E] hover:text-[#2E4E3F] underline decoration-[#E8DDC9] underline-offset-2 transition-colors"
                    >
                      {entry.partyOwner}&apos;s Party
                    </Link>
                  </div>
                  <div className="col-span-6">
                    <span className="inline-block rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm text-orange-800">
                      {entry.person.allergies}
                    </span>
                  </div>
                </div>

                {/* Mobile */}
                <div className="md:hidden space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#2E4E3F]">
                      {entry.person.first_name} {entry.person.last_name}
                    </span>
                    <Link
                      href={`/admin/party-people/${entry.partyId}`}
                      className="text-xs text-[#6B725E] hover:text-[#2E4E3F] underline decoration-[#E8DDC9] underline-offset-2"
                    >
                      {entry.partyOwner}&apos;s Party
                    </Link>
                  </div>
                  <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-800">
                    {entry.person.allergies}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-t border-[#E8DDC9] px-5 py-12 text-center text-[#6B725E]">
            No guests have reported allergies or accessibility needs.
          </div>
        )}
      </section>
    </div>
  );
}
