"use client";
import { useState } from "react";

const WEDDING_DATE = "May 16, 2026"; // ← UPDATE ME
const DETAILS = {
  headline: "You’re Invited!",
  subhead: "We’re thrilled to celebrate with you.",
  location: "(Add your venue & city here)",
};

type RSVPState = "idle" | "yes" | "no";

export default function WeddingInvitePage() {
  const [rsvp, setRsvp] = useState<RSVPState>("idle");

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#FFFDF7]">
      {/* Subtle magnolia floral accents */}
      <MagnoliaCorner className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 opacity-[0.12]" />
      <MagnoliaCorner className="pointer-events-none absolute -right-28 -bottom-28 h-[26rem] w-[26rem] rotate-180 opacity-[0.10]" />

      {/* Soft gradient wash */}
      <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_0%,#FBF7EF,transparent_60%),radial-gradient(60%_60%_at_100%_100%,#F6EFE2,transparent_60%)]" />

      {/* Content */}
      <section className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-24">
        <Card>
          <header className="text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#BFA37A]/60 bg-white/60 px-3 py-1 text-xs uppercase tracking-wider text-[#7D8F7A] shadow-sm backdrop-blur">
              <CalendarIcon className="h-4 w-4" />
              <span>{WEDDING_DATE}</span>
            </p>
            <h1 className="mt-6 font-serif text-4xl leading-tight text-[#2E4A3A] sm:text-5xl">
              {DETAILS.headline}
            </h1>
            <p className="mt-3 text-base text-[#5E6B61] sm:text-lg">
              Congratulations—your presence would mean the world to us.
            </p>
            <p className="mt-1 text-sm text-[#6F7B72]">{DETAILS.subhead}</p>
          </header>

          <div className="mt-8 grid gap-4 rounded-2xl bg-white/60 p-5 text-center shadow-inner backdrop-blur">
            <div className="mx-auto h-1.5 w-24 rounded-full bg-[#BFA37A]/50" />
            <p className="text-sm text-[#6F7B72]">
              <strong className="font-semibold text-[#2E4A3A]">When:</strong>{" "}
              {WEDDING_DATE}
              <br />
              <strong className="font-semibold text-[#2E4A3A]">
                Where:
              </strong>{" "}
              {DETAILS.location}
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {rsvp === "idle" && (
              <>
                <button
                  onClick={() => setRsvp("yes")}
                  className="group inline-flex items-center justify-center rounded-2xl border border-[#9AA890] bg-[#2E4A3A] px-6 py-3 font-medium text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#BFA37A]/40"
                  aria-label="I'll be there"
                >
                  I’ll be there
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                    💌
                  </span>
                </button>

                <button
                  onClick={() => setRsvp("no")}
                  className="inline-flex items-center justify-center rounded-2xl border border-[#BFA37A] bg-white/70 px-6 py-3 font-medium text-[#2E4A3A] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#BFA37A]/30"
                  aria-label="I can't make it"
                >
                  I can’t make it
                </button>
              </>
            )}

            {rsvp === "yes" && (
              <Confirmation
                tone="yes"
                title="Wonderful!"
                body="We’re so excited you’ll be there. We’ll save you a spot."
                onReset={() => setRsvp("idle")}
              />
            )}

            {rsvp === "no" && (
              <Confirmation
                tone="no"
                title="Thanks for letting us know"
                body="We’ll miss you—but we appreciate the RSVP. We’ll share photos after the big day!"
                onReset={() => setRsvp("idle")}
              />
            )}
          </div>

          <footer className="mt-8 text-center text-xs text-[#7D8F7A]">
            <p>
              P.S. Dress code, lodging, and schedule details can go here—or link
              to additional pages.
            </p>
          </footer>
        </Card>
      </section>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-3xl border border-[#BFA37A]/50 bg-white/70 p-8 shadow-xl backdrop-blur-sm sm:p-12">
      {/* Decorative edge */}
      <div className="pointer-events-none absolute left-1/2 top-8 h-10 w-10 -translate-x-1/2 rounded-full border border-[#BFA37A]/40 bg-[#FFFDF7] shadow-[0_8px_20px_rgba(0,0,0,0.06)]" />
      {children}
    </div>
  );
}

function Confirmation({
  tone,
  title,
  body,
  onReset,
}: {
  tone: "yes" | "no";
  title: string;
  body: string;
  onReset: () => void;
}) {
  const isYes = tone === "yes";
  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full rounded-2xl border px-5 py-4 text-left shadow-sm sm:w-auto ${
        isYes
          ? "border-[#9AA890] bg-[#F2F6F1] text-[#2E4A3A]"
          : "border-[#E6D9C6] bg-[#FBF7EF] text-[#5C3D2E]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-xl" aria-hidden>
          {isYes ? "🌿" : "🤍"}
        </span>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm opacity-90">{body}</p>
          <div className="mt-3">
            {/* Example actions you can wire up later */}
            <div className="flex flex-wrap items-center gap-2">
              {isYes ? (
                <>
                  <a
                    href={`mailto:couple@example.com?subject=RSVP%3A%20Attending&body=I%20will%20be%20there%20on%20${encodeURIComponent(
                      WEDDING_DATE
                    )}!`}
                    className="rounded-xl border border-[#2E4A3A]/20 bg-white/80 px-3 py-1.5 text-xs text-[#2E4A3A] shadow-sm hover:bg-white"
                  >
                    Email confirmation
                  </a>
                  <a
                    href="#" // replace with your registry link
                    className="rounded-xl border border-[#BFA37A]/30 bg-white/80 px-3 py-1.5 text-xs text-[#5C3D2E] shadow-sm hover:bg-white"
                  >
                    View registry
                  </a>
                </>
              ) : (
                <a
                  href={`mailto:couple@example.com?subject=RSVP%3A%20Regrets&body=I%20can’t%20make%20it%20for%20${encodeURIComponent(
                    WEDDING_DATE
                  )}.`}
                  className="rounded-xl border border-[#BFA37A]/30 bg-white/80 px-3 py-1.5 text-xs text-[#5C3D2E] shadow-sm hover:bg-white"
                >
                  Send a note
                </a>
              )}

              <button
                onClick={onReset}
                className="ml-auto rounded-xl border border-[#BFA37A]/40 bg-white/70 px-3 py-1.5 text-xs text-[#6F7B72] shadow-sm hover:bg-white"
              >
                Change response
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <path d="M7 2v3M17 2v3M3 9.5h18" />
      <rect x="3" y="4.5" width="18" height="17" rx="2.5" />
      <path d="M7.5 13h3m3 0h3m-9 4h3" />
    </svg>
  );
}

function MagnoliaCorner({ className = "" }: { className?: string }) {
  // Minimal magnolia-inspired line art (abstract petals)
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="#2E4A3A"
      strokeWidth="1.1"
    >
      <g>
        <path d="M100 50c-10 10-18 28-18 42s8 22 18 22 18-8 18-22-8-32-18-42z" />
        <path d="M100 50c8 5 24 14 34 24 10 10 16 20 16 28s-4 12-12 12c-10 0-22-6-30-14" />
        <path d="M100 50c-8 5-24 14-34 24-10 10-16 20-16 28s4 12 12 12c10 0 22-6 30-14" />
        <path d="M100 114c-6 10-22 16-36 16-10 0-16-4-16-10 0-10 16-18 34-22" />
        <path d="M100 114c6 10 22 16 36 16 10 0 16-4 16-10 0-10-16-18-34-22" />
        <circle cx="100" cy="114" r="3" fill="#BFA37A" stroke="none" />
      </g>
    </svg>
  );
}
