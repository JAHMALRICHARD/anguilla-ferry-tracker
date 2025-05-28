"use client";

import { CurrentWeatherWidget } from "./CurrentWeatherWidget";

export default function FeatureImageAndWeather() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
        {/* Left Column: Hero Section */}
        <div className="flex-1 rounded-2xl overflow-hidden relative text-white bg-[url('/hero/resized-sxm-to-axa-hero-featured-image.jpg')] bg-cover bg-center py-16 md:py-24 px-6">
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 z-0" />

          {/* Hero Text Content */}
          <div className="relative z-10">
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
        </div>

        {/* Right Column: Weather Widget */}
        <div className="w-full lg:w-[320px]">
          <CurrentWeatherWidget />
        </div>
      </div>
    </div>
  );
}
