"use client";
import { InputHTMLAttributes } from "react";

export default function PartyInput({
  id,
  value,
  onChange,
  ...props
}: {
  id: string;
  value: InputHTMLAttributes<HTMLInputElement>["value"];
  onChange: InputHTMLAttributes<HTMLInputElement>["onChange"];
}) {
  return (
    <input
      id={`age-${id}`}
      value={value}
      onChange={onChange}
      {...props}
      className="w-full rounded-xl border border-[#843E55] bg-white/80 px-3 py-3 text-sm text-[#A24E69] placeholder-[#9C8B7A] focus:border-[#CAA55A] focus:outline-none focus:ring-2 focus:ring-[#CAA55A]/40"
    />
  );
}
