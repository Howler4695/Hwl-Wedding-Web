"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CheckboxField,
  MagCorners,
  NumberField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components";

// TEMP THIS WILL BE A SSC
export default function WeddingRSVPFormPage() {
  const dateText = "Saturday, May 16, 2026";
  const searchParams = "yes";
  const router = useRouter();

  const initialAttending = useMemo(() => {
    const p = searchParams;
    if (p === "yes") return true;
    if (p === "no") return false;
    return undefined;
  }, [searchParams]);

  const [attending, setAttending] = useState<boolean | undefined>(
    initialAttending
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [stateProv, setStateProv] = useState("");
  const [zip, setZip] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [guestNames, setGuestNames] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string>("");
  const [songRequest, setSongRequest] = useState("");
  const [notes, setNotes] = useState("");
  const [accessibility, setAccessibility] = useState(false);
  const [lodgingInfo, setLodgingInfo] = useState(false);
  const [relationship, setRelationship] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // keep guest names array in sync with party size (minus primary guest)
  useEffect(() => {
    const needed = Math.max(0, partySize - 1);
    setGuestNames((prev) => {
      const next = [...prev];
      if (next.length < needed) {
        while (next.length < needed) next.push("");
      } else if (next.length > needed) {
        next.length = needed;
      }
      return next;
    });
  }, [partySize]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      attending,
      fullName,
      email,
      phone,
      address: { address1, address2, city, stateProv, zip },
      partySize,
      guestNames,
      dietary,
      songRequest,
      notes,
      accessibility,
      lodgingInfo,
      relationship,
      submittedAt: new Date().toISOString(),
    };

    try {
      // Optional backend: implement /api/rsvp (POST) to save this payload
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      setSubmitted(true);
    } catch (err) {
      // If you haven't built the API yet, we'll still show a soft success so testing feels nice
      console.warn("/api/rsvp not implemented; showing local success.", err);
      setSubmitted(true);
      // If you prefer strict failure until API exists, replace the two lines above with:
      // setError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setAttending(initialAttending);
    setFullName("");
    setEmail("");
    setPhone("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setStateProv("");
    setZip("");
    setPartySize(1);
    setGuestNames([]);
    setDietary("");
    setSongRequest("");
    setNotes("");
    setAccessibility(false);
    setLodgingInfo(false);
    setRelationship("");
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b flex items-center justify-center p-6">
        <MagCorners />
        <section className="relative z-10 w-full max-w-2xl">
          <div className="rounded-3xl border border-[#E8DDC9] bg-white/70 backdrop-blur-xl shadow-xl p-10 text-center">
            <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-[#2E4E3F]">
              Thank you!
            </h1>
            <div className="mx-auto my-6 h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />
            <p className="text-[#4F5E50]">
              We’ve received your details
              {typeof attending === "boolean"
                ? attending
                  ? ", and we can’t wait to celebrate with you!"
                  : ", and we’ll miss you on our big day."
                : "."}
            </p>
            <p className="mt-2 text-sm text-[#7A846F]">{dateText}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/rsvp"
                className="rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 text-white font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
              >
                Back to invite
              </Link>
              <button
                onClick={resetForm}
                className="rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-6 py-3 text-[#6B725E] font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
              >
                Submit another response
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b flex items-center justify-center p-6">
      <MagCorners />
      <section className="relative z-10 w-full max-w-3xl">
        <form
          onSubmit={handleSubmit}
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

          <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <legend className="col-span-1 sm:col-span-3 mb-1 text-sm font-medium text-[#4F5E50]">
              Will you attend?
            </legend>
            <label className="flex items-center gap-2 rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]">
              <input
                type="radio"
                name="attending"
                className="accent-[#2E4E3F]"
                checked={attending === true}
                onChange={() => setAttending(true)}
                required
              />
              Yes, I’ll be there
            </label>
            <label className="flex items-center gap-2 rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]">
              <input
                type="radio"
                name="attending"
                className="accent-[#2E4E3F]"
                checked={attending === false}
                onChange={() => setAttending(false)}
                required
              />
              I can’t make it
            </label>
            <label className="flex items-center gap-2 rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]">
              <input
                type="radio"
                name="attending"
                className="accent-[#2E4E3F]"
                checked={attending === undefined}
                onChange={() => setAttending(undefined)}
              />
              Decide later
            </label>
          </fieldset>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              label="Full name"
              value={fullName}
              onChange={setFullName}
              required
              placeholder="Jane Magnolia"
            />
            <TextField
              type="email"
              label="Email"
              value={email}
              onChange={setEmail}
              required
              placeholder="jane@example.com"
            />
            <TextField
              label="Phone"
              value={phone}
              onChange={setPhone}
              placeholder="(555) 123-4567"
            />
            <SelectField
              label="Relationship to us"
              value={relationship}
              onChange={setRelationship}
              options={[
                "Family",
                "Wedding party",
                "Friend",
                "Colleague",
                "Other",
              ]}
              placeholder="Select one"
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-6">
            <TextField
              className="sm:col-span-6"
              label="Address line 1"
              value={address1}
              onChange={setAddress1}
              placeholder="123 Magnolia Ave"
            />
            <TextField
              className="sm:col-span-6"
              label="Address line 2"
              value={address2}
              onChange={setAddress2}
              placeholder="Apt, suite, etc."
            />
            <TextField
              className="sm:col-span-3"
              label="City"
              value={city}
              onChange={setCity}
            />
            <TextField
              className="sm:col-span-2"
              label="State/Province"
              value={stateProv}
              onChange={setStateProv}
            />
            <TextField
              className="sm:col-span-1"
              label="ZIP"
              value={zip}
              onChange={setZip}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <NumberField
              label="# in your party (including you)"
              value={partySize}
              onChange={(n) => setPartySize(Math.max(1, Math.min(10, n)))}
              min={1}
              max={10}
            />
            <TextField
              className="sm:col-span-2"
              label="Dietary restrictions (for everyone in your party)"
              value={dietary}
              onChange={setDietary}
              placeholder="Vegetarian, nut allergy, no shellfish, etc."
            />
          </div>

          {guestNames.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {guestNames.map((g, i) => (
                <TextField
                  key={i}
                  label={`Guest ${i + 2} full name`}
                  value={g}
                  onChange={(v) =>
                    setGuestNames((arr) =>
                      arr.map((x, idx) => (idx === i ? v : x))
                    )
                  }
                  placeholder="Full legal name"
                />
              ))}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-4">
            <TextAreaField
              label="Song you’d love to hear"
              value={songRequest}
              onChange={setSongRequest}
              placeholder="We’ll pass it to the DJ!"
            />
            <TextAreaField
              label="Notes for the couple / accessibility needs"
              value={notes}
              onChange={setNotes}
              placeholder="Anything else we should know?"
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <CheckboxField
                label="Someone in my party has accessibility needs"
                checked={accessibility}
                onChange={setAccessibility}
              />
              <CheckboxField
                label="Please send lodging/transportation info"
                checked={lodgingInfo}
                onChange={setLodgingInfo}
              />
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 text-white font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit details"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/rsvp")}
              className="inline-flex items-center justify-center rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-6 py-3 text-[#6B725E] font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
            >
              Back to invite
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-[#8C7E68]">
            Southern Magnolia Palette · Ivory · Leaf Green · Soft Gold
          </p>
        </form>
      </section>
    </main>
  );
}
