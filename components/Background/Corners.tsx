import Image from "next/image";

export const MagCorners = () => (
  <>
    <Image
      src="/magnolia_no_stem.svg"
      alt="Decorative magnolia"
      width={1024}
      height={1024}
      className="pointer-events-none select-none absolute -top-20 -left-20 h-72 w-72 rotate-[140deg] opacity-60"
      priority={true}
    />
    <Image
      src="/magnolia_no_stem.svg"
      alt="Decorative magnolia"
      width={1024}
      height={1024}
      className="pointer-events-none select-none absolute -bottom-24 -right-24 h-80 w-80 rotate-[320deg] opacity-70"
      priority={true}
    />
  </>
);
