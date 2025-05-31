"use client";

import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { Save, X, CalendarDays } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { FerryItem } from "@/types/FerryItem";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useDropdownOptions } from "@/hooks/useDropdownOptions";

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

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState<FerryItem[]>([]);
  const { operators, statuses } = useDropdownOptions();

  const [fallbackEditsByDate, setFallbackEditsByDate] = useState<{
    [date: string]: FerryWithExtras[];
  }>({});

  useEffect(() => {
    localStorage.setItem("fallbackCache", JSON.stringify(fallbackEditsByDate));
  }, [fallbackEditsByDate]);

  useEffect(() => {
    const fromStorage = localStorage.getItem("fallbackCache");
    if (fromStorage) {
      setFallbackEditsByDate(JSON.parse(fromStorage));
    }
  }, []);

  const today = new Date();
  const tomorrow = addDays(today, 1);

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
    else console.error("Fetch error:", error);
  };

  const updateSchedule = (
    index: number,
    field: string,
    value: string,
    direction: string
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

    // 🔁 Keep fallback editing in sync for from-anguilla (important!)
    if (direction === "from-anguilla") {
      setFromEditable((prev) => {
        const copy = [...prev];
        if (copy[index]) {
          copy[index] = { ...copy[index], [field]: value };
        }

        // Save this edit to fallback cache by date
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

    // ✅ Fallback logic: if none from DB, use generated
    if (outbound.length === 0) {
      // ✅ If cached fallback edits exist for this date, use them
      if (fallbackEditsByDate[dateKey]) {
        setFromEditable(fallbackEditsByDate[dateKey]);
      } else {
        const fallback = defaultDepartureTimes.map((time) => ({
          id: crypto.randomUUID(),
          operator: "--",
          departure_time: time,
          duration: "00:30:00",
          status: "scheduled" as FerryItem["status"],
          departure_port: "Blowing Point, Anguilla",
          arrival_port: "Marigot, St. Martin",
          direction: "from-anguilla",
          schedule_date: dateKey,
          vessel_name: null,
          price: "30.00",
          logo_url: "",
          meta: { generated: true },
        }));

        setFromEditable(fallback);
      }
    } else {
      setFromEditable(outbound);
    }
  }, [schedules, selectedDate, fallbackEditsByDate]);

  const calculateETA = (departure: string, duration: string): string => {
    const [depHour, depMin] = departure.split(":").map(Number);
    const [durHour, durMin] = duration.split(":").map(Number);
    const eta = new Date();
    eta.setHours(depHour + durHour);
    eta.setMinutes(depMin + durMin);
    return format(eta, "HH:mm");
  };

  const saveSchedules = async () => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    const outboundTrips = schedules
      .filter((s) => s.direction === "from-anguilla")
      .sort((a, b) => a.departure_time.localeCompare(b.departure_time));

    const existingReturnKeys = new Set(
      schedules
        .filter((s) => s.direction === "to-anguilla")
        .map((s) => `${s.operator}_${s.departure_time}`)
    );

    const returnTrips: FerryItem[] = outboundTrips.flatMap(
      (outbound, index) => {
        const returnTime = marigotReturnTimes[index] || "00:00";
        const returnKey = `${outbound.operator}_${returnTime}`;
        if (existingReturnKeys.has(returnKey)) return [];

        return [
          {
            id: crypto.randomUUID(),
            operator: outbound.operator,
            departure_time: returnTime,
            duration: "00:30:00",
            status: "scheduled" as FerryItem["status"],
            departure_port: "Marigot, St. Martin",
            arrival_port: "Blowing Point, Anguilla",
            direction: "to-anguilla",
            schedule_date: formattedDate,
            vessel_name: outbound.vessel_name || null,
            price: outbound.price || "30.00",
            logo_url: outbound.logo_url || "",
          },
        ];
      }
    );

    const outboundUpdates = schedules.map((s) => ({
      ...s,
      duration: "00:30:00",
    }));

    const fullUpdates = [...outboundUpdates, ...returnTrips];

    const { error } = await supabase
      .from("ferry_schedules")
      .upsert(fullUpdates);

    if (error) {
      console.error("Save error:", error);
      alert("❌ Failed to save schedules. Check the console.");
    } else {
      alert("✅ Schedules (including return trips) saved successfully!");
    }
  };

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

  const [fromEditable, setFromEditable] = useState<FerryWithExtras[]>([]);

  const fromAnguillaFallback: FerryWithExtras[] = defaultDepartureTimes.map(
    (time) => ({
      id: crypto.randomUUID(),
      operator: "--",
      departure_time: time,
      duration: "00:30:00",
      status: "scheduled",
      departure_port: "Blowing Point, Anguilla",
      arrival_port: "Marigot, St. Martin",
      direction: "from-anguilla",
      schedule_date: format(selectedDate, "yyyy-MM-dd"),
      vessel_name: null,
      price: "30.00",
      logo_url: "",
      meta: { generated: true },
    })
  );

  const fromAnguillaEditable =
    fromEditable.length > 0 ? fromEditable : fromAnguillaFallback;

  const getToAnguillaEditable = (): FerryWithExtras[] => {
    return fromAnguillaEditable.map((outbound, i) => {
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
          status: outbound.status as FerryItem["status"],
          schedule_date: format(selectedDate, "yyyy-MM-dd"),
          vessel_name: outbound.vessel_name || null,
          price: outbound.price || "30.00",
          logo_url: outbound.logo_url || "",
          meta: { generated: true },
        }
      );
    });
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-full px-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Ferry Schedule Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 border rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between shadow-sm">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[200px] justify-start text-left"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <div className="flex gap-2">
                <Button
                  variant={
                    selectedDate.toDateString() === today.toDateString()
                      ? "default"
                      : "secondary"
                  }
                  onClick={() => setSelectedDate(today)}
                >
                  Today
                </Button>
                <Button
                  variant={
                    selectedDate.toDateString() === tomorrow.toDateString()
                      ? "default"
                      : "secondary"
                  }
                  onClick={() => setSelectedDate(tomorrow)}
                >
                  Tomorrow
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Outbound Table */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  🛳 Blowing Point → Marigot
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Departure</TableHead>
                      <TableHead>Ferry</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fromAnguillaEditable.map((ferry, index) => (
                      <TableRow key={ferry.id}>
                        <TableCell>
                          <input
                            type="time"
                            value={ferry.departure_time.slice(0, 5)}
                            onChange={(e) =>
                              updateSchedule(
                                index,
                                "departure_time",
                                e.target.value + ":00",
                                "from-anguilla"
                              )
                            }
                            className="border p-1 rounded-md"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={ferry.operator}
                            onValueChange={(val) =>
                              updateSchedule(
                                index,
                                "operator",
                                val,
                                "from-anguilla"
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {operators.map((op) => (
                                <SelectItem key={op} value={op}>
                                  {op}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{ferry.departure_port}</TableCell>
                        <TableCell>{ferry.arrival_port}</TableCell>
                        <TableCell>
                          {calculateETA(ferry.departure_time, ferry.duration)}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={ferry.status}
                            onValueChange={(val) =>
                              updateSchedule(
                                index,
                                "status",
                                val,
                                "from-anguilla"
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statuses.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Return Table */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  🛳 Marigot → Blowing Point
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Departure</TableHead>
                      <TableHead>Ferry</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getToAnguillaEditable().map((ferry, index) => (
                      <TableRow key={ferry.id}>
                        <TableCell className="min-w-[120px]">
                          <input
                            type="time"
                            value={ferry.departure_time}
                            disabled
                            className="border p-1 rounded-md bg-muted text-muted-foreground w-full"
                          />
                        </TableCell>
                        <TableCell>{ferry.operator}</TableCell>
                        <TableCell>{ferry.departure_port}</TableCell>
                        <TableCell>{ferry.arrival_port}</TableCell>
                        <TableCell>
                          {calculateETA(ferry.departure_time, ferry.duration)}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={ferry.status}
                            onValueChange={(val) =>
                              updateSchedule(
                                index,
                                "status",
                                val,
                                "to-anguilla"
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statuses.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
