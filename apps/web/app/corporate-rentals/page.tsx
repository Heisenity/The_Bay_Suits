import Image from "next/image";
import { BriefcaseBusiness, CalendarClock, FileText, UsersRound } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";

export default function CorporatePage() {
  const benefits = [
    [CalendarClock, "Flexible terms", "Stay for weeks or months, with straightforward extension support."],
    [FileText, "Consolidated billing", "Clear invoicing and one point of contact for your organization."],
    [UsersRound, "Team-ready inventory", "Place one employee or coordinate accommodation for a full project team."],
    [BriefcaseBusiness, "Work-from-home comfort", "Reliable Wi-Fi, practical workspaces and fully equipped kitchens."]
  ];
  return (
    <>
      <PageHero eyebrow="Corporate housing" title="Business travel that feels less temporary." description="Fully furnished, professionally managed homes for relocations, assignments, production teams and insurance stays." />
      <section className="section-pad">
        <div className="container-wide grid items-center gap-14 lg:grid-cols-2">
          <div><p className="eyebrow">Built around your team</p><h2 className="mt-5 font-display text-5xl leading-none md:text-7xl">One partner from arrival to extension.</h2><p className="mt-7 text-base leading-8 text-ink/55">We make accommodation easier for coordinators and more comfortable for guests, with responsive local support and homes people can actually settle into.</p><div className="mt-9 grid gap-6 sm:grid-cols-2">{benefits.map(([Icon, title, text]) => <div key={title as string}><Icon className="h-5 w-5 text-champagne" /><h3 className="mt-3 font-bold">{title as string}</h3><p className="mt-2 text-xs leading-6 text-ink/50">{text as string}</p></div>)}</div></div>
          <div className="relative min-h-[620px] overflow-hidden rounded-[2rem]"><Image src="/images/suite-2.jpg" alt="Corporate furnished suite" fill className="object-cover" /></div>
        </div>
      </section>
      <section className="section-pad bg-linen">
        <div className="container-wide grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div><p className="eyebrow">Plan a stay</p><h2 className="mt-5 font-display text-5xl">Tell us what your team needs.</h2><p className="mt-5 text-sm leading-7 text-ink/55">Share dates, location, headcount and any billing requirements. A corporate stay specialist will respond with suitable options.</p></div>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
