"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { getPropertyMonthAvailability } from "@/lib/api";

function shiftMonth(value: string, direction: number) {
  const [yearString, monthString] = value.split("-");
  const base = new Date(Date.UTC(Number(yearString), Number(monthString) - 1 + direction, 1));
  return `${base.getUTCFullYear()}-${String(base.getUTCMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function BookingCalendarPreview({ propertyId }: { propertyId: string }) {
  const reduceMotion = useReducedMotion();
  const [month, setMonth] = useState(formatMonth(new Date()));
  const { data, isLoading } = useQuery({
    queryKey: ["calendar-preview", propertyId, month],
    queryFn: () => getPropertyMonthAvailability(propertyId, month)
  });

  const days = useMemo(() => Array.from({ length: data?.daysInMonth || 0 }, (_, index) => index + 1), [data]);
  const blanks = useMemo(() => Array.from({ length: data?.startsOn || 0 }, (_, index) => index), [data]);
  const reservedDays = new Set(data?.reservedDays || []);

  return (
    <section className="border-t border-ink/10 py-9">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl">Availability at a glance</h2>
          <p className="mt-2 text-sm text-ink/50">Live dates are confirmed against current bookings before checkout.</p>
        </div>
        <CalendarCheck className="h-6 w-6 text-champagne" />
      </div>
      <div className="mt-7 overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white p-5 shadow-[0_16px_45px_rgba(15,31,53,.07)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMonth((current) => shiftMonth(current, -1))}
              className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 text-ink/55 transition hover:bg-linen hover:text-ink"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <strong className="text-sm">{data?.monthLabel || "Loading month…"}</strong>
            <button
              type="button"
              onClick={() => setMonth((current) => shiftMonth(current, 1))}
              className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 text-ink/55 transition hover:bg-linen hover:text-ink"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-ink/40">
            <ShieldCheck className="h-3.5 w-3.5 text-champagne" /> Current booking map
          </span>
        </div>
        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-ink/35">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {blanks.map((blank) => <span key={`blank-${blank}`} className="aspect-square rounded-lg bg-transparent" />)}
          {isLoading
            ? Array.from({ length: 28 }, (_, index) => (
                <span key={`loading-${index}`} className="grid aspect-square place-items-center rounded-lg bg-linen text-xs text-transparent">
                  .
                </span>
              ))
            : days.map((day, index) => {
                const reserved = reservedDays.has(day);
                return (
                  <motion.span
                    key={day}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.75 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: reduceMotion ? 0 : index * 0.01 }}
                    className={`grid aspect-square place-items-center rounded-lg text-xs ${
                      reserved ? "bg-ink/7 text-ink/30 line-through" : "bg-linen text-ink"
                    }`}
                  >
                    {day}
                  </motion.span>
                );
              })}
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-[10px] text-ink/45">
          <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-linen ring-1 ring-ink/10" /> Available</span>
          <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-ink/15" /> Reserved</span>
        </div>
      </div>
    </section>
  );
}
