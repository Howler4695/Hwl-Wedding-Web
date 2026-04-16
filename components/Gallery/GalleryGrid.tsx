"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "./Lightbox";
import type { GalleryPhoto } from "@/app/gallery/page";

export default function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mt-6 columns-2 md:columns-3 lg:columns-4 gap-3">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.src}
            layoutId={`gallery-photo-${photo.src}`}
            className="mb-3 cursor-pointer overflow-hidden rounded-xl border border-[#E8DDC9] break-inside-avoid"
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
