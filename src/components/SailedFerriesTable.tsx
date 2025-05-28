"use client";

import React from "react";
import { FerryItem } from "./FerryProps";
import { formatTime12Hour } from "@/helpers/formatTime12Hour";

interface SailedFerriesTableProps {
  ferries: FerryItem[];
  localNow: Date;
}

export function SailedFerriesTable({
  ferries,
  localNow,
}: SailedFerriesTableProps) {
  return (
    <div className="p-0">
      <div className="overflow-x-auto">
        {ferries.length > 0 ? (
          <table className="w-full text-sm text-white">
            <thead className="text-left text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-3 pr-4">Ferry</th>
                <th className="py-3 pr-4">Origin</th>
                <th className="py-3 pr-4">Destination</th>
                <th className="py-3 pr-4">Departure</th>
                <th className="py-3 pr-4">ETA</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {ferries.map((ferry) => {
                const departure = ferry.departure_time
                  ? formatTime12Hour(ferry.departure_time)
                  : "—";

                let eta = "—";
                let hasSailed = false;

                try {
                  if (ferry.departure_time && ferry.duration && localNow) {
                    const [h, m] = ferry.duration.split(":").map(Number);
                    const depDate = new Date(
                      `1970-01-01T${ferry.departure_time}`
                    );
                    const etaDate = new Date(
                      depDate.getTime() + (h * 60 + m) * 60000
                    );

                    eta = formatTime12Hour(
                      etaDate.toISOString().substring(11, 16)
                    );

                    // Ensure both dates are valid
                    if (
                      !isNaN(etaDate.getTime()) &&
                      !isNaN(localNow.getTime())
                    ) {
                      hasSailed = etaDate.getTime() <= localNow.getTime();
                    }
                  }
                } catch (error) {
                  console.error("Error calculating ETA or hasSailed:", error);
                }

                return (
                  <tr key={ferry.id} className="hover:bg-[#1C2533] transition">
                    <td className="py-3 pr-4 font-medium">{ferry.operator}</td>
                    <td className="py-3 pr-4">
                      {ferry.departure_port?.split(",")[0] || "—"}
                    </td>
                    <td className="py-3 pr-4">
                      {ferry.arrival_port?.split(",")[0] || "—"}
                    </td>
                    <td className="py-3 pr-4">{departure}</td>
                    <td className="py-3 pr-4">{eta}</td>
                    <td className="py-3 pr-4">
                      {hasSailed ? (
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                          SAILED
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">SAILING</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-sm mt-4">
            No ferries have sailed for this day.
          </p>
        )}
      </div>
    </div>
  );
}
