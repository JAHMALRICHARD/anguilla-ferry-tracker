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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FerryItem } from "@/types/FerryItem";

type FerryWithExtras = Omit<FerryItem, "id"> & {
  id: number | string;
  meta?: { generated: boolean };
};

interface OutboundTableCardProps {
  ferries: FerryWithExtras[];
  operators: string[];
  statuses: string[];
  calculateETA: (departure: string, duration: string) => string;
  onChange: (
    index: number,
    field: keyof FerryItem,
    value: string,
    direction: FerryItem["direction"]
  ) => void;
}

export function OutboundTableCard({
  ferries,
  operators,
  statuses,
  calculateETA,
  onChange,
}: OutboundTableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🛳 Blowing Point → Marigot</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Departure</TableHead>
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
                <TableCell>
                  <input
                    type="time"
                    value={ferry.departure_time.slice(0, 5)}
                    onChange={(e) =>
                      onChange(
                        index,
                        "departure_time",
                        e.target.value + ":00",
                        "from-anguilla"
                      )
                    }
                    className="border p-1 rounded-md"
                  />
                </TableCell>
                <TableCell className="w-[140px]">
                  <Select
                    value={ferry.operator}
                    onValueChange={(val) =>
                      onChange(index, "operator", val, "from-anguilla")
                    }
                  >
                    <SelectTrigger className="w-full min-w-[120px]">
                      <SelectValue placeholder="--" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="--">--</SelectItem>
                      {operators.map((op) => (
                        <SelectItem key={op} value={op}>
                          {op}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{ferry.departure_port}</TableCell>
                <TableCell>{ferry.arrival_port}</TableCell>
                <TableCell>
                  {calculateETA(ferry.departure_time, ferry.duration)}
                </TableCell>
                <TableCell>
                  <Select
                    value={ferry.status}
                    onValueChange={(val) =>
                      onChange(index, "status", val, "from-anguilla")
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
