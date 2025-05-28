"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export interface FerryItem {
  id: number;
  operator: string;
  departure_port: string;
  arrival_port: string;
  departure_time: string; // "HH:mm:ss"
  arrival_time?: string;
  price: string;
  duration: string; // "HH:mm"
  vessel_name?: string;
  status: string;
  direction: string;
  schedule_date: string; // "YYYY-MM-DD"
  logo_url: string;
}

export function useLiveScheduleData(
  selectedDate: Date,
  route: { from: string; to: string }
) {
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
        .eq(
          "direction",
          route.to === "Anguilla" ? "to-anguilla" : "from-anguilla"
        )
        .eq("schedule_date", selectedDate.toISOString().split("T")[0])
        .order("departure_time", { ascending: true });

      if (error) {
        console.error("Supabase fetch error:", error);
        return;
      }

      setAllFerries(data || []);
    };

    fetchFerryData();
  }, [route.to, selectedDate]);

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
