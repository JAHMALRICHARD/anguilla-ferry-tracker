import React, { useState } from 'react';
import { FileTextIcon, TagIcon, CreditCardIcon, ShieldIcon, PackageIcon, BoxIcon } from 'lucide-react';
import { TravelDocumentsModal } from './TravelDocumentsModal'; 
import { FerryPriceModal } from './FerryPriceModal'
import { DepartureTaxesModal } from './DepartureTaxesModal'
import { SecurityModal } from './SecurityModal'
import { AmenitiesModal } from './AmenitiesModal'
import { HowToPayModal } from './HowToPayModal'
export function InfoCards() {
  const cards = [{
  title: 'Travel Documents',
  description: 'What you need before you board a ferry.',
  icon: FileTextIcon
}, {
  title: 'Ferry Prices',
  description: 'Know the ferry costs before you sail.',
  icon: TagIcon
}, {
  title: 'Departure Taxes',
  description: 'Fees you’ll pay before boarding.',
  icon: BoxIcon
}, {
  title: 'How to Pay',
  description: 'Know how to pay before you board.',
  icon: CreditCardIcon
}, {
  title: 'Security',
  description: 'Know the security measures at each port.',
  icon: ShieldIcon
}, {
  title: 'Amenities',
  description: ' View the convenience, & amenenties at the ports.',
  icon: PackageIcon
}];

  const [showTravelDocsModal, setShowTravelDocsModal] = useState(false)
  const [showFerryPriceModal, setShowFerryPriceModal] = useState(false)
  const [showDepartureTaxesModal, setShowDepartureTaxesModal] = useState(false)
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false)
  const [showHowToPayModal, setShowHowToPayModal] = useState(false)

  return <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8">Before You Board</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
  <div
    key={index}
    className="bg-[#151923] p-6 rounded-xl hover:bg-[#1E2A3B] transition-colors"
  >
    <card.icon className="h-8 w-8 text-blue-500 mb-4" />
    <h3 className="text-lg font-medium mb-2">{card.title}</h3>
    <p className="text-gray-400 text-sm mb-4">{card.description}</p>
    <button
      className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
      onClick={() => {
          if (card.title === 'Travel Documents') {
            setShowTravelDocsModal(true)
          } else if (card.title === 'Ferry Prices') {
            setShowFerryPriceModal(true)
          } else if (card.title === 'Departure Taxes') {
            setShowDepartureTaxesModal(true)
          }
          else if (card.title === 'Security') {
            setShowSecurityModal(true)
          }
          else if (card.title === 'Amenities') {
            setShowAmenitiesModal(true)
          }
          else if (card.title === 'How to Pay') {
            setShowHowToPayModal(true)
          }

        }}
    >
      Learn more
    </button>
  </div>
))}

      {showTravelDocsModal && (
        <TravelDocumentsModal onClose={() => setShowTravelDocsModal(false)} />
      )}

      {showFerryPriceModal && (
        <FerryPriceModal onClose={() => setShowFerryPriceModal(false)} />
      )}

      {showDepartureTaxesModal && (
        <DepartureTaxesModal onClose={() => setShowDepartureTaxesModal(false)} />
      )}

      {showSecurityModal && (
        <SecurityModal onClose={() => setShowSecurityModal(false)} />
      )}
      {showAmenitiesModal && (
        <AmenitiesModal onClose={() => setShowAmenitiesModal(false)} />
      )}
      {showHowToPayModal && (
        <HowToPayModal onClose={() => setShowHowToPayModal(false)} />
      )}

    </div>
    </div>;
    
}

