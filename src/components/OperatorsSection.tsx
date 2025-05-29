"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function OperatorsSection() {
  const operators = [
    {
      name: "Calypso Charters",
      description: "Reliable and fast shared service to St. Martin.",
      logo: "/logos/anguilla-ferry-c-logo.svg",
      slug: "calypso",
    },
    {
      name: "GB Ferries",
      description: "Modern vessels with daily scheduled trips.",
      logo: "/logos/anguilla-ferry-g-logo.svg",
      slug: "gbferries",
    },
    {
      name: "Fun Time Charters",
      description: "Comfortable rides with flexible timing.",
      logo: "/logos/anguilla-ferry-f-logo.svg",
      slug: "funtime",
    },
  ];

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8">Shared Charter Operators</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {operators.map((operator) => (
          <Card
            key={operator.slug}
            className="flex flex-col justify-between h-full"
          >
            <CardContent className="p-6">
              <img
                src={operator.logo}
                alt={`${operator.name} logo`}
                className="w-12 h-12 rounded-full mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold mb-2">{operator.name}</h3>
              <p className="text-muted-foreground text-sm">
                {operator.description}
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0 mt-auto">
              <Link
                href={`/ferry-operators/${operator.slug}`}
                className="inline-block text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                View Details
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
