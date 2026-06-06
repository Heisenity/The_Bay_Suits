import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { DeferredOwnerExperience } from "@/components/deferred-owner-experience";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OwnersPage() {
  const points = ["Dynamic pricing and channel distribution", "Guest communication and screening", "Cleaning, maintenance and inspections", "Transparent owner reporting", "Dedicated local support"];
  return (
    <>
      <PageHero eyebrow="For property owners" title="More return. Less to manage." description="A hands-on management partner for furnished rental owners across our growing international network." />
      <section className="section-pad">
        <div className="container-wide grid items-center gap-14 lg:grid-cols-2">
          <div className="relative min-h-[560px] overflow-hidden rounded-[2rem]"><Image src="/images/suite-7.jpg" alt="Professionally managed furnished property" fill className="object-cover" /></div>
          <div>
            <p className="eyebrow">End-to-end management</p>
            <h2 className="mt-5 font-display text-5xl leading-none md:text-7xl">Your property, operating at its best.</h2>
            <p className="mt-7 text-base leading-8 text-ink/55">We combine hospitality operations, market intelligence and local care to build a stronger rental experience for owners and guests alike.</p>
            <div className="mt-8 space-y-4">{points.map((point) => <p key={point} className="flex items-center gap-3 text-sm"><span className="grid h-7 w-7 place-items-center rounded-full bg-linen"><Check className="h-3.5 w-3.5 text-champagne" /></span>{point}</p>)}</div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/property-assessment" className={cn(buttonVariants({ size: "lg" }))}>Get a free assessment <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/owner-portal" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>Admin sign in</Link>
            </div>
          </div>
        </div>
      </section>
      <DeferredOwnerExperience />
    </>
  );
}
