"use client";

import React, { useEffect, useState } from "react";
import { FerryItem } from "./FerryProps";
import { formatTime12Hour } from "@/helpers/formatTime12Hour";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "./ui/skeleton";
import { getPRTime } from "@/hooks/useLiveScheduleData"; // ✅ import from correct file

interface SailedFerriesTableProps {
  ferries: FerryItem[];
  localNow: Date;
  searchQuery: string;
  selectedDate: Date;
  isLoading?: boolean;
}

function TableSkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export function SailedFerriesTable({
  ferries,
  searchQuery,
  selectedDate,
  isLoading = false,
}: SailedFerriesTableProps) {
  const isToday = selectedDate.toDateString() === getPRTime().toDateString(); // ✅ PR time comparison

  const [now, setNow] = useState<Date>(() =>
    isToday
      ? getPRTime()
      : new Date(`${selectedDate.toISOString().split("T")[0]}T12:00:00`)
  );

  useEffect(() => {
    if (!isToday) return;
    const interval = setInterval(() => setNow(getPRTime()), 60000);
    return () => clearInterval(interval);
  }, [isToday]);

  const ferriesWithETA = ferries
    .map((ferry) => {
      const [depHour, depMin] = ferry.departure_time
        ?.split(":")
        .map(Number) || [0, 0];
      const [durHour, durMin] = (ferry.duration || "00:30")
        .split(":")
        .map(Number);

      const depDate = new Date(`${ferry.schedule_date}T00:00:00`);
      depDate.setHours(depHour, depMin, 0, 0);

      const etaDate = new Date(
        depDate.getTime() + (durHour * 60 + durMin) * 60000
      );

      let liveStatus: "SAILED" | "SAILING" | "ARRIVED" = "SAILED";

      if (isToday) {
        const nowTime = now.getTime();
        if (nowTime >= depDate.getTime() && nowTime < etaDate.getTime()) {
          liveStatus = "SAILING";
        } else if (
          nowTime >= etaDate.getTime() &&
          nowTime < etaDate.getTime() + 5 * 60 * 1000
        ) {
          liveStatus = "ARRIVED";
        }
      }

      let progressPercent = 100;
      if (liveStatus === "SAILING") {
        const elapsedMs = now.getTime() - depDate.getTime();
        const durationMs = etaDate.getTime() - depDate.getTime();
        progressPercent = Math.min(
          100,
          Math.max(0, (elapsedMs / durationMs) * 100)
        );
      }

      return {
        ...ferry,
        etaDate,
        depDate,
        liveStatus,
        progressPercent,
      };
    })
    .sort((a, b) => b.etaDate.getTime() - a.etaDate.getTime());

  const filteredFerries = ferriesWithETA.filter((ferry) => {
    const query = searchQuery.toLowerCase();
    return (
      ferry.operator?.toLowerCase().includes(query) ||
      ferry.departure_port?.toLowerCase().includes(query) ||
      ferry.arrival_port?.toLowerCase().includes(query)
    );
  });

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "outline" => {
    return ["SAILED", "ARRIVED"].includes(status.toUpperCase())
      ? "default"
      : "secondary";
  };

  return (
    <div className="rounded-2xl border border-border shadow-sm bg-background">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Sailed Ferries
        </h2>
        <p className="text-sm text-muted-foreground">
          Recently completed ferry trips with estimated arrival times.
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Departure</TableHead>
              <TableHead className="w-[160px]">Ferry</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableSkeletonRow key={i} />
              ))
            ) : filteredFerries.length > 0 ? (
              filteredFerries.map((ferry) => {
                const departure = formatTime12Hour(ferry.departure_time);
                const eta = formatTime12Hour(
                  ferry.etaDate.toTimeString().substring(0, 5)
                );
                const rowKey =
                  ferry.id ||
                  `${ferry.operator}-${ferry.departure_time}-${ferry.schedule_date}`;

                return (
                  <TableRow
                    key={rowKey}
                    className="hover:bg-muted/50 transition even:bg-muted/10"
                  >
                    <TableCell>{departure}</TableCell>
                    <TableCell className="font-medium">
                      {ferry.operator || "—"}
                    </TableCell>
                    <TableCell>
                      {ferry.departure_port?.split(",")[0] || "—"}
                    </TableCell>
                    <TableCell>
                      {ferry.arrival_port?.split(",")[0] || "—"}
                    </TableCell>
                    <TableCell>{eta}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={
                            ferry.liveStatus === "SAILING"
                              ? "outline"
                              : getStatusVariant(ferry.liveStatus)
                          }
                          className={`inline-flex items-center gap-2 uppercase w-fit ${
                            ferry.liveStatus === "SAILING"
                              ? "text-blue-600 border-blue-600"
                              : ""
                          }`}
                        >
                          {ferry.liveStatus === "SAILING" && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                            </span>
                          )}
                          {ferry.liveStatus}
                        </Badge>

                        {ferry.liveStatus === "SAILING" && (
                          <div className="w-full bg-muted rounded h-1 overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${ferry.progressPercent}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground p-6"
                >
                  No ferries have sailed for this day.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
