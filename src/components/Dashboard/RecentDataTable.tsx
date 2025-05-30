import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const recentData = [
  {
    id: "1",
    type: "Sensor Reading",
    source: "iot-device-001@sensors.com",
    timestamp: "2024-01-15 14:30:22",
    status: "processed",
    records: 1,
  },
  {
    id: "2",
    type: "Sales Report",
    source: "agent.smith@company.com",
    timestamp: "2024-01-15 14:25:18",
    status: "processed",
    records: 15,
  },
  {
    id: "3",
    type: "CSV Upload",
    source: "data.team@company.com",
    timestamp: "2024-01-15 14:20:45",
    status: "processing",
    records: 234,
  },
  {
    id: "4",
    type: "Temperature Log",
    source: "hvac-system@building.com",
    timestamp: "2024-01-15 14:15:33",
    status: "processed",
    records: 1,
  },
  {
    id: "5",
    type: "Inventory Count",
    source: "warehouse@company.com",
    timestamp: "2024-01-15 14:10:12",
    status: "failed",
    records: 0,
  },
];

export function RecentDataTable() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Data Entries</CardTitle>
        <CardDescription>
          Latest data processed from email submissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Records</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentData.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.type}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {entry.source}
                </TableCell>
                <TableCell className="text-sm">{entry.timestamp}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      entry.status === "processed"
                        ? "default"
                        : entry.status === "processing"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {entry.status}
                  </Badge>
                </TableCell>
                <TableCell>{entry.records}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Reprocess</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
