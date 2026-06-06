import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, KeyRound } from "lucide-react";
import { HomeHero } from "@/components/home-hero";
import { MarqueeBand } from "@/components/marquee-band";
import { PropertyCard } from "@/components/property-card";
import { ProofStrip } from "@/components/proof-strip";
import { DistributionNetwork } from "@/components/distribution-network";
import { Reveal } from "@/components/reveal";
import { StayStandard } from "@/components/stay-standard";
import { properties, services, testimonials } from "@/lib/data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <MarqueeBand />

      <section id="curated-stays" className="section-pad bg-[#fbfaf7]">
        <div className="container-wide">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <Reveal>
              <p className="eyebrow">Curated stays</p>
              <h2 className="mt-4 max-w-2xl font-display text-5xl leading-none md:text-7xl">
                A better way to feel at home.
              </h2>
            </Reveal>
            <Reveal delay={0.12} className="max-w-md">
              <p className="text-sm leading-7 text-ink/55">
              Every residence is inspected, professionally prepared and supported around the
              clock. The result is a stay that feels simple from the first click.
              </p>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-7 lg:grid-cols-3">
            {properties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/stays" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              View all residences <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <ProofStrip />
      <StayStandard />
      <DistributionNetwork />

      <section className="section-pad">
        <div className="container-wide">
          <Reveal className="text-center">
            <p className="eyebrow">One team, every stay</p>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-5xl leading-none md:text-7xl">
              Hospitality for guests. Performance for owners.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {services.map((service, index) => {
              const icons = [KeyRound, Building2, BadgeCheck];
              const Icon = icons[index];
              return (
                <Reveal
                  key={service.title}
                  delay={index * 0.08}
                  className="group rounded-[1.75rem] border border-ink/10 bg-white p-8 transition duration-500 hover:-translate-y-2 hover:border-champagne/60 hover:shadow-soft"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-linen text-ink transition duration-500 group-hover:rotate-6 group-hover:bg-champagne">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-8 font-display text-3xl font-semibold">{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-ink/55">{service.text}</p>
                  <Link
                    href={index === 1 ? "/corporate-rentals" : index === 2 ? "/owners" : "/stays"}
                    className="mt-7 inline-flex items-center gap-2 text-sm font-bold"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad bg-linen">
        <div className="container-wide">
          <Reveal><p className="eyebrow text-center">Guest notes</p></Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.author} delay={index * 0.08}>
              <figure className="group h-full rounded-[1.75rem] bg-white p-8 transition duration-500 hover:-translate-y-1 hover:shadow-soft md:p-10">
                <div className="text-champagne">★★★★★</div>
                <blockquote className="mt-6 font-display text-2xl leading-9">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-8 text-xs font-bold uppercase tracking-[0.12em] text-ink/50">
                  {testimonial.author} · {testimonial.stay}
                </figcaption>
              </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-champagne px-5 py-28 text-center md:px-10">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/10" />
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/10" />
        <Reveal className="relative mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.26em]">Your next stay starts here</p>
          <h2 className="mt-5 font-display text-6xl leading-none md:text-8xl">Make yourself at home.</h2>
          <Link href="/stays" className={cn(buttonVariants({ size: "lg" }), "mt-9")}>
            Find your suite <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
