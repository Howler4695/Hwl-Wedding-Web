export const CountdownSkeleton = () => (
  <div className="grid grid-cols-4 gap-2 sm:gap-4">
    <TimeCellSkeleton />
    <TimeCellSkeleton />
    <TimeCellSkeleton />
    <TimeCellSkeleton />
  </div>
);

const TimeCellSkeleton = () => (
  <div className="rounded-2xl border border-[#E8DDC9] bg-white/60 p-3 text-center">
    <div className="skeleton-glow text-xl xs:text-2xl sm:text-3xl">00</div>
    <div className="skeleton-glow mt-1 text-[6px] xs:text-[7px] sm:text-[10px] uppercase tracking-[0.25em]">
      label
    </div>
  </div>
);
