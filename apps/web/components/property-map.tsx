"use client";

import Link from "next/link";
import { Fragment, useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import type { Property } from "@/lib/types";
import { currency } from "@/lib/utils";

function FitPropertyBounds({ properties, activePropertyId }: { properties: Property[]; activePropertyId?: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (activePropertyId) return;
    if (!properties.length) return;
    if (properties.length === 1) {
      map.setView([properties[0].latitude, properties[0].longitude], 13);
      return;
    }
    const bounds = properties.map((property) => [property.latitude, property.longitude]) as LatLngBoundsExpression;
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 13 });
  }, [map, properties]);

  return null;
}

function FocusActiveProperty({ property }: { property?: Property }) {
  const map = useMap();

  useEffect(() => {
    if (!property) return;
    map.flyTo([property.latitude, property.longitude], Math.max(map.getZoom(), 12), {
      animate: true,
      duration: 1.1
    });
  }, [map, property]);

  return null;
}

export function PropertyMap({ properties, activePropertyId }: { properties: Property[]; activePropertyId?: string | null }) {
  const activeProperty = properties.find((property) => property.id === activePropertyId);

  return (
    <div className="relative h-full min-h-[360px] overflow-hidden rounded-[1.75rem] border border-ink/10 bg-[#e6e2d9] sm:min-h-[460px] xl:min-h-[720px]">
      <div className="absolute left-4 top-4 z-[600] rounded-full border border-white/70 bg-white/90 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/70 shadow-[0_12px_30px_rgba(15,31,53,.12)] backdrop-blur-sm">
        {activeProperty ? `Spotlight: ${activeProperty.location}` : "Hover a residence to spotlight its map pin"}
      </div>
      <MapContainer
        center={[43.6532, -79.3832]}
        zoom={11}
        scrollWheelZoom
        className="h-full min-h-[360px] w-full sm:min-h-[460px] xl:min-h-[720px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitPropertyBounds properties={properties} activePropertyId={activePropertyId} />
        <FocusActiveProperty property={activeProperty} />
        {properties.map((property) => {
          const active = property.id === activePropertyId;

          return (
            <Fragment key={property.id}>
              {active ? (
                <CircleMarker
                  center={[property.latitude, property.longitude]}
                  radius={22}
                  pathOptions={{ color: "#c9b17c", fillColor: "#c9b17c", fillOpacity: 0.18, weight: 0 }}
                />
              ) : null}
              <CircleMarker
                center={[property.latitude, property.longitude]}
                radius={active ? 12 : 8}
                pathOptions={{
                  color: active ? "#c9b17c" : "#0f1f35",
                  fillColor: active ? "#c9b17c" : "#0f1f35",
                  fillOpacity: 1,
                  weight: active ? 3 : 2,
                  className: "property-map-dot"
                }}
              >
                <Tooltip permanent={active} direction="top" offset={[0, -9]} className="property-price-marker">
                  {active ? `${property.name} · ${currency(property.price)}` : currency(property.price)}
                </Tooltip>
                <Popup minWidth={220}>
                  <div className="p-1 font-sans">
                    <p className="text-xs text-ink/50">{property.location}</p>
                    <strong className="mt-1 block text-base text-ink">{property.name}</strong>
                    <p className="mt-1 text-sm text-ink/60">{property.bedrooms} bedrooms · {property.guests} guests</p>
                    <Link href={`/stays/${property.slug}`} className="mt-3 inline-flex rounded-full bg-ink px-4 py-2 text-xs font-bold text-white">
                      View residence
                    </Link>
                  </div>
                </Popup>
              </CircleMarker>
            </Fragment>
          );
        })}
      </MapContainer>
      {!properties.length && (
        <div className="absolute inset-0 z-[500] grid place-items-center bg-linen/85 p-8 text-center backdrop-blur-sm">
          <div>
            <p className="eyebrow">No map results</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-ink/55">Adjust your filters to see available residences on the map.</p>
          </div>
        </div>
      )}
    </div>
  );
}
