import { Injectable } from "@nestjs/common";

type SupportReply = {
  text: string;
  suggestions: string[];
};

@Injectable()
export class ChatSupportService {
  reply(input: string): SupportReply {
    const message = input.toLowerCase().trim();

    if (this.matches(message, ["hi", "hello", "hey", "good morning", "good evening"])) {
      return {
        text: "Hi! Welcome to The Bay Suites. I can help you find a suite, understand pricing, plan check-in, or answer questions about an existing booking.",
        suggestions: ["Find a suite", "How much is a stay?", "Check-in information"]
      };
    }

    if (this.matches(message, ["book", "booking", "reserve", "reservation", "availability", "available", "find a suite", "find suite"])) {
      return {
        text: "You can search live stays from the Find a Stay page. Choose your location, dates, and guest count to see matching suites and a complete price before confirming.",
        suggestions: ["Toronto suites", "Corporate stay", "Talk to support"]
      };
    }

    if (this.matches(message, ["price", "pricing", "cost", "rate", "rates", "how much", "fee", "fees"])) {
      return {
        text: "Nightly rates vary by suite and dates. Current homes begin around CAD $189 per night. Your checkout quote includes accommodation, cleaning, service fees, and tax before you confirm.",
        suggestions: ["Find a suite", "Long-stay discount", "Corporate rates"]
      };
    }

    if (this.matches(message, ["corporate", "business", "company", "employee", "relocation", "long stay", "monthly", "extended"])) {
      return {
        text: "We offer furnished corporate and extended stays with flexible terms, Wi-Fi, workspaces, full kitchens, and consolidated billing. Share your dates and team size through the Corporate page or call +1 (877) 721-1311.",
        suggestions: ["Corporate page", "Available locations", "Talk to support"]
      };
    }

    if (this.matches(message, ["location", "locations", "where", "area", "toronto", "mississauga", "etobicoke", "yorkville", "king west"])) {
      return {
        text: "Our featured service areas include Downtown Toronto, King West, Yorkville, Etobicoke, Mississauga, and North York.",
        suggestions: ["Toronto suites", "Mississauga suites", "Find a suite"]
      };
    }

    if (this.matches(message, ["check in", "check-in", "arrival", "key", "access"])) {
      return {
        text: "Check-in instructions are shared in the guest portal before arrival. Most residences use secure self check-in. If your arrival is soon and you cannot access the guide, call +1 (877) 721-1311.",
        suggestions: ["Guest portal", "Check-out information", "Talk to support"]
      };
    }

    if (this.matches(message, ["check out", "check-out", "departure", "leave"])) {
      return {
        text: "Your exact check-out time and departure steps appear in the guest portal. Please leave keys or access devices as instructed and message support if you need to request a later departure.",
        suggestions: ["Guest portal", "Extend my stay", "Talk to support"]
      };
    }

    if (this.matches(message, ["cancel", "cancellation", "refund", "change dates", "modify", "reschedule"])) {
      return {
        text: "Cancellation and date-change options depend on your reservation terms. Please have your confirmation number ready and contact our team at admin@thebaysuites.com or +1 (877) 721-1311.",
        suggestions: ["Guest portal", "Talk to support", "Extend my stay"]
      };
    }

    if (this.matches(message, ["wifi", "wi-fi", "internet", "kitchen", "laundry", "parking", "amenities", "gym"])) {
      return {
        text: "Amenities vary by residence, but our suites commonly include fast Wi-Fi, a full kitchen, in-suite laundry, and guest support. Parking and gyms are available at selected properties and are listed on each suite page.",
        suggestions: ["Find a suite", "Parking options", "Available locations"]
      };
    }

    if (this.matches(message, ["contact", "human", "agent", "person", "support", "help", "call", "email"])) {
      return {
        text: "Our guest team is available at +1 (877) 721-1311 and admin@thebaysuites.com. Include your confirmation number for reservation-specific help.",
        suggestions: ["Guest portal", "Find a suite", "Check-in information"]
      };
    }

    if (this.matches(message, ["thanks", "thank you", "perfect", "great", "okay", "ok"])) {
      return {
        text: "You’re welcome! I’m here whenever you need help with your stay.",
        suggestions: ["Find a suite", "Guest portal", "Contact support"]
      };
    }

    return {
      text: "I can help with bookings, prices, locations, amenities, check-in, cancellations, corporate stays, and guest support. For reservation-specific help, please share your confirmation number without including payment details.",
      suggestions: ["Find a suite", "Check-in information", "Talk to support"]
    };
  }

  private matches(message: string, phrases: string[]) {
    return phrases.some((phrase) => {
      if (phrase.includes(" ")) return message.includes(phrase);
      return new RegExp(`\\b${this.escape(phrase)}\\b`, "i").test(message);
    });
  }

  private escape(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
