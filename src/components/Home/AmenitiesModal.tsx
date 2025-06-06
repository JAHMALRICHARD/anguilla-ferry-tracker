"use client";

import React, { useEffect } from "react";
import {
  XIcon,
  MapPinIcon,
  BadgeCheckIcon,
  InfoIcon,
  Building2Icon,
  TicketIcon,
  ShieldCheckIcon,
  ToiletIcon,
  WifiIcon,
  ParkingCircleIcon,
  AccessibilityIcon,
  CoffeeIcon,
  BusIcon,
  CreditCardIcon,
  AlertTriangleIcon,
} from "lucide-react";

interface AmenitiesModalProps {
  onClose: () => void;
}

export const AmenitiesModal: React.FC<AmenitiesModalProps> = ({ onClose }) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-6xl bg-background text-foreground rounded-2xl shadow-2xl p-10 relative border border-border font-sans overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
          title="Close"
        >
          <XIcon className="h-6 w-6" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <MapPinIcon className="h-6 w-6 text-primary" />
          Terminal Amenities
        </h2>

        <div className="flex flex-col lg:flex-row gap-10 text-base text-muted-foreground leading-relaxed">
          {/* Anguilla */}
          <div className="flex-1 space-y-6 min-w-0">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <BadgeCheckIcon className="h-5 w-5 text-yellow-400" />
              Anguilla – Blowing Point Terminal
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Building2Icon className="h-5 w-5 mt-1" />
                Modern, air-conditioned waiting area with ocean views.
              </li>
              <li className="flex items-start gap-2">
                <TicketIcon className="h-5 w-5 mt-1" />
                In-person ticketing for public/private ferries with schedule
                assistance.
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheckIcon className="h-5 w-5 mt-1" />
                Organized customs & immigration for smooth entry/exit.
              </li>
              <li className="flex items-start gap-2">
                <ToiletIcon className="h-5 w-5 mt-1" />
                Clean and accessible restrooms.
              </li>
              <li className="flex items-start gap-2">
                <WifiIcon className="h-5 w-5 mt-1" />
                Limited Wi-Fi & charging. Bring a power bank.
              </li>
              <li className="flex items-start gap-2">
                <ParkingCircleIcon className="h-5 w-5 mt-1" />
                Short/long-term parking. Taxis stationed nearby.
              </li>
              <li className="flex items-start gap-2">
                <AccessibilityIcon className="h-5 w-5 mt-1" />
                Wheelchair ramps & accessible facilities.
              </li>
              <li className="flex items-start gap-2">
                <CoffeeIcon className="h-5 w-5 mt-1" />
                Small café on-site. More shops coming soon.
              </li>
            </ul>
          </div>

          {/* St. Martin */}
          <div className="flex-1 space-y-6 min-w-0">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <InfoIcon className="h-5 w-5 text-cyan-400" />
              St. Martin – Marigot Terminal
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <TicketIcon className="h-5 w-5 mt-1" />
                Basic ticketing/info counters. Head tax paid with card or euros.
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheckIcon className="h-5 w-5 mt-1" />
                French border control on arrival/departure.
              </li>
              <li className="flex items-start gap-2">
                <Building2Icon className="h-5 w-5 mt-1" />
                Outdoor, covered seating. Not air-conditioned.
              </li>
              <li className="flex items-start gap-2">
                <ToiletIcon className="h-5 w-5 mt-1" />
                Restrooms available (may be limited during peak times).
              </li>
              <li className="flex items-start gap-2">
                <CoffeeIcon className="h-5 w-5 mt-1" />
                Nearby cafés and bakeries in downtown Marigot.
              </li>
              <li className="flex items-start gap-2">
                <CreditCardIcon className="h-5 w-5 mt-1 text-yellow-400" />
                Euros and cards accepted.{" "}
                <span className="text-red-500 font-semibold">
                  USD not accepted
                </span>
                .
              </li>
              <li className="flex items-start gap-2">
                <BusIcon className="h-5 w-5 mt-1" />
                Taxis available. Buses and rentals a short walk away.
              </li>
              <li className="flex items-start gap-2">
                <AccessibilityIcon className="h-5 w-5 mt-1" />
                Some accessibility features available (ramps, walkable areas).
              </li>
            </ul>
          </div>

          {/* St. Maarten */}
          <div className="flex-1 space-y-6 min-w-0">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangleIcon className="h-5 w-5 text-red-400" />
              St. Maarten – Dutch Side (Philipsburg)
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <TicketIcon className="h-5 w-5 mt-1" />
                Ferry service limited from this side — confirm before arrival.
              </li>
              <li className="flex items-start gap-2">
                <CreditCardIcon className="h-5 w-5 mt-1" />
                Most vendors accept USD and cards.
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheckIcon className="h-5 w-5 mt-1" />
                Dutch immigration and customs procedures enforced.
              </li>
              <li className="flex items-start gap-2">
                <Building2Icon className="h-5 w-5 mt-1" />
                Access to nearby shopping centers and cafés.
              </li>
              <li className="flex items-start gap-2">
                <ToiletIcon className="h-5 w-5 mt-1" />
                Public restrooms available at nearby marina.
              </li>
              <li className="flex items-start gap-2">
                <WifiIcon className="h-5 w-5 mt-1" />
                Wi-Fi hotspots near cruise port and waterfront.
              </li>
              <li className="flex items-start gap-2">
                <AccessibilityIcon className="h-5 w-5 mt-1" />
                Wheelchair accessible areas in terminal district.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
