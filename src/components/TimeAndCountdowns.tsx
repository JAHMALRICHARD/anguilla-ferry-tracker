"use client";

import React, { useEffect, useState } from "react";
import { FerryItem } from "@/types/FerryItem";
import { formatTime12Hour } from "@/helpers/formatTime12Hour";
import { Card, CardContent } from "@/components/ui/card";

interface TimeAndCountdownsProps {
  ferries: FerryItem[];
  selectedDate: Date;
}

export default function TimeAndCountdowns({
  ferries,
  selectedDate,
}: TimeAndCountdownsProps) {
  const [localTime, setLocalTime] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    setLocalTime(now); // Set once after mount to avoid hydration error

    const interval = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!localTime) return null; // Don't render until client time is available

  const futureFerries = ferries
    .map((ferry) => {
      const [depHour, depMinute] = ferry.departure_time
        .trim()
        .split(":")
        .map(Number);
      const [year, month, day] = ferry.schedule_date.split("-").map(Number);
      const depDate = new Date(year, month - 1, day, depHour, depMinute);
      return { ...ferry, depDate };
    })
    .filter((ferry) => {
      const sameDay =
        ferry.depDate.toDateString() === selectedDate.toDateString();
      return sameDay && ferry.depDate > localTime;
    })
    .sort((a, b) => a.depDate.getTime() - b.depDate.getTime());

  const nextFerry = futureFerries.length > 0 ? futureFerries[0] : null;

  const cutoffTime = nextFerry
    ? new Date(nextFerry.depDate.getTime() - 5 * 60 * 1000)
    : null;

  const cardData = [
    {
      title: "Local Time",
      value: formatTime12Hour(localTime.toTimeString().substring(0, 5)),
    },
    {
      title: "Ferry Cut Off Time",
      value: cutoffTime
        ? formatTime12Hour(cutoffTime.toTimeString().substring(0, 5))
        : "--:--",
    },
    {
      title: "Next Departure Time",
      value: nextFerry
        ? formatTime12Hour(nextFerry.depDate.toTimeString().substring(0, 5))
        : "--:--",
    },
    {
      title: "Next Ferry Operator",
      value: nextFerry ? nextFerry.operator : "--",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-between max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {cardData.map(({ title, value }, index) => (
        <Card key={index} className="flex-1 min-w-[160px] shadow-md">
          <CardContent className="p-4 text-center">
            <p className="text-xs uppercase text-muted-foreground tracking-widest mb-1">
              {title}
            </p>
            <p className="text-2xl font-semibold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
