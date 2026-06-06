"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BarChart3, Building2, CalendarCheck, CircleDollarSign, KeyRound, LogIn, LogOut, MailCheck } from "lucide-react";
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

const SUPERADMIN_EMAIL = "owner@thebaysuites.com";
const SUPERADMIN_PASSWORD = "TBSAdmin@2026!";
const SESSION_KEY = "bay-suites-admin-session";

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
  const [email, setEmail] = useState(SUPERADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const forgotPasswordHint = useMemo(
    () =>
      `For the current demo, sign in with ${SUPERADMIN_EMAIL}. If the admin password is forgotten, contact support and use the temporary access key while backend recovery is still being built.`,
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSignedIn(window.localStorage.getItem(SESSION_KEY) === "true");
  }, []);

  const { data = fallback } = useQuery({ queryKey: ["owner-dashboard"], queryFn: getDashboard, enabled: signedIn });

  const handleSignIn = () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== SUPERADMIN_EMAIL || password !== SUPERADMIN_PASSWORD) {
      setError("Use the superadmin email and password provided for this demo.");
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(SESSION_KEY, "true");
    }
    setError("");
    setSignedIn(true);
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SESSION_KEY);
    }
    setSignedIn(false);
    setPassword("");
  };

  if (!signedIn) {
    return (
      <section className="grid min-h-[72vh] place-items-center bg-linen px-5 py-20">
        <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="eyebrow">Admin portal</p>
          <h1 className="mt-4 font-display text-5xl">Your portfolio, clearly.</h1>
          <p className="mt-5 text-sm leading-7 text-ink/50">
            Sign in as superadmin to view reservations, revenue and property performance.
          </p>
          <input
            className="field mt-7"
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="field mt-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error ? (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          ) : null}
          <Button onClick={handleSignIn} className="mt-4 w-full rounded-xl py-4">
            <LogIn className="h-4 w-4" /> Sign in
          </Button>
          <button
            type="button"
            onClick={() => setShowForgotPassword((value) => !value)}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink/60 transition hover:text-ink"
          >
            <KeyRound className="h-4 w-4" />
            Forgot password?
          </button>
          {showForgotPassword ? (
            <div className="mt-4 rounded-[1.5rem] border border-ink/10 bg-linen/60 p-4 text-sm leading-6 text-ink/65">
              <div className="flex items-start gap-3">
                <MailCheck className="mt-1 h-4 w-4 shrink-0 text-champagne" />
                <p>{forgotPasswordHint}</p>
              </div>
              <p className="mt-3 text-xs text-ink/45">
                Frontend-only demo flow: no reset email is sent yet.
              </p>
            </div>
          ) : null}
          <p className="mt-5 text-center text-xs text-ink/40">
            Demo superadmin access only.
          </p>
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
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Admin dashboard</p>
            <h1 className="mt-4 font-display text-6xl">Good evening.</h1>
            <p className="mt-3 text-sm text-ink/50">A current view of your managed portfolio.</p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="rounded-xl">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
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
