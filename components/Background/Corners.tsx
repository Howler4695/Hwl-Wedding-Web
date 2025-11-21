import Image from "next/image";
import MagNoStem from "@/public/magnolia_no_stem.png";

export const MagCorners = () => (
  <>
    <div
      aria-hidden
      className="pointer-events-none select-none fixed -top-20 -left-20 h-72 w-72 rotate-[140deg] opacity-60 z-0"
    >
      <Image
        src={MagNoStem}
        alt=""
        fill
        sizes="288px"
        loading="lazy"
        fetchPriority="low"
        placeholder="empty"
        className="object-contain"
      />
    </div>
    <div
      aria-hidden
      className="pointer-events-none select-none fixed -bottom-24 -right-24 h-72 w-72 rotate-[320deg] opacity-60 z-0"
    >
      <Image
        src={MagNoStem}
        alt=""
        fill
        sizes="288px"
        loading="lazy"
        fetchPriority="low"
        placeholder="empty"
        className="object-contain"
      />
    </div>
  </>
);
