"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Headphones, KeyRound, Sparkles } from "lucide-react";
import { useState } from "react";

const standards = [
  {
    icon: Sparkles,
    title: "Prepared, never merely cleaned",
    short: "Professional preparation",
    text: "Every residence follows a detailed turnover and quality-review process, from fresh linens and replenishment to a final arrival-ready inspection.",
    image: "/images/suite-5.jpg"
  },
  {
    icon: Headphones,
    title: "A real team within reach",
    short: "Responsive guest care",
    text: "Questions, changes, and unexpected moments are handled by people who know the stay. Support remains available before arrival through departure.",
    image: "/images/suite-2.jpg"
  },
  {
    icon: KeyRound,
    title: "Arrive without the friction",
    short: "Simple self check-in",
    text: "Clear digital instructions and secure access make arrival intuitive, while the guest portal keeps the essential details together.",
    image: "/images/suite-8.jpg"
  },
  {
    icon: BadgeCheck,
    title: "Consistency you can feel",
    short: "Quality inspected",
    text: "Homes are selected and reviewed for comfort, function, location, and presentation, giving guests a dependable standard across the portfolio.",
    image: "/images/suite-7.jpg"
  }
];

export function StayStandard() {
  const [active, setActive] = useState(0);
  const selected = standards[active];

  return (
    <section id="stay-standard" className="scroll-mt-[76px] bg-ink text-white">
      <div className="container-wide grid min-h-[760px] lg:grid-cols-[1.08fr_.92fr]">
        <div className="relative min-h-[520px] overflow-hidden lg:sticky lg:top-[76px] lg:h-[calc(100vh-76px)] lg:min-h-[680px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.image}
              initial={{ clipPath: "inset(0 0 100% 0)", scale: 1.08 }}
              animate={{ clipPath: "inset(0 0 0% 0)", scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image src={selected.image} alt={selected.title} fill sizes="(min-width: 1024px) 54vw, 100vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
          <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between text-white md:bottom-10 md:left-10 md:right-10">
            <div><span className="text-[10px] font-bold uppercase tracking-[.18em] text-champagne">The Bay Suites standard</span><p className="mt-2 max-w-sm font-display text-3xl">{selected.short}</p></div>
            <span className="font-display text-5xl text-white/35">0{active + 1}</span>
          </div>
        </div>

        <div className="flex items-center px-5 py-20 md:px-12 lg:px-16 lg:py-28">
          <div className="w-full">
            <p className="eyebrow">The difference is in the details</p>
            <h2 className="mt-5 max-w-xl font-display text-5xl leading-none md:text-7xl">A private home, run with hotel discipline.</h2>
            <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
              {standards.map((standard, index) => {
                const Icon = standard.icon;
                const isActive = active === index;
                return (
                  <button
                    key={standard.title}
                    onClick={() => setActive(index)}
                    onMouseEnter={() => setActive(index)}
                    className="group w-full py-6 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`grid h-10 w-10 place-items-center rounded-full transition ${isActive ? "bg-champagne text-ink" : "bg-white/5 text-white/50 group-hover:bg-white/10"}`}><Icon className="h-4 w-4" /></span>
                      <h3 className={`flex-1 font-display text-2xl transition md:text-3xl ${isActive ? "text-white" : "text-white/48 group-hover:text-white/80"}`}>{standard.title}</h3>
                      <span className={`text-xs transition ${isActive ? "text-champagne" : "text-white/25"}`}>0{index + 1}</span>
                    </div>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.p
                          initial={{ height: 0, opacity: 0, y: -8 }}
                          animate={{ height: "auto", opacity: 1, y: 0 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="ml-14 max-w-lg overflow-hidden pt-4 text-sm leading-7 text-white/55"
                        >
                          {standard.text}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
