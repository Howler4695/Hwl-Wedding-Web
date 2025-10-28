"use client";

import React, { useMemo, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Single-file page component for a wedding "Party Builder".
// - Adds/removes members (first name, last name, age, allergies)
// - "Add Member to Party" appends a new row
// - Trash icon deletes that row
// - Submit shows a preview JSON payload (replace with your API call)
// Tailwind CSS for styling. Icons by lucide-react. Animations by framer-motion.

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  age: string; // keep as string for controlled input; cast to number on submit
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Filter out fully empty rows
    const nonEmpty = members.filter((m) => !isRowEffectivelyEmpty(m));
    if (nonEmpty.length === 0) {
      setError("Please add at least one party member before submitting.");
      return;
    }

    // Validate: require first & last name for any non-empty row
    const invalid = nonEmpty.find(
      (m) => !m.firstName.trim() || !m.lastName.trim()
    );
    if (invalid) {
      setError("Each member must have a first and last name.");
      return;
    }

    // Build payload
    const payload = nonEmpty.map((m) => ({
      firstName: m.firstName.trim(),
      lastName: m.lastName.trim(),
      age: m.age ? Number(m.age) : null,
      allergies: m.allergies.trim() || null,
    }));

    try {
      setSubmitting(true);
      // TODO: Replace with your API call
      // Example:
      // const res = await fetch("/api/party", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      // if (!res.ok) throw new Error("Failed to submit");

      // For demo purposes, just show the payload
      alert(
        "Submitted party (" +
          payload.length +
          "):\n\n" +
          JSON.stringify(payload, null, 2)
      );
      // Optionally clear or keep
      // setMembers([makeBlankMember()]);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Build Your Party
        </h1>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
          Total in party: <strong>{total}</strong>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-12 gap-3 border-b border-gray-100 px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
            <div className="col-span-3">First name</div>
            <div className="col-span-3">Last name</div>
            <div className="col-span-2">Age</div>
            <div className="col-span-3">Allergies</div>
            <div className="col-span-1 text-right">Remove</div>
          </div>

          <AnimatePresence initial={false}>
            {members.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-12 items-center gap-3 px-4 py-3 border-b last:border-b-0 border-gray-100"
              >
                <div className="col-span-12 sm:col-span-3">
                  <label className="sr-only" htmlFor={`first-${m.id}`}>
                    First name
                  </label>
                  <input
                    id={`first-${m.id}`}
                    type="text"
                    value={m.firstName}
                    onChange={(e) =>
                      updateMember(m.id, { firstName: e.target.value })
                    }
                    placeholder="e.g., Jamie"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div className="col-span-12 sm:col-span-3">
                  <label className="sr-only" htmlFor={`last-${m.id}`}>
                    Last name
                  </label>
                  <input
                    id={`last-${m.id}`}
                    type="text"
                    value={m.lastName}
                    onChange={(e) =>
                      updateMember(m.id, { lastName: e.target.value })
                    }
                    placeholder="e.g., Rivera"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label className="sr-only" htmlFor={`age-${m.id}`}>
                    Age
                  </label>
                  <input
                    id={`age-${m.id}`}
                    type="number"
                    min={0}
                    max={120}
                    step={1}
                    inputMode="numeric"
                    value={m.age}
                    onChange={(e) =>
                      updateMember(m.id, {
                        age: e.target.value.replace(/[^0-9]/g, ""),
                      })
                    }
                    placeholder="e.g., 28"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label className="sr-only" htmlFor={`allergy-${m.id}`}>
                    Allergies
                  </label>
                  <input
                    id={`allergy-${m.id}`}
                    type="text"
                    value={m.allergies}
                    onChange={(e) =>
                      updateMember(m.id, { allergies: e.target.value })
                    }
                    placeholder="e.g., peanuts, shellfish"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div className="col-span-12 sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeMember(m.id)}
                    className="inline-flex items-center rounded-xl border border-transparent px-3 py-2 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
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

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={addMember}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <Plus className="h-4 w-4" />
            Add Member to Party
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </form>

      <p className="mt-6 text-xs text-gray-500">
        Tip: You can leave the allergies field blank if none.
      </p>
    </main>
  );
}
