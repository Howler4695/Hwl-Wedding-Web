import Link from "next/link";
import { MagCorners } from "@/components";

export default function WeddingInvitePage() {
  const dateText = "Saturday, May 16, 2026"; // API

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center p-6">
      <MagCorners />

      <section className="relative z-10 w-full max-w-2xl">
        <div className="rounded-3xl border-2 border-white/10  bg-white/70 backdrop-blur-xl shadow-2xl p-10 ">
          <p className="mb-2 text-[12px] uppercase tracking-[0.35em] text-[#6B725E]">
            Official Invitation
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-[#2E4E3F]">
            Congrats you&apos;re invited to our wedding!
          </h1>

          <div className="mx-auto my-6 h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />

          <p className="text-lg text-[#4F5E50]">{dateText}</p>
          <p className="mt-1 text-sm text-[#7A846F]">
            We&apos;d be honored to celebrate with you among the magnolias.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 text-white font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
              aria-label="RSVP: You'll be there"
            >
              You&apos;ll be there
            </Link>

            <Link
              href="/cant-make-it"
              className="inline-flex items-center justify-center rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-6 py-3 text-[#6B725E] font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
              aria-label="RSVP: You can't make it"
            >
              You can&apos;t make it
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#8C7E68]">
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
            <span>
              Hannah Kounter · Hayden Howle · I don&apos;t know what to put ·
              here
            </span>
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
          </div>
        </div>
      </section>
    </main>
  );
}
