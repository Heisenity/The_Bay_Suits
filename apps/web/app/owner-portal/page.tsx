"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Building2,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Eye,
  EyeOff,
  KeyRound,
  LogIn,
  LogOut,
  MailCheck,
  MessageSquareText,
  Trash2
} from "lucide-react";
import { ReservationChat } from "@/components/reservation-chat";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/utils";
import {
  createAdminCalendarBlock,
  getAdminCalendarBlocks,
  getProperties,
  getPropertyMonthAvailability,
  removeAdminCalendarBlock
} from "@/lib/api";
import type { CalendarBlock, Property } from "@/lib/types";

type Dashboard = {
  properties: number;
  bookings: number;
  confirmedRevenue: number;
  occupancy: number;
  recentBookings: Array<{
    confirmation: string;
    propertyName?: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
    total: number;
    status: string;
  }>;
};

const fallback: Dashboard = {
  properties: 14,
  bookings: 18,
  confirmedRevenue: 28460,
  occupancy: 74,
  recentBookings: [
    { confirmation: "TBS-81AD2F", propertyName: "King West Skyline Suite", guestName: "Amelia Roberts", checkIn: "2026-06-18", checkOut: "2026-06-24", total: 1642, status: "confirmed" },
    { confirmation: "TBS-44C913", propertyName: "Yorkville Designer Residence", guestName: "Marcus Tan", checkIn: "2026-06-21", checkOut: "2026-07-19", total: 6320, status: "confirmed" }
  ]
};

const SUPERADMIN_EMAIL = "owner@thebaysuites.com";
const SUPERADMIN_PASSWORD = "TBSAdmin@2026!";
const SESSION_KEY = "bay-suites-admin-session";

