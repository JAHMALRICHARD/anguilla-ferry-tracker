"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowRightLeftIcon,
  InfoIcon,
  EuroIcon,
  BadgeDollarSignIcon,
} from "lucide-react";

interface DepartureTaxesModalProps {
  open: boolean;
  onClose: () => void;
}

export const DepartureTaxesModal: React.FC<DepartureTaxesModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-5xl sm:max-w-5xl md:max-w-5xl lg:max-w-5xl xl:max-w-5xl 2xl:max-w-5xl bg-background text-foreground font-sans px-10 py-12 border border-border rounded-2xl shadow-2xl">
        {/* Accessibility title (screen readers only) */}
        <DialogTitle className="sr-only">
          <span className="flex items-center gap-2">
            <InfoIcon className="h-6 w-6 text-primary" />
            Departure Taxes
          </span>
        </DialogTitle>

        {/* Visible Title */}
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <InfoIcon className="h-6 w-6 text-primary" />
          Departure Taxes
        </h2>

        {/* Two Columns */}
        <div className="flex flex-col md:flex-row gap-16 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {/* Left Column */}
          <div className="flex-1 space-y-6 min-w-0">
            <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2 whitespace-nowrap">
              <ArrowRightLeftIcon className="h-5 w-5 text-orange-400" />
              Anguilla → Marigot
            </h3>

            <div className="bg-muted p-4 rounded-xl border border-border">
              <p className="font-medium text-foreground mb-2">
                Visitors staying more than 12 hours:
              </p>
              <ul className="space-y-2 ml-2">
                <li className="flex items-center gap-2">
                  <BadgeDollarSignIcon className="h-4 w-4 text-yellow-300" />
                  <span>
                    Adults (12+):{" "}
                    <span className="text-success font-semibold">$28 USD</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <BadgeDollarSignIcon className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Children (5–11):{" "}
                    <span className="text-success font-semibold">$15 USD</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <BadgeDollarSignIcon className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Children (2–4):{" "}
                    <span className="text-success font-semibold">$3 USD</span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-xl border border-border">
              <p className="font-medium text-foreground mb-2">
                Day Trippers & Residents:
              </p>
              <ul className="space-y-2 ml-2">
                <li className="flex items-center gap-2">
                  <BadgeDollarSignIcon className="h-4 w-4 text-green-300" />
                  <span>
                    Adults (12+):{" "}
                    <span className="text-success font-semibold">$11 USD</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <BadgeDollarSignIcon className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Children (2–11):{" "}
                    <span className="text-success font-semibold">$3 USD</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-border mx-2" />

          {/* Right Column */}
          <div className="flex-1 space-y-6 min-w-0">
            <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2 whitespace-nowrap">
              <ArrowRightLeftIcon className="h-5 w-5 text-teal-400" />
              Marigot → Anguilla
            </h3>

            <div className="bg-muted p-4 rounded-xl border border-border space-y-3">
              <div className="flex items-center gap-2">
                <EuroIcon className="h-4 w-4 text-green-300" />
                <span className="text-foreground font-medium">
                  Passenger Head Fee (Ages 4+):
                </span>
                <span className="text-success font-semibold ml-auto">€7</span>
              </div>
              <p className="text-sm text-muted-foreground leading-snug">
                This fee is payable{" "}
                <span className="font-semibold text-foreground">
                  only in euros or by card
                </span>{" "}
                at the Marigot terminal.{" "}
                <span className="text-red-500 font-medium">
                  USD not accepted.
                </span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
