"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function EstateLoadingScreen() {
  const [progress, setProgress] = useState(8);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setProgress(100);
      return;
    }

    const timer = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 96) return value;
        return Math.min(96, value + Math.max(1, Math.round((100 - value) / 9)));
      });
    }, 90);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-[#fbfaf7]">
      <div className="w-[min(82vw,360px)] text-center">
        <div className="estate-loader mx-auto" aria-hidden="true">
          <span className="estate-loader-roof" />
          <span className="estate-loader-home">
            <i />
            <i />
            <i />
          </span>
          <span className="estate-loader-key" />
        </div>
        <div className="mt-7 flex items-end justify-between border-b border-ink/15 pb-3">
          <p className="text-left text-[10px] font-bold uppercase tracking-[0.25em] text-ink/45">
            Preparing your stay
          </p>
          <span className="font-display text-3xl tabular-nums text-ink">{progress}</span>
        </div>
        <div className="mt-2 h-px overflow-hidden bg-ink/10">
          <motion.div
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="h-full origin-left bg-champagne"
          />
        </div>
      </div>
    </div>
  );
}
