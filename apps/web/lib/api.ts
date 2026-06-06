import { properties } from "./data";
import type { Booking, BookingQuote, Property } from "./types";
import { nightsBetween } from "./utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers }
  });
  if (!response.ok) throw new Error("Request failed");
  return response.json() as Promise<T>;
}

export async function getProperties(): Promise<Property[]> {
  try {
    return await request<Property[]>("/properties", { signal: AbortSignal.timeout(1800) });
  } catch {
    return properties;
  }
}

export async function getProperty(slug: string): Promise<Property | undefined> {
  try {
    return await request<Property>(`/properties/${slug}`);
  } catch {
    return properties.find((property) => property.slug === slug);
  }
}

export async function getQuote(input: {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}): Promise<BookingQuote> {
  try {
    return await request<BookingQuote>("/bookings/quote", {
      method: "POST",
      body: JSON.stringify(input)
    });
  } catch {
    const property = properties.find((item) => item.id === input.propertyId)!;
    const nights = nightsBetween(input.checkIn, input.checkOut);
    const accommodation = nights * property.price;
    const cleaningFee = 95;
    const serviceFee = Math.round(accommodation * 0.08);
    const tax = Math.round((accommodation + cleaningFee + serviceFee) * 0.13);
    return {
      propertyId: input.propertyId,
      nights,
      nightlyRate: property.price,
      accommodation,
      cleaningFee,
      serviceFee,
      tax,
      total: accommodation + cleaningFee + serviceFee + tax
    };
  }
}

export async function createBooking(payload: Record<string, unknown>): Promise<Booking> {
  return request<Booking>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function submitLead(path: "contacts" | "assessments", payload: Record<string, unknown>) {
  try {
    return await request<{ success: boolean }>(`/${path}`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  }
}
