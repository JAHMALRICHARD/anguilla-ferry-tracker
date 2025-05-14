import React, { useEffect } from "react";
import {
  XIcon,
  CreditCardIcon,
  WalletIcon,
  EuroIcon,
  BanknoteIcon,
  BadgeDollarSignIcon,
  TerminalIcon,
  HandCoinsIcon,
} from "lucide-react";

interface HowToPayModalProps {
  onClose: () => void;
}

export const HowToPayModal: React.FC<HowToPayModalProps> = ({ onClose }) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-[#151923] max-w-5xl w-full rounded-2xl shadow-2xl p-8 relative border border-gray-700 text-white font-sans overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          title="Close"
        >
          <XIcon className="h-5 w-5" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <CreditCardIcon className="h-6 w-6 text-blue-400" />
          How to Pay
        </h2>

        {/* Side-by-Side Content */}
        <div className="flex flex-col md:flex-row gap-10 text-sm sm:text-base text-gray-300 leading-relaxed">
          {/* Blowing Point Section */}
          <div className="w-full md:w-1/2 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <WalletIcon className="h-5 w-5 text-green-400" />
                Blowing Point Ferry Terminal (Anguilla)
              </h3>

              <div className="mb-4">
                <p className="text-white font-medium mb-2">Payment Methods:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <BanknoteIcon className="h-4 w-4 text-green-400 mt-1" />{" "}
                    <span>Cash (USD or XCD) accepted.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CreditCardIcon className="h-4 w-4 text-red-400 mt-1" />{" "}
                    <span>
                      Cards <strong>not accepted</strong> for public ferry
                      tickets.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeDollarSignIcon className="h-4 w-4 text-green-400 mt-1" />{" "}
                    <span>
                      Cards accepted for <strong>departure tax</strong> payment.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <HandCoinsIcon className="h-4 w-4 text-blue-400 mt-1" />{" "}
                    <span>
                      Private charters <strong>may support cards</strong> or
                      online payment.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <p className="text-white font-medium mb-2">What You’ll Pay:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <BadgeDollarSignIcon className="h-4 w-4 text-white mt-1" />{" "}
                    <span>
                      Ferry Fare: $30 USD (adults), $15 USD (children)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TerminalIcon className="h-4 w-4 text-white mt-1" />{" "}
                    <span>
                      Departure Tax: $28 USD (visitors), $11 USD (residents)
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-white font-medium mb-2">Where to Pay:</p>
                <p>
                  <strong>In person</strong> at the terminal counter using{" "}
                  <strong>cash only</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:flex w-px bg-gray-700 mx-2" />

          {/* Marigot Section */}
          <div className="w-full md:w-1/2 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <EuroIcon className="h-5 w-5 text-yellow-300" />
                Marigot Ferry Terminal (St. Martin)
              </h3>

              <div className="mb-4">
                <p className="text-white font-medium mb-2">Payment Methods:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <BanknoteIcon className="h-4 w-4 text-green-400 mt-1" />{" "}
                    <span>
                      Ferry Fare paid <strong>on board</strong> —{" "}
                      <strong>USD cash only</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CreditCardIcon className="h-4 w-4 text-yellow-300 mt-1" />{" "}
                    <span>
                      Head Tax (€7) paid at the terminal —{" "}
                      <strong>Card (Visa/MasterCard) or Euros only</strong>. USD
                      not accepted.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <p className="text-white font-medium mb-2">What You’ll Pay:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <BadgeDollarSignIcon className="h-4 w-4 text-white mt-1" />{" "}
                    <span>
                      Ferry Fare: $30 USD (adults), $15 USD (children)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TerminalIcon className="h-4 w-4 text-white mt-1" />{" "}
                    <span>Head Tax: €7 per person — paid before boarding</span>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-white font-medium mb-2">Where to Pay:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <TerminalIcon className="h-4 w-4 text-white mt-1" />{" "}
                    <span>
                      Head Tax at the terminal counter{" "}
                      <strong>before departure</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BanknoteIcon className="h-4 w-4 text-white mt-1" />{" "}
                    <span>
                      Ferry Fare <strong>paid on board</strong> to the operator.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
