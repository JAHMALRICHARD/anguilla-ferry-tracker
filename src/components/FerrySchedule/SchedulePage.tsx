// app/schedule/page.tsx
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Save, X } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { FerryItem } from "@/types/FerryItem";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDropdownOptions } from "@/hooks/useDropdownOptions";
import { ScheduleHeader } from "@/components/FerrySchedule/ScheduleHeader";
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
  const [fromEditable, setFromEditable] = useState<FerryWithExtras[]>([]);
  const [fallbackEditsByDate, setFallbackEditsByDate] = useState<{
    [date: string]: FerryWithExtras[];
  }>({});
  const { operators, statuses } = useDropdownOptions();
  const [isCloning, setIsCloning] = useState(false);
  const [isCloningLoading, setIsCloningLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    full_name: string;
    email: string;
    role: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const { data } = await supabase
        .from("ferry_schedules")
        .select("*")
        .eq("schedule_date", formattedDate);
      if (data) setSchedules(data);
    };
    fetchSchedules();
  }, [selectedDate]);

  useEffect(() => {
    const cached = localStorage.getItem("fallbackCache");
    if (cached) setFallbackEditsByDate(JSON.parse(cached));
  }, []);

  useEffect(() => {
    localStorage.setItem("fallbackCache", JSON.stringify(fallbackEditsByDate));
  }, [fallbackEditsByDate]);

  useEffect(() => {
    const key = format(selectedDate, "yyyy-MM-dd");
    const outbound = schedules.filter((s) => s.direction === "from-anguilla");

    setFromEditable(
      outbound.length > 0
        ? outbound
        : fallbackEditsByDate[key] ||
            defaultDepartureTimes.map((time) => ({
              id: crypto.randomUUID(),
              operator: "--",
              departure_time: time,
              duration: "00:30:00",
              status: "scheduled",
              departure_port: "Blowing Point, Anguilla",
              arrival_port: "Marigot, St. Martin",
              direction: "from-anguilla",
              schedule_date: key,
              vessel_name: null,
              price: "30.00",
              logo_url: "",
              meta: { generated: true },
            }))
    );
  }, [schedules, selectedDate, fallbackEditsByDate]);

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
        if (copy[index]) copy[index] = { ...copy[index], [field]: value };
        const dateKey = format(selectedDate, "yyyy-MM-dd");
        setFallbackEditsByDate((prev) => ({
          ...prev,
          [dateKey]: copy,
        }));
        return copy;
      });
    }
  };

  const getToAnguillaEditable = (): FerryWithExtras[] => {
    return fromEditable.map((outbound, i) => {
      const returnTime = marigotReturnTimes[i] || "00:00";
      const match = schedules.find(
        (s) =>
          s.direction === "to-anguilla" &&
          s.operator === outbound.operator &&
          s.departure_time === returnTime
      );

      return (
        match || {
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

  useEffect(() => {
    const fetchUserInfo = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) return;

      const { data: user } = await supabase
        .from("users")
        .select("full_name, email, role_id")
        .eq("id", userId)
        .maybeSingle();

      const { data: roleRow } = await supabase
        .from("roles")
        .select("name")
        .eq("id", user?.role_id)
        .maybeSingle();

      setUserInfo({
        full_name: user?.full_name ?? "Unknown",
        email: user?.email ?? "Unknown",
        role: roleRow?.name ?? "Unknown",
        id: userId,
      });
    };

    fetchUserInfo();
  }, []);

  const saveSchedules = async () => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    const outboundTrips = fromEditable.filter(
      (s) => s.operator !== "--" && s.departure_time && s.departure_port
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

    const fullUpdates = [...outboundTrips, ...returnTrips].map((trip) => ({
      ...trip,
      created_by: userInfo?.id ?? null,
    }));

    const { error } = await supabase
      .from("ferry_schedules")
      .upsert(fullUpdates, {
        onConflict: "schedule_date,departure_time,direction",
      });

    if (error) {
      alert("❌ Failed to save schedules.");
      console.error(error);
    } else {
      alert("✅ Schedules saved!");
    }
  };

  const isSaveDisabled = fromEditable.some(
    (f) =>
      !f.operator ||
      f.operator === "--" ||
      !f.departure_time ||
      !f.departure_port
  );

  return (
    <div className="w-full bg-muted text-foreground">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <ScheduleHeader />

        {userInfo && (
          <UserCard
            full_name={userInfo.full_name}
            email={userInfo.email}
            role={userInfo.role.toUpperCase()}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Manage Schedules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ScheduleDateToolbar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OutboundTableCard
                ferries={fromEditable}
                operators={operators}
                statuses={statuses}
                calculateETA={() => ""}
                onChange={updateSchedule}
              />
              <ReturnTableCard
                ferries={getToAnguillaEditable()}
                statuses={statuses}
                calculateETA={() => ""}
                onChange={updateSchedule}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedDate(new Date())}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                variant="default"
                disabled={isSaveDisabled}
                onClick={saveSchedules}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="secondary" onClick={() => setIsCloning(true)}>
                🗓️ Clone Schedule Pattern
              </Button>
            </div>
          </CardContent>
        </Card>

        <CloneScheduleModal
          isCloning={isCloning}
          onClose={() => setIsCloning(false)}
          isCloningLoading={isCloningLoading}
          setIsCloningLoading={setIsCloningLoading}
        />
      </div>
    </div>
  );
}
