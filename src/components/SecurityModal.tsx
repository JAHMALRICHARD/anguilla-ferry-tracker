import React from 'react'
import {
  XIcon,
  ShieldCheckIcon,
  LuggageIcon,
  UserCheckIcon,
} from 'lucide-react'

interface SecurityModalProps {
  onClose: () => void
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ onClose }) => {
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
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <ShieldCheckIcon className="h-6 w-6 text-blue-400" />
          Terminal Security Procedures
        </h2>

        {/* Content */}
        <div className="space-y-10 text-sm sm:text-base text-gray-300 leading-relaxed">
          {/* Anguilla Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <LuggageIcon className="h-5 w-5 text-green-400" />
              Blowing Point Ferry Terminal (Anguilla)
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li>
                <span className="text-white font-medium">Security Measures:</span> Enhanced screening protocols for passengers and luggage are in place.
              </li>
              <li>
                <span className="text-white font-medium">Baggage Handling:</span> Only baggage accompanied by a valid ferry ticket may be loaded onto luggage carts.
              </li>
            </ul>
          </div>

          <hr className="border-gray-700" />

          {/* St. Martin Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <UserCheckIcon className="h-5 w-5 text-yellow-300" />
              Marigot Ferry Terminal (St. Martin)
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li>
                <span className="text-white font-medium">Security Measures:</span> Standard bag checks and identity verification may be conducted.
              </li>
              <li>
                <span className="text-white font-medium">Personal Safety:</span> The terminal is generally safe, but be mindful of surroundings during early morning or late-night hours.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
