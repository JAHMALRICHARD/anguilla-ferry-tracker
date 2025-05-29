"use client";

import React from "react";
import { ScheduledFerriesTable } from "../components/ScheduledFerriesTable";
import { SailedFerriesTable } from "../components/SailedFerriesTable";
import { FerryItem } from "../components/FerryProps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UpcomingAndPastFerriesProps {
  upcomingFerries: FerryItem[];
  pastFerries: FerryItem[];
  route: { from: string; to: string };
  localNow: Date;
  onDetails: (ferry: FerryItem) => void;
}

export default function UpcomingAndPastFerries({
  upcomingFerries,
  pastFerries,
  localNow,
  onDetails,
}: UpcomingAndPastFerriesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
      {/* Scheduled Ferries */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Ferries</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <ScheduledFerriesTable
            ferries={upcomingFerries}
            onDetails={onDetails}
          />
        </CardContent>
      </Card>

      {/* Sailed Ferries */}
      <Card>
        <CardHeader>
          <CardTitle>Sailed Ferries</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <SailedFerriesTable ferries={pastFerries} localNow={localNow} />
        </CardContent>
      </Card>
    </div>
  );
}
