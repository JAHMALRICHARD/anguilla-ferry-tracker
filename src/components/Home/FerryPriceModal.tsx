"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShipWheelIcon,
  InfoIcon,
  BabyIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

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
      <DialogContent className="!max-w-5xl w-full !p-8 !rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-3xl font-bold">
            <ShipWheelIcon className="h-7 w-7 text-primary" />
            Ferry Prices
          </DialogTitle>
        </DialogHeader>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {/* Adult */}
          <div className="rounded-2xl border border-border p-6 bg-card shadow-sm">
            <div className="flex justify-center mb-4 text-primary">
              <UserIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Adult</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Ages 12 and above
            </p>
            <p className="text-3xl font-bold text-foreground mb-2">$30</p>
            <p className="text-muted-foreground text-sm">One-way fare</p>
          </div>

          {/* Child */}
          <div className="rounded-2xl border border-border p-6 bg-card shadow-sm">
            <div className="flex justify-center mb-4 text-yellow-500">
              <UsersIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Child</h3>
            <p className="text-muted-foreground text-sm mb-2">Ages 2 to 11</p>
            <p className="text-3xl font-bold text-foreground mb-2">$15</p>
            <p className="text-muted-foreground text-sm">One-way fare</p>
          </div>

          {/* Infant */}
          <div className="rounded-2xl border border-border p-6 bg-card shadow-sm">
            <div className="flex justify-center mb-4 text-pink-500">
              <BabyIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Infant</h3>
            <p className="text-muted-foreground text-sm mb-2">Under 2 years</p>
            <p className="text-3xl font-bold text-foreground mb-2">Free</p>
            <p className="text-muted-foreground text-sm">One-way fare</p>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-10 flex items-start gap-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
          <InfoIcon className="h-5 w-5 mt-1 text-warning" />
          <p>
            <strong className="text-foreground">Important:</strong> Tickets are
            only available for purchase at the ferry terminal. Online
            reservations are currently not supported for the public ferry.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
