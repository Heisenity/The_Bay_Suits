"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Star } from "lucide-react";
import type { Property } from "@/lib/types";
import { Button } from "./ui/button";
import { currency } from "@/lib/utils";

export function BookingPanel({ property }: { property: Property }) {
  const router = useRouter();
  const today = new Date();
  const later = new Date(today);
  later.setDate(today.getDate() + 3);
  const [checkIn, setCheckIn] = useState(today.toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState(later.toISOString().slice(0, 10));
  const [guests, setGuests] = useState("2");

  function submit(event: FormEvent) {
    event.preventDefault();
    router.push(`/checkout/${property.slug}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  }

  return (
    <form onSubmit={submit} className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft">
      <div className="flex items-end justify-between">
        <p><strong className="text-2xl">{currency(property.price)}</strong> <span className="text-sm text-ink/50">night</span></p>
        <p className="flex items-center gap-1 text-xs font-bold"><Star className="h-3.5 w-3.5 fill-champagne text-champagne" /> {property.rating} · {property.reviews} reviews</p>
      </div>
      <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-xl border border-ink/15">
        <label className="border-r border-ink/15 p-3">
          <span className="block text-[9px] font-bold uppercase tracking-[.14em]">Check in</span>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 w-full bg-transparent text-xs outline-none" required />
        </label>
        <label className="p-3">
          <span className="block text-[9px] font-bold uppercase tracking-[.14em]">Check out</span>
          <input type="date" min={checkIn} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1 w-full bg-transparent text-xs outline-none" required />
        </label>
        <label className="col-span-2 border-t border-ink/15 p-3">
          <span className="block text-[9px] font-bold uppercase tracking-[.14em]">Guests</span>
          <select value={guests} onChange={(e) => setGuests(e.target.value)} className="mt-1 w-full bg-transparent text-xs outline-none">
            {Array.from({ length: property.guests }, (_, i) => i + 1).map((count) => <option key={count}>{count}</option>)}
          </select>
        </label>
      </div>
      <Button type="submit" className="mt-4 w-full rounded-xl">Check availability</Button>
      <p className="mt-4 text-center text-xs text-ink/45">You won&apos;t be charged yet.</p>
    </form>
  );
}
