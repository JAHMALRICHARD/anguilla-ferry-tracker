import React from 'react'
import { XIcon, CreditCardIcon, WalletIcon, EuroIcon } from 'lucide-react'

interface HowToPayModalProps {
  onClose: () => void
}

export const HowToPayModal: React.FC<HowToPayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-[#151923] max-w-3xl w-full rounded-2xl shadow-2xl p-8 relative border border-gray-700 text-white font-sans">
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

        <div className="space-y-10 text-sm sm:text-base text-gray-300 leading-relaxed">

          {/* Blowing Point Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <WalletIcon className="h-5 w-5 text-green-400" />
              Blowing Point Ferry Terminal (Anguilla)
            </h3>

            <div className="mb-4">
              <p className="text-white font-medium mb-1">Payment Methods for Public Ferry:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>💵 <span className="font-medium text-white">Cash (USD or XCD)</span> is accepted.</li>
                <li>❌ <span className="text-red-400 font-medium">Credit/debit cards are not accepted</span> for public ferry tickets</li>
                 <li>🎫 <span className="text-green-400 font-medium"> Cash & Credit/debit cards are accepted</span> to pay departure tax.</li>
                <li>🛥️ Private charters (Calypso, Funtime, GB Express) <span className="text-white">may support cards or online booking</span>.</li>
              </ul>
            </div>

            <div className="mb-4">
              <p className="text-white font-medium mb-1">What You’ll Pay:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>🎫 Ferry Fare: $30 USD (adults), $15 USD (children) — one-way</li>
                <li>🧾 Departure Tax: $28 USD (visitors), $11 USD (residents/day trippers)</li>
              </ul>
            </div>

            <div>
              <p className="text-white font-medium mb-1">Where to Pay:</p>
              <p>
                All payments are made <span className="font-medium text-white">in person</span> at the terminal counter using <span className="font-medium text-white">cash only</span>.
              </p>
            </div>
          </div>

          <hr className="border-gray-700" />

          {/* Marigot Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <EuroIcon className="h-5 w-5 text-yellow-300" />
              Marigot Ferry Terminal (St. Martin – French Side)
            </h3>

            <div className="mb-4">
              <p className="text-white font-medium mb-1">Payment Methods:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>🛳️ Ferry Fare: Paid <span className="text-white font-medium">on board</span> — <span className="text-white font-medium">USD cash only</span>.</li>
                <li>🏷️ Head Tax (€7): Paid at the terminal — <span className="font-medium text-white">Card (Visa/MasterCard) or Euros only</span>. <span className="text-red-400 font-medium">USD not accepted.</span></li>
              </ul>
            </div>

            <div className="mb-4">
              <p className="text-white font-medium mb-1">What You’ll Pay:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>🎫 Ferry Fare: $30 USD (adults), $15 USD (children) — USD cash only</li>
                <li>🧾 Head Tax: €7 per person — paid before boarding</li>
              </ul>
            </div>

            <div>
              <p className="text-white font-medium mb-1">Where to Pay:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>🏷️ Head Tax: At the terminal counter <span className="font-medium text-white">before departure</span>.</li>
                <li>🛳️ Ferry Fare: <span className="font-medium text-white">Paid on board</span> directly to the operator.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
