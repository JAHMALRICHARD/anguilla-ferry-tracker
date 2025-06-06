"use client";

import React, { useState } from "react";
import {
  FileTextIcon,
  TagIcon,
  CreditCardIcon,
  ShieldIcon,
  PackageIcon,
  BoxIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { TravelDocumentsModal } from "./TravelDocumentsModal";
import { FerryPriceModal } from "./FerryPriceModal";
import { DepartureTaxesModal } from "./DepartureTaxesModal";
import { SecurityModal } from "./SecurityModal";
import { AmenitiesModal } from "./AmenitiesModal";
import { HowToPayModal } from "./HowToPayModal";

export function InfoCards() {
  const cards = [
    {
      title: "Travel Documents",
      description: "What you need before you board a ferry.",
      icon: FileTextIcon,
    },
    {
      title: "Ferry Prices",
      description: "Know the ferry costs before you sail.",
      icon: TagIcon,
    },
    {
      title: "Departure Taxes",
      description: "Fees you’ll pay before boarding.",
      icon: BoxIcon,
    },
    {
      title: "How to Pay",
      description: "Know how to pay before you board.",
      icon: CreditCardIcon,
    },
    {
      title: "Security",
      description: "Know the security measures at each port.",
      icon: ShieldIcon,
    },
    {
      title: "Amenities",
      description: "View the convenience & amenities at the ports.",
      icon: PackageIcon,
    },
  ];

  const [modals, setModals] = useState({
    "Travel Documents": false,
    "Ferry Prices": false,
    "Departure Taxes": false,
    "How to Pay": false,
    Security: false,
    Amenities: false,
  });

  const handleCardClick = (title: string) => {
    setModals((prev) => ({ ...prev, [title]: true }));
  };

  const handleCloseModal = (title: string) => {
    setModals((prev) => ({ ...prev, [title]: false }));
  };

  return (
    <div className="pt-12 mb-16">
      <h2 className="text-2xl font-bold mb-8 text-white">Before You Board</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card
            key={card.title}
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick(card.title)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick(card.title);
              }
            }}
            className="bg-card border border-border text-foreground hover:border-primary transition-colors cursor-pointer rounded-xl"
          >
            <CardContent className="p-6">
              <card.icon className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>{" "}
              {/* ⬅️ Larger Title */}
              <p className="text-base text-muted-foreground mb-2">
                {card.description}
              </p>{" "}
              {/* ⬅️ Larger Paragraph */}
              <span className="text-base text-blue-400 hover:underline">
                Learn more
              </span>{" "}
              {/* ⬅️ Larger CTA */}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modals */}
      {modals["Travel Documents"] && (
        <TravelDocumentsModal
          onClose={() => handleCloseModal("Travel Documents")}
        />
      )}
      {modals["Ferry Prices"] && (
        <FerryPriceModal
          open={modals["Ferry Prices"]}
          onClose={() => handleCloseModal("Ferry Prices")}
        />
      )}
      {modals["Departure Taxes"] && (
        <DepartureTaxesModal
          open={modals["Departure Taxes"]}
          onClose={() => handleCloseModal("Departure Taxes")}
        />
      )}
      {modals["How to Pay"] && (
        <HowToPayModal
          open={modals["How to Pay"]}
          onClose={() => handleCloseModal("How to Pay")}
        />
      )}
      {modals["Security"] && (
        <SecurityModal onClose={() => handleCloseModal("Security")} />
      )}
      {modals["Amenities"] && (
        <AmenitiesModal onClose={() => handleCloseModal("Amenities")} />
      )}
    </div>
  );
}
