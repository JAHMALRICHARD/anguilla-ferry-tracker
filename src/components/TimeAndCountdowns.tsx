"use client";

import React, { useEffect, useState } from "react";
import { FerryItem } from "./FerryProps";
import { formatTime12Hour } from "@/helpers/formatTime12Hour";

interface TimeAndCountdownsProps {
  ferries: FerryItem[];
  selectedDate: Date;
}

export default function TimeAndCountdowns({
  ferries,
  selectedDate,
}: TimeAndCountdownsProps) {
  const [localTime, setLocalTime] = useState(new Date());

  // ✅ Use actual local time, not selectedDate hybrid
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Normalize ferry data and calculate full departure Date
  const futureFerries = ferries
    .map((ferry) => {
      const [depHour, depMinute] = ferry.departure_time
        .trim()
        .split(":")
        .map(Number);
      const [year, month, day] = ferry.schedule_date.split("-").map(Number);
      const depDate = new Date(year, month - 1, day, depHour, depMinute);
      depDate.setHours(depHour, depMinute, 0, 0);
      return { ...ferry, depDate };
    })
    .filter((ferry) => {
      const sameDay =
        new Date(ferry.depDate).toDateString() ===
        new Date(selectedDate).toDateString();
      return sameDay && ferry.depDate > localTime;
    })
    .sort((a, b) => a.depDate.getTime() - b.depDate.getTime());

  const nextFerry = futureFerries.length > 0 ? futureFerries[0] : null;

  // ✅ Calculate Cut-Off Time (5 mins before departure)
  const cutoffTime = nextFerry
    ? new Date(nextFerry.depDate.getTime() - 5 * 60 * 1000)
    : null;

  return (
    <div className="flex flex-wrap gap-4 justify-between max-w-5xl mx-auto px-4 py-6">
      {/* Card 1: Current Time */}
      <div className="flex-1 min-w-[160px] bg-[#112238] text-white rounded-xl p-4 text-center shadow-md">
        <p className="text-xs uppercase text-gray-300 tracking-widest mb-1">
          Local Time
        </p>
        <p className="text-2xl font-semibold">
          {formatTime12Hour(localTime.toTimeString().substring(0, 5))}
        </p>
      </div>

      {/* Card 2: Cut Off Time */}
      <div className="flex-1 min-w-[160px] bg-[#112238] text-white rounded-xl p-4 text-center shadow-md">
        <p className="text-xs uppercase text-gray-300 tracking-widest mb-1">
          Ferry Cut Off Time
        </p>
        <p className="text-2xl font-semibold">
          {cutoffTime
            ? formatTime12Hour(cutoffTime.toTimeString().substring(0, 5))
            : "--:--"}
        </p>
      </div>

      {/* Card 3: Next Departure Time */}
      <div className="flex-1 min-w-[160px] bg-[#112238] text-white rounded-xl p-4 text-center shadow-md">
        <p className="text-xs uppercase text-gray-300 tracking-widest mb-1">
          Next Departure Time
        </p>
        <p className="text-2xl font-semibold">
          {nextFerry
            ? formatTime12Hour(nextFerry.depDate.toTimeString().substring(0, 5))
            : "--:--"}
        </p>
      </div>

      {/* Card 4: Next Ferry Operator */}
      <div className="flex-1 min-w-[160px] bg-[#112238] text-white rounded-xl p-4 text-center shadow-md">
        <p className="text-xs uppercase text-gray-300 tracking-widest mb-1">
          Next Ferry Operator
        </p>
        <p className="text-2xl font-semibold">
          {nextFerry ? nextFerry.operator : "--"}
        </p>
      </div>
    </div>
  );
}
