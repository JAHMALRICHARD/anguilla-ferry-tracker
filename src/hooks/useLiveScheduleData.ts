"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import type { FerryItem } from "@/types/FerryItem";
import { format, startOfDay, endOfDay } from "date-fns";

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

  // Update local time every 10 seconds for real-time countdowns
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalNow(buildDateWithCurrentPRTime(selectedDate));
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  // ✅ Fetch ferry data for the selected date
  useEffect(() => {
    const fetchFerryData = async () => {
      const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
      console.log("📍 Fetching ferries for:", selectedDateStr);

      const { data, error } = await supabase
        .from("ferry_schedules")
        .select("*")
        .eq("schedule_date", selectedDateStr)
        .order("schedule_date", { ascending: true })
        .order("departure_time", { ascending: true });

      if (error) {
        console.error("❌ Supabase fetch error:", error);
        return;
      }

      console.log(`✅ Fetched ${data?.length ?? 0} ferries`);
      setAllFerries(data || []);
    };

    fetchFerryData();
  }, [selectedDate]);

  // Categorize ferries into past or upcoming based on the selected date
  useEffect(() => {
    const now = buildDateWithCurrentPRTime(selectedDate);

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
      arrival.setMinutes(arrival.getMinutes() + 10);
      return arrival;
    };

    const today = new Date();
    const isPastDate = selectedDate < startOfDay(today);
    const isFutureDate = selectedDate > endOfDay(today);

    let upcoming: FerryItem[] = [];
    let past: FerryItem[] = [];

    if (!isPastDate && !isFutureDate) {
      upcoming = allFerries.filter((ferry) => {
        const departure = getFerryDateTime(ferry);
        const arrivalBuffer = getArrivalTimeWithBuffer(ferry);
        const timeUntilDeparture =
          (departure.getTime() - now.getTime()) / 1000 / 60;

        return (
          (now >= departure && now <= arrivalBuffer) || timeUntilDeparture >= 0
        );
      });

      past = allFerries.filter((ferry) => {
        const arrivalBuffer = getArrivalTimeWithBuffer(ferry);
        return now > arrivalBuffer;
      });
    }

    if (isPastDate) {
      upcoming = [];
      past = [...allFerries];
    }

    if (isFutureDate) {
      upcoming = [...allFerries];
      past = [];
    }

    setUpcomingFerries(upcoming);
    setPastFerries(past);
  }, [allFerries, selectedDate]);

  return {
    allFerries,
    upcomingFerries,
    pastFerries,
    selectedFerry,
    setSelectedFerry,
    localNow,
  };
}
