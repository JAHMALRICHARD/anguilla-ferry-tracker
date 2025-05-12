import React from 'react'
import { XIcon, ShipWheelIcon, DollarSignIcon, InfoIcon } from 'lucide-react'

interface FerryPriceModalProps {
  onClose: () => void
}

export const FerryPriceModal: React.FC<FerryPriceModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-[#151923] max-w-2xl w-full rounded-2xl shadow-2xl p-8 relative border border-gray-700 text-white font-sans">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          title="Close"
        >
          <XIcon className="h-5 w-5" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <ShipWheelIcon className="h-6 w-6 text-blue-400" />
          Ferry Prices
        </h2>

        {/* Pricing Section */}
        <div className="space-y-6 text-sm sm:text-base text-gray-300 leading-relaxed">
          <div className="flex items-start gap-4">
            <DollarSignIcon className="h-5 w-5 mt-1 text-green-400" />
            <ul className="list-disc list-inside space-y-1">
              <li>
                <span className="text-white font-medium">Adults (12+):</span> $30 USD (one-way)
              </li>
              <li>
                <span className="text-white font-medium">Children (2–11):</span> $15 USD (one-way)
              </li>
            </ul>
          </div>

          {/* Notice */}
          <div className="flex items-start gap-4 text-gray-400 italic">
            <InfoIcon className="h-5 w-5 mt-1 text-yellow-300" />
            <p>
              Tickets are only available at the ferry terminal. Online reservations are not currently supported for the public ferry.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
