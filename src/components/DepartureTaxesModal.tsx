import React from 'react'
import {
  XIcon,
  ArrowRightLeftIcon,
  InfoIcon,
} from 'lucide-react'

interface DepartureTaxesModalProps {
  onClose: () => void
}

export const DepartureTaxesModal: React.FC<DepartureTaxesModalProps> = ({ onClose }) => {
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

        {/* Modal Title */}
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <InfoIcon className="h-6 w-6 text-blue-400" />
          Departure Taxes
        </h2>

        {/* Content */}
        <div className="space-y-8 text-sm sm:text-base text-gray-300 leading-relaxed">

          {/* Marigot → Anguilla */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <ArrowRightLeftIcon className="h-5 w-5 text-teal-300" />
              Marigot → Anguilla
            </h3>
            <p>
              <span className="text-white font-medium">Passenger Head Fee (Ages 4+):</span>{' '}
              <span className="text-green-300 font-medium">€7</span> (approx. <span className="text-blue-300">$7.50 USD</span>)
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Payable only in euros or by <strong>card</strong> at the Marigot terminal. <span className="text-red-400">USD not accepted</span>.
            </p>
          </div>

          <hr className="border-gray-700" />

          {/* Anguilla → Marigot */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <ArrowRightLeftIcon className="h-5 w-5 text-orange-300" />
              Anguilla → Marigot
            </h3>

            <div className="mb-4">
              <p className="font-medium text-white mb-2">Visitors staying more than 12 hours:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><span className="text-white">Adults (12+):</span> <span className="text-yellow-300">$28 USD</span></li>
                <li><span className="text-white">Children (5–11):</span> $15 USD</li>
                <li><span className="text-white">Children (2–4):</span> $3 USD</li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-white mb-2">Day Trippers & Residents:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><span className="text-white">Adults (12+):</span> <span className="text-green-300">$11 USD</span></li>
                <li><span className="text-white">Children (2–11):</span> $3 USD</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
