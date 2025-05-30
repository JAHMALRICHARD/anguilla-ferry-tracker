"use client";

import React from "react";
import { FerryItem } from "./FerryProps";
import { formatTime12Hour } from "@/helpers/formatTime12Hour";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ScheduledFerriesTableProps {
  ferries: FerryItem[];
  onDetails: (ferry: FerryItem) => void;
}

export function ScheduledFerriesTable({
  ferries,
  onDetails,
}: ScheduledFerriesTableProps) {
  return (
    <div className="p-0">
      <div className="overflow-x-auto border border-border rounded-xl">
        {ferries.length > 0 ? (
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
              {ferries.map((ferry) => {
                const [hourStr, minuteStr] = ferry.departure_time.split(":");
                const depHour = Number(hourStr);
                const depMinute = Number(minuteStr);

                const departure = formatTime12Hour(`${depHour}:${minuteStr}`);

                const [durHour, durMin] = ferry.duration.split(":").map(Number);
                const totalMinutes =
                  depHour * 60 + depMinute + durHour * 60 + durMin;
                const etaHour = Math.floor(totalMinutes / 60) % 24;
                const etaMinute = totalMinutes % 60;
                const eta = formatTime12Hour(
                  `${etaHour.toString().padStart(2, "0")}:${etaMinute
                    .toString()
                    .padStart(2, "0")}`
                );

                const getStatusClass = (status: string) => {
                  switch (status.toLowerCase()) {
                    case "on-time":
                      return "bg-green-600 text-white";
                    case "delayed":
                      return "bg-red-600 text-white";
                    case "cancelled":
                      return "bg-gray-600 text-white border border-gray-400";
                    case "boarding":
                      return "bg-yellow-500 text-black";
                    case "docked":
                      return "bg-blue-500 text-white";
                    case "sailing":
                      return "bg-indigo-600 text-white";
                    default:
                      return "bg-muted text-foreground";
                  }
                };

                return (
                  <TableRow
                    key={ferry.id}
                    onClick={() => onDetails(ferry)}
                    className="cursor-pointer hover:bg-muted/50 transition"
                  >
                    <TableCell>{departure}</TableCell>
                    <TableCell className="font-medium">
                      {ferry.operator}
                    </TableCell>
                    <TableCell>{ferry.departure_port.split(",")[0]}</TableCell>
                    <TableCell>{ferry.arrival_port.split(",")[0]}</TableCell>
                    <TableCell>{eta}</TableCell>
                    <TableCell>
                      <Badge
                        className={`uppercase ${getStatusClass(ferry.status)}`}
                      >
                        {ferry.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-muted-foreground p-4 text-center">
            No scheduled ferries available.
          </div>
        )}
      </div>
    </div>
  );
}
