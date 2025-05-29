"use client";

import React, { useEffect } from "react";
import {
  XIcon,
  ArrowRightLeftIcon,
  InfoIcon,
  EuroIcon,
  BadgeDollarSignIcon,
} from "lucide-react";

interface DepartureTaxesModalProps {
  onClose: () => void;
}

export const DepartureTaxesModal: React.FC<DepartureTaxesModalProps> = ({
  onClose,
}) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-background text-foreground max-w-5xl w-full rounded-2xl shadow-xl border border-border p-8 relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-white transition"
          title="Close"
        >
          <XIcon className="h-5 w-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <InfoIcon className="h-6 w-6 text-blue-500" />
          Departure Taxes
        </h2>

        {/* Split Columns */}
        <div className="flex flex-col md:flex-row gap-10 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {/* Anguilla → Marigot */}
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <ArrowRightLeftIcon className="h-5 w-5 text-orange-400" />
              Anguilla → Marigot
            </h3>

            {/* Visitors Section */}
            <div className="bg-muted p-4 rounded-xl border border-border">
              <p className="font-medium text-white mb-2">
                Visitors staying more than 12 hours:
              </p>
              <ul className="space-y-2 ml-2">
                <li className="flex items-center gap-2">
                  <BadgeDollarSignIcon className="h-4 w-4 text-yellow-300" />
                  Adults (12+):{" "}
                  <span className="text-green-400 font-semibold">$28 USD</span>
                </li>
                <li className="flex items-center gap-2">
                  <BadgeDollarSignIcon className="h-4 w-4" />
                  Children (5–11):{" "}
                  <span className="text-green-400 font-semibold">$15 USD</span>
                </li>
                <li className="flex items-center gap-2">
                  <BadgeDollarSignIcon className="h-4 w-4" />
                  Children (2–4):{" "}
                  <span className="text-green-400 font-semibold">$3 USD</span>
                </li>
              </ul>
            </div>

            {/* Day Trippers Section */}
            <div className="bg-muted p-4 rounded-xl border border-border">
              <p className="font-medium text-white mb-2">
                Day Trippers & Residents:
              </p>
              <ul className="space-y-2 ml-2">
                <li className="flex items-center gap-2">
                  <BadgeDollarSignIcon className="h-4 w-4 text-green-300" />
                  Adults (12+):{" "}
                  <span className="text-green-400 font-semibold">$11 USD</span>
                </li>
                <li className="flex items-center gap-2">
                  <BadgeDollarSignIcon className="h-4 w-4" />
                  Children (2–11):{" "}
                  <span className="text-green-400 font-semibold">$3 USD</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-border mx-2" />

          {/* Marigot → Anguilla */}
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <ArrowRightLeftIcon className="h-5 w-5 text-teal-400" />
              Marigot → Anguilla
            </h3>

            <div className="bg-muted p-4 rounded-xl border border-border space-y-3">
              <div className="flex items-center gap-2">
                <EuroIcon className="h-4 w-4 text-green-300" />
                <span className="text-white font-medium">
                  Passenger Head Fee (Ages 4+):
                </span>
                <span className="text-green-400 font-semibold ml-auto">€7</span>
              </div>
              <p className="text-sm text-muted-foreground leading-snug">
                This fee is payable{" "}
                <span className="font-semibold text-white">
                  only in euros or by card
                </span>{" "}
                at the Marigot terminal.{" "}
                <span className="text-red-400 font-medium">
                  USD not accepted.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
