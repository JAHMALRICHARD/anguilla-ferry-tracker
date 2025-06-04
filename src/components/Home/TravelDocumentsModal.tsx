"use client";

import React from "react";
import {
  XIcon,
  BadgeCheck,
  PlaneIcon,
  HotelIcon,
  InfoIcon,
} from "lucide-react";

interface TravelDocumentsModalProps {
  onClose: () => void;
}

export const TravelDocumentsModal: React.FC<TravelDocumentsModalProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-background text-foreground max-w-2xl w-full rounded-2xl shadow-xl border border-border p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
          title="Close"
        >
          <XIcon className="h-5 w-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <InfoIcon className="h-6 w-6 text-primary" />
          Required Travel Documents
        </h2>

        {/* Content */}
        <div className="space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {/* Passport Section */}
          <div className="flex items-start gap-4">
            <BadgeCheck className="h-5 w-5 mt-1 text-success" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Valid Passport
              </h3>
              <p>
                A passport is required for entry into both the French and Dutch
                sides of St. Martin. Ensure your passport is valid for the
                duration of your stay.
              </p>
            </div>
          </div>

          <hr className="border-border" />

          {/* Visa Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Visa Requirements
            </h3>
            <p className="mb-2">
              Visa requirements depend on your nationality:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                <span className="text-foreground font-medium">
                  U.S. Citizens:
                </span>{" "}
                No visa needed for stays up to 90 days.
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Canadian Citizens:
                </span>{" "}
                No visa needed for stays up to 90 days.
              </li>
              <li>
                <span className="text-foreground font-medium">
                  EU Citizens:
                </span>{" "}
                No visa needed for stays up to 90 days.
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Other Nationalities:
                </span>{" "}
                Visa requirements vary. Check with your local consulate or
                embassy.
              </li>
            </ul>
            <p className="mt-3">
              Refer to official sources like{" "}
              <a
                href="https://travel.state.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                travel.state.gov
              </a>{" "}
              or the{" "}
              <a
                href="https://www.st-martin.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                St. Martin Tourism Board
              </a>
              .
            </p>
          </div>

          <hr className="border-border" />

          {/* Return Ticket */}
          <div className="flex items-start gap-4">
            <PlaneIcon className="h-5 w-5 mt-1 text-warning" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Return or Onward Ticket
              </h3>
              <p>
                You should have proof of a return or onward journey when
                entering St. Martin.
              </p>
            </div>
          </div>

          <hr className="border-border" />

          {/* Accommodation */}
          <div className="flex items-start gap-4">
            <HotelIcon className="h-5 w-5 mt-1 text-secondary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Accommodation Details
              </h3>
              <p>
                Be prepared to show confirmation of your stay, such as a hotel
                reservation or the address where you’ll be staying.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
