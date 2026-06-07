import { properties } from "./data";
import type {
  Booking,
  BookingQuote,
  BookingReservation,
  CalendarBlock,
  ChatMessage,
  Property,
  PropertyMonthAvailability
} from "./types";
import { nightsBetween } from "./utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers }
  });
  if (!response.ok) {
    let message = "Request failed";
    try {
      const payload = await response.json();
      if (payload?.message) {
        message = Array.isArray(payload.message) ? payload.message.join(", ") : String(payload.message);
      }
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }
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
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
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

export async function getBookingReservation(confirmation: string): Promise<BookingReservation> {
  return request<BookingReservation>(`/bookings/${encodeURIComponent(confirmation)}`);
}

export async function getReservationMessages(confirmation: string): Promise<ChatMessage[]> {
  return request<ChatMessage[]>(`/bookings/${encodeURIComponent(confirmation)}/messages`);
}

export async function sendReservationInvoice(confirmation: string) {
  return request<{ success: boolean; message: string }>(`/bookings/${encodeURIComponent(confirmation)}/invoice`, {
    method: "POST"
  });
}

export async function extendReservationStay(confirmation: string, checkOut: string) {
  return request<{ confirmation: string; checkOut: string; total: number; addedNights: number }>(
    `/bookings/${encodeURIComponent(confirmation)}/extend`,
    {
      method: "POST",
      body: JSON.stringify({ checkOut })
    }
  );
}

export async function getPropertyMonthAvailability(propertyId: string, month: string): Promise<PropertyMonthAvailability> {
  return request<PropertyMonthAvailability>(
    `/bookings/calendar/${encodeURIComponent(propertyId)}?month=${encodeURIComponent(month)}`
  );
}

export async function getBookingAvailability(propertyId: string, checkIn: string, checkOut: string) {
  return request<{ propertyId: string; checkIn: string; checkOut: string; available: boolean }>(
    `/bookings/availability/${encodeURIComponent(propertyId)}?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`
  );
}

export async function getAdminCalendarBlocks(propertyId?: string) {
  const query = propertyId ? `?propertyId=${encodeURIComponent(propertyId)}` : "";
  return request<CalendarBlock[]>(`/bookings/admin/blocks${query}`);
}

export async function createAdminCalendarBlock(payload: {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  note?: string;
}) {
  return request<CalendarBlock>("/bookings/admin/blocks", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function removeAdminCalendarBlock(blockId: string) {
  return request<{ success: boolean }>(`/bookings/admin/blocks/${encodeURIComponent(blockId)}/remove`, {
    method: "POST"
  });
}

export async function submitLead(path: "contacts" | "assessments", payload: Record<string, unknown>) {
  try {
    return await request<{ success: boolean }>(`/${path}`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  } catch {
    if (process.env.NODE_ENV !== "production") {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true };
    }
    throw new Error("We could not send your form. Please try again.");
  }
}
