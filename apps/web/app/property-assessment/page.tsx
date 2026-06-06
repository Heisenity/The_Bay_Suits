import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";

export default function AssessmentPage() {
  return (
    <>
      <PageHero eyebrow="Complimentary review" title="What could your property earn?" description="Share a few details and our team will prepare a no-obligation rental assessment with positioning and revenue guidance." />
      <section className="section-pad bg-linen">
        <div className="container-wide grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div><p className="eyebrow">Your assessment</p><h2 className="mt-5 font-display text-5xl">Clear potential, grounded in your market.</h2><p className="mt-6 text-sm leading-7 text-ink/55">We review location, size, furnishings, comparable inventory and seasonal demand. You will receive a realistic view of fit and opportunity, without pressure.</p></div>
          <LeadForm type="assessments" />
        </div>
      </section>
    </>
  );
}
