// app/rsvp/page.tsx
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

    const firstName = String(formData.get("firstName"));
    const lastName = String(formData.get("lastName"));
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const address1 = String(formData.get("address1") || "");
    const address2 = String(formData.get("address2") || "");
    const city = String(formData.get("city") || "");
    const stateProv = String(formData.get("stateProv") || "");
    const zipStr = String(formData.get("zip") || "");
    const partySize = Number(formData.get("partySize") || 1);
    const guestNamesRaw = String(formData.get("guestNames") || "");
    const notes = String(formData.get("notes") || "");

    const plusones = parseGuestNames(guestNamesRaw);
    const number_plusones = Math.max(0, partySize - 1);

    const zipNum = /^\d+$/.test(zipStr) ? Number(zipStr) : 0;

    const payload = {
      firstName,
      lastName,
      address_line_one: address1,
      address_line_two: address2,
      city,
      state: stateProv,
      zip: zipNum,
      email,
      phone_number: phone,
      number_plusones,
      plusones,
      notes,
    };

    const res = await fetch("http://localhost:8090/user/create", {
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

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                First Name
              </span>
              <input
                name="firstName"
                required
                placeholder="Jane Magnolia"
                className="rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                Last Name
              </span>
              <input
                name="lastName"
                required
                placeholder="Jane Magnolia"
                className="rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                Email
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="jane@example.com"
                className="rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                Phone
              </span>
              <input
                type="phone"
                name="phone"
                placeholder="(555) 123-4567"
                className="rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]"
              />
            </label>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-6">
            <label className="sm:col-span-6 flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                Address line 1
              </span>
              <input
                name="address1"
                placeholder="123 Magnolia Ave"
                className="rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]"
              />
            </label>
            <label className="sm:col-span-6 flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                Address line 2
              </span>
              <input
                name="address2"
                placeholder="Apt, suite, etc."
                className="rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]"
              />
            </label>
            <label className="sm:col-span-3 flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                City
              </span>
              <input
                name="city"
                className="rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]"
              />
            </label>
            <label className="sm:col-span-2 flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                State/Province
              </span>
              <input
                name="stateProv"
                className="rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]"
              />
            </label>
            <label className="sm:col-span-1 flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                ZIP
              </span>
              <input
                name="zip"
                inputMode="numeric"
                pattern="[0-9]*"
                className="rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]"
              />
            </label>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                # in your party (including you)
              </span>
              <input
                type="number"
                name="partySize"
                min={1}
                max={10}
                defaultValue={1}
                className="rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]"
              />
            </label>
            <label className="sm:col-span-2 flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                Dietary restrictions (optional)
              </span>
              <input
                name="dietary"
                placeholder="Vegetarian, nut allergy, etc."
                className="rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]"
              />
            </label>
          </div>

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
