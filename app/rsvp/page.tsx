import Link from "next/link";
import { auth } from "@/auth";
import { GET_OPTIONS } from "@/helpers";

export default async function WeddingInvitePage() {
  const dateText = "Saturday, May 16, 2026";

  const session = await auth();
  const userId = session?.user?.id;

  const partyJ = await fetch(
    `${process.env.BACKEND_URL}/party/${userId}`,
    GET_OPTIONS(session)
  );
  const party = await partyJ.json();

  const editMode = party?.id ? true : false;

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center p-6">
      <section className="relative z-10 w-full max-w-2xl">
        <div className="rounded-3xl border-2 border-white/10  bg-white/70 backdrop-blur-xl shadow-2xl p-10 ">
          {editMode ?? (
            <p className="mb-2 text-[12px] uppercase tracking-[0.35em] text-[#6B725E]">
              Official Invitation
            </p>
          )}
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-[#2E4E3F]">
            {editMode ? "Edit RSVP" : "Congrats you're invited to our wedding!"}
          </h1>

          <div className="mx-auto my-6 h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />

          <p className="text-lg text-[#4F5E50]">{dateText}</p>
          <p className="mt-1 text-sm text-[#7A846F]">
            {"You can edit your rsvp at anytime."}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/party-builder"
              className="inline-flex items-center text-center justify-center rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 text-white font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
              aria-label="RSVP: You'll be there"
            >
              {editMode
                ? party?.attending
                  ? "Edit RSVP"
                  : 'Switch RSVP to "Will be there"'
                : "You'll be there"}
            </Link>

            <Link
              href="/cant-make-it"
              className="inline-flex items-center text-center justify-center rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-6 py-3 text-[#6B725E] font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
              aria-label="RSVP: You can't make it"
            >
              {editMode
                ? party?.attending
                  ? 'Switch RSVP to "Can\'t make it"'
                  : "Edit RSVP"
                : "You can't make it"}
            </Link>
          </div>

          <div className="mt-8 flex items-center text-center justify-center gap-2 text-xs text-[#8C7E68]">
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
            <span>email help@thehowles.love with any issues or questions.</span>
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
          </div>
        </div>
      </section>
    </main>
  );
}
