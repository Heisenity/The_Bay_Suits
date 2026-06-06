import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { areas } from "@/lib/data";

export default function ServiceAreasPage() {
  return (
    <>
      <PageHero eyebrow="Where we operate" title="Local care across growing markets." description="Responsive hospitality operations across Canada, the United States and India, with Bangladesh joining our expanding network next." />
      <section className="section-pad">
        <div className="container-wide grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, index) => (
            <Link key={area} href={`/stays?area=${encodeURIComponent(area.replace("Downtown ", ""))}`} className="group flex min-h-56 flex-col justify-between rounded-[1.75rem] border border-ink/10 bg-white p-7 transition hover:-translate-y-1 hover:bg-ink hover:text-white">
              <div className="flex items-start justify-between"><MapPin className="h-6 w-6 text-champagne" /><span className="text-xs text-ink/30 group-hover:text-white/30">0{index + 1}</span></div>
              <div><h2 className="font-display text-4xl">{area}</h2><p className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-ink/45 group-hover:text-white/55">View residences <ArrowUpRight className="h-4 w-4" /></p></div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
