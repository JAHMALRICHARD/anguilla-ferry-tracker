"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThermometerIcon, WindIcon, DropletsIcon } from "lucide-react";
import Image from "next/image";

interface WeatherAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    feelslike_c: number;
    feelslike_f: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
    last_updated: string;
  };
}

const fallbackWeather: WeatherAPIResponse = {
  location: {
    name: "Blowing Point",
    region: "Anguilla",
    country: "Anguilla",
    localtime: new Date().toISOString(),
  },
  current: {
    temp_c: 29,
    temp_f: 84,
    feelslike_c: 31,
    feelslike_f: 88,
    condition: {
      text: "Partly Cloudy",
      icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
    },
    wind_kph: 18,
    humidity: 72,
    last_updated: new Date().toISOString(),
  },
};

export function CurrentWeatherWidget() {
  const [weather, setWeather] = useState<WeatherAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFahrenheit, setIsFahrenheit] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("weather_temp_unit");
      return saved === "fahrenheit";
    }
    return true;
  });

  const CACHE_KEY = "weather_cache";
  const CACHE_DURATION_MS = 60 * 60 * 1000;

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isFresh = Date.now() - timestamp < CACHE_DURATION_MS;
        if (isFresh) {
          setWeather(data);
          setLoading(false);
          return;
        }
      }

      try {
        const res = await fetch("/api/weather?q=Blowing Point, Anguilla");
        const data: WeatherAPIResponse = await res.json();
        if ("error" in data || !data.current) {
          setWeather(fallbackWeather);
        } else {
          setWeather(data);
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data, timestamp: Date.now() })
          );
        }
      } catch (e) {
        console.warn("⚠️ Weather fetch failed. Using fallback.");
        console.error(e);
        setWeather(fallbackWeather);
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  if (loading || !weather) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-muted rounded w-2/3 mb-2" />
              <div className="h-3 bg-muted rounded w-1/3" />
            </div>
            <div className="h-12 w-12 bg-muted rounded-full" />
          </div>
          <div className="h-10 bg-muted rounded w-1/2 mx-auto" />
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
          </div>
        </div>
      </motion.div>
    );
  }

  const {
    location,
    current: {
      temp_c,
      temp_f,
      feelslike_c,
      feelslike_f,
      condition,
      wind_kph,
      humidity,
      last_updated,
    },
  } = weather;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {location.name}, {location.region}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <span>
              {condition.text.includes("Clear")
                ? "☀️"
                : condition.text.includes("Cloud")
                ? "⛅️"
                : condition.text.includes("Rain")
                ? "🌧️"
                : condition.text.includes("Storm")
                ? "🌩️"
                : "🌤️"}
            </span>
            {condition.text}
          </p>
        </div>
        <Image
          src={`https:${condition.icon}`}
          alt={condition.text}
          width={48}
          height={48}
          className="h-12 w-12 object-contain"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl font-bold">
          {isFahrenheit ? `${Math.round(temp_f)}°F` : `${Math.round(temp_c)}°C`}
        </div>
        <div className="text-sm text-muted-foreground">
          Feels like {isFahrenheit ? `${feelslike_f}°F` : `${feelslike_c}°C`}
        </div>
      </div>

      <div className="mb-4">
        <div className="inline-flex border border-border rounded-md overflow-hidden text-sm">
          <button
            onClick={() => {
              setIsFahrenheit(false);
              localStorage.setItem("weather_temp_unit", "celsius");
            }}
            className={`px-3 py-1 transition ${
              !isFahrenheit
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-muted"
            }`}
          >
            °C
          </button>
          <button
            onClick={() => {
              setIsFahrenheit(true);
              localStorage.setItem("weather_temp_unit", "fahrenheit");
            }}
            className={`px-3 py-1 transition ${
              isFahrenheit
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-muted"
            }`}
          >
            °F
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center justify-center gap-2 whitespace-nowrap">
          <WindIcon className="h-4 w-4 shrink-0 text-primary" />
          <span>{wind_kph}&nbsp;km/h</span>
        </div>
        <div className="flex items-center justify-center gap-2 whitespace-nowrap">
          <DropletsIcon className="h-4 w-4 shrink-0 text-primary/80" />
          <span>{humidity}&nbsp;%</span>
        </div>
        <div className="flex items-center justify-center gap-2 whitespace-nowrap">
          <ThermometerIcon className="h-4 w-4 shrink-0 text-accent" />
          <span>{isFahrenheit ? `${feelslike_f}°F` : `${feelslike_c}°C`}</span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-right mt-2">
        Updated: {new Date(last_updated).toLocaleTimeString()}
      </div>
    </motion.div>
  );
}
