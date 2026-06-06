"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const sections = [
  { id: "home", label: "Introduction" },
  { id: "curated-stays", label: "Residences" },
  { id: "stay-standard", label: "Experience" },
  { id: "services", label: "Services" },
  { id: "guest-stories", label: "Stories" }
];

export function SectionIndex() {
  const [active, setActive] = useState(sections[0].id);

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.5] }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Home page sections"
      className="fixed left-1 top-1/2 z-40 hidden -translate-y-1/2 rounded-2xl border border-white/10 bg-ink/80 px-2.5 py-3 text-white shadow-2xl backdrop-blur-xl xl:block"
    >
      <ol className="space-y-2">
        {sections.map((section, index) => {
          const isActive = active === section.id;
          return (
            <li key={section.id} className="relative">
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "location" : undefined}
                title={section.label}
                className="group flex items-center gap-1.5 py-0.5"
              >
                <span className={`w-3 text-[8px] tabular-nums ${isActive ? "text-white" : "text-white/35"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="relative h-px w-4 overflow-hidden bg-white/20">
                  <motion.span
                    animate={{ x: isActive ? "0%" : "-105%" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 bg-champagne"
                  />
                </span>
                <span
                  className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-x-2 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white opacity-0 shadow-xl transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  {section.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
