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

export const properties: Property[] = [
  {
    id: "king-west", slug: "king-west-skyline-suite", name: "King West Skyline Suite", location: "King West, Toronto", area: "Toronto",
    shortDescription: "A sunlit city suite steps from dining, nightlife and the waterfront.",
    description: "Thoughtfully furnished for short and extended stays, this polished King West residence pairs hotel-level service with the ease of a private home. Floor-to-ceiling windows, a full kitchen and a dedicated work area make it equally suited to a weekend away or a month in the city.",
    price: 219, bedrooms: 1, bathrooms: 1, guests: 3, rating: 4.92, reviews: 84, latitude: 43.6426, longitude: -79.3971,
    images: ["/images/suite-1.jpg", "/images/suite-2.jpg", "/images/suite-3.jpg"],
    amenities: ["Fast Wi-Fi", "Full kitchen", "In-suite laundry", "Gym", "24/7 support"], featured: true
  },
  {
    id: "yorkville", slug: "yorkville-designer-residence", name: "Yorkville Designer Residence", location: "Yorkville, Toronto", area: "Toronto",
    shortDescription: "Quiet luxury in Toronto's most refined shopping and dining district.",
    description: "A calm, design-led home in the heart of Yorkville. The residence offers generous living space, premium linens, a complete kitchen and discreet guest support throughout your stay.",
    price: 289, bedrooms: 2, bathrooms: 2, guests: 5, rating: 4.96, reviews: 61, latitude: 43.6709, longitude: -79.3933,
    images: ["/images/suite-4.jpg", "/images/suite-5.jpg", "/images/suite-6.jpg"],
    amenities: ["Concierge", "Parking", "Full kitchen", "Workspace", "City views"], featured: true
  },
  {
    id: "vancouver", slug: "coal-harbour-glasshouse", name: "Coal Harbour Glasshouse", location: "Coal Harbour, Vancouver", area: "Vancouver",
    shortDescription: "A polished harbourfront stay with skyline views and effortless downtown access.",
    description: "Created for executive travel and design-minded vacations, this Vancouver residence balances calming interiors, premium bedding and quick access to the seawall, convention centre and central business district.",
    price: 309, bedrooms: 2, bathrooms: 2, guests: 4, rating: 4.95, reviews: 58, latitude: 49.2927, longitude: -123.1207,
    images: ["/images/suite-2.jpg", "/images/suite-8.jpg", "/images/suite-5.jpg"],
    amenities: ["Harbour views", "Concierge", "Gym", "Workspace", "EV parking"], featured: true
  },
  {
    id: "montreal", slug: "old-port-loft-suite", name: "Old Port Loft Suite", location: "Old Montreal, Montreal", area: "Montreal",
    shortDescription: "Historic character, modern finishes and a walkable base near the waterfront.",
    description: "A beautifully updated loft residence that pairs heritage textures with contemporary comfort. Guests have generous living space, a full kitchen and simple access to restaurants, galleries and business meetings downtown.",
    price: 244, bedrooms: 1, bathrooms: 1, guests: 3, rating: 4.9, reviews: 41, latitude: 45.5048, longitude: -73.554,
    images: ["/images/suite-3.jpg", "/images/suite-4.jpg", "/images/suite-7.jpg"],
    amenities: ["Stone accents", "Chef kitchen", "High-speed Wi-Fi", "Laundry", "Self check-in"]
  },
  {
    id: "calgary", slug: "beltline-reserve", name: "Beltline Reserve", location: "Beltline, Calgary", area: "Calgary",
    shortDescription: "A refined downtown Calgary suite for relocations, projects and long weekends.",
    description: "Warm, understated finishes and a practical layout make this Beltline home ideal for both productive and relaxed stays. It includes a quiet workspace, private balcony and simple access to restaurants and river pathways.",
    price: 196, bedrooms: 2, bathrooms: 2, guests: 4, rating: 4.87, reviews: 33, latitude: 51.0414, longitude: -114.0719,
    images: ["/images/suite-6.jpg", "/images/suite-1.jpg", "/images/suite-9.jpg"],
    amenities: ["Balcony", "Workspace", "Parking", "Gym", "Smart entry"]
  },
  {
    id: "ottawa", slug: "byward-market-flat", name: "ByWard Market Flat", location: "ByWard Market, Ottawa", area: "Ottawa",
    shortDescription: "A city-centre residence near Parliament, dining and cultural landmarks.",
    description: "Comfortable and quietly sophisticated, this Ottawa stay offers an easy base for government travel, family visits and extended city living with thoughtful hospitality built in.",
    price: 208, bedrooms: 1, bathrooms: 1, guests: 2, rating: 4.89, reviews: 29, latitude: 45.4289, longitude: -75.6924,
    images: ["/images/suite-8.jpg", "/images/suite-5.jpg", "/images/suite-2.jpg"],
    amenities: ["Fast Wi-Fi", "Walkable core", "Kitchen", "Laundry", "Support on call"]
  },
  {
    id: "halifax", slug: "halifax-waterfront-residence", name: "Halifax Waterfront Residence", location: "Waterfront, Halifax", area: "Halifax",
    shortDescription: "An airy coastal city stay with harbour access and a calm residential feel.",
    description: "Designed for guests who want both convenience and quiet, this Halifax apartment offers bright interiors, easy waterfront access and dependable support for shorter or extended stays.",
    price: 184, bedrooms: 1, bathrooms: 1, guests: 2, rating: 4.85, reviews: 24, latitude: 44.6488, longitude: -63.5752,
    images: ["/images/suite-5.jpg", "/images/suite-9.jpg", "/images/suite-4.jpg"],
    amenities: ["Harbour walks", "Kitchen", "Coffee setup", "Laundry", "Digital check-in"]
  },
  {
    id: "edmonton", slug: "ice-district-stay", name: "Ice District Stay", location: "Downtown, Edmonton", area: "Edmonton",
    shortDescription: "A contemporary downtown residence close to the arena, offices and dining.",
    description: "A smartly arranged city home for project teams, medical stays and weekend events. Expect a complete kitchen, dependable Wi-Fi and a welcoming arrival experience.",
    price: 172, bedrooms: 1, bathrooms: 1, guests: 2, rating: 4.83, reviews: 22, latitude: 53.5461, longitude: -113.4976,
    images: ["/images/suite-7.jpg", "/images/suite-3.jpg", "/images/suite-1.jpg"],
    amenities: ["Downtown access", "Workspace", "Laundry", "Fitness room", "24/7 check-in"]
  },
  {
    id: "mississauga", slug: "mississauga-executive-suite", name: "Mississauga Executive Suite", location: "Square One, Mississauga", area: "Mississauga",
    shortDescription: "A spacious executive base close to Square One and major business hubs.",
    description: "Built for productive stays and easy downtime, this modern suite includes a bright open-plan living room, a practical work setup and quick access to transit and highways.",
    price: 189, bedrooms: 2, bathrooms: 1, guests: 4, rating: 4.88, reviews: 47, latitude: 43.589, longitude: -79.6441,
    images: ["/images/suite-7.jpg", "/images/suite-8.jpg", "/images/suite-9.jpg"],
    amenities: ["Fast Wi-Fi", "Parking", "Gym", "Balcony", "In-suite laundry"]
  },
  {
    id: "etobicoke", slug: "lakeshore-townhome", name: "Lakeshore Townhome", location: "Lakeshore, Etobicoke", area: "Etobicoke",
    shortDescription: "A generous family-ready townhome near the lake and downtown Toronto.",
    description: "A comfortable multi-level home with room to gather and room to work. Guests enjoy a private entrance, fully equipped kitchen, dedicated parking and responsive local support.",
    price: 249, bedrooms: 3, bathrooms: 2, guests: 7, rating: 4.9, reviews: 38, latitude: 43.6092, longitude: -79.4977,
    images: ["/images/suite-9.jpg", "/images/suite-6.jpg", "/images/suite-3.jpg"],
    amenities: ["Private entrance", "Parking", "Family friendly", "Full kitchen", "Laundry"]
  },
  {
    id: "miami", slug: "brickell-bay-residence", name: "Brickell Bay Residence", location: "Brickell, Miami", area: "Miami",
    shortDescription: "A glossy high-rise stay close to the bay, finance district and dining scene.",
    description: "A crisp, elevated Miami residence built for stylish city stays. Guests enjoy pool access, a polished living area, full kitchen amenities and quick movement between meetings and waterfront evenings.",
    price: 332, bedrooms: 2, bathrooms: 2, guests: 4, rating: 4.94, reviews: 52, latitude: 25.7652, longitude: -80.1937,
    images: ["/images/suite-4.jpg", "/images/suite-8.jpg", "/images/suite-6.jpg"],
    amenities: ["Pool", "Bay views", "Valet access", "Gym", "Concierge"], featured: true
  },
  {
    id: "kolkata", slug: "eco-park-signature-suite", name: "Eco Park Signature Suite", location: "New Town, Kolkata", area: "Kolkata",
    shortDescription: "A polished East Kolkata stay near the tech corridor and lifestyle district.",
    description: "Prepared for corporate travelers, family visits and relocation stays, this Kolkata residence offers a calm palette, full kitchen setup, work-friendly layout and proximity to the city's business spine.",
    price: 128, bedrooms: 2, bathrooms: 2, guests: 4, rating: 4.91, reviews: 44, latitude: 22.5775, longitude: 88.4762,
    images: ["/images/suite-2.jpg", "/images/suite-7.jpg", "/images/suite-9.jpg"],
    amenities: ["Wi-Fi", "Gated access", "Housekeeping coordination", "Workspace", "Airport access"], featured: true
  },
  {
    id: "bangalore", slug: "indiranagar-garden-suite", name: "Indiranagar Garden Suite", location: "Indiranagar, Bangalore", area: "Bangalore",
    shortDescription: "A calm design-led stay in one of Bangalore's most connected neighbourhoods.",
    description: "This Bangalore apartment is tuned for longer productive stays, with a dedicated work zone, strong connectivity, full kitchen serviceability and easy access to the city's startup and corporate hubs.",
    price: 136, bedrooms: 2, bathrooms: 2, guests: 4, rating: 4.93, reviews: 39, latitude: 12.9784, longitude: 77.6408,
    images: ["/images/suite-1.jpg", "/images/suite-5.jpg", "/images/suite-8.jpg"],
    amenities: ["Fast Wi-Fi", "Workspace", "Power backup", "Laundry", "Cafe district"]
  },
  {
    id: "delhi", slug: "aerocity-premier-residence", name: "Aerocity Premier Residence", location: "Aerocity, Delhi", area: "Delhi",
    shortDescription: "A sleek airport-corridor home suited to business travel and stopover stays.",
    description: "Minutes from the airport and business hotels, this Delhi residence offers premium convenience with a quieter residential rhythm, polished interiors and flexible stay comfort.",
    price: 148, bedrooms: 1, bathrooms: 1, guests: 2, rating: 4.89, reviews: 31, latitude: 28.5485, longitude: 77.1217,
    images: ["/images/suite-3.jpg", "/images/suite-6.jpg", "/images/suite-2.jpg"],
    amenities: ["Airport access", "24/7 arrival", "Workspace", "Kitchen", "Gym access"]
  }
];
