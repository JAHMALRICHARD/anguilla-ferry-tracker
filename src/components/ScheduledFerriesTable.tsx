"use client";

import React from "react";
import { FerryItem } from "./FerryProps";
import { formatTime12Hour } from "@/helpers/formatTime12Hour";

interface ScheduledFerriesTableProps {
  ferries: FerryItem[];
  onDetails: (ferry: FerryItem) => void;
}

export function ScheduledFerriesTable({
  ferries,
  onDetails,
}: ScheduledFerriesTableProps) {
  return (
    <div className="p-0">
      <div className="overflow-x-auto">
        {ferries.length > 0 ? (
          <table className="w-full text-sm text-white">
            <thead className="text-left text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-3 pr-4">Departure</th>
                <th className="py-3 pr-4">Ferry</th>
                <th className="py-3 pr-4">Origin</th>
                <th className="py-3 pr-4">Destination</th>
                <th className="py-3 pr-4">ETA</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {ferries.map((ferry) => {
                // Parse 24-hour departure time
                const [hourStr, minuteStr] = ferry.departure_time.split(":");
                const depHour = Number(hourStr);
                const depMinute = Number(minuteStr);

                const departure = formatTime12Hour(`${depHour}:${minuteStr}`);

                // Duration is expected to be in "HH:MM" format
                const [durHour, durMin] = ferry.duration.split(":").map(Number);
                const totalMinutes =
                  depHour * 60 + depMinute + durHour * 60 + durMin;

                const etaHour = Math.floor(totalMinutes / 60) % 24;
                const etaMinute = totalMinutes % 60;
                const eta = formatTime12Hour(
                  `${etaHour.toString().padStart(2, "0")}:${etaMinute
                    .toString()
                    .padStart(2, "0")}`
                );

                return (
                  <tr
                    key={ferry.id}
                    onClick={() => onDetails(ferry)}
                    className="hover:bg-[#1C2533] transition cursor-pointer"
                  >
                    <td className="py-3 pr-4">{departure}</td>
                    <td className="py-3 pr-4 font-medium">{ferry.operator}</td>
                    <td className="py-3 pr-4">
                      {ferry.departure_port.split(",")[0]}
                    </td>
                    <td className="py-3 pr-4">
                      {ferry.arrival_port.split(",")[0]}
                    </td>
                    <td className="py-3 pr-4">{eta}</td>
                    <td className="py-3 pr-4">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-semibold tracking-wide uppercase">
                        {ferry.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-sm mt-4">
            No ferries scheduled for this day.
          </p>
        )}
      </div>
    </div>
  );
}
