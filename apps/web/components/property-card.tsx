"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BedDouble, MapPin, Star, Users } from "lucide-react";
import type { Property } from "@/lib/types";
import { currency } from "@/lib/utils";

type PropertyCardProps = {
  property: Property;
  active?: boolean;
  onHoverStart?: (propertyId: string) => void;
  onHoverEnd?: () => void;
};

export function PropertyCard({ property, active = false, onHoverStart, onHoverEnd }: PropertyCardProps) {
  return (
    <motion.article
      onMouseEnter={() => onHoverStart?.(property.id)}
      onMouseLeave={() => onHoverEnd?.()}
      onFocusCapture={() => onHoverStart?.(property.id)}
      onBlurCapture={() => onHoverEnd?.()}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`group overflow-hidden rounded-[1.75rem] bg-white shadow-[0_12px_45px_rgba(15,31,53,.08)] transition-all duration-500 hover:shadow-[0_28px_80px_rgba(15,31,53,.16)] ${
        active ? "ring-1 ring-champagne/80 shadow-[0_28px_80px_rgba(201,177,124,.18)]" : ""
      }`}
    >
      <Link href={`/stays/${property.slug}`} className="relative block aspect-[1.35] overflow-hidden">
        <motion.div
          initial={{ clipPath: "inset(0 0 14% 0)", scale: 1.05 }}
          whileInView={{ clipPath: "inset(0 0 0% 0)", scale: 1 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={property.images[0]}
            alt={property.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        </motion.div>
        <div className={`absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent transition duration-500 ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
        <span className="absolute bottom-4 right-4 grid h-16 w-16 translate-y-5 place-items-center rounded-full bg-champagne text-[10px] font-bold uppercase tracking-[.1em] text-ink opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          Explore
        </span>
        {property.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]">
            Guest favourite
          </span>
        )}
      </Link>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs text-ink/50">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-champagne" /> <span className="truncate">{property.location}</span>
            </p>
            <h3 className="mt-2 line-clamp-2 font-display text-[1.9rem] font-semibold leading-tight sm:text-3xl">{property.name}</h3>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold">
            <Star className="h-3.5 w-3.5 fill-champagne text-champagne" /> {property.rating}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-ink/55">{property.shortDescription}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-5 text-xs text-ink/60 sm:gap-5">
          <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4" /> {property.bedrooms} bed</span>
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {property.guests} guests</span>
          <span className="basis-full pt-1 sm:ml-auto sm:basis-auto sm:pt-0">
            <strong className="text-base text-ink">{currency(property.price)}</strong> / night
          </span>
        </div>
        <Link
          href={`/stays/${property.slug}`}
          className={`mt-5 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
            active ? "bg-ink text-white" : "bg-linen group-hover:bg-ink group-hover:text-white"
          }`}
        >
          View suite <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}
