export const NakedHeader = ({ text }: { text: string }) => (
  // isolation: isolate gives the halo its own stacking context so
  // Firefox's compositor doesn't conflate the halo's filter:blur layer
  // with adjacent backdrop-filter layers on scroll (caused Gallery
  // halo to flicker since the welcome Card above has backdrop-blur).
  <div className="flex w-full justify-center isolate">
    <h1 className="naked-backdrop-halo font-heading font-semibold text-4xl sm:text-5xl text-[#9C5366] tracking-[0.06em]">{text}</h1>
  </div>
);
