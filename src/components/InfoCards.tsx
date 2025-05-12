import React from 'react';
import { FileTextIcon, TagIcon, CreditCardIcon, ShieldIcon, PackageIcon, BoxIcon } from 'lucide-react';
export function InfoCards() {
  const cards = [{
    title: 'Travel Documents',
    description: 'Pay via mage eon as ad wey nasts',
    icon: FileTextIcon
  }, {
    title: 'Ferry Prices',
    description: 'Pricies are as bizs activities area more',
    icon: TagIcon
  }, {
    title: 'Departure Tax',
    description: 'Excilique D.Sc them toaclained are colars',
    icon: BoxIcon
  }, {
    title: 'How to Pay',
    description: 'Check payment desomaps ase fast',
    icon: CreditCardIcon
  }, {
    title: 'Security',
    description: 'Located sract ergenatics',
    icon: ShieldIcon
  }, {
    title: 'Amenities',
    description: 'Helptal irf feceday celres and community',
    icon: PackageIcon
  }];
  return <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8">Before You Board</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => <div key={index} className="bg-[#151923] p-6 rounded-xl hover:bg-[#1E2A3B] transition-colors">
            <card.icon className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">{card.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{card.description}</p>
            <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
              Learn more
            </button>
          </div>)}
      </div>
    </div>;
}