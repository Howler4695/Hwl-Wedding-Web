"use client";

import { useState, useMemo, useEffect } from "react";
import PartyRow from "./Row";
import {
  PartyAddSubmitDesktop,
  PartyAddSubmitMobile,
} from "./AddSubmitButtons";
import { AnimatePresence, motion } from "framer-motion";

export type Member = {
  id: string;
  firstName: string;
  lastName: string;
  age: string;
  phoneNumber: string;
  allergies: string;
  leader: boolean;
};

const makeBlankMember = ({
  id,
  numId,
  leader,
  firstName,
  lastName,
  phoneNumber,
}: {
  id?: string;
  numId?: number;
  leader?: boolean;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}): Member => ({
  id: id || (globalThis as any).crypto?.randomUUID?.(),
  firstName: firstName ?? "",
  lastName: lastName ?? "",
  age: "",
  phoneNumber: phoneNumber ?? "",
  allergies: "",
  leader: leader ?? false,
});

export default function PartyBuilder({
  userId,
  firstName,
  lastName,
  phoneNumber,
}: {
  userId?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}) {
  const [members, setMembers] = useState<Member[]>([
    makeBlankMember({
      id: userId,
      firstName,
      lastName,
      phoneNumber,
      leader: true,
    }),
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const total = useMemo(() => members.length, [members]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 10000);
    return () => clearTimeout(t);
  }, [error]);

  function updateMember(id: string, patch: Partial<Member>) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  }
  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }
  function addMember() {
    setMembers((prev) => [...prev, makeBlankMember({})]);
  }

  function isRowEffectivelyEmpty(m: Member) {
    return !m.firstName && !m.lastName && !m.age;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const nonEmpty = members.filter((m) => !isRowEffectivelyEmpty(m));

    const invalid = nonEmpty.find(
      (m) => !m.firstName.trim() || !m.lastName.trim() || !m.age.trim()
    );
    if (invalid) {
      setError("Each member must have a first name, last name, and age set.");
      return;
    }

    const payload = nonEmpty.map((m) => ({
      firstName: m.firstName.trim(),
      lastName: m.lastName.trim(),
      age: m.age ? Number(m.age) : null,
      phoneNumber: m.phoneNumber.trim() || null,
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
    <>
      <section className="relative z-10 w-full max-w-6xl pb-16">
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
              Add family members or plus ones below. Phone numbers and allergies
              are optional
            </p>
          </header>

          <form id="party-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-2xl border border-[#E7D9BF] bg-white/60">
              <div className="hidden md:grid grid-cols-12 gap-3 border-b border-[#E8DDC9] px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#6B725E]">
                <div className="col-span-2">First name</div>
                <div className="col-span-2">Last name</div>
                <div className="col-span-1">Age</div>
                <div className="col-span-2">Phone Number</div>
                <div className="col-span-4">Allergies</div>
                <div className="col-span-1 text-right">Remove</div>
              </div>

              <PartyRow
                members={members}
                updateMember={updateMember}
                removeMember={removeMember}
              />
            </div>

            <PartyAddSubmitDesktop
              addMember={addMember}
              submitting={submitting}
            />
          </form>

          <footer className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-xs text-[#8C7E68]">
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
            <span>
              contact wedding@thehowles.love with any questions or issues
            </span>
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
          </footer>
        </div>
      </section>
      <PartyAddSubmitMobile addMember={addMember} submitting={submitting} />
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className=" fixed top-3 inset-x-3 z-50"
            role="alert"
            aria-live="assertive"
          >
            <div className="rounded-xl border border-red-200 bg-red-50/95 backdrop-blur px-4 py-3 text-sm text-red-700 shadow-lg">
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
