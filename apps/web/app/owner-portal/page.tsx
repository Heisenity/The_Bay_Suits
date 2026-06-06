"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BarChart3, Building2, CalendarCheck, CircleDollarSign, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/utils";

type Dashboard = {
  properties: number;
  bookings: number;
  confirmedRevenue: number;
  occupancy: number;
  recentBookings: Array<{
    confirmation: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
    total: number;
    status: string;
  }>;
};

const fallback: Dashboard = {
  properties: 4,
  bookings: 18,
  confirmedRevenue: 28460,
  occupancy: 74,
  recentBookings: [
    { confirmation: "TBS-81AD2F", guestName: "Amelia Roberts", checkIn: "2026-06-18", checkOut: "2026-06-24", total: 1642, status: "confirmed" },
    { confirmation: "TBS-44C913", guestName: "Marcus Tan", checkIn: "2026-06-21", checkOut: "2026-07-19", total: 6320, status: "confirmed" }
  ]
};

async function getDashboard(): Promise<Dashboard> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/dashboard`);
    if (!response.ok) throw new Error("Dashboard unavailable");
    const data = await response.json();
    return data.bookings ? data : fallback;
  } catch {
    return fallback;
  }
}

export default function OwnerPortalPage() {
  const [signedIn, setSignedIn] = useState(false);
  const { data = fallback } = useQuery({ queryKey: ["owner-dashboard"], queryFn: getDashboard, enabled: signedIn });

  if (!signedIn) {
    return (
      <section className="grid min-h-[72vh] place-items-center bg-linen px-5 py-20">
        <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="eyebrow">Owner portal</p>
          <h1 className="mt-4 font-display text-5xl">Your portfolio, clearly.</h1>
          <p className="mt-5 text-sm leading-7 text-ink/50">Sign in to view reservations, revenue and property performance.</p>
          <input className="field mt-7" type="email" placeholder="Owner email" defaultValue="owner@thebaysuites.com" />
          <input className="field mt-3" type="password" placeholder="Password" defaultValue="demo-password" />
          <Button onClick={() => setSignedIn(true)} className="mt-4 w-full rounded-xl py-4"><LogIn className="h-4 w-4" /> Sign in</Button>
          <p className="mt-5 text-center text-xs text-ink/40">Development preview: any credentials will work.</p>
        </div>
      </section>
    );
  }

  const metrics = [
    [Building2, "Active properties", String(data.properties)],
    [CalendarCheck, "Reservations", String(data.bookings)],
    [CircleDollarSign, "Confirmed revenue", currency(data.confirmedRevenue)],
    [BarChart3, "Portfolio occupancy", `${data.occupancy}%`]
  ];

  return (
    <section className="section-pad bg-linen">
      <div className="container-wide">
        <p className="eyebrow">Owner dashboard</p>
        <h1 className="mt-4 font-display text-6xl">Good evening.</h1>
        <p className="mt-3 text-sm text-ink/50">A current view of your managed portfolio.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(([Icon, label, value]) => (
            <article key={label as string} className="rounded-2xl bg-white p-6 shadow-sm">
              <Icon className="h-5 w-5 text-champagne" />
              <p className="mt-6 text-xs font-bold uppercase tracking-[.12em] text-ink/40">{label as string}</p>
              <strong className="mt-2 block font-display text-4xl">{value as string}</strong>
            </article>
          ))}
        </div>
        <div className="mt-6 overflow-hidden rounded-[1.75rem] bg-white shadow-sm">
          <div className="border-b border-ink/10 p-6 md:p-8"><h2 className="font-display text-3xl">Recent reservations</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-linen text-[10px] uppercase tracking-[.12em] text-ink/45"><tr><th className="px-8 py-4">Confirmation</th><th className="px-6 py-4">Guest</th><th className="px-6 py-4">Dates</th><th className="px-6 py-4">Total</th><th className="px-8 py-4">Status</th></tr></thead>
              <tbody>{data.recentBookings.map((booking) => <tr key={booking.confirmation} className="border-t border-ink/5"><td className="px-8 py-5 font-bold">{booking.confirmation}</td><td className="px-6 py-5">{booking.guestName}</td><td className="px-6 py-5 text-ink/55">{booking.checkIn} → {booking.checkOut}</td><td className="px-6 py-5 font-bold">{currency(booking.total)}</td><td className="px-8 py-5"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{booking.status}</span></td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
