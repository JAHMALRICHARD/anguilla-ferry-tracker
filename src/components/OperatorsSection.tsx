import React from 'react';
export function OperatorsSection() {
  const operators = [{
    name: 'Azure Lines',
    description: 'Lifting marks with ooly deptr tere',
    logo: 'https://images.unsplash.com/photo-1533603208194-a3d5d437022e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  }, {
    name: 'Calypso Ferries',
    description: 'Feet our vetable iress labed service',
    logo: 'https://images.unsplash.com/photo-1534235261404-7625cd79bdb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  }, {
    name: 'Island Ferries',
    description: 'Attoresink, cose-ngle, mai por',
    logo: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  }];
  return <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8">Operators</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {operators.map((operator, index) => <div key={index} className="bg-[#151923] p-6 rounded-xl hover:bg-[#1E2A3B] transition-colors">
            <img src={operator.logo} alt={`${operator.name} logo`} className="w-12 h-12 rounded-full mb-4 object-cover" />
            <h3 className="text-lg font-medium mb-2">{operator.name}</h3>
            <p className="text-gray-400 text-sm">{operator.description}</p>
          </div>)}
      </div>
    </div>;
}