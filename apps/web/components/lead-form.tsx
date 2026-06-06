"use client";

import { FormEvent, useState } from "react";
import { submitLead } from "@/lib/api";
import { Button } from "./ui/button";

export function LeadForm({ type = "contacts" }: { type?: "contacts" | "assessments" }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    await submitLead(type, payload);
    event.currentTarget.reset();
    setStatus("success");
  }
  return (
    <form onSubmit={submit} className="rounded-[1.75rem] bg-white p-6 shadow-soft md:p-9">
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="field" name="firstName" placeholder="First name" required />
        <input className="field" name="lastName" placeholder="Last name" required />
        <input className="field sm:col-span-2" name="email" type="email" placeholder="Email address" required />
        <input className="field sm:col-span-2" name="phone" type="tel" placeholder="Phone number" />
        {type === "assessments" && <input className="field sm:col-span-2" name="address" placeholder="Property address" required />}
        {type === "assessments" && (
          <select className="field sm:col-span-2" name="propertyType" defaultValue="">
            <option value="" disabled>Property type</option><option>Condo</option><option>House</option><option>Townhome</option><option>Multiple units</option>
          </select>
        )}
        <textarea className="field h-32 resize-none py-3 sm:col-span-2" name="message" placeholder="Tell us a little more" />
      </div>
      <Button type="submit" className="mt-5 w-full rounded-xl py-4" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : type === "assessments" ? "Request free assessment" : "Send enquiry"}
      </Button>
      {status === "success" && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-center text-sm text-emerald-800">Thank you. Our team will be in touch shortly.</p>}
    </form>
  );
}
