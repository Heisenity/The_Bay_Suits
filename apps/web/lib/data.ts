import type { Property } from "./types";

export const properties: Property[] = [
  {
    id: "king-west",
    slug: "king-west-skyline-suite",
    name: "King West Skyline Suite",
    location: "King West, Toronto",
    area: "Toronto",
    shortDescription: "A sunlit city suite steps from dining, nightlife and the waterfront.",
    description:
      "Thoughtfully furnished for short and extended stays, this polished King West residence pairs hotel-level service with the ease of a private home. Floor-to-ceiling windows, a full kitchen and a dedicated work area make it equally suited to a weekend away or a month in the city.",
    price: 219,
    bedrooms: 1,
    bathrooms: 1,
    guests: 3,
    rating: 4.92,
    reviews: 84,
    latitude: 43.6426,
    longitude: -79.3971,
    images: ["/images/suite-1.jpg", "/images/suite-2.jpg", "/images/suite-3.jpg"],
    amenities: ["Fast Wi-Fi", "Full kitchen", "In-suite laundry", "Gym", "24/7 support"],
    featured: true
  },
  {
    id: "yorkville",
    slug: "yorkville-designer-residence",
    name: "Yorkville Designer Residence",
    location: "Yorkville, Toronto",
    area: "Toronto",
    shortDescription: "Quiet luxury in Toronto's most refined shopping and dining district.",
    description:
      "A calm, design-led home in the heart of Yorkville. The residence offers generous living space, premium linens, a complete kitchen and discreet guest support throughout your stay.",
    price: 289,
    bedrooms: 2,
    bathrooms: 2,
    guests: 5,
    rating: 4.96,
    reviews: 61,
    latitude: 43.6709,
    longitude: -79.3933,
    images: ["/images/suite-4.jpg", "/images/suite-5.jpg", "/images/suite-6.jpg"],
    amenities: ["Concierge", "Parking", "Full kitchen", "Workspace", "City views"],
    featured: true
  },
  {
    id: "mississauga",
    slug: "mississauga-executive-suite",
    name: "Mississauga Executive Suite",
    location: "Square One, Mississauga",
    area: "Mississauga",
    shortDescription: "A spacious executive base close to Square One and major business hubs.",
    description:
      "Built for productive stays and easy downtime, this modern suite includes a bright open-plan living room, a practical work setup and quick access to transit and highways.",
    price: 189,
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    rating: 4.88,
    reviews: 47,
    latitude: 43.589,
    longitude: -79.6441,
    images: ["/images/suite-7.jpg", "/images/suite-8.jpg", "/images/suite-9.jpg"],
    amenities: ["Fast Wi-Fi", "Parking", "Gym", "Balcony", "In-suite laundry"]
  },
  {
    id: "etobicoke",
    slug: "lakeshore-townhome",
    name: "Lakeshore Townhome",
    location: "Lakeshore, Etobicoke",
    area: "Etobicoke",
    shortDescription: "A generous family-ready townhome near the lake and downtown Toronto.",
    description:
      "A comfortable multi-level home with room to gather and room to work. Guests enjoy a private entrance, fully equipped kitchen, dedicated parking and responsive local support.",
    price: 249,
    bedrooms: 3,
    bathrooms: 2,
    guests: 7,
    rating: 4.9,
    reviews: 38,
    latitude: 43.6092,
    longitude: -79.4977,
    images: ["/images/suite-9.jpg", "/images/suite-6.jpg", "/images/suite-3.jpg"],
    amenities: ["Private entrance", "Parking", "Family friendly", "Full kitchen", "Laundry"]
  }
];

export const services = [
  {
    title: "Vacation Rentals",
    text: "Professionally prepared furnished homes for weekends, relocations and extended city stays."
  },
  {
    title: "Corporate Housing",
    text: "Flexible, fully equipped residences with one point of contact for teams and travelling professionals."
  },
  {
    title: "Property Management",
    text: "End-to-end revenue, guest, maintenance and housekeeping management for discerning owners."
  }
];

export const areas = ["Downtown Toronto", "Yorkville", "King West", "Etobicoke", "Mississauga", "North York"];

export const testimonials = [
  {
    quote: "The suite felt considered from the moment we arrived. Immaculate, beautifully located, and the team answered within minutes.",
    author: "Amelia R.",
    stay: "London, UK"
  },
  {
    quote: "We needed a reliable home for a six-week project. Bay Suites made the entire extension and billing process effortless.",
    author: "Marcus T.",
    stay: "Corporate guest"
  },
  {
    quote: "They transformed our underperforming condo into a consistently booked, professionally managed asset.",
    author: "Priya S.",
    stay: "Property owner"
  }
];

export const posts = [
  {
    slug: "best-neighbourhoods-toronto",
    title: "The best Toronto neighbourhoods for an extended stay",
    category: "City guide",
    excerpt: "A practical guide to choosing between King West, Yorkville, the waterfront and beyond."
  },
  {
    slug: "corporate-housing-checklist",
    title: "What great corporate housing should include",
    category: "Corporate travel",
    excerpt: "The details that turn a furnished rental into a dependable home for travelling teams."
  },
  {
    slug: "rental-ready-property",
    title: "Is your property ready for short-term rental?",
    category: "Owner resources",
    excerpt: "A clear look at furnishing, photography, operations and revenue expectations."
  }
];
