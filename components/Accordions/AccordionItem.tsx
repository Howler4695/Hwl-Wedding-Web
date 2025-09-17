"use client";
import { useState } from "react";

export default function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="group"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[#2E4E3F]">
        <span className="font-medium">{q}</span>
        <span className="ml-4 select-none rounded-full border border-[#E8DDC9] px-2 py-0.5 text-xs text-[#6B725E]">
          {open ? "–" : "+"}
        </span>
      </summary>
      <div className="px-4 pb-4 text-sm text-[#4F5E50]">{a}</div>
    </details>
  );
}
