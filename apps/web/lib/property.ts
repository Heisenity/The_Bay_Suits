import type { Property } from "./types";

const FALLBACK_IMAGES = ["/images/suite-1.jpg", "/images/suite-2.jpg", "/images/suite-3.jpg"] as const;
const FALLBACK_AMENITIES = [
  "Fast Wi-Fi",
  "Fully equipped kitchen",
  "Professionally prepared linens",
  "Responsive guest support"
] as const;

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStringArray(value: unknown, fallback: readonly string[]) {
  const list = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
  return list.length ? list : [...fallback];
}

export function normalizeProperty(value: unknown): Property | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const id = asString(source.id, "");
  const slug = asString(source.slug, "");
  const name = asString(source.name, "The Bay Suites Residence");

  if (!id || !slug) return null;

  return {
    id,
    slug,
    name,
    location: asString(source.location, "Managed residence"),
    area: asString(source.area, "All locations"),
    shortDescription: asString(source.shortDescription, "A professionally prepared stay with responsive guest support."),
    description: asString(
      source.description,
      "This residence is professionally prepared, fully furnished, and supported by The Bay Suites team."
    ),
    price: asNumber(source.price, 199),
    bedrooms: Math.max(1, asNumber(source.bedrooms, 1)),
    bathrooms: Math.max(1, asNumber(source.bathrooms, 1)),
    guests: Math.max(1, asNumber(source.guests, 2)),
    rating: asNumber(source.rating, 4.9),
    reviews: Math.max(0, asNumber(source.reviews, 0)),
    latitude: asNumber(source.latitude, 43.6532),
    longitude: asNumber(source.longitude, -79.3832),
    images: asStringArray(source.images, FALLBACK_IMAGES),
    amenities: asStringArray(source.amenities, FALLBACK_AMENITIES),
    featured: Boolean(source.featured)
  };
}

export function normalizeProperties(value: unknown): Property[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => normalizeProperty(item))
    .filter((item): item is Property => Boolean(item));
}

export function getPropertyGallery(property: Property) {
  const images = property.images.length ? property.images : [...FALLBACK_IMAGES];
  return [images[0] || FALLBACK_IMAGES[0], images[1] || images[0] || FALLBACK_IMAGES[1], images[2] || images[1] || images[0] || FALLBACK_IMAGES[2]];
}
