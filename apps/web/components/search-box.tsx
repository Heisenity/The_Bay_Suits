"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  BedDouble,
  CalendarRange,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  LoaderCircle,
  MapPin,
  Minus,
  Plus,
  Search,
  Users
} from "lucide-react";
import { Button } from "./ui/button";

type CityOption = {
  city: string;
  state: string;
  country: string;
  countryCode: "IN" | "CA" | "US" | "BD";
  label: string;
};

type GuestKey = "adults" | "children" | "infants" | "pets";
type GuestCounts = Record<GuestKey, number>;

const guestRows: { key: GuestKey; label: string; detail: string }[] = [
  { key: "adults", label: "Adults", detail: "Age 13+" },
  { key: "children", label: "Children", detail: "Ages 2–12" },
  { key: "infants", label: "Infants", detail: "Under 2" },
  { key: "pets", label: "Pets", detail: "Service animals welcome" }
];

type SearchBoxProps = {
  compact?: boolean;
  initialLocation?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  initialBedrooms?: number;
  initialStayType?: "short" | "long";
};

export function SearchBox({
  compact = false,
  initialLocation = "All locations",
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
  initialBedrooms = 0,
  initialStayType = "short"
}: SearchBoxProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const today = new Date();
  const later = new Date(today);
  later.setDate(today.getDate() + 3);
  const format = (date: Date) => date.toISOString().slice(0, 10);
  const [where, setWhere] = useState(initialLocation);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [checkIn, setCheckIn] = useState(initialCheckIn || format(today));
  const [checkOut, setCheckOut] = useState(initialCheckOut || format(later));
  const [stayType, setStayType] = useState<"short" | "long">(initialStayType);
  const [bedrooms, setBedrooms] = useState(String(initialBedrooms));
  const [guests, setGuests] = useState<GuestCounts>({
    adults: initialGuests,
    children: 0,
    infants: 0,
    pets: 0
  });
  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    const timer = window.setTimeout(async () => {
      setCityLoading(true);
      try {
        const response = await fetch(`/api/cities?q=${encodeURIComponent(where)}`);
        const results = response.ok ? await response.json() : [];
        if (id === requestId.current) setCities(results);
      } finally {
        if (id === requestId.current) setCityLoading(false);
      }
    }, 180);
    return () => window.clearTimeout(timer);
  }, [where]);

  const travellingGuests = guests.adults + guests.children;
  const guestSummary = `${travellingGuests} guest${travellingGuests === 1 ? "" : "s"}${
    guests.infants ? `, ${guests.infants} infant${guests.infants === 1 ? "" : "s"}` : ""
  }${guests.pets ? `, ${guests.pets} pet${guests.pets === 1 ? "" : "s"}` : ""}`;

  function changeGuest(key: GuestKey, amount: number) {
    setGuests((current) => ({
      ...current,
      [key]: Math.max(key === "adults" ? 1 : 0, Math.min(12, current[key] + amount))
    }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const city = where === "All locations" ? where : where.split(",")[0].trim();
    const params = new URLSearchParams({
      area: city,
      location: where,
      checkIn,
      checkOut,
      guests: String(travellingGuests),
      infants: String(guests.infants),
      pets: String(guests.pets),
      bedrooms,
      stayType
    });
    router.push(`/stays?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className={`relative z-[70] grid min-w-0 grid-cols-2 gap-1.5 overflow-visible rounded-[1.6rem] bg-white p-3 text-ink shadow-soft sm:gap-2 ${
        compact
          ? "lg:grid-cols-[1.2fr_.8fr_.8fr_.75fr_.95fr_auto]"
          : "lg:grid-cols-[1.2fr_.8fr_.8fr_.75fr_.95fr_auto]"
      }`}
    >
      <div className="col-span-2 flex justify-center pb-0.5 lg:col-span-full">
        <div
          className="grid w-full max-w-[420px] grid-cols-2 rounded-full border border-ink/10 bg-linen/80 p-1 shadow-[inset_0_1px_2px_rgba(15,31,53,.04)] backdrop-blur-sm"
          aria-label="Choose stay length"
        >
          {(["short", "long"] as const).map((type) => {
            const active = stayType === type;
            const Icon = type === "short" ? Clock3 : CalendarRange;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setStayType(type)}
                aria-pressed={active}
                className={`relative isolate flex items-center justify-center gap-2 overflow-hidden rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors sm:text-[11px] ${
                  active ? "text-white" : "text-ink/45 hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="active-stay-type"
                    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 -z-10 rounded-full bg-ink shadow-[0_6px_18px_rgba(15,31,53,.18)]"
                  />
                )}
                <Icon className={`h-3.5 w-3.5 ${active ? "text-champagne" : "text-ink/35"}`} />
                <span>{type === "short" ? "Short stay" : "Extended stay"}</span>
              </button>
            );
          })}
        </div>
      </div>

      <label className="relative col-span-2 flex min-w-0 items-center gap-3 rounded-2xl px-3 py-1.5 hover:bg-linen sm:py-2 lg:col-span-1">
        <MapPin className="h-4 w-4 shrink-0 text-champagne" />
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-ink/45">Where</span>
          <input
            value={where}
            onChange={(event) => {
              setWhere(event.target.value);
              setCityPickerOpen(true);
            }}
            onFocus={() => setCityPickerOpen(true)}
            onBlur={() => window.setTimeout(() => setCityPickerOpen(false), 150)}
            placeholder="Search a city"
            autoComplete="off"
            className="w-full min-w-0 bg-transparent text-sm font-semibold outline-none placeholder:text-ink/35"
          />
        </span>
        {cityLoading && <LoaderCircle className="h-4 w-4 animate-spin text-ink/35" />}
        {cityPickerOpen && (
          <div className="absolute left-0 top-[calc(100%+12px)] z-[1000] max-h-80 w-full min-w-[310px] overflow-y-auto rounded-2xl border border-ink/10 bg-white p-2 shadow-soft">
            <button
              type="button"
              onMouseDown={() => setWhere("All locations")}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-linen"
            >
              <span>
                <strong className="block">All locations</strong>
                <span className="text-xs text-ink/45">Canada, United States, India and Bangladesh</span>
              </span>
              {where === "All locations" && <Check className="h-4 w-4 text-champagne" />}
            </button>
            {cities.map((city) => (
              <button
                type="button"
                key={`${city.countryCode}-${city.state}-${city.city}`}
                onMouseDown={() => {
                  setWhere(city.label);
                  setCityPickerOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-linen"
              >
                <span className="min-w-0">
                  <strong className="block truncate">{city.city}</strong>
                  <span className="block truncate text-xs text-ink/45">{city.state}, {city.country}</span>
                </span>
                <span className="ml-3 rounded-full bg-linen px-2 py-1 text-[9px] font-bold">{city.countryCode}</span>
              </button>
            ))}
            {!cityLoading && cities.length === 0 && where !== "All locations" && (
              <p className="px-3 py-5 text-center text-xs leading-5 text-ink/45">
                No city found. Try a city or region in Canada, the United States, India, or Bangladesh.
              </p>
            )}
          </div>
        )}
      </label>

      <label className="flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl px-3 py-1.5 hover:bg-linen sm:py-2">
        <CalendarDays className="h-4 w-4 shrink-0 text-champagne" />
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-ink/45">Check in</span>
          <input type="date" min={format(today)} value={checkIn} onChange={(event) => setCheckIn(event.target.value)} className="w-full min-w-0 bg-transparent text-sm font-semibold outline-none" />
        </span>
      </label>

      <label className="flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl px-3 py-1.5 hover:bg-linen sm:py-2">
        <CalendarDays className="h-4 w-4 shrink-0 text-champagne" />
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-ink/45">Check out</span>
          <input type="date" min={checkIn} value={checkOut} onChange={(event) => setCheckOut(event.target.value)} className="w-full min-w-0 bg-transparent text-sm font-semibold outline-none" />
        </span>
      </label>

      <label className="flex min-w-0 items-center gap-3 rounded-2xl px-3 py-1.5 hover:bg-linen sm:py-2">
        <BedDouble className="h-4 w-4 shrink-0 text-champagne" />
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-ink/45">Bedrooms</span>
          <select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)} className="w-full appearance-none bg-transparent text-sm font-semibold outline-none">
            <option value="0">Any</option>
            <option value="1">1 bedroom</option>
            <option value="2">2 bedrooms</option>
            <option value="3">3 bedrooms</option>
          </select>
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-ink/35" />
      </label>

      <div className="relative col-span-2 lg:col-span-1">
        <button
          type="button"
          onClick={() => setGuestPickerOpen((open) => !open)}
          className="flex h-full min-h-12 w-full min-w-0 items-center gap-3 rounded-2xl px-3 py-1.5 text-left hover:bg-linen sm:min-h-14 sm:py-2"
        >
          <Users className="h-4 w-4 shrink-0 text-champagne" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-ink/45">Guests</span>
            <span className="block truncate text-sm font-semibold">{guestSummary}</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-ink/35" />
        </button>
        {guestPickerOpen && (
          <div className="absolute right-0 top-[calc(100%+12px)] z-[1000] w-[min(360px,calc(100vw-40px))] rounded-2xl border border-ink/10 bg-white p-5 shadow-soft">
            {guestRows.map((row) => (
              <div key={row.key} className="flex items-center justify-between border-b border-ink/8 py-3 last:border-0">
                <div>
                  <strong className="block text-sm">{row.label}</strong>
                  <span className="text-xs text-ink/45">{row.detail}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => changeGuest(row.key, -1)} disabled={guests[row.key] <= (row.key === "adults" ? 1 : 0)} className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 disabled:opacity-30" aria-label={`Remove ${row.label}`}>
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-4 text-center text-sm font-semibold">{guests[row.key]}</span>
                  <button type="button" onClick={() => changeGuest(row.key, 1)} className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white" aria-label={`Add ${row.label}`}>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <Button type="button" onClick={() => setGuestPickerOpen(false)} className="mt-3 w-full rounded-xl">Done</Button>
          </div>
        )}
      </div>

      <Button className="col-span-2 min-h-12 rounded-2xl px-5 sm:min-h-14 lg:col-span-1" aria-label="Search">
        <Search className="h-5 w-5" />
        <span>Search</span>
      </Button>
    </form>
  );
}
