"use client";

import React, { useEffect, useState } from "react";
import { FerryItem } from "./FerryProps";
import { formatTime12Hour } from "@/helpers/formatTime12Hour";

interface SailedFerriesTableProps {
  ferries: FerryItem[];
  localNow: Date;
}

export function SailedFerriesTable({ ferries }: SailedFerriesTableProps) {
  const [localNow, setLocalNow] = useState(new Date());

  // ⏱ Auto-update time every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalNow(new Date());
    }, 60000); // every 1 minute

    return () => clearInterval(interval);
  }, []);

  const ferriesWithETA = ferries
    .map((ferry) => {
      const [depHour, depMin] = ferry.departure_time
        ?.split(":")
        .map(Number) || [0, 0];
      const [durHour, durMin] = ferry.duration?.split(":").map(Number) || [
        0, 0,
      ];

      const depDate = new Date(localNow);
      depDate.setHours(depHour, depMin, 0, 0);

      const etaDate = new Date(
        depDate.getTime() + (durHour * 60 + durMin) * 60000
      );

      return { ...ferry, etaDate };
    })
    .sort((a, b) => b.etaDate.getTime() - a.etaDate.getTime());

  return (
    <div className="p-0">
      <div className="overflow-x-auto">
        {ferriesWithETA.length > 0 ? (
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
              {ferriesWithETA.map((ferry) => {
                const departure = ferry.departure_time
                  ? formatTime12Hour(ferry.departure_time)
                  : "—";

                const eta = formatTime12Hour(
                  ferry.etaDate.toTimeString().substring(0, 5)
                );

                const hasSailed = ferry.etaDate.getTime() <= localNow.getTime();

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
