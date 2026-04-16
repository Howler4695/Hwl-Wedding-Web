import { NakedHeader } from "@/components";

export default function GalleryLoading() {
  return (
    <div className="relative z-10 mx-auto mt-2 w-full max-w-6xl px-6 pb-16">
      <NakedHeader text="Gallery" />
      <div className="mt-6 columns-2 md:columns-3 lg:columns-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="mb-3 skeleton-glow rounded-xl break-inside-avoid"
            style={{ height: `${180 + (i % 3) * 60}px` }}
          />
        ))}
      </div>
    </div>
  );
}
