"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function StayError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Stay page error", error);
  }, [error]);

  return (
    <section className="container-wide px-5 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-ink/10 bg-white p-8 text-center shadow-soft md:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne">Stay preview unavailable</p>
        <h1 className="mt-4 font-display text-4xl leading-none md:text-6xl">We couldn&apos;t open this residence just now.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-ink/55 md:text-base">
          The property details are being refreshed. Please try again, or return to the stay collection and choose another suite.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={reset} className="rounded-xl">
            Try again
          </Button>
          <Link
            href="/stays"
            className="inline-flex items-center justify-center rounded-xl border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-linen"
          >
            Back to stays
          </Link>
        </div>
      </div>
    </section>
  );
}
