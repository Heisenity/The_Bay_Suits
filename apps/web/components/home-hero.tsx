"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Star } from "lucide-react";
import { useRef } from "react";
import { SearchBox } from "./search-box";
import { MagneticLink } from "./magnetic-link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export function HomeHero() {
  const hero = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "14%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.82], [1, 0]);

  return (
    <section id="home" ref={hero} className="relative z-20 isolate scroll-mt-[76px] overflow-visible bg-ink text-white md:min-h-[800px]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div style={{ y: imageY }} className="absolute -inset-y-[14%] inset-x-0">
          <Image
            src="/images/hero.jpg"
            alt="Elegant furnished suite"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/20" />
        <motion.div
          animate={reduceMotion ? undefined : { x: ["-10%", "18%", "-10%"], opacity: [0.18, 0.32, 0.18] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-champagne/20 blur-[140px]"
        />
      </div>

      <motion.div
        style={{ y: copyY, opacity }}
        className="container-wide relative z-10 flex min-h-[650px] flex-col justify-center px-5 pb-14 pt-20 md:min-h-[800px] md:px-10 md:pb-40 lg:px-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-10 bg-champagne" />
          <p className="eyebrow">Elevated stays, wherever life takes you</p>
        </motion.div>

        <h1 className="mt-7 max-w-5xl font-display text-5xl leading-[0.94] tracking-[-0.045em] sm:text-6xl md:text-8xl lg:text-[7.8rem]">
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              Stay beautifully.
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.15em] pr-[0.08em]">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className="block italic text-champagne"
            >
              Live effortlessly.
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.62 }}
          className="mt-8 flex max-w-3xl flex-col gap-7 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-xl text-base leading-8 text-white/68 md:text-lg">
            Design-led furnished residences, intuitive booking, and responsive guest care that
            makes every stay feel remarkably easy.
          </p>
          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs backdrop-blur-md md:flex">
            <Star className="h-3.5 w-3.5 fill-champagne text-champagne" />
            <strong>4.9</strong>
            <span className="text-white/45">guest rating</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <MagneticLink href="/stays" className={cn(buttonVariants({ variant: "gold", size: "lg" }), "group")}>
            Explore our suites
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </MagneticLink>
          <Link
            href="/owners"
            className="hidden items-center rounded-full border border-white/25 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-ink sm:inline-flex"
          >
            List your property
          </Link>
        </motion.div>
      </motion.div>

      <div className="relative inset-x-0 z-30 px-5 pb-8 md:absolute md:bottom-7 md:px-10 md:pb-0 lg:px-16">
        <div className="container-wide">
          <SearchBox />
        </div>
      </div>

      <a
        href="#curated-stays"
        aria-label="Scroll to curated stays"
        className="absolute bottom-40 right-8 z-10 hidden h-16 w-16 place-items-center rounded-full border border-white/20 text-white/70 transition hover:border-champagne hover:text-champagne xl:grid"
      >
        <motion.span animate={reduceMotion ? undefined : { y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </a>
    </section>
  );
}
