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
  onChange,
}: OutboundTableCardProps) {
  return (
    <Card className="shadow-md border border-border bg-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-primary">
          🛳 Blowing Point → Marigot
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage outbound trips from Anguilla to St. Martin
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className="text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Departure</TableHead>
              <TableHead className="w-[160px]">Ferry</TableHead>
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
                    value={ferry.departure_time.slice(0, 5)}
                    onChange={(e) =>
                      onChange(
                        index,
                        "departure_time",
                        e.target.value + ":00",
                        "from-anguilla"
                      )
                    }
                    className="border border-input rounded-md px-2 py-1 bg-background text-foreground"
                  />
                </TableCell>
                <TableCell className="w-[160px]">
                  <Select
                    value={ferry.operator}
                    onValueChange={(val) =>
                      onChange(index, "operator", val, "from-anguilla")
                    }
                  >
                    <SelectTrigger className="w-full min-w-[140px]">
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
                  <Select
                    value={ferry.status}
                    onValueChange={(val) =>
                      onChange(index, "status", val, "from-anguilla")
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
