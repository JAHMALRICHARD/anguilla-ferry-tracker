"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShipWheelIcon, DollarSignIcon, InfoIcon } from "lucide-react";

interface FerryPriceModalProps {
  open: boolean;
  onClose: () => void;
}

export const FerryPriceModal: React.FC<FerryPriceModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <ShipWheelIcon className="h-6 w-6 text-primary" />
            Ferry Prices
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed mt-4">
          {/* Price List */}
          <div className="flex items-start gap-4">
            <DollarSignIcon className="h-5 w-5 mt-1 text-success" />
            <ul className="list-disc list-inside space-y-1">
              <li>
                <span className="text-foreground font-medium">
                  Adults (12+):
                </span>{" "}
                $30 USD (one-way)
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Children (2–11):
                </span>{" "}
                $15 USD (one-way)
              </li>
            </ul>
          </div>

          {/* Notice */}
          <div className="flex items-start gap-4 italic">
            <InfoIcon className="h-5 w-5 mt-1 text-warning" />
            <p>
              Tickets are only available at the ferry terminal. Online
              reservations are not currently supported for the public ferry.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
