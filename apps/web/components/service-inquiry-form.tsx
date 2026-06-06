"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { submitLead } from "@/lib/api";
import { Button } from "./ui/button";

export function ServiceInquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      const form = event.currentTarget;
      const payload = {
        enquiryType: "owner-services",
        ...Object.fromEntries(new FormData(form).entries())
      };
      await submitLead("contacts", payload);
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="rounded-[2rem] bg-white p-6 shadow-soft md:p-9">
      <div className="flex items-start justify-between gap-6 border-b border-ink/10 pb-6">
        <div>
          <p className="eyebrow">Property enquiry</p>
          <h3 className="mt-3 font-display text-4xl">Tell us about your property.</h3>
        </div>
        <span className="hidden rounded-full bg-linen px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-ink/50 sm:block">
          Free review
        </span>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[.13em] text-ink/50">First name</span>
          <input className="field" name="firstName" placeholder="Jane" required />
        </label>
        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[.13em] text-ink/50">Last name</span>
          <input className="field" name="lastName" placeholder="Smith" required />
        </label>
        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[.13em] text-ink/50">Email</span>
          <input className="field" name="email" type="email" placeholder="jane@example.com" required />
        </label>
        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[.13em] text-ink/50">Phone</span>
          <input className="field" name="phone" type="tel" placeholder="+1 416 555 0123" />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[.13em] text-ink/50">Property address</span>
          <input className="field" name="propertyAddress" placeholder="Street, city, province/state, country" required />
        </label>
        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[.13em] text-ink/50">Property type</span>
          <select className="field" name="propertyType" defaultValue="" required>
            <option value="" disabled>Select property type</option>
            <option>Condominium</option>
            <option>House</option>
            <option>Townhome</option>
            <option>Apartment</option>
            <option>Multiple properties</option>
          </select>
        </label>
        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[.13em] text-ink/50">Bedrooms</span>
          <select className="field" name="bedrooms" defaultValue="" required>
            <option value="" disabled>Select bedrooms</option>
            <option>Studio</option>
            <option>1 bedroom</option>
            <option>2 bedrooms</option>
            <option>3 bedrooms</option>
            <option>4+ bedrooms</option>
          </select>
        </label>
        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[.13em] text-ink/50">Service plan</span>
          <select className="field" name="servicePlan" defaultValue="" required>
            <option value="" disabled>Choose a plan</option>
            <option>Full Service Host - 20%</option>
            <option>Virtual Service Host - 10%</option>
            <option>Not sure yet</option>
          </select>
        </label>
        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[.13em] text-ink/50">Property status</span>
          <select className="field" name="propertyStatus" defaultValue="">
            <option value="" disabled>Current status</option>
            <option>Ready to host</option>
            <option>Needs furnishing or staging</option>
            <option>Currently listed</option>
            <option>Still planning</option>
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[.13em] text-ink/50">What would you like help with?</span>
          <textarea
            className="field h-32 resize-none py-3"
            name="message"
            placeholder="Tell us about your goals, target launch date, or current challenges."
          />
        </label>
      </div>

      <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-ink/50">
        <input type="checkbox" name="consent" required className="mt-1 accent-[#0f1f35]" />
        I agree to be contacted by The Bay Suites about property-management services.
      </label>

      <Button type="submit" disabled={status === "loading"} className="mt-6 w-full rounded-xl py-4">
        {status === "loading" ? (
          <><LoaderCircle className="h-4 w-4 animate-spin" /> Sending enquiry</>
        ) : (
          <>Request a consultation <ArrowRight className="h-4 w-4" /></>
        )}
      </Button>

      {status === "success" && (
        <p className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4" /> Thank you. Our owner-services team will contact you shortly.
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-700">
          We could not send your enquiry. Please call +1 (877) 721-1311.
        </p>
      )}
    </form>
  );
}
