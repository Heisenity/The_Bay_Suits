"use client";

import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import type { Property } from "@/lib/types";
import { createBooking, getQuote } from "@/lib/api";
import { currency } from "@/lib/utils";
import { Button } from "./ui/button";

export function CheckoutForm({ property }: { property: Property }) {
  const params = useSearchParams();
  const router = useRouter();
  const checkIn = params.get("checkIn") || new Date().toISOString().slice(0, 10);
  const fallbackOut = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  const checkOut = params.get("checkOut") || fallbackOut;
  const guests = Number(params.get("guests") || 2);
  const [error, setError] = useState("");
  const { data: quote } = useQuery({
    queryKey: ["quote", property.id, checkIn, checkOut, guests],
    queryFn: () => getQuote({ propertyId: property.id, checkIn, checkOut, guests })
  });
  const booking = useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => router.push(`/booking/success?confirmation=${data.confirmation}`),
    onError: (error) => setError(error instanceof Error ? error.message : "We could not complete the booking. Please try again.")
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    booking.mutate({
      propertyId: property.id,
      checkIn,
      checkOut,
      guests,
      guestName: `${form.get("firstName")} ${form.get("lastName")}`,
      email: form.get("email"),
      phone: form.get("phone"),
      notes: form.get("notes"),
      cardNumber: form.get("cardNumber"),
      cardExpiry: form.get("cardExpiry"),
      cardCvv: form.get("cardCvv")
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1fr_420px]">
      <div>
        <h1 className="font-display text-5xl md:text-6xl">Confirm and pay</h1>
        <section className="mt-9 rounded-3xl border border-ink/10 bg-white p-6 md:p-8">
          <h2 className="font-display text-3xl">Your details</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input className="field" name="firstName" placeholder="First name" required />
            <input className="field" name="lastName" placeholder="Last name" required />
            <input className="field sm:col-span-2" name="email" type="email" placeholder="Email address" required />
            <input className="field sm:col-span-2" name="phone" type="tel" placeholder="Phone number" required />
            <textarea className="field h-28 resize-none py-3 sm:col-span-2" name="notes" placeholder="Anything we should know? (optional)" />
          </div>
        </section>
        <section className="mt-6 rounded-3xl border border-ink/10 bg-white p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl">Payment</h2>
            <span className="flex items-center gap-2 text-xs text-ink/45"><LockKeyhole className="h-3.5 w-3.5" /> Secure checkout</span>
          </div>
          <div className="mt-6 grid gap-4">
            <input className="field" name="cardNumber" placeholder="Demo card number" defaultValue="123456789" required />
            <div className="grid grid-cols-2 gap-4">
              <input className="field" name="cardExpiry" placeholder="MM / YY" defaultValue="12 / 30" required />
              <input className="field" name="cardCvv" placeholder="CVV" defaultValue="000" required />
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-ink/45">
            Demo gateway only. Use card number <strong>123456789</strong>, CVV <strong>000</strong>, and any expiry in
            <strong> MM / YY</strong> format.
          </p>
        </section>
      </div>
      <aside className="lg:pt-20">
        <div className="sticky top-28 rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
          <div className="flex gap-4 border-b border-ink/10 pb-6">
            <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl">
              <Image src={property.images[0]} alt={property.name} fill className="object-cover" />
            </div>
            <div><p className="text-xs text-ink/45">{property.location}</p><h3 className="mt-1 font-display text-2xl font-semibold">{property.name}</h3><p className="mt-2 text-xs">★ {property.rating}</p></div>
          </div>
          <div className="border-b border-ink/10 py-6 text-sm">
            <div className="flex justify-between"><span>Dates</span><strong>{checkIn} → {checkOut}</strong></div>
            <div className="mt-3 flex justify-between"><span>Guests</span><strong>{guests}</strong></div>
          </div>
          <div className="space-y-3 py-6 text-sm">
            <div className="flex justify-between"><span>{currency(quote?.nightlyRate || property.price)} × {quote?.nights || "..."} nights</span><span>{quote ? currency(quote.accommodation) : "..."}</span></div>
            <div className="flex justify-between"><span>Cleaning fee</span><span>{quote ? currency(quote.cleaningFee) : "..."}</span></div>
            <div className="flex justify-between"><span>Guest service fee</span><span>{quote ? currency(quote.serviceFee) : "..."}</span></div>
            <div className="flex justify-between"><span>Taxes</span><span>{quote ? currency(quote.tax) : "..."}</span></div>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-5 text-lg font-bold"><span>Total CAD</span><span>{quote ? currency(quote.total) : "..."}</span></div>
          {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</p>}
          <Button type="submit" disabled={booking.isPending || !quote} className="mt-6 w-full rounded-xl py-4">
            {booking.isPending ? "Confirming..." : "Confirm booking"}
          </Button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-ink/45"><ShieldCheck className="h-4 w-4 text-champagne" /> Protected by The Bay Suites</p>
        </div>
      </aside>
    </form>
  );
}
