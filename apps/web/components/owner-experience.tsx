"use client";

import Image from "next/image";
import Link from "next/link";
import Lottie from "lottie-react";
import { motion, useReducedMotion } from "framer-motion";
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

const workflowAnimation = {
  v: "5.10.0",
  fr: 30,
  ip: 0,
  op: 180,
  w: 900,
  h: 150,
  nm: "Bay Suites owner workflow",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "progress",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [450, 75, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [720, 6] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 3 } },
            { ty: "fl", c: { a: 0, k: [0.796, 0.725, 0.58, 1] }, o: { a: 0, k: 35 }, r: 1 },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } }
          ],
          nm: "line"
        }
      ],
      ip: 0,
      op: 180,
      st: 0,
      bm: 0
    },
    ...[90, 330, 570, 810].map((x, index) => ({
      ddd: 0,
      ind: index + 2,
      ty: 4,
      nm: `step-${index + 1}`,
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: index * 32, s: [x, 75, 0], e: [x, 75, 0] },
            { t: index * 32 + 12, s: [x, 75, 0], e: [x, 65, 0] },
            { t: index * 32 + 24, s: [x, 65, 0], e: [x, 75, 0] },
            { t: 180, s: [x, 75, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: index * 32, s: [100, 100, 100], e: [125, 125, 100] },
            { t: index * 32 + 12, s: [125, 125, 100], e: [100, 100, 100] },
            { t: 180, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [38, 38] }, p: { a: 0, k: [0, 0] } },
            { ty: "fl", c: { a: 0, k: index === 3 ? [0.796, 0.725, 0.58, 1] : [0.059, 0.122, 0.208, 1] }, o: { a: 0, k: 100 }, r: 1 },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } }
          ],
          nm: `dot-${index + 1}`
        }
      ],
      ip: 0,
      op: 180,
      st: 0,
      bm: 0
    }))
  ],
  markers: []
};

const steps = [
  { icon: CalendarCheck, title: "Booking", text: "Optimized across channels" },
  { icon: Sparkles, title: "Turnover", text: "Cleaning and inspection" },
  { icon: CircleDollarSign, title: "Payout", text: "Revenue reconciled" },
  { icon: ClipboardCheck, title: "Report", text: "Performance made clear" }
];

const revenue = [18, 27, 24, 39, 44, 51, 48, 63, 71, 76, 88, 96];

export function OwnerExperience() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <section className="section-pad overflow-hidden bg-ink text-white">
        <div className="container-wide">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_.65fr]">
            <div>
              <p className="eyebrow">One operating system</p>
              <h2 className="mt-5 max-w-4xl font-display text-5xl leading-none md:text-7xl">
                From reservation to owner report, every step stays connected.
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-white/55">
              The motion follows the actual management cycle. It explains how guest activity becomes a prepared stay, settled revenue, and clear portfolio reporting.
            </p>
          </div>

          <div className="mt-14 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-[inset_0_1px_rgba(255,255,255,.08)] backdrop-blur-xl md:p-10">
            <Lottie
              animationData={workflowAnimation}
              loop
              autoplay={!reduceMotion}
              className="h-24 w-full opacity-90"
              rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
            />
            <div className="grid gap-5 border-t border-white/10 pt-7 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ icon: Icon, title, text }, index) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-champagne">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-[9px] font-bold text-white/30">0{index + 1}</span>
                    <strong className="ml-2 text-sm">{title}</strong>
                    <p className="mt-1 text-xs text-white/45">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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

        <div className="sticky bottom-5 z-30 mx-auto mt-16 flex max-w-xl items-center justify-between gap-4 rounded-full border border-white/60 bg-white/85 p-2 pl-5 shadow-soft backdrop-blur-xl">
          <span className="hidden text-xs font-semibold text-ink/60 sm:block">See what your property could earn.</span>
          <Link href="/property-assessment" className={cn(buttonVariants({ size: "sm" }), "shrink-0")}>
            Free assessment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
