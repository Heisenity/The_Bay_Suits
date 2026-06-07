"use client";

import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Map, SlidersHorizontal } from "lucide-react";
import { getProperties } from "@/lib/api";
import { PropertyCard } from "./property-card";
import { SearchBox } from "./search-box";

const PropertyMap = dynamic(
  () => import("./property-map").then((module) => module.PropertyMap),
  {
    ssr: false,
    loading: () => <div className="min-h-[360px] animate-pulse rounded-[1.75rem] bg-linen sm:min-h-[460px] xl:min-h-[720px]" />
  }
);

export function StaysClient() {
  const searchParams = useSearchParams();
  const [sort, setSort] = useState("recommended");
  const [mobileMapOpen, setMobileMapOpen] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const area = searchParams.get("area") || "All locations";
  const selectedLocation = searchParams.get("location") || area;
  const bedrooms = Number(searchParams.get("bedrooms") || 0);
  const guests = Number(searchParams.get("guests") || 1);
  const checkIn = searchParams.get("checkIn") || undefined;
  const checkOut = searchParams.get("checkOut") || undefined;
  const selectedStayType = searchParams.get("stayType") === "long" ? "long" : "short";
  const stayType = searchParams.get("stayType") === "long" ? "Long-term" : "Short-term";
  const { data = [], isLoading } = useQuery({ queryKey: ["properties"], queryFn: getProperties });

  const filtered = useMemo(() => {
    const requestedArea = area.trim().toLowerCase();
    const list = data.filter((property) => {
      const matchesLocation =
        requestedArea === "all locations" ||
        property.area.toLowerCase().includes(requestedArea) ||
        property.location.toLowerCase().includes(requestedArea);
      const matchesBedrooms = bedrooms === 0 || property.bedrooms === bedrooms;
      return matchesLocation && matchesBedrooms && property.guests >= guests;
    });
    if (sort === "price-low") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-high") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [area, bedrooms, data, guests, sort]);

  return (
    <>
      <div className="container-wide -mt-6 px-5 md:-mt-8 md:px-10 lg:px-16">
        <SearchBox
          compact
          initialLocation={selectedLocation}
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          initialGuests={guests}
          initialBedrooms={bedrooms}
          initialStayType={selectedStayType}
        />
      </div>
      <section className="px-5 pb-20 pt-16 md:px-10 md:pb-28 lg:px-16">
        <div className="container-wide">
          <div className="flex flex-col justify-between gap-5 border-b border-ink/10 pb-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-ink/50">
                {isLoading ? "Finding suites..." : `${filtered.length} residences · ${stayType}`}
              </p>
              <h2 className="mt-1 font-display text-4xl">
                {area === "All locations" ? "Available stays" : `Stays in ${area}`}
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setMobileMapOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-4 py-2 text-sm xl:hidden"
              >
                <Map className="h-4 w-4" /> {mobileMapOpen ? "Hide map" : "Show map"}
              </button>
              <label className="flex items-center gap-2 rounded-full border border-ink/15 bg-white px-4 py-2 text-sm">
                <SlidersHorizontal className="h-4 w-4" />
                <select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent outline-none">
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(430px,.95fr)]">
            <div className="order-2 xl:order-1">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                {filtered.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    active={hoveredPropertyId === property.id}
                    onHoverStart={setHoveredPropertyId}
                    onHoverEnd={() => setHoveredPropertyId(null)}
                  />
                ))}
              </div>
              {!isLoading && filtered.length === 0 && (
                <div className="rounded-3xl bg-linen p-12 text-center">
                  <h3 className="font-display text-3xl">No exact match in {selectedLocation}</h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink/55">
                    Try fewer guests, another bedroom count, a nearby city, or All locations.
                  </p>
                </div>
              )}
            </div>
            <div className={`order-1 xl:sticky xl:top-24 xl:order-2 ${mobileMapOpen ? "block" : "hidden xl:block"}`}>
              <PropertyMap properties={filtered} activePropertyId={hoveredPropertyId} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
