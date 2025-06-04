"use client";

import React from "react";
import { ScheduledFerriesTable } from "@/components/Home/ScheduledFerriesTable";
import { SailedFerriesTable } from "@/components/Home/SailedFerriesTable";
import { FerryItem } from "@/types/FerryProps";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ make sure this exists

interface UpcomingAndPastFerriesProps {
  upcomingFerries: FerryItem[];
  pastFerries: FerryItem[];
  route: { from: string; to: string };
  localNow: Date;
  selectedDate: Date;
  searchQuery: string;
  onDetails: (ferry: FerryItem) => void;
  loading: boolean;
}

export default function UpcomingAndPastFerries({
  upcomingFerries,
  pastFerries,
  route,
  localNow,
  selectedDate,
  searchQuery,
  onDetails,
  loading, // ✅ now used
}: UpcomingAndPastFerriesProps) {
  const hasUpcoming = upcomingFerries.length > 0;
  const hasPast = pastFerries.length > 0;

  return (
    <div className="pt-12 mb-16">
      <h2 className="text-2xl font-bold mb-8">Public Ferry Schedule</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* Scheduled Ferries */}
        <Card>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <Skeleton className="w-full h-40 rounded-md" />
            ) : hasUpcoming ? (
              <ScheduledFerriesTable
                ferries={upcomingFerries}
                searchQuery={searchQuery}
                onDetails={onDetails}
              />
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                No scheduled ferries for this date.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sailed Ferries */}
        <Card>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <Skeleton className="w-full h-40 rounded-md" />
            ) : hasPast ? (
              <SailedFerriesTable
                ferries={pastFerries}
                localNow={localNow}
                searchQuery={searchQuery}
                selectedDate={selectedDate}
                direction={
                  route.to === "To Anguilla - via Marigot"
                    ? "to-anguilla"
                    : "to-st-martin"
                }
              />
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                No past ferries for this date.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
