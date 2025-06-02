"use client";

import React from "react";
import { ScheduledFerriesTable } from "../components/ScheduledFerriesTable";
import { SailedFerriesTable } from "../components/SailedFerriesTable";
import { FerryItem } from "../components/FerryProps";
import { Card, CardContent } from "@/components/ui/card";

interface UpcomingAndPastFerriesProps {
  upcomingFerries: FerryItem[];
  pastFerries: FerryItem[];
  route: { from: string; to: string };
  localNow: Date;
  selectedDate: Date;
  onDetails: (ferry: FerryItem) => void;
}

export default function UpcomingAndPastFerries({
  upcomingFerries,
  pastFerries,
  localNow,
  onDetails,
}: UpcomingAndPastFerriesProps) {
  const hasUpcoming = upcomingFerries.length > 0;
  const hasPast = pastFerries.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
      {/* Scheduled Ferries */}
      <Card>
        <CardContent className="overflow-x-auto">
          {hasUpcoming ? (
            <ScheduledFerriesTable
              ferries={upcomingFerries}
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
          {hasPast ? (
            <SailedFerriesTable ferries={pastFerries} localNow={localNow} />
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              No past ferries for this date.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
