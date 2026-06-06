"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, ShieldCheck } from "lucide-react";

const days = Array.from({ length: 35 }, (_, index) => index + 1);
const occupied = new Set([3, 4, 5, 11, 12, 13, 19, 20, 26, 27, 28]);

export function BookingCalendarPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-t border-ink/10 py-9">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl">Availability at a glance</h2>
          <p className="mt-2 text-sm text-ink/50">Live dates are confirmed during checkout.</p>
        </div>
        <CalendarCheck className="h-6 w-6 text-champagne" />
      </div>
      <div className="mt-7 overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white p-5 shadow-[0_16px_45px_rgba(15,31,53,.07)]">
        <div className="flex items-center justify-between">
          <strong className="text-sm">June 2026</strong>
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-ink/40">
            <ShieldCheck className="h-3.5 w-3.5 text-champagne" /> Secure booking
          </span>
        </div>
        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-ink/35">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <motion.span
              key={day}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.75 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: reduceMotion ? 0 : index * 0.012 }}
              className={`grid aspect-square place-items-center rounded-lg text-xs ${
                occupied.has(day) ? "bg-ink/7 text-ink/30 line-through" : "bg-linen text-ink"
              }`}
            >
              {day}
            </motion.span>
          ))}
        </div>
        <div className="mt-4 flex gap-5 text-[10px] text-ink/45">
          <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-linen ring-1 ring-ink/10" /> Available</span>
          <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-ink/15" /> Reserved</span>
        </div>
      </div>
    </section>
  );
}
