import React from 'react'
import {
  XIcon,
  MapPinIcon,
  BadgeCheckIcon,
  InfoIcon,
} from 'lucide-react'

interface AmenitiesModalProps {
  onClose: () => void
}

export const AmenitiesModal: React.FC<AmenitiesModalProps> = ({ onClose }) => {
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
          <MapPinIcon className="h-6 w-6 text-blue-400" />
          Terminal Amenities
        </h2>

        <div className="space-y-10 text-sm sm:text-base text-gray-300 leading-relaxed">

          {/* Anguilla Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <BadgeCheckIcon className="h-5 w-5 text-yellow-400" />
              Blowing Point Ferry Terminal (Anguilla)
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li><span className="text-white font-medium">🏢 Modern Facilities:</span> Spacious, air-conditioned waiting area with ocean-facing views.</li>
              <li><span className="text-white font-medium">🎟️ Ticketing Services:</span> In-person counters for public and private ferries. Staff assist with schedules and taxes.</li>
              <li><span className="text-white font-medium">🛂 Customs & Immigration:</span> Organized lanes for residents and visitors on arrival and departure.</li>
              <li><span className="text-white font-medium">🚻 Restrooms:</span> Clean and accessible facilities within the terminal.</li>
              <li><span className="text-white font-medium">📶 Wi-Fi & Charging:</span> Limited access — bring a power bank just in case.</li>
              <li><span className="text-white font-medium">🅿️ Parking & Taxis:</span> Short- and long-term parking available. Taxis are stationed right outside.</li>
              <li><span className="text-white font-medium">♿ Accessibility:</span> Ramps and accessible restrooms available throughout the terminal.</li>
              <li><span className="text-white font-medium">☕ Shops & Refreshments:</span> Small café available; retail vendors coming soon.</li>
            </ul>
          </div>

          <hr className="border-gray-700" />

          {/* Marigot Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <InfoIcon className="h-5 w-5 text-cyan-300" />
              Marigot Ferry Terminal (St. Martin – French Side)
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li><span className="text-white font-medium">🎟️ Ticketing & Info Counters:</span> Basic services; head tax paid via card or euros only.</li>
              <li><span className="text-white font-medium">🛂 Customs & Border Control:</span> French passport checks for arrivals and departures.</li>
              <li><span className="text-white font-medium">🪑 Waiting Area:</span> Covered seating available outdoors (not air-conditioned).</li>
              <li><span className="text-white font-medium">🚻 Restrooms:</span> Available but can be limited in cleanliness during busy periods.</li>
              <li><span className="text-white font-medium">🍴 Food & Drink Nearby:</span> Several cafés and bakeries within walking distance in downtown Marigot.</li>
              <li><span className="text-white font-medium">💳 Currency & Payments:</span> Euros and cards only. USD is <span className="text-red-400 font-medium">not accepted</span>.</li>
              <li><span className="text-white font-medium">🚌 Transportation Options:</span> Taxis nearby; buses and rental cars available within a few blocks.</li>
              <li><span className="text-white font-medium">♿ Accessibility:</span> Limited ramps; moderately walkable but less accessible for wheelchairs.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
