"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export interface FerryItem {
  id: number;
  operator: string;
  departure_port: string;
  arrival_port: string;
  departure_time: string;
  arrival_time?: string;
  price: string;
  duration: string;
  vessel_name?: string;
  status: string;
  direction: string;
  schedule_date: string;
  logo_url: string;
}

export function useLiveScheduleData(selectedDate: Date) {
  const [allFerries, setAllFerries] = useState<FerryItem[]>([]);
  const [upcomingFerries, setUpcomingFerries] = useState<FerryItem[]>([]);
  const [pastFerries, setPastFerries] = useState<FerryItem[]>([]);
  const [selectedFerry, setSelectedFerry] = useState<FerryItem | null>(null);

  const now = new Date();
  const localNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Puerto_Rico" })
  );

  const getFerryDateTime = (ferry: FerryItem): Date => {
    const [hour, minute, second] = ferry.departure_time
      .split(":")
      .map((part) => parseInt(part));
    const [year, month, day] = ferry.schedule_date
      .split("-")
      .map((part) => parseInt(part));
    return new Date(year, month - 1, day, hour, minute, second || 0);
  };

  useEffect(() => {
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

    fetchFerryData();
  }, [selectedDate]);

  useEffect(() => {
    const upcoming = allFerries.filter(
      (ferry) => getFerryDateTime(ferry) >= localNow
    );
    const past = allFerries.filter(
      (ferry) => getFerryDateTime(ferry) < localNow
    );

    setUpcomingFerries(upcoming);
    setPastFerries(past);
  }, [allFerries]);

  return {
    allFerries,
    upcomingFerries,
    pastFerries,
    selectedFerry,
    setSelectedFerry,
    localNow,
  };
}
