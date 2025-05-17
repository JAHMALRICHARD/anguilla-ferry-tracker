export interface FerryCharterInfo {
  name: string;
  description: string;
  heroImage: string;
  fleetDescription: string;
  services: string[];
  schedule: { from: string; to: string }[];
  departureTaxes: string[];
  travelTips: string[];
  testimonials: { message: string; author: string }[];
  bookingUrl: string;
}

export const ferryCharters: Record<string, FerryCharterInfo> = {
  funtime: {
    name: "FUNTIME Charters",
    description:
      "Fast, reliable, and luxurious ferry service connecting Anguilla and St. Maarten.",
    heroImage: "/images/ferry-hero.jpg",
    fleetDescription:
      'Choose from our fleet including "FUNTIME One" and others built for comfort.',
    services: [
      "Shared and private boat transfers",
      "Snorkeling trips",
      "Personalized charter schedules",
    ],
    schedule: [
      { from: "Anguilla → St. Maarten", to: "8:30 AM – 4:30 PM" },
      { from: "St. Maarten → Anguilla", to: "9:30 AM – 5:30 PM" },
    ],
    departureTaxes: [
      "Adults (12+): $28 USD (Visitors), $11 USD (Residents)",
      "Children (5–11): $15 USD",
      "Children (2–4): $3 USD",
      "Infants (0–1): $8 USD",
    ],
    travelTips: [
      "Arrive 30 minutes before departure",
      "Bring passport and travel documents",
      "Customs support is provided by FUNTIME staff",
      "Porters are available for baggage assistance",
    ],
    testimonials: [
      { message: "Smooth ride and amazing crew!", author: "Sarah P." },
      { message: "Stress-free and professional!", author: "Jason R." },
      { message: "Punctual and friendly service.", author: "Emily L." },
    ],
    bookingUrl: "https://funtime-charters.com/book-now",
  },

  calypso: {
    name: "Calypso",
    description:
      "Fast, reliable, and luxurious ferry service connecting Anguilla and St. Maarten.",
    heroImage: "/images/ferry-hero.jpg",
    fleetDescription:
      'Choose from our fleet including "Calypso" and others built for comfort.',
    services: [
      "Shared and private boat transfers",
      "Snorkeling trips",
      "Personalized charter schedules",
    ],
    schedule: [
      { from: "Anguilla → St. Maarten", to: "8:30 AM – 4:30 PM" },
      { from: "St. Maarten → Anguilla", to: "9:30 AM – 5:30 PM" },
    ],
    departureTaxes: [
      "Adults (12+): $28 USD (Visitors), $11 USD (Residents)",
      "Children (5–11): $15 USD",
      "Children (2–4): $3 USD",
      "Infants (0–1): $8 USD",
    ],
    travelTips: [
      "Arrive 30 minutes before departure",
      "Bring passport and travel documents",
      "Customs support is provided by FUNTIME staff",
      "Porters are available for baggage assistance",
    ],
    testimonials: [
      { message: "Smooth ride and amazing crew!", author: "Sarah P." },
      { message: "Stress-free and professional!", author: "Jason R." },
      { message: "Punctual and friendly service.", author: "Emily L." },
    ],
    bookingUrl: "https://calypsochartersanguilla.com/book",
  },

  gbferries: {
    name: "GB Ferries",
    description:
      "Fast, reliable, and luxurious ferry service connecting Anguilla and St. Maarten.",
    heroImage: "/images/ferry-hero.jpg",
    fleetDescription:
      'Choose from our fleet including "GB Express" and others built for comfort.',
    services: [
      "Shared and private boat transfers",
      "Snorkeling trips",
      "Personalized charter schedules",
    ],
    schedule: [
      { from: "Anguilla → St. Maarten", to: "8:30 AM – 4:30 PM" },
      { from: "St. Maarten → Anguilla", to: "9:30 AM – 5:30 PM" },
    ],
    departureTaxes: [
      "Adults (12+): $28 USD (Visitors), $11 USD (Residents)",
      "Children (5–11): $15 USD",
      "Children (2–4): $3 USD",
      "Infants (0–1): $8 USD",
    ],
    travelTips: [
      "Arrive 30 minutes before departure",
      "Bring passport and travel documents",
      "Customs support is provided by FUNTIME staff",
      "Porters are available for baggage assistance",
    ],
    testimonials: [
      { message: "Smooth ride and amazing crew!", author: "Sarah P." },
      { message: "Stress-free and professional!", author: "Jason R." },
      { message: "Punctual and friendly service.", author: "Emily L." },
    ],
    bookingUrl: "https://gbferries.com/book-now",
  },
};
