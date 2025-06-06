"use client";

import React, { useEffect } from "react";
import {
  XIcon,
  ShieldCheckIcon,
  LuggageIcon,
  UserCheckIcon,
  AlertCircleIcon,
} from "lucide-react";

interface SecurityModalProps {
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ onClose }) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-background text-foreground max-w-6xl w-full rounded-2xl shadow-2xl border border-border p-10 relative font-sans overflow-y-auto max-h-[90vh]">
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
          <ShieldCheckIcon className="h-6 w-6 text-primary" />
          Terminal Security Procedures
        </h2>

        {/* 3 Columns */}
        <div className="flex flex-col lg:flex-row gap-10 text-base text-muted-foreground leading-relaxed">
          {/* Anguilla */}
          <div className="flex-1 space-y-6 min-w-0">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-3">
              <LuggageIcon className="h-5 w-5 text-green-400" />
              Anguilla – Blowing Point Terminal
            </h3>
            <ul className="list-disc list-inside space-y-3 pl-1">
              <li>
                <span className="font-medium text-foreground">
                  Security Measures:
                </span>{" "}
                Enhanced screening for all passengers and luggage.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Baggage Handling:
                </span>{" "}
                Only ticketed baggage may be loaded on carts.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Identification:
                </span>{" "}
                All passengers must carry valid ID or passport.
              </li>
            </ul>
          </div>

          {/* St. Martin */}
          <div className="flex-1 space-y-6 min-w-0">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-3">
              <UserCheckIcon className="h-5 w-5 text-yellow-300" />
              St. Martin – Marigot Terminal
            </h3>
            <ul className="list-disc list-inside space-y-3 pl-1">
              <li>
                <span className="font-medium text-foreground">
                  Security Checks:
                </span>{" "}
                Bags may be searched and identity verified.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Customs Clearance:
                </span>{" "}
                Declaration of certain items may be required.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Travel Advisory:
                </span>{" "}
                Arrive early to allow for passport control queues.
              </li>
            </ul>
          </div>

          {/* St. Maarten */}
          <div className="flex-1 space-y-6 min-w-0">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-3">
              <AlertCircleIcon className="h-5 w-5 text-red-400" />
              St. Maarten (Dutch Side)
            </h3>
            <ul className="list-disc list-inside space-y-3 pl-1">
              <li>
                <span className="font-medium text-foreground">
                  Immigration:
                </span>{" "}
                Strict enforcement of visa requirements at entry.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Luggage Checks:
                </span>{" "}
                Random inspections possible by border agents.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Prohibited Items:
                </span>{" "}
                Avoid carrying agricultural products or restricted electronics.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
