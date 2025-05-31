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
  calculateETA,
  onChange,
}: ReturnTableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🛳 Marigot → Blowing Point</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Departure</TableHead>
              <TableHead className="w-[140px]">Ferry</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ferries.map((ferry, index) => (
              <TableRow key={ferry.id}>
                <TableCell className="min-w-[120px]">
                  <input
                    type="time"
                    value={ferry.departure_time}
                    disabled
                    className="border p-1 rounded-md bg-muted text-muted-foreground w-full"
                  />
                </TableCell>
                <TableCell>{ferry.operator}</TableCell>
                <TableCell>{ferry.departure_port}</TableCell>
                <TableCell>{ferry.arrival_port}</TableCell>
                <TableCell>
                  {calculateETA(ferry.departure_time, ferry.duration)}
                </TableCell>
                <TableCell>
                  <Select
                    value={ferry.status}
                    onValueChange={(val) =>
                      onChange(index, "status", val, "to-anguilla")
                    }
                  >
                    <SelectTrigger>
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
