"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  LockKeyhole,
  MessageCircle,
  PlaneLanding,
  ReceiptText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { extendReservationStay, getBookingReservation, sendReservationInvoice } from "@/lib/api";
import { currency } from "@/lib/utils";
import { ReservationChat } from "@/components/reservation-chat";

type PanelKey = "arrival" | "chat" | "invoice" | "extend";

export default function PortalPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [inputCode, setInputCode] = useState(searchParams.get("confirmation") || "");
  const [activeConfirmation, setActiveConfirmation] = useState(searchParams.get("confirmation") || "");
  const [activePanel, setActivePanel] = useState<PanelKey>("arrival");
  const [extendCheckOut, setExtendCheckOut] = useState("");
  const [portalError, setPortalError] = useState("");

  const reservation = useQuery({
    queryKey: ["reservation", activeConfirmation],
    queryFn: () => getBookingReservation(activeConfirmation),
    enabled: Boolean(activeConfirmation),
    retry: false
  });

  const invoice = useMutation({
    mutationFn: () => sendReservationInvoice(activeConfirmation),
    onSuccess: (data) => setPortalError(data.message),
    onError: (reason) => setPortalError(reason instanceof Error ? reason.message : "We could not send the invoice email.")
  });

  const extendStay = useMutation({
    mutationFn: (checkOut: string) => extendReservationStay(activeConfirmation, checkOut),
    onSuccess: async (data) => {
      setPortalError(`Stay extended successfully. Your updated departure is ${data.checkOut}.`);
      await queryClient.invalidateQueries({ queryKey: ["reservation", activeConfirmation] });
    },
    onError: (reason) =>
      setPortalError(
        reason instanceof Error ? reason.message : "We could not extend the reservation right now."
      )
  });

  const reservationData = reservation.data;

  const cards = useMemo(
    () => [
      [CalendarDays, "Arrival guide", reservationData?.arrivalGuide.available ? "Your check-in instructions are ready" : "Unlocks 48 hours before check-in", "arrival"],
      [MessageCircle, "Message your host", "Chat directly with the guest team in real time", "chat"],
      [ReceiptText, "Receipt & invoice", "Email the latest invoice PDF instantly", "invoice"],
      [CircleDollarSign, "Extend your stay", "Request additional nights if the calendar is still open", "extend"]
    ] as const,
    [reservationData]
  );

  function submitCode() {
    setPortalError("");
    setActiveConfirmation(inputCode.trim().toUpperCase());
  }

  if (!activeConfirmation) {
    return (
      <section className="grid min-h-[72vh] place-items-center bg-linen px-5 py-20">
        <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="eyebrow">Guest portal</p>
          <h1 className="mt-4 font-display text-5xl">Everything for your stay.</h1>
          <p className="mt-5 text-sm leading-7 text-ink/50">
            Enter your Bay Suites confirmation number to access arrival details, messaging, invoices and stay changes.
          </p>
          <input
            value={inputCode}
            onChange={(event) => setInputCode(event.target.value.toUpperCase())}
            className="field mt-7"
            placeholder="TBS-XXXXXX"
          />
          <Button onClick={submitCode} className="mt-4 w-full rounded-xl py-4">
            Open my reservation
          </Button>
          <p className="mt-5 text-center text-xs text-ink/40">
            Use the confirmation number sent after checkout.
          </p>
        </div>
      </section>
    );
  }

  if (reservation.isLoading) {
    return <section className="section-pad bg-linen"><div className="container-wide rounded-[2rem] bg-white p-10 shadow-soft">Loading your reservation…</div></section>;
  }

  if (reservation.isError || !reservationData) {
    return (
      <section className="grid min-h-[72vh] place-items-center bg-linen px-5 py-20">
        <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="eyebrow">Guest portal</p>
          <h1 className="mt-4 font-display text-5xl">We couldn’t find that stay.</h1>
          <p className="mt-5 text-sm leading-7 text-ink/50">
            Check the confirmation number and try again. If you still need help, message support after signing in.
          </p>
          <input
            value={inputCode}
            onChange={(event) => setInputCode(event.target.value.toUpperCase())}
            className="field mt-7"
            placeholder="TBS-XXXXXX"
          />
          <Button onClick={submitCode} className="mt-4 w-full rounded-xl py-4">
            Try another confirmation
          </Button>
          <button
            type="button"
            onClick={() => {
              setActiveConfirmation("");
              setPortalError("");
            }}
            className="mt-4 w-full text-sm font-semibold text-ink/55 transition hover:text-ink"
          >
            Back to portal home
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-x-hidden bg-linen px-3 py-10 sm:px-5 sm:py-20 md:px-10 md:py-28 lg:px-16">
      <div className="container-wide min-w-0">
        <p className="eyebrow">Welcome back</p>
        <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-6xl">Your next stay</h1>
            <p className="mt-3 text-sm text-ink/50">Confirmation {reservationData.confirmation}</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-800">
            {reservationData.status}
          </span>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
          <div className="rounded-[1.75rem] bg-ink p-8 text-white md:p-10">
            <div className="flex items-center gap-3 text-champagne">
              <PlaneLanding />
              <span className="text-xs font-bold uppercase tracking-[.14em]">Next stay</span>
            </div>
            <h2 className="mt-8 font-display text-5xl">{reservationData.property.name}</h2>
            <p className="mt-3 text-white/55">{reservationData.property.location}</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["Check in", reservationData.checkIn],
                ["Check out", reservationData.checkOut],
                ["Guests", `${reservationData.guests} guest${reservationData.guests === 1 ? "" : "s"}`]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/10 p-4">
                  <span className="text-[9px] font-bold uppercase tracking-[.14em] text-white/40">{label}</span>
                  <strong className="mt-2 block text-sm">{value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {cards.map(([Icon, title, text, key]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActivePanel(key);
                  setPortalError("");
                  if (key === "extend") setExtendCheckOut(reservationData.checkOut);
                }}
                className={`flex items-center gap-4 rounded-2xl bg-white p-5 text-left shadow-sm transition ${
                  activePanel === key ? "ring-2 ring-[#1d63dc]" : "hover:-translate-y-0.5"
                }`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-linen">
                  <Icon className="h-5 w-5 text-champagne" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm">{title}</strong>
                  <span className="mt-1 block text-xs text-ink/45">{text}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-ink/30" />
              </button>
            ))}
          </div>
        </div>

        {portalError ? (
          <div className="mt-6 rounded-2xl border border-ink/10 bg-white px-4 py-4 text-sm leading-7 text-ink/70 shadow-sm sm:px-5">
            {portalError}
          </div>
        ) : null}

        <div className="mt-8">
          {activePanel === "arrival" ? (
            <div className="rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-sm sm:p-6 md:p-8">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-champagne" />
                <div>
                  <h3 className="font-display text-3xl">Arrival guide</h3>
                  <p className="mt-1 text-sm text-ink/45">{reservationData.arrivalGuide.preview}</p>
                </div>
              </div>

              {reservationData.arrivalGuide.available ? (
                <div className="mt-8 grid gap-4 lg:grid-cols-2">
                  {[
                    ["Address", reservationData.arrivalGuide.address],
                    ["Access", reservationData.arrivalGuide.access],
                    ["Parking", reservationData.arrivalGuide.parking],
                    ["Wi-Fi", reservationData.arrivalGuide.wifi]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-linen p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">{label}</p>
                      <p className="mt-2 text-sm leading-6 text-ink/70">{value}</p>
                    </div>
                  ))}
                  <div className="rounded-2xl bg-ink p-5 text-white lg:col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Guest notes</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-white/75">
                      {reservationData.arrivalGuide.notes.map((note) => <li key={note}>• {note}</li>)}
                    </ul>
                    <p className="mt-4 text-sm font-semibold text-champagne">{reservationData.arrivalGuide.support}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-8 rounded-[1.5rem] border border-ink/10 bg-linen p-6">
                  <div className="flex items-start gap-3">
                    <LockKeyhole className="mt-1 h-5 w-5 text-champagne" />
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        Full access instructions unlock 48 hours before check-in.
                      </p>
                      <p className="mt-2 text-sm leading-6 text-ink/60">
                        Your arrival guide is already prepared for this residence. It becomes visible on{" "}
                        {new Date(reservationData.arrivalGuide.releaseAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {activePanel === "chat" ? (
            <ReservationChat
              confirmation={reservationData.confirmation}
              conversationId={reservationData.conversationId}
              currentAuthor="guest"
              emptyState="Start the conversation here and the Bay Suites guest team will receive it in the admin portal instantly."
            />
          ) : null}

          {activePanel === "invoice" ? (
            <div className="rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-sm sm:p-6 md:p-8">
              <h3 className="font-display text-3xl">Receipt & invoice</h3>
              <p className="mt-3 max-w-2xl break-words text-sm leading-7 text-ink/55">
                Send the latest invoice PDF to {reservationData.email}. We’ll email the booking summary immediately to the same address used during reservation.
              </p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <Button
                  onClick={() => invoice.mutate()}
                  disabled={invoice.isPending}
                  className="w-full rounded-xl px-6 py-4 sm:w-auto"
                >
                  {invoice.isPending ? "Sending invoice…" : "Email invoice PDF"}
                </Button>
                <p className="text-sm text-ink/45 sm:ml-auto">Total paid: {currency(reservationData.total)}</p>
              </div>
            </div>
          ) : null}

          {activePanel === "extend" ? (
            <div className="rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-sm sm:p-6 md:p-8">
              <h3 className="font-display text-3xl">Extend your stay</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/55">
                If the next nights are still open, we’ll update your checkout and send a refreshed confirmation right away.
              </p>
              <div className="mt-6 grid gap-4 md:max-w-md">
                <label className="rounded-2xl border border-ink/10 px-4 py-3">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">New check-out</span>
                  <input
                    type="date"
                    min={reservationData.checkOut}
                    value={extendCheckOut}
                    onChange={(event) => setExtendCheckOut(event.target.value)}
                    className="mt-2 w-full bg-transparent text-sm font-semibold outline-none"
                  />
                </label>
                <Button
                  onClick={() => extendStay.mutate(extendCheckOut)}
                  disabled={extendStay.isPending || !extendCheckOut}
                  className="rounded-xl py-4"
                >
                  {extendStay.isPending ? "Checking additional nights…" : "Request stay extension"}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
