import Link from "next/link";
import { ArrowRight, CalendarClock, CircleDollarSign, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Cancellation Policy" };

const details = [
  {
    icon: CalendarClock,
    title: "After reservation",
    text: "Unless a different rate policy is shown before checkout, cancelling a confirmed reservation will result in a charge equal to 50% of the total reservation price."
  },
  {
    icon: CircleDollarSign,
    title: "No-shows",
    text: "If the guest does not arrive and has not cancelled the reservation, the full reservation price will be charged."
  },
  {
    icon: MessageCircle,
    title: "Need to make a change?",
    text: "Contact our guest team as early as possible. Date changes and extensions depend on availability and the terms attached to your booking."
  }
];

export default function CancellationPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Booking terms"
        title="Cancellation policy."
        description="Clear terms, thoughtful support, and no surprises when plans change."
      />
      <section className="section-pad bg-[#fbfaf7]">
        <div className="container-wide">
          <div className="grid gap-5 lg:grid-cols-3">
            {details.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-[1.75rem] border border-ink/10 bg-white p-8 md:p-10">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-linen text-ink">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-8 font-display text-3xl">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-ink/55">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-[2rem] bg-ink p-8 text-white md:flex md:items-center md:justify-between md:p-12">
            <div>
              <p className="eyebrow">Reservation-specific help</p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl leading-none md:text-5xl">
                Have your confirmation number ready.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">
                The exact cancellation terms shown during checkout and in your confirmation remain
                the terms that apply to your reservation.
              </p>
            </div>
            <Link
              href="/portal"
              className={cn(buttonVariants({ variant: "gold", size: "lg" }), "mt-8 shrink-0 md:mt-0")}
            >
              Open guest portal <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
