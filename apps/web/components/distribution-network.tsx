import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";

const channels = [
  { name: "airbnb", className: "font-semibold tracking-[-0.05em] text-[#ff5a5f]" },
  { name: "Expedia.", className: "font-bold tracking-[-0.06em] text-[#172554]" },
  { name: "Booking.com", className: "font-bold tracking-[-0.06em] text-[#006ce4]" },
  { name: "CANADASTAYS", className: "font-medium tracking-[-0.04em] text-[#55575b]" },
  { name: "Hotels.com", className: "font-semibold tracking-[-0.05em] text-[#e51b35]" },
  { name: "Vrbo", className: "font-bold italic tracking-[-0.08em] text-[#315eb5]" },
  { name: "agoda", className: "font-medium tracking-[0.18em] text-[#5a5a5a]" }
];

export function DistributionNetwork() {
  return (
    <section className="overflow-hidden border-b border-ink/10 bg-[#f1efed] px-5 py-20 md:px-10 md:py-28 lg:px-16">
      <div className="container-wide">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <p className="eyebrow">Property distribution</p>
            <h2 className="mt-4 max-w-5xl font-display text-5xl leading-[0.98] md:text-7xl">
              Be everywhere guests are looking.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <Link
              href="/owners"
              className="group inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-bold"
            >
              Explore owner services
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white sm:grid-cols-3 lg:grid-cols-7">
          {channels.map((channel, index) => (
            <Reveal
              key={channel.name}
              delay={index * 0.05}
              className={`group flex min-h-28 items-center justify-center border-b border-r border-ink/10 px-4 transition duration-500 hover:bg-ink sm:min-h-32 lg:border-b-0 ${
                index === channels.length - 1 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <span
                className={`text-center text-xl transition duration-500 group-hover:scale-105 group-hover:text-white md:text-2xl ${channel.className}`}
              >
                {channel.name}
              </span>
            </Reveal>
          ))}
        </div>
        <p className="mt-5 max-w-2xl text-xs leading-6 text-ink/45">
          Multi-channel exposure helps qualified guests discover professionally managed Bay Suites
          properties across leading travel platforms.
        </p>
      </div>
    </section>
  );
}
