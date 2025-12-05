import Link from "next/link";
import { redirect } from "next/navigation";

export default async function WeddingInvitePage() {
  if (process.env?.MAINTENCE_MODE !== "true") {
    redirect("/");
  }
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-6">
      <section className="relative z-10 w-full max-w-2xl">
        <div className="rounded-3xl border-2 border-white/10  bg-white/70 backdrop-blur-xl shadow-2xl p-10 ">
          <p className="mb-2 text-[12px] uppercase tracking-[0.35em] text-[#6B725E]">
            Maintenance
          </p>

          <h1 className="text-2xl sm:text-5xl leading-tight text-[#2E4E3F]">
            {"TheHowles.love is currently undergoing maintenance"}
          </h1>

          <div className="mx-auto my-6 h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />

          <p className="text-xl text-[#4F5E50]">Please check in later</p>

          <div className="mt-8 grid grid-cols-1 gap-4 ">
            <Link
              href="/party-builder"
              className="inline-flex items-center text-center justify-center rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 text-white font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
              aria-label="RSVP: You'll be there"
            >
              {"Check if Maintenance is Over"}
            </Link>
          </div>

          <div className="mt-8 flex items-center text-center justify-center gap-2 text-xs text-[#8C7E68]">
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
            <span>email help@thehowles.love with any issues or questions.</span>
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
          </div>
        </div>
      </section>
    </div>
  );
}
