import React from "react";
import { CurrentWeatherWidget } from "./CurrentWeatherWidget";

export function HeroSection() {
  return (
    <div className="py-16 md:py-24 bg-[url('/hero/resized-sxm-to-axa-hero-featured-image.jpg')] bg-cover bg-center relative text-white">
      {/* Top-to-bottom dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 z-0" />

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
          {/* Hero Text Section */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Your Gateway Between
              <br />
              Anguilla & St. Martin
            </h1>
            <p className="text-gray-200 text-xl mb-8">
              Check ferry times, prices, travel docs & more
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              See Schedule
            </button>
          </div>

          {/* Weather Widget */}
          <div className="w-full lg:w-[320px]">
            <CurrentWeatherWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
