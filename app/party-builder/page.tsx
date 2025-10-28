"use client";

import React, { useMemo, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MagCorners } from "@/components";

// Wedding Party Builder – Mobile-first + Themed
// Theme cues from your invite page:
//  - Forest: #2E4E3F
//  - Sage:   #6B725E (borders/labels), #9FB39E (tints)
//  - Gold:   #CAA55A (focus/accent)
//  - Cream:  #FFF8EC (secondary button)
//  - Soft text: #4F5E50 / #7A846F
// Layout:
//  - Card on a glassy panel with backdrop blur and magnolia corners
//  - Mobile-first stack with large tap targets (44px+)
//  - Sticky action bar on mobile (Add Member / Submit)
//  - Desktop actions sit at the bottom of the card

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  age: string; // keep string for controlled input; cast to number on submit
  allergies: string;
};

const makeBlankMember = (): Member => ({
  id:
    (globalThis as any).crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random()}`,
  firstName: "",
  lastName: "",
  age: "",
  allergies: "",
});

export default function PartyBuilderPage() {
  const [members, setMembers] = useState<Member[]>([makeBlankMember()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const total = useMemo(() => members.length, [members]);

  function updateMember(id: string, patch: Partial<Member>) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  }
  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }
  function addMember() {
    setMembers((prev) => [...prev, makeBlankMember()]);
  }
  function isRowEffectivelyEmpty(m: Member) {
    return !m.firstName && !m.lastName && !m.age && !m.allergies;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const nonEmpty = members.filter((m) => !isRowEffectivelyEmpty(m));
    if (nonEmpty.length === 0) {
      setError("Please add at least one party member before submitting.");
      return;
    }

    const invalid = nonEmpty.find(
      (m) => !m.firstName.trim() || !m.lastName.trim()
    );
    if (invalid) {
      setError("Each member must have a first and last name.");
      return;
    }

    const payload = nonEmpty.map((m) => ({
      firstName: m.firstName.trim(),
      lastName: m.lastName.trim(),
      age: m.age ? Number(m.age) : null,
      allergies: m.allergies.trim() || null,
    }));

    try {
      setSubmitting(true);
      // TODO: Replace with your API call
      // await fetch("/api/party", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      alert(
        "Submitted party (" +
          payload.length +
          "):" +
          JSON.stringify(payload, null, 2)
      );
      // Optionally clear after submit
      // setMembers([makeBlankMember()]);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center p-4 sm:p-6 bg-[url('/magnolia-noise.png')]">
      <MagCorners />

      <section className="relative z-10 w-full max-w-3xl">
        <div className="rounded-3xl border-2 border-white/10 bg-white/70 backdrop-blur-xl shadow-2xl p-4 sm:p-8">
          <header className="mb-4 sm:mb-6">
            <p className="mb-1 text-[11px] uppercase tracking-[0.35em] text-[#6B725E]">
              Party Builder
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl leading-tight text-[#2E4E3F]">
              Add your party
            </h1>
            <div className="mx-auto my-4 h-0.5 w-24 sm:w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />
            <p className="text-sm sm:text-base text-[#4F5E50]">
              Add family members or plus ones below. You can remove anyone with
              the trash icon.
            </p>
          </header>

          <form id="party-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-2xl border border-[#E7D9BF] bg-white/60">
              {/* Headings (hidden on mobile for compactness) */}
              <div className="hidden sm:grid grid-cols-12 gap-3 border-b border-[#E8DDC9] px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#6B725E]">
                <div className="col-span-3">First name</div>
                <div className="col-span-3">Last name</div>
                <div className="col-span-2">Age</div>
                <div className="col-span-3">Allergies</div>
                <div className="col-span-1 text-right">Remove</div>
              </div>

              <AnimatePresence initial={false}>
                {members.map((m, idx) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3 px-4 py-3 border-b last:border-b-0 border-[#E8DDC9]"
                  >
                    {/* First name */}
                    <div className="sm:col-span-3">
                      <label
                        className="mb-1 block text-xs font-medium text-[#6B725E]"
                        htmlFor={`first-${m.id}`}
                      >
                        First name
                      </label>
                      <input
                        id={`first-${m.id}`}
                        type="text"
                        inputMode="text"
                        autoComplete={idx === 0 ? "given-name" : "off"}
                        value={m.firstName}
                        onChange={(e) =>
                          updateMember(m.id, { firstName: e.target.value })
                        }
                        placeholder="e.g., Jamie"
                        className="w-full rounded-xl border border-[#9FB39E] bg-white/80 px-3 py-3 text-sm text-[#2E4E3F] placeholder-[#7A846F] focus:border-[#CAA55A] focus:outline-none focus:ring-2 focus:ring-[#CAA55A]/40"
                      />
                    </div>

                    {/* Last name */}
                    <div className="sm:col-span-3">
                      <label
                        className="mb-1 block text-xs font-medium text-[#6B725E]"
                        htmlFor={`last-${m.id}`}
                      >
                        Last name
                      </label>
                      <input
                        id={`last-${m.id}`}
                        type="text"
                        autoComplete={idx === 0 ? "family-name" : "off"}
                        value={m.lastName}
                        onChange={(e) =>
                          updateMember(m.id, { lastName: e.target.value })
                        }
                        placeholder="e.g., Rivera"
                        className="w-full rounded-xl border border-[#9FB39E] bg-white/80 px-3 py-3 text-sm text-[#2E4E3F] placeholder-[#7A846F] focus:border-[#CAA55A] focus:outline-none focus:ring-2 focus:ring-[#CAA55A]/40"
                      />
                    </div>

                    {/* Age */}
                    <div className="sm:col-span-2">
                      <label
                        className="mb-1 block text-xs font-medium text-[#6B725E]"
                        htmlFor={`age-${m.id}`}
                      >
                        Age
                      </label>
                      <input
                        id={`age-${m.id}`}
                        type="number"
                        min={0}
                        max={120}
                        step={1}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={m.age}
                        onChange={(e) =>
                          updateMember(m.id, {
                            age: e.target.value.replace(/[^0-9]/g, ""),
                          })
                        }
                        placeholder="e.g., 28"
                        className="w-full rounded-xl border border-[#9FB39E] bg-white/80 px-3 py-3 text-sm text-[#2E4E3F] placeholder-[#7A846F] focus:border-[#CAA55A] focus:outline-none focus:ring-2 focus:ring-[#CAA55A]/40"
                      />
                    </div>

                    {/* Allergies */}
                    <div className="sm:col-span-3">
                      <label
                        className="mb-1 block text-xs font-medium text-[#6B725E]"
                        htmlFor={`allergy-${m.id}`}
                      >
                        Allergies
                      </label>
                      <input
                        id={`allergy-${m.id}`}
                        type="text"
                        inputMode="text"
                        value={m.allergies}
                        onChange={(e) =>
                          updateMember(m.id, { allergies: e.target.value })
                        }
                        placeholder="e.g., peanuts, shellfish (optional)"
                        className="w-full rounded-xl border border-[#9FB39E] bg-white/80 px-3 py-3 text-sm text-[#2E4E3F] placeholder-[#7A846F] focus:border-[#CAA55A] focus:outline-none focus:ring-2 focus:ring-[#CAA55A]/40"
                      />
                    </div>

                    {/* Remove */}
                    <div className="flex sm:col-span-1 sm:justify-end">
                      <button
                        type="button"
                        onClick={() => removeMember(m.id)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-transparent text-[#8C7E68] hover:bg-[#FFF8EC] focus:outline-none focus:ring-2 focus:ring-[#CAA55A]/40"
                        aria-label="Remove member"
                        title="Remove member"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Desktop actions (bottom of card) */}
            <div className="hidden sm:flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={addMember}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-5 py-3 text-sm font-medium text-[#6B725E] shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow focus:outline-none focus:ring-2 focus:ring-[#CAA55A] focus:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
                Add Member to Party
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-2xl bg-[#2E4E3F] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#CAA55A] focus:ring-offset-2 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </form>

          {/* Mobile sticky action bar (bottom of the page) */}
          <div className="sm:hidden fixed inset-x-0 bottom-0 z-20 border-t border-white/40 bg-white/80 backdrop-blur-xl p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
              <button
                type="button"
                onClick={addMember}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-4 py-3 text-sm font-medium text-[#6B725E] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CAA55A]"
              >
                <Plus className="h-4 w-4" /> Add Member
              </button>
              <button
                type="submit"
                form="party-form"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center rounded-2xl bg-[#2E4E3F] px-4 py-3 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CAA55A] disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>

          <footer className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-xs text-[#8C7E68]">
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
            <span>We can’t wait to celebrate among the magnolias.</span>
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
          </footer>
        </div>
      </section>
    </main>
  );
}
