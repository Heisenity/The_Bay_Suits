"use client";

import { FormEvent, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { submitLead } from "@/lib/api";
import { Button } from "./ui/button";

export function LeadForm({ type = "contacts" }: { type?: "contacts" | "assessments" }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement | null>(null);
  const isAssessment = type === "assessments";
  const totalSteps = isAssessment ? 3 : 1;

  function nextStep() {
    const current = formRef.current?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const fields = Array.from(current?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea") || []);
    const invalid = fields.find((field) => !field.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      return;
    }
    setStep((value) => Math.min(totalSteps - 1, value + 1));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    try {
      const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
      await submitLead(type, payload);
      event.currentTarget.reset();
      setStep(0);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form ref={formRef} onSubmit={submit} className="rounded-[1.75rem] bg-white p-6 shadow-soft md:p-9">
      {isAssessment && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[.13em] text-ink/40">
            <span>Property assessment</span>
            <span>Step {step + 1} of {totalSteps}</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-linen">
            <div className="h-full rounded-full bg-champagne transition-[width] duration-500" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
          </div>
        </div>
      )}

      <div data-step="0" className={step === 0 ? "grid gap-4 sm:grid-cols-2" : "hidden"}>
        <div className="sm:col-span-2">
          <p className="eyebrow">About you</p>
          <h3 className="mt-3 font-display text-4xl">{isAssessment ? "Where should we send your review?" : "Tell us how we can help."}</h3>
        </div>
        <input className="field" name="firstName" placeholder="First name" required />
        <input className="field" name="lastName" placeholder="Last name" required />
        <input className="field sm:col-span-2" name="email" type="email" placeholder="Email address" required />
        <input className="field sm:col-span-2" name="phone" type="tel" placeholder="Phone number" />
        {!isAssessment && <textarea className="field h-32 resize-none py-3 sm:col-span-2" name="message" placeholder="Tell us a little more" />}
      </div>

      {isAssessment && (
        <>
          <div data-step="1" className={step === 1 ? "grid gap-4 sm:grid-cols-2" : "hidden"}>
            <div className="sm:col-span-2">
              <p className="eyebrow">The property</p>
              <h3 className="mt-3 font-display text-4xl">A few practical details.</h3>
            </div>
            <input className="field sm:col-span-2" name="address" placeholder="Property address" required />
            <select className="field" name="propertyType" defaultValue="" required>
              <option value="" disabled>Property type</option>
              <option>Condo</option><option>House</option><option>Townhome</option><option>Multiple units</option>
            </select>
            <select className="field" name="bedrooms" defaultValue="" required>
              <option value="" disabled>Bedrooms</option>
              <option>Studio</option><option>1 bedroom</option><option>2 bedrooms</option><option>3 bedrooms</option><option>4+ bedrooms</option>
            </select>
            <select className="field sm:col-span-2" name="propertyStatus" defaultValue="">
              <option value="" disabled>Current property status</option>
              <option>Ready to host</option><option>Needs furnishing</option><option>Currently listed</option><option>Still planning</option>
            </select>
          </div>

          <div data-step="2" className={step === 2 ? "grid gap-4" : "hidden"}>
            <div>
              <p className="eyebrow">Your goals</p>
              <h3 className="mt-3 font-display text-4xl">What would a good outcome look like?</h3>
            </div>
            <select className="field" name="serviceInterest" defaultValue="" required>
              <option value="" disabled>What do you need most?</option>
              <option>Full-service property management</option>
              <option>Virtual hosting support</option>
              <option>Revenue and listing assessment</option>
              <option>Not sure yet</option>
            </select>
            <textarea className="field h-32 resize-none py-3" name="message" placeholder="Share your target launch date, revenue goals, or current challenges." />
          </div>
        </>
      )}

      <div className="mt-6 flex gap-3">
        {isAssessment && step > 0 && (
          <Button type="button" variant="outline" onClick={() => setStep((value) => value - 1)} className="rounded-xl">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        )}
        {isAssessment && step < totalSteps - 1 ? (
          <Button type="button" onClick={nextStep} className="flex-1 rounded-xl py-4">
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" className="flex-1 rounded-xl py-4" disabled={status === "loading"}>
            {status === "loading" ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Sending</> : isAssessment ? "Request free assessment" : "Send enquiry"}
          </Button>
        )}
      </div>
      {status === "success" && (
        <p className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-center text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4" /> Thank you. Our team will be in touch shortly.
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-700">
          We could not send your form right now. Please try again in a moment.
        </p>
      )}
    </form>
  );
}
