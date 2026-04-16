import { auth } from "@/auth";
import { GET_OPTIONS, fetchWithRetry } from "@/helpers";
import type { Party } from "@/types/api";
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
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

  const partyJ = await fetchWithRetry(
    `${process.env.BACKEND_URL}/party/${userId}`,
    GET_OPTIONS(session)
  );
  const party: Party = await partyJ.json();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b flex items-center justify-center p-6">
      <section className="relative z-10 w-full max-w-3xl">
        <form action={createRSVP} className="card-no-blur p-8 sm:p-10">
          <p className="mb-2 text-[12px] uppercase tracking-[0.1em] text-[#7A6B5C]">
            Wedding Registration
          </p>
          <h1 className="text-3xl sm:text-4xl leading-tight text-[#A24E69]">
            We&apos;re sad to hear you can&apos;t make it
          </h1>
          <p className="mt-2 text-[#A24E69]">
            Submit your absense so we know you&apos;re not coming.
          </p>
          <div className="mx-auto my-6 h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />

          <div className="mt-4 grid grid-cols-1 gap-4">
            <label className="flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#5A4A42]">
                Why you can&apos;t make it / Note for the couple (optional)
              </span>
              <textarea
                name="notes"
                placeholder="You can let us know why you can't make it?"
                rows={3}
                defaultValue={party?.notes}
                className="rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#A24E69]"
              />
            </label>
          </div>

          <div className="mt-8  px-6 sm:px-0 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
            <button
              type="submit"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-[#843E55] bg-[#A24E69] px-6 py-3 text-[#FFF8EC] font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
            >
              Submit absence
            </button>
            <a
              href="/rsvp"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-6 py-3 text-[#7A6B5C] font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
            >
              Back to invite
            </a>
          </div>

          <footer className="mt-4 sm:mt-6 flex text-center items-center justify-center gap-2 text-xs text-[#8C7E68]">
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
            <span>email help@thehowles.love with any questions or issues</span>
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
          </footer>
        </form>
      </section>
    </div>
  );
}
