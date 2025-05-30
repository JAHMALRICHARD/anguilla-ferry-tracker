"use client";

import React from "react";
import {
  XIcon,
  ShieldCheckIcon,
  LuggageIcon,
  UserCheckIcon,
} from "lucide-react";

interface SecurityModalProps {
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-5xl sm:max-w-5xl md:max-w-5xl lg:max-w-5xl xl:max-w-5xl 2xl:max-w-5xl bg-background text-foreground rounded-2xl shadow-2xl p-10 relative border border-border font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
          title="Close"
        >
          <XIcon className="h-5 w-5" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <ShieldCheckIcon className="h-6 w-6 text-primary" />
          Terminal Security Procedures
        </h2>

        {/* Content */}
        <div className="space-y-10 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {/* Anguilla Section */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <LuggageIcon className="h-5 w-5 text-green-400" />
              Blowing Point Ferry Terminal (Anguilla)
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li>
                <span className="font-medium text-foreground">
                  Security Measures:
                </span>{" "}
                Enhanced screening protocols for passengers and luggage are in
                place.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Baggage Handling:
                </span>{" "}
                Only baggage accompanied by a valid ferry ticket may be loaded
                onto luggage carts.
              </li>
            </ul>
          </div>

          <hr className="border-border" />

          {/* St. Martin Section */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <UserCheckIcon className="h-5 w-5 text-yellow-300" />
              Marigot Ferry Terminal (St. Martin)
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li>
                <span className="font-medium text-foreground">
                  Security Measures:
                </span>{" "}
                Standard bag checks and identity verification may be conducted.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Personal Safety:
                </span>{" "}
                The terminal is generally safe, but be mindful of surroundings
                during early morning or late-night hours.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
