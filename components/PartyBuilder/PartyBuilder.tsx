"use client";

import { useState, useMemo } from "react";
import PartyRow from "./Row";
import {
  PartyAddSubmitDesktop,
  PartyAddSubmitMobile,
} from "./AddSubmitButtons";

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  age: string;
  phoneNumber: string;
  allergies: string;
};

const makeBlankMember = (id?: string): Member => ({
  id:
    id ??
    (globalThis as any).crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random()}`,
  firstName: "",
  lastName: "",
  age: "",
  phoneNumber: "",
  allergies: "",
});

export default function PartyBuilder() {
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
  function addUserAsMember(userId?: string) {
    setMembers((prev) => [...prev, makeBlankMember(userId)]);
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

  //   const session = await auth();
  //   const userId = session?.user?.id;

  //   const userJ = await fetch(`${process.env.BACKEND_URL}/user/${userId}`, {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   const contactsJ = await fetch(
  //     `${process.env.BACKEND_URL}/user/contact/${userId}`,
  //     {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     }
  //   );
  //   const userInfo = await userJ.json();
  //   const contactInfo = await contactsJ.json();

  //   useEffect(() => {
  //     if (total === 0) {
  //       addUserAsMember(userId);
  //     }
  //   }, [total]);
  return (
    <section className="relative z-10 w-full max-w-6xl">
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
            <div className="hidden sm:grid grid-cols-12 gap-3 border-b border-[#E8DDC9] px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#6B725E]">
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

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <PartyAddSubmitDesktop
            addMember={addMember}
            submitting={submitting}
          />
        </form>

        <PartyAddSubmitMobile addMember={addMember} submitting={submitting} />

        <footer className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-xs text-[#8C7E68]">
          <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
          <span>
            contact wedding@thehowles.love with any questions or issues
          </span>
          <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
        </footer>
      </div>
    </section>
  );
}
