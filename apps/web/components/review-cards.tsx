"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageSquareQuote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { testimonials } from "@/lib/data";

export function ReviewCards() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % testimonials.length), 4200);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <section className="section-pad overflow-hidden bg-linen">
      <div className="container-wide">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Guest notes</p>
            <h2 className="mt-5 max-w-2xl font-display text-5xl leading-none md:text-7xl">The best stays feel easy.</h2>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex w-fit items-center gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-3 text-xs font-semibold shadow-soft backdrop-blur-xl"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white"><MessageSquareQuote className="h-3.5 w-3.5" /></span>
              New five-star guest review
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.figure
              key={testimonial.author}
              animate={{ y: active === index && !reduceMotion ? -8 : 0, scale: active === index && !reduceMotion ? 1.015 : 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-[1.75rem] border border-ink/5 bg-white p-8 shadow-[0_15px_45px_rgba(15,31,53,.07)] md:p-10"
            >
              <div className="flex gap-1 text-champagne">{Array.from({ length: 5 }, (_, star) => <Star key={star} className="h-3.5 w-3.5 fill-current" />)}</div>
              <blockquote className="mt-6 font-display text-2xl leading-9">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-8 text-xs font-bold uppercase tracking-[0.12em] text-ink/50">
                {testimonial.author} · {testimonial.stay}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
