import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ confirmation?: string }> }) {
  const { confirmation = "TBS-PENDING" } = await searchParams;
  return (
    <section className="grid min-h-[70vh] place-items-center bg-linen px-5 py-20">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-soft md:p-14">
        <CheckCircle2 className="mx-auto h-16 w-16 text-champagne" strokeWidth={1.5} />
        <p className="eyebrow mt-7">Reservation confirmed</p>
        <h1 className="mt-4 font-display text-5xl md:text-6xl">Your suite is waiting.</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-ink/55">
          A full confirmation has been sent to your email. Your guest portal will hold arrival
          details, receipts and direct access to our support team.
        </p>
        <div className="mx-auto mt-7 max-w-sm rounded-2xl bg-linen p-4">
          <span className="block text-[10px] font-bold uppercase tracking-[.16em] text-ink/40">Confirmation</span>
          <strong className="mt-1 block text-xl tracking-[.08em]">{confirmation}</strong>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/portal?confirmation=${confirmation}`} className={cn(buttonVariants({ size: "lg" }))}><MessageCircle className="h-4 w-4" /> Open guest portal</Link>
          <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>Back to home</Link>
        </div>
      </div>
    </section>
  );
}
