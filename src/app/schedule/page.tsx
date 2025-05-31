"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Save, X, CalendarIcon } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { FerryItem } from "@/types/FerryItem";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDropdownOptions } from "@/hooks/useDropdownOptions";

import { OutboundTableCard } from "@/components/FerrySchedule/OutboundTableCard";
import { ReturnTableCard } from "@/components/FerrySchedule/ReturnTableCard";
import { ScheduleDateToolbar } from "@/components/FerrySchedule/ScheduleDateToolbar";
import { cloneSchedulePattern } from "@/utils/cloneSchedulePattern";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type FerryWithExtras = Omit<FerryItem, "id"> & {
  id: number | string;
  meta?: { generated: boolean };
};

const marigotReturnTimes = [
  "08:30",
  "09:30",
  "10:30",
  "12:00",
  "13:30",
  "15:00",
  "16:30",
  "17:15",
  "18:00",
];

const defaultDepartureTimes = [
  "07:30",
  "08:30",
  "09:30",
  "11:00",
  "12:30",
  "14:00",
  "15:30",
  "16:30",
  "17:15",
];

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState<FerryItem[]>([]);
  const { operators, statuses } = useDropdownOptions();
  const [fallbackEditsByDate, setFallbackEditsByDate] = useState<{
    [date: string]: FerryWithExtras[];
  }>({});
  const [fromEditable, setFromEditable] = useState<FerryWithExtras[]>([]);

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [isCloning, setIsCloning] = useState(false);
  const [cloneWeeks, setCloneWeeks] = useState(3);
  const [isCloningLoading, setIsCloningLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("fallbackCache", JSON.stringify(fallbackEditsByDate));
  }, [fallbackEditsByDate]);

  useEffect(() => {
    const fromStorage = localStorage.getItem("fallbackCache");
    if (fromStorage) {
      setFallbackEditsByDate(JSON.parse(fromStorage));
    }
  }, []);

  useEffect(() => {
    fetchSchedules(selectedDate);
  }, [selectedDate]);

  const fetchSchedules = async (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const { data, error } = await supabase
      .from("ferry_schedules")
      .select("*")
      .eq("schedule_date", formattedDate);
    if (!error && data) setSchedules(data);
  };

  const updateSchedule = (
    index: number,
    field: keyof FerryItem,
    value: string,
    direction: FerryItem["direction"]
  ) => {
    const updated = [...schedules];
    const filtered = schedules.filter((s) => s.direction === direction);
    const actualIndex = schedules.findIndex(
      (s) => s.id === filtered[index]?.id
    );

    if (actualIndex !== -1) {
      updated[actualIndex] = { ...updated[actualIndex], [field]: value };
      setSchedules(updated);
    }

    if (direction === "from-anguilla") {
      setFromEditable((prev) => {
        const copy = [...prev];
        if (copy[index]) {
          copy[index] = { ...copy[index], [field]: value };
        }
        const dateKey = format(selectedDate, "yyyy-MM-dd");
        setFallbackEditsByDate((prevCache) => ({
          ...prevCache,
          [dateKey]: copy,
        }));
        return copy;
      });
    }
  };

  useEffect(() => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const outbound = schedules
      .filter((s) => s.direction === "from-anguilla")
      .sort((a, b) => a.departure_time.localeCompare(b.departure_time));

    if (outbound.length === 0) {
      if (fallbackEditsByDate[dateKey]) {
        setFromEditable(fallbackEditsByDate[dateKey]);
      } else {
        setFromEditable(
          defaultDepartureTimes.map((time) => ({
            id: crypto.randomUUID(),
            operator: "--",
            departure_time: time,
            duration: "00:30:00",
            status: "scheduled",
            departure_port: "Blowing Point, Anguilla",
            arrival_port: "Marigot, St. Martin",
            direction: "from-anguilla",
            schedule_date: dateKey,
            vessel_name: null,
            price: "30.00",
            logo_url: "",
            meta: { generated: true },
          }))
        );
      }
    } else {
      setFromEditable(outbound);
    }
  }, [schedules, selectedDate, fallbackEditsByDate]);

  const calculateETA = (departure: string, duration: string) => {
    const [depHour, depMin] = departure.split(":").map(Number);
    const [durHour, durMin] = duration.split(":").map(Number);
    const eta = new Date();
    eta.setHours(depHour + durHour);
    eta.setMinutes(depMin + durMin);
    return format(eta, "hh:mm a");
  };

  const getToAnguillaEditable = (): FerryWithExtras[] => {
    return fromEditable.map((outbound, i) => {
      const returnTime = marigotReturnTimes[i] || "00:00";
      const existing = schedules.find(
        (s) =>
          s.direction === "to-anguilla" &&
          s.operator === outbound.operator &&
          s.departure_time === returnTime
      );
      return (
        existing || {
          id: crypto.randomUUID(),
          operator: outbound.operator,
          departure_port: "Marigot, St. Martin",
          arrival_port: "Blowing Point, Anguilla",
          direction: "to-anguilla",
          departure_time: returnTime,
          duration: "00:30:00",
          status: outbound.status,
          schedule_date: format(selectedDate, "yyyy-MM-dd"),
          vessel_name: outbound.vessel_name || null,
          price: outbound.price || "30.00",
          logo_url: outbound.logo_url || "",
          meta: { generated: true },
        }
      );
    });
  };

  const saveSchedules = async () => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    const outboundTrips = schedules.filter(
      (s) => s.direction === "from-anguilla"
    );
    const existingReturnKeys = new Set(
      schedules
        .filter((s) => s.direction === "to-anguilla")
        .map((s) => `${s.operator}_${s.departure_time}`)
    );

    const returnTrips = outboundTrips.flatMap((outbound, i) => {
      const returnTime = marigotReturnTimes[i] || "00:00";
      const returnKey = `${outbound.operator}_${returnTime}`;
      if (existingReturnKeys.has(returnKey)) return [];
      return [
        {
          id: crypto.randomUUID(),
          operator: outbound.operator,
          departure_time: returnTime,
          duration: "00:30:00",
          status: "scheduled",
          departure_port: "Marigot, St. Martin",
          arrival_port: "Blowing Point, Anguilla",
          direction: "to-anguilla",
          schedule_date: formattedDate,
          vessel_name: outbound.vessel_name || null,
          price: outbound.price || "30.00",
          logo_url: outbound.logo_url || "",
        },
      ];
    });

    const fullUpdates = [
      ...schedules.map((s) => ({ ...s, duration: "00:30:00" })),
      ...returnTrips,
    ];
    const { error } = await supabase
      .from("ferry_schedules")
      .upsert(fullUpdates);
    if (error) {
      alert("❌ Failed to save schedules.");
      console.error(error);
    } else {
      alert("✅ Schedules saved successfully!");
    }
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-full px-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ferry Schedule Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <ScheduleDateToolbar
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <OutboundTableCard
                  ferries={fromEditable}
                  operators={operators}
                  statuses={statuses}
                  calculateETA={calculateETA}
                  onChange={updateSchedule}
                />

                <ReturnTableCard
                  ferries={getToAnguillaEditable()}
                  statuses={statuses}
                  calculateETA={calculateETA}
                  onChange={updateSchedule}
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => fetchSchedules(selectedDate)}
                >
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button variant="default" onClick={saveSchedules}>
                  <Save className="h-4 w-4 mr-2" /> Save
                </Button>
                <Button variant="secondary" onClick={() => setIsCloning(true)}>
                  🗓️ Clone Schedule Pattern
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {isCloning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Clone Ferry Schedule</h2>
            <p>Clone this week&apos;s schedule to how many future weeks?</p>

            <input
              type="number"
              value={cloneWeeks}
              onChange={(e) => setCloneWeeks(Number(e.target.value))}
              className="w-full border rounded p-2"
              min={1}
              max={12}
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from && dateRange.to
                    ? `${format(dateRange.from, "MMM d")} – ${format(
                        dateRange.to,
                        "MMM d"
                      )}`
                    : "Select base week"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) =>
                    setDateRange({ from: range?.from, to: range?.to })
                  }
                  numberOfMonths={2}
                  defaultMonth={new Date("2025-06-01")}
                />
              </PopoverContent>
            </Popover>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsCloning(false)}>
                Cancel
              </Button>
              <Button
                disabled={isCloningLoading}
                onClick={async () => {
                  if (!dateRange?.from || !dateRange?.to) {
                    alert("Please select a base week first.");
                    return;
                  }

                  setIsCloningLoading(true);

                  if (!dateRange.from || !dateRange.to) {
                    alert("Please select a base week first.");
                    setIsCloningLoading(false);
                    return;
                  }

                  const baseSchedules = schedules.filter((s) => {
                    const d = new Date(s.schedule_date);
                    return d >= dateRange.from! && d <= dateRange.to!;
                  });

                  const { success, error } = await cloneSchedulePattern({
                    baseSchedules,
                    startDate: format(dateRange.from, "yyyy-MM-dd"),
                    numberOfWeeks: cloneWeeks,
                  });

                  setIsCloningLoading(false);
                  setIsCloning(false);

                  if (success) {
                    alert("✅ Schedule cloned successfully!");
                  } else {
                    console.error(error);
                    alert("❌ Failed to clone schedules.");
                  }
                }}
              >
                {isCloningLoading ? "Cloning..." : "Confirm Clone"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
