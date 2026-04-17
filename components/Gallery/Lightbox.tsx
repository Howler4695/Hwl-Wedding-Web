"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryPhoto } from "@/app/gallery/page";

type LightboxProps = {
  photos: GalleryPhoto[];
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export default function Lightbox({
  photos,
  selectedIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const photo = photos[selectedIndex];

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && selectedIndex < photos.length - 1)
        onNavigate(selectedIndex + 1);
      if (e.key === "ArrowLeft" && selectedIndex > 0)
        onNavigate(selectedIndex - 1);
    },
    [onClose, onNavigate, selectedIndex, photos.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-[#869A78]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Download button - top left */}
      <a
        href={photo.fullRes}
        download
        className="absolute top-4 left-4 z-10 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
        aria-label="Download full resolution"
        onClick={(e) => e.stopPropagation()}
      >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
      </a>

      {/* Navigation arrows */}
      {selectedIndex > 0 && (
        <button
          onClick={() => onNavigate(selectedIndex - 1)}
          className="absolute left-4 z-10 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
          aria-label="Previous photo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      {selectedIndex < photos.length - 1 && (
        <button
          onClick={() => onNavigate(selectedIndex + 1)}
          className="absolute right-4 z-10 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
          aria-label="Next photo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Image with drag-to-dismiss and swipe navigation. Keyed on src so
          each navigation remounts cleanly — prevents stale drag transforms
          and layout-cache issues after the tab is backgrounded. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={photo.src}
          className="relative z-10 flex max-h-[85vh] max-w-[90vw] items-center justify-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          drag
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.y) > 100) {
              onClose();
            } else if (info.offset.x < -80 && selectedIndex < photos.length - 1) {
              onNavigate(selectedIndex + 1);
            } else if (info.offset.x > 80 && selectedIndex > 0) {
              onNavigate(selectedIndex - 1);
            }
          }}
        >
          <Image
            src={photo.src}
            alt={`Photo ${selectedIndex + 1} of ${photos.length}`}
            width={1200}
            height={800}
            className="max-h-[85vh] w-auto rounded-lg object-contain"
            sizes="90vw"
            priority
            unoptimized
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
