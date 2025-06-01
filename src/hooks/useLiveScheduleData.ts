"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import type { FerryItem } from "@/types/FerryItem";

function buildDateWithCurrentPRTime(selectedDate: Date): Date {
  const now = new Date();
  const isToday = now.toDateString() === selectedDate.toDateString();

  if (isToday) {
    return new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "America/Puerto_Rico",
      })
    );
  } else {
    return new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      0,
      0,
      0
    );
  }
}

export function useLiveScheduleData(selectedDate: Date) {
  const [allFerries, setAllFerries] = useState<FerryItem[]>([]);
  const [upcomingFerries, setUpcomingFerries] = useState<FerryItem[]>([]);
  const [pastFerries, setPastFerries] = useState<FerryItem[]>([]);
  const [selectedFerry, setSelectedFerry] = useState<FerryItem | null>(null);
  const [localNow, setLocalNow] = useState<Date>(() =>
    buildDateWithCurrentPRTime(selectedDate)
  );

  useEffect(() => {
    setLocalNow(buildDateWithCurrentPRTime(selectedDate));
  }, [selectedDate]);

  const fetchFerryData = async () => {
    const { data, error } = await supabase
      .from("ferry_schedules")
      .select("*")
      .eq("schedule_date", selectedDate.toISOString().split("T")[0])
      .order("departure_time", { ascending: true });

    if (error) {
      console.error("Supabase fetch error:", error);
      return;
    }

    setAllFerries(data || []);
  };

  useEffect(() => {
    fetchFerryData();

    const interval = setInterval(() => {
      setLocalNow(buildDateWithCurrentPRTime(selectedDate));
      fetchFerryData();
    }, 10000); // 10s polling

    return () => clearInterval(interval);
  }, [selectedDate]);

  useEffect(() => {
    const getFerryDateTime = (ferry: FerryItem): Date => {
      const [hour, minute, second] = ferry.departure_time
        .split(":")
        .map((part) => parseInt(part));
      const [year, month, day] = ferry.schedule_date
        .split("-")
        .map((part) => parseInt(part));
      return new Date(year, month - 1, day, hour, minute, second || 0);
    };

    const getArrivalTimeWithBuffer = (ferry: FerryItem): Date => {
      const [depHour, depMin] = ferry.departure_time.split(":").map(Number);
      const [durHour, durMin] = ferry.duration.split(":").map(Number);
      const [year, month, day] = ferry.schedule_date.split("-").map(Number);

      const arrival = new Date(
        year,
        month - 1,
        day,
        depHour + durHour,
        depMin + durMin
      );
      arrival.setMinutes(arrival.getMinutes() + 10); // buffer after arrival
      return arrival;
    };

    const timeUntilDeparture = (ferry: FerryItem): number => {
      const departure = getFerryDateTime(ferry);
      return (departure.getTime() - localNow.getTime()) / 1000 / 60;
    };

    const upcoming = allFerries.filter((ferry) => {
      const departure = getFerryDateTime(ferry);
      const arrivalBuffer = getArrivalTimeWithBuffer(ferry);

      return (
        // Show if currently in progress (boarding, sailing, arriving)
        (localNow >= departure && localNow <= arrivalBuffer) ||
        // Or show if it's within 60 mins of next departure
        timeUntilDeparture(ferry) <= 60
      );
    });

    const past = allFerries.filter((ferry) => {
      const arrivalBuffer = getArrivalTimeWithBuffer(ferry);
      return localNow > arrivalBuffer;
    });

    setUpcomingFerries(upcoming);
    setPastFerries(past);
  }, [allFerries, localNow]);

  return {
    allFerries,
    upcomingFerries,
    pastFerries,
    selectedFerry,
    setSelectedFerry,
    localNow,
  };
}
