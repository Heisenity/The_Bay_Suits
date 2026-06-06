"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import type { Property } from "@/lib/types";
import { currency } from "@/lib/utils";

function FitPropertyBounds({ properties }: { properties: Property[] }) {
  const map = useMap();

  useEffect(() => {
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

export function PropertyMap({ properties }: { properties: Property[] }) {
  return (
    <div className="relative h-full min-h-[360px] overflow-hidden rounded-[1.75rem] border border-ink/10 bg-[#e6e2d9] sm:min-h-[460px] xl:min-h-[720px]">
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
        <FitPropertyBounds properties={properties} />
        {properties.map((property) => (
          <CircleMarker
            key={property.id}
            center={[property.latitude, property.longitude]}
            radius={9}
            pathOptions={{ color: "#0f1f35", fillColor: "#0f1f35", fillOpacity: 1, weight: 2, className: "property-map-dot" }}
          >
            <Tooltip permanent direction="top" offset={[0, -9]} className="property-price-marker">
              {currency(property.price)}
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
        ))}
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
