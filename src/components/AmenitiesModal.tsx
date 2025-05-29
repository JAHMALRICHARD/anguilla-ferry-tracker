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
      <div className="bg-background text-foreground max-w-5xl w-full rounded-2xl shadow-2xl p-8 relative border border-border font-sans overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-white transition"
          title="Close"
        >
          <XIcon className="h-5 w-5" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <MapPinIcon className="h-6 w-6 text-blue-500" />
          Terminal Amenities
        </h2>

        <div className="flex flex-col md:flex-row gap-10 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {/* Anguilla Section */}
          <div className="w-full md:w-1/2 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <BadgeCheckIcon className="h-5 w-5 text-yellow-400" />
                Blowing Point Ferry Terminal (Anguilla)
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Building2Icon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>
                    Modern, air-conditioned waiting area with ocean views.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <TicketIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>
                    In-person ticketing for public/private ferries. Staff assist
                    with schedules.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheckIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>
                    Organized customs & immigration for smooth entry/exit.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ToiletIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>Clean and accessible restrooms.</span>
                </li>
                <li className="flex items-start gap-2">
                  <WifiIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>Limited Wi-Fi & charging. Bring a power bank.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ParkingCircleIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>Short/long-term parking. Taxis stationed nearby.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AccessibilityIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>Wheelchair ramps & accessible facilities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CoffeeIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>Small café on-site. More shops coming soon.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:flex w-px bg-border mx-2" />

          {/* Marigot Section */}
          <div className="w-full md:w-1/2 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <InfoIcon className="h-5 w-5 text-cyan-400" />
                Marigot Ferry Terminal (St. Martin)
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <TicketIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>
                    Basic ticketing/info counters. Head tax paid with
                    card/euros.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheckIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>French border control on arrival/departure.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2Icon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>Outdoor, covered seating. Not air-conditioned.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ToiletIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>Restrooms available. Can be limited during rush.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CoffeeIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>Nearby cafés & bakeries in downtown Marigot.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CreditCardIcon className="h-4 w-4 mt-1 text-yellow-400" />
                  <span>
                    Euros/cards only. USD{" "}
                    <span className="text-red-400 font-semibold">
                      not accepted
                    </span>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <BusIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>Taxis nearby. Buses & rentals a short walk away.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AccessibilityIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>
                    Moderately accessible. Some ramps; walkable areas.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
