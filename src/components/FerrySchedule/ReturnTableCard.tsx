"use client";

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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FerryItem } from "@/types/FerryItem";

type FerryWithExtras = Omit<FerryItem, "id"> & {
  id: number | string;
  meta?: { generated: boolean };
};

interface ReturnTableCardProps {
  ferries: FerryWithExtras[];
  statuses: string[];
  calculateETA: (departure: string, duration: string) => string;
  onChange: (
    index: number,
    field: keyof FerryItem,
    value: string,
    direction: FerryItem["direction"]
  ) => void;
}

export function ReturnTableCard({
  ferries,
  statuses,
  onChange,
}: ReturnTableCardProps) {
  return (
    <Card className="shadow-md border border-border bg-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-primary">
          🛳 Marigot → Blowing Point
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Auto-generated return trips from St. Martin
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className="text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Departure</TableHead>
              <TableHead>Ferry</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ferries.map((ferry, index) => (
              <TableRow key={ferry.id} className="hover:bg-accent">
                <TableCell>
                  <input
                    type="time"
                    value={ferry.departure_time}
                    disabled
                    className="border border-input rounded-md px-2 py-1 bg-muted text-muted-foreground w-full"
                  />
                </TableCell>
                <TableCell className="font-medium">{ferry.operator}</TableCell>
                <TableCell>{ferry.departure_port}</TableCell>
                <TableCell>{ferry.arrival_port}</TableCell>
                <TableCell>
                  <Select
                    value={ferry.status}
                    onValueChange={(val) =>
                      onChange(index, "status", val, "to-anguilla")
                    }
                  >
                    <SelectTrigger className="w-[120px]">
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
      </CardContent>
    </Card>
  );
}
