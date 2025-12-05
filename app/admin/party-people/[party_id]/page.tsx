import { auth } from "@/auth";
import { checkIsAdminPage } from "@/helpers/Auth";
import { GET_OPTIONS } from "@/helpers";

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
  const allParties = await partiesJ.json();
  const party = allParties.find((party: { party_id: number }) => {
    if (party.party_id === partyId) {
      return party;
    }
  });

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-6">
      <section className="relative z-10 w-full max-w-6xl pb-16 ">
        {party.owning_user.first_name} {party.owning_user.last_name} Party
        <div className="rounded-3xl border-2 border-white/10 bg-white/90 shadow-2xl p-4 sm:p-8">
          <div className="rounded-2xl border border-[#E7D9BF] bg-white/60 ">
            <div className="hidden md:grid grid-cols-12 gap-3 border-b-0 border-[#E8DDC9] px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#6B725E]">
              <div className="col-span-2">Name</div>
              <div className="col-span-1">Age</div>
              <div className="col-span-2">Phone Number</div>
              <div className="col-span-7">Allergies/Accessibility</div>
            </div>
          </div>
          {party?.party_people?.map(
            (partyPeople: {
              id: string;
              first_name: string;
              last_name: string;
              phone_number: string;
              allergies: string;
              age: string;
            }) => {
              return (
                <div
                  key={`${partyPeople.id}`}
                  className="grid grid-cols-2 md:grid-cols-12 items-center gap-3 px-4 py-3 border-b-8 md:border-b-2 last:border-b-0 border-[#E8DDC9]"
                >
                  <div className="col-span-1 text-black">
                    {partyPeople?.first_name}
                  </div>
                  <div className="col-span-1 text-black">
                    {partyPeople?.last_name}
                  </div>
                  <div className="col-span-1 text-black">
                    {partyPeople?.age}
                  </div>
                  <div className="col-span-2 text-black">
                    {partyPeople?.phone_number}
                  </div>
                  <div className="col-span-7 text-black">
                    {partyPeople?.allergies}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>
    </div>
  );
}
