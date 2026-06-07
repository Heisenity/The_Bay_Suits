import { properties } from "./data";

export type ArrivalGuide = {
  headline: string;
  preview: string;
  address: string;
  access: string;
  parking: string;
  wifi: string;
  notes: string[];
  support: string;
};

const fallbackGuide: ArrivalGuide = {
  headline: "A smooth self check-in is prepared for your stay.",
  preview: "Access details, Wi-Fi and support notes are shared here before arrival.",
  address: "The Bay Suites guest services will share the exact entrance details for your booked residence.",
  access: "A secure self check-in code and entry instructions are released closer to arrival.",
  parking: "Parking guidance is confirmed with your reservation when applicable.",
  wifi: "The in-home Wi-Fi name and password will be listed in your digital arrival instructions.",
  notes: [
    "Please keep a government-issued ID available during check-in if requested.",
    "Quiet hours and building guidelines should be followed throughout the stay."
  ],
  support: "For urgent arrival support, call +1 (877) 721-1311."
};

const guideByPropertyId: Record<string, ArrivalGuide> = {
  "king-west": {
    headline: "Your King West arrival is built for an easy downtown check-in.",
    preview: "Use the secure lobby entry, elevator access and digital suite code shared before arrival.",
    address: "King West, Toronto. Your pre-arrival note includes the tower number, lobby entrance and suite level.",
    access: "Enter through the main lobby, use the concierge desk for wayfinding if needed, then access the suite with your digital keypad code.",
    parking: "Underground visitor parking is available by request. Clearance details are shared with your arrival note.",
    wifi: "Wi-Fi: BaySuites-Guest. Password details are pinned inside the suite entry guide.",
    notes: [
      "Ride-share drop-off works best from the main King West porte-cochere.",
      "If you arrive before check-in, luggage storage support can be requested through the host chat."
    ],
    support: "Guest support stays online throughout arrival day for access help."
  },
  yorkville: {
    headline: "Your Yorkville arrival guide keeps check-in calm and discreet.",
    preview: "Boutique-residence access, concierge cues and suite arrival notes are released before check-in.",
    address: "Yorkville, Toronto. The exact residence address and suite floor are shown in your private arrival note.",
    access: "Use the residential entrance, proceed to the private elevator bank, and unlock the suite using your secure code.",
    parking: "Valet and self-parking options depend on the tower schedule; the confirmed option appears in your arrival note.",
    wifi: "Your Wi-Fi card is placed on the kitchen island with the backup QR code.",
    notes: [
      "Yorkville traffic is busiest in the early evening, so arrival 20 minutes earlier is ideal.",
      "Please avoid buzzing other residences if the lobby is momentarily busy."
    ],
    support: "A Bay Suites coordinator remains available for arrival support until you are comfortably inside."
  },
  vancouver: {
    headline: "Coal Harbour arrivals are designed around a polished harbourfront handoff.",
    preview: "Tower entry, lift instructions and access timing are all bundled into your pre-arrival note.",
    address: "Coal Harbour, Vancouver. Your reservation details include the exact tower entrance and access lane.",
    access: "Use the residential fob instructions from your guest note, then access the residence via digital keypad.",
    parking: "One underground stall may be included when confirmed. EV charging directions are provided if assigned.",
    wifi: "Wi-Fi details are displayed on the media console and in your digital arrival guide.",
    notes: [
      "Please use the residential quiet entrance after 10 PM.",
      "If you are arriving with luggage service, message the host ahead so the building team can be informed."
    ],
    support: "Harbourfront guest support remains available through the portal chat on arrival day."
  },
  montreal: {
    headline: "Old Montreal arrivals combine heritage charm with clear digital access.",
    preview: "Street access, loft entry and Wi-Fi guidance appear in your arrival checklist.",
    address: "Old Montreal, Montreal. Your guest note includes the exact heritage building entrance.",
    access: "Use the coded street door, then take the listed staircase or lift to the loft entrance where your keypad code applies.",
    parking: "Nearby paid parking partners are listed in the guide, with the recommended garage noted first.",
    wifi: "The Wi-Fi network and backup credentials are printed beside the workspace.",
    notes: [
      "Historic district streets can be busy with pedestrians, so allow a little extra arrival time.",
      "The building facade is heritage protected, so entry signage is intentionally minimal."
    ],
    support: "If anything feels unclear on arrival, guest support can guide you live in chat."
  },
  calgary: {
    headline: "Beltline check-in is quick, modern and easy to follow.",
    preview: "Garage access, elevator instructions and suite entry are included in your arrival note.",
    address: "Beltline, Calgary. Your private guide lists the residential entry point and suite level.",
    access: "Use the garage or lobby entrance shown in your guest note and proceed with the smart lock code provided before arrival.",
    parking: "One secured building stall may be included when noted on your booking.",
    wifi: "Wi-Fi details are included both in-app and on the arrival placard inside.",
    notes: [
      "Winter arrivals should use the indoor parkade route whenever possible.",
      "The balcony door should stay latched during high-wind evenings."
    ],
    support: "Guest services can assist in real time if the building intercom needs support."
  },
  ottawa: {
    headline: "Your Ottawa arrival guide keeps things efficient from lobby to suite.",
    preview: "Neighbourhood entry notes and residence access codes unlock shortly before check-in.",
    address: "ByWard Market, Ottawa. The exact address and access door are shared in your reservation guide.",
    access: "Use the front lobby entry and proceed with the suite keypad code listed in the portal.",
    parking: "Parking is off-site unless otherwise confirmed. The nearest preferred garage is included in your arrival note.",
    wifi: "Wi-Fi credentials appear in the printed house note on the dining table.",
    notes: [
      "The market district is most active on weekends, so check-in is easiest before late evening rush.",
      "Please keep building entry doors closed behind you."
    ],
    support: "Our support team can help coordinate a later arrival if travel runs behind."
  },
  halifax: {
    headline: "Halifax waterfront arrivals are paced for a relaxed coastal check-in.",
    preview: "Entry details, building notes and local arrival cues sit inside your digital guide.",
    address: "Waterfront, Halifax. Your check-in note includes the exact entrance and lift instructions.",
    access: "Access the residence using the building code first and the suite keypad second.",
    parking: "Parking instructions depend on the assigned stay package; nearby public options are listed as backups.",
    wifi: "Wi-Fi details are listed in the portal and on the welcome card by the coffee setup.",
    notes: [
      "Foggy evenings can soften building signage, so use the exact street number from your guide.",
      "Please message support if you expect to arrive after midnight."
    ],
    support: "Support remains available during your arrival window if anything needs clarification."
  },
  edmonton: {
    headline: "Ice District arrivals are streamlined for event nights and late check-ins.",
    preview: "Building access, parkade instructions and suite entry are all provided before arrival.",
    address: "Downtown, Edmonton. The exact tower and guest route are listed in your private arrival note.",
    access: "Follow the residential tower route and use the digital lock code issued in the guest portal.",
    parking: "Event-day parking guidance is included so you can avoid arena traffic bottlenecks.",
    wifi: "Wi-Fi details are placed at the desk and included in the digital arrival guide.",
    notes: [
      "If there is a major event in the district, allow additional time for traffic and elevators.",
      "The quiet floor policy should be respected after 10 PM."
    ],
    support: "Live chat support is available to help with late-night access questions."
  },
  mississauga: {
    headline: "Your Mississauga arrival guide is tuned for a smooth executive stay.",
    preview: "Tower access, parking details and workspace-ready Wi-Fi notes appear before check-in.",
    address: "Square One, Mississauga. Your arrival note contains the tower number and suite floor.",
    access: "Use the lobby or garage entrance listed in your guide, then unlock the suite via keypad code.",
    parking: "One building parking stall may be included depending on the booking details.",
    wifi: "The Wi-Fi network and password are listed in the guide and inside the suite.",
    notes: [
      "For easier arrival, use the Square One side access lane during peak mall traffic.",
      "Business deliveries should be arranged only after confirmed check-in."
    ],
    support: "Our support team can coordinate access help if you are delayed in transit."
  },
  etobicoke: {
    headline: "Lakeshore townhome arrivals are family-friendly and easy to follow.",
    preview: "Drive-up access, entry notes and home essentials are shared in your arrival card.",
    address: "Lakeshore, Etobicoke. The exact townhome address and parking bay appear in your portal.",
    access: "Use the private front entry and the smart lock code issued before check-in.",
    parking: "Driveway or dedicated residential parking is specified in the guide.",
    wifi: "Wi-Fi details are posted in the kitchen welcome area and in the guest portal.",
    notes: [
      "This is a residential setting, so please keep outdoor noise low in the evening.",
      "Families arriving with children can request a slightly slower, step-by-step check-in summary."
    ],
    support: "Support remains available to help with townhome access or neighbourhood arrival questions."
  },
  miami: {
    headline: "Brickell arrivals are designed for a polished high-rise welcome.",
    preview: "Lobby entry, valet cues and residence access are delivered before check-in.",
    address: "Brickell, Miami. The exact tower address and arrival bay are included in your reservation guide.",
    access: "Use the residential lobby entrance and proceed with the digital suite code shared prior to check-in.",
    parking: "Valet or assigned self-parking instructions will be noted based on your reservation.",
    wifi: "Wi-Fi credentials are included digitally and also shown beside the media hub.",
    notes: [
      "Brickell traffic can be slow in the late afternoon, so a small buffer helps.",
      "Pool deck rules and tower quiet hours are included in your house note."
    ],
    support: "The guest team can stay live with you in chat during arrival if needed."
  },
  kolkata: {
    headline: "Your Kolkata arrival guide is prepared for a smooth New Town check-in.",
    preview: "Tower entry, gate access and suite instructions are ready in your portal before arrival.",
    address: "New Town, Kolkata. The exact tower entry and floor instructions are included in your private guide.",
    access: "Enter through the residential gate, use the tower lift instructions, and unlock the suite using the smart code shared before arrival.",
    parking: "Basement parking guidance and visitor gate instructions are included for drivers.",
    wifi: "Wi-Fi details are placed on the writing desk and repeated in the guide.",
    notes: [
      "If you are arriving from the airport during peak evening hours, allow a little extra travel time.",
      "Keep the tower entry note available for the gate team if asked."
    ],
    support: "Arrival support is available by chat and phone until you are settled in."
  },
  bangalore: {
    headline: "Bangalore arrivals are set up for fast access and work-ready comfort.",
    preview: "Community gate access, residence entry and Wi-Fi setup are bundled together before check-in.",
    address: "Indiranagar, Bangalore. Your digital guide lists the lane, gate and floor access details.",
    access: "Use the community gate directions provided in the portal, then enter with the suite smart lock code.",
    parking: "Parking guidance is included when your stay includes a dedicated bay.",
    wifi: "Primary and backup Wi-Fi details are listed on the workspace card.",
    notes: [
      "Indiranagar can be lively in the evening, so follow the exact lane marker from the guide.",
      "Power backup instructions are included in the house note for longer stays."
    ],
    support: "The guest team can assist live if you need help locating the entrance lane."
  },
  delhi: {
    headline: "Aerocity arrivals are built for efficient airport-side check-in.",
    preview: "Arrival timing, access flow and residence instructions are shared before check-in.",
    address: "Aerocity, Delhi. Your reservation guide includes the exact building approach and suite level.",
    access: "Use the residential access route from the portal, then enter using your smart lock credentials.",
    parking: "Short-stay and overnight parking instructions are both included in the guide.",
    wifi: "Wi-Fi details are provided digitally and printed in the suite welcome pack.",
    notes: [
      "Airport corridor traffic changes quickly, so keep the support number handy during travel.",
      "Please message the host if your arrival shifts significantly due to flight changes."
    ],
    support: "Support can help coordinate delayed arrivals and late-night check-ins."
  }
};

export function getArrivalGuide(propertyId: string) {
  return guideByPropertyId[propertyId] || fallbackGuide;
}

export function getArrivalGuideBySlug(slug: string) {
  const property = properties.find((item) => item.slug === slug);
  return property ? getArrivalGuide(property.id) : fallbackGuide;
}
