"use client";

import React, { useEffect, useState } from "react";
import { FerryItem } from "@/types/FerryItem";
import { formatTime12Hour } from "@/helpers/formatTime12Hour";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPRTime } from "@/hooks/useLiveScheduleData"; // or wherever it's defined

interface TimeAndCountdownsProps {
  ferries: FerryItem[];
  selectedDate: Date;
}

export default function TimeAndCountdowns({
  ferries,
  selectedDate,
}: TimeAndCountdownsProps) {
  const [countdown, setCountdown] = useState<string>("--:--:--");
  const [countdownPhase, setCountdownPhase] = useState<
    | "countdown"
    | "yellow"
    | "orange-pulse"
    | "prepare-for-boarding"
    | "now-boarding"
    | "reset"
  >("countdown");

  const localTime = getPRTime();

  const ferryList = ferries
    .map((ferry) => {
      const [depHour, depMinute] = ferry.departure_time
        .trim()
        .split(":")
        .map(Number);
      const [year, month, day] = ferry.schedule_date.split("-").map(Number);
      const depDate = new Date(year, month - 1, day, depHour, depMinute);
      return { ...ferry, depDate };
    })
    .sort((a, b) => a.depDate.getTime() - b.depDate.getTime());

  const todayStr = selectedDate.toDateString();
  const futureFerriesToday = localTime
    ? ferryList.filter(
        (ferry) =>
          ferry.depDate.toDateString() === todayStr && ferry.depDate > localTime
      )
    : [];

  const nextFerryToday = futureFerriesToday[0] ?? null;

  const cutoffTimeToday = nextFerryToday
    ? new Date(nextFerryToday.depDate.getTime() - 5 * 60 * 1000)
    : null;

  const tomorrow = new Date(localTime!);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toLocaleDateString("en-CA"); // yyyy-mm-dd format

  console.log("All ferry schedule_date values:");
  ferryList.forEach((f) => console.log(f.schedule_date));

  const rawNextFerryTomorrow = ferryList.find(
    (ferry) => ferry.schedule_date === tomorrowStr
  );

  console.log("Tomorrow date string:", tomorrowStr);
  console.log("Next ferry tomorrow:", rawNextFerryTomorrow);

  console.log("Tomorrow date string:", tomorrowStr);
  console.log("Ferry List:", ferryList);

  ferryList.forEach((ferry, index) => {
    console.log(`Ferry ${index + 1}:`);
    console.log("  schedule_date:", ferry.schedule_date);
    console.log("  departure_time:", ferry.departure_time);
    console.log("  depDate:", ferry.depDate?.toISOString());
  });

  let nextFerryTomorrow: (FerryItem & { depDate: Date }) | null = null;

  if (rawNextFerryTomorrow) {
    const [year, month, day] = rawNextFerryTomorrow.schedule_date
      .split("-")
      .map(Number);
    const [hour, minute] = rawNextFerryTomorrow.departure_time
      .split(":")
      .map(Number);

    nextFerryTomorrow = {
      ...rawNextFerryTomorrow,
      depDate: new Date(year, month - 1, day, hour, minute),
    };
  }

  const nextFerry = nextFerryToday || nextFerryTomorrow;

  useEffect(() => {
    if (!nextFerry || !localTime) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = nextFerry.depDate.getTime() - now.getTime();
      const pad = (n: number) => String(n).padStart(2, "0");

      if (diff > 30 * 60 * 1000) {
        setCountdownPhase("countdown");
      } else if (diff > 20 * 60 * 1000) {
        setCountdownPhase("yellow");
      } else if (diff > 5 * 60 * 1000) {
        setCountdownPhase("orange-pulse");
      } else if (diff > 0) {
        setCountdownPhase("prepare-for-boarding");
      } else if (diff > -5 * 60 * 1000) {
        setCountdownPhase("now-boarding");
      } else {
        setCountdownPhase("reset");
      }

      const remaining = Math.max(0, diff);
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setCountdown(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextFerry, localTime]);

  const getCountdownDisplay = () => {
    switch (countdownPhase) {
      case "yellow":
        return (
          <p className="text-2xl font-semibold text-yellow-500">{countdown}</p>
        );
      case "orange-pulse":
        return (
          <p className="text-2xl font-semibold text-orange-500 animate-pulse">
            {countdown}
          </p>
        );
      case "prepare-for-boarding":
        return (
          <p className="text-xl font-bold text-green-600">BOARDING SOON</p>
        );
      case "now-boarding":
        return (
          <p className="text-xl font-bold text-green-600 animate-pulse">
            NOW BOARDING
          </p>
        );
      default:
        return <p className="text-2xl font-semibold">{countdown}</p>;
    }
  };

  if (!localTime) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Loading local time...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-between max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Local Time */}
      <Card className="flex-1 min-w-[160px] shadow-md">
        <CardContent className="p-4 text-center">
          <p className="text-xs uppercase text-muted-foreground tracking-widest mb-1">
            Local Time
          </p>
          <p className="text-2xl font-semibold">
            {formatTime12Hour(localTime.toTimeString().substring(0, 5))}
          </p>
        </CardContent>
      </Card>

      {/* Countdown Timer */}
      <Card className="flex-1 min-w-[160px] shadow-md">
        <CardContent className="p-4 text-center">
          <p className="text-xs uppercase text-muted-foreground tracking-widest mb-1">
            Countdown to Next Ferry
          </p>
          {nextFerry?.depDate.toDateString() !==
            selectedDate.toDateString() && (
            <Badge variant="secondary" className="text-sm px-2 py-1 mb-1">
              TOMORROW
            </Badge>
          )}
          {getCountdownDisplay()}
        </CardContent>
      </Card>

      {/* Ferry Cut Off Time */}
      <Card className="flex-1 min-w-[160px] shadow-md">
        <CardContent className="p-4 text-center">
          <p className="text-xs uppercase text-muted-foreground tracking-widest mb-1">
            Ferry Cut Off Time
          </p>
          {cutoffTimeToday ? (
            <p className="text-2xl font-semibold">
              {formatTime12Hour(cutoffTimeToday.toTimeString().substring(0, 5))}
            </p>
          ) : (
            <>
              <Badge variant="destructive" className="text-lg px-3 py-1">
                CLOSED
              </Badge>
              {nextFerryTomorrow && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatTime12Hour(
                    nextFerryTomorrow.depDate.toTimeString().substring(0, 5)
                  )}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Next Departure Time */}
      <Card className="flex-1 min-w-[160px] shadow-md">
        <CardContent className="p-4 text-center">
          <p className="text-xs uppercase text-muted-foreground tracking-widest mb-1">
            Next Departure Time
          </p>
          {nextFerryToday ? (
            <p className="text-2xl font-semibold">
              {formatTime12Hour(
                nextFerryToday.depDate.toTimeString().substring(0, 5)
              )}
            </p>
          ) : (
            <>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                TOMORROW
              </Badge>
              {nextFerryTomorrow && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatTime12Hour(
                    nextFerryTomorrow.depDate.toTimeString().substring(0, 5)
                  )}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Next Ferry Operator */}
      <Card className="flex-1 min-w-[160px] shadow-md">
        <CardContent className="p-4 text-center">
          <p className="text-xs uppercase text-muted-foreground tracking-widest mb-1">
            Next Ferry Operator
          </p>
          {nextFerryToday ? (
            <p className="text-2xl font-semibold">{nextFerryToday.operator}</p>
          ) : (
            <>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                TOMORROW
              </Badge>
              {nextFerryTomorrow && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {nextFerryTomorrow.operator}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
