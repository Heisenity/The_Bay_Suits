"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BedDouble, MapPin, Star, Users } from "lucide-react";
import type { Property } from "@/lib/types";
import { currency } from "@/lib/utils";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <motion.article
      className="group overflow-hidden rounded-[1.75rem] bg-white shadow-[0_12px_45px_rgba(15,31,53,.08)] transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(15,31,53,.16)]"
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
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
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
          <div>
            <p className="flex items-center gap-1.5 text-xs text-ink/50">
              <MapPin className="h-3.5 w-3.5 text-champagne" /> {property.location}
            </p>
            <h3 className="mt-2 font-display text-3xl font-semibold">{property.name}</h3>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold">
            <Star className="h-3.5 w-3.5 fill-champagne text-champagne" /> {property.rating}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-ink/55">{property.shortDescription}</p>
        <div className="mt-5 flex items-center gap-5 border-t border-ink/10 pt-5 text-xs text-ink/60">
          <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4" /> {property.bedrooms} bed</span>
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {property.guests} guests</span>
          <span className="ml-auto">
            <strong className="text-base text-ink">{currency(property.price)}</strong> / night
          </span>
        </div>
        <Link
          href={`/stays/${property.slug}`}
          className="mt-5 flex items-center justify-between rounded-xl bg-linen px-4 py-3 text-sm font-semibold transition group-hover:bg-ink group-hover:text-white"
        >
          View suite <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}
