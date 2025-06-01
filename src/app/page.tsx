"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { TravelAlertBanner } from "@/components/TravelAlertBanner";
import { InfoCards } from "@/components/InfoCards";
import { OperatorsSection } from "@/components/OperatorsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { SeaConditionBanner } from "@/components/SeaConditionBanner";
import useSWR from "swr";
import FeatureImageAndWeather from "@/components/FeatureImageAndWeather";
import TimeAndCountdowns from "@/components/TimeAndCountdowns";
import RouteDateAndSearchBar from "@/components/RouteDateAndSearchBar";
import UpcomingAndPastFerries from "@/components/UpcomingAndPastFerries";
import { getFerriesForRoute } from "@/utils/getFerriesForRoute";
import { useLiveScheduleData } from "@/hooks/useLiveScheduleData";
import type { FerryItem } from "@/types/FerryItem";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [route, setRoute] = useState({
    from: "To Anguilla - via Marigot",
    to: "To St. Martin", // Default direction
  });

  const {
    allFerries = [],
    localNow,
    setSelectedFerry,
  } = useLiveScheduleData(selectedDate);

  const fullRouteFerries = getFerriesForRoute(route.to, allFerries);

  const upcomingFerries = fullRouteFerries.filter((ferry) => {
    const [hour, minute] = ferry.departure_time.split(":").map(Number);
    const depTime = new Date(localNow);
    depTime.setHours(hour, minute, 0, 0);
    return depTime >= localNow;
  });

  const pastFerries = fullRouteFerries.filter((ferry) => {
    const [hour, minute] = ferry.departure_time.split(":").map(Number);
    const depTime = new Date(localNow);
    depTime.setHours(hour, minute, 0, 0);
    return depTime < localNow;
  });

  const handleDetails = (ferry: FerryItem) => {
    setSelectedFerry(ferry);
  };

  const weatherLocation =
    route.to === "To Anguilla - via Marigot"
      ? "Blowing Point, Anguilla"
      : "Marigot, St. Martin";

  const { data: weatherData } = useSWR(
    `/api/weather?q=${encodeURIComponent(weatherLocation)}`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 ease-in-out">
      <Header />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sea Conditions */}
        {weatherData?.current?.wind_kph && (
          <div className="mt-4">
            <SeaConditionBanner windSpeedKmh={weatherData.current.wind_kph} />
          </div>
        )}

        {/* Hero + Weather + Ferry Progress */}
        <FeatureImageAndWeather selectedDate={selectedDate} route={route} />

        {/* Alert Banner */}
        <TravelAlertBanner
          message="Please Note: The Public Ferry ticketing counter accepts cash only. Kindly prepare exact change in advance to avoid delays."
          type="info"
        />

        {/* Countdown Clock */}
        <TimeAndCountdowns
          ferries={getFerriesForRoute(route.to, allFerries)}
          selectedDate={selectedDate}
        />

        {/* Date + Route Filter */}
        <RouteDateAndSearchBar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          route={route}
          onRouteChange={setRoute}
        />

        {/* Ferry Schedule Tables */}
        <UpcomingAndPastFerries
          upcomingFerries={upcomingFerries}
          pastFerries={pastFerries}
          localNow={localNow}
          onDetails={handleDetails}
          route={route}
          selectedDate={selectedDate}
        />

        {/* Footer Sections */}
        <InfoCards />
        <OperatorsSection />
        <TestimonialsSection />
      </div>
    </div>
  );
}
