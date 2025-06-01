"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Save, X } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { FerryItem } from "@/types/FerryItem";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDropdownOptions } from "@/hooks/useDropdownOptions";

import { OutboundTableCard } from "@/components/FerrySchedule/OutboundTableCard";
import { ReturnTableCard } from "@/components/FerrySchedule/ReturnTableCard";
import { ScheduleDateToolbar } from "@/components/FerrySchedule/ScheduleDateToolbar";

import { UserCard } from "@/components/FerrySchedule/UserCard";
import { CloneScheduleModal } from "@/components/FerrySchedule/CloneScheduleModal";

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

  const [isCloning, setIsCloning] = useState(false);
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

    const outboundTrips = fromEditable.filter(
      (s) =>
        s.operator &&
        s.operator !== "--" &&
        s.departure_time &&
        s.departure_time !== "" &&
        s.departure_port &&
        s.arrival_port
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
          status: outbound.status,
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
      ...outboundTrips.map((s) => ({
        ...s,
        duration: "00:30:00",
        created_by: userInfo?.id ?? null,
      })),
      ...returnTrips.map((r) => ({
        ...r,
        created_by: userInfo?.id ?? null,
      })),
    ];

    if (fullUpdates.length === 0) {
      alert("⚠️ No valid rows to save.");
      return;
    }

    const { error } = await supabase
      .from("ferry_schedules")
      .upsert(fullUpdates, {
        onConflict: "schedule_date,departure_time,direction",
      });

    if (error) {
      alert("❌ Failed to save schedules.");
      console.error("❌ Save error:", error.message, error.details, error);
    } else {
      alert("✅ Schedules saved successfully!");
      await fetchSchedules(selectedDate);
    }
  };

  const [userInfo, setUserInfo] = useState<{
    full_name: string;
    email: string;
    role: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) return;

      const userId = session.user.id;

      const { data: user, error } = await supabase
        .from("users")
        .select("full_name, email, role_id")
        .eq("id", userId)
        .maybeSingle();

      if (!user || error) return;

      const { data: roleRow } = await supabase
        .from("roles")
        .select("name")
        .eq("id", user.role_id)
        .maybeSingle();

      setUserInfo({
        full_name: user.full_name ?? "Unknown",
        email: user.email ?? "Unknown",
        role: roleRow?.name ?? "Unknown",
        id: userId, // ✅ Store user ID for saving
      });
    };

    fetchUserInfo();
  }, []);

  const isSaveDisabled = fromEditable.some(
    (ferry) =>
      !ferry.operator ||
      ferry.operator === "--" ||
      !ferry.departure_time ||
      !ferry.departure_port ||
      !ferry.arrival_port
  );

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-full px-6 space-y-4">
          {userInfo && (
            <UserCard
              full_name={userInfo.full_name}
              email={userInfo.email}
              role={userInfo.role.toUpperCase()}
            />
          )}
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
                <Button
                  variant="default"
                  onClick={saveSchedules}
                  disabled={isSaveDisabled}
                  title={
                    isSaveDisabled ? "Fill out all rows before saving" : ""
                  }
                >
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

      <CloneScheduleModal
        isCloning={isCloning}
        onClose={() => setIsCloning(false)}
        isCloningLoading={isCloningLoading}
        setIsCloningLoading={setIsCloningLoading}
      />
    </>
  );
}
