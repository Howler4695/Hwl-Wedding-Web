"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ColdStartModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="cold-start-title"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 mx-4 w-full max-w-sm rounded-2xl bg-white/95 p-8 shadow-xl text-center"
          >
            <div className="mx-auto mb-5 h-8 w-8 animate-spin rounded-full border-[3px] border-[#2E4E3F] border-t-transparent" />
            <h2
              id="cold-start-title"
              className="mb-2 text-lg tracking-tight text-[#2E4E3F]"
            >
              Just a moment...
            </h2>
            <p className="text-sm leading-relaxed text-[#4F5E50]">
              Our website is waking up. This may take up to 30 seconds.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
