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

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "outline" => {
    return status === "Sailed" ? "default" : "secondary";
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

                  const hasSailed =
                    ferry.etaDate.getTime() <= localNow.getTime();
                  const statusLabel = hasSailed ? "Sailed" : "Sailing";

                  return (
                    <motion.tr
                      key={ferry.id}
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
                        <Badge
                          variant={getStatusVariant(statusLabel)}
                          className="inline-flex items-center gap-2"
                        >
                          {statusLabel === "Sailing" && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                            </span>
                          )}
                          {statusLabel.toUpperCase()}
                        </Badge>
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
