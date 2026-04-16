"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "./Lightbox";
import type { GalleryPhoto } from "@/app/gallery/page";

export default function GalleryGrid({
  photos,
  initialPhoto,
  isAdmin,
  visiblePhotos: initialVisible,
}: {
  photos: GalleryPhoto[];
  initialPhoto?: string | null;
  isAdmin?: boolean;
  visiblePhotos?: string[];
}) {
  const initialIndex = initialPhoto
    ? photos.findIndex((p) => p.src.includes(initialPhoto))
    : null;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialIndex !== -1 ? initialIndex : null
  );
  const [visible, setVisible] = useState<Set<string>>(
    new Set(initialVisible ?? [])
  );

  const toggleVisibility = async (filename: string) => {
    const isVisible = visible.has(filename);
    const next = new Set(visible);
    if (isVisible) {
      next.delete(filename);
    } else {
      next.add(filename);
    }
    setVisible(next);

    await fetch("/api/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, visible: !isVisible }),
    });
  };

  return (
    <>
      <div className="mt-6 columns-2 md:columns-3 lg:columns-4 gap-3">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.src}
            layoutId={`gallery-photo-${photo.src}`}
            className={`mb-3 cursor-pointer overflow-hidden rounded-xl border break-inside-avoid relative ${
              isAdmin && !visible.has(photo.filename)
                ? "border-red-300 opacity-50"
                : "border-[#E8DDC9]"
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
            onClick={() => setSelectedIndex(i)}
          >
            <Image
              src={photo.src}
              alt={`Photo ${i + 1}`}
              width={600}
              height={400}
              className="w-full h-auto block"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized
            />
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisibility(photo.filename);
                }}
                className={`absolute top-2 left-2 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                  visible.has(photo.filename)
                    ? "bg-[#2E4E3F] border-[#2E4E3F] text-white"
                    : "bg-white/80 border-gray-400"
                }`}
                aria-label={
                  visible.has(photo.filename)
                    ? "Hide from guests"
                    : "Show to guests"
                }
              >
                {visible.has(photo.filename) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            photos={photos}
            selectedIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
            onNavigate={setSelectedIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}
