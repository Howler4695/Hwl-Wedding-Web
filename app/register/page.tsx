"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Save as app/rsvp/page.tsx (Next.js App Router)
export default function WeddingRSVPFormPage() {
  const dateText = "Saturday, May 16, 2026"; // ← update to your wedding date
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialAttending = useMemo(() => {
    const p = searchParams?.get("attending");
    if (p === "yes") return true;
    if (p === "no") return false;
    return undefined; // force a choice
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
    } catch (err: any) {
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
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFF9F0] via-[#FFF5EA] to-[#F7EFE3] flex items-center justify-center p-6">
        <MagnoliaCorner className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 opacity-60" />
        <MagnoliaCorner className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rotate-180 opacity-70" />
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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFF9F0] via-[#FFF5EA] to-[#F7EFE3] flex items-center justify-center p-6">
      <MagnoliaCorner className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 opacity-60" />
      <MagnoliaCorner className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rotate-180 opacity-70" />

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

          {/* Attendance */}
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

          {/* Contact */}
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

          {/* Address */}
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

          {/* Party size */}
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

          {/* Fun extras */}
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

/* ——— Styled Field Components ——— */
function TextField({
  label,
  value,
  onChange,
  className = "",
  required = false,
  placeholder = "",
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-[#4F5E50]">
        {label}
        {required && <span className="text-[#CAA55A]"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F] shadow-sm outline-none placeholder:text-[#A39A86] focus:border-[#CAA55A] focus:ring-2 focus:ring-[#CAA55A]"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  className = "",
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-[#4F5E50]">
        {label}
      </span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F] shadow-sm outline-none focus:border-[#CAA55A] focus:ring-2 focus:ring-[#CAA55A]"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder = "",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-[#4F5E50]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F] shadow-sm outline-none placeholder:text-[#A39A86] focus:border-[#CAA55A] focus:ring-2 focus:ring-[#CAA55A]"
      />
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]">
      <input
        type="checkbox"
        className="accent-[#2E4E3F]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-[#4F5E50]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F] shadow-sm outline-none focus:border-[#CAA55A] focus:ring-2 focus:ring-[#CAA55A]"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ——— Magnolia Corner Decoration ——— */
function MagnoliaCorner({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <radialGradient id="petal" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#FFFAF2" />
          <stop offset="60%" stopColor="#F7EFE2" />
          <stop offset="100%" stopColor="#EDE2CD" />
        </radialGradient>
        <linearGradient id="leaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3E5F4D" />
          <stop offset="100%" stopColor="#2E4E3F" />
        </linearGradient>
      </defs>

      <ellipse
        cx="42"
        cy="152"
        rx="16"
        ry="36"
        fill="url(#leaf)"
        transform="rotate(-20 42 152)"
        opacity="0.85"
      />
      <ellipse
        cx="162"
        cy="38"
        rx="16"
        ry="36"
        fill="url(#leaf)"
        transform="rotate(-15 162 38)"
        opacity="0.85"
      />

      <g transform="translate(100,100)">
        <ellipse rx="22" ry="54" fill="url(#petal)" transform="rotate(0)" />
        <ellipse rx="22" ry="54" fill="url(#petal)" transform="rotate(60)" />
        <ellipse rx="22" ry="54" fill="url(#petal)" transform="rotate(120)" />
        <ellipse rx="22" ry="54" fill="url(#petal)" transform="rotate(180)" />
        <ellipse rx="22" ry="54" fill="url(#petal)" transform="rotate(240)" />
        <ellipse rx="22" ry="54" fill="url(#petal)" transform="rotate(300)" />
        <circle r="12" fill="#CAA55A" stroke="#B28B3F" strokeWidth="1.25" />
      </g>

      <g opacity="0.28">
        <circle cx="18" cy="182" r="2" fill="#CAA55A" />
        <circle cx="30" cy="166" r="1.5" fill="#CAA55A" />
        <circle cx="174" cy="18" r="2" fill="#CAA55A" />
        <circle cx="160" cy="34" r="1.5" fill="#CAA55A" />
      </g>
    </svg>
  );
}
