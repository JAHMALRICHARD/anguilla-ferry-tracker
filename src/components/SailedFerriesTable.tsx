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

interface SailedFerriesTableProps {
  ferries: FerryItem[];
  localNow: Date;
}

export function SailedFerriesTable({ ferries }: SailedFerriesTableProps) {
  const [localNow, setLocalNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const ferriesWithETA = ferries
    .map((ferry) => {
      const [depHour, depMin] = ferry.departure_time
        ?.split(":")
        .map(Number) || [0, 0];
      const [durHour, durMin] = ferry.duration?.split(":").map(Number) || [
        0, 0,
      ];

      const depDate = new Date(localNow);
      depDate.setHours(depHour, depMin, 0, 0);

      const etaDate = new Date(
        depDate.getTime() + (durHour * 60 + durMin) * 60000
      );

      return { ...ferry, etaDate };
    })
    .sort((a, b) => b.etaDate.getTime() - a.etaDate.getTime());

  return (
    <div className="p-0">
      <div className="overflow-x-auto border border-border rounded-xl">
        {ferriesWithETA.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ferry</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ferriesWithETA.map((ferry) => {
                const departure = ferry.departure_time
                  ? formatTime12Hour(ferry.departure_time)
                  : "—";

                const eta = formatTime12Hour(
                  ferry.etaDate.toTimeString().substring(0, 5)
                );

                const hasSailed = ferry.etaDate.getTime() <= localNow.getTime();

                return (
                  <TableRow
                    key={ferry.id}
                    className="hover:bg-muted/50 transition"
                  >
                    <TableCell className="font-medium">
                      {ferry.operator}
                    </TableCell>
                    <TableCell>
                      {ferry.departure_port?.split(",")[0] || "—"}
                    </TableCell>
                    <TableCell>
                      {ferry.arrival_port?.split(",")[0] || "—"}
                    </TableCell>
                    <TableCell>{departure}</TableCell>
                    <TableCell>{eta}</TableCell>
                    <TableCell>
                      {hasSailed ? (
                        <Badge variant="secondary">Sailed</Badge>
                      ) : (
                        <Badge variant="outline">Sailing</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-sm p-4 text-center">
            No ferries have sailed for this day.
          </p>
        )}
      </div>
    </div>
  );
}
