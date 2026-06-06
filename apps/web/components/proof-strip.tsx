"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const metrics = [
  { value: 4.9, suffix: "/5", label: "Average guest rating", decimals: 1 },
  { value: 24, suffix: "/7", label: "Guest support", decimals: 0 },
  { value: 3, suffix: "", label: "Flexible stay types", decimals: 0 }
];

function Metric({ value, suffix, label, decimals }: (typeof metrics)[number]) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setShown(value);
      return;
    }
    let frame = 0;
    const total = 42;
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = 1 - Math.pow(1 - frame / total, 3);
      setShown(value * Math.min(progress, 1));
      if (frame >= total) window.clearInterval(timer);
    }, 24);
    return () => window.clearInterval(timer);
  }, [inView, reduceMotion, value]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-t border-ink/15 py-7 md:border-l md:border-t-0 md:px-8 md:py-2 first:md:border-l-0">
      <strong className="font-display text-5xl md:text-6xl">{shown.toFixed(decimals)}{suffix}</strong>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-[.14em] text-ink/45">{label}</p>
    </motion.div>
  );
}

export function ProofStrip() {
  return (
    <section className="border-y border-ink/10 bg-[#fbfaf7] px-5 py-10 md:px-10 lg:px-16">
      <div className="container-wide grid md:grid-cols-3">
        {metrics.map((metric) => <Metric key={metric.label} {...metric} />)}
      </div>
    </section>
  );
}