function formatMonth(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function shiftMonth(value: string, direction: number) {
  const [yearString, monthString] = value.split("-");
  const next = new Date(Date.UTC(Number(yearString), Number(monthString) - 1 + direction, 1));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}`;
}

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
  const queryClient = useQueryClient();
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState(SUPERADMIN_EMAIL);
  const [password, setPassword] = useState(SUPERADMIN_PASSWORD);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(formatMonth());
  const [blockCheckIn, setBlockCheckIn] = useState("");
  const [blockCheckOut, setBlockCheckOut] = useState("");
  const [blockNote, setBlockNote] = useState("");
  const [calendarNotice, setCalendarNotice] = useState("");
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
  const propertiesQuery = useQuery({
    queryKey: ["properties"],
    queryFn: getProperties,
    enabled: signedIn
  });
  const properties = propertiesQuery.data || [];

  useEffect(() => {
    if (!properties.length) return;
    setSelectedPropertyId((current) => current || properties[0].id);
  }, [properties]);

  const calendarQuery = useQuery({
    queryKey: ["admin-calendar", selectedPropertyId, calendarMonth],
    queryFn: () => getPropertyMonthAvailability(selectedPropertyId, calendarMonth),
    enabled: signedIn && Boolean(selectedPropertyId)
  });

  const blocksQuery = useQuery({
    queryKey: ["admin-calendar-blocks", selectedPropertyId],
    queryFn: () => getAdminCalendarBlocks(selectedPropertyId),
    enabled: signedIn && Boolean(selectedPropertyId)
  });

  useEffect(() => {
    if (!data.recentBookings.length) return;
    setSelectedConversation((current) => current || data.recentBookings[0].confirmation);
  }, [data.recentBookings]);

  const createBlock = useMutation({
    mutationFn: createAdminCalendarBlock,
    onSuccess: async () => {
      setCalendarNotice("The selected slot is now blocked and guests will see it as unavailable.");
      setBlockCheckIn("");
      setBlockCheckOut("");
      setBlockNote("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-calendar", selectedPropertyId, calendarMonth] }),
        queryClient.invalidateQueries({ queryKey: ["admin-calendar-blocks", selectedPropertyId] })
      ]);
    },
    onError: (reason) =>
      setCalendarNotice(reason instanceof Error ? reason.message : "We could not save that calendar block.")
  });

  const removeBlock = useMutation({
    mutationFn: removeAdminCalendarBlock,
    onSuccess: async () => {
      setCalendarNotice("That manual block has been removed from the calendar.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-calendar", selectedPropertyId, calendarMonth] }),
        queryClient.invalidateQueries({ queryKey: ["admin-calendar-blocks", selectedPropertyId] })
      ]);
    },
    onError: (reason) =>
      setCalendarNotice(reason instanceof Error ? reason.message : "We could not remove that block.")
  });

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
    setEmail(SUPERADMIN_EMAIL);
    setPassword(SUPERADMIN_PASSWORD);
    setShowPassword(false);
    setError("");
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
          <div className="relative mt-3">
            <input
              className="field pr-14"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 transition hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
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
  const selectedProperty = properties.find((property) => property.id === selectedPropertyId);
  const calendar = calendarQuery.data;
  const blocks = blocksQuery.data || [];
  const blanks = Array.from({ length: calendar?.startsOn || 0 }, (_, index) => index);
  const days = Array.from({ length: calendar?.daysInMonth || 0 }, (_, index) => index + 1);
  const blockedDays = new Set(calendar?.blockedDays || []);
  const reservedDays = new Set(calendar?.reservedDays || []);

  function submitBlock() {
    if (!selectedPropertyId || !blockCheckIn || !blockCheckOut) {
      setCalendarNotice("Choose a property plus both dates before blocking a slot.");
      return;
    }
    setCalendarNotice("");
    createBlock.mutate({
      propertyId: selectedPropertyId,
      checkIn: blockCheckIn,
      checkOut: blockCheckOut,
      note: blockNote.trim() || undefined
    });
  }

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

        <div className="mt-6 rounded-[1.75rem] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-champagne" />
                <h2 className="font-display text-3xl">Availability control</h2>
              </div>
              <p className="mt-2 text-sm text-ink/45">
                Manually block dates for a residence and the guest-facing booking flow will treat them as unavailable instantly.
              </p>
            </div>
            <label className="min-w-0 sm:max-w-[340px]">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">Residence</span>
              <select
                value={selectedPropertyId}
                onChange={(event) => setSelectedPropertyId(event.target.value)}
                className="field"
              >
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {calendarNotice ? (
            <div className="mt-5 rounded-2xl border border-ink/10 bg-linen px-4 py-3 text-sm text-ink/70">
              {calendarNotice}
            </div>
          ) : null}

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_380px]">
            <div className="rounded-[1.5rem] border border-ink/10 bg-linen/50 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">
                    {selectedProperty?.location || "Selected residence"}
                  </p>
                  <strong className="mt-1 block text-base text-ink">
                    {calendar?.monthLabel || "Loading month…"}
                  </strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCalendarMonth((current) => shiftMonth(current, -1))}
                    className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-white text-ink/60 transition hover:text-ink"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth((current) => shiftMonth(current, 1))}
                    className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-white text-ink/60 transition hover:text-ink"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-ink/35">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                  <span key={`${day}-${index}`}>{day}</span>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-2">
                {blanks.map((blank) => (
                  <span key={`blank-${blank}`} className="aspect-square rounded-xl bg-transparent" />
                ))}
                {days.map((day) => {
                  const isBlocked = blockedDays.has(day);
                  const isReserved = reservedDays.has(day);

                  return (
                    <span
                      key={day}
                      className={`grid aspect-square place-items-center rounded-xl text-xs font-semibold ${
                        isBlocked
                          ? "bg-champagne/30 text-ink ring-1 ring-champagne/50"
                          : isReserved
                            ? "bg-ink/10 text-ink/45"
                            : "bg-white text-ink"
                      }`}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-ink/55">
                <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-white ring-1 ring-ink/10" /> Open</span>
                <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-ink/20" /> Reserved</span>
                <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-champagne/70" /> Manually blocked</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-ink/10 bg-white p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">Mark slot as booked</p>
                <h3 className="mt-2 font-display text-2xl">Create a manual hold</h3>
                <div className="mt-5 grid gap-4">
                  <label>
                    <span className="mb-2 block text-xs font-semibold text-ink/55">Check in</span>
                    <input className="field" type="date" value={blockCheckIn} onChange={(event) => setBlockCheckIn(event.target.value)} />
                  </label>
                  <label>
                    <span className="mb-2 block text-xs font-semibold text-ink/55">Check out</span>
                    <input className="field" type="date" min={blockCheckIn || undefined} value={blockCheckOut} onChange={(event) => setBlockCheckOut(event.target.value)} />
                  </label>
                  <label>
                    <span className="mb-2 block text-xs font-semibold text-ink/55">Reason or note</span>
                    <textarea
                      className="field h-24 resize-none py-3"
                      value={blockNote}
                      onChange={(event) => setBlockNote(event.target.value)}
                      placeholder="Owner stay, maintenance, offline hold, VIP reservation..."
                    />
                  </label>
                  <Button onClick={submitBlock} disabled={createBlock.isPending} className="rounded-xl">
                    {createBlock.isPending ? "Saving block…" : "Block these dates"}
                  </Button>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-ink/10 bg-linen/50 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">Current manual blocks</p>
                <div className="mt-4 space-y-3">
                  {blocks.length ? (
                    blocks.map((block: CalendarBlock) => (
                      <div key={block.id} className="rounded-2xl border border-ink/10 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <strong className="block text-sm text-ink">{block.checkIn} → {block.checkOut}</strong>
                            <p className="mt-1 text-xs text-ink/45">{block.note || "Manual calendar hold"}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeBlock.mutate(block.id)}
                            className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 text-ink/45 transition hover:text-red-600"
                            aria-label="Remove block"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-ink/10 bg-white p-5 text-sm text-ink/50">
                      No manual blocks for this residence yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[1.75rem] bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <MessageSquareText className="h-5 w-5 text-champagne" />
            <div>
              <h2 className="font-display text-3xl">Guest messaging</h2>
              <p className="mt-1 text-sm text-ink/45">Realtime conversation linked directly to each guest reservation.</p>
            </div>
          </div>

          {data.recentBookings.length ? (
            <div className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
              <div className="grid gap-3">
                {data.recentBookings.map((booking) => (
                  <button
                    key={booking.confirmation}
                    type="button"
                    onClick={() => setSelectedConversation(booking.confirmation)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      selectedConversation === booking.confirmation
                        ? "border-[#1d63dc] bg-[#1d63dc]/5"
                        : "border-ink/10 bg-linen/50 hover:border-ink/20 hover:bg-linen"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/40">{booking.confirmation}</p>
                    <strong className="mt-2 block text-sm text-ink">{booking.guestName}</strong>
                    <p className="mt-1 text-xs text-ink/50">{booking.propertyName || "The Bay Suites Residence"}</p>
                    <p className="mt-2 text-xs text-ink/45">{booking.checkIn} → {booking.checkOut}</p>
                  </button>
                ))}
              </div>

              {selectedConversation ? (
                <ReservationChat
                  confirmation={selectedConversation}
                  conversationId={`booking:${selectedConversation}`}
                  currentAuthor="admin"
                  emptyState="When a guest sends a portal message, it appears here instantly so your team can reply in real time."
                />
              ) : (
                <div className="rounded-[1.75rem] border border-ink/10 bg-linen/50 p-8 text-sm text-ink/55">
                  Select a reservation to open its realtime guest conversation.
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-ink/10 bg-linen/50 p-8 text-center text-sm text-ink/55">
              No guest conversations yet. Once a reservation messages the host from the guest portal, the thread will appear here.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
