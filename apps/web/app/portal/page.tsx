"use client";

import { useState } from "react";
import { CalendarDays, ChevronRight, CircleDollarSign, MessageCircle, PlaneLanding, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PortalPage() {
  const [code, setCode] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  if (!signedIn) {
    return (
      <section className="grid min-h-[72vh] place-items-center bg-linen px-5 py-20">
        <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="eyebrow">Guest portal</p>
          <h1 className="mt-4 font-display text-5xl">Everything for your stay.</h1>
          <p className="mt-5 text-sm leading-7 text-ink/50">Enter your confirmation number to view arrival details, receipts and messages.</p>
          <input value={code} onChange={(e) => setCode(e.target.value)} className="field mt-7" placeholder="TBS-XXXXXX" />
          <Button onClick={() => setSignedIn(Boolean(code))} className="mt-4 w-full rounded-xl py-4">Open my reservation</Button>
          <p className="mt-5 text-center text-xs text-ink/40">Demo: enter any confirmation number.</p>
        </div>
      </section>
    );
  }
  return (
    <section className="section-pad bg-linen">
      <div className="container-wide">
        <p className="eyebrow">Welcome back</p>
        <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><h1 className="font-display text-6xl">Your Toronto stay</h1><p className="mt-3 text-sm text-ink/50">Confirmation {code.toUpperCase()}</p></div>
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-800">Confirmed</span>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
          <div className="rounded-[1.75rem] bg-ink p-8 text-white md:p-10">
            <div className="flex items-center gap-3 text-champagne"><PlaneLanding /><span className="text-xs font-bold uppercase tracking-[.14em]">Next stay</span></div>
            <h2 className="mt-8 font-display text-5xl">King West Skyline Suite</h2>
            <p className="mt-3 text-white/55">King West, Toronto</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[["Check in", "Jun 18, 2026"], ["Check out", "Jun 24, 2026"], ["Guests", "2 adults"]].map(([label, value]) => <div key={label} className="rounded-2xl bg-white/10 p-4"><span className="text-[9px] font-bold uppercase tracking-[.14em] text-white/40">{label}</span><strong className="mt-2 block text-sm">{value}</strong></div>)}
            </div>
          </div>
          <div className="grid gap-4">
            {[[CalendarDays, "Arrival guide", "Available 48 hours before check-in"], [MessageCircle, "Message your host", "Our guest team is online"], [ReceiptText, "Receipt & invoice", "Download booking documents"], [CircleDollarSign, "Extend your stay", "Request additional nights"]].map(([Icon, title, text]) => <button key={title as string} className="flex items-center gap-4 rounded-2xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-linen"><Icon className="h-5 w-5 text-champagne" /></span><span className="min-w-0 flex-1"><strong className="block text-sm">{title as string}</strong><span className="mt-1 block text-xs text-ink/45">{text as string}</span></span><ChevronRight className="h-4 w-4 text-ink/30" /></button>)}
          </div>
        </div>
      </div>
    </section>
  );
}
