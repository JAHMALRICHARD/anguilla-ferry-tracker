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
import { motion, AnimatePresence } from "framer-motion";

interface ScheduledFerriesTableProps {
  ferries: FerryItem[];
  onDetails: (ferry: FerryItem) => void;
}

export function ScheduledFerriesTable({
  ferries,
  onDetails,
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
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="rounded-2xl border border-border shadow-sm bg-background">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Scheduled Ferries
        </h2>
        <p className="text-sm text-muted-foreground">
          Upcoming ferry trips with estimated arrival times to St Martin.
        </p>
      </div>

      <div className="overflow-x-auto">
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
              <AnimatePresence mode="sync">
                {ferries.map((ferry) => {
                  const [hourStr, minuteStr] = ferry.departure_time.split(":");
                  const depHour = Number(hourStr);
                  const depMinute = Number(minuteStr);

                  const departure = formatTime12Hour(`${depHour}:${minuteStr}`);

                  const [durHour, durMin] = ferry.duration
                    .split(":")
                    .map(Number);
                  const totalMinutes =
                    depHour * 60 + depMinute + durHour * 60 + durMin;
                  const etaHour = Math.floor(totalMinutes / 60) % 24;
                  const etaMinute = totalMinutes % 60;
                  const eta = formatTime12Hour(
                    `${etaHour.toString().padStart(2, "0")}:${etaMinute
                      .toString()
                      .padStart(2, "0")}`
                  );

                  const status = ferry.status;
                  const showPulse = ["boarding", "sailing"].includes(
                    status.toLowerCase()
                  );

                  return (
                    <motion.tr
                      key={ferry.id}
                      layout
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => onDetails(ferry)}
                      className="cursor-pointer hover:bg-muted/50 transition even:bg-muted/10"
                    >
                      <TableCell>{departure}</TableCell>
                      <TableCell className="font-medium">
                        {ferry.operator}
                      </TableCell>
                      <TableCell>
                        {ferry.departure_port.split(",")[0]}
                      </TableCell>
                      <TableCell>{ferry.arrival_port.split(",")[0]}</TableCell>
                      <TableCell>{eta}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getBadgeVariant(status)}
                          className="inline-flex items-center gap-2 uppercase"
                        >
                          {showPulse && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                            </span>
                          )}
                          {status}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        ) : (
          <div className="text-muted-foreground p-6 text-center">
            No scheduled ferries available.
          </div>
        )}
      </div>
    </div>
  );
}
