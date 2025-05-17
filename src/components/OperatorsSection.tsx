import React from "react";
import Link from "next/link";

export function OperatorsSection() {
  const operators = [
    {
      name: "Calypso Charters",
      description: "Lifting marks with ooly deptr tere",
      logo: "/logos/anguilla-ferry-c-logo.svg",
      slug: "calypso", // should match route
    },
    {
      name: "GB Ferries",
      description: "Feet our vetable iress labed service",
      logo: "/logos/anguilla-ferry-g-logo.svg",
      slug: "gbferries",
    },
    {
      name: "Fun Time Charters",
      description: "Attoresink, cose-ngle, mai por",
      logo: "/logos/anguilla-ferry-f-logo.svg",
      slug: "funtime",
    },
  ];

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8">Shared Charter Operators</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {operators.map((operator, index) => (
          <div
            key={index}
            className="bg-[#151923] p-6 rounded-xl hover:bg-[#1E2A3B] transition-colors flex flex-col justify-between"
          >
            <div>
              <img
                src={operator.logo}
                alt={`${operator.name} logo`}
                className="w-12 h-12 rounded-full mb-4 object-cover"
              />
              <h3 className="text-lg font-medium mb-2">{operator.name}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {operator.description}
              </p>
            </div>
            <Link
              href={`/ferry-operators/${operator.slug}`}
              className="mt-auto inline-block text-sm text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2 transition-colors"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
