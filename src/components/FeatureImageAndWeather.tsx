"use client";

import { useState } from "react";
import { CurrentWeatherWidget } from "./CurrentWeatherWidget";
import { FerryProgress } from "./FerryProgress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLiveScheduleData } from "@/hooks/useLiveScheduleData";
import { formatTime12Hour } from "@/helpers/formatTime12Hour";

export default function FeatureImageAndWeather() {
  const [selectedDate] = useState(new Date());
  const { upcomingFerries, localNow } = useLiveScheduleData(selectedDate);

  const nextFerry = upcomingFerries.length > 0 ? upcomingFerries[0] : null;

  const getProgressPercent = (departureTime: string): number => {
    const [h, m] = departureTime.split(":").map(Number);
    const depDate = new Date(selectedDate);
    depDate.setHours(h, m, 0);

    const diffInMinutes = (depDate.getTime() - localNow.getTime()) / 1000 / 60;
    const totalLead = 60;

    const percentage = Math.max(
      0,
      Math.min(100, 100 - (diffInMinutes / totalLead) * 100)
    );

    return percentage;
  };

  // ✅ Safe mapping for status to expected union types
  let ferrySailingStatus:
    | "DOCKED"
    | "BOARDING"
    | "SAILING"
    | "NOW ARRIVING"
    | "ARRIVED" = "DOCKED";

  if (nextFerry) {
    switch (nextFerry.status.toLowerCase()) {
      case "on-time":
      case "scheduled":
        ferrySailingStatus = "DOCKED";
        break;
      case "boarding":
      case "delayed":
        ferrySailingStatus = "BOARDING";
        break;
      case "sailing":
      case "departed":
        ferrySailingStatus = "SAILING";
        break;
      case "arriving":
        ferrySailingStatus = "NOW ARRIVING";
        break;
      case "arrived":
        ferrySailingStatus = "ARRIVED";
        break;
      default:
        ferrySailingStatus = "DOCKED";
    }
  }

  const getFormattedETA = (departure: string, duration: string): string => {
    const [depHour, depMin] = departure.split(":").map(Number);
    const [durHour, durMin] = duration.split(":").map(Number);

    const eta = new Date(selectedDate);
    eta.setHours(depHour + durHour);
    eta.setMinutes(depMin + durMin);

    return formatTime12Hour(
      `${eta.getHours().toString().padStart(2, "0")}:${eta
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
        {/* Hero Section */}
        <div className="flex-1 relative rounded-2xl overflow-hidden text-white bg-[url('/hero/resized-sxm-to-axa-hero-featured-image.jpg')] bg-cover bg-center py-16 md:py-24 px-6">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 z-0" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Your Gateway Between
              <br />
              Anguilla & St. Martin
            </h1>
            <p className="text-gray-200 text-xl mb-8 max-w-xl">
              Check ferry times, prices, travel docs & more
            </p>
            <Button
              variant="default"
              className="text-white text-base px-6 py-3"
            >
              See Schedule
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[320px] space-y-4">
          {/* Weather */}
          <Card className="h-full">
            <CardContent className="p-4">
              <CurrentWeatherWidget />
            </CardContent>
          </Card>

          {/* Live Ferry Progress */}
          {nextFerry && (
            <Card>
              <CardContent className="p-4 flex justify-center">
                <FerryProgress
                  operatorName={nextFerry.operator}
                  progressPercent={
                    ferrySailingStatus === "DOCKED"
                      ? 0
                      : getProgressPercent(nextFerry.departure_time)
                  }
                  eta={getFormattedETA(
                    nextFerry.departure_time,
                    nextFerry.duration
                  )}
                  status={ferrySailingStatus}
                  direction={
                    nextFerry.direction === "from-anguilla"
                      ? "to-st-martin"
                      : "to-anguilla"
                  }
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
