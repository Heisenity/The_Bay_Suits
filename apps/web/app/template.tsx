"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          className="pointer-events-none fixed inset-0 z-[110] origin-right bg-champagne"
        />
      )}
      {children}
    </>
  );
}
