"use client";
import { useEffect, useMemo, useState } from "react";

export default function Countdown({
  weddingTarget,
}: {
  weddingTarget: string;
}) {
  const target = useMemo(() => new Date(weddingTarget), [weddingTarget]);
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      <TimeCell label="Days" value={days} />
      <TimeCell label="Hours" value={hours} />
      <TimeCell label="Minutes" value={minutes} />
      <TimeCell label="Seconds" value={seconds} />
    </div>
  );
}

function TimeCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#E8DDC9] bg-white/60 p-3 text-center">
      <div className="font-serif text-2xl sm:text-3xl text-[#2E4E3F]">
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-1 text-[6px] xs:text-[7px] sm:text-[10px] uppercase tracking-[0.25em] text-[#6B725E]">
        {label}
      </div>
    </div>
  );
}
