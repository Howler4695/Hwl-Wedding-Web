import { MagCorners } from "@/components";
import { redirect } from "next/navigation";

function splitName(full: string) {
  const trimmed = (full || "").trim();
  if (!trimmed) return { firstname: "", lastname: "" };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstname: parts[0], lastname: "" };
  return {
    firstname: parts.slice(0, -1).join(" "),
    lastname: parts.slice(-1).join(" "),
  };
}

function parseGuestNames(raw: string) {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((n) => splitName(n));
}

export default async function WeddingRSVPFormPage() {
  const dateText = "Saturday, May 16, 2026";

  async function createRSVP(formData: FormData) {
    "use server";

    const partySize = Number(formData.get("partySize") || 1);
    const guestNamesRaw = String(formData.get("guestNames") || "");
    const notes = String(formData.get("notes") || "");

    const plusones = parseGuestNames(guestNamesRaw);
    const number_plusones = Math.max(0, partySize - 1);

    const payload = {
      number_plusones,
      plusones,
      notes,
      attending: true,
    };

    const res = await fetch(`${process.env.BACKEND_URL}/user/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Submission failed (${res.status})`);
    }

    redirect("/");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b flex items-center justify-center p-6">
      <MagCorners />
      <section className="relative z-10 w-full max-w-3xl">
        <form
          action={createRSVP}
          className="rounded-3xl border border-[#E8DDC9] bg-white/70 backdrop-blur-xl shadow-xl p-8 sm:p-10"
        >
          <p className="mb-2 text-[12px] uppercase tracking-[0.35em] text-[#6B725E]">
            Wedding Registration
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl leading-tight text-[#2E4E3F]">
            Tell us your details
          </h1>
          <p className="mt-2 text-sm text-[#7A846F]">{dateText}</p>
          <div className="mx-auto my-6 h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />
          \
          <div className="mt-4 grid grid-cols-1 gap-4">
            <label className="flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                Guest names (one per line)
              </span>
              <textarea
                name="guestNames"
                placeholder={`Hayden Howle\nHannah Kounter`}
                rows={3}
                className="rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]"
              />
              <span className="mt-1 text-xs text-[#7A846F]">
                We’ll send exactly <em>party size – 1</em> as plus-ones.
              </span>
            </label>

            <label className="flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                Notes for the couple / accessibility needs (optional)
              </span>
              <textarea
                name="notes"
                placeholder="Anything else we should know?"
                rows={3}
                className="rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]"
              />
            </label>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 text-white font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
            >
              Submit details
            </button>
            <a
              href="/rsvp"
              className="inline-flex items-center justify-center rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-6 py-3 text-[#6B725E] font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
            >
              Back to invite
            </a>
          </div>
          <p className="mt-6 text-center text-xs text-[#8C7E68]">
            Made by Hayden Howle
          </p>
        </form>
      </section>
    </main>
  );
}
