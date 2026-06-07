export type Property = {
  id: string;
  slug: string;
  name: string;
  location: string;
  area: string;
  shortDescription: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  rating: number;
  reviews: number;
  latitude: number;
  longitude: number;
  images: string[];
  amenities: string[];
  featured?: boolean;
};

export type BookingQuote = {
  propertyId: string;
  nights: number;
  nightlyRate: number;
  accommodation: number;
  cleaningFee: number;
  serviceFee: number;
  tax: number;
  total: number;
};

export type Booking = {
  confirmation: string;
  propertyName: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  total: number;
  status: string;
};

export type ArrivalGuide = {
  headline: string;
  preview: string;
  address: string;
  access: string;
  parking: string;
  wifi: string;
  notes: string[];
  support: string;
  available: boolean;
  releaseAt: string;
};

export type BookingReservation = {
  confirmation: string;
  conversationId: string;
  guestName: string;
  email: string;
  phone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: string;
  property: {
    id: string;
    slug: string;
    name: string;
    location: string;
    price: number;
  };
  arrivalGuide: ArrivalGuide;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  author: string;
  text: string;
  createdAt: string;
  suggestions?: string[];
};

export type PropertyMonthAvailability = {
  propertyId: string;
  month: string;
  monthLabel: string;
  daysInMonth: number;
  startsOn: number;
  reservedDays: number[];
};
