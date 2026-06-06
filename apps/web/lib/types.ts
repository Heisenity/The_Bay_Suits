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
