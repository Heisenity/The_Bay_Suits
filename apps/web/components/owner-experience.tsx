"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  type MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform
} from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BedDouble,
  CalendarCheck,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  Sparkles,
  Star
} from "lucide-react";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const steps = [
  { icon: CalendarCheck, title: "Booking", text: "Optimized across channels", status: "Booking confirmed" },
  { icon: Sparkles, title: "Turnover", text: "Cleaning and inspection", status: "Suite prepared" },
  { icon: CircleDollarSign, title: "Payout", text: "Revenue reconciled", status: "Payout settled" },
  { icon: ClipboardCheck, title: "Report", text: "Performance made clear", status: "Report ready" }
];

const revenue = [18, 27, 24, 39, 44, 51, 48, 63, 71, 76, 88, 96];

function MilestoneAnimation({ index, active, reduceMotion }: { index: number; active: boolean; reduceMotion: boolean }) {
  if (index === 0) {
    return (
      <div className="relative h-16 w-16">
        <motion.div
          animate={active && !reduceMotion ? { y: [3, 0], scale: [0.92, 1] } : undefined}
          className="absolute inset-1 rounded-xl border border-champagne/45 bg-ink"
        >
          <span className="absolute inset-x-0 top-3 h-px bg-champagne/45" />
          <span className="absolute left-3 top-1 h-3 w-1 rounded-full bg-champagne" />
          <span className="absolute right-3 top-1 h-3 w-1 rounded-full bg-champagne" />
        </motion.div>
        <motion.span
          initial={false}
          animate={active ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.08 }}
          className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full bg-champagne text-ink shadow-lg"
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </motion.span>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="relative grid h-16 w-16 place-items-center">
        <motion.span
          animate={active && !reduceMotion ? { rotate: [0, 18, -10, 0], scale: [0.8, 1.15, 1] } : undefined}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="grid h-11 w-11 place-items-center rounded-full border border-champagne/35 bg-ink"
        >
          <Sparkles className="h-5 w-5 text-champagne" />
        </motion.span>
        {[0, 1, 2].map((dot) => (
          <motion.i
            key={dot}
            initial={false}
            animate={
              active
                ? { opacity: [0, 1, 0], scale: [0.4, 1, 0.4], x: [0, dot === 1 ? 22 : -18], y: [0, dot === 2 ? 19 : -17] }
                : { opacity: 0 }
            }
            transition={{ duration: 1.1, delay: dot * 0.12 }}
            className="absolute h-1.5 w-1.5 rounded-full bg-champagne"
          />
        ))}
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="relative flex h-16 w-16 items-end justify-center gap-1">
        {[0, 1, 2].map((coin) => (
          <motion.span
            key={coin}
            initial={false}
            animate={active ? { y: [18, -coin * 5, 0], opacity: [0, 1, 1] } : { y: 12, opacity: 0.35 }}
            transition={{ duration: 0.55, delay: coin * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="grid h-8 w-8 -ml-3 first:ml-0 place-items-center rounded-full border border-champagne/55 bg-ink text-[11px] font-bold text-champagne shadow-lg"
          >
            $
          </motion.span>
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex h-16 w-16 items-end justify-center gap-1 rounded-xl border border-champagne/35 bg-ink p-3">
      {[35, 58, 82].map((height, bar) => (
        <motion.span
          key={height}
          initial={false}
          animate={{ height: active ? `${height}%` : "18%" }}
          transition={{ duration: 0.55, delay: bar * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="w-2 rounded-t-sm bg-champagne"
        />
      ))}
      <motion.span
        initial={false}
        animate={active ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.2 }}
        className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-ink"
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </motion.span>
    </div>
  );
}

function ScrollWorkflow({ reduceMotion }: { reduceMotion: boolean }) {
  const section = useRef<HTMLElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const markerLeft = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setActiveStep(Math.min(3, Math.round(latest * 3)));
  });

  if (reduceMotion) {
    return (
      <section className="section-pad overflow-hidden bg-ink text-white">
        <WorkflowContent activeStep={3} reduceMotion />
      </section>
    );
  }

  return (
    <section ref={section} className="relative h-[280vh] bg-ink text-white md:h-[360vh]">
      <div className="sticky top-[76px] flex h-[calc(100svh-76px)] items-center overflow-hidden px-5 py-8 md:px-10 lg:px-16">
        <WorkflowContent activeStep={activeStep} markerLeft={markerLeft} lineScale={lineScale} reduceMotion={false} />
      </div>
    </section>
  );
}

function WorkflowContent({
  activeStep,
  markerLeft,
  lineScale,
  reduceMotion
}: {
  activeStep: number;
  markerLeft?: MotionValue<string>;
  lineScale?: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const CurrentIcon = steps[activeStep].icon;

  return (
    <div className="container-wide">
      <div className="grid items-end gap-5 lg:grid-cols-[1fr_.55fr]">
        <div>
          <p className="eyebrow">One operating system</p>
          <h2 className="mt-4 max-w-4xl font-display text-4xl leading-none sm:text-5xl md:text-6xl xl:text-7xl">
            From reservation to owner report, every step stays connected.
          </h2>
        </div>
        <p className="hidden max-w-lg text-sm leading-7 text-white/55 lg:block">
          Scroll through the management cycle to see how every reservation becomes a prepared stay, settled revenue, and a clear owner report.
        </p>
      </div>

      <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-[inset_0_1px_rgba(255,255,255,.08)] backdrop-blur-xl md:p-8">
        <div className="flex min-h-20 items-center justify-between gap-5 border-b border-white/10 pb-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={steps[activeStep].status}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-4"
            >
              <MilestoneAnimation index={activeStep} active reduceMotion={reduceMotion} />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-champagne">
                  Milestone {String(activeStep + 1).padStart(2, "0")}
                </p>
                <strong className="mt-1 block font-display text-2xl md:text-3xl">{steps[activeStep].status}</strong>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="hidden items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/35 sm:flex">
            <CurrentIcon className="h-4 w-4 text-champagne" />
            {activeStep === steps.length - 1 ? "Cycle complete" : "Scroll to continue"}
          </div>
        </div>

        <div className="relative mx-5 mt-8 hidden h-16 md:block">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/15">
            {lineScale && (
              <motion.div style={{ scaleX: lineScale, transformOrigin: "left" }} className="h-full bg-champagne" />
            )}
          </div>
          {steps.map((step, index) => {
            const completed = index <= activeStep;
            return (
              <motion.span
                key={step.title}
                animate={{ scale: index === activeStep ? 1.16 : 1 }}
                className={`absolute top-1/2 grid h-4 w-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border ${
                  completed ? "border-champagne bg-champagne" : "border-white/25 bg-ink"
                }`}
                style={{ left: `${(index / 3) * 100}%` }}
              >
                {index < activeStep && <Check className="h-2.5 w-2.5 text-ink" strokeWidth={3} />}
              </motion.span>
            );
          })}
          {markerLeft && (
            <motion.span
              style={{ left: markerLeft }}
              className="absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-ink bg-champagne text-ink shadow-[0_0_0_1px_rgba(203,185,148,.45),0_10px_28px_rgba(0,0,0,.35)]"
            >
              <CurrentIcon className="h-5 w-5" />
            </motion.span>
          )}
        </div>

        <div className="relative mx-3 mt-6 h-8 md:hidden">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/15">
            {lineScale && (
              <motion.div style={{ scaleX: lineScale, transformOrigin: "left" }} className="h-full bg-champagne" />
            )}
          </div>
          {steps.map((step, index) => (
            <span
              key={step.title}
              className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border ${
                index <= activeStep ? "border-champagne bg-champagne" : "border-white/25 bg-ink"
              }`}
              style={{ left: `${(index / 3) * 100}%` }}
            />
          ))}
          {markerLeft && (
            <motion.span
              style={{ left: markerLeft }}
              className="absolute top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-ink bg-champagne text-ink shadow-lg"
            >
              <CurrentIcon className="h-4 w-4" />
            </motion.span>
          )}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text, status }, index) => {
            const active = index === activeStep;
            const completed = index < activeStep;
            return (
              <motion.div
                key={title}
                animate={{ y: active ? -4 : 0 }}
                className={`relative overflow-hidden rounded-2xl border p-3 transition-colors duration-500 sm:p-4 ${
                  active
                    ? "border-champagne/50 bg-champagne/[0.09]"
                    : completed
                      ? "border-white/10 bg-white/[0.05]"
                      : "border-transparent bg-transparent"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${active ? "bg-champagne text-ink" : "bg-white/10 text-champagne"}`}>
                    {completed ? <Check className="h-4 w-4" strokeWidth={3} /> : <Icon className="h-4 w-4" />}
                  </span>
                  <div>
                    <span className="text-[9px] font-bold text-white/30">0{index + 1}</span>
                    <strong className="ml-2 text-sm">{title}</strong>
                    <p className={`mt-1 text-xs text-white/45 ${active ? "" : "hidden sm:block"}`}>{active ? status : text}</p>
                  </div>
                </div>
                {active && (
                  <motion.span
                    layoutId="workflow-active-card"
                    className="absolute inset-x-4 bottom-0 h-px bg-champagne"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function OwnerExperience() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <ScrollWorkflow reduceMotion={Boolean(reduceMotion)} />

      <section className="section-pad bg-linen">
        <div className="container-wide grid items-center gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <div className="perspective-property relative mx-auto w-full max-w-md">
            <motion.div
              initial={reduceMotion ? false : { rotateY: -10, rotateX: 5 }}
              whileInView={reduceMotion ? undefined : { rotateY: [0, 7, -4, 0], rotateX: [0, -2, 2, 0] }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 7, ease: "easeInOut" }}
              className="property-tilt-card relative aspect-[.82] overflow-hidden rounded-[2rem] shadow-[0_35px_90px_rgba(15,31,53,.22)]"
            >
              <Image src="/images/suite-7.jpg" alt="Managed property performance preview" fill sizes="(min-width: 1024px) 38vw, 90vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <span className="rounded-full bg-white/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.13em] backdrop-blur-md">Live portfolio</span>
                <h3 className="mt-4 font-display text-4xl">Executive Residence</h3>
                <p className="mt-2 flex items-center gap-4 text-xs text-white/65"><span className="flex gap-1"><BedDouble className="h-3.5 w-3.5" /> 2 beds</span><span className="flex gap-1"><Star className="h-3.5 w-3.5 fill-champagne text-champagne" /> 4.96</span></p>
              </div>
            </motion.div>
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-3 top-10 rounded-2xl border border-white/50 bg-white/80 p-4 shadow-soft backdrop-blur-xl md:-right-12"
            >
              <p className="text-[9px] font-bold uppercase tracking-[.13em] text-ink/40">New booking</p>
              <strong className="mt-1 block text-sm">28-night corporate stay</strong>
            </motion.div>
          </div>

          <div>
            <p className="eyebrow">Owner dashboard preview</p>
            <h2 className="mt-5 max-w-3xl font-display text-5xl leading-none md:text-7xl">Performance without the spreadsheet fog.</h2>
            <div className="mt-10 overflow-hidden rounded-[2rem] bg-ink p-5 text-white shadow-soft md:p-8">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Occupancy", "84%"],
                  ["Revenue", "$28.4k"],
                  ["Guest rating", "4.9"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
                    <p className="text-[9px] font-bold uppercase tracking-[.13em] text-white/40">{label}</p>
                    <strong className="mt-2 block font-display text-3xl">{value}</strong>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-white p-5 text-ink">
                <div className="flex items-center justify-between">
                  <div><p className="text-[9px] font-bold uppercase tracking-[.13em] text-ink/40">Revenue trend</p><strong className="mt-1 block text-sm">Last 12 months</strong></div>
                  <BarChart3 className="h-5 w-5 text-champagne" />
                </div>
                <div className="mt-7 flex h-32 items-end gap-2">
                  {revenue.map((height, index) => (
                    <motion.span
                      key={index}
                      initial={{ height: "8%" }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.65, delay: reduceMotion ? 0 : index * 0.045 }}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-ink to-champagne"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Transparent reporting", "Channel distribution", "Guest operations"].map((item) => (
                <span key={item} className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-semibold"><Check className="h-3.5 w-3.5 text-champagne" /> {item}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-4 z-30 mx-auto mt-16 flex max-w-xl flex-col gap-3 rounded-[1.75rem] border border-white/60 bg-white/85 p-3 shadow-soft backdrop-blur-xl sm:bottom-5 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:p-2 sm:pl-5">
          <span className="text-center text-xs font-semibold text-ink/60 sm:text-left">See what your property could earn.</span>
          <Link href="/property-assessment" className={cn(buttonVariants({ size: "sm" }), "w-full shrink-0 sm:w-auto")}>
            Free assessment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
