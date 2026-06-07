"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BedDouble, MapPin, Star, Users } from "lucide-react";
import { useRef } from "react";
import type { Property } from "@/lib/types";
import { currency } from "@/lib/utils";

function ResidencePanel({ property, index }: { property: Property; index: number }) {
  return (
    <article className="grid min-h-[calc(100svh-76px)] w-screen shrink-0 grid-rows-[46svh_minmax(0,1fr)] bg-ink text-white lg:min-h-[calc(100vh-76px)] lg:grid-cols-[56%_44%] lg:grid-rows-1">
      <Link href={`/stays/${property.slug}`} className="group relative min-h-[46svh] overflow-hidden lg:min-h-full">
        <Image
          src={property.images[0]}
          alt={property.name}
          fill
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        <span className="absolute bottom-5 left-5 grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border border-white/35 bg-ink/15 px-2 text-[9px] font-bold uppercase tracking-[0.14em] backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:bg-champagne group-hover:text-ink sm:h-20 sm:w-20 lg:left-auto lg:right-6">
          Explore
        </span>
      </Link>

      <div className="relative flex min-h-0 flex-col justify-between overflow-hidden px-5 py-7 sm:px-8 sm:py-9 lg:px-14 lg:py-14">
        <span className="absolute -right-3 top-4 font-display text-[10rem] leading-none text-white/[0.03] sm:text-[12rem] lg:-right-8 lg:-top-16 lg:text-[15rem] lg:text-white/[0.035]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="relative flex items-center justify-between border-b border-white/12 pb-4 text-[9px] font-bold uppercase tracking-[0.18em] text-white/45 sm:text-[10px] sm:tracking-[0.2em] lg:pb-5">
          <span>Selected residence</span>
          <span>{String(index + 1).padStart(2, "0")} / 03</span>
        </div>

        <div className="relative flex-1 py-7 sm:py-8 lg:py-12">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne sm:text-xs sm:tracking-[0.18em]">
            <MapPin className="h-3.5 w-3.5" /> {property.location}
          </p>
          <h3 className="mt-4 max-w-[11.5rem] font-display text-[3.35rem] leading-[0.9] tracking-[-0.045em] sm:mt-5 sm:max-w-[13rem] sm:text-[3.9rem] lg:mt-6 lg:max-w-xl lg:text-5xl xl:text-7xl">
            {property.name}
          </h3>
          <p className="mt-4 max-w-[18rem] text-sm leading-6 text-white/55 sm:mt-5 sm:max-w-[22rem] sm:leading-7 lg:mt-6 lg:max-w-lg">{property.shortDescription}</p>
        </div>

        <div className="relative pb-10 sm:pb-11 lg:pb-0">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-white/12 py-4 text-[11px] text-white/55 sm:grid-cols-4 sm:gap-x-6 sm:gap-y-4 sm:py-5 sm:text-xs">
            <span className="flex items-center gap-2"><BedDouble className="h-4 w-4 text-champagne" /> {property.bedrooms} bed</span>
            <span className="flex items-center gap-2"><Users className="h-4 w-4 text-champagne" /> {property.guests} guests</span>
            <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-champagne text-champagne" /> {property.rating}</span>
            <span><strong className="text-base text-white">{currency(property.price)}</strong> / night</span>
          </div>
          <Link
            href={`/stays/${property.slug}`}
            className="group mt-5 inline-flex items-center gap-3 text-sm font-bold sm:mt-6 lg:mt-7"
          >
            View residence
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition group-hover:border-champagne group-hover:bg-champagne group-hover:text-ink">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function EditorialResidences({ properties }: { properties: Property[] }) {
  const desktopTarget = useRef<HTMLElement | null>(null);
  const mobileTarget = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress: desktopProgress } = useScroll({ target: desktopTarget, offset: ["start start", "end end"] });
  const { scrollYProgress: mobileProgress } = useScroll({ target: mobileTarget, offset: ["start start", "end end"] });
  const desktopX = useTransform(desktopProgress, [0, 1], ["0%", reduceMotion ? "0%" : "-66.666%"]);
  const mobileX = useTransform(mobileProgress, [0, 1], ["0%", reduceMotion ? "0%" : "-66.666%"]);
  const desktopScaleX = useTransform(desktopProgress, [0, 1], [0, 1]);
  const mobileScaleX = useTransform(mobileProgress, [0, 1], [0, 1]);
  const featured = properties.slice(0, 3);

  return (
    <section id="curated-stays" className="scroll-mt-[76px] bg-ink">
      <div className="bg-[#fbfaf7] px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="container-wide grid gap-8 lg:grid-cols-[1fr_0.62fr] lg:items-end">
          <div>
            <p className="eyebrow">Curated stays / 01</p>
            <h2 className="mt-5 max-w-4xl font-display text-5xl leading-[0.9] tracking-[-0.04em] md:text-7xl lg:text-[6.6rem]">
              Spaces with a point of view.
            </h2>
          </div>
          <div className="lg:pb-3">
            <p className="max-w-md text-sm leading-7 text-ink/55">
              Move through a selection of professionally prepared residences, each designed for
              a different rhythm of city life.
            </p>
            <Link href="/stays" className="group mt-6 inline-flex items-center gap-3 text-sm font-bold">
              Explore every residence
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      <div className={reduceMotion ? "" : "hidden"}>
        {featured.map((property, index) => (
          <ResidencePanel key={property.id} property={property} index={index} />
        ))}
      </div>

      {!reduceMotion && (
        <section ref={mobileTarget} className="relative h-[300vh] lg:hidden" aria-label="Featured residences">
          <div className="sticky top-[76px] h-[calc(100svh-76px)] overflow-hidden">
            <motion.div style={{ x: mobileX }} className="flex w-[300vw]">
              {featured.map((property, index) => (
                <ResidencePanel key={property.id} property={property} index={index} />
              ))}
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 z-10 h-1 bg-white/10">
              <motion.div style={{ scaleX: mobileScaleX, transformOrigin: "left" }} className="h-full bg-champagne" />
            </div>
          </div>
        </section>
      )}

      {!reduceMotion && (
        <section ref={desktopTarget} className="relative hidden h-[300vh] lg:block" aria-label="Featured residences">
          <div className="sticky top-[76px] h-[calc(100vh-76px)] overflow-hidden">
            <motion.div style={{ x: desktopX }} className="flex w-[300vw]">
              {featured.map((property, index) => (
                <ResidencePanel key={property.id} property={property} index={index} />
              ))}
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 z-10 h-1 bg-white/10">
              <motion.div style={{ scaleX: desktopScaleX, transformOrigin: "left" }} className="h-full bg-champagne" />
            </div>
            <p className="absolute bottom-5 left-6 z-10 text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
              Scroll to explore
            </p>
          </div>
        </section>
      )}
    </section>
  );
}
