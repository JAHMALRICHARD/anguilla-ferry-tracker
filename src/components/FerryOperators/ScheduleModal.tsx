"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

interface Schedule {
  id: string;
  departure_port: string;
  arrival_port: string;
  departure_time: string;
  duration: string;
  status: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  schedules: Schedule[];
  operatorName: string;
}

function formatTimeTo12Hour(time: string) {
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minuteStr} ${ampm}`;
}

export function ScheduleModal({
  open,
  onClose,
  schedules,
  operatorName,
}: Props) {
  const toAnguilla = schedules.filter(
    (f) => f.arrival_port === "Blowing Point, Anguilla"
  );

  const toStMaarten = schedules.filter(
    (f) => f.arrival_port === "Airport, St. Maarten"
  );

  const renderSchedule = (
    direction: string,
    color: string,
    data: Schedule[]
  ) => (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-2">
        <CalendarIcon className={`w-5 h-5 ${color}`} />
        <div>
          <h3 className="text-xl font-semibold">Ferry Schedule: {direction}</h3>
          <p className="text-muted-foreground">
            Departures heading to {direction}
          </p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border shadow-sm">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Departure</th>
                <th className="px-4 py-3 whitespace-nowrap">From</th>
                <th className="px-4 py-3 whitespace-nowrap">To</th>
                <th className="px-4 py-3 whitespace-nowrap">Duration</th>
                <th className="px-4 py-3 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((ferry) => (
                <tr
                  key={ferry.id}
                  className="border-t border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    {formatTimeTo12Hour(ferry.departure_time)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {ferry.departure_port}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {ferry.arrival_port}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {ferry.duration}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {ferry.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic mt-2">
          No departures found for this route.
        </p>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[1400px] max-h-[90vh] overflow-y-auto px-8 py-8 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {operatorName} – Full Schedule
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View all scheduled departures by destination.
          </DialogDescription>
        </DialogHeader>

        {renderSchedule("St. Maarten", "text-blue-600", toStMaarten)}
        {renderSchedule("Anguilla", "text-green-600", toAnguilla)}

        <div className="text-right mt-6">
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
