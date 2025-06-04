"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header/Header";
import { TravelAlertBanner } from "@/components/Home/TravelAlertBanner";
import { InfoCards } from "@/components/Home/InfoCards";
import { OperatorsSection } from "@/components/Home/OperatorsSection";
import { TestimonialsSection } from "@/components/Home/TestimonialsSection";
import { SeaConditionBanner } from "@/components/Home/SeaConditionBanner";
import useSWR from "swr";
import FeatureImageAndWeather from "@/components/Home/FeatureImageAndWeather";
import TimeAndCountdowns from "@/components/Home/TimeAndCountdowns";
import RouteDateAndSearchBar from "@/components/Home/RouteDateAndSearchBar";
import UpcomingAndPastFerries from "@/components/Home/UpcomingAndPastFerries";
import { getFerriesForRoute } from "@/utils/getFerriesForRoute";
import { useLiveScheduleData } from "@/hooks/useLiveScheduleData";
import type { FerryItem } from "@/types/FerryItem";
import Footer from "@/components/Footer/Footer";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDateChanging, setIsDateChanging] = useState(false);
  const [route, setRoute] = useState({
    from: "To Anguilla - via Marigot",
    to: "To St. Martin",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const {
    allFerries = [],
    upcomingFerries: allUpcoming,
    pastFerries: allPast,
    localNow,
    setSelectedFerry,
    loading, // from Supabase
  } = useLiveScheduleData(selectedDate);

  // Clear date-changing skeleton once ferry data is loaded
  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        setIsDateChanging(false);
      }, 200); // small delay to smooth transition
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  const upcomingFerries = useMemo(
    () => getFerriesForRoute(route.to, allUpcoming, "upcoming"),
    [route.to, allUpcoming]
  );

  const pastFerries = useMemo(
    () => getFerriesForRoute(route.to, allPast, "past"),
    [route.to, allPast]
  );

  const handleDetails = (ferry: FerryItem) => {
    setSelectedFerry(ferry);
  };

  const handleDateChange = (date: Date) => {
    setIsDateChanging(true);
    setSelectedDate(date);
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

        {/* Countdown Clock with Skeleton on Date Change */}
        <TimeAndCountdowns
          ferries={getFerriesForRoute(route.to, allFerries)}
          selectedDate={selectedDate}
          isLoading={isDateChanging || loading}
        />

        {/* Date + Route Filter */}
        <RouteDateAndSearchBar
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          route={route}
          onRouteChange={setRoute}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Ferry Schedule Tables */}
        <UpcomingAndPastFerries
          upcomingFerries={upcomingFerries}
          pastFerries={pastFerries}
          localNow={localNow}
          onDetails={handleDetails}
          selectedDate={selectedDate}
          searchQuery={searchQuery}
          route={route}
          loading={loading}
        />

        {/* Footer Sections */}
        <OperatorsSection />
        <InfoCards />
        <TestimonialsSection />
        <Footer />
      </div>
    </div>
  );
}
