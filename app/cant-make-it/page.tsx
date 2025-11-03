import { auth } from "@/auth";
import { MagCorners } from "@/components";
import { redirect } from "next/navigation";

export default async function WeddingRSVPFormPage() {
  const session = await auth();
  const userId = session?.user?.id;

  async function createRSVP(formData: FormData) {
    "use server";

    const notes = String(formData.get("notes") || "");

    const payload = {
      notes,
      attending: false,
    };

    const res = await fetch(
      `${process.env.BACKEND_URL}/party/update/${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      throw new Error(
        `Submission failed (${res.status})\n Contact help@thehowles.love for support`
      );
    }

    redirect("/?attending=false");
  }

  const partyJ = await fetch(`${process.env.BACKEND_URL}/party/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const party = await partyJ.json();

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
            We&apos;re sad to hear you can&apos;t make it
          </h1>
          <p className="mt-2 text-lg text-[#2E4E3F]">
            Leave us your details so we know your not coming
          </p>
          <div className="mx-auto my-6 h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />

          <div className="mt-4 grid grid-cols-1 gap-4">
            <label className="flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                Why you can&apos;t make it / Note for the couple (optional)
              </span>
              <textarea
                name="notes"
                placeholder="You can let us know why you can't make it?"
                rows={5}
                defaultValue={party?.notes}
                className="rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 text-white font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
            >
              Submit absence
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
