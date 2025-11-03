"use client";

import { useState, useMemo, useEffect } from "react";
import PartyRow from "./Row";
import {
  PartyAddSubmitDesktop,
  PartyAddSubmitMobile,
} from "./AddSubmitButtons";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

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
  leader,
  firstName,
  lastName,
  phoneNumber,
  age,
  allergies,
}: {
  id?: string;
  leader?: boolean;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  age?: string;
  allergies?: string;
}): Member => ({
  id: id || (globalThis as any).crypto?.randomUUID?.(),
  firstName: firstName ?? "",
  lastName: lastName ?? "",
  age: age ?? "",
  phoneNumber: phoneNumber ?? "",
  allergies: allergies ?? "",
  leader: leader ?? false,
});

export default function PartyBuilder({
  userId,
  firstName,
  lastName,
  phoneNumber,
  partyPops,
  backendURL,
}: {
  userId?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  partyPops: Member[];
  backendURL?: string;
}) {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [membersToRemove, setMembersToRemove] = useState<Member[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const total = useMemo(() => members.length, [members]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 10000);
    return () => clearTimeout(t);
  }, [error]);

  useEffect(() => {
    if (partyPops.length === 0) {
      setMembers([
        makeBlankMember({
          id: userId,
          firstName,
          lastName,
          phoneNumber,
          leader: true,
        }),
      ]);
      return;
    }
    const currentMembers: Member[] = [];
    for (const pop of partyPops) {
      if (pop?.id === userId) {
        currentMembers.unshift(
          makeBlankMember({
            id: pop?.id,
            firstName: pop?.firstName,
            lastName: pop?.lastName,
            phoneNumber: pop?.phoneNumber,
            age: String(pop?.age),
            allergies: pop?.allergies,
            leader: true,
          })
        );
        continue;
      }

      currentMembers.push(
        makeBlankMember({
          id: pop.id,
          firstName: pop?.firstName,
          lastName: pop?.lastName,
          phoneNumber: pop?.phoneNumber,
          age: String(pop?.age),
          allergies: pop?.allergies,
          leader: false,
        })
      );
    }

    setMembers(() => [...currentMembers]);
  }, [partyPops, setMembers]);

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

    const partyPeoplePayload = nonEmpty.map((m) => ({
      id: m.id,
      first_name: m.firstName.trim(),
      last_name: m.lastName.trim(),
      age: m.age ? Number(m.age) : 0,
      phone_number: m.phoneNumber.trim() || null,
      allergies: m.allergies.trim() || null,
    }));

    const finalPayload = { party_people: partyPeoplePayload };

    try {
      setSubmitting(true);
      await fetch(`${backendURL}/party/update/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });
      router.push("/register");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form id="party-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-[#E7D9BF] bg-white/60">
          <div className="hidden md:grid grid-cols-12 gap-3 border-b border-[#E8DDC9] px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#6B725E]">
            <div className="col-span-2">First name</div>
            <div className="col-span-2">Last name</div>
            <div className="col-span-1">Age</div>
            <div className="col-span-2">Phone Number</div>
            <div className="col-span-4">Allergies / Accomadations</div>
            <div className="col-span-1 text-right">Remove</div>
          </div>

          <PartyRow
            members={members}
            updateMember={updateMember}
            removeMember={removeMember}
          />
        </div>

        <PartyAddSubmitDesktop addMember={addMember} submitting={submitting} />
      </form>

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
