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
import { useLiveScheduleData } from "@/hooks/useLiveScheduleData";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [route, setRoute] = useState({
    from: "Anguilla",
    to: "St. Martin",
  });

  const { data: weatherData } = useSWR(
    "/api/weather?q=Blowing Point, Anguilla",
    (url: string) => fetch(url).then((res) => res.json())
  );

  const { upcomingFerries, pastFerries, setSelectedFerry, localNow } =
    useLiveScheduleData(selectedDate, route);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {weatherData?.current?.wind_kph && (
          <div className="mt-4">
            <SeaConditionBanner windSpeedKmh={weatherData.current.wind_kph} />
          </div>
        )}

        <FeatureImageAndWeather />

        <TravelAlertBanner
          message="Please Note: The Public Ferry ticketing counter accepts cash only. Kindly prepare exact change in advance to avoid delays."
          type="info"
        />

        <TimeAndCountdowns
          ferries={upcomingFerries}
          selectedDate={selectedDate}
        />

        <RouteDateAndSearchBar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          route={route}
          onRouteChange={setRoute} // Ensure prop exists in component
        />
        <UpcomingAndPastFerries
          upcomingFerries={upcomingFerries}
          pastFerries={pastFerries}
          localNow={localNow}
          onDetails={(ferry) => setSelectedFerry(ferry)}
        />

        <InfoCards />
        <OperatorsSection />
        <TestimonialsSection />
      </div>
    </div>
  );
}
