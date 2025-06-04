"use client";

import React from "react";
import { FerryItem } from "../types/FerryProps";
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
import { Skeleton } from "@/components/ui/skeleton";
import { getFerryStatus } from "@/utils/getFerryStatus";

interface ScheduledFerriesTableProps {
  ferries: FerryItem[];
  onDetails: (ferry: FerryItem) => void;
  searchQuery: string;
  isLoading?: boolean;
}

function TableSkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="p-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-16" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-16" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-14" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-20" />
      </td>
    </tr>
  );
}

export function ScheduledFerriesTable({
  ferries,
  onDetails,
  searchQuery,
  isLoading = false,
}: ScheduledFerriesTableProps) {
  const getBadgeVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "on-time":
        return "default";
      case "delayed":
      case "cancelled":
        return "destructive";
      case "boarding":
      case "docked":
      case "sailing":
      case "now arriving":
      case "arrived":
      case "on the way":
      case "docked in axa":
        return "secondary";
      default:
        return "outline";
    }
  };

  const filteredFerries = ferries.filter((ferry) => {
    const q = searchQuery.toLowerCase();
    return (
      ferry.operator?.toLowerCase().includes(q) ||
      ferry.departure_port?.toLowerCase().includes(q) ||
      ferry.arrival_port?.toLowerCase().includes(q) ||
      ferry.vessel_name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="rounded-2xl border border-border shadow-sm bg-background">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Scheduled Ferries
        </h2>
        <p className="text-sm text-muted-foreground">
          Upcoming ferry trips with estimated arrival times
        </p>
      </div>

      <div className="overflow-x-auto">
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
            {isLoading ? (
              <>
                <TableSkeletonRow />
                <TableSkeletonRow />
                <TableSkeletonRow />
              </>
            ) : (
              filteredFerries.map((ferry, index) => {
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

                const direction =
                  ferry.direction === "from-anguilla"
                    ? "to-st-martin"
                    : "to-anguilla";

                const { status, progressPercent } = getFerryStatus({
                  scheduleDate: ferry.schedule_date,
                  departureTime: ferry.departure_time,
                  direction,
                  localNow: new Date(),
                });

                const showPulse = [
                  "boarding",
                  "sailing",
                  "on the way",
                  "now arriving",
                ].includes(status.toLowerCase());

                const safeKey = `${ferry.operator}-${ferry.departure_time}-${index}`;

                return (
                  <tr
                    key={safeKey}
                    onClick={() => onDetails(ferry)}
                    className="cursor-pointer hover:bg-muted/50 transition even:bg-muted/10"
                  >
                    <TableCell>{departure}</TableCell>
                    <TableCell className="font-medium">
                      {ferry.operator}
                    </TableCell>
                    <TableCell>{ferry.departure_port.split(",")[0]}</TableCell>
                    <TableCell>{ferry.arrival_port.split(",")[0]}</TableCell>
                    <TableCell>{eta}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={getBadgeVariant(status)}
                          className="inline-flex items-center gap-2 uppercase w-fit"
                        >
                          {showPulse && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
                            </span>
                          )}
                          {status}
                        </Badge>

                        {![
                          "SCHEDULED",
                          "DOCKED",
                          "DOCKED IN AXA",
                          "ARRIVED",
                        ].includes(status.toUpperCase()) && (
                          <div className="w-full bg-muted rounded h-1 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                status === "BOARDING"
                                  ? "bg-yellow-400"
                                  : status === "SAILING"
                                  ? "bg-blue-500"
                                  : status === "NOW ARRIVING"
                                  ? "bg-green-500"
                                  : status === "ON THE WAY"
                                  ? "bg-indigo-500"
                                  : "bg-primary"
                              }`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </tr>
                );
              })
            )}
          </TableBody>
        </Table>

        {!isLoading && filteredFerries.length === 0 && (
          <div className="text-muted-foreground p-6 text-center">
            No scheduled ferries match your search.
          </div>
        )}
      </div>
    </div>
  );
}
