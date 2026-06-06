import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CalendarCheck,
  Camera,
  Check,
  Headphones,
  Layers3,
  Mail,
  MapPin,
  Paintbrush,
  Phone,
  ShieldCheck,
  Sparkles,
  Wrench
} from "lucide-react";
import { ServiceInquiryForm } from "@/components/service-inquiry-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fullService = [
  "Multi-platform listing and reservation management",
  "24/7 guest communication and issue resolution",
  "Dynamic pricing and calendar strategy",
  "Guest screening and reservation oversight",
  "Cleaning and maintenance coordination",
  "Design, layout and staging consultation",
  "Household essentials and stay-ready supplies"
];

const virtualService = [
  "Multi-platform listing management",
  "24/7 virtual guest communication",
  "Dynamic pricing and calendar strategy",
  "Guest screening and reservation oversight",
  "Cleaning and maintenance scheduling"
];

const operations = [
  {
    icon: Layers3,
    number: "01",
    title: "Listing",
    text: "We create polished listing copy and coordinate professional photography, then distribute the property across major booking channels for broader reach."
  },
  {
    icon: Headphones,
    number: "02",
    title: "24/7 guest team",
    text: "Experienced guest-service specialists handle questions, requests and escalations before, during and after each reservation."
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Dynamic pricing",
    text: "Rates respond to demand, seasonality and local events. Frequent updates help improve visibility while protecting revenue opportunities."
  },
  {
    icon: Sparkles,
    number: "04",
    title: "Cleaning",
    text: "Professional turnover teams follow a consistent quality standard with linen preparation, replenishment and arrival-ready inspections."
  },
  {
    icon: Paintbrush,
    number: "05",
    title: "Design & staging",
    text: "Practical design guidance helps create a warm, durable and photogenic space that highlights the property's strongest features."
  }
];

