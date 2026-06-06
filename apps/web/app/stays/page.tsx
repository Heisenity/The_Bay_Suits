import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import { StaysClient } from "@/components/stays-client";

export const metadata = { title: "Find a Stay" };

export default function StaysPage() {
  return (
    <>
      <PageHero
        eyebrow="Vacation & extended stays"
        title="Your place in the city."
        description="Explore polished, fully furnished homes across our serviced destinations, all professionally managed by The Bay Suites."
      />
      <Suspense fallback={<div className="min-h-[500px]" />}>
        <StaysClient />
      </Suspense>
    </>
  );
}
