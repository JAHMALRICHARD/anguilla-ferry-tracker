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

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<FerryItem[]>([]);

  const { operators, departurePorts, arrivalPorts, statuses } =
    useDropdownOptions();

  const today = new Date();
  const tomorrow = addDays(today, 1);

  const fetchSchedules = async (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const { data, error } = await supabase
      .from("ferry_schedules")
      .select("*")
      .eq("schedule_date", formattedDate);

    if (!error && data) setSchedules(data);
    else console.error("Fetch error:", error);
  };

  useEffect(() => {
    fetchSchedules(selectedDate);
  }, [selectedDate]);

  const updateSchedule = (index: number, field: string, value: string) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

  const calculateETA = (departure: string, duration: string): string => {
    const [depHour, depMin] = departure.split(":").map(Number);
    const [durHour, durMin] = duration.split(":").map(Number);
    const etaDate = new Date();
    etaDate.setHours(depHour + durHour, depMin + durMin);
    return format(etaDate, "HH:mm");
  };

  const saveSchedules = async () => {
    const updates = schedules.map(({ ...rest }) => ({ ...rest }));
    const { error } = await supabase.from("ferry_schedules").upsert(updates);
    if (error) console.error("Save error:", error);
    else alert("Schedules updated!");
  };

  return (
    <div className="p-6 space-y-4 max-w-screen-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Ferry Schedule Editor
            <Button variant="default" onClick={saveSchedules}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 bg-background border rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
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
            </div>

            <div className="flex space-x-2">
              <Button
                variant={
                  selectedDate.toDateString() === today.toDateString()
                    ? "default"
                    : "secondary"
                }
                onClick={() => setSelectedDate(today)}
                className="flex items-center gap-2"
              >
                <CalendarDays className="w-4 h-4" />
                Today
              </Button>
              <Button
                variant={
                  selectedDate.toDateString() === tomorrow.toDateString()
                    ? "default"
                    : "secondary"
                }
                onClick={() => setSelectedDate(tomorrow)}
                className="flex items-center gap-2"
              >
                <CalendarDays className="w-4 h-4" />
                Tomorrow
              </Button>
            </div>
          </div>

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
              {schedules.map((schedule, index) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <input
                      type="time"
                      value={schedule.departure_time.slice(0, 5)}
                      onChange={(e) =>
                        updateSchedule(
                          index,
                          "departure_time",
                          e.target.value + ":00"
                        )
                      }
                      className="border p-1 rounded-md"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={schedule.operator}
                      onValueChange={(value) =>
                        updateSchedule(index, "operator", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Ferry" />
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
                  <TableCell>
                    <Select
                      value={schedule.departure_port}
                      onValueChange={(value) =>
                        updateSchedule(index, "departure_port", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Origin" />
                      </SelectTrigger>
                      <SelectContent>
                        {departurePorts.map((port) => (
                          <SelectItem key={port} value={port}>
                            {port}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={schedule.arrival_port}
                      onValueChange={(value) =>
                        updateSchedule(index, "arrival_port", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {arrivalPorts.map((port) => (
                          <SelectItem key={port} value={port}>
                            {port}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {calculateETA(schedule.departure_time, schedule.duration)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={schedule.status}
                      onValueChange={(value) =>
                        updateSchedule(index, "status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((st) => (
                          <SelectItem key={st} value={st}>
                            {st}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => fetchSchedules(selectedDate)}
            >
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
