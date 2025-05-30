import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Paperclip, AlertCircle, CheckCircle } from "lucide-react";

const emailLogs = [
  {
    id: "1",
    from: "iot-device-001@sensors.com",
    subject: "Temperature Reading: 24.5°C",
    timestamp: "14:30",
    hasAttachment: false,
    status: "success",
    preview: "Metric: Temperature, Value: 24.5, Unit: Celsius",
  },
  {
    id: "2",
    from: "agent.smith@company.com",
    subject: "Weekly Sales Report",
    timestamp: "14:25",
    hasAttachment: true,
    status: "success",
    preview: "sales_report_week_3.csv (15 records)",
  },
  {
    id: "3",
    from: "data.team@company.com",
    subject: "Bulk Data Import",
    timestamp: "14:20",
    hasAttachment: true,
    status: "processing",
    preview: "inventory_data.csv (234 records)",
  },
  {
    id: "4",
    from: "hvac-system@building.com",
    subject: "HVAC Status Update",
    timestamp: "14:15",
    hasAttachment: false,
    status: "success",
    preview: "Metric: HVAC_Status, Value: Normal, Zone: A1",
  },
  {
    id: "5",
    from: "warehouse@company.com",
    subject: "Inventory Count Error",
    timestamp: "14:10",
    hasAttachment: true,
    status: "error",
    preview: "Failed to parse CSV: Invalid format",
  },
];

export function EmailLogsCard() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Email Processing Log</CardTitle>
        <CardDescription>Real-time email processing status</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {emailLogs.map((email) => (
              <div
                key={email.id}
                className="flex items-start space-x-3 p-3 rounded-lg border"
              >
                <div className="flex-shrink-0">
                  <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {email.subject}
                    </p>
                    <div className="flex items-center space-x-2">
                      {email.hasAttachment && (
                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                      )}
                      {email.status === "success" && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                      {email.status === "error" && (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      )}
                      {email.status === "processing" && (
                        <div className="h-3 w-3 bg-yellow-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    From: {email.from}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {email.preview}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {email.timestamp}
                    </span>
                    <Badge
                      variant={
                        email.status === "success"
                          ? "default"
                          : email.status === "processing"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {email.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            View All Email Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
