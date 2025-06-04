"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Ship, CalendarDays } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/utils/supabase";

interface FerryCharter {
  id: string;
  slug: string;
  name: string;
  description: string;
  hero_image_url: string | null;
  base?: string;
  frequency?: string;
  booking_url?: string;
  contact_phone?: string;
  contact_email?: string;
}

export function OperatorsSection() {
  const [operators, setOperators] = useState<FerryCharter[]>([]);

  useEffect(() => {
    async function fetchOperators() {
      const { data, error } = await supabase.from("ferry_charters").select("*");

      if (error) {
        console.error("Error fetching operators:", error);
      } else {
        setOperators(data || []);
      }
    }

    fetchOperators();
  }, []);

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 text-foreground">
        Shared Charter Operators
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {operators.map((operator) => (
          <Card
            key={operator.id}
            className="w-full overflow-hidden transition-all duration-300 hover:shadow-md shadow-sm bg-card"
          >
            <div className="relative aspect-[2/1] w-full bg-muted">
              <Image
                src={operator.hero_image_url || "/placeholder-ferry.jpg"}
                alt={`${operator.name} ferry image`}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-3 right-3 px-4 py-1 text-sm font-semibold tracking-wide rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:shadow-lg transition-shadow duration-300">
                Shared Charter Operator
              </Badge>
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {operator.name}
                </h3>
                <div className="flex items-center gap-1 text-base text-muted-foreground">
                  <Ship className="w-4 h-4 opacity-70" />
                  <span>{operator.frequency || "Regular Schedule"}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-base text-muted-foreground leading-relaxed">
                {operator.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-base text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 opacity-70" />
                  <span>{operator.base || "Blowing Point"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 opacity-70" />
                  <span>{operator.frequency || "Hourly"}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 border-t border-border pt-4 pb-4 bg-muted/50">
              <Link
                href={`/ferry-operators/${operator.slug}#schedule`}
                passHref
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-base px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <CalendarDays className="h-5 w-5" />
                  <span>View Schedule</span>
                </Button>
              </Link>

              <Link href={`/ferry-operators/${operator.slug}`} passHref>
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-base px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <Ship className="h-5 w-5" />
                  <span>More Details</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
