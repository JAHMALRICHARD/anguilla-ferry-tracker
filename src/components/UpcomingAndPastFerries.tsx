"use client";

import React from "react";
import { ScheduledFerriesTable } from "../components/ScheduledFerriesTable";
import { SailedFerriesTable } from "../components/SailedFerriesTable";
import { FerryItem } from "../components/FerryProps";
import { getFerriesForRoute } from "../components/RouteDateAndSearchBar";

interface UpcomingAndPastFerriesProps {
  upcomingFerries: FerryItem[];
  pastFerries: FerryItem[];
  route: { from: string; to: string }; // ✅ added route
  localNow: Date;
  onDetails: (ferry: FerryItem) => void;
}

export default function UpcomingAndPastFerries({
  upcomingFerries,
  pastFerries,
  route,
  localNow,
  onDetails,
}: UpcomingAndPastFerriesProps) {
  // ✅ Apply route-based logic to adjust display
  const adjustedUpcomingFerries = getFerriesForRoute(route.to, upcomingFerries);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
      {/* Scheduled Ferries */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">
          Scheduled Ferries
        </h3>
        <div className="rounded-xl overflow-x-auto">
          <ScheduledFerriesTable
            ferries={adjustedUpcomingFerries}
            onDetails={onDetails}
          />
        </div>
      </div>

      {/* Sailed Ferries */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Sailed Ferries</h3>
        <div className="rounded-xl overflow-x-auto">
          <SailedFerriesTable ferries={pastFerries} localNow={localNow} />
        </div>
      </div>
    </div>
  );
}
