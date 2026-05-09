"use client";
import { useEffect, useMemo, useState } from "react";

export default function Countdown({
  weddingTarget,
}: {
  weddingTarget: string;
}) {
  const target = useMemo(
    () => new Date(weddingTarget).getTime(),
    [weddingTarget]
  );
  const [now, setNow] = useState<number | null>(null);
  const diff = now === null ? 0 : Math.max(0, target - now);

  useEffect(() => {
    const updateNow = () => setNow(Date.now());
    updateNow();

    const id = setInterval(updateNow, 1000);
    return () => clearInterval(id);
  }, []);

  const seconds = Math.floor((diff / 1000) % 60);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

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
    <div className="rounded-2xl border border-[#E8DDC9] bg-white/60 p-1 sm:p-3 text-center">
      <div className="text-xl xs:text-2xl sm:text-3xl text-[#A24E69]">
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-1 text-[6px] xs:text-[7px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.25em] text-[#7A6B5C]">
        {label}
      </div>
    </div>
  );
}
