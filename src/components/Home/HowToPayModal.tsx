"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  CreditCardIcon,
  WalletIcon,
  EuroIcon,
  BanknoteIcon,
  BadgeDollarSignIcon,
  TerminalIcon,
  HandCoinsIcon,
} from "lucide-react";

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
      <DialogContent className="w-full max-w-5xl sm:max-w-5xl md:max-w-5xl lg:max-w-5xl xl:max-w-5xl 2xl:max-w-5xl bg-background text-foreground font-sans px-10 py-12 border border-border rounded-2xl shadow-2xl">
        <DialogTitle className="sr-only">
          <span className="flex items-center gap-2">
            <CreditCardIcon className="h-6 w-6 text-primary" />
            How to Pay
          </span>
        </DialogTitle>

        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <CreditCardIcon className="h-6 w-6 text-primary" />
          How to Pay
        </h2>

        <div className="flex flex-col md:flex-row gap-12 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {/* Blowing Point Section */}
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <WalletIcon className="h-5 w-5 text-green-400" />
              Blowing Point Ferry Terminal (Anguilla)
            </h3>

            <div>
              <p className="font-medium text-foreground mb-2">
                Payment Methods:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <BanknoteIcon className="h-4 w-4 text-green-400 mt-1" />
                  Cash (USD or XCD) accepted.
                </li>
                <li className="flex items-start gap-2">
                  <CreditCardIcon className="h-4 w-4 text-red-400 mt-1" />
                  Cards <strong>not accepted</strong> for public ferry tickets.
                </li>
                <li className="flex items-start gap-2">
                  <BadgeDollarSignIcon className="h-4 w-4 text-green-400 mt-1" />
                  Cards accepted for <strong>departure tax</strong> payment.
                </li>
                <li className="flex items-start gap-2">
                  <HandCoinsIcon className="h-4 w-4 text-blue-400 mt-1" />
                  Private charters <strong>may support cards</strong> or online
                  payment.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-foreground mb-2">
                What You’ll Pay:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <BadgeDollarSignIcon className="h-4 w-4 text-primary mt-1" />
                  Ferry Fare: $30 USD (adults), $15 USD (children)
                </li>
                <li className="flex items-start gap-2">
                  <TerminalIcon className="h-4 w-4 text-primary mt-1" />
                  Departure Tax: $28 USD (visitors), $11 USD (residents)
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-foreground mb-2">Where to Pay:</p>
              <p>
                <strong>In person</strong> at the terminal counter using{" "}
                <strong>cash only</strong>.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:flex w-px bg-border mx-2" />

          {/* Marigot Section */}
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <EuroIcon className="h-5 w-5 text-yellow-300" />
              Marigot Ferry Terminal (St. Martin)
            </h3>

            <div>
              <p className="font-medium text-foreground mb-2">
                Payment Methods:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <BanknoteIcon className="h-4 w-4 text-green-400 mt-1" />
                  Ferry Fare paid <strong>on board</strong> —{" "}
                  <strong>USD cash only</strong>.
                </li>
                <li className="flex items-start gap-2">
                  <CreditCardIcon className="h-4 w-4 text-yellow-300 mt-1" />
                  Head Tax (€7) paid at the terminal —{" "}
                  <strong>Card (Visa/MasterCard) or Euros only</strong>. USD not
                  accepted.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-foreground mb-2">
                What You’ll Pay:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <BadgeDollarSignIcon className="h-4 w-4 text-primary mt-1" />
                  Ferry Fare: $30 USD (adults), $15 USD (children)
                </li>
                <li className="flex items-start gap-2">
                  <TerminalIcon className="h-4 w-4 text-primary mt-1" />
                  Head Tax: €7 per person — paid before boarding
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-foreground mb-2">Where to Pay:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <TerminalIcon className="h-4 w-4 text-primary mt-1" />
                  Head Tax at the terminal counter{" "}
                  <strong>before departure</strong>.
                </li>
                <li className="flex items-start gap-2">
                  <BanknoteIcon className="h-4 w-4 text-primary mt-1" />
                  Ferry Fare <strong>paid on board</strong> to the operator.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
