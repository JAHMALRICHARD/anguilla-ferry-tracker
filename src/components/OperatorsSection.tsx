"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Phone, Mail, Ship } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function OperatorsSection() {
  const operators = [
    {
      name: "Calypso Charters",
      description: "Reliable and fast shared service to St. Martin.",
      slug: "calypso",
      base: "Blowing Point",
      frequency: "Every 45 mins",
    },
    {
      name: "GB Ferries",
      description: "Modern vessels with daily scheduled trips.",
      slug: "gbferries",
      base: "Road Bay",
      frequency: "Every 2 hrs",
    },
    {
      name: "Fun Time Charters",
      description: "Comfortable rides with flexible timing.",
      slug: "funtime",
      base: "Blowing Point",
      frequency: "Hourly",
    },
  ];

  return (
    <div className="pt-12 mb-16 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-8">Shared Charter Operators</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {operators.map((operator) => (
          <Card
            key={operator.slug}
            className="w-full overflow-hidden transition-all duration-300 hover:shadow-md shadow-sm"
          >
            {/* Placeholder Image */}
            <div className="relative aspect-[2/1] w-full bg-gray-100">
              <Image
                src="/placeholder-ferry.jpg" // Replace with your generated mockup or use `https://via.placeholder.com/400x200`
                alt={`${operator.name} ferry image`}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-3 right-3 bg-blue-600 text-white border-0 rounded-full">
                Shared Charter Operator
              </Badge>
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold tracking-tight text-primary">
                  {operator.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Ship className="w-4 h-4 text-blue-500" />
                  <span>{operator.frequency}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {operator.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>{operator.base}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{operator.frequency}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t border-border pt-4 pb-4 bg-muted dark:bg-muted/40">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-blue-700 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-500 dark:hover:bg-blue-900"
              >
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </Button>
              <Link href={`/ferry-operators/${operator.slug}`} passHref>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-blue-700 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-500 dark:hover:bg-blue-900"
                >
                  <Mail className="h-4 w-4" />
                  <span>View Details</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
