import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProperty } from "@/lib/api";
import { CheckoutForm } from "@/components/checkout-form";

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();
  return (
    <section className="section-pad bg-linen">
      <div className="container-wide">
        <Suspense fallback={<div className="min-h-[700px]" />}>
          <CheckoutForm property={property} />
        </Suspense>
      </div>
    </section>
  );
}
