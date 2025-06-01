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
import { motion, AnimatePresence } from "framer-motion";
import { getFerryStatus } from "@/utils/getFerryStatus";

interface SailedFerriesTableProps {
  ferries: FerryItem[];
  localNow: Date;
}

export function SailedFerriesTable({ ferries }: SailedFerriesTableProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
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

      const depDate = new Date(now);
      depDate.setHours(depHour, depMin, 0, 0);

      const etaDate = new Date(
        depDate.getTime() + (durHour * 60 + durMin) * 60000
      );
      return { ...ferry, etaDate, depDate };
    })
    .sort((a, b) => b.etaDate.getTime() - a.etaDate.getTime());

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
        {ferriesWithETA.length > 0 ? (
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
              <AnimatePresence mode="sync">
                {ferriesWithETA.map((ferry) => {
                  const departure = ferry.departure_time
                    ? formatTime12Hour(ferry.departure_time)
                    : "—";

                  const eta = formatTime12Hour(
                    ferry.etaDate.toTimeString().substring(0, 5)
                  );

                  const direction =
                    ferry.direction === "from-anguilla"
                      ? "to-st-martin"
                      : "to-anguilla";

                  const { status, progressPercent } = getFerryStatus({
                    departureTime: ferry.departure_time,
                    direction,
                    localNow: now,
                  });

                  const showPulse = [
                    "boarding",
                    "sailing",
                    "now arriving",
                    "on the way",
                  ].includes(status.toLowerCase());
                  const rowKey =
                    typeof ferry.id === "number" && !Number.isNaN(ferry.id)
                      ? `ferry-${ferry.id}`
                      : typeof ferry.id === "string"
                      ? ferry.id
                      : `${ferry.operator || "unknown"}-${
                          ferry.departure_time || "no-time"
                        }-${ferry.direction || "no-dir"}`;

                  return (
                    <motion.tr
                      key={rowKey}
                      layout
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.3 }}
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
                            variant={getStatusVariant(status)}
                            className="inline-flex items-center gap-2 uppercase w-fit"
                          >
                            {showPulse && (
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                              </span>
                            )}
                            {status}
                          </Badge>

                          {![
                            "DOCKED",
                            "DOCKED IN AXA",
                            "ARRIVED",
                            "SAILED",
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
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        ) : (
          <div className="text-muted-foreground text-sm p-6 text-center">
            No ferries have sailed for this day.
          </div>
        )}
      </div>
    </div>
  );
}
