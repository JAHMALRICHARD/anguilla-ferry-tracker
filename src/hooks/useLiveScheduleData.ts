"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import type { FerryItem } from "@/types/FerryItem";
import { format, startOfDay, endOfDay } from "date-fns";

export function getPRTime(date = new Date()) {
  return new Date(
    date.toLocaleString("en-US", { timeZone: "America/Puerto_Rico" })
  );
}

export function useLiveScheduleData(selectedDate: Date) {
  const [allFerries, setAllFerries] = useState<FerryItem[]>([]);
  const [upcomingFerries, setUpcomingFerries] = useState<FerryItem[]>([]);
  const [pastFerries, setPastFerries] = useState<FerryItem[]>([]);
  const [selectedFerry, setSelectedFerry] = useState<FerryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [localNow, setLocalNow] = useState<Date>(() => getPRTime());

  const todayPR = getPRTime();
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const todayStr = format(todayPR, "yyyy-MM-dd");
  const isToday = selectedDateStr === todayStr;
  const isPast = selectedDate < startOfDay(todayPR);
  const isFuture = selectedDate > endOfDay(todayPR);

  // ⏱ Update localNow only if today
  useEffect(() => {
    if (!isToday) return;

    const interval = setInterval(() => {
      setLocalNow(getPRTime());
    }, 15000); // update every 15 seconds

    return () => clearInterval(interval);
  }, [isToday]);

  // 🚢 Fetch ferry data from Supabase
  useEffect(() => {
    const fetchFerryData = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("ferry_schedules")
        .select("*")
        .eq("schedule_date", selectedDateStr)
        .order("departure_time", { ascending: true });

      if (error) {
        console.error("❌ Supabase fetch error:", error);
        setAllFerries([]);
      } else {
        console.log("🛳️ Fetched ferry data for", selectedDateStr);
        console.table(data);
        setAllFerries(data || []);
      }

      setLoading(false);
    };

    fetchFerryData();
  }, [selectedDateStr]);

  // ⏳ Categorize ferries into past and upcoming
  useEffect(() => {
    const upcoming: FerryItem[] = [];
    const past: FerryItem[] = [];

    allFerries.forEach((ferry) => {
      const [h, m] = ferry.departure_time.split(":").map(Number);
      const ferryDateTime = new Date(selectedDate);
      ferryDateTime.setHours(h, m, 0, 0);

      if (isPast) {
        past.push(ferry);
      } else if (isFuture) {
        upcoming.push(ferry);
      } else {
        if (ferryDateTime >= localNow) {
          upcoming.push(ferry);
        } else {
          past.push(ferry);
        }
      }
    });

    console.log("🔍 Total ferries received:", allFerries.length);
    console.log("🟢 Upcoming:", upcoming.length, "🔴 Past:", past.length);

    setUpcomingFerries(upcoming);
    setPastFerries(past);
  }, [allFerries, selectedDateStr, localNow, isPast, isFuture]);

  return {
    allFerries,
    upcomingFerries,
    pastFerries,
    selectedFerry,
    setSelectedFerry,
    localNow,
    loading,
  };
}