export const metadata = {
  title: "Owner Services",
  description: "Full-service and virtual hosting solutions from The Bay Suites."
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image
          src="/images/suite-7.jpg"
          alt="Professionally managed furnished residence"
          fill
          priority
          className="-z-20 object-cover opacity-35"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/40" />
        <div className="container-wide px-5 py-24 md:px-10 md:py-32 lg:px-16 lg:py-36">
          <p className="eyebrow">Owner services</p>
          <h1 className="mt-6 max-w-5xl font-display text-6xl leading-[.9] tracking-[-.03em] md:text-8xl lg:text-[7rem]">
            Hosting handled.
            <br />
            Potential unlocked.
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/65 md:text-lg">
            Choose complete local management or a focused virtual service. Either way, your
            property benefits from professional distribution, pricing, guest care and operational
            discipline.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#plans" className={cn(buttonVariants({ variant: "gold", size: "lg" }))}>
              Compare plans <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#contact" className="inline-flex items-center rounded-full border border-white/25 px-8 py-4 text-sm font-semibold transition hover:bg-white hover:text-ink">
              Request a consultation
            </a>
          </div>
          <div className="mt-14 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              [CalendarCheck, "Always-on", "Reservation oversight"],
              [ShieldCheck, "Screened", "Guest protection"],
              [BadgeCheck, "Professional", "Local standards"]
            ].map(([Icon, title, text]) => (
              <div key={title as string} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-champagne" />
                <strong className="mt-4 block text-sm">{title as string}</strong>
                <span className="mt-1 block text-xs text-white/45">{text as string}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="section-pad bg-[#fbfaf7]">
        <div className="container-wide">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow">Choose your level of support</p>
              <h2 className="mt-5 max-w-3xl font-display text-5xl leading-none md:text-7xl">
                Two clear ways to host.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-ink/55">
              Both plans cover the digital work that drives reservations. Full Service adds
              local cleaning, maintenance, supplies and presentation support.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <article className="relative h-full overflow-hidden rounded-[2rem] bg-ink p-7 pb-32 text-white shadow-soft md:p-10 md:pb-32">
              <div className="absolute right-0 top-0 h-48 w-48 rounded-bl-full bg-champagne/10" />
              <div className="relative">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <span className="rounded-full bg-champagne px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-ink">Most comprehensive</span>
                    <h3 className="mt-6 font-display text-5xl">Full Service Host</h3>
                  </div>
                  <div className="text-right"><strong className="font-display text-6xl text-champagne">20%</strong><span className="block text-[10px] uppercase tracking-[.13em] text-white/40">Commission</span></div>
                </div>
                <p className="mt-6 max-w-xl text-sm leading-7 text-white/55">
                  A complete hands-off hosting solution covering listing, guests, revenue,
                  cleaning, maintenance, staging and everyday property readiness.
                </p>
                <div className="mt-8 space-y-4 border-t border-white/10 pt-8">
                  {fullService.map((item) => <p key={item} className="flex items-start gap-3 text-sm"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-champagne text-ink"><Check className="h-3 w-3" /></span>{item}</p>)}
                </div>
              </div>
              <a href="#contact" className={cn(buttonVariants({ variant: "gold", size: "lg" }), "absolute bottom-7 left-7 right-7 md:bottom-10 md:left-10 md:right-10")}>Choose full service <ArrowRight className="h-4 w-4" /></a>
            </article>

            <article className="relative h-full rounded-[2rem] border border-ink/10 bg-white p-7 pb-32 shadow-[0_18px_60px_rgba(15,31,53,.08)] md:p-10 md:pb-32">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <span className="rounded-full bg-linen px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-ink/55">Digital management</span>
                  <h3 className="mt-6 font-display text-5xl">Virtual Service Host</h3>
                </div>
                <div className="text-right"><strong className="font-display text-6xl text-ink">10%</strong><span className="block text-[10px] uppercase tracking-[.13em] text-ink/40">Commission</span></div>
              </div>
              <p className="mt-6 max-w-xl text-sm leading-7 text-ink/55">
                Professional remote management for owners who already have reliable local
                cleaning and maintenance resources in place.
              </p>
              <div className="mt-8 space-y-4 border-t border-ink/10 pt-8">
                {virtualService.map((item) => <p key={item} className="flex items-start gap-3 text-sm"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-linen"><Check className="h-3 w-3 text-champagne" /></span>{item}</p>)}
              </div>
              <a href="#contact" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "absolute bottom-7 left-7 right-7 md:bottom-10 md:left-10 md:right-10")}>Choose virtual service <ArrowRight className="h-4 w-4" /></a>
            </article>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-linen">
        <div className="container-wide grid lg:grid-cols-[.85fr_1.15fr]">
          <div className="relative min-h-[520px] lg:min-h-full">
            <Image src="/images/suite-5.jpg" alt="Suite prepared for guests" fill className="object-cover" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 p-5 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-champagne">Broad distribution</p>
              <p className="mt-2 font-display text-2xl">Airbnb, Booking.com, Expedia, Vrbo and more.</p>
            </div>
          </div>
          <div className="px-5 py-20 md:px-12 lg:px-16 lg:py-28">
            <p className="eyebrow">How we operate</p>
            <h2 className="mt-5 font-display text-5xl leading-none md:text-7xl">Every detail has an owner.</h2>
            <div className="mt-10 divide-y divide-ink/10">
              {operations.map(({ icon: Icon, number, title, text }) => (
                <article key={title} className="grid gap-4 py-7 sm:grid-cols-[46px_1fr]">
                  <span className="text-xs font-bold text-champagne">{number}</span>
                  <div>
                    <div className="flex items-center gap-3"><Icon className="h-5 w-5 text-champagne" /><h3 className="font-display text-3xl">{title}</h3></div>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-ink/55">{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <div className="text-center">
            <p className="eyebrow">Built for stronger stays</p>
            <h2 className="mx-auto mt-5 max-w-3xl font-display text-5xl leading-none md:text-7xl">Professional presentation. Responsive operations.</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [Camera, "Market-ready content", "Professional imagery and clear listing language designed to communicate value quickly."],
              [Wrench, "Coordinated upkeep", "Maintenance issues are identified, routed and followed through with guest comfort in mind."],
              [ShieldCheck, "Thoughtful screening", "Reservation review and guest screening add another layer of care around your property."]
            ].map(([Icon, title, text]) => (
              <article key={title as string} className="rounded-[1.75rem] border border-ink/10 bg-white p-8">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-linen"><Icon className="h-5 w-5 text-champagne" /></span>
                <h3 className="mt-7 font-display text-3xl">{title as string}</h3>
                <p className="mt-4 text-sm leading-7 text-ink/55">{text as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section-pad bg-ink text-white">
        <div className="container-wide grid items-start gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Start a conversation</p>
            <h2 className="mt-5 font-display text-5xl leading-none md:text-7xl">Let&apos;s build the right hosting plan.</h2>
            <p className="mt-7 max-w-lg text-sm leading-7 text-white/55">
              Share a few property details and our rental or sales team will discuss fit,
              preparation, launch timing and the best service model for your goals.
            </p>
            <div className="mt-9 space-y-5 text-sm text-white/65">
              <a href="tel:+18777211311" className="flex items-center gap-3 hover:text-white"><Phone className="h-4 w-4 text-champagne" /> +1 (877) 721-1311</a>
              <a href="mailto:admin@thebaysuites.com" className="flex items-center gap-3 hover:text-white"><Mail className="h-4 w-4 text-champagne" /> admin@thebaysuites.com</a>
              <p className="flex items-start gap-3"><MapPin className="mt-1 h-4 w-4 shrink-0 text-champagne" /><span>67 Mowat Ave, Toronto, ON M6K 3E3, Canada</span></p>
              <p className="flex items-start gap-3"><MapPin className="mt-1 h-4 w-4 shrink-0 text-champagne" /><span>Unit 1501, 15th Floor, Bengal Eco Intelligent Park, EM-3, Sector V, Salt Lake City, Kolkata 700091</span></p>
            </div>
            <Link href="/property-assessment" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-champagne">Prefer the short assessment form? <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <ServiceInquiryForm />
        </div>
      </section>
    </>
  );
}
