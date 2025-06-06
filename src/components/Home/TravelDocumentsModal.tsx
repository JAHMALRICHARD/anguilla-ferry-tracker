"use client";

import React, { useState, useEffect } from "react";
import {
  XIcon,
  InfoIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
} from "lucide-react";

interface TravelDocumentsModalProps {
  onClose: () => void;
}

export const TravelDocumentsModal: React.FC<TravelDocumentsModalProps> = ({
  onClose,
}) => {
  const [mode, setMode] = useState<"visitor" | "resident">("visitor");

  // ✅ Lock background scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 overflow-y-auto">
      <div className="bg-background text-foreground w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] rounded-2xl shadow-xl border border-border p-8 relative my-12">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
          title="Close"
        >
          <XIcon className="h-6 w-6" />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <InfoIcon className="h-7 w-7 text-primary" />
            Required Travel Documents
          </h2>
          <p className="mt-2 text-muted-foreground text-base">
            Make sure you have all the correct documents for your trip between
            Anguilla and St. Martin/St. Maarten.
          </p>
          <div className="mt-4 inline-flex items-center border rounded-xl overflow-hidden">
            <button
              onClick={() => setMode("visitor")}
              className={`px-5 py-2 text-base font-medium transition ${
                mode === "visitor"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              Visitor
            </button>
            <button
              onClick={() => setMode("resident")}
              className={`px-5 py-2 text-base font-medium transition ${
                mode === "resident"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              Resident
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border mb-10 text-[16px] leading-relaxed text-muted-foreground">
          {["Anguilla", "St. Martin", "St. Maarten"].map((place, index) => {
            const visitorItems =
              place === "Anguilla"
                ? [
                    "Passport with 6+ months validity",
                    "No visa for US, UK, EU, CA",
                    "Return/onward ticket required",
                    "Customs form on arrival",
                  ]
                : place === "St. Martin"
                ? [
                    "Passport or EU ID accepted",
                    "Visa-free for 90 days for most Western countries",
                    "Health insurance recommended",
                    "Proof of lodging encouraged",
                  ]
                : [
                    "ED card recommended before arrival",
                    "Visa-free 90 days for US, UK, Canada",
                    "Proof of funds or return ticket may be asked",
                    "Visa required for restricted countries",
                  ];

            const residentItems =
              place === "Anguilla"
                ? [
                    "Valid Anguillian passport or Belonger card",
                    "Residency proof if not a Belonger",
                    "Customs form required on arrival",
                    "Return ticket not required for residents",
                  ]
                : place === "St. Martin"
                ? [
                    "Passport or national ID required",
                    "90-day visa-free for UK Overseas Territory passports",
                    "Medical insurance recommended",
                    "Proof of lodging may be requested",
                  ]
                : [
                    "Valid passport required on entry",
                    "ED card recommended for faster entry",
                    "UK OT passports accepted",
                    "Proof of funds or itinerary may be checked",
                  ];

            const items = mode === "visitor" ? visitorItems : residentItems;

            return (
              <div
                key={place}
                className={`${
                  index === 0 ? "pr-6" : index === 1 ? "px-6" : "pl-6"
                } space-y-4`}
              >
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {place === "Anguilla"
                    ? "🇦🇮 Anguilla"
                    : place === "St. Martin"
                    ? "🇫🇷 St. Martin"
                    : "🇳🇱 St. Maarten"}
                </h3>
                <div className="bg-muted p-4 rounded-xl border border-border space-y-3">
                  <ul className="space-y-3">
                    {items.map((text, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircleIcon className="text-blue-500 h-5 w-5 mt-0.5" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes & Links - 2 Column Layout */}
        <div className="border-t pt-6 mt-6 text-sm text-muted-foreground">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Travel Notes */}
            <div className="flex items-start gap-3">
              <AlertTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">
                  Travel Notes
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Always carry a printed or digital copy of your passport,
                    ferry ticket, and booking confirmation.
                  </li>
                  <li>
                    Entry requirements can change—check the official government
                    or immigration website before traveling.
                  </li>
                  <li>
                    For residents, having your residency documents on hand can
                    expedite clearance at the ports.
                  </li>
                  <li>
                    Allow extra time during peak season and holidays for
                    document verification.
                  </li>
                </ul>
              </div>
            </div>

            {/* Official Links */}
            <div className="flex items-start gap-3">
              <InfoIcon className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">
                  Official Resources
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <a
                      href="https://ivisitanguilla.com"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Anguilla Tourist Board – ivisitanguilla.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.anguillaports.com"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Anguilla Ports Authority – anguillaports.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.stmaarten-eguide.com/entry-requirements"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      St. Maarten Entry Info – stmaarten-eguide.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.com-saint-martin.fr"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Collectivité de Saint-Martin – com-saint-martin.fr
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://stmaartenehas.com"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      St. Maarten EHAS Portal (ED Card) – stmaartenehas.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-t pt-6 mt-6 text-muted-foreground text-sm">
          <div className="flex items-start gap-3">
            <InfoIcon className="h-5 w-5 text-primary mt-0.5" />
            <div className="w-full">
              <p className="font-semibold text-foreground mb-1">
                Frequently Asked Questions
              </p>
              <div className="space-y-4 mt-2">
                <details className="group border border-border rounded-xl p-4">
                  <summary className="font-medium cursor-pointer text-foreground group-open:text-primary transition">
                    Can I travel with a passport that is about to expire?
                  </summary>
                  <p className="mt-2 text-muted-foreground">
                    Most countries require your passport to be valid for at
                    least 6 months beyond your travel dates. You may be denied
                    entry if your passport expires sooner—renew it before
                    traveling.
                  </p>
                </details>

                <details className="group border border-border rounded-xl p-4">
                  <summary className="font-medium cursor-pointer text-foreground group-open:text-primary transition">
                    Do I need a visa to take the ferry to St. Maarten or St.
                    Martin?
                  </summary>
                  <p className="mt-2 text-muted-foreground">
                    Visa-free entry is granted for 90 days to most travelers
                    from the US, UK, Canada, and EU. However, travelers from
                    restricted countries must apply for a visa in advance for
                    both sides of the island.
                  </p>
                </details>

                <details className="group border border-border rounded-xl p-4">
                  <summary className="font-medium cursor-pointer text-foreground group-open:text-primary transition">
                    Is an ED card mandatory for entering St. Maarten by ferry?
                  </summary>
                  <p className="mt-2 text-muted-foreground">
                    The Electronic Disembarkation (ED) Card is not mandatory for
                    ferry passengers, but it&apos;s highly recommended to
                    complete it online beforehand to speed up immigration
                    processing.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
