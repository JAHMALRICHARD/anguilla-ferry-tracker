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
  CreditCardIcon,
  BanknoteIcon,
  BadgeDollarSignIcon,
  TerminalIcon,
  HandCoinsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HowToPayModalProps {
  open: boolean;
  onClose: () => void;
}

export const HowToPayModal: React.FC<HowToPayModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] max-h-[90vh] overflow-y-auto px-8 py-8 rounded-2xl border border-border shadow-xl bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center gap-3">
            <CreditCardIcon className="h-7 w-7 text-primary" />
            How to Pay
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Learn how to pay for ferry fares and taxes at each terminal.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-base text-muted-foreground leading-relaxed">
          {/* 🇦🇮 Blowing Point (Anguilla) */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              🇦🇮 Blowing Point Terminal
            </h3>
            <div className="bg-muted p-5 rounded-xl border border-border space-y-4">
              <p className="font-medium text-foreground">Payment Methods:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <BanknoteIcon className="h-5 w-5 text-green-400 mt-1" />
                  Cash (USD or XCD) accepted at the counter.
                </li>
                <li className="flex items-start gap-2">
                  <CreditCardIcon className="h-5 w-5 text-red-400 mt-1" />
                  <strong>Cards not accepted</strong> for public ferry tickets.
                </li>
                <li className="flex items-start gap-2">
                  <BadgeDollarSignIcon className="h-5 w-5 text-green-400 mt-1" />
                  Cards accepted for <strong>departure tax</strong> only.
                </li>
                <li className="flex items-start gap-2">
                  <li className="flex items-start gap-2">
                    <HandCoinsIcon className="h-5 w-5 text-blue-400 mt-1" />
                    Private charters may accept card payments or offer online
                    payment options.
                  </li>
                </li>
              </ul>
            </div>
            <div className="bg-muted p-5 rounded-xl border border-border space-y-4">
              <p className="font-medium text-foreground">What You’ll Pay:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <BadgeDollarSignIcon className="h-5 w-5 text-primary mt-1" />
                  Ferry Fare: $30 USD (adults), $15 USD (children)
                </li>
                <li className="flex items-start gap-2">
                  <TerminalIcon className="h-5 w-5 text-primary mt-1" />
                  Departure Tax: $28 USD (visitors), $11 USD (residents)
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">Where to Pay:</p>
              <p>
                <strong>In person</strong> at the terminal counter —{" "}
                <strong>cash only</strong>.
              </p>
            </div>
          </div>

          {/* 🇫🇷 Marigot (St. Martin) */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              🇫🇷 Marigot Terminal
            </h3>
            <div className="bg-muted p-5 rounded-xl border border-border space-y-4">
              <p className="font-medium text-foreground">Payment Methods:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <BanknoteIcon className="h-5 w-5 text-green-400 mt-1" />
                  Ferry fare paid <strong>on board</strong> — USD cash only.
                </li>
                <li className="flex items-start gap-2">
                  <CreditCardIcon className="h-4 w-4 text-yellow-300 mt-1" />
                  Head tax (€7) is paid at the terminal — card (Visa/MasterCard)
                  or euros accepted. USD is not accepted.
                </li>
              </ul>
            </div>
            <div className="bg-muted p-5 rounded-xl border border-border space-y-4">
              <p className="font-medium text-foreground">What You’ll Pay:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <BadgeDollarSignIcon className="h-5 w-5 text-primary mt-1" />
                  Ferry Fare: $30 USD (adults), $15 USD (children)
                </li>
                <li className="flex items-start gap-2">
                  <TerminalIcon className="h-5 w-5 text-primary mt-1" />
                  Head Tax: €7 per person
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">Where to Pay:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <TerminalIcon className="h-5 w-5 text-primary mt-1" />
                  Head Tax paid <strong>at terminal before departure</strong>
                </li>
                <li className="flex items-start gap-2">
                  <BanknoteIcon className="h-5 w-5 text-primary mt-1" />
                  Ferry Fare <strong>paid on board</strong>
                </li>
              </ul>
            </div>
          </div>

          {/* 🇳🇱 St. Maarten (Dutch Side) */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              🇳🇱 St. Maarten Terminal
            </h3>
            <div className="bg-muted p-5 rounded-xl border border-border space-y-4">
              <p className="font-medium text-foreground">Payment Notes:</p>
              <p>
                Public ferry services usually{" "}
                <strong>depart from the French side</strong>. If using private
                charters or airport transfers on the Dutch side, check with your
                provider about accepted payment methods.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">
                Recommendations:
              </p>
              <p>
                Bring <strong>cash</strong> for all parts of your journey and
                confirm details with your operator ahead of time.
              </p>
            </div>
          </div>
        </div>

        <div className="text-right mt-10">
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
