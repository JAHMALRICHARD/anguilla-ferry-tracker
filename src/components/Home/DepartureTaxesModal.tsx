"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  InfoIcon,
  EuroIcon,
  BadgeDollarSignIcon,
  CreditCardIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] max-h-[90vh] overflow-y-auto px-8 py-8 rounded-2xl border border-border shadow-xl bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-4xl font-bold flex items-center gap-3">
            <InfoIcon className="h-7 w-7 text-primary" />
            Departure Taxes
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-1">
            Breakdown of passenger departure taxes for Anguilla, St. Martin, and
            St. Maarten.
          </DialogDescription>
        </DialogHeader>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 text-base text-muted-foreground leading-relaxed">
          {/* 🇦🇮 Anguilla */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              🇦🇮 Anguilla
            </h3>

            <div className="bg-muted p-5 rounded-xl border border-border space-y-4">
              <p className="font-medium text-foreground">
                Visitors staying 12+ hours:
              </p>
              <ul className="space-y-2 ml-2">
                <li className="flex items-center gap-2">
                  <BadgeDollarSignIcon className="h-5 w-5 text-yellow-300" />
                  Adults (12+):{" "}
                  <span className="text-success font-semibold">$28 USD</span>
                </li>
                <li className="flex items-center gap-2">
                  <BadgeDollarSignIcon className="h-5 w-5" />
                  Children (5–11):{" "}
                  <span className="text-success font-semibold">$15 USD</span>
                </li>
                <li className="flex items-center gap-2">
                  <BadgeDollarSignIcon className="h-5 w-5" />
                  Children (2–4):{" "}
                  <span className="text-success font-semibold">$3 USD</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted p-5 rounded-xl border border-border space-y-4">
              <p className="font-medium text-foreground">
                Day Trippers & Residents:
              </p>
              <ul className="space-y-2 ml-2">
                <li className="flex items-center gap-2">
                  <BadgeDollarSignIcon className="h-5 w-5 text-green-300" />
                  Adults (12+):{" "}
                  <span className="text-success font-semibold">$11 USD</span>
                </li>
                <li className="flex items-center gap-2">
                  <BadgeDollarSignIcon className="h-5 w-5" />
                  Children (2–11):{" "}
                  <span className="text-success font-semibold">$3 USD</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 🇫🇷 St. Martin */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              🇫🇷 St. Martin
            </h3>

            <div className="bg-muted p-5 rounded-xl border border-border space-y-4">
              <div className="flex items-center gap-2">
                <EuroIcon className="h-5 w-5 text-green-300" />
                <span className="text-foreground font-medium">
                  Passenger Head Fee (Ages 4+):
                </span>
                <span className="text-success font-semibold ml-auto">€7</span>
              </div>
              <p className="text-base text-muted-foreground leading-snug">
                Payable only in{" "}
                <span className="font-semibold text-foreground">euros</span> or
                by card at Marigot terminal.{" "}
                <span className="text-red-500 font-medium">
                  USD not accepted.
                </span>
              </p>
            </div>
          </div>

          {/* 🇳🇱 St. Maarten */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              🇳🇱 St. Maarten
            </h3>

            <div className="bg-muted p-5 rounded-xl border border-border space-y-4">
              <p className="font-medium text-foreground">Departure Tax Info:</p>
              <p className="text-base">
                Currently, no separate public ferry departure tax is charged at
                the Dutch terminal. However, fees may apply if connecting via
                air or private boat services.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <CreditCardIcon className="h-5 w-5" />
                Confirm payment policy with your ferry operator.
              </div>
            </div>
          </div>
        </div>

        <div className="text-right mt-8">
          <DialogClose asChild>
            <Button variant="secondary" className="text-base px-6 py-2">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
