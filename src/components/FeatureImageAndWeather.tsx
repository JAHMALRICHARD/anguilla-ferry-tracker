"use client";

import { CurrentWeatherWidget } from "./CurrentWeatherWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FeatureImageAndWeather() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
        {/* Left Column: Hero Banner */}
        <div className="flex-1 relative rounded-2xl overflow-hidden text-white bg-[url('/hero/resized-sxm-to-axa-hero-featured-image.jpg')] bg-cover bg-center py-16 md:py-24 px-6">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 z-0" />

          {/* Text Content */}
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

        {/* Right Column: Weather Widget in Card */}
        <div className="w-full lg:w-[320px]">
          <Card className="h-full">
            <CardContent className="p-4">
              <CurrentWeatherWidget />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
