import Image from "next/image";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Check, MapPin, ShieldCheck, Sparkles, Users, Wifi } from "lucide-react";
import { getProperty } from "@/lib/api";
import { BookingPanel } from "@/components/booking-panel";

const BookingCalendarPreview = dynamic(
  () => import("@/components/booking-calendar-preview").then((module) => module.BookingCalendarPreview)
);

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();

  return (
    <>
      <section className="container-wide px-5 pb-10 pt-10 md:px-10 lg:px-16">
        <p className="flex items-center gap-2 text-xs text-ink/50"><MapPin className="h-3.5 w-3.5 text-champagne" /> {property.location}</p>
        <h1 className="mt-3 font-display text-5xl leading-none md:text-7xl">{property.name}</h1>
        <div className="mt-7 grid gap-2 overflow-hidden rounded-[1.75rem] md:grid-cols-2">
          <div className="relative aspect-[4/3] md:min-h-[560px] md:aspect-auto"><Image src={property.images[0]} alt={property.name} fill priority className="object-cover" /></div>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1 md:grid-rows-2">
            <div className="relative aspect-[4/3] md:aspect-auto"><Image src={property.images[1]} alt="" fill className="object-cover" /></div>
            <div className="relative aspect-[4/3] md:aspect-auto"><Image src={property.images[2]} alt="" fill className="object-cover" /></div>
          </div>
        </div>
      </section>
      <section className="container-wide grid gap-10 px-5 pb-24 md:px-10 lg:grid-cols-[1fr_380px] lg:gap-14 lg:px-16">
        <div>
          <div className="flex flex-wrap gap-6 border-b border-ink/10 pb-8 text-sm">
            <span className="flex items-center gap-2"><Users className="h-4 w-4" /> {property.guests} guests</span>
            <span className="flex items-center gap-2"><BedDouble className="h-4 w-4" /> {property.bedrooms} bedrooms</span>
            <span className="flex items-center gap-2"><Bath className="h-4 w-4" /> {property.bathrooms} bathrooms</span>
          </div>
          <div className="py-9">
            <h2 className="font-display text-4xl">About this residence</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-ink/60">{property.description}</p>
          </div>
          <div className="border-t border-ink/10 py-9">
            <h2 className="font-display text-4xl">What this place offers</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {property.amenities.map((amenity) => <p key={amenity} className="flex items-center gap-3 text-sm"><Check className="h-4 w-4 text-champagne" /> {amenity}</p>)}
            </div>
          </div>
          <BookingCalendarPreview propertyId={property.id} />
          <div className="grid gap-3 border-t border-ink/10 py-9 sm:grid-cols-3">
            {[
              [ShieldCheck, "Secure booking", "Protected reservation flow"],
              [Sparkles, "Prepared stay", "Cleaned and quality checked"],
              [Wifi, "Connected", "Wi-Fi and guest support"]
            ].map(([Icon, title, text]) => (
              <div key={title as string} className="rounded-2xl border border-ink/10 bg-white p-5">
                <Icon className="h-5 w-5 text-champagne" />
                <strong className="mt-4 block text-sm">{title as string}</strong>
                <p className="mt-1 text-xs leading-5 text-ink/45">{text as string}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 rounded-2xl bg-linen p-6 sm:flex-row">
            <ShieldCheck className="h-7 w-7 shrink-0 text-champagne" />
            <div><h3 className="font-bold">The Bay Suites promise</h3><p className="mt-2 text-sm leading-6 text-ink/55">Professionally cleaned, quality inspected and backed by responsive guest support throughout your stay.</p></div>
          </div>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start"><BookingPanel property={property} /></aside>
      </section>
    </>
  );
}
