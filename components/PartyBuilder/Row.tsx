"use client";
import { AnimatePresence, motion } from "framer-motion";
import PartyLabel from "./Label";
import PartyRemove from "./RemoveButton";
import { Member } from "./PartyBuilder";

const inputStyles =
  "w-full rounded-xl border border-[#9FB39E] bg-white/80 px-3 py-3 text-sm text-[#2E4E3F] placeholder-[#7A846F] focus:border-[#CAA55A] focus:outline-none focus:ring-2 focus:ring-[#CAA55A]/40";

export default function PartyRow({
  members,
  updateMember,
  removeMember,
}: {
  members: Member[];
  updateMember: (id: string, patch: Partial<Member>) => void;
  removeMember: (id: string) => void;
}) {
  return (
    <AnimatePresence initial={false}>
      {members.map((m, idx) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-12 items-center gap-3 px-4 py-3 border-b last:border-b-0 border-[#E8DDC9]"
        >
          <div className="md:col-span-2">
            <PartyLabel id={m.id} text="First Name*" />
            <input
              id={`first-${m.id}`}
              type="text"
              inputMode="text"
              autoComplete={idx === 0 ? "given-name" : "off"}
              value={m.firstName}
              onChange={(e) =>
                m.leader || updateMember(m.id, { firstName: e.target.value })
              }
              placeholder="Hannah"
              className={inputStyles}
            />
          </div>

          <div className="md:col-span-2">
            <PartyLabel id={m.id} text="Last Name*" />

            <input
              id={`last-${m.id}`}
              type="text"
              autoComplete={idx === 0 ? "family-name" : "off"}
              value={m.lastName}
              onChange={(e) =>
                m.leader || updateMember(m.id, { lastName: e.target.value })
              }
              placeholder="Kounter"
              className={inputStyles}
            />
          </div>

          <div className="md:col-span-1">
            <PartyLabel id={m.id} text="Age*" />
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
              placeholder="21"
              className={inputStyles}
            />
          </div>

          <div className="md:col-span-2">
            <PartyLabel id={m.id} text="Phone Number" />
            <input
              id={`phone-${m.id}`}
              type="number"
              step={1}
              inputMode="tel"
              value={m.phoneNumber}
              onChange={(e) =>
                m.leader ||
                updateMember(m.id, {
                  phoneNumber: e.target.value,
                })
              }
              placeholder="(555) 555 5555"
              className={inputStyles}
            />
          </div>

          <div className="col-span-2 md:col-span-4">
            <PartyLabel id={m.id} text="Allergies / Accomadations" />
            <input
              id={`allergy-${m.id}`}
              type="text"
              inputMode="text"
              value={m.allergies}
              onChange={(e) =>
                updateMember(m.id, { allergies: e.target.value })
              }
              placeholder="peanuts, wheelchair"
              className={inputStyles}
            />
          </div>

          {m.leader || <PartyRemove onClick={() => removeMember(m.id)} />}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
